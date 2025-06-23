import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import ProfileModal from "@/components/ProfileModal";
import { 
  Truck, 
  BarChart3, 
  Users, 
  UserPlus, 
  TruckIcon, 
  ClipboardList, 
  Route, 
  MapPin, 
  File, 
  Bell,
  Settings,
  LogOut,
  User
} from "lucide-react";
import Dashboard from "./Dashboard";
import LeadsQuotes from "./LeadsQuotes";
import CustomerList from "./CustomerList";
import CarrierList from "./CarrierList";
import OrderList from "./OrderList";
import DispatchList from "./DispatchList";
import Tracing from "./Tracing";
import Invoices from "./Invoices";
import FollowUp from "./FollowUp";
import UserManagement from "../pages/UserManagement";
import { getUserPermissions } from "../lib/acl";

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, component: Dashboard },
  { id: 'leads', label: 'Leads & Quotes', icon: UserPlus, component: LeadsQuotes },
  { id: 'customers', label: 'Customer List', icon: Users, component: CustomerList },
  { id: 'carriers', label: 'Carriers', icon: TruckIcon, component: CarrierList },
  { id: 'orders', label: 'Order List', icon: ClipboardList, component: OrderList },
  { id: 'dispatch', label: 'Dispatch List', icon: Route, component: DispatchList },
  { id: 'tracing', label: 'Tracing', icon: MapPin, component: Tracing },
  { id: 'invoices', label: 'Invoices', icon: File, component: Invoices },
  { id: 'followup', label: 'Follow Up', icon: Bell, component: FollowUp },
  { id: 'users', label: 'User Management', icon: Settings, component: UserManagement, requiresAdmin: true },
];

export default function Layout() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const permissions = getUserPermissions(user);
  
  // Filter navigation items based on user permissions
  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.requiresAdmin) {
      return permissions.canManageUsers;
    }
    return true;
  });
  
  const ActiveComponent = filteredNavigationItems.find(item => item.id === activeTab)?.component || Dashboard;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Logo Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Truck className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">EverFlown</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Logistics</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary bg-blue-50 dark:bg-blue-900/20 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <span className="text-white text-sm font-medium">
                {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || 'U'}
              </span>
            </button>
            <div className="flex-1">
              <button
                onClick={() => setShowProfileModal(true)}
                className="text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {(user as any)?.firstName && (user as any)?.lastName 
                    ? `${(user as any).firstName} ${(user as any).lastName}` 
                    : (user as any)?.email || 'User'
                  }
                </p>
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">{(user as any)?.role || 'Admin'}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ActiveComponent />
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        open={showProfileModal} 
        onOpenChange={setShowProfileModal} 
      />
    </div>
  );
}
