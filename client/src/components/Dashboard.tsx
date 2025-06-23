import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ClipboardList, 
  Truck, 
  File, 
  DollarSign,
  Plus,
  Bell,
  UserPlus,
  TruckIcon
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [newQuoteOpen, setNewQuoteOpen] = useState(false);
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
  });

  const { data: urgentTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/followups/urgent'],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['/api/customers'],
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['/api/leads'],
  });

  // Form states
  const [orderForm, setOrderForm] = useState({
    customerId: '',
    originCompany: '',
    originAddress: '',
    originCity: '',
    originState: '',
    originZipCode: '',
    destinationCompany: '',
    destinationAddress: '',
    destinationCity: '',
    destinationState: '',
    destinationZipCode: '',
    pickupDate: '',
    customerRate: '',
    weight: '',
    commodity: '',
    equipmentType: 'Dry Van'
  });

  const [leadForm, setLeadForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    originCity: '',
    originState: '',
    destinationCity: '',
    destinationState: '',
    equipmentType: '',
    notes: ''
  });

  const [quoteForm, setQuoteForm] = useState({
    leadId: '',
    originCity: '',
    originState: '',
    destinationCity: '',
    destinationState: '',
    pickupDate: '',
    quotedRate: '',
    weight: '',
    commodity: '',
    equipmentType: 'Dry Van',
    validUntil: ''
  });

  const [customerForm, setCustomerForm] = useState({
    company: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentTerms: '30'
  });

  // Mutations
  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/orders', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setNewOrderOpen(false);
      setOrderForm({
        customerId: '',
        originCompany: '',
        originAddress: '',
        originCity: '',
        originState: '',
        originZipCode: '',
        destinationCompany: '',
        destinationAddress: '',
        destinationCity: '',
        destinationState: '',
        destinationZipCode: '',
        pickupDate: '',
        customerRate: '',
        weight: '',
        commodity: '',
        equipmentType: 'Dry Van'
      });
      toast({ title: "Success", description: "Order created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/leads', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setNewLeadOpen(false);
      setLeadForm({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        originCity: '',
        originState: '',
        destinationCity: '',
        destinationState: '',
        equipmentType: '',
        notes: ''
      });
      toast({ title: "Success", description: "Lead created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const createQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/quotes', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setNewQuoteOpen(false);
      setQuoteForm({
        leadId: '',
        originCity: '',
        originState: '',
        destinationCity: '',
        destinationState: '',
        pickupDate: '',
        quotedRate: '',
        weight: '',
        commodity: '',
        equipmentType: 'Dry Van',
        validUntil: ''
      });
      toast({ title: "Success", description: "Quote created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/customers', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      setNewCustomerOpen(false);
      setCustomerForm({
        company: '',
        contactName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentTerms: '30'
      });
      toast({ title: "Success", description: "Customer created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'bg-green-100 text-green-800';
      case 'needs_truck':
        return 'bg-yellow-100 text-yellow-800';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'In Transit';
      case 'needs_truck':
        return 'Needs Truck';
      case 'dispatched':
        return 'Dispatched';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Overview of your freight operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select value={orderForm.customerId} onValueChange={(value) => setOrderForm({...orderForm, customerId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(customers) && customers.map((customer: any) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.companyName || customer.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipment Type</Label>
                    <Select value={orderForm.equipmentType} onValueChange={(value) => setOrderForm({...orderForm, equipmentType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dry Van">Dry Van</SelectItem>
                        <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="Flatbed">Flatbed</SelectItem>
                        <SelectItem value="Step Deck">Step Deck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Origin Information */}
                  <div className="space-y-2 col-span-2">
                    <Label className="text-base font-semibold">Origin Details</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originCompany">Origin Company</Label>
                    <Input
                      value={orderForm.originCompany}
                      onChange={(e) => setOrderForm({...orderForm, originCompany: e.target.value})}
                      placeholder="ABC Warehouse"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originAddress">Origin Address *</Label>
                    <Input
                      value={orderForm.originAddress}
                      onChange={(e) => setOrderForm({...orderForm, originAddress: e.target.value})}
                      placeholder="123 Industrial Blvd"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originCity">Origin City *</Label>
                    <Input
                      value={orderForm.originCity}
                      onChange={(e) => setOrderForm({...orderForm, originCity: e.target.value})}
                      placeholder="Los Angeles"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originState">Origin State *</Label>
                    <Input
                      value={orderForm.originState}
                      onChange={(e) => setOrderForm({...orderForm, originState: e.target.value})}
                      placeholder="CA"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originZipCode">Origin ZIP Code *</Label>
                    <Input
                      value={orderForm.originZipCode}
                      onChange={(e) => setOrderForm({...orderForm, originZipCode: e.target.value})}
                      placeholder="90210"
                      required
                    />
                  </div>
                  
                  {/* Destination Information */}
                  <div className="space-y-2 col-span-2">
                    <Label className="text-base font-semibold">Destination Details</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationCompany">Destination Company</Label>
                    <Input
                      value={orderForm.destinationCompany}
                      onChange={(e) => setOrderForm({...orderForm, destinationCompany: e.target.value})}
                      placeholder="XYZ Distribution"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationAddress">Destination Address *</Label>
                    <Input
                      value={orderForm.destinationAddress}
                      onChange={(e) => setOrderForm({...orderForm, destinationAddress: e.target.value})}
                      placeholder="456 Commerce St"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationCity">Destination City *</Label>
                    <Input
                      value={orderForm.destinationCity}
                      onChange={(e) => setOrderForm({...orderForm, destinationCity: e.target.value})}
                      placeholder="Chicago"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationState">Destination State *</Label>
                    <Input
                      value={orderForm.destinationState}
                      onChange={(e) => setOrderForm({...orderForm, destinationState: e.target.value})}
                      placeholder="IL"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationZipCode">Destination ZIP Code *</Label>
                    <Input
                      value={orderForm.destinationZipCode}
                      onChange={(e) => setOrderForm({...orderForm, destinationZipCode: e.target.value})}
                      placeholder="60601"
                      required
                    />
                  </div>
                  
                  {/* Order Details */}
                  <div className="space-y-2 col-span-2">
                    <Label className="text-base font-semibold">Order Details</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date *</Label>
                    <Input
                      type="date"
                      value={orderForm.pickupDate}
                      onChange={(e) => setOrderForm({...orderForm, pickupDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerRate">Customer Rate ($) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={orderForm.customerRate}
                      onChange={(e) => setOrderForm({...orderForm, customerRate: e.target.value})}
                      placeholder="2500.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={orderForm.weight}
                      onChange={(e) => setOrderForm({...orderForm, weight: e.target.value})}
                      placeholder="45000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commodity">Commodity</Label>
                    <Input
                      value={orderForm.commodity}
                      onChange={(e) => setOrderForm({...orderForm, commodity: e.target.value})}
                      placeholder="General Freight"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setNewOrderOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => createOrderMutation.mutate(orderForm)}
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5 text-gray-400" />
                {Array.isArray(urgentTasks) && urgentTasks.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {statsLoading ? '...' : (stats as any)?.activeOrders || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-600 text-sm font-medium">+12%</span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Transit</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {statsLoading ? '...' : (stats as any)?.inTransit || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-600 text-sm font-medium">+8%</span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Quotes</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {statsLoading ? '...' : (stats as any)?.pendingQuotes || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <File className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-red-600 text-sm font-medium">-3%</span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue MTD</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {statsLoading ? '...' : formatCurrency((stats as any)?.revenue || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-green-600 text-sm font-medium">+24%</span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="link" className="text-primary hover:text-blue-700 text-sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading orders...</div>
                  ) : !Array.isArray(orders) || orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No orders found. Create your first order to get started.
                    </div>
                  ) : (
                    <div className="overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Array.isArray(orders) && orders.slice(0, 5).map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.orderNumber}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {order.customerName || 'Direct Customer'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.originCity}, {order.originState} → {order.destinationCity}, {order.destinationState}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                  {getStatusLabel(order.status)}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatCurrency(parseFloat(order.customerRate || '0'))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions and Urgent Tasks */}
            <div className="space-y-6">
              {/* Urgent Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Urgent Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasksLoading ? (
                    <div className="text-center py-4 text-gray-500">Loading tasks...</div>
                  ) : !Array.isArray(urgentTasks) || urgentTasks.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No urgent tasks at the moment.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Array.isArray(urgentTasks) && urgentTasks.slice(0, 3).map((task: any) => (
                        <div key={task.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            task.priority === 'urgent' ? 'bg-red-500' : 
                            task.priority === 'high' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                            <p className="text-xs text-gray-500">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Dialog open={newLeadOpen} onOpenChange={setNewLeadOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start p-3 h-auto"
                        >
                          <UserPlus className="w-4 h-4 mr-3 text-primary" />
                          <span className="text-sm font-medium text-gray-900">Add New Lead</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Lead</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="companyName">Company Name *</Label>
                            <Input
                              value={leadForm.companyName}
                              onChange={(e) => setLeadForm({...leadForm, companyName: e.target.value})}
                              placeholder="ABC Company"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactPerson">Contact Person *</Label>
                            <Input
                              value={leadForm.contactPerson}
                              onChange={(e) => setLeadForm({...leadForm, contactPerson: e.target.value})}
                              placeholder="John Smith"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              value={leadForm.phone}
                              onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                              placeholder="(555) 123-4567"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              type="email"
                              value={leadForm.email}
                              onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                              placeholder="john@company.com"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="originCity">Origin City</Label>
                            <Input
                              value={leadForm.originCity}
                              onChange={(e) => setLeadForm({...leadForm, originCity: e.target.value})}
                              placeholder="Los Angeles"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="originState">Origin State</Label>
                            <Input
                              value={leadForm.originState}
                              onChange={(e) => setLeadForm({...leadForm, originState: e.target.value})}
                              placeholder="CA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="destinationCity">Destination City</Label>
                            <Input
                              value={leadForm.destinationCity}
                              onChange={(e) => setLeadForm({...leadForm, destinationCity: e.target.value})}
                              placeholder="Chicago"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="destinationState">Destination State</Label>
                            <Input
                              value={leadForm.destinationState}
                              onChange={(e) => setLeadForm({...leadForm, destinationState: e.target.value})}
                              placeholder="IL"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="equipmentType">Equipment Type</Label>
                            <Select value={leadForm.equipmentType} onValueChange={(value) => setLeadForm({...leadForm, equipmentType: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select equipment type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Dry Van">Dry Van</SelectItem>
                                <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                                <SelectItem value="Flatbed">Flatbed</SelectItem>
                                <SelectItem value="Step Deck">Step Deck</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              value={leadForm.notes}
                              onChange={(e) => setLeadForm({...leadForm, notes: e.target.value})}
                              placeholder="Additional information..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setNewLeadOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => createLeadMutation.mutate(leadForm)}
                            disabled={createLeadMutation.isPending}
                          >
                            {createLeadMutation.isPending ? 'Creating...' : 'Create Lead'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={newQuoteOpen} onOpenChange={setNewQuoteOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start p-3 h-auto"
                        >
                          <File className="w-4 h-4 mr-3 text-primary" />
                          <span className="text-sm font-medium text-gray-900">Create Quote</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Quote</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="lead">Lead</Label>
                            <Select value={quoteForm.leadId} onValueChange={(value) => setQuoteForm({...quoteForm, leadId: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lead" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.isArray(leads) && leads.map((lead: any) => (
                                  <SelectItem key={lead.id} value={lead.id.toString()}>
                                    {lead.companyName || lead.company}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quotedRate">Quoted Rate ($) *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={quoteForm.quotedRate}
                              onChange={(e) => setQuoteForm({...quoteForm, quotedRate: e.target.value})}
                              placeholder="2500.00"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="equipmentType">Equipment Type *</Label>
                            <Select value={quoteForm.equipmentType} onValueChange={(value) => setQuoteForm({...quoteForm, equipmentType: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Dry Van">Dry Van</SelectItem>
                                <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                                <SelectItem value="Flatbed">Flatbed</SelectItem>
                                <SelectItem value="Step Deck">Step Deck</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="originCity">Origin City</Label>
                            <Input
                              value={quoteForm.originCity}
                              onChange={(e) => setQuoteForm({...quoteForm, originCity: e.target.value})}
                              placeholder="Los Angeles"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="originState">Origin State</Label>
                            <Input
                              value={quoteForm.originState}
                              onChange={(e) => setQuoteForm({...quoteForm, originState: e.target.value})}
                              placeholder="CA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="destinationCity">Destination City</Label>
                            <Input
                              value={quoteForm.destinationCity}
                              onChange={(e) => setQuoteForm({...quoteForm, destinationCity: e.target.value})}
                              placeholder="Chicago"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="destinationState">Destination State</Label>
                            <Input
                              value={quoteForm.destinationState}
                              onChange={(e) => setQuoteForm({...quoteForm, destinationState: e.target.value})}
                              placeholder="IL"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pickupDate">Pickup Date</Label>
                            <Input
                              type="date"
                              value={quoteForm.pickupDate}
                              onChange={(e) => setQuoteForm({...quoteForm, pickupDate: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="validUntil">Valid Until</Label>
                            <Input
                              type="date"
                              value={quoteForm.validUntil}
                              onChange={(e) => setQuoteForm({...quoteForm, validUntil: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (lbs)</Label>
                            <Input
                              type="number"
                              value={quoteForm.weight}
                              onChange={(e) => setQuoteForm({...quoteForm, weight: e.target.value})}
                              placeholder="45000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="commodity">Commodity</Label>
                            <Input
                              value={quoteForm.commodity}
                              onChange={(e) => setQuoteForm({...quoteForm, commodity: e.target.value})}
                              placeholder="General Freight"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setNewQuoteOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => createQuoteMutation.mutate(quoteForm)}
                            disabled={createQuoteMutation.isPending}
                          >
                            {createQuoteMutation.isPending ? 'Creating...' : 'Create Quote'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={newCustomerOpen} onOpenChange={setNewCustomerOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start p-3 h-auto"
                        >
                          <TruckIcon className="w-4 h-4 mr-3 text-primary" />
                          <span className="text-sm font-medium text-gray-900">Add Customer</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Customer</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">Company Name</Label>
                            <Input
                              value={customerForm.company}
                              onChange={(e) => setCustomerForm({...customerForm, company: e.target.value})}
                              placeholder="ABC Logistics"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactName">Contact Name</Label>
                            <Input
                              value={customerForm.contactName}
                              onChange={(e) => setCustomerForm({...customerForm, contactName: e.target.value})}
                              placeholder="John Smith"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              value={customerForm.phone}
                              onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              type="email"
                              value={customerForm.email}
                              onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                              placeholder="john@company.com"
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              value={customerForm.address}
                              onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                              placeholder="123 Main Street"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              value={customerForm.city}
                              onChange={(e) => setCustomerForm({...customerForm, city: e.target.value})}
                              placeholder="Los Angeles"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              value={customerForm.state}
                              onChange={(e) => setCustomerForm({...customerForm, state: e.target.value})}
                              placeholder="CA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              value={customerForm.zipCode}
                              onChange={(e) => setCustomerForm({...customerForm, zipCode: e.target.value})}
                              placeholder="90210"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
                            <Select value={customerForm.paymentTerms} onValueChange={(value) => setCustomerForm({...customerForm, paymentTerms: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">Net 15</SelectItem>
                                <SelectItem value="30">Net 30</SelectItem>
                                <SelectItem value="45">Net 45</SelectItem>
                                <SelectItem value="60">Net 60</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setNewCustomerOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => createCustomerMutation.mutate(customerForm)}
                            disabled={createCustomerMutation.isPending}
                          >
                            {createCustomerMutation.isPending ? 'Creating...' : 'Create Customer'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="ghost" 
                      className="w-full justify-start p-3 h-auto"
                      onClick={() => setNewOrderOpen(true)}
                    >
                      <ClipboardList className="w-4 h-4 mr-3 text-primary" />
                      <span className="text-sm font-medium text-gray-900">New Order</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
