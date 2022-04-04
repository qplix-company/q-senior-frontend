import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterControlsFields } from '../filter-controls-fields';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent implements OnInit {
  @Input() filter!: FilterControlsFields;
  @Input() form!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm(this.filter);
  }

  createForm(controls: FilterControlsFields) {
    this.form.addControl(controls.key, this._formBuilder.control(''));
  }
}
