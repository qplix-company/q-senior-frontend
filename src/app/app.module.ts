import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterableTableComponent } from './components/filterable-table/filterable-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SecuritiesListComponent } from './components/securities-list/securities-list.component';

@NgModule({
  declarations: [AppComponent, FilterableTableComponent, SecuritiesListComponent],
  imports: [BrowserModule, AppRoutingModule, NoopAnimationsModule, MatTableModule, MatProgressSpinnerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
