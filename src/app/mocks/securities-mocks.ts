import { Security } from '../models/security';
import securities from './securities.json';

export const SECURITIES: Security[] = securities as Security[];

export const SECURITY_TYPES = [
  'Equity',
  'Closed-endFund',
  'BankAccount',
  'DirectHolding',
  'Generic',
  'Collectible',
  'Loan',
  'RealEstate',
];

export const SECURITY_CURRENCIES = ['USD', 'GBP', 'EUR'];
