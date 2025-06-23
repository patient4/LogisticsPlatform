import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, FileText, DollarSign, Clock, CheckCircle } from "lucide-react";

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['/api/invoices'],
  });

  const filteredInvoices = invoices?.filter((invoice: any) => {
    const matchesSearch = 
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  // Calculate statistics
  const invoiceStats = {
    totalCustomer: filteredInvoices.filter((inv: any) => inv.type === 'customer').length,
    totalCarrier: filteredInvoices.filter((inv: any) => inv.type === 'carrier').length,
    pendingAmount: filteredInvoices
      .filter((inv: any) => inv.status === 'sent' || inv.status === 'draft')
      .reduce((sum: number, inv: any) => sum + parseFloat(inv.amount || '0'), 0),
    overdueCount: filteredInvoices.filter((inv: any) => {
      if (inv.status === 'paid') return false;
      const dueDate = new Date(inv.dueDate);
      return dueDate < new Date();
    }).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTypeColor = (type: string) => {
    return type === 'customer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getTypeLabel = (type: string) => {
    return type === 'customer' ? 'Customer' : 'Carrier';
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'paid') return false;
    const due = new Date(dueDate);
    return due < new Date();
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
            <p className="text-gray-600">Customer billing and carrier payments</p>
          </div>
          <Button className="bg-primary hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Invoice Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Customer Invoices</p>
                    <p className="text-2xl font-bold text-green-600">{invoiceStats.totalCustomer}</p>
                  </div>
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Carrier Invoices</p>
                    <p className="text-2xl font-bold text-blue-600">{invoiceStats.totalCarrier}</p>
                  </div>
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Amount</p>
                    <p className="text-2xl font-bold text-warning">{formatCurrency(invoiceStats.pendingAmount)}</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-error">{invoiceStats.overdueCount}</p>
                  </div>
                  <Clock className="h-6 w-6 text-error" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="carrier">Carrier</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading invoices...</div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                    ? "No invoices match your search criteria."
                    : "No invoices found. Create your first invoice to get started."
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer/Carrier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInvoices.map((invoice: any) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(invoice.type)}`}>
                              {getTypeLabel(invoice.type)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.type === 'customer' ? 'Customer Name' : 'Carrier Name'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                              {isOverdue(invoice.dueDate, invoice.status) && (
                                <Clock className="w-4 h-4 ml-2 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              isOverdue(invoice.dueDate, invoice.status) && invoice.status !== 'paid'
                                ? 'bg-red-100 text-red-800'
                                : getStatusColor(invoice.status)
                            }`}>
                              {isOverdue(invoice.dueDate, invoice.status) && invoice.status !== 'paid'
                                ? 'Overdue'
                                : getStatusLabel(invoice.status)
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button variant="link" className="text-primary hover:text-blue-700 p-0">
                              View
                            </Button>
                            <Button variant="link" className="text-gray-400 hover:text-gray-600 p-0">
                              Edit
                            </Button>
                            {invoice.status !== 'paid' && (
                              <Button variant="link" className="text-green-600 hover:text-green-700 p-0">
                                Mark Paid
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
