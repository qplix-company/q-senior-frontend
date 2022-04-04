import { FilterControlBase } from './filter-controls-base';

export interface FilterControlsOptions extends FilterControlBase {
  options?: { key: string; value: string }[];
}
