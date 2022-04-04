export interface Security {
  id: string;
  name: string;
  type: string;
  currency: string;
  isPrivate: boolean;
}

export interface FilteredSecurities {
  totalCount: number;
  filtered: Security[];
}
