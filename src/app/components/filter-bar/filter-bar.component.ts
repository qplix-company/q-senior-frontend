import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SecuritiesFilter } from 'src/app/models/securitiesFilter';
import { FilterControlBase } from './controls/filter-controls-base';

@Component({
  selector: 'filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent implements OnInit {
  @Input() isLoading: boolean;
  @Input() filterData: readonly FilterControlBase[];

  @Output() formChanged = new EventEmitter<SecuritiesFilter>();

  public filterForm: FormGroup = this._formBuilder.group({});

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((res: SecuritiesFilter) => this.formDataChanged(res));
  }

  public resetForm() {
    this.filterForm.reset({ isPrivate: '' });
  }

  /**
   * Called when the form data was changed.
   * The form data is sanitized before being emitted
   * @param data of form values
   */
  private formDataChanged(data: SecuritiesFilter) {
    for (const prop in data) {
      const value = data[prop];

      // remove empty data fields
      if (typeof value === 'string' && value.trim() === '') {
        delete data[prop];
      }
    }
    this.formChanged.emit(data);
  }
}
