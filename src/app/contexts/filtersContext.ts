import { BehaviorSubject } from 'rxjs';

export const filtersContext = new BehaviorSubject<Record<string, any>>({});
