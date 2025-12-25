import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockApplications } from '@/data/mockApplications';

export function QuickActions() {
  const navigate = useNavigate();
  
  const pendingCount = mockApplications.filter(a => a.status === 'PENDING_REVIEW').length;
  const urgentCount = mockApplications.filter(a => a.priority === 'URGENT' || a.isSlaBreach).length;
  const pendingKYC = mockApplications.filter(a => 
    a.status === 'APPROVED' && a.kycDocuments.some(d => d.status === 'PENDING')
  ).length;

  const actions = [
    {
      title: 'Review Pending Applications',
      description: `${pendingCount} applications awaiting your decision`,
      icon: FileText,
      variant: 'default' as const,
      onClick: () => navigate('/applications?status=PENDING_REVIEW'),
    },
    {
      title: 'Urgent: SLA Breaches',
      description: `${urgentCount} applications exceeding SLA`,
      icon: AlertTriangle,
      variant: urgentCount > 0 ? 'destructive' as const : 'default' as const,
      onClick: () => navigate('/applications?breach=true'),
    },
    {
      title: 'KYC Verification Queue',
      description: `${pendingKYC} documents pending verification`,
      icon: Shield,
      variant: 'default' as const,
      onClick: () => navigate('/kyc'),
    },
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant === 'destructive' ? 'destructive' : 'secondary'}
            className="w-full justify-between h-auto py-4 px-4"
            onClick={action.onClick}
          >
            <div className="flex items-center gap-3">
              <action.icon className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs opacity-80">{action.description}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}