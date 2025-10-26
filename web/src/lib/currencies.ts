export interface Currency {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

export const CURRENCIES: Currency[] = [
  // African Currencies (Priority)
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", region: "Africa" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", region: "Africa" },
  { code: "ZAR", name: "South African Rand", symbol: "R", region: "Africa" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", region: "Africa" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", region: "Africa" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", region: "Africa" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", region: "Africa" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", region: "Africa" },
  { code: "ETB", name: "Ethiopian Birr", symbol: "Br", region: "Africa" },
  { code: "XOF", name: "West African CFA Franc", symbol: "Fr", region: "Africa" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "Fr", region: "Africa" },
  { code: "GNF", name: "Guinean Franc", symbol: "Fr", region: "Africa" },
  { code: "RWF", name: "Rwandan Franc", symbol: "Fr", region: "Africa" },
  { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", region: "Africa" },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK", region: "Africa" },
  { code: "BWP", name: "Botswana Pula", symbol: "P", region: "Africa" },
  { code: "MUR", name: "Mauritian Rupee", symbol: "₨", region: "Africa" },
  { code: "SCR", name: "Seychellois Rupee", symbol: "₨", region: "Africa" },
  { code: "TND", name: "Tunisian Dinar", symbol: "د.ت", region: "Africa" },
  { code: "LYD", name: "Libyan Dinar", symbol: "ل.د", region: "Africa" },
  { code: "DZD", name: "Algerian Dinar", symbol: "د.ج", region: "Africa" },
  { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", region: "Africa" },
  { code: "MZN", name: "Mozambican Metical", symbol: "MT", region: "Africa" },
  { code: "NAD", name: "Namibian Dollar", symbol: "$", region: "Africa" },
  { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le", region: "Africa" },
  { code: "LRD", name: "Liberian Dollar", symbol: "$", region: "Africa" },
  { code: "GMD", name: "Gambian Dalasi", symbol: "D", region: "Africa" },
  { code: "MGA", name: "Malagasy Ariary", symbol: "Ar", region: "Africa" },
  { code: "SZL", name: "Swazi Lilangeni", symbol: "L", region: "Africa" },
  { code: "LSL", name: "Lesotho Loti", symbol: "L", region: "Africa" },
  { code: "BIF", name: "Burundian Franc", symbol: "Fr", region: "Africa" },
  { code: "DJF", name: "Djiboutian Franc", symbol: "Fr", region: "Africa" },
  { code: "SOS", name: "Somali Shilling", symbol: "Sh", region: "Africa" },
  { code: "STN", name: "São Tomé and Príncipe Dobra", symbol: "Db", region: "Africa" },
  { code: "CVE", name: "Cape Verdean Escudo", symbol: "$", region: "Africa" },
  { code: "KMF", name: "Comorian Franc", symbol: "Fr", region: "Africa" },
  { code: "ERN", name: "Eritrean Nakfa", symbol: "Nfk", region: "Africa" },
  { code: "SDG", name: "Sudanese Pound", symbol: "£", region: "Africa" },
  { code: "SSP", name: "South Sudanese Pound", symbol: "£", region: "Africa" },

  // Major Global Currencies
  { code: "USD", name: "US Dollar", symbol: "$", region: "North America" },
  { code: "EUR", name: "Euro", symbol: "€", region: "Europe" },
  { code: "GBP", name: "British Pound", symbol: "£", region: "Europe" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", region: "Asia" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", region: "Asia" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", region: "Asia" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", region: "North America" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", region: "Oceania" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", region: "Europe" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", region: "Oceania" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", region: "Asia" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", region: "Asia" },

  // Other Asian Currencies
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", region: "Asia" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", region: "Asia" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", region: "Asia" },
  { code: "THB", name: "Thai Baht", symbol: "฿", region: "Asia" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", region: "Asia" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", region: "Asia" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", region: "Asia" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", region: "Asia" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", region: "Asia" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", region: "Asia" },

  // Middle East
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", region: "Middle East" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", region: "Middle East" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", region: "Middle East" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", region: "Middle East" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "ب.د", region: "Middle East" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", region: "Middle East" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", region: "Middle East" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا", region: "Middle East" },
  { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل", region: "Middle East" },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ع.د", region: "Middle East" },

  // Latin America
  { code: "BRL", name: "Brazilian Real", symbol: "R$", region: "South America" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", region: "North America" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", region: "South America" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", region: "South America" },
  { code: "COP", name: "Colombian Peso", symbol: "$", region: "South America" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", region: "South America" },
  { code: "UYU", name: "Uruguayan Peso", symbol: "$", region: "South America" },
  { code: "VES", name: "Venezuelan Bolívar", symbol: "Bs.", region: "South America" },

  // Caribbean
  { code: "JMD", name: "Jamaican Dollar", symbol: "J$", region: "Caribbean" },
  { code: "TTD", name: "Trinidad and Tobago Dollar", symbol: "TT$", region: "Caribbean" },
  { code: "BSD", name: "Bahamian Dollar", symbol: "$", region: "Caribbean" },
  { code: "BBD", name: "Barbadian Dollar", symbol: "$", region: "Caribbean" },

  // Europe (Additional)
  { code: "SEK", name: "Swedish Krona", symbol: "kr", region: "Europe" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", region: "Europe" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", region: "Europe" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", region: "Europe" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", region: "Europe" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", region: "Europe" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", region: "Europe" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", region: "Europe" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", region: "Europe" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", region: "Europe" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", region: "Europe" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", region: "Europe" },

  // Oceania
  { code: "FJD", name: "Fijian Dollar", symbol: "$", region: "Oceania" },
  { code: "PGK", name: "Papua New Guinean Kina", symbol: "K", region: "Oceania" },

  // Cryptocurrencies (Optional)
  { code: "BTC", name: "Bitcoin", symbol: "₿", region: "Digital" },
  { code: "ETH", name: "Ethereum", symbol: "Ξ", region: "Digital" },
];

// Helper function to group currencies by region
export const getCurrenciesByRegion = () => {
  const grouped: Record<string, Currency[]> = {};

  CURRENCIES.forEach((currency) => {
    if (!grouped[currency.region]) {
      grouped[currency.region] = [];
    }
    grouped[currency.region].push(currency);
  });

  return grouped;
};

// Helper function to search currencies
export const searchCurrencies = (query: string): Currency[] => {
  const lowerQuery = query.toLowerCase();
  return CURRENCIES.filter(
    (currency) =>
      currency.code.toLowerCase().includes(lowerQuery) ||
      currency.name.toLowerCase().includes(lowerQuery) ||
      currency.symbol.includes(query)
  );
};

// Get popular currencies (for quick access)
export const POPULAR_CURRENCIES = [
  "GHS", // Ghana (Priority #1)
  "NGN", // Nigeria
  "USD", // US Dollar
  "EUR", // Euro
  "GBP", // British Pound
  "ZAR", // South African Rand
  "KES", // Kenyan Shilling
];
