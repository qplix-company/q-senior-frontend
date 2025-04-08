import { Component } from '@angular/core';
import { SecuritiesListComponent } from './components/securities-list/securities-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SecuritiesListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
