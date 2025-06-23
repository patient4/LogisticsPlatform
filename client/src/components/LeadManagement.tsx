import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Phone, Mail, Building } from "lucide-react";
import { motion } from "framer-motion";
import AddLeadModal from "./modals/AddLeadModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import type { Lead } from "@/types/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function LeadManagement() {
  const [showAddLead, setShowAddLead] = useState(false);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    retry: false,
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Success",
        description: "Lead deleted successfully",
      });
      setDeletingLead(null);
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "contacted": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "qualified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "lost": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (leadsLoading) {
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track potential customers
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => setShowAddLead(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(leads) && leads.map((lead: Lead, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                    <Building className="w-5 h-5 mr-2 text-primary" />
                    {lead.companyName}
                  </CardTitle>
                  <Badge className={getStatusColor(lead.status || "")}>
                    {lead.status || "New"}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {lead.contactPerson}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {lead.email && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-2" />
                      {lead.email}
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 mr-2" />
                      {lead.phone}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingLead(lead)}
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

      {leads.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No leads yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by adding your first lead to begin tracking potential customers.
          </p>
          <Button onClick={() => setShowAddLead(true)} className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Lead
          </Button>
        </motion.div>
      )}

      <AddLeadModal 
        open={showAddLead} 
        onOpenChange={setShowAddLead} 
      />

      <DeleteConfirmModal
        open={!!deletingLead}
        onOpenChange={() => setDeletingLead(null)}
        onConfirm={() => deletingLead && deleteLeadMutation.mutate(deletingLead.id)}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        itemName={deletingLead?.companyName}
        isLoading={deleteLeadMutation.isPending}
      />
    </div>
  );
}