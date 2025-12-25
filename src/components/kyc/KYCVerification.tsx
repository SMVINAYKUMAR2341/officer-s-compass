import { useState } from 'react';
import { format } from 'date-fns';
import { FileText, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockApplications } from '@/data/mockApplications';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const statusStyles = {
  PENDING: 'bg-warning/20 text-warning border-warning/30',
  VERIFIED: 'bg-success/20 text-success border-success/30',
  REJECTED: 'bg-destructive/20 text-destructive border-destructive/30',
};

const docTypeLabels = {
  IDENTITY: 'Identity Document',
  ADDRESS: 'Address Proof',
  BANK_STATEMENT: 'Bank Statement',
};

export function KYCVerification() {
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});

  const approvedApps = mockApplications.filter(
    app => app.status === 'APPROVED' && app.kycDocuments.some(d => d.status === 'PENDING')
  );

  const handleVerify = (appId: string, docId: string) => {
    toast({ title: 'Document Verified', description: `Document ${docId} has been verified.` });
  };

  const handleReject = (appId: string, docId: string) => {
    const reason = rejectionReason[docId];
    if (!reason || reason.length < 10) {
      toast({ title: 'Reason Required', description: 'Please provide a rejection reason.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Document Rejected', description: `Document ${docId} has been rejected.` });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {approvedApps.length} approved applications with pending KYC verification
      </p>

      {approvedApps.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto text-success mb-4" />
            <p className="text-lg font-medium">All KYC documents verified</p>
            <p className="text-sm text-muted-foreground">No pending verifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvedApps.slice(0, 5).map(app => (
            <Card key={app.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {app.id} - {app.customerData.fullName}
                  </CardTitle>
                  <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                    Loan Approved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {app.kycDocuments.filter(d => d.status === 'PENDING').map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50 border border-border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{docTypeLabels[doc.type]}</p>
                          <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Rejection reason..."
                          className="w-40 h-8 text-xs"
                          value={rejectionReason[doc.id] || ''}
                          onChange={(e) => setRejectionReason(prev => ({ ...prev, [doc.id]: e.target.value }))}
                        />
                        <Button size="sm" variant="outline" className="text-success border-success hover:bg-success hover:text-success-foreground" onClick={() => handleVerify(app.id, doc.id)}>
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleReject(app.id, doc.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}