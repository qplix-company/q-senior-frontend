import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import { FormInput } from '../../models/form';
import {
  createFieldStreams,
  getInputComponent,
} from '../../helpers/formHelper';
import { InputComponentsEnum } from '../../constants/form';
import { merge } from 'rxjs';
import { filtersContext } from '../../contexts/filtersContext';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'form-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButton],
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormGeneratorComponent implements OnInit {
  @Input() inputs: FormInput[] = [];
  @Input() values: any = {};

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.initWatchers();
  }

  private initForm(): void {
    const controls = this.inputs.reduce((acc: any, input) => {
      acc[input.name] = new FormControl(this.values[input.name]);
      return acc;
    }, {});
    this.form = this.formBuilder.group(controls);
  }

  getInputComponent(type?: InputComponentsEnum) {
    return getInputComponent(type);
  }

  getInputComponentProps(input: FormInput): Record<string, any> {
    return {
      control: this.form.get(input.name),
      label: input.label,
      ...(input.props || {}),
    };
  }

  private initWatchers(): void {
    const debouncedFields = this.inputs
      .filter(
        (i) => i.debounced === true || i.component === InputComponentsEnum.Text
      )
      .map((i) => i.name);

    const { debounced$, immediate$ } = createFieldStreams(
      this.form.controls,
      debouncedFields
    );

    merge(...debounced$, ...immediate$).subscribe(() => {
      filtersContext.next(this.form.getRawValue());
    });
  }
  resetFilters(): void {
    const form = this.form;
    if (!form) return;

    form.reset();
  }
}
