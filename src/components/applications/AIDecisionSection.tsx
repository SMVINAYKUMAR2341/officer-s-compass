import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AIDecisionData } from '@/data/types';
import { 
  Brain, 
  TrendingUp, 
  Percent, 
  IndianRupee,
  Calendar,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIDecisionSectionProps {
  aiDecision: AIDecisionData;
  loanAmount: number;
  loanTenureMonths: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const decisionBadgeStyles = {
  APPROVED: 'bg-success/20 text-success border-success/30',
  REJECTED: 'bg-destructive/20 text-destructive border-destructive/30',
  PENDING_REVIEW: 'bg-warning/20 text-warning border-warning/30',
};

const riskBadgeStyles = {
  LOW: 'bg-success/20 text-success border-success/30',
  MEDIUM: 'bg-warning/20 text-warning border-warning/30',
  HIGH: 'bg-destructive/20 text-destructive border-destructive/30',
};

export function AIDecisionSection({ aiDecision, loanAmount, loanTenureMonths }: AIDecisionSectionProps) {
  const approvalPercentage = Math.round(aiDecision.approvalProbability * 100);
  const confidencePercentage = Math.round(aiDecision.confidence * 100);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Decision Output
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn('font-medium', riskBadgeStyles[aiDecision.riskBand])}
            >
              {aiDecision.riskBand} RISK
            </Badge>
            <Badge 
              variant="outline" 
              className={cn('font-medium', decisionBadgeStyles[aiDecision.decision])}
            >
              {aiDecision.decision.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Approval Probability */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Approval Probability</span>
            </div>
            <span className={cn(
              'text-2xl font-bold',
              approvalPercentage >= 70 ? 'text-success' :
              approvalPercentage >= 45 ? 'text-warning' : 'text-destructive'
            )}>
              {approvalPercentage}%
            </span>
          </div>
          <Progress 
            value={approvalPercentage} 
            className="h-3"
          />
        </div>

        {/* Confidence */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">AI Confidence</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {confidencePercentage}%
            </span>
          </div>
          <Progress 
            value={confidencePercentage} 
            className="h-2"
          />
        </div>

        {/* Loan Terms */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <IndianRupee className="h-3 w-3" />
              Loan Amount
            </p>
            <p className="text-lg font-semibold">{formatCurrency(loanAmount)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Percent className="h-3 w-3" />
              Interest Rate
            </p>
            <p className="text-lg font-semibold">{aiDecision.interestRate.toFixed(2)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <IndianRupee className="h-3 w-3" />
              Monthly EMI
            </p>
            <p className="text-lg font-semibold">{formatCurrency(aiDecision.emi)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <IndianRupee className="h-3 w-3" />
              Total Repayment
            </p>
            <p className="text-lg font-semibold">{formatCurrency(aiDecision.totalRepayment)}</p>
          </div>
        </div>

        {/* Decision Timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <Calendar className="h-3 w-3" />
          <span>
            AI decision made on {format(new Date(aiDecision.decidedAt), 'MMM d, yyyy \'at\' HH:mm')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}