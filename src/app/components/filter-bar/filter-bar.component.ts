import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterConfig } from '../../models/filter-config';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { skip } from 'rxjs';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInput,
    MatSelect,
    MatCheckbox,
    MatButton,
    MatRadioGroup,
    MatRadioButton,
    MatOption,
    MatCheckbox,
    MatButtonModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  @Input() initialValue: Partial<any> | null = null;

  @Input() configs: FilterConfig[] = [];
  // @Input() initialValue: Record<string, any> = {};
  @Output() filterChanged = new EventEmitter<any>();
  @Output() ClearFilter = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    const group: any = {};
    this.configs.forEach((f) => {
      group[f.key] = [f.type === 'checkbox' ? false : null]; // default values
    });
    this.form = this.fb.group(group);
    this.form.valueChanges.pipe(skip(1)).subscribe((value) => {
      this.filterChanged.emit(value);
    });
  }
  onApply(): void {
    this.filterChanged.emit(this.form.value);
  }
  onClear(): void {
    this.form.reset();
    this.filterChanged.emit({});
    this.ClearFilter.emit();
  }
}
