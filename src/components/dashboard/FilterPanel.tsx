import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BillFilters, BillStatus } from '@/types/bill';
import { ChevronDown } from 'lucide-react';

const STATUS_OPTIONS: { value: BillStatus; label: string }[] = [
  { value: 'passed', label: 'Passed' },
  { value: 'vetoed', label: 'Vetoed' },
  { value: 'failed', label: 'Failed' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'carried-over', label: 'Carried Over' },
];

interface FilterPanelProps {
  filters: BillFilters;
  onFiltersChange: (filters: BillFilters) => void;
  onExport: () => void;
  onAddBill: () => void;
  totalBills: number;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onExport,
  onAddBill,
  totalBills,
}: FilterPanelProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusToggle = (status: BillStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const handleNewOnlyToggle = (checked: boolean) => {
    onFiltersChange({ ...filters, showNewOnly: checked });
  };

  const clearFilters = () => {
    onFiltersChange({ search: '', statuses: [], showNewOnly: false });
  };

  const hasActiveFilters = filters.search || filters.statuses.length > 0 || filters.showNewOnly;

  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Bill ID, description, or patron..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Multi-Select Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px]">
              Status
              {filters.statuses.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.statuses.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-popover">
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={filters.statuses.includes(option.value)}
                onCheckedChange={() => handleStatusToggle(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Show New Only Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            id="new-only"
            checked={filters.showNewOnly}
            onCheckedChange={handleNewOnlyToggle}
          />
          <Label htmlFor="new-only" className="text-sm cursor-pointer">
            New bills only
          </Label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}

        <div className="flex-1" />

        {/* Results Count */}
        <span className="text-sm text-muted-foreground">
          {totalBills} bill{totalBills !== 1 ? 's' : ''}
        </span>

        {/* Export Button */}
        <Button variant="outline" onClick={onExport}>
          Export CSV
        </Button>

        {/* Add Bill Button */}
        <Button onClick={onAddBill}>
          Add Bill
        </Button>
      </div>
    </div>
  );
}
