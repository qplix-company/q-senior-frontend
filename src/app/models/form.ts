import { InputComponentsEnum } from '../components/inputs/input-components.enum';

export interface FormInput {
  name: string;
  label: string;
  type: InputComponentsEnum;
  options?: string[];
  props?: Record<string, any>;
  columns?: number;
}
