import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Home, User, Lock, Edit, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PUT', `/api/users/${user?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setIsEditingProfile(false);
      toast({ title: "Success", description: "Profile updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PUT', `/api/users/${user?.id}/password`, data);
      return res.json();
    },
    onSuccess: () => {
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast({ title: "Success", description: "Password changed successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(profileForm);
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'broker': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'user': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Information */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</Label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</Label>
                  <div className="mt-1">
                    <Badge className={getRoleBadgeColor(user?.role || 'user')}>
                      {(user?.role || 'user').charAt(0).toUpperCase() + (user?.role || 'user').slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</Label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.firstName || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</Label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.lastName || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</Label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.email || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</Label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Lock className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Password</Label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-900 dark:text-white">••••••••••••</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsChangingPassword(true)}
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="dark:text-gray-300">First Name</Label>
              <Input
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                placeholder="John"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="dark:text-gray-300">Last Name</Label>
              <Input
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                placeholder="Smith"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
              <Input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                placeholder="john@company.com"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <DialogContent className="max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="dark:text-gray-300">Current Password</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                placeholder="Enter current password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="dark:text-gray-300">New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                placeholder="Enter new password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-gray-300">Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsChangingPassword(false)} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Lock className="w-4 h-4 mr-2" />
              {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}