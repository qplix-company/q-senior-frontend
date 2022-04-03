import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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

  public filterForm: FormGroup = this._formBuilder.group({});

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.filterData != null) {
      this.createForm(this.filterData);
    }
  }

  private createForm(controls: readonly FilterControlBase[]) {
    console.log(controls);
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((res: SecuritiesFilter) => {});
  }
}
