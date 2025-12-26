import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Key,
  Calendar,
  Clock,
  Edit2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { currentOfficer } from '@/data/mockApplications';

export function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [profile, setProfile] = useState({
    name: currentOfficer.name,
    email: currentOfficer.email,
    phone: '+91 98765 43210',
    department: currentOfficer.department,
    role: currentOfficer.role,
    joinedAt: '2021-03-15',
    lastLogin: new Date().toISOString(),
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setShowPasswordDialog(false);
    setPasswords({ current: '', new: '', confirm: '' });
    toast.success('Password changed successfully');
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Bank Admin
                </Badge>
              </div>
              <p className="text-muted-foreground">{profile.role}</p>
              <p className="text-sm text-muted-foreground">{profile.department}</p>
            </div>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="bg-background border-border"
                />
              ) : (
                <p className="text-foreground font-medium">{profile.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  className="bg-background border-border"
                />
              ) : (
                <p className="text-foreground font-medium">{profile.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  className="bg-background border-border"
                />
              ) : (
                <p className="text-foreground font-medium">{profile.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Role</Label>
              <p className="text-foreground font-medium">{profile.role}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Department</Label>
              <p className="text-foreground font-medium">{profile.department}</p>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <p className="text-foreground font-medium">
                {new Date(profile.joinedAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Login
              </Label>
              <p className="text-foreground font-medium">
                {new Date(profile.lastLogin).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Key className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Password</p>
              <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
            </div>
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Change Password</Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new one.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePasswordChange}>Update Password</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}