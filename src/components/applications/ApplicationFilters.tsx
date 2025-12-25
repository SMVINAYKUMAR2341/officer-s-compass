import { useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface FilterState {
  status: string[];
  riskBand: string[];
  loanPurpose: string[];
  amountRange: [number, number];
  confidenceRange: [number, number];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  slaBreachOnly: boolean;
}

interface ApplicationFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const statusOptions = [
  { value: 'PENDING_REVIEW', label: 'Pending Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const riskOptions = [
  { value: 'LOW', label: 'Low Risk' },
  { value: 'MEDIUM', label: 'Medium Risk' },
  { value: 'HIGH', label: 'High Risk' },
];

const purposeOptions = [
  { value: 'HOME', label: 'Home Loan' },
  { value: 'VEHICLE', label: 'Vehicle Loan' },
  { value: 'BUSINESS', label: 'Business Loan' },
  { value: 'PERSONAL', label: 'Personal Loan' },
  { value: 'EDUCATION', label: 'Education Loan' },
];

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${(amount / 1000).toFixed(0)}K`;
}

export function ApplicationFilters({ filters, onFiltersChange }: ApplicationFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = [
    filters.status.length > 0,
    filters.riskBand.length > 0,
    filters.loanPurpose.length > 0,
    filters.amountRange[0] > 50000 || filters.amountRange[1] < 50000000,
    filters.confidenceRange[0] > 0 || filters.confidenceRange[1] < 100,
    filters.dateRange.from || filters.dateRange.to,
    filters.slaBreachOnly,
  ].filter(Boolean).length;

  const handleCheckboxChange = (
    field: 'status' | 'riskBand' | 'loanPurpose',
    value: string,
    checked: boolean
  ) => {
    const current = filters[field];
    const updated = checked
      ? [...current, value]
      : current.filter(v => v !== value);
    onFiltersChange({ ...filters, [field]: updated });
  };

  const resetFilters = () => {
    onFiltersChange({
      status: [],
      riskBand: [],
      loanPurpose: [],
      amountRange: [50000, 50000000],
      confidenceRange: [0, 100],
      dateRange: { from: undefined, to: undefined },
      slaBreachOnly: false,
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Filters</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={resetFilters}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={filters.status.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('status', option.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`status-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Band Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Risk Band</Label>
              <div className="space-y-2">
                {riskOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`risk-${option.value}`}
                      checked={filters.riskBand.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('riskBand', option.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`risk-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Purpose Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Loan Purpose</Label>
              <div className="space-y-2">
                {purposeOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`purpose-${option.value}`}
                      checked={filters.loanPurpose.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('loanPurpose', option.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`purpose-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Amount Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Loan Amount</Label>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(filters.amountRange[0])} - {formatCurrency(filters.amountRange[1])}
                </span>
              </div>
              <Slider
                value={filters.amountRange}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, amountRange: value as [number, number] })
                }
                min={50000}
                max={50000000}
                step={50000}
                className="w-full"
              />
            </div>

            {/* AI Confidence Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">AI Confidence</Label>
                <span className="text-xs text-muted-foreground">
                  {filters.confidenceRange[0]}% - {filters.confidenceRange[1]}%
                </span>
              </div>
              <Slider
                value={filters.confidenceRange}
                onValueChange={(value) => 
                  onFiltersChange({ ...filters, confidenceRange: value as [number, number] })
                }
                min={0}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* SLA Breach Only */}
            <div className="flex items-center space-x-2 pt-2 border-t border-border">
              <Checkbox
                id="sla-breach"
                checked={filters.slaBreachOnly}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, slaBreachOnly: checked as boolean })
                }
              />
              <Label 
                htmlFor="sla-breach"
                className="text-sm font-normal cursor-pointer text-destructive"
              >
                SLA Breach Only
              </Label>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}