import { format, formatDistanceToNow } from 'date-fns';
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  FileSearch,
  LucideIcon 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAuditLogs } from '@/data/mockApplications';
import { cn } from '@/lib/utils';

const actionIcons: Record<string, LucideIcon> = {
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

export function RecentActivity() {
  const recentLogs = mockAuditLogs.slice(0, 10);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {recentLogs.map((log) => {
              const Icon = actionIcons[log.actionType] || Eye;
              const colorClass = actionColors[log.actionType] || 'text-muted-foreground bg-muted';
              
              return (
                <div 
                  key={log.id}
                  className="flex items-start gap-3 py-3 border-b border-border last:border-0"
                >
                  <div className={cn('p-2 rounded-md', colorClass)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {log.officerName}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}