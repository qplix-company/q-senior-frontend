import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterControlBase } from '../filter-controls-base';
import { FilterControlsOptions } from '../filter-controls-options';

@Component({
  selector: 'app-radio-select',
  templateUrl: './radio-select.component.html',
  styleUrls: ['./radio-select.component.scss'],
})
export class RadioSelectComponent implements OnInit {
  @Input() filter!: FilterControlsOptions;
  @Input() form!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm(this.filter);
  }

  createForm(controls: FilterControlBase) {
    this.form.addControl(controls.key, this._formBuilder.control(''));
  }
}
