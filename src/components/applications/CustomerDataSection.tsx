import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CustomerData } from '@/data/types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building2,
  CreditCard,
  IndianRupee
} from 'lucide-react';

interface CustomerDataSectionProps {
  customer: CustomerData;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function CustomerDataSection({ customer }: CustomerDataSectionProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Customer Provided Data
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Read Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Personal Information */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InfoRow icon={User} label="Full Name" value={customer.fullName} />
            <InfoRow icon={Mail} label="Email" value={customer.email} />
            <InfoRow icon={Phone} label="Phone" value={customer.phone} />
            <InfoRow icon={Calendar} label="Date of Birth" value={customer.dateOfBirth} />
            <InfoRow icon={User} label="Gender" value={customer.gender} />
            <InfoRow icon={CreditCard} label="PAN Number" value={customer.panNumber} />
            <InfoRow icon={CreditCard} label="Aadhar (Masked)" value={customer.aadharMasked} />
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Address */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InfoRow icon={MapPin} label="Street Address" value={customer.address} />
            <InfoRow icon={MapPin} label="City" value={customer.city} />
            <InfoRow icon={MapPin} label="State" value={customer.state} />
            <InfoRow icon={MapPin} label="PIN Code" value={customer.pincode} />
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Employment */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Employment & Income</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InfoRow icon={Briefcase} label="Employment Type" value={customer.employmentType} />
            <InfoRow icon={Building2} label="Employer" value={customer.employer} />
            <InfoRow icon={Briefcase} label="Designation" value={customer.designation} />
            <InfoRow icon={Calendar} label="Years of Employment" value={`${customer.yearsOfEmployment} years`} />
            <InfoRow icon={IndianRupee} label="Monthly Income" value={formatCurrency(customer.monthlyIncome)} />
            <InfoRow icon={CreditCard} label="Existing Loans" value={customer.existingLoans} />
            <InfoRow icon={IndianRupee} label="Existing EMI" value={formatCurrency(customer.existingEMI)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}