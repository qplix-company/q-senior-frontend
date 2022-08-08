import { Component, EventEmitter, Input, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';

import { FilterDefinition, FilterType } from 'src/app/models/filter';

@Component({
  selector: 'filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent implements OnDestroy {
  @Input() filterDefinitions: FilterDefinition[];
  @Output() filterChange: EventEmitter<unknown> = new EventEmitter();

  public filterForm: FormGroup = this.fb.group({});
  public filterType = FilterType;
  private filter$: Observable<unknown>;
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    const newFilterDefinitions = changes['filterDefinitions'].currentValue as FilterDefinition[];
    if (newFilterDefinitions.length > 0) {
      this.updateFilterForm(newFilterDefinitions);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateFilterForm = (newFilterDefinitions: FilterDefinition[]) => {
    const filterFormControls = {};
    newFilterDefinitions.map((filterDefinition) => {
      filterFormControls[filterDefinition.filterKey] = [''];
    });
    this.filterForm = this.fb.group(filterFormControls);
    this.filter$ = this.filterForm.valueChanges.pipe(map(this.cleanUpFilter));
    this.subscription.unsubscribe();
    this.subscription = this.filter$.subscribe((filter: unknown) => this.updateFilter(filter));
  };

  private updateFilter(filter: unknown) {
    this.filterChange.emit(filter);
  }

  private cleanUpFilter(filter: unknown) {
    for (const [key, value] of Object.entries(filter)) {
      if (
        (typeof value === 'string' && value === '') ||
        (typeof value === 'boolean' && !value) ||
        (Array.isArray(value) && value.length === 0)
      ) {
        delete filter[key];
      }
    }
    return filter;
  }
}
