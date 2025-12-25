import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoanApplication } from '@/data/types';
import { 
  Scale, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface OfficerActionPanelProps {
  application: LoanApplication;
  onDecision: (decision: 'APPROVED' | 'REJECTED', justification: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function OfficerActionPanel({ application, onDecision }: OfficerActionPanelProps) {
  const { toast } = useToast();
  const [justification, setJustification] = useState('');
  const [pendingDecision, setPendingDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isJustificationValid = justification.trim().length >= 50;
  const isPendingReview = application.status === 'PENDING_REVIEW';

  if (!isPendingReview) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Officer Decision
          </CardTitle>
        </CardHeader>
        <CardContent>
          {application.officerDecision ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline" 
                  className={cn(
                    'font-medium',
                    application.officerDecision.decision === 'APPROVED' 
                      ? 'bg-success/20 text-success border-success/30'
                      : 'bg-destructive/20 text-destructive border-destructive/30'
                  )}
                >
                  {application.officerDecision.decision === 'APPROVED' ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {application.officerDecision.decision}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  by {application.officerDecision.officerName}
                </span>
              </div>
              <div className="p-3 rounded-md bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Justification</p>
                <p className="text-sm text-foreground">{application.officerDecision.justification}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Decision made by AI system</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const handleDecisionClick = (decision: 'APPROVED' | 'REJECTED') => {
    if (!isJustificationValid) {
      toast({
        title: 'Justification Required',
        description: 'Please provide a justification of at least 50 characters.',
        variant: 'destructive',
      });
      return;
    }
    setPendingDecision(decision);
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (pendingDecision) {
      onDecision(pendingDecision, justification);
      toast({
        title: `Application ${pendingDecision.toLowerCase()}`,
        description: `Application ${application.id} has been ${pendingDecision.toLowerCase()}.`,
      });
    }
    setIsDialogOpen(false);
    setPendingDecision(null);
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Officer Action Panel
            </CardTitle>
            <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">
              Pending Your Decision
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Override Warning */}
          <Alert className="border-warning/50 bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">AI Recommendation Override</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              The AI has flagged this application for manual review. Your decision will override 
              the AI recommendation. Please ensure thorough evaluation before proceeding.
            </AlertDescription>
          </Alert>

          {/* Justification */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Decision Justification <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="Provide detailed justification for your decision (minimum 50 characters)..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="min-h-[120px] bg-secondary/50"
            />
            <div className="flex justify-between text-xs">
              <span className={cn(
                isJustificationValid ? 'text-success' : 'text-muted-foreground'
              )}>
                {justification.length} / 50 minimum characters
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground"
              onClick={() => handleDecisionClick('APPROVED')}
              disabled={!isJustificationValid}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve Application
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleDecisionClick('REJECTED')}
              disabled={!isJustificationValid}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {pendingDecision === 'APPROVED' ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              Confirm {pendingDecision === 'APPROVED' ? 'Approval' : 'Rejection'}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>You are about to <strong>{pendingDecision?.toLowerCase()}</strong> the following application:</p>
              <div className="p-3 rounded-md bg-secondary/50 border border-border space-y-1">
                <p><strong>Application ID:</strong> {application.id}</p>
                <p><strong>Customer:</strong> {application.customerData.fullName}</p>
                <p><strong>Loan Amount:</strong> {formatCurrency(application.loanAmount)}</p>
              </div>
              <p className="text-warning">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={cn(
                pendingDecision === 'APPROVED' 
                  ? 'bg-success hover:bg-success/90'
                  : 'bg-destructive hover:bg-destructive/90'
              )}
            >
              Confirm {pendingDecision}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}