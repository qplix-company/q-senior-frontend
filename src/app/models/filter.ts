export enum FilterType {
  input,
  selectMultiple,
  checkbox,
}

export interface FilterDefinition {
  label: string;
  type: FilterType;
  filterKey: string;
  options?: string[];
}
