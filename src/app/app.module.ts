import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckboxSelectComponent } from './components/filter-bar/controls/checkbox-select/checkbox-select.component';
import { FilterTitleComponent } from './components/filter-bar/controls/filter-title/filter-title.component';
import { RadioSelectComponent } from './components/filter-bar/controls/radio-select/radio-select.component';
import { SearchFieldComponent } from './components/filter-bar/controls/search-field/search-field.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { FilterableTableComponent } from './components/filterable-table/filterable-table.component';
import { SecuritiesListComponent } from './components/securities-list/securities-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterableTableComponent,
    SecuritiesListComponent,
    FilterBarComponent,
    SearchFieldComponent,
    RadioSelectComponent,
    FilterTitleComponent,
    CheckboxSelectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
