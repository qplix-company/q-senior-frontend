import { Component, OnInit } from '@angular/core';
import { Security } from '../../models/security';
import { BehaviorSubject, Observable } from 'rxjs';
import { indicate } from '../../utils';
import { SecurityService } from '../../services/security.service';

@Component({
  selector: 'securities-list',
  templateUrl: './securities-list.component.html',
  styleUrls: ['./securities-list.component.scss'],
})
export class SecuritiesListComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'type', 'currency'];

  public securities$: Observable<Security[]>;
  public loadingSecurities$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.securities$ = this.securityService.getSecurities({}).pipe(indicate(this.loadingSecurities$));
  }
}
