import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Home, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function LeadsPage() {
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['/api/leads'],
  });

  const addLeadMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/leads', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      setIsAddLeadModalOpen(false);
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
      toast({ title: "Success", description: "Lead added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
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
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete lead');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({ title: "Success", description: "Lead deleted successfully" });
    },
    onError: (error: any) => {
      console.error('Delete lead error:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete lead", 
        variant: "destructive" 
      });
    },
  });

  const handleAddLead = () => {
    addLeadMutation.mutate(leadForm);
  };

  const handleEditLead = (lead: any) => {
    setSelectedLead(lead);
    setLeadForm({
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
      updateLeadMutation.mutate({ id: selectedLead.id, ...leadForm });
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
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'quoted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'won': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'lost': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <div className="text-gray-300">|</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage potential customers and prospects</p>
          </div>
          <Button 
            onClick={() => setIsAddLeadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Filter and Search */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
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
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">All Leads ({filteredLeads.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading leads...</div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No leads found. Add your first lead to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Equipment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredLeads.map((lead: any) => (
                        <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.companyName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900 dark:text-white">{lead.contactPerson}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{lead.phone}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {lead.originCity && lead.destinationCity ? 
                              `${lead.originCity}, ${lead.originState} → ${lead.destinationCity}, ${lead.destinationState}` :
                              'Not specified'
                            }
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {lead.equipmentType || 'Not specified'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(lead.status || 'new')}>
                              {(lead.status || 'new').charAt(0).toUpperCase() + (lead.status || 'new').slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditLead(lead)}
                              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteLeadMutation.mutate(lead.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-600 dark:hover:bg-gray-700"
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
      <Dialog open={isAddLeadModalOpen} onOpenChange={setIsAddLeadModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Add New Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="dark:text-gray-300">Company Name *</Label>
              <Input
                value={leadForm.companyName}
                onChange={(e) => setLeadForm({...leadForm, companyName: e.target.value})}
                placeholder="ABC Company"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="dark:text-gray-300">Contact Person *</Label>
              <Input
                value={leadForm.contactPerson}
                onChange={(e) => setLeadForm({...leadForm, contactPerson: e.target.value})}
                placeholder="John Smith"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-gray-300">Phone *</Label>
              <Input
                value={leadForm.phone}
                onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                placeholder="(555) 123-4567"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email *</Label>
              <Input
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                placeholder="john@company.com"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originCity" className="dark:text-gray-300">Origin City</Label>
              <Input
                value={leadForm.originCity}
                onChange={(e) => setLeadForm({...leadForm, originCity: e.target.value})}
                placeholder="Chicago"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originState" className="dark:text-gray-300">Origin State</Label>
              <Input
                value={leadForm.originState}
                onChange={(e) => setLeadForm({...leadForm, originState: e.target.value})}
                placeholder="IL"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationCity" className="dark:text-gray-300">Destination City</Label>
              <Input
                value={leadForm.destinationCity}
                onChange={(e) => setLeadForm({...leadForm, destinationCity: e.target.value})}
                placeholder="Denver"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationState" className="dark:text-gray-300">Destination State</Label>
              <Input
                value={leadForm.destinationState}
                onChange={(e) => setLeadForm({...leadForm, destinationState: e.target.value})}
                placeholder="CO"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="equipmentType" className="dark:text-gray-300">Equipment Type</Label>
              <Select value={leadForm.equipmentType} onValueChange={(value) => setLeadForm({...leadForm, equipmentType: value})}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectItem value="dry_van">Dry Van</SelectItem>
                  <SelectItem value="reefer">Reefer</SelectItem>
                  <SelectItem value="flatbed">Flatbed</SelectItem>
                  <SelectItem value="step_deck">Step Deck</SelectItem>
                  <SelectItem value="lowboy">Lowboy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes" className="dark:text-gray-300">Notes</Label>
              <Input
                value={leadForm.notes}
                onChange={(e) => setLeadForm({...leadForm, notes: e.target.value})}
                placeholder="Additional notes..."
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsAddLeadModalOpen(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleAddLead}
              disabled={addLeadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {addLeadMutation.isPending ? 'Adding...' : 'Add Lead'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="dark:text-gray-300">Company Name *</Label>
              <Input
                value={leadForm.companyName}
                onChange={(e) => setLeadForm({...leadForm, companyName: e.target.value})}
                placeholder="ABC Company"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="dark:text-gray-300">Contact Person *</Label>
              <Input
                value={leadForm.contactPerson}
                onChange={(e) => setLeadForm({...leadForm, contactPerson: e.target.value})}
                placeholder="John Smith"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-gray-300">Phone *</Label>
              <Input
                value={leadForm.phone}
                onChange={(e) => setLeadForm({...leadForm, phone: e.target.value})}
                placeholder="(555) 123-4567"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email *</Label>
              <Input
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm({...leadForm, email: e.target.value})}
                placeholder="john@company.com"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-700">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateLead}
              disabled={updateLeadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updateLeadMutation.isPending ? 'Updating...' : 'Update Lead'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}