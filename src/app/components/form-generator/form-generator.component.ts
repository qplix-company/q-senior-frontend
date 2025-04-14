import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormInput } from '../../models/form';
import { getInputComponent } from '../shared/get-input-component';
import { InputComponentsEnum } from '../inputs/input-components.enum';

@Component({
  selector: 'form-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormGeneratorComponent implements OnInit {
  @Input() inputs: FormInput[] = [];
  @Output() onChangeInput = new EventEmitter<any>();
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const controls = this.inputs.reduce((acc, input) => {
      acc[input.name] = new FormControl(null);
      return acc;
    }, {} as Record<string, FormControl>);

    this.form = this.fb.group(controls);

    this.form.valueChanges.subscribe((val) => {
      this.onChangeInput.emit(val);
    });
  }

  getInputComponent(type?: InputComponentsEnum) {
    return getInputComponent(type);
  }

  createInputs(input: FormInput): Record<string, any> {
    const props: Record<string, any> = {
      control: this.form.get(input.name),
      label: input.label,
      ...input.props,
    };

    if (input.type === InputComponentsEnum.Select) {
      props['options'] = input.options || [];
    }

    return props;
  }
}
