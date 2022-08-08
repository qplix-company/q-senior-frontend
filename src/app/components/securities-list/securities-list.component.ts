import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Security } from '../../models/security';
import { indicate } from '../../utils';
import { SecurityService } from '../../services/security.service';
import { FilterDefinition } from 'src/app/models/filter';

@Component({
  selector: 'securities-list',
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss'],
})
export class SecuritiesListComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'type', 'currency'];

  public securities$: Observable<Security[]>;
  public loadingSecurities$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public filterDefinitions: FilterDefinition[] = [];
  private filter$: BehaviorSubject<unknown> = new BehaviorSubject({});

  constructor(private securityService: SecurityService) {}

  async ngOnInit(): Promise<void> {
    this.securities$ = this.filter$.pipe(
      switchMap((filter) => this.securityService.getSecurities(filter).pipe(indicate(this.loadingSecurities$))),
    );
    this.filterDefinitions = await this.securityService.getFilterdefinitions();
  }

  public filterChangeHandler(filter: unknown): void {
    this.filter$.next(filter);
  }
}
