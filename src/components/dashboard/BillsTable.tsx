import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { Bill, SortField, SortDirection } from '@/types/bill';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface BillsTableProps {
  bills: Bill[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const statusStyles: Record<string, string> = {
  passed: 'bg-status-passed/10 border-status-passed/20',
  approved: 'bg-status-passed/10 border-status-passed/20',
  vetoed: 'bg-status-vetoed/10 border-status-vetoed/20',
  failed: 'bg-status-vetoed/10 border-status-vetoed/20',
  pending: 'bg-status-pending/10 border-status-pending/20',
  'carried-over': 'bg-status-pending/10 border-status-pending/20',
};

const statusBadgeStyles: Record<string, string> = {
  passed: 'bg-status-passed text-status-passed-foreground',
  approved: 'bg-status-passed text-status-passed-foreground',
  vetoed: 'bg-status-vetoed text-status-vetoed-foreground',
  failed: 'bg-status-vetoed text-status-vetoed-foreground',
  pending: 'bg-status-pending text-status-pending-foreground',
  'carried-over': 'bg-status-pending text-status-pending-foreground',
};

function SortIcon({ field, currentField, direction }: { field: SortField; currentField: SortField; direction: SortDirection }) {
  if (field !== currentField) {
    return <ChevronDown className="ml-1 h-4 w-4 opacity-30" />;
  }
  return direction === 'asc' ? (
    <ChevronUp className="ml-1 h-4 w-4" />
  ) : (
    <ChevronDown className="ml-1 h-4 w-4" />
  );
}

export function BillsTable({
  bills,
  sortField,
  sortDirection,
  onSort,
}: BillsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg">No bills found</p>
        <p className="text-sm">Try adjusting your filters or add a new bill</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10"></TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort('billId')}
            >
              <div className="flex items-center">
                Bill ID
                <SortIcon field="billId" currentField={sortField} direction={sortDirection} />
              </div>
            </TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort('patronName')}
            >
              <div className="flex items-center">
                Patron
                <SortIcon field="patronName" currentField={sortField} direction={sortDirection} />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort('introduced_date')}
            >
              <div className="flex items-center">
                Introduced
                <SortIcon field="introduced_date" currentField={sortField} direction={sortDirection} />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center">
                Status
                <SortIcon field="status" currentField={sortField} direction={sortDirection} />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill, index) => (
            <>
              <TableRow
                key={bill.id}
                className={cn(
                  'cursor-pointer transition-colors',
                  statusStyles[bill.status],
                  index % 2 === 0 ? 'bg-opacity-50' : '',
                  bill.isNew && 'ring-1 ring-primary/30'
                )}
                onClick={() => toggleExpand(bill.id)}
              >
                <TableCell className="py-3">
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedId === bill.id && 'rotate-90'
                    )}
                  />
                </TableCell>
                <TableCell className="font-medium">{bill.billId}</TableCell>
                <TableCell className="max-w-[300px] truncate">{bill.description}</TableCell>
                <TableCell>{bill.patronName}</TableCell>
                <TableCell className="text-sm">
                  {bill.introduced_date ? new Date(bill.introduced_date).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <Badge className={cn('capitalize', statusBadgeStyles[bill.status])}>
                    {bill.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedId === bill.id && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableCell colSpan={6} className="py-4">
                    <div className="grid grid-cols-2 gap-6 px-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Full Description</h4>
                        <p className="text-sm">{bill.description}</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Timestamps</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Created: {new Date(bill.createdAt).toLocaleString()}</p>
                            <p>Updated: {new Date(bill.updatedAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}