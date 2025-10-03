export type FilterControlType = 'text' | 'select' | 'multiselect' | 'checkbox';

export interface FilterOption {
  value: string | number | boolean;
  label: string;
}

export interface FilterConfig<T = any> {
  key: string;
  label: string;
  type: FilterControlType;
  options?: FilterOption[];
  placeholder?: string;
  defaultValue?: any;
}
