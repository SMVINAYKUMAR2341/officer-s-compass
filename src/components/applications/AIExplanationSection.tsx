import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIExplanation } from '@/data/types';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIExplanationSectionProps {
  explanation: AIExplanation;
}

export function AIExplanationSection({ explanation }: AIExplanationSectionProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Explanation (SHAP Analysis)
          </CardTitle>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
            ML Model Output
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Analysis Summary</p>
              <p className="text-sm text-muted-foreground">{explanation.summary}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Positive Factors */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <h4 className="text-sm font-medium text-success">Positive Contributing Factors</h4>
            </div>
            <div className="space-y-2">
              {explanation.positiveFactors.map((factor, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md bg-success/5 border border-success/20"
                >
                  <span className="text-sm text-foreground">{factor.factor}</span>
                  <Badge 
                    variant="outline" 
                    className="bg-success/20 text-success border-success/30 text-xs"
                  >
                    +{(factor.weight * 100).toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Negative Factors */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <h4 className="text-sm font-medium text-destructive">Negative Contributing Factors</h4>
            </div>
            <div className="space-y-2">
              {explanation.negativeFactors.map((factor, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-md bg-destructive/5 border border-destructive/20"
                >
                  <span className="text-sm text-foreground">{factor.factor}</span>
                  <Badge 
                    variant="outline" 
                    className="bg-destructive/20 text-destructive border-destructive/30 text-xs"
                  >
                    {(factor.weight * 100).toFixed(0)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
          Note: SHAP values represent the contribution of each feature to the model's prediction. 
          Positive values increase approval probability; negative values decrease it.
        </p>
      </CardContent>
    </Card>
  );
}