import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { FilterFieldConfig, FilterValue } from '../../models/filter-field';

const FILTER_DEBOUNCE_MS = 300;

/** Renders a reactive form from field config and emits a plain FilterValue on change. */
@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) fields: FilterFieldConfig[] = [];
  @Output() filterChange = new EventEmitter<FilterValue>();

  private readonly formBuilder = inject(FormBuilder);
  protected form: FormGroup = this.formBuilder.group({});
  private valueChangesSubscription?: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.rebuildForm();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  protected hasValue(field: FilterFieldConfig): boolean {
    const controlValue = this.form.get(field.key)?.value;

    if (controlValue === null || controlValue === undefined) {
      return false;
    }

    if (typeof controlValue === 'string') {
      return controlValue.trim().length > 0;
    }

    if (Array.isArray(controlValue)) {
      return controlValue.length > 0;
    }

    return true;
  }

  protected clearField(field: FilterFieldConfig): void {
    const defaultValue = this.defaultValueFor(field);
    this.form.get(field.key)?.setValue(defaultValue);
  }

  protected clearAll(): void {
    this.form.reset(this.createDefaultsMap());
  }

  private rebuildForm(): void {
    this.unsubscribeFromValueChanges();

    this.form = this.formBuilder.group(this.createDefaultsMap());

    this.valueChangesSubscription = this.form.valueChanges
      .pipe(
        debounceTime(FILTER_DEBOUNCE_MS),
        distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current))
      )
      .subscribe((rawValue) => {
        if (this.hasTextBelowMinLength(rawValue)) {
          return;
        }

        const emittedFilter = this.toFilterValue(rawValue);
        this.filterChange.emit(emittedFilter);
      });
  }

  private hasTextBelowMinLength(rawValue: Record<string, unknown>): boolean {
    for (const field of this.fields) {
      if (field.type !== 'text' || field.minLength === undefined) {
        continue;
      }

      const value = rawValue[field.key];
      if (typeof value !== 'string') {
        continue;
      }

      const trimmed = value.trim();
      if (trimmed.length > 0 && trimmed.length < field.minLength) {
        return true;
      }
    }

    return false;
  }

  private unsubscribeFromValueChanges(): void {
    this.valueChangesSubscription?.unsubscribe();
  }

  private createDefaultsMap(): Record<string, unknown> {
    const defaults: Record<string, unknown> = {};

    for (const field of this.fields) {
      defaults[field.key] = this.defaultValueFor(field);
    }

    return defaults;
  }

  private defaultValueFor(field: FilterFieldConfig): unknown {
    switch (field.type) {
      case 'multi-select':
        return [];
      case 'boolean':
        return null;
      case 'text':
      default:
        return '';
    }
  }

  /** Drops fields that are empty or below the configured text minimum, so the backend only sees meaningful values. */
  private toFilterValue(rawValue: Record<string, unknown>): FilterValue {
    const result: FilterValue = {};

    for (const field of this.fields) {
      const value = rawValue[field.key];

      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();

        if (trimmed.length === 0) {
          continue;
        }

        if (field.minLength && trimmed.length < field.minLength) {
          continue;
        }

        result[field.key] = trimmed;
        continue;
      }

      if (Array.isArray(value) && value.length === 0) {
        continue;
      }

      result[field.key] = value;
    }

    return result;
  }
}
