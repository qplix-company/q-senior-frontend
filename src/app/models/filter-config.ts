export type FilterFieldType = 'text' | 'select' | 'multiselect' | 'checkbox' | 'radio';

export interface FilterField<T = any> {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: { label: string; value: any }[]; // for select/multiselect
}