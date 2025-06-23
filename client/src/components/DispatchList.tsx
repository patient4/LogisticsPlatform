import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, CheckCircle, Truck, AlertCircle, Download, Edit, Trash2, MapPin, Calendar, DollarSign } from "lucide-react";

interface Dispatch {
  id: number;
  orderNumber: string;
  status: "assigned" | "in_transit" | "delivered" | "cancelled";
  carrierName: string;
  carrierMC: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  pickupDate: string;
  deliveryDate?: string;
  rate: number;
  notes?: string;
  createdAt: string;
}

export default function DispatchList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: dispatches, isLoading } = useQuery({
    queryKey: ['/api/dispatches'],
  });

  const updateDispatchMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `/api/dispatches/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dispatches"] });
      toast({
        title: "Success",
        description: "Dispatch status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",  
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDispatchMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/dispatches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dispatches"] });
      toast({
        title: "Success",
        description: "Dispatch deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive", 
      });
    },
  });

  const filteredDispatches = Array.isArray(dispatches) ? dispatches.filter((dispatch: Dispatch) => {
    const matchesSearch = 
      dispatch.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.carrierName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dispatch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const handleStatusUpdate = (id: number, status: string) => {
    updateDispatchMutation.mutate({ id, status });
  };

  const handleDownloadRateConfirmation = async (id: number) => {
    try {
      const response = await fetch(`/api/dispatches/${id}/rate-confirmation`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to download rate confirmation");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `rate-confirmation-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download rate confirmation",
        variant: "destructive",
      });
    }
  };

  const handleEditDispatch = (dispatch: Dispatch) => {
    toast({
      title: "Edit Dispatch",
      description: "Edit functionality will be implemented soon",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Clock className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Dispatch Management</h1>
        <Badge variant="outline" className="text-sm">
          {filteredDispatches.length} dispatches
        </Badge>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by order number or carrier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-background border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDispatches.map((dispatch: Dispatch) => (
            <Card key={dispatch.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-card-foreground">
                    Order #{dispatch.orderNumber}
                  </CardTitle>
                  <Badge className={getStatusColor(dispatch.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(dispatch.status)}
                      {dispatch.status.replace("_", " ").toUpperCase()}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span className="font-medium">{dispatch.carrierName}</span>
                    <span className="text-xs">MC: {dispatch.carrierMC}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{dispatch.originCity}, {dispatch.originState}</span>
                    <span>→</span>
                    <span>{dispatch.destinationCity}, {dispatch.destinationState}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Pickup: {dispatch.pickupDate}</span>
                  </div>
                  
                  {dispatch.deliveryDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Delivery: {dispatch.deliveryDate}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>${dispatch.rate.toLocaleString()}</span>
                  </div>
                </div>

                {dispatch.notes && (
                  <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    {dispatch.notes}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  {dispatch.status === "assigned" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(dispatch.id, "in_transit")}
                      disabled={updateDispatchMutation.isPending}
                      className="bg-background hover:bg-accent"
                    >
                      Start Transit
                    </Button>
                  )}
                  
                  {dispatch.status === "in_transit" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(dispatch.id, "delivered")}
                      disabled={updateDispatchMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Mark Delivered
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadRateConfirmation(dispatch.id)}
                    className="bg-background hover:bg-accent"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Rate Confirmation
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditDispatch(dispatch)}
                    className="bg-background hover:bg-accent"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteDispatchMutation.mutate(dispatch.id)}
                    disabled={deleteDispatchMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredDispatches.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No Dispatches Found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria." 
              : "Dispatches will appear here when orders are assigned to carriers."}
          </p>
        </div>
      )}
    </div>
  );
}