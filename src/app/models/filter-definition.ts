export type FilterFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'boolean';

export interface FilterFieldOption {
  label: string;
  value: any;
}

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: Array<FilterFieldOption | string>;
  placeholder?: string;
  value?: any;
}