import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockFundTransfers, pendingTransfers } from '@/data/mockPayments';
import { FundTransfer } from '@/data/types';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Banknote,
  Building2,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
  PROCESSING: { label: 'Processing', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: RefreshCw },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  FAILED: { label: 'Failed', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
};

export function FundTransferList() {
  const [selectedTransfers, setSelectedTransfers] = useState<string[]>([]);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [transferFilter, setTransferFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');

  const filteredTransfers = mockFundTransfers.filter(t => {
    if (transferFilter === 'all') return true;
    return t.status.toLowerCase() === transferFilter;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransfers(pendingTransfers.map(t => t.id));
    } else {
      setSelectedTransfers([]);
    }
  };

  const handleSelectTransfer = (transferId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransfers(prev => [...prev, transferId]);
    } else {
      setSelectedTransfers(prev => prev.filter(id => id !== transferId));
    }
  };

  const handleProcessBatch = () => {
    if (selectedTransfers.length === 0) {
      toast.error('Please select at least one transfer');
      return;
    }
    setShowPaymentGateway(true);
  };

  const handleProcessComplete = () => {
    setSelectedTransfers([]);
  };

  const selectedTransferData = pendingTransfers.filter(t => selectedTransfers.includes(t.id));
  const totalSelectedAmount = selectedTransferData.reduce((sum, t) => sum + t.amount, 0);

  const totalPending = pendingTransfers.reduce((sum, t) => sum + t.amount, 0);
  const totalCompleted = mockFundTransfers
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Transfers</p>
                <p className="text-2xl font-bold text-warning">{formatCurrency(totalPending)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{pendingTransfers.length} transfers awaiting</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(totalCompleted)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-primary">
                  {mockFundTransfers.filter(t => t.status === 'PROCESSING').length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary animate-spin" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">In transit</p>
          </CardContent>
        </Card>
      </div>

      {/* Batch Controls */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedTransfers.length === pendingTransfers.length && pendingTransfers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  Select all pending ({pendingTransfers.length})
                </span>
              </div>
              {selectedTransfers.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Banknote className="h-3 w-3" />
                  {selectedTransfers.length} selected • {formatCurrency(totalSelectedAmount)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex border border-border/50 rounded-lg overflow-hidden">
                {(['all', 'pending', 'processing', 'completed'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={transferFilter === filter ? 'secondary' : 'ghost'}
                    size="sm"
                    className="rounded-none capitalize"
                    onClick={() => setTransferFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleProcessBatch}
                disabled={selectedTransfers.length === 0}
                className="gap-2 glow-primary"
              >
                <Send className="h-4 w-4" />
                Process via Gateway
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Fund Transfers ({filteredTransfers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead>Transfer ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Application</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Initiated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((transfer) => {
                const StatusIcon = statusConfig[transfer.status].icon;
                return (
                  <TableRow 
                    key={transfer.id} 
                    className={`border-border/30 transition-colors ${
                      selectedTransfers.includes(transfer.id) ? 'bg-primary/5' : ''
                    }`}
                  >
                    <TableCell>
                      {transfer.status === 'PENDING' && (
                        <Checkbox
                          checked={selectedTransfers.includes(transfer.id)}
                          onCheckedChange={(checked) => 
                            handleSelectTransfer(transfer.id, checked as boolean)
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{transfer.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{transfer.customerName}</p>
                        <p className="text-xs text-muted-foreground">{transfer.customerId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{transfer.applicationId}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {formatCurrency(transfer.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-mono">{transfer.bankAccount}</p>
                        <p className="text-xs text-muted-foreground">{transfer.ifscCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[transfer.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[transfer.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {transfer.batchId || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(transfer.initiatedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        open={showPaymentGateway}
        onOpenChange={setShowPaymentGateway}
        transfers={selectedTransferData}
        onProcessComplete={handleProcessComplete}
      />
    </div>
  );
}