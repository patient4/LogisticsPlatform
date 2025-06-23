import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lead } from "@/types/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

interface EditLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export default function EditLeadModal({ open, onOpenChange, lead }: EditLeadModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    companyName: lead.companyName,
    contactPerson: lead.contactPerson,
    email: lead.email || "",
    phone: lead.phone || "",
    status: lead.status,
    originCity: lead.originCity || "",
    originState: lead.originState || "",
    destinationCity: lead.destinationCity || "",
    destinationState: lead.destinationState || "",
    commodity: lead.commodity || "",
    equipmentType: lead.equipmentType || "",
    weight: lead.weight?.toString() || "",
    notes: lead.notes || "",
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        companyName: lead.companyName,
        contactPerson: lead.contactPerson,
        email: lead.email || "",
        phone: lead.phone || "",
        status: lead.status,
        originCity: lead.originCity || "",
        originState: lead.originState || "",
        destinationCity: lead.destinationCity || "",
        destinationState: lead.destinationState || "",
        commodity: lead.commodity || "",
        equipmentType: lead.equipmentType || "",
        weight: lead.weight?.toString() || "",
        notes: lead.notes || "",
      });
    }
  }, [lead]);

  const updateLeadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("PUT", `/api/leads/${lead.id}`, {
        ...data,
        weight: data.weight ? parseInt(data.weight) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      onOpenChange(false);
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
        description: "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLeadMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Edit Lead - {lead.companyName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-300">
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="contactName" className="text-gray-700 dark:text-gray-300">
                Contact Name *
              </Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                required
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">
                Status *
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="equipmentType" className="text-gray-700 dark:text-gray-300">
                Equipment Type
              </Label>
              <Select value={formData.equipmentType} onValueChange={(value) => handleInputChange("equipmentType", value)}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="Dry Van">Dry Van</SelectItem>
                  <SelectItem value="Reefer">Reefer</SelectItem>
                  <SelectItem value="Flatbed">Flatbed</SelectItem>
                  <SelectItem value="Step Deck">Step Deck</SelectItem>
                  <SelectItem value="Lowboy">Lowboy</SelectItem>
                  <SelectItem value="Power Only">Power Only</SelectItem>
                  <SelectItem value="Box Truck">Box Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="originCity" className="text-gray-700 dark:text-gray-300">
                Origin City
              </Label>
              <Input
                id="originCity"
                value={formData.originCity}
                onChange={(e) => handleInputChange("originCity", e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="originState" className="text-gray-700 dark:text-gray-300">
                Origin State
              </Label>
              <Input
                id="originState"
                value={formData.originState}
                onChange={(e) => handleInputChange("originState", e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="destinationCity" className="text-gray-700 dark:text-gray-300">
                Destination City
              </Label>
              <Input
                id="destinationCity"
                value={formData.destinationCity}
                onChange={(e) => handleInputChange("destinationCity", e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="destinationState" className="text-gray-700 dark:text-gray-300">
                Destination State
              </Label>
              <Input
                id="destinationState"
                value={formData.destinationState}
                onChange={(e) => handleInputChange("destinationState", e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="commodity" className="text-gray-700 dark:text-gray-300">
                Commodity
              </Label>
              <Input
                id="commodity"
                value={formData.commodity}
                onChange={(e) => handleInputChange("commodity", e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="weight" className="text-gray-700 dark:text-gray-300">
                Weight (lbs)
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 dark:border-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateLeadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updateLeadMutation.isPending ? "Updating..." : "Update Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}