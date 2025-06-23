import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileText, Download, DollarSign, Calendar, Truck } from "lucide-react";
import { motion } from "framer-motion";
import AddQuoteModal from "./modals/AddQuoteModal";
import EditQuoteModal from "./modals/EditQuoteModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import type { Quote } from "@/types/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function QuoteManagement() {
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes = [], isLoading: quotesLoading } = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
    retry: false,
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/quotes/${id}`);
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
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadPdf = async (quoteId: number) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`);
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `quote-${quoteId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "sent": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "accepted": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "expired": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (quotesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div 
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quote Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage freight quotes
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => setShowAddQuote(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Quote
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(quotes) && quotes.map((quote: Quote, index) => (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary" />
                    {quote.quoteNumber}
                  </CardTitle>
                  <Badge className={getStatusColor(quote.status || "draft")}>
                    {quote.status || "Draft"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {quote.originCity}, {quote.originState} → {quote.destinationCity}, {quote.destinationState}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Rate:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${quote.quotedRate?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 dark:text-gray-400">
                      <Truck className="w-4 h-4 mr-1" />
                      Equipment:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {quote.equipmentType}
                    </span>
                  </div>
                  {quote.validUntil && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        Valid Until:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(quote.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPdf(quote.id)}
                      className="border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingQuote(quote)}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingQuote(quote)}
                      className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {quotes.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No quotes yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by creating your first quote to begin tracking pricing offers.
          </p>
          <Button onClick={() => setShowAddQuote(true)} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Quote
          </Button>
        </motion.div>
      )}

      <AddQuoteModal 
        open={showAddQuote} 
        onOpenChange={setShowAddQuote} 
      />

      <EditQuoteModal
        open={!!editingQuote}
        onOpenChange={() => setEditingQuote(null)}
        quote={editingQuote}
      />

      <DeleteConfirmModal
        open={!!deletingQuote}
        onOpenChange={() => setDeletingQuote(null)}
        onConfirm={() => deletingQuote && deleteQuoteMutation.mutate(deletingQuote.id)}
        title="Delete Quote"
        description="Are you sure you want to delete this quote? This action cannot be undone."
        itemName={deletingQuote?.quoteNumber}
        isLoading={deleteQuoteMutation.isPending}
      />
    </div>
  );
}