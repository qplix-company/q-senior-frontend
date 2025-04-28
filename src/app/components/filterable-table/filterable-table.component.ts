import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FormInput } from '../../models/form';
import { FormGeneratorComponent } from '../form-generator/form-generator.component';

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTable,
    MatProgressSpinner,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    FormGeneratorComponent,
  ],
  templateUrl: './filterable-table.component.html',
  styleUrls: ['./filterable-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableTableComponent<T> implements AfterContentInit {
  @ViewChild(MatTable, { static: true }) table?: MatTable<T>;

  @ContentChildren(MatHeaderRowDef) headerRowDefs?: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs?: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs?: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow?: MatNoDataRow;

  @Input() columns: string[] = [];
  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;
  @Input() isLoading: boolean | null = false;
  @Input() fields: FormInput[] = [];

  values: Record<string, any> = {};

  ngAfterContentInit(): void {
    this.columnDefs?.forEach((def) => this.table?.addColumnDef(def));
    this.rowDefs?.forEach((def) => this.table?.addRowDef(def));
    this.headerRowDefs?.forEach((def) => this.table?.addHeaderRowDef(def));
    this.table?.setNoDataRow(this.noDataRow ?? null);
  }
}
