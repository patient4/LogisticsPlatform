import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AddCustomerModal from "./modals/AddCustomerModal";

export default function CustomerList() {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editForm, setEditForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    creditLimit: '',
    paymentTerms: ''
  });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['/api/customers'],
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PUT', `/api/customers/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      setEditModalOpen(false);
      toast({ title: "Success", description: "Customer updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/customers/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({ title: "Success", description: "Customer deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setEditForm({
      companyName: customer.companyName || '',
      contactPerson: customer.contactPerson || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zipCode: customer.zipCode || '',
      creditLimit: customer.creditLimit || '',
      paymentTerms: customer.paymentTerms || ''
    });
    setEditModalOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (selectedCustomer) {
      updateCustomerMutation.mutate({ id: selectedCustomer.id, ...editForm });
    }
  };

  const filteredCustomers = Array.isArray(customers) ? customers.filter((customer: any) => {
    const matchesSearch = 
      customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && customer.isActive) ||
      (statusFilter === "inactive" && !customer.isActive);
    
    return matchesSearch && matchesStatus;
  }) : [];

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
            <h2 className="text-2xl font-bold text-gray-900">Customer List</h2>
            <p className="text-gray-600">Manage your customer database</p>
          </div>
          <Button 
            onClick={() => setIsAddCustomerModalOpen(true)}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Filter and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search customers..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading customers...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "No customers match your search criteria."
                    : "No customers found. Add your first customer to get started."
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Limit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCustomers.map((customer: any) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #C-{customer.id.toString().padStart(4, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.companyName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <p className="font-medium">{customer.contactPerson}</p>
                              <p className="text-gray-500">{customer.email}</p>
                              <p className="text-gray-500">{customer.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.city && customer.state 
                              ? `${customer.city}, ${customer.state} ${customer.zipCode || ''}`
                              : 'Location not specified'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {customer.creditLimit ? formatCurrency(customer.creditLimit) : 'Not set'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.paymentTerms || 'Net 30'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              customer.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {customer.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCustomer(customer)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCustomerMutation.mutate(customer.id)}
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

      <AddCustomerModal 
        open={isAddCustomerModalOpen}
        onOpenChange={setIsAddCustomerModalOpen}
      />

      {/* Edit Customer Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                value={editForm.companyName}
                onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
                placeholder="ABC Company"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                value={editForm.contactPerson}
                onChange={(e) => setEditForm({...editForm, contactPerson: e.target.value})}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                placeholder="john@company.com"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCustomer}
              disabled={updateCustomerMutation.isPending}
            >
              {updateCustomerMutation.isPending ? 'Updating...' : 'Update Customer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
