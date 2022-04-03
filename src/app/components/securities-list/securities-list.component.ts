import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { indicate } from '../../utils';
import { FilterControlBase } from '../filter-bar/controls/filter-controls-base';

@Component({
  selector: 'securities-list',
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss'],
})
export class SecuritiesListComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'type', 'currency'];

  public securities$: Observable<Security[]>;
  public loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public filters$: Observable<FilterControlBase[]>;
  public loadingFilters$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.securities$ = this.securityService
      .getSecurities({})
      .pipe(indicate(this.loadingSecurities$));

    this.filters$ = this.securityService
      .getSecuritiesFilterMeta()
      .pipe(indicate(this.loadingFilters$));
  }
}
