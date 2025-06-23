export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
];

export interface CurrencySettings {
  baseCurrency: string;
  displayCurrency: string;
  exchangeRates: Record<string, number>;
  lastUpdated: Date;
}

const DEFAULT_CURRENCY_SETTINGS: CurrencySettings = {
  baseCurrency: 'USD',
  displayCurrency: 'USD',
  exchangeRates: {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    CAD: 1.25,
    AUD: 1.35,
    JPY: 110,
    CNY: 6.5,
    INR: 75,
    MXN: 20,
    BRL: 5.2,
  },
  lastUpdated: new Date(),
};

export function getCurrencySettings(): CurrencySettings {
  const stored = localStorage.getItem('currencySettings');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CURRENCY_SETTINGS, ...parsed, lastUpdated: new Date(parsed.lastUpdated) };
    } catch {
      return DEFAULT_CURRENCY_SETTINGS;
    }
  }
  return DEFAULT_CURRENCY_SETTINGS;
}

export function setCurrencySettings(settings: Partial<CurrencySettings>): void {
  const current = getCurrencySettings();
  const updated = { ...current, ...settings, lastUpdated: new Date() };
  localStorage.setItem('currencySettings', JSON.stringify(updated));
}

export function formatCurrency(
  amount: string | number,
  currencyCode?: string,
  options?: Intl.NumberFormatOptions
): string {
  const settings = getCurrencySettings();
  const currency = currencyCode || settings.displayCurrency;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '$0.00';
  
  // Convert from base currency if needed
  let convertedAmount = num;
  if (settings.baseCurrency !== currency && settings.exchangeRates[currency]) {
    convertedAmount = num * settings.exchangeRates[currency];
  }
  
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency);
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
      ...options,
    }).format(convertedAmount);
  } catch {
    // Fallback to symbol + amount if Intl.NumberFormat fails
    const symbol = currencyInfo?.symbol || '$';
    return `${symbol}${convertedAmount.toLocaleString()}`;
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const settings = getCurrencySettings();
  
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = settings.exchangeRates[fromCurrency] || 1;
  const toRate = settings.exchangeRates[toCurrency] || 1;
  
  // Convert to base currency first, then to target currency
  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
}