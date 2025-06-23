import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, TriangleAlert, Truck, Route, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AddOrderModal from "./modals/AddOrderModal";

export default function OrderList() {
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editForm, setEditForm] = useState({
    customerName: '',
    originCity: '',
    originState: '',
    destinationCity: '',
    destinationState: '',
    equipmentType: '',
    rate: '',
    pickupDate: '',
    deliveryDate: ''
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders'],
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PUT', `/api/orders/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setEditModalOpen(false);
      toast({ title: "Success", description: "Order updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/orders/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({ title: "Success", description: "Order deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setEditForm({
      customerName: order.customerName || '',
      originCity: order.originCity || '',
      originState: order.originState || '',
      destinationCity: order.destinationCity || '',
      destinationState: order.destinationState || '',
      equipmentType: order.equipmentType || '',
      rate: order.rate || '',
      pickupDate: order.pickupDate || '',
      deliveryDate: order.deliveryDate || ''
    });
    setEditModalOpen(true);
  };

  const handleUpdateOrder = () => {
    if (selectedOrder) {
      updateOrderMutation.mutate({ id: selectedOrder.id, ...editForm });
    }
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter((order: any) => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.originCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destinationCity?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  // Calculate statistics
  const orderStats = {
    needsTruck: filteredOrders.filter((order: any) => order.status === 'needs_truck').length,
    dispatched: filteredOrders.filter((order: any) => order.status === 'dispatched').length,
    inTransit: filteredOrders.filter((order: any) => order.status === 'in_transit').length,
    delivered: filteredOrders.filter((order: any) => order.status === 'delivered').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needs_truck':
        return 'bg-yellow-100 text-yellow-800';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'needs_truck':
        return 'Needs Truck';
      case 'dispatched':
        return 'Dispatched';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order List</h2>
            <p className="text-gray-600">All confirmed customer loads</p>
          </div>
          <Button 
            onClick={() => {
              console.log('New Order button clicked');
              setIsAddOrderModalOpen(true);
            }}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Order Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Needs Truck</p>
                    <p className="text-2xl font-bold text-warning">{orderStats.needsTruck}</p>
                  </div>
                  <TriangleAlert className="h-6 w-6 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Dispatched</p>
                    <p className="text-2xl font-bold text-primary">{orderStats.dispatched}</p>
                  </div>
                  <Truck className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Transit</p>
                    <p className="text-2xl font-bold text-success">{orderStats.inTransit}</p>
                  </div>
                  <Route className="h-6 w-6 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-gray-600">{orderStats.delivered}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="needs_truck">Needs Truck</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading orders...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "No orders match your search criteria."
                    : "No orders found. Create your first order to get started."
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin → Destination</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.customerName || 'Direct Customer'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <p>{order.originCity}, {order.originState}</p>
                              <p className="text-xs text-gray-400">↓</p>
                              <p>{order.destinationCity}, {order.destinationState}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : 'Not set'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(order.customerRate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteOrderMutation.mutate(order.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
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
      </main>

      <AddOrderModal 
        open={isAddOrderModalOpen}
        onOpenChange={setIsAddOrderModalOpen}
      />

      {/* Edit Order Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                value={editForm.customerName}
                onChange={(e) => setEditForm({...editForm, customerName: e.target.value})}
                placeholder="ABC Company"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="originCity">Origin City *</Label>
                <Input
                  value={editForm.originCity}
                  onChange={(e) => setEditForm({...editForm, originCity: e.target.value})}
                  placeholder="Chicago"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originState">Origin State *</Label>
                <Input
                  value={editForm.originState}
                  onChange={(e) => setEditForm({...editForm, originState: e.target.value})}
                  placeholder="IL"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="destinationCity">Destination City *</Label>
                <Input
                  value={editForm.destinationCity}
                  onChange={(e) => setEditForm({...editForm, destinationCity: e.target.value})}
                  placeholder="Denver"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinationState">Destination State *</Label>
                <Input
                  value={editForm.destinationState}
                  onChange={(e) => setEditForm({...editForm, destinationState: e.target.value})}
                  placeholder="CO"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateOrder}
              disabled={updateOrderMutation.isPending}
            >
              {updateOrderMutation.isPending ? 'Updating...' : 'Update Order'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
