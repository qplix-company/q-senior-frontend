import { QueryList } from '@angular/core';
import { FilterableTableComponent } from './filterable-table.component';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

describe('FilterableTableComponent', () => {
  let component: FilterableTableComponent<any>;

  beforeEach(() => {
    component = new FilterableTableComponent<any>();
  });

  it('registers projected column, row and header definitions with the table', () => {
    const addColumnDef = jasmine.createSpy('addColumnDef');
    const addRowDef = jasmine.createSpy('addRowDef');
    const addHeaderRowDef = jasmine.createSpy('addHeaderRowDef');
    const setNoDataRow = jasmine.createSpy('setNoDataRow');
    component.table = {
      addColumnDef,
      addRowDef,
      addHeaderRowDef,
      setNoDataRow,
    } as unknown as MatTable<any>;

    const columnDef = {} as MatColumnDef;
    const rowDef = {} as MatRowDef<any>;
    const headerRowDef = {} as MatHeaderRowDef;
    const noDataRow = {} as MatNoDataRow;

    const columnDefs = new QueryList<MatColumnDef>();
    columnDefs.reset([columnDef]);
    component.columnDefs = columnDefs;

    const rowDefs = new QueryList<MatRowDef<any>>();
    rowDefs.reset([rowDef]);
    component.rowDefs = rowDefs;

    const headerRowDefs = new QueryList<MatHeaderRowDef>();
    headerRowDefs.reset([headerRowDef]);
    component.headerRowDefs = headerRowDefs;

    component.noDataRow = noDataRow;

    component.ngAfterContentInit();

    expect(addColumnDef).toHaveBeenCalledWith(columnDef);
    expect(addRowDef).toHaveBeenCalledWith(rowDef);
    expect(addHeaderRowDef).toHaveBeenCalledWith(headerRowDef);
    expect(setNoDataRow).toHaveBeenCalledWith(noDataRow);
  });

  it('clears the no-data row if none is provided', () => {
    const setNoDataRow = jasmine.createSpy('setNoDataRow');
    component.table = {
      addColumnDef: () => {},
      addRowDef: () => {},
      addHeaderRowDef: () => {},
      setNoDataRow,
    } as unknown as MatTable<any>;

    component.columnDefs = new QueryList<MatColumnDef>();
    component.rowDefs = new QueryList<MatRowDef<any>>();
    component.headerRowDefs = new QueryList<MatHeaderRowDef>();
    component.noDataRow = undefined;

    component.ngAfterContentInit();

    expect(setNoDataRow).toHaveBeenCalledWith(null);
  });
});
