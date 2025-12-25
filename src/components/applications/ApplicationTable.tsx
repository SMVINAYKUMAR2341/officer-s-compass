import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle,
  ArrowUpDown 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoanApplication, RiskBand } from '@/data/types';
import { mockApplications } from '@/data/mockApplications';

type SortField = 'submittedAt' | 'loanAmount' | 'confidence' | 'riskBand' | 'priority';
type SortDirection = 'asc' | 'desc';

const riskBandOrder: Record<RiskBand, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const priorityOrder: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const riskBadgeStyles: Record<RiskBand, string> = {
  LOW: 'bg-success/20 text-success border-success/30',
  MEDIUM: 'bg-warning/20 text-warning border-warning/30',
  HIGH: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusBadgeStyles: Record<string, string> = {
  PENDING_REVIEW: 'bg-warning/20 text-warning border-warning/30',
  APPROVED: 'bg-success/20 text-success border-success/30',
  REJECTED: 'bg-destructive/20 text-destructive border-destructive/30',
};

const purposeLabels: Record<string, string> = {
  HOME: 'Home Loan',
  VEHICLE: 'Vehicle Loan',
  BUSINESS: 'Business Loan',
  PERSONAL: 'Personal Loan',
  EDUCATION: 'Education Loan',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ApplicationTableProps {
  applications: LoanApplication[];
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'submittedAt':
          comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
          break;
        case 'loanAmount':
          comparison = a.loanAmount - b.loanAmount;
          break;
        case 'confidence':
          comparison = a.aiDecision.confidence - b.aiDecision.confidence;
          break;
        case 'riskBand':
          comparison = riskBandOrder[a.aiDecision.riskBand] - riskBandOrder[b.aiDecision.riskBand];
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [applications, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" />
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">Application ID</TableHead>
            <TableHead className="text-muted-foreground">Customer</TableHead>
            <TableHead className="text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 font-medium hover:bg-transparent"
                onClick={() => handleSort('loanAmount')}
              >
                Loan Amount
                <SortIcon field="loanAmount" />
              </Button>
            </TableHead>
            <TableHead className="text-muted-foreground">Purpose</TableHead>
            <TableHead className="text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 font-medium hover:bg-transparent"
                onClick={() => handleSort('confidence')}
              >
                AI Confidence
                <SortIcon field="confidence" />
              </Button>
            </TableHead>
            <TableHead className="text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 font-medium hover:bg-transparent"
                onClick={() => handleSort('riskBand')}
              >
                Risk Band
                <SortIcon field="riskBand" />
              </Button>
            </TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 font-medium hover:bg-transparent"
                onClick={() => handleSort('submittedAt')}
              >
                Submitted
                <SortIcon field="submittedAt" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplications.map((app) => (
            <TableRow 
              key={app.id}
              className="cursor-pointer hover:bg-accent/50 border-border"
              onClick={() => navigate(`/applications/${app.id}`)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {app.isSlaBreach && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="font-mono text-sm">{app.id}</span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{app.customerData.fullName}</p>
                  <p className="text-xs text-muted-foreground">{app.customerData.maskedId}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(app.loanAmount)}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {purposeLabels[app.loanPurpose]}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full',
                        app.aiDecision.confidence >= 0.8 ? 'bg-success' :
                        app.aiDecision.confidence >= 0.6 ? 'bg-warning' : 'bg-destructive'
                      )}
                      style={{ width: `${app.aiDecision.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(app.aiDecision.confidence * 100)}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn('font-medium', riskBadgeStyles[app.aiDecision.riskBand])}
                >
                  {app.aiDecision.riskBand}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn('font-medium', statusBadgeStyles[app.status])}
                >
                  {app.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm text-foreground">
                    {formatDistanceToNow(new Date(app.submittedAt), { addSuffix: true })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(app.submittedAt), 'MMM d, HH:mm')}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}