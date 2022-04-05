import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FilterControlsOptions } from '../filter-controls-options';

@Component({
  selector: 'app-checkbox-select',
  templateUrl: './checkbox-select.component.html',
  styleUrls: ['./checkbox-select.component.scss'],
})
export class CheckboxSelectComponent implements OnInit {
  @Input() filter!: FilterControlsOptions;
  @Input() form!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm(this.filter);
  }

  /**
   * Creates a form array containing each option provided
   */
  private createForm(controls: FilterControlsOptions) {
    let formEntries = this._formBuilder.array([]);

    for (let entry of controls.options) {
      const formSlection = this._formBuilder.control(false);
      formEntries.push(formSlection);
    }

    this.form.addControl(this.filter.key, formEntries);
  }

  get selectionFormArray() {
    return this.form.controls[this.filter.key] as FormArray;
  }

  /**
   * Adds/ removes the key value to the form array, so it is available in the form.value
   * @param checkBoxEvent
   */
  onCheckboxChange(checkBoxEvent: MatCheckboxChange) {
    if (checkBoxEvent.checked) {
      this.selectionFormArray.push(new FormControl(checkBoxEvent.source.value));
    } else {
      for (
        let index = 0;
        index < this.selectionFormArray.controls.length;
        index++
      ) {
        const item = this.selectionFormArray.controls[index];
        if (item.value == checkBoxEvent.source.value) {
          this.selectionFormArray.removeAt(index);
        }
      }
    }
  }
}
