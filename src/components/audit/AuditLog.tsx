import { format, formatDistanceToNow } from 'date-fns';
import { Eye, CheckCircle2, XCircle, Shield, FileSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAuditLogs } from '@/data/mockApplications';
import { cn } from '@/lib/utils';

const actionIcons: Record<string, any> = {
  APPLICATION_VIEWED: Eye,
  AI_DECISION_REVIEWED: FileSearch,
  OFFICER_APPROVED: CheckCircle2,
  OFFICER_REJECTED: XCircle,
  KYC_VERIFIED: Shield,
  KYC_REJECTED: XCircle,
};

const actionColors: Record<string, string> = {
  APPLICATION_VIEWED: 'text-info bg-info/10',
  AI_DECISION_REVIEWED: 'text-primary bg-primary/10',
  OFFICER_APPROVED: 'text-success bg-success/10',
  OFFICER_REJECTED: 'text-destructive bg-destructive/10',
  KYC_VERIFIED: 'text-success bg-success/10',
  KYC_REJECTED: 'text-destructive bg-destructive/10',
};

export function AuditLog() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing {mockAuditLogs.length} audit log entries
      </p>
      
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockAuditLogs.slice(0, 50).map(log => {
              const Icon = actionIcons[log.actionType] || Eye;
              const colorClass = actionColors[log.actionType] || 'text-muted-foreground bg-muted';
              
              return (
                <div key={log.id} className="flex items-start gap-4 p-4">
                  <div className={cn('p-2 rounded-md', colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">
                        {log.applicationId}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {log.actionType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{log.details}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{log.officerName}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                      <span>•</span>
                      <span>{format(new Date(log.timestamp), 'MMM d, HH:mm')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}