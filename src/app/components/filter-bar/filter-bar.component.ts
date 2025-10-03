import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterField } from '../../models/filter-config';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
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
    MatButtonModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  @Input() fields: FilterField<any>[] = [];
  @Input() initialValue: Partial<any> | null = null;
  @Output() filterChanged = new EventEmitter<any>();
  @Output() ClearFilter = new EventEmitter<any>();
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
  onApply() {
    let data = this.form.value;
    this.filterChanged.emit(data);
  }
  onClear() {
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
