import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Home, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function QuotesPage() {
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [quoteForm, setQuoteForm] = useState({
    quoteNumber: `QT-${Date.now()}`,
    originCity: '',
    originState: '',
    destinationCity: '',
    destinationState: '',
    equipmentType: '',
    weight: '',
    distance: '',
    commodity: '',
    quotedRate: '',
    validUntil: '',
    notes: ''
  });

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['/api/quotes'],
  });

  const addQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/quotes', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setIsAddQuoteModalOpen(false);
      setQuoteForm({
        quoteNumber: `QT-${Date.now()}`,
        originCity: '',
        originState: '',
        destinationCity: '',
        destinationState: '',
        equipmentType: '',
        weight: '',
        distance: '',
        commodity: '',
        quotedRate: '',
        validUntil: '',
        notes: ''
      });
      toast({ title: "Success", description: "Quote created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      // Clean numeric fields - convert empty strings to proper values
      const cleanedData = { ...data };
      
      // Handle quotedRate - required field, convert to number
      if (cleanedData.quotedRate === '' || cleanedData.quotedRate === null) {
        cleanedData.quotedRate = '0';
      } else if (typeof cleanedData.quotedRate === 'number') {
        cleanedData.quotedRate = cleanedData.quotedRate.toString();
      }
      
      // Handle optional numeric fields - remove if empty
      if (cleanedData.weight === '' || cleanedData.weight === null || cleanedData.weight === undefined) {
        delete cleanedData.weight;
      }
      
      if (cleanedData.distance === '' || cleanedData.distance === null || cleanedData.distance === undefined) {
        delete cleanedData.distance;
      }
      
      console.log('Updating quote with cleaned data:', cleanedData);
      const res = await apiRequest('PUT', `/api/quotes/${data.id}`, cleanedData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setEditModalOpen(false);
      toast({ title: "Success", description: "Quote updated successfully" });
    },
    onError: (error: any) => {
      console.error('Quote update error:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update quote", 
        variant: "destructive" 
      });
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/quotes/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete quote');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      toast({ title: "Success", description: "Quote deleted successfully" });
    },
    onError: (error: any) => {
      console.error('Delete quote error:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete quote", 
        variant: "destructive" 
      });
    },
  });

  const handleAddQuote = () => {
    addQuoteMutation.mutate(quoteForm);
  };

  const handleEditQuote = (quote: any) => {
    setSelectedQuote(quote);
    setQuoteForm({
      quoteNumber: quote.quoteNumber || '',
      originCity: quote.originCity || '',
      originState: quote.originState || '',
      destinationCity: quote.destinationCity || '',
      destinationState: quote.destinationState || '',
      equipmentType: quote.equipmentType || '',
      weight: quote.weight || '',
      distance: quote.distance || '',
      commodity: quote.commodity || '',
      quotedRate: quote.quotedRate || '',
      validUntil: quote.validUntil || '',
      notes: quote.notes || ''
    });
    setEditModalOpen(true);
  };

  const handleUpdateQuote = () => {
    if (selectedQuote) {
      updateQuoteMutation.mutate({ id: selectedQuote.id, ...quoteForm });
    }
  };

  const handleDownloadPDF = async (quoteId: number) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`, {
        credentials: 'include'
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quote-${quoteId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast({ title: "Success", description: "Quote PDF downloaded successfully" });
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to download PDF", variant: "destructive" });
    }
  };

  const handleAcceptQuote = async (quote: any) => {
    try {
      // Create order from quote data
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        leadId: quote.leadId,
        customerId: quote.customerId,
        originAddress: "123 Origin St",
        originCity: quote.originCity,
        originState: quote.originState,
        originZipCode: "12345",
        destinationAddress: "456 Destination Ave",
        destinationCity: quote.destinationCity,
        destinationState: quote.destinationState,
        destinationZipCode: "67890",
        pickupDate: quote.pickupDate || new Date().toISOString().split('T')[0],
        deliveryDate: quote.deliveryDate,
        equipmentType: quote.equipmentType,
        weight: quote.weight,
        commodity: quote.commodity || "General Freight",
        customerRate: parseFloat(quote.quotedRate) || 0,
        status: "needs_truck"
      };

      const res = await apiRequest('POST', '/api/orders', orderData);
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        toast({ 
          title: "Success", 
          description: `Order ${orderData.orderNumber} created from quote ${quote.quoteNumber}` 
        });
      }
    } catch (error: any) {
      console.error('Accept quote error:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create order from quote", 
        variant: "destructive" 
      });
    }
  };

  const filteredQuotes = Array.isArray(quotes) ? quotes.filter((quote: any) => {
    const matchesSearch = 
      quote.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.originCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.destinationCity?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expired': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotes Management</h1>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quotes</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage price quotes and proposals</p>
          </div>
          <Button 
            onClick={() => setIsAddQuoteModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Quote
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
                      placeholder="Search quotes..."
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotes Table */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">All Quotes ({filteredQuotes.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading quotes...</div>
              ) : filteredQuotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No quotes found. Create your first quote to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quote #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Equipment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valid Until</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredQuotes.map((quote: any) => (
                        <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {quote.quoteNumber}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {quote.originCity}, {quote.originState} → {quote.destinationCity}, {quote.destinationState}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {quote.equipmentType}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            ${parseFloat(quote.quotedRate || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {quote.validUntil}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={getStatusColor(quote.status || 'draft')}>
                              {(quote.status || 'draft').charAt(0).toUpperCase() + (quote.status || 'draft').slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPDF(quote.id)}
                              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              PDF
                            </Button>
                            {quote.status !== 'accepted' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAcceptQuote(quote)}
                                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                              >
                                Accept
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditQuote(quote)}
                              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteQuoteMutation.mutate(quote.id)}
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

      {/* Add Quote Modal */}
      <Dialog open={isAddQuoteModalOpen} onOpenChange={setIsAddQuoteModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Create New Quote</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quoteNumber" className="dark:text-gray-300">Quote Number *</Label>
              <Input
                value={quoteForm.quoteNumber}
                onChange={(e) => setQuoteForm({...quoteForm, quoteNumber: e.target.value})}
                placeholder="QT-2024-001"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originCity" className="dark:text-gray-300">Origin City *</Label>
              <Input
                value={quoteForm.originCity}
                onChange={(e) => setQuoteForm({...quoteForm, originCity: e.target.value})}
                placeholder="Chicago"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originState" className="dark:text-gray-300">Origin State *</Label>
              <Input
                value={quoteForm.originState}
                onChange={(e) => setQuoteForm({...quoteForm, originState: e.target.value})}
                placeholder="IL"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationCity" className="dark:text-gray-300">Destination City *</Label>
              <Input
                value={quoteForm.destinationCity}
                onChange={(e) => setQuoteForm({...quoteForm, destinationCity: e.target.value})}
                placeholder="Denver"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationState" className="dark:text-gray-300">Destination State *</Label>
              <Input
                value={quoteForm.destinationState}
                onChange={(e) => setQuoteForm({...quoteForm, destinationState: e.target.value})}
                placeholder="CO"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipmentType" className="dark:text-gray-300">Equipment Type *</Label>
              <Select value={quoteForm.equipmentType} onValueChange={(value) => setQuoteForm({...quoteForm, equipmentType: value})}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select equipment" />
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
            <div className="space-y-2">
              <Label htmlFor="weight" className="dark:text-gray-300">Weight (lbs)</Label>
              <Input
                value={quoteForm.weight}
                onChange={(e) => setQuoteForm({...quoteForm, weight: e.target.value})}
                placeholder="40000"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance" className="dark:text-gray-300">Distance (miles)</Label>
              <Input
                value={quoteForm.distance}
                onChange={(e) => setQuoteForm({...quoteForm, distance: e.target.value})}
                placeholder="500"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commodity" className="dark:text-gray-300">Commodity</Label>
              <Input
                value={quoteForm.commodity}
                onChange={(e) => setQuoteForm({...quoteForm, commodity: e.target.value})}
                placeholder="General freight"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quotedRate" className="dark:text-gray-300">Quoted Rate ($) *</Label>
              <Input
                value={quoteForm.quotedRate}
                onChange={(e) => setQuoteForm({...quoteForm, quotedRate: e.target.value})}
                placeholder="2500"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil" className="dark:text-gray-300">Valid Until *</Label>
              <Input
                type="date"
                value={quoteForm.validUntil}
                onChange={(e) => setQuoteForm({...quoteForm, validUntil: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="notes" className="dark:text-gray-300">Notes</Label>
              <Input
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                placeholder="Additional notes..."
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsAddQuoteModalOpen(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleAddQuote}
              disabled={addQuoteMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {addQuoteMutation.isPending ? 'Creating...' : 'Create Quote'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Quote Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Quote</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quotedRate" className="dark:text-gray-300">Quoted Rate ($) *</Label>
              <Input
                value={quoteForm.quotedRate}
                onChange={(e) => setQuoteForm({...quoteForm, quotedRate: e.target.value})}
                placeholder="2500"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil" className="dark:text-gray-300">Valid Until *</Label>
              <Input
                type="date"
                value={quoteForm.validUntil}
                onChange={(e) => setQuoteForm({...quoteForm, validUntil: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="notes" className="dark:text-gray-300">Notes</Label>
              <Input
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                placeholder="Additional notes..."
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-700">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateQuote}
              disabled={updateQuoteMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updateQuoteMutation.isPending ? 'Updating...' : 'Update Quote'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}