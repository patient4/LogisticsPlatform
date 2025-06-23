import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AuthPage from "@/pages/auth-page";
import UserManagement from "@/pages/UserManagement";
import ProfilePage from "@/pages/ProfilePage";
import LeadsPage from "@/pages/LeadsPage";
import QuotesPage from "@/pages/QuotesPage";
import InvoicesPage from "@/pages/InvoicesPage";
import SettingsPage from "@/pages/SettingsPage";
import LeadsQuotes from "@/components/LeadsQuotes";
import CustomerList from "@/components/CustomerList";
import CarrierList from "@/components/CarrierList";
import OrderList from "@/components/OrderList";
import DispatchList from "@/components/DispatchList";
import Invoices from "@/components/Invoices";
import FollowUp from "@/components/FollowUp";
import { ThemeProvider } from "next-themes";

function Router() {
  const { user, isLoading } = useAuth();
  
  console.log("Router: user =", user, "isLoading =", isLoading);

  if (isLoading) {
    console.log("Router: showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log("Router: rendering routes, user authenticated =", !!user);

  return (
    <Switch>
      {!user ? (
        <>
          <Route path="/" component={AuthPage} />
          <Route path="/auth" component={AuthPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/leads" component={LeadsPage} />
          <Route path="/quotes" component={QuotesPage} />
          <Route path="/leads-quotes" component={LeadsQuotes} />
          <Route path="/customers" component={CustomerList} />
          <Route path="/carriers" component={CarrierList} />
          <Route path="/orders" component={OrderList} />
          <Route path="/dispatches" component={DispatchList} />
          <Route path="/invoices" component={InvoicesPage} />
          <Route path="/followups" component={FollowUp} />
          <Route path="/users" component={UserManagement} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/settings" component={SettingsPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
