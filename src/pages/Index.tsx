import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { BillsTable } from '@/components/dashboard/BillsTable';
import { BillFormDialog } from '@/components/dashboard/BillFormDialog';
import { Pagination } from '@/components/dashboard/Pagination';
import { useBills } from '@/hooks/useBills';
import { Bill } from '@/types/bill';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const {
    bills,
    totalBills,
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
  } = useBills();

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedMode ? savedMode === 'true' : prefersDark;
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('dark-mode', String(newValue));
      document.documentElement.classList.toggle('dark', newValue);
      return newValue;
    });
  };

  const handleAddBill = () => {
    setEditingBill(null);
    setIsFormOpen(true);
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Bill, 'id' | 'isNew' | 'createdAt' | 'updatedAt'>) => {
    if (editingBill) {
      updateBill(editingBill.id, data);
    } else {
      addBill(data);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        lastUpdated={lastUpdated}
        newBillsCount={newBillsCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onMarkAllRead={markAllAsRead}
      />

      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onExport={exportToCSV}
        onAddBill={handleAddBill}
        totalBills={totalBills}
      />

      <main className="bg-card">
        <BillsTable
          bills={bills}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={toggleSort}
          onEdit={handleEditBill}
          onDelete={deleteBill}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalBills}
            onPageChange={setCurrentPage}
            onPageSizeChange={size => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </main>

      <BillFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        bill={editingBill}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Index;
