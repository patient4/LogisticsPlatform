import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Clock, AlertTriangle, CheckCircle, Phone, Mail, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FollowUp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: followUps, isLoading } = useQuery({
    queryKey: ['/api/followups'],
  });

  const { data: urgentFollowUps } = useQuery({
    queryKey: ['/api/followups/urgent'],
  });

  const completeFollowUpMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/followups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          completed: true, 
          completedAt: new Date().toISOString() 
        }),
      });
      if (!response.ok) throw new Error('Failed to complete follow-up');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/followups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/followups/urgent'] });
      toast({
        title: "Success",
        description: "Follow-up marked as completed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete follow-up",
        variant: "destructive",
      });
    },
  });

  const filteredFollowUps = followUps?.filter((followUp: any) => {
    const matchesSearch = 
      followUp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || followUp.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "pending" && !followUp.completed) ||
      (statusFilter === "completed" && followUp.completed);
    
    return matchesSearch && matchesPriority && matchesStatus;
  }) || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Clock className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'meeting':
        return <User className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Follow Up</h2>
            <p className="text-gray-600">Task management and reminders</p>
          </div>
          <Button className="bg-primary hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Follow-up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Urgent Tasks Section */}
          {urgentFollowUps && urgentFollowUps.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-800">Urgent Tasks</h3>
                  <span className="bg-red-200 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {urgentFollowUps.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {urgentFollowUps.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        {getPriorityIcon(task.priority)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          <p className="text-xs text-gray-500">
                            Due: {formatDateTime(task.dueDate)}
                            {isOverdue(task.dueDate) && <span className="text-red-500 ml-1">(Overdue)</span>}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => completeFollowUpMutation.mutate(task.id)}
                        disabled={completeFollowUpMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filter and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search follow-ups..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-ups Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading follow-ups...</div>
              ) : filteredFollowUps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || priorityFilter !== "all" || statusFilter !== "pending" 
                    ? "No follow-ups match your search criteria."
                    : "No follow-ups found. Create your first follow-up task to get started."
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFollowUps.map((followUp: any) => (
                        <tr key={followUp.id} className={`hover:bg-gray-50 ${
                          isOverdue(followUp.dueDate) && !followUp.completed ? 'bg-red-50' : ''
                        }`}>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div>
                              <p className="font-medium">{followUp.title}</p>
                              {followUp.description && (
                                <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">
                                  {followUp.description}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(followUp.type)}
                              <span className="capitalize">{followUp.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {getPriorityIcon(followUp.priority)}
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(followUp.priority)}`}>
                                {followUp.priority.charAt(0).toUpperCase() + followUp.priority.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>
                              <p>{formatDateTime(followUp.dueDate)}</p>
                              {isOverdue(followUp.dueDate) && !followUp.completed && (
                                <p className="text-red-500 text-xs font-medium">Overdue</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {followUp.assignedTo || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              followUp.completed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {followUp.completed ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button variant="link" className="text-primary hover:text-blue-700 p-0">
                              View
                            </Button>
                            <Button variant="link" className="text-gray-400 hover:text-gray-600 p-0">
                              Edit
                            </Button>
                            {!followUp.completed && (
                              <Button 
                                variant="link" 
                                className="text-green-600 hover:text-green-700 p-0"
                                onClick={() => completeFollowUpMutation.mutate(followUp.id)}
                                disabled={completeFollowUpMutation.isPending}
                              >
                                Complete
                              </Button>
                            )}
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
    </>
  );
}
