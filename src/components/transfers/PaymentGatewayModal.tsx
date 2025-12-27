import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FundTransfer } from '@/data/types';
import { 
  Building2, 
  CreditCard, 
  Shield, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Lock,
  Banknote
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentGatewayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transfers: FundTransfer[];
  onProcessComplete: () => void;
}

const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

type ProcessStep = 'review' | 'auth' | 'processing' | 'complete';

export function PaymentGatewayModal({ 
  open, 
  onOpenChange, 
  transfers,
  onProcessComplete 
}: PaymentGatewayModalProps) {
  const [step, setStep] = useState<ProcessStep>('review');
  const [authPin, setAuthPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = transfers.reduce((sum, t) => sum + t.amount, 0);

  const handleProceedToAuth = () => {
    setStep('auth');
  };

  const handleAuthenticate = async () => {
    if (authPin.length < 4) {
      toast.error('Please enter a valid 4-digit PIN');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    setStep('complete');
    setIsProcessing(false);
  };

  const handleComplete = () => {
    toast.success(`Successfully processed ${transfers.length} transfers totaling ${formatCurrency(totalAmount)}`);
    onProcessComplete();
    setStep('review');
    setAuthPin('');
    onOpenChange(false);
  };

  const handleClose = () => {
    if (step !== 'processing') {
      setStep('review');
      setAuthPin('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-primary" />
            </div>
            <span className="text-gradient">Secure Payment Gateway</span>
          </DialogTitle>
          <DialogDescription>
            Bank-grade secure fund transfer processing
          </DialogDescription>
        </DialogHeader>

        {step === 'review' && (
          <div className="space-y-6 py-4">
            <div className="glass-panel rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transfer Count</span>
                <Badge variant="secondary" className="font-mono">
                  {transfers.length} transfers
                </Badge>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-gradient">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-48 overflow-auto scrollbar-thin">
              {transfers.slice(0, 5).map((transfer) => (
                <div 
                  key={transfer.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transfer.customerName}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {transfer.bankAccount}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold">{formatCurrency(transfer.amount)}</span>
                </div>
              ))}
              {transfers.length > 5 && (
                <p className="text-center text-sm text-muted-foreground">
                  +{transfers.length - 5} more transfers
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-sm text-success">256-bit SSL Encrypted Transfer</span>
            </div>

            <Button onClick={handleProceedToAuth} className="w-full gap-2 glow-primary">
              Proceed to Authorization
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 'auth' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Enter your 4-digit transaction PIN to authorize this transfer
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="pin">Transaction PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={4}
                value={authPin}
                onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest font-mono bg-muted/50"
                placeholder="••••"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/30">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                This PIN is required for all outgoing transfers above ₹10,000
              </span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('review')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleAuthenticate} 
                className="flex-1 gap-2 glow-primary"
                disabled={authPin.length < 4}
              >
                Authorize Transfer
                <Shield className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center space-y-6">
            <div className="h-20 w-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Processing Transfers...</h3>
              <p className="text-sm text-muted-foreground">
                Please do not close this window
              </p>
            </div>
            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-purple-400 animate-pulse w-2/3 rounded-full" />
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="py-8 text-center space-y-6">
            <div className="h-20 w-20 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-success">Transfer Successful!</h3>
              <p className="text-sm text-muted-foreground">
                {transfers.length} transfers processed successfully
              </p>
            </div>

            <div className="glass-panel rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Disbursed</span>
                <span className="font-bold text-success">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-xs">TXN{Date.now()}</span>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}