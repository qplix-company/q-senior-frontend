import { Type } from '@angular/core';
import { InputComponentsEnum } from '../inputs/input-components.enum';
import { TextInputComponent } from '../inputs/text-input.component';
import { SelectInputComponent } from '../inputs/select-input.component';
import { CheckboxInputComponent } from '../inputs/checkbox-input.component';

export function getInputComponent(type?: InputComponentsEnum): Type<any> {
  const mapping = {
    [InputComponentsEnum.Text]: TextInputComponent,
    [InputComponentsEnum.Select]: SelectInputComponent,
    [InputComponentsEnum.Checkbox]: CheckboxInputComponent,
  };

  return type && mapping[type] ? mapping[type] : TextInputComponent;
}
