import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AddLeadModal from "./modals/AddLeadModal";

export default function LeadsQuotes() {
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editForm, setEditForm] = useState({
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

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['/api/leads'],
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['/api/quotes'],
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PUT', `/api/leads/${data.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setEditModalOpen(false);
      toast({ title: "Success", description: "Lead updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/leads/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({ title: "Success", description: "Lead deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/quotes/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      toast({ title: "Success", description: "Quote deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEditLead = (lead: any) => {
    setSelectedLead(lead);
    setEditForm({
      companyName: lead.companyName || '',
      contactPerson: lead.contactPerson || '',
      phone: lead.phone || '',
      email: lead.email || '',
      originCity: lead.originCity || '',
      originState: lead.originState || '',
      destinationCity: lead.destinationCity || '',
      destinationState: lead.destinationState || '',
      equipmentType: lead.equipmentType || '',
      notes: lead.notes || ''
    });
    setEditModalOpen(true);
  };

  const handleUpdateLead = () => {
    if (selectedLead) {
      updateLeadMutation.mutate({ id: selectedLead.id, ...editForm });
    }
  };

  const filteredLeads = Array.isArray(leads) ? leads.filter((lead: any) => {
    const matchesSearch = 
      lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-purple-100 text-purple-800';
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leads & Quotes</h2>
            <p className="text-gray-600">Manage potential customers and price quotes</p>
          </div>
          <Button 
            onClick={() => setIsAddLeadModalOpen(true)}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Lead
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
                      placeholder="Search leads..."
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
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Leads</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading leads...</div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No leads found. Add your first lead to get started.
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLeads.map((lead: any) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{lead.companyName}</div>
                              <div className="text-sm text-gray-500">{lead.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{lead.contactPerson}</div>
                              <div className="text-sm text-gray-500">{lead.phone}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.originCity && lead.destinationCity ? 
                              `${lead.originCity}, ${lead.originState} → ${lead.destinationCity}, ${lead.destinationState}` :
                              'Not specified'
                            }
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {lead.equipmentType || 'Not specified'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(lead.status || 'new')}>
                              {getStatusLabel(lead.status || 'new')}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditLead(lead)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteLeadMutation.mutate(lead.id)}
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

          {/* Quotes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {Array.isArray(quotes) && quotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No quotes found. Create your first quote to get started.
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(quotes) && quotes.map((quote: any) => (
                        <tr key={quote.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {quote.quoteNumber}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {quote.originCity}, {quote.originState} → {quote.destinationCity}, {quote.destinationState}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {quote.equipmentType}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${parseFloat(quote.quotedRate || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {quote.validUntil}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(quote.status || 'draft')}>
                              {getStatusLabel(quote.status || 'draft')}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteQuoteMutation.mutate(quote.id)}
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

      {/* Add Lead Modal */}
      <AddLeadModal
        open={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
      />

      {/* Edit Lead Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
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
              onClick={handleUpdateLead}
              disabled={updateLeadMutation.isPending}
            >
              {updateLeadMutation.isPending ? 'Updating...' : 'Update Lead'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}