import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileText, Download } from "lucide-react";
import AddLeadModal from "./modals/AddLeadModal";
import AddQuoteModal from "./modals/AddQuoteModal";
import EditQuoteModal from "./modals/EditQuoteModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import type { Lead, Quote } from "@/types/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ImprovedLeadsQuotes() {
  const [showAddLead, setShowAddLead] = useState(false);
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/leads"],
    retry: false,
  });

  const { data: quotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ["/api/quotes"],
    retry: false,
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/quotes/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Success",
        description: "Quote deleted successfully",
      });
      setDeletingQuote(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive",
      });
    },
  });

  const handleDownloadQuotePDF = async (quoteId: number, quoteNumber: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `quote_${quoteNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Quote PDF downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "secondary" as const, label: "New" },
      contacted: { variant: "default" as const, label: "Contacted" },
      quoted: { variant: "outline" as const, label: "Quoted" },
      converted: { variant: "default" as const, label: "Converted" },
      pending: { variant: "secondary" as const, label: "Pending" },
      accepted: { variant: "default" as const, label: "Accepted" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
      expired: { variant: "secondary" as const, label: "Expired" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (leadsLoading || quotesLoading) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leads & Quotes</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage potential customers and freight quotes</p>
      </div>

      {/* Leads Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Leads</h2>
          <Button 
            onClick={() => setShowAddLead(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(leads) && leads.map((lead: Lead) => (
            <Card key={lead.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-900 dark:text-white">{lead.companyName}</CardTitle>
                  {getStatusBadge(lead.status)}
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {lead.contactPerson}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="text-gray-900 dark:text-white">{lead.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="text-gray-900 dark:text-white">{lead.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Route:</span>
                    <span className="text-gray-900 dark:text-white">{lead.originCity}, {lead.originState} → {lead.destinationCity}, {lead.destinationState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Equipment:</span>
                    <span className="text-gray-900 dark:text-white">{lead.equipmentType}</span>
                  </div>
                  {lead.notes && (
                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                      {lead.notes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />

      {/* Quotes Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Quotes</h2>
          <Button 
            onClick={() => setShowAddQuote(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Quote
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(quotes) && quotes.map((quote: Quote) => (
            <Card key={quote.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-900 dark:text-white">{quote.quoteNumber}</CardTitle>
                  {getStatusBadge(quote.status)}
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {quote.originCity}, {quote.originState} → {quote.destinationCity}, {quote.destinationState}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Equipment:</span>
                    <span className="text-gray-900 dark:text-white">{quote.equipmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                    <span className="text-gray-900 dark:text-white">{quote.weight ? `${quote.weight.toLocaleString()} lbs` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Commodity:</span>
                    <span className="text-gray-900 dark:text-white">{quote.commodity || 'General Freight'}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-500 dark:text-gray-400">Rate:</span>
                    <span className="text-green-600 dark:text-green-400">${quote.quotedRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Valid Until:</span>
                    <span className="text-gray-900 dark:text-white">{new Date(quote.validUntil).toLocaleDateString()}</span>
                  </div>
                  {quote.notes && (
                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                      {quote.notes}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadQuotePDF(quote.id, quote.quoteNumber)}
                    className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingQuote(quote)}
                    className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeletingQuote(quote)}
                    className="flex-1 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddLeadModal open={showAddLead} onOpenChange={setShowAddLead} />
      <AddQuoteModal open={showAddQuote} onOpenChange={setShowAddQuote} />
      
      {editingQuote && (
        <EditQuoteModal
          open={!!editingQuote}
          onOpenChange={(open) => !open && setEditingQuote(null)}
          quote={editingQuote}
        />
      )}

      {deletingQuote && (
        <DeleteConfirmModal
          open={!!deletingQuote}
          onOpenChange={(open) => !open && setDeletingQuote(null)}
          onConfirm={() => deleteQuoteMutation.mutate(deletingQuote.id)}
          title="Delete Quote"
          description="Are you sure you want to delete this quote? This action cannot be undone."
          itemName={deletingQuote.quoteNumber}
          isLoading={deleteQuoteMutation.isPending}
        />
      )}
    </div>
  );
}