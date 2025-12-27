import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { EMIPayment } from '@/data/types';
import { mockEMIPayments } from '@/data/mockPayments';
import { 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Receipt,
  Wallet
} from 'lucide-react';

interface EMIDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: EMIPayment | null;
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const statusConfig = {
  UPCOMING: { label: 'Upcoming', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock },
  PAID: { label: 'Paid', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  OVERDUE: { label: 'Overdue', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle },
  PARTIAL: { label: 'Partial', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: TrendingUp },
};

export function EMIDetailModal({ open, onOpenChange, payment }: EMIDetailModalProps) {
  if (!payment) return null;

  // Get all EMIs for this loan
  const allEMIs = mockEMIPayments.filter(p => p.applicationId === payment.applicationId);
  const paidEMIs = allEMIs.filter(p => p.status === 'PAID');
  const totalPaid = paidEMIs.reduce((sum, p) => sum + (p.paidAmount || p.amount), 0);
  const totalLateFees = allEMIs.reduce((sum, p) => sum + (p.lateFee || 0), 0);
  
  // Assuming 24-month tenure for calculation (this would come from actual loan data)
  const totalTenure = 24;
  const emiAmount = payment.amount;
  const totalLoanAmount = emiAmount * totalTenure;
  const remainingAmount = totalLoanAmount - totalPaid;
  const progressPercentage = (totalPaid / totalLoanAmount) * 100;

  const StatusIcon = statusConfig[payment.status].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="text-gradient">EMI Details</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                {payment.applicationId}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current EMI Status */}
          <div className="glass-panel rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  EMI #{payment.emiNumber}
                </Badge>
                <Badge className={statusConfig[payment.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[payment.status].label}
                </Badge>
              </div>
              <span className="text-xl font-bold">{formatCurrency(payment.amount)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Due Date
                </p>
                <p className="font-medium">
                  {new Date(payment.dueDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              {payment.paidDate && (
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Paid Date
                  </p>
                  <p className="font-medium text-success">
                    {new Date(payment.paidDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {payment.lateFee && payment.lateFee > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <span className="text-sm text-destructive">Late Fee Applied</span>
                <span className="font-semibold text-destructive">+{formatCurrency(payment.lateFee)}</span>
              </div>
            )}
          </div>

          {/* Loan Progress */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Loan Repayment Progress
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{paidEMIs.length} EMIs paid</span>
                <span>{totalTenure - paidEMIs.length} EMIs remaining</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Financial Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-4 text-center space-y-2">
              <div className="h-10 w-10 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="text-lg font-bold text-success">{formatCurrency(totalPaid)}</p>
            </div>

            <div className="glass-panel rounded-xl p-4 text-center space-y-2">
              <div className="h-10 w-10 mx-auto rounded-full bg-warning/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-warning" />
              </div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-lg font-bold text-warning">{formatCurrency(remainingAmount)}</p>
            </div>
          </div>

          {/* EMI Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              Payment Summary
            </h4>
            <div className="glass-panel rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly EMI</span>
                <span className="font-medium">{formatCurrency(emiAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Loan Amount</span>
                <span className="font-medium">{formatCurrency(totalLoanAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Late Fees</span>
                <span className={`font-medium ${totalLateFees > 0 ? 'text-destructive' : ''}`}>
                  {formatCurrency(totalLateFees)}
                </span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex justify-between">
                <span className="font-medium">Amount Remaining</span>
                <span className="font-bold text-lg">{formatCurrency(remainingAmount)}</span>
              </div>
            </div>
          </div>

          {/* Recent EMI History */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Recent Payment History</h4>
            <div className="space-y-2 max-h-32 overflow-auto scrollbar-thin">
              {allEMIs.slice(0, 5).map((emi) => {
                const EmiIcon = statusConfig[emi.status].icon;
                return (
                  <div 
                    key={emi.id}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      emi.id === payment.id ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <EmiIcon className={`h-3 w-3 ${
                        emi.status === 'PAID' ? 'text-success' : 
                        emi.status === 'OVERDUE' ? 'text-destructive' : 'text-muted-foreground'
                      }`} />
                      <span className="text-sm font-mono">EMI #{emi.emiNumber}</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(emi.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}