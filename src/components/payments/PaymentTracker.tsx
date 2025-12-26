import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockEMIPayments, paymentStats } from '@/data/mockPayments';
import { EMIPayment } from '@/data/types';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Bell,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const statusConfig = {
  UPCOMING: { label: 'Upcoming', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock },
  PAID: { label: 'Paid', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  OVERDUE: { label: 'Overdue', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertTriangle },
  PARTIAL: { label: 'Partial', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: TrendingDown },
};

export function PaymentTracker() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = mockEMIPayments.filter(payment => {
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesSearch = payment.applicationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSendReminder = (payment: EMIPayment) => {
    toast.success(`Payment reminder sent for ${payment.applicationId} - EMI #${payment.emiNumber}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold text-chart-2">{formatCurrency(paymentStats.totalCollected)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-2/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-2" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{paymentStats.paidCount} payments received</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Amount</p>
                <p className="text-2xl font-bold text-chart-1">{formatCurrency(paymentStats.overdueAmount)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-1/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-chart-1" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{paymentStats.overdueCount} overdue payments</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming EMIs</p>
                <p className="text-2xl font-bold text-chart-4">{formatCurrency(paymentStats.upcomingAmount)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-4/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-chart-4" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{paymentStats.upcomingCount} upcoming in 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((paymentStats.paidCount / (paymentStats.paidCount + paymentStats.overdueCount)) * 100)}%
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Application ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="PARTIAL">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground">
            EMI Payments ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Payment ID</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>EMI #</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Late Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.slice(0, 20).map((payment) => {
                const StatusIcon = statusConfig[payment.status].icon;
                const dueDate = new Date(payment.dueDate);
                const isNearDue = payment.status === 'UPCOMING' && 
                  dueDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

                return (
                  <TableRow key={payment.id} className="border-border">
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.applicationId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">EMI #{payment.emiNumber}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className={isNearDue ? 'text-amber-400' : 'text-muted-foreground'}>
                      {dueDate.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.paidDate
                        ? new Date(payment.paidDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {payment.lateFee ? (
                        <span className="text-chart-1 font-medium">
                          +{formatCurrency(payment.lateFee)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[payment.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[payment.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {(payment.status === 'UPCOMING' || payment.status === 'OVERDUE') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendReminder(payment)}
                          className="gap-1"
                        >
                          <Bell className="h-3 w-3" />
                          {payment.reminderSent ? 'Resend' : 'Remind'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}