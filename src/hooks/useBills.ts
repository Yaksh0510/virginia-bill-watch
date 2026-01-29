import { useState, useEffect, useCallback, useMemo } from 'react';
import { Bill, BillFilters, BillStatus, SortField, SortDirection } from '@/types/bill';

const API_URL = 'http://127.0.0.1:8000/api/bills'; // adjust if needed

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filters, setFilters] = useState<BillFilters>({
    search: '',
    statuses: [],
    showNewOnly: false,
  });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch bills from FastAPI on mount
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // Map DB rows to frontend Bill type
        const mapped: Bill[] = data.map((b: any) => {
          let status: BillStatus = 'pending';
          if (b.Passed_house === 'Yes' || b.Passed_senate === 'Yes' || b.Passed === 'Yes') status = 'passed';
          else if (b.Vetoed === 'Yes') status = 'vetoed';
          else if (b.Failed === 'Yes') status = 'failed';
          else if (b.Approved === 'Yes') status = 'approved';
          else if (b.Carried_over === 'Yes') status = 'carried-over';

          return {
            id: b.Bill_id,
            billId: b.Bill_id,
            description: b.Bill_description,
            patronName: b.Patron_name,
            houseAction: b.Last_house_action ?? '',
            senateAction: b.Last_senate_action ?? '',
            governorAction: b.Last_governor_action ?? '',
            status,
            isNew: false,
            createdAt: b.Introduction_date ?? new Date().toISOString(),
            updatedAt: b.Introduction_date ?? new Date().toISOString(),
          };
        });

        setBills(mapped);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to fetch bills:', err);
      }
    };

    fetchBills();
  }, []);

  const addBill = useCallback((billData: Omit<Bill, 'id' | 'isNew' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newBill: Bill = {
      ...billData,
      id: Math.random().toString(36).substring(2, 15),
      isNew: true,
      createdAt: now,
      updatedAt: now,
    };
    setBills(prev => [...prev, newBill]);
  }, []);

  const updateBill = useCallback((id: string, billData: Partial<Bill>) => {
    setBills(prev =>
      prev.map(bill =>
        bill.id === id ? { ...bill, ...billData, updatedAt: new Date().toISOString() } : bill
      )
    );
  }, []);

  const deleteBill = useCallback((id: string) => {
    setBills(prev => prev.filter(bill => bill.id !== id));
  }, []);

  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          bill.billId.toLowerCase().includes(searchLower) ||
          bill.description.toLowerCase().includes(searchLower) ||
          bill.patronName.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.statuses.length > 0 && !filters.statuses.includes(bill.status)) {
        return false;
      }

      if (filters.showNewOnly && !bill.isNew) {
        return false;
      }

      return true;
    });
  }, [bills, filters]);

  const sortedBills = useMemo(() => {
    return [...filteredBills].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'billId':
          comparison = a.billId.localeCompare(b.billId);
          break;
        case 'patronName':
          comparison = a.patronName.localeCompare(b.patronName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredBills, sortField, sortDirection]);

  const paginatedBills = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedBills.slice(start, start + pageSize);
  }, [sortedBills, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedBills.length / pageSize);

  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
      setCurrentPage(1);
    },
    [sortField]
  );

  const exportToCSV = useCallback(() => {
    const headers = [
      'Bill ID',
      'Description',
      'Patron Name',
      'House Action',
      'Senate Action',
      'Governor Action',
      'Status',
      'Created At',
    ];
    const rows = filteredBills.map(bill => [
      bill.billId,
      `"${bill.description.replace(/"/g, '""')}"`,
      bill.patronName,
      bill.houseAction,
      bill.senateAction,
      bill.governorAction,
      bill.status,
      bill.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `virginia-bills-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [filteredBills]);

  const newBillsCount = useMemo(() => bills.filter(b => b.isNew).length, [bills]);

  const markAllAsRead = useCallback(() => {
    setBills(prev => prev.map(b => ({ ...b, isNew: false })));
  }, []);

  return {
    bills: paginatedBills,
    allBills: bills,
    totalBills: sortedBills.length,
    filters,
    setFilters,
    sortField,
    sortDirection,
    toggleSort,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    addBill,
    updateBill,
    deleteBill,
    exportToCSV,
    lastUpdated,
    newBillsCount,
    markAllAsRead,
  };
}
