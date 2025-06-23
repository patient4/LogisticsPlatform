import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AddCarrierModal from "./modals/AddCarrierModal";

export default function CarrierList() {
  const [isAddCarrierModalOpen, setIsAddCarrierModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editForm, setEditForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    mcNumber: '',
    dotNumber: '',
    equipmentTypes: '',
    serviceAreas: ''
  });

  const { data: carriers = [], isLoading } = useQuery({
    queryKey: ['/api/carriers'],
  });

  const updateCarrierMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PUT', `/api/carriers/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carriers'] });
      setEditModalOpen(false);
      toast({ title: "Success", description: "Carrier updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteCarrierMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/carriers/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/carriers'] });
      toast({ title: "Success", description: "Carrier deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEditCarrier = (carrier: any) => {
    setSelectedCarrier(carrier);
    setEditForm({
      companyName: carrier.companyName || '',
      contactPerson: carrier.contactPerson || '',
      phone: carrier.phone || '',
      email: carrier.email || '',
      mcNumber: carrier.mcNumber || '',
      dotNumber: carrier.dotNumber || '',
      equipmentTypes: carrier.equipmentTypes || '',
      serviceAreas: carrier.serviceAreas || ''
    });
    setEditModalOpen(true);
  };

  const handleUpdateCarrier = () => {
    if (selectedCarrier) {
      updateCarrierMutation.mutate({ id: selectedCarrier.id, ...editForm });
    }
  };

  const filteredCarriers = Array.isArray(carriers) ? carriers.filter((carrier: any) => {
    const matchesSearch = 
      carrier.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.mcNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && carrier.isActive) ||
      (statusFilter === "inactive" && !carrier.isActive);
    
    return matchesSearch && matchesStatus;
  }) : [];

  const isInsuranceExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isInsuranceExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const formatRating = (rating: string | number) => {
    const num = typeof rating === 'string' ? parseFloat(rating) : rating;
    return num ? num.toFixed(1) : 'N/A';
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Carrier List</h2>
            <p className="text-gray-600">Trucking company database and compliance</p>
          </div>
          <Button 
            onClick={() => setIsAddCarrierModalOpen(true)}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Carrier
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
                      placeholder="Search carriers..."
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

          {/* Carriers Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading carriers...</div>
              ) : filteredCarriers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "No carriers match your search criteria."
                    : "No carriers found. Add your first carrier to get started."
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MC / DOT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCarriers.map((carrier: any) => (
                        <tr key={carrier.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #CR-{carrier.id.toString().padStart(4, '0')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {carrier.companyName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <p className="font-medium">{carrier.contactPerson}</p>
                              <p className="text-gray-500">{carrier.email}</p>
                              <p className="text-gray-500">{carrier.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <p>MC: {carrier.mcNumber || 'N/A'}</p>
                              <p>DOT: {carrier.dotNumber || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              {carrier.insuranceExpiry ? (
                                <>
                                  <span>{new Date(carrier.insuranceExpiry).toLocaleDateString()}</span>
                                  {(isInsuranceExpired(carrier.insuranceExpiry) || isInsuranceExpiringSoon(carrier.insuranceExpiry)) && (
                                    <AlertTriangle className={`w-4 h-4 ml-2 ${
                                      isInsuranceExpired(carrier.insuranceExpiry) ? 'text-red-500' : 'text-yellow-500'
                                    }`} />
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400">Not set</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{formatRating(carrier.performanceRating)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              carrier.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {carrier.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCarrier(carrier)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCarrierMutation.mutate(carrier.id)}
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

      <AddCarrierModal 
        open={isAddCarrierModalOpen}
        onOpenChange={setIsAddCarrierModalOpen}
      />

      {/* Edit Carrier Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Carrier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                value={editForm.companyName}
                onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
                placeholder="ABC Trucking"
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
              onClick={handleUpdateCarrier}
              disabled={updateCarrierMutation.isPending}
            >
              {updateCarrierMutation.isPending ? 'Updating...' : 'Update Carrier'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
