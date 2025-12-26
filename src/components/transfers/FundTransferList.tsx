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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockFundTransfers, pendingTransfers } from '@/data/mockPayments';
import { FundTransfer } from '@/data/types';
import { Send, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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
    setShowConfirmDialog(true);
  };

  const confirmBatchProcess = () => {
    const totalAmount = pendingTransfers
      .filter(t => selectedTransfers.includes(t.id))
      .reduce((sum, t) => sum + t.amount, 0);
    
    toast.success(`Batch transfer initiated for ${selectedTransfers.length} transfers (${formatCurrency(totalAmount)})`);
    setShowConfirmDialog(false);
    setSelectedTransfers([]);
  };

  const totalSelectedAmount = pendingTransfers
    .filter(t => selectedTransfers.includes(t.id))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Batch Controls */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
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
                <Badge variant="secondary">
                  {selectedTransfers.length} selected • {formatCurrency(totalSelectedAmount)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border border-border rounded-lg overflow-hidden">
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
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Process Batch
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Fund Transfers ({filteredTransfers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
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
                  <TableRow key={transfer.id} className="border-border">
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
                    <TableCell className="text-right font-medium text-foreground">
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

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Confirm Batch Transfer</DialogTitle>
            <DialogDescription>
              You are about to process a batch transfer for the following:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Number of transfers:</span>
              <span className="font-semibold">{selectedTransfers.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Total amount:</span>
              <span className="font-semibold text-lg">{formatCurrency(totalSelectedAmount)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBatchProcess} className="gap-2">
              <Send className="h-4 w-4" />
              Confirm & Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}