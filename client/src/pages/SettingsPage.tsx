import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Home, Settings, DollarSign, Palette, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  SUPPORTED_CURRENCIES, 
  getCurrencySettings, 
  setCurrencySettings, 
  formatCurrency 
} from "@/lib/currency";

export default function SettingsPage() {
  const { toast } = useToast();
  const [currencySettings, setCurrencySettingsState] = useState(getCurrencySettings());

  const handleCurrencyChange = (field: 'baseCurrency' | 'displayCurrency', value: string) => {
    const newSettings = { ...currencySettings, [field]: value };
    setCurrencySettingsState(newSettings);
    setCurrencySettings(newSettings);
    toast({ 
      title: "Settings Updated", 
      description: `${field === 'baseCurrency' ? 'Base' : 'Display'} currency updated to ${value}` 
    });
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Currency Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <DollarSign className="w-5 h-5" />
                Currency Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Base Currency
                  </Label>
                  <Select 
                    value={currencySettings.baseCurrency} 
                    onValueChange={(value) => handleCurrencyChange('baseCurrency', value)}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      {SUPPORTED_CURRENCIES.map(currency => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Currency used for storing prices and rates
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Currency
                  </Label>
                  <Select 
                    value={currencySettings.displayCurrency} 
                    onValueChange={(value) => handleCurrencyChange('displayCurrency', value)}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      {SUPPORTED_CURRENCIES.map(currency => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Currency shown in the interface
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currency Preview
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1000, 2500, 5000, 10000].map(amount => (
                    <div key={amount} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sample</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(amount, currencySettings.displayCurrency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Exchange rates are approximations for display purposes. 
                  For accurate conversions, integrate with a real-time currency API service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Palette className="w-5 h-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Toggle between light and dark themes
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Settings className="w-5 h-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Platform Version</Label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">EverFlown v1.0.0</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</Label>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Production Ready
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Database</Label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">PostgreSQL</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</Label>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}