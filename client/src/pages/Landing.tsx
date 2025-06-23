import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck, Users, FileText, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EverFlow Logistics
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete Freight Brokerage Operations Platform
          </p>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your freight operations with our comprehensive platform.
            Manage leads, customers, carriers, orders, and dispatch operations
            all in one place.
          </p>
          <Button
            onClick={() => (window.location.href = "/api/login")}
            className="bg-primary hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track potential customers and convert leads into profitable
                orders
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Dispatch Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Efficiently assign loads to carriers and track shipments in
                real-time
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automated billing for customers and payment processing for
                carriers
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive insights into your operations and performance
                metrics
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Secure, reliable, and built for freight brokers by freight experts
          </p>
        </div>
      </div>
    </div>
  );
}
