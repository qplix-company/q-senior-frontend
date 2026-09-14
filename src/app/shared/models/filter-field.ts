export type FilterFieldType = 'text' | 'multi-select' | 'boolean';

export interface FilterFieldOption {
  label: string;
  value: string;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FilterFieldType;
  /** Required for 'multi-select' fields. */
  options?: FilterFieldOption[];
  placeholder?: string;
  /** 'text' fields only: value is withheld from the emitted filter until it reaches this length. */
  minLength?: number;
}

/** Plain object of `field.key` -> current value, omitting fields with no active value. */
export type FilterValue = Record<string, unknown>;
