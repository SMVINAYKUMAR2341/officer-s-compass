import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ApplicationTable } from './ApplicationTable';
import { ApplicationFilters, FilterState } from './ApplicationFilters';
import { mockApplications } from '@/data/mockApplications';
import { LoanApplication } from '@/data/types';

const defaultFilters: FilterState = {
  status: [],
  riskBand: [],
  loanPurpose: [],
  amountRange: [50000, 50000000],
  confidenceRange: [0, 100],
  dateRange: { from: undefined, to: undefined },
  slaBreachOnly: false,
};

export function ApplicationQueue() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(() => {
    const status = searchParams.get('status');
    const breach = searchParams.get('breach');
    
    return {
      ...defaultFilters,
      status: status ? [status] : [],
      slaBreachOnly: breach === 'true',
    };
  });

  const filteredApplications = useMemo(() => {
    return mockApplications.filter(app => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          app.id.toLowerCase().includes(query) ||
          app.customerData.fullName.toLowerCase().includes(query) ||
          app.customerData.maskedId.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(app.status)) {
        return false;
      }

      // Risk band filter
      if (filters.riskBand.length > 0 && !filters.riskBand.includes(app.aiDecision.riskBand)) {
        return false;
      }

      // Loan purpose filter
      if (filters.loanPurpose.length > 0 && !filters.loanPurpose.includes(app.loanPurpose)) {
        return false;
      }

      // Amount range filter
      if (app.loanAmount < filters.amountRange[0] || app.loanAmount > filters.amountRange[1]) {
        return false;
      }

      // Confidence range filter
      const confidence = app.aiDecision.confidence * 100;
      if (confidence < filters.confidenceRange[0] || confidence > filters.confidenceRange[1]) {
        return false;
      }

      // SLA breach filter
      if (filters.slaBreachOnly && !app.isSlaBreach) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.from) {
        const submittedDate = new Date(app.submittedAt);
        if (submittedDate < filters.dateRange.from) return false;
      }
      if (filters.dateRange.to) {
        const submittedDate = new Date(app.submittedAt);
        if (submittedDate > filters.dateRange.to) return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, or customer ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <ApplicationFilters filters={filters} onFiltersChange={setFilters} />
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredApplications.length} of {mockApplications.length} applications
      </div>

      {/* Table */}
      <ApplicationTable applications={filteredApplications} />
    </div>
  );
}