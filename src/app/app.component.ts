import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { Task1Component } from './tasks/task1/task1.component';
import { Task2Component } from './tasks/task2/task2.component';
import { Task3Component } from './tasks/task3/task3.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTabsModule,
    Task1Component,
    Task2Component,
    Task3Component,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
