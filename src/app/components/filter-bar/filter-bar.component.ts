import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SHARED_IMPORTS } from '../../shared/mat-imports';
import { FilterField, FilterFieldOption } from '../../models/filter-definition';

@Component({
  selector: 'filter-bar',
  standalone: true,
  imports: SHARED_IMPORTS,
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent implements OnInit, OnChanges {
  @Input() fields: FilterField[] = [];
  @Output() filterChange = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fields']) {
      this.buildForm();
    }
  }

  private buildForm() {
    const group: any = {};
    (this.fields || []).forEach((f) => {
      group[f.key] = [this.getInitialValue(f)];
    });
    this.form = this.fb.group(group);
    this.emitClean(this.form.value);
  }

  onSubmit() {
    this.emitClean(this.form.value);
  }

  onReset() {
    (this.fields || []).forEach((f) => {
      const ctrl = this.form.get(f.key);
      if (!ctrl) return;
      ctrl.setValue(this.getInitialValue(f));
    });
    this.emitClean(this.form.value);
  }

  private getInitialValue(field: FilterField) {
    if (field?.value !== undefined) return field.value;
    switch (field.type) {
      case 'multiselect':
        return [];
      case 'checkbox':
      case 'boolean':
        return false;
      case 'select':
        return null;
      default:
        return '';
    }
  }

  private emitClean(raw: any) {
    const cleaned: any = {};
    for (const k of Object.keys(raw || {})) {
      const v = raw[k];
      if (v === null || v === undefined) continue;
      if (typeof v === 'string' && v.trim() === '') continue;
      if (Array.isArray(v) && v.length === 0) continue;
      cleaned[k] = v;
    }
    this.filterChange.emit(cleaned);
  }

  getOptionLabel(opt: FilterFieldOption | string): string {
    return typeof opt === 'string' ? opt : opt.label;
  }

  getOptionValue(opt: FilterFieldOption | string) {
    return typeof opt === 'string' ? opt : opt.value;
  }
}
