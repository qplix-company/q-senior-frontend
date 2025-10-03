export type FilterControlType =
  | 'text'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio';

export interface FilterConfig<T = any> {
  key: string;
  label: string;
  type: FilterControlType;
  options?: { label: string; value: any }[]; // for select/multiselect
  defaultValue?: any;
}
