import { TestBed } from '@angular/core/testing';

import { FilterationService } from './filteration.service';

describe('FilterationService', () => {
  let service: FilterationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
