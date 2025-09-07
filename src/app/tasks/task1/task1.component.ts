import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecuritiesListComponent } from '../../components/securities-list/securities-list.component';

@Component({
  selector: 'app-task1',
  standalone: true,
  imports: [SecuritiesListComponent],
  templateUrl: './task1.component.html',
  styleUrl: './task1.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Task1Component {}
