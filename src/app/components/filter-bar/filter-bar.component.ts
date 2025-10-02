import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FilterField } from '../../models/filter-config';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

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
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  @Input() fields: FilterField<any>[] = [];
  @Input() initialValue: Partial<any> | null = null;
  @Output() filterChanged = new EventEmitter<any>();
  @Output() clearFilterChanged = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    const group: any = {};
    this.fields.forEach((f) => {
      group[f.key] = [f.type === 'checkbox' ? true : null]; // default values
    });
    this.form = this.fb.group(group);
  }
  onApplyFilterClicked() {
    let data = this.form.value;
    this.filterChanged.emit(data);
  }
  onClearFilterClicked() {
    const resetValue = {
      name: '',
      types: [],
      currencies: [],
      isPrivate: false,
    };

    this.form.reset(resetValue);
    this.filterChanged.emit(resetValue);
  }
}
