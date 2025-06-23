import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Phone, Truck } from "lucide-react";

export default function Tracing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("in_transit");

  const { data: dispatches, isLoading } = useQuery({
    queryKey: ['/api/dispatches'],
  });

  // Filter to show only dispatches that are in transit or have tracking information
  const trackableDispatches = dispatches?.filter((dispatch: any) => {
    const isTrackable = dispatch.status === 'in_transit' || dispatch.status === 'picked_up';
    
    const matchesSearch = 
      dispatch.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.carrierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispatch.driverName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dispatch.status === statusFilter;
    
    return isTrackable && matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'picked_up':
        return 'Picked Up';
      case 'in_transit':
        return 'In Transit';
      default:
        return status;
    }
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return 'Not available';
    return new Date(dateTime).toLocaleString();
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tracing</h2>
            <p className="text-gray-600">Track shipments in transit</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Filter and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search shipments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="picked_up">Picked Up</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Cards */}
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading shipments...</div>
          ) : trackableDispatches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== "in_transit" 
                ? "No shipments match your search criteria."
                : "No shipments currently in transit."
              }
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trackableDispatches.map((dispatch: any) => (
                <Card key={dispatch.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {dispatch.orderNumber}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4" />
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispatch.status)}`}>
                          {getStatusLabel(dispatch.status)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Customer and Carrier Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Customer</p>
                        <p className="text-sm text-gray-900">{dispatch.customerName || 'Direct Customer'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Carrier</p>
                        <p className="text-sm text-gray-900">{dispatch.carrierName || 'Unknown Carrier'}</p>
                      </div>
                    </div>

                    {/* Driver Information */}
                    {dispatch.driverName && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Driver: {dispatch.driverName}
                            </p>
                            {dispatch.driverPhone && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-500">{dispatch.driverPhone}</p>
                              </div>
                            )}
                          </div>
                          <Button size="sm" variant="outline" className="text-xs">
                            Call Driver
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Route Information */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Origin</p>
                          <p className="text-xs text-gray-500">
                            {dispatch.originCity}, {dispatch.originState}
                          </p>
                        </div>
                      </div>
                      <div className="ml-6 border-l-2 border-gray-200 h-4"></div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Destination</p>
                          <p className="text-xs text-gray-500">
                            {dispatch.destinationCity}, {dispatch.destinationState}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timing Information */}
                    <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Pickup</span>
                        </div>
                        <span className="text-xs text-gray-900">
                          {formatDateTime(dispatch.estimatedPickupTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">Delivery</span>
                        </div>
                        <span className="text-xs text-gray-900">
                          {formatDateTime(dispatch.estimatedDeliveryTime)}
                        </span>
                      </div>
                    </div>

                    {/* Manual Update Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <strong>Manual Tracking:</strong> Contact carrier or driver for current location updates.
                        All status updates are entered manually by dispatch team.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Update Status
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Contact Carrier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
