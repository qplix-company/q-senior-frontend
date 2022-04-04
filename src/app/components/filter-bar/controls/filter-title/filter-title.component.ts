import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-filter-title',
  templateUrl: './filter-title.component.html',
  styleUrls: ['./filter-title.component.scss'],
})
export class FilterTitleComponent {
  @Input() title!: string;
}
