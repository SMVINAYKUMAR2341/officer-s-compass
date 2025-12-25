import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomerDataSection } from './CustomerDataSection';
import { AIDecisionSection } from './AIDecisionSection';
import { AIExplanationSection } from './AIExplanationSection';
import { OfficerActionPanel } from './OfficerActionPanel';
import { mockApplications } from '@/data/mockApplications';
import { cn } from '@/lib/utils';

const purposeLabels: Record<string, string> = {
  HOME: 'Home Loan',
  VEHICLE: 'Vehicle Loan',
  BUSINESS: 'Business Loan',
  PERSONAL: 'Personal Loan',
  EDUCATION: 'Education Loan',
};

export function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const application = mockApplications.find(app => app.id === id);

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-lg text-muted-foreground">Application not found</p>
        <Button onClick={() => navigate('/applications')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    );
  }

  const handleDecision = (decision: 'APPROVED' | 'REJECTED', justification: string) => {
    // In a real app, this would call an API
    console.log('Decision:', decision, 'Justification:', justification);
    // Navigate back to queue after decision
    setTimeout(() => {
      navigate('/applications');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/applications')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{application.id}</h1>
              {application.isSlaBreach && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  SLA Breach
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {purposeLabels[application.loanPurpose]} • {application.loanTenureMonths} months tenure
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Submitted {formatDistanceToNow(new Date(application.submittedAt), { addSuffix: true })}
            </span>
          </div>
          <span className="hidden sm:block">
            {format(new Date(application.submittedAt), 'MMM d, yyyy HH:mm')}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="xl:col-span-2 space-y-6">
          <CustomerDataSection customer={application.customerData} />
          <AIDecisionSection 
            aiDecision={application.aiDecision}
            loanAmount={application.loanAmount}
            loanTenureMonths={application.loanTenureMonths}
          />
          <AIExplanationSection explanation={application.aiDecision.explanation} />
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          <OfficerActionPanel 
            application={application}
            onDecision={handleDecision}
          />
        </div>
      </div>
    </div>
  );
}