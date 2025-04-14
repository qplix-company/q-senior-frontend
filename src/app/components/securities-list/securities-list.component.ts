import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { Observable, BehaviorSubject, debounceTime } from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe } from '@angular/common';
import { InputComponentsEnum } from '../inputs/input-components.enum';
import { FormInput } from '../../models/form';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  protected displayedColumns: string[] = ['name', 'type', 'currency'];

  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  protected securities$: Observable<Security[]> = this._securityService
    .getSecurities({})
    .pipe(indicate(this.loadingSecurities$));

  filterFields: FormInput[] = [
    // TODO: FilterInputs
    {
      name: 'name',
      label: 'Name',
      type: InputComponentsEnum.Text, // TODO: component
      columns: 2,
      props: {
        placeholder: 'Enter name',
        debounceTime: 700,
        // mask: InputMasksEnum.text / select / checkbox
      },
    },
    {
      name: 'type',
      label: 'Type',
      type: InputComponentsEnum.Select,
      options: ['Stock', 'Bond'], // TODO: in props
      columns: 2,
    },
    {
      name: 'isPrivate',
      label: 'Private',
      type: InputComponentsEnum.Checkbox,
      columns: 4,
    },
  ];

  constructor() {
    this.securities$ = this._securityService
      .getSecurities({})
      .pipe(indicate(this.loadingSecurities$));
  }

  onFilterChange(filter: Record<string, any>) {
    this.securities$ = this._securityService
      .getSecurities(filter)
      .pipe(indicate(this.loadingSecurities$));
  }
}
