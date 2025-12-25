import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Shield, 
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { currentOfficer } from '@/data/mockApplications';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/applications', icon: FileText, label: 'Applications' },
  { path: '/kyc', icon: Shield, label: 'KYC Verification' },
  { path: '/audit', icon: ClipboardList, label: 'Audit Log' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn(
        'h-16 flex items-center border-b border-sidebar-border px-4',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-semibold text-sidebar-foreground">LoanDesk</span>
          </div>
        )}
        {collapsed && <Building2 className="h-8 w-8 text-primary" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            'h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'absolute -right-4 top-4 bg-sidebar border border-sidebar-border rounded-full'
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors',
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn(
        'border-t border-sidebar-border p-4',
        collapsed && 'px-2'
      )}>
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {currentOfficer.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {currentOfficer.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentOfficer.role}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {currentOfficer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}