export type BillStatus =
  | 'passed'
  | 'vetoed'
  | 'failed'
  | 'approved'
  | 'pending'
  | 'carried-over';

export interface Bill {
  id: string;
  billId: string;
  description: string;
  patronName: string;
  houseAction: string;
  houseActionDate?: string;
  senateAction: string;
  senateActionDate?: string;
  governorAction: string;
  governorActionDate?: string;
  status: BillStatus;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SortField = 'billId' | 'patronName' | 'status' | 'createdAt' | 'introductionDate' | 'houseActionDate';
export type SortDirection = 'asc' | 'desc';

export interface BillFilters {
  search: string;
  statuses: BillStatus[];
  showNewOnly: boolean;
}
