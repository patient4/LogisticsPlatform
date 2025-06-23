import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Route, Switch, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getUserPermissions, getRoleDisplayName, getRoleBadgeColor } from "@/lib/acl";
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Package, 
  FileText, 
  DollarSign, 
  CheckSquare,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import Dashboard from "@/components/Dashboard";
import LeadManagement from "@/components/LeadManagement";
import QuoteManagement from "@/components/QuoteManagement";
import CustomerList from "@/components/CustomerList";
import CarrierList from "@/components/CarrierList";
import OrderList from "@/components/OrderList";
import DispatchList from "@/components/DispatchList";
import Invoices from "@/components/Invoices";
import FollowUp from "@/components/FollowUp";

export default function Home() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const permissions = getUserPermissions(user);

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/leads", icon: Users, label: "Leads" },
    { path: "/quotes", icon: FileText, label: "Quotes" },
    { path: "/customers", icon: Users, label: "Customers" },
    { path: "/carriers", icon: Truck, label: "Carriers" },
    { path: "/orders", icon: Package, label: "Orders" },
    { path: "/dispatches", icon: CheckSquare, label: "Dispatches" },
    { path: "/invoices", icon: DollarSign, label: "Invoices" },
    { path: "/followups", icon: CheckSquare, label: "Follow-ups" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-xs bg-white dark:bg-gray-800 h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">EverFlown</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      isActive(item.path)
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:dark:bg-gray-800 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
        <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">EverFlown Logistics</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2 text-gray-500 dark:text-gray-400"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {navItems.find(item => isActive(item.path))?.label || "Dashboard"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user && (
                <div className="flex items-center gap-3">
                  <Card className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <CardContent className="p-0 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {user.firstName || user.username || "User"}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </CardContent>
                  </Card>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/leads" component={LeadManagement} />
            <Route path="/quotes" component={QuoteManagement} />
            <Route path="/customers" component={CustomerList} />
            <Route path="/carriers" component={CarrierList} />
            <Route path="/orders" component={OrderList} />
            <Route path="/dispatches" component={DispatchList} />
            <Route path="/invoices" component={Invoices} />
            <Route path="/followups" component={FollowUp} />
          </Switch>
        </main>
      </div>
    </div>
  );
}
