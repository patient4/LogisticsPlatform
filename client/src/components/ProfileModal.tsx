import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { User, Edit, Save, X, Key, Shield } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    role: user?.role || "user",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("PUT", `/api/users/${user?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
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

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      await apiRequest("PUT", `/api/users/${user?.id}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      setShowPasswordChange(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Success",
        description: "Password changed successfully",
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

  const handleSave = () => {
    if (!formData.username.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Username and email are required",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate(passwordData);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      role: user?.role || "user",
    });
    setIsEditing(false);
    setShowPasswordChange(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "broker":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <User className="h-5 w-5" />
            Profile Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Information */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="bg-background hover:bg-accent"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="bg-background hover:bg-accent"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Role</Label>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(formData.role)}`}>
                  {formData.role.toUpperCase()}
                </span>
                {user?.role === "admin" && isEditing && (
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="w-32 bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-foreground">Security</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="bg-background hover:bg-accent"
              >
                <Key className="h-4 w-4 mr-1" />
                Change Password
              </Button>
            </div>

            {showPasswordChange && (
              <div className="space-y-4 bg-muted p-4 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-background border-border"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={changePasswordMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Update Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="bg-background hover:bg-accent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="text-lg font-medium text-foreground">Account Actions</h3>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  logoutMutation.mutate();
                  onOpenChange(false);
                }}
                disabled={logoutMutation.isPending}
              >
                Sign Out
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-background hover:bg-accent"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}