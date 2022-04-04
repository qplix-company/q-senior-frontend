import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SecuritiesFilter } from 'src/app/models/securitiesFilter';
import { FilterControlBase } from './controls/filter-controls-base';

@Component({
  selector: 'filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  @Input() isLoading: boolean;
  @Input() filterData: readonly FilterControlBase[];

  @Output() formChanged = new EventEmitter<SecuritiesFilter>();

  public filterForm: FormGroup = this._formBuilder.group({});
  public sortedFilterControls: FilterControlBase[];

  constructor(private _formBuilder: FormBuilder) {}

  ngOnChanges() {
    if (this.filterData != null) {
      this.createForm(this.filterData);
    }
  }

  public resetForm() {
    this.filterForm.reset({ isPrivate: '' });
  }

  private createForm(filterControls: readonly FilterControlBase[]) {
    // sort by order ascending, e.g. 0, 1, 2..
    console.log(filterControls);
    this.sortedFilterControls = [...filterControls].sort(
      (a, b) => a.order - b.order
    );

    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((res: SecuritiesFilter) => this.formDataChanged(res));
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
