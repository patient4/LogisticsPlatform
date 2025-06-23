import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema, type InsertOrder } from "@/types/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AddOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddOrderModal({ open, onOpenChange }: AddOrderModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log('AddOrderModal - open:', open);

  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
  });

  const form = useForm<InsertOrder>({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      orderNumber: `ORD-${Date.now()}`,
      customerId: undefined,
      leadId: undefined,
      originCompany: "",
      originAddress: "",
      originCity: "",
      originState: "",
      originZipCode: "",
      destinationCompany: "",
      destinationAddress: "",
      destinationCity: "",
      destinationState: "",
      destinationZipCode: "",
      pickupDate: "",
      deliveryDate: "",
      equipmentType: "",
      weight: "",
      commodity: "",
      customerRate: "",
      status: "needs_truck",
      specialInstructions: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: InsertOrder) => {
      await apiRequest("POST", "/api/orders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Success",
        description: "Order created successfully",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertOrder) => {
    createOrderMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Order Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Order Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Number *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers?.map((customer: any) => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              {customer.companyName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Origin Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Origin Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="originCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="originAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Address *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="originCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin City *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin State *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="originZipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin ZIP *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Destination Information */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Destination Information</h4>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="destinationCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Address *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="destinationCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination City *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destinationState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination State *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="destinationZipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination ZIP *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Shipment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="equipmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipment Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select equipment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dry Van">Dry Van</SelectItem>
                          <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                          <SelectItem value="Flatbed">Flatbed</SelectItem>
                          <SelectItem value="Step Deck">Step Deck</SelectItem>
                          <SelectItem value="Container">Container</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commodity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commodity</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Rate *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={createOrderMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createOrderMutation.isPending}
                className="bg-primary hover:bg-blue-700"
              >
                {createOrderMutation.isPending ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
