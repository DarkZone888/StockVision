// lib/constants.ts

// ---------------------------
// Nav
// ---------------------------

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Search" },
  // { href: '/watchlist', label: 'Watchlist' },
];

// ---------------------------
// Select options (form)
// ---------------------------

export const INVESTMENT_GOALS = [
  { value: "Growth", label: "Growth" },
  { value: "Income", label: "Income" },
  { value: "Balanced", label: "Balanced" },
  { value: "Conservative", label: "Conservative" },
];

export const RISK_TOLERANCE_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

export const PREFERRED_INDUSTRIES = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Energy", label: "Energy" },
  { value: "Consumer Goods", label: "Consumer Goods" },
];

export const ALERT_TYPE_OPTIONS = [
  { value: "upper", label: "Upper" },
  { value: "lower", label: "Lower" },
];

export const CONDITION_OPTIONS = [
  { value: "greater", label: "Greater than (>)" },
  { value: "less", label: "Less than (<)" },
];

// ---------------------------
// TradingView config type
// ---------------------------

export type TradingViewConfig = Record<string, unknown>;

// ---------------------------
// TradingView Charts
// ---------------------------

export const MARKET_OVERVIEW_WIDGET_CONFIG: TradingViewConfig = {
  colorTheme: "dark", // dark mode
  dateRange: "12M", // last 12 months
  locale: "en", // language
  largeChartUrl: "", // link to a large chart if needed
  isTransparent: true, // makes background transparent
  showFloatingTooltip: true, // show tooltip on hover
  plotLineColorGrowing: "#0FEDBE", // line color when price goes up
  plotLineColorFalling: "#0FEDBE", // line color when price falls
  gridLineColor: "rgba(240, 243, 250, 0)", // grid line color
  scaleFontColor: "#DBDBDB", // font color for scale
  belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)", // fill under line when growing
  belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)", // fill under line when falling
  belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
  belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
  symbolActiveColor: "rgba(15, 237, 190, 0.05)", // highlight color for active symbol
  tabs: [
    {
      title: "Mag 7",
      symbols: [
        { s: "NASDAQ:NVDA", d: "NVIDIA" },
        { s: "NASDAQ:MSFT", d: "Microsoft" },
        { s: "NASDAQ:AAPL", d: "Apple" },
        { s: "NASDAQ:GOOGL", d: "Alphabet" },
        { s: "NASDAQ:AMZN", d: "Amazon" },
        { s: "NASDAQ:META", d: "Meta Platforms" },
        { s: "NASDAQ:TSLA", d: "Tesla" },
      ],
    },
    {
      title: "AI Infra",
      symbols: [
        // Chips & Semi
        { s: "NYSE:TSM", d: "Taiwan Semi" },
        { s: "NASDAQ:AMD", d: "AMD" },
        { s: "NASDAQ:AVGO", d: "Broadcom" },
        { s: "NASDAQ:QCOM", d: "Qualcomm" },
        { s: "NASDAQ:ARM", d: "Arm Holdings" },
        { s: "NASDAQ:MU", d: "Micron" },
        // Equipment & Cooling
        { s: "NASDAQ:ASML", d: "ASML (Lithography)" },
        { s: "NASDAQ:AMAT", d: "Applied Materials" },
        { s: "NASDAQ:LRCX", d: "Lam Research" },
        { s: "NYSE:VRT", d: "Vertiv (Cooling)" },
        { s: "NYSE:ANET", d: "Arista (Network)" },
        { s: "NYSE:DELL", d: "Dell Tech" },
        { s: "NASDAQ:SMCI", d: "Super Micro" },
      ],
    },
    {
      title: "Growth",
      symbols: [
        // The Hottest Momentum
        { s: "NASDAQ:APP", d: "AppLovin (Ad AI)" },
        { s: "NASDAQ:PLTR", d: "Palantir" },
        { s: "NASDAQ:HOOD", d: "Robinhood" },
        { s: "NASDAQ:CRWD", d: "CrowdStrike" },
        { s: "NASDAQ:TTD", d: "The Trade Desk" },
        { s: "NYSE:CAVA", d: "Cava Group" },
        // Crypto & E-com
        { s: "NASDAQ:COIN", d: "Coinbase" },
        { s: "NASDAQ:MSTR", d: "MicroStrategy" },
        { s: "NYSE:SE", d: "Sea Ltd" },
        { s: "NASDAQ:SHOP", d: "Shopify" },
        { s: "NASDAQ:MELI", d: "MercadoLibre" },
        { s: "NYSE:NU", d: "Nu Holdings" },
        // Quantum
        { s: "NYSE:IONQ", d: "IonQ" },
      ],
    },
    {
      title: "Energy",
      symbols: [
        // Next Gen Power
        { s: "NYSE:GEV", d: "GE Vernova" },
        { s: "NASDAQ:CEG", d: "Constellation (Nuclear)" },
        { s: "NYSE:VST", d: "Vistra Corp" },
        { s: "NYSE:CCJ", d: "Cameco (Uranium)" },
        // Clean & Industrial Gas
        { s: "NYSE:NEE", d: "NextEra Energy" },
        { s: "NASDAQ:FSLR", d: "First Solar" },
        { s: "NASDAQ:LIN", d: "Linde (Hydrogen)" },
        { s: "NYSE:ETN", d: "Eaton Corp" },
        // Oil Majors
        { s: "NYSE:XOM", d: "Exxon Mobil" },
        { s: "NYSE:CVX", d: "Chevron" },
      ],
    },
    {
      title: "Finance & Moats",
      symbols: [
        { s: "NYSE:BLK", d: "BlackRock" },
        { s: "NYSE:BRK.B", d: "Berkshire Hathaway" },
        { s: "NYSE:BX", d: "Blackstone" },
        { s: "NYSE:KKR", d: "KKR & Co" },
        { s: "NYSE:SPGI", d: "S&P Global" },
        { s: "NYSE:MCO", d: "Moody's" },
        { s: "NYSE:V", d: "Visa" },
        { s: "NYSE:MA", d: "Mastercard" },
        { s: "NYSE:JPM", d: "JPMorgan" },
        { s: "NYSE:GS", d: "Goldman Sachs" },
      ],
    },
    {
      title: "Health & Bio",
      symbols: [
        // Weight Loss & Beauty
        { s: "NYSE:LLY", d: "Eli Lilly" },
        { s: "NYSE:NVO", d: "Novo Nordisk" },
        { s: "NYSE:HIMS", d: "Hims & Hers" },
        { s: "NASDAQ:VKTX", d: "Viking Therapeutics" },
        // MedTech & Leaders
        { s: "NASDAQ:ISRG", d: "Intuitive Surgical" },
        { s: "NYSE:BSX", d: "Boston Scientific" },
        { s: "NYSE:SYK", d: "Stryker" },
        { s: "NYSE:TMO", d: "Thermo Fisher" },
        { s: "NASDAQ:VRTX", d: "Vertex Pharma" },
        { s: "NYSE:JNJ", d: "Johnson & Johnson" },
        { s: "NYSE:UNH", d: "UnitedHealth" },
      ],
    },
    {
      title: "Space & Ind.",
      symbols: [
        { s: "NYSE:GE", d: "GE Aerospace" },
        { s: "NYSE:RTX", d: "RTX Corp" },
        { s: "NYSE:LMT", d: "Lockheed Martin" },
        { s: "NASDAQ:AXON", d: "Axon (Taser)" },
        { s: "NASDAQ:RKLB", d: "Rocket Lab" },
        { s: "NASDAQ:ASTS", d: "AST SpaceMobile" },
        { s: "NYSE:CAT", d: "Caterpillar" },
        { s: "NYSE:DE", d: "Deere & Co" },
        { s: "NYSE:WM", d: "Waste Management" },
        { s: "NYSE:PH", d: "Parker-Hannifin" },
        { s: "NYSE:UNP", d: "Union Pacific" },
      ],
    },
    {
      title: "Consumer",
      symbols: [
        { s: "NASDAQ:COST", d: "Costco" },
        { s: "NYSE:WMT", d: "Walmart" },
        { s: "NYSE:ONON", d: "On Holding" },
        { s: "NYSE:DECK", d: "Deckers (Hoka)" },
        { s: "NYSE:TJX", d: "TJX Companies" },
        { s: "NYSE:RACE", d: "Ferrari" },
        { s: "NYSE:CMG", d: "Chipotle" },
        { s: "NASDAQ:BKNG", d: "Booking" },
        { s: "NYSE:KO", d: "Coca-Cola" },
        { s: "NASDAQ:SBUX", d: "Starbucks" },
      ],
    },
  ],
  support_host: "https://www.tradingview.com", // TradingView host
  backgroundColor: "#141414", // background color
  width: "100%", // full width
  height: 600, // height in px
  showSymbolLogo: true, // show logo next to symbols
  showChart: true, // display mini chart
};

export const HEATMAP_WIDGET_CONFIG: TradingViewConfig = {
  dataSource: "SPX500",
  blockSize: "market_cap_basic",
  blockColor: "change",
  grouping: "sector",
  isTransparent: true,
  locale: "en",
  symbolUrl: "",
  colorTheme: "dark",
  exchanges: [],
  hasTopBar: false,
  isDataSetEnabled: false,
  isZoomEnabled: true,
  hasSymbolTooltip: true,
  isMonoSize: false,
  width: "100%",
  height: 600,
};

export const TOP_STORIES_WIDGET_CONFIG: TradingViewConfig = {
  displayMode: "regular",
  feedMode: "market",
  colorTheme: "dark",
  isTransparent: true,
  locale: "en",
  market: "stock",
  width: "100%",
  height: 600,
};

export const MARKET_DATA_WIDGET_CONFIG: TradingViewConfig = {
  title: "Stocks",
  width: "100%",
  height: 600,
  locale: "en",
  showSymbolLogo: true,
  colorTheme: "dark",
  isTransparent: false,
  backgroundColor: "#0F0F0F",
  symbolsGroups: [
    {
      name: "Mag 7",
      symbols: [
        { name: "NASDAQ:NVDA", displayName: "NVIDIA" },
        { name: "NASDAQ:MSFT", displayName: "Microsoft" },
        { name: "NASDAQ:AAPL", displayName: "Apple" },
        { name: "NASDAQ:GOOGL", displayName: "Alphabet" },
        { name: "NASDAQ:AMZN", displayName: "Amazon" },
        { name: "NASDAQ:META", displayName: "Meta Platforms" },
        { name: "NASDAQ:TSLA", displayName: "Tesla" },
      ],
    },
    {
      name: "AI Infra",
      symbols: [
        { name: "NYSE:TSM", displayName: "Taiwan Semi" },
        { name: "NASDAQ:AMD", displayName: "AMD" },
        { name: "NASDAQ:AVGO", displayName: "Broadcom" },
        { name: "NASDAQ:QCOM", displayName: "Qualcomm" },
        { name: "NASDAQ:ARM", displayName: "Arm Holdings" },
        { name: "NASDAQ:MU", displayName: "Micron" },
        { name: "NASDAQ:ASML", displayName: "ASML (Lithography)" },
        { name: "NASDAQ:AMAT", displayName: "Applied Materials" },
        { name: "NASDAQ:LRCX", displayName: "Lam Research" },
        { name: "NYSE:VRT", displayName: "Vertiv (Cooling)" },
        { name: "NYSE:ANET", displayName: "Arista (Network)" },
        { name: "NYSE:DELL", displayName: "Dell Tech" },
        { name: "NASDAQ:SMCI", displayName: "Super Micro" },
      ],
    },
    {
      name: "Growth",
      symbols: [
        { name: "NASDAQ:APP", displayName: "AppLovin (Ad AI)" },
        { name: "NASDAQ:PLTR", displayName: "Palantir" },
        { name: "NASDAQ:HOOD", displayName: "Robinhood" },
        { name: "NASDAQ:CRWD", displayName: "CrowdStrike" },
        { name: "NASDAQ:TTD", displayName: "The Trade Desk" },
        { name: "NYSE:CAVA", displayName: "Cava Group" },
        { name: "NASDAQ:COIN", displayName: "Coinbase" },
        { name: "NASDAQ:MSTR", displayName: "MicroStrategy" },
        { name: "NYSE:SE", displayName: "Sea Ltd" },
        { name: "NASDAQ:SHOP", displayName: "Shopify" },
        { name: "NASDAQ:MELI", displayName: "MercadoLibre" },
        { name: "NYSE:NU", displayName: "Nu Holdings" },
        { name: "NYSE:IONQ", displayName: "IonQ" },
      ],
    },
    {
      name: "Energy",
      symbols: [
        { name: "NYSE:GEV", displayName: "GE Vernova" },
        { name: "NASDAQ:CEG", displayName: "Constellation (Nuclear)" },
        { name: "NYSE:VST", displayName: "Vistra Corp" },
        { name: "NYSE:CCJ", displayName: "Cameco (Uranium)" },
        { name: "NYSE:NEE", displayName: "NextEra Energy" },
        { name: "NASDAQ:FSLR", displayName: "First Solar" },
        { name: "NASDAQ:LIN", displayName: "Linde (Hydrogen)" },
        { name: "NYSE:ETN", displayName: "Eaton Corp" },
        { name: "NYSE:XOM", displayName: "Exxon Mobil" },
        { name: "NYSE:CVX", displayName: "Chevron" },
      ],
    },
    {
      name: "Finance & Moats",
      symbols: [
        { name: "NYSE:BLK", displayName: "BlackRock" },
        { name: "NYSE:BRK.B", displayName: "Berkshire Hathaway" },
        { name: "NYSE:BX", displayName: "Blackstone" },
        { name: "NYSE:KKR", displayName: "KKR & Co" },
        { name: "NYSE:SPGI", displayName: "S&P Global" },
        { name: "NYSE:MCO", displayName: "Moody's" },
        { name: "NYSE:V", displayName: "Visa" },
        { name: "NYSE:MA", displayName: "Mastercard" },
        { name: "NYSE:JPM", displayName: "JPMorgan" },
        { name: "NYSE:GS", displayName: "Goldman Sachs" },
      ],
    },
    {
      name: "Health & Bio",
      symbols: [
        { name: "NYSE:LLY", displayName: "Eli Lilly" },
        { name: "NYSE:NVO", displayName: "Novo Nordisk" },
        { name: "NYSE:HIMS", displayName: "Hims & Hers" },
        { name: "NASDAQ:VKTX", displayName: "Viking Therapeutics" },
        { name: "NASDAQ:ISRG", displayName: "Intuitive Surgical" },
        { name: "NYSE:BSX", displayName: "Boston Scientific" },
        { name: "NYSE:SYK", displayName: "Stryker" },
        { name: "NYSE:TMO", displayName: "Thermo Fisher" },
        { name: "NASDAQ:VRTX", displayName: "Vertex Pharma" },
        { name: "NYSE:JNJ", displayName: "Johnson & Johnson" },
        { name: "NYSE:UNH", displayName: "UnitedHealth" },
      ],
    },
    {
      name: "Space & Ind.",
      symbols: [
        { name: "NYSE:GE", displayName: "GE Aerospace" },
        { name: "NYSE:RTX", displayName: "RTX Corp" },
        { name: "NYSE:LMT", displayName: "Lockheed Martin" },
        { name: "NASDAQ:AXON", displayName: "Axon (Taser)" },
        { name: "NASDAQ:RKLB", displayName: "Rocket Lab" },
        { name: "NASDAQ:ASTS", displayName: "AST SpaceMobile" },
        { name: "NYSE:CAT", displayName: "Caterpillar" },
        { name: "NYSE:DE", displayName: "Deere & Co" },
        { name: "NYSE:WM", displayName: "Waste Management" },
        { name: "NYSE:PH", displayName: "Parker-Hannifin" },
        { name: "NYSE:UNP", displayName: "Union Pacific" },
      ],
    },
    {
      name: "Consumer",
      symbols: [
        { name: "NASDAQ:COST", displayName: "Costco" },
        { name: "NYSE:WMT", displayName: "Walmart" },
        { name: "NYSE:ONON", displayName: "On Holding" },
        { name: "NYSE:DECK", displayName: "Deckers (Hoka)" },
        { name: "NYSE:TJX", displayName: "TJX Companies" },
        { name: "NYSE:RACE", displayName: "Ferrari" },
        { name: "NYSE:CMG", displayName: "Chipotle" },
        { name: "NASDAQ:BKNG", displayName: "Booking" },
        { name: "NYSE:KO", displayName: "Coca-Cola" },
        { name: "NASDAQ:SBUX", displayName: "Starbucks" },
      ],
    },
  ],
};

// ---------------------------
// Symbol-based widgets
// ---------------------------

export const SYMBOL_INFO_WIDGET_CONFIG = (symbol: string): TradingViewConfig => ({
  symbol: symbol.toUpperCase(),
  colorTheme: "dark",
  isTransparent: true,
  locale: "en",
  width: "100%",
  height: 170,
});

export const CANDLE_CHART_WIDGET_CONFIG = (symbol: string): TradingViewConfig => ({
  allow_symbol_change: false,
  calendar: false,
  details: true,
  hide_side_toolbar: true,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  interval: "D",
  locale: "en",
  save_image: false,
  style: 1,
  symbol: symbol.toUpperCase(),
  theme: "dark",
  timezone: "Etc/UTC",
  backgroundColor: "#141414",
  gridColor: "#141414",
  watchlist: [],
  withdateranges: false,
  compareSymbols: [],
  studies: [
    {
      id: "MAExp@tv-basicstudies",
      inputs: { length: 21 },
    },
    {
      id: "MASimple@tv-basicstudies",
      inputs: { length: 50 },
    },
    {
      id: "MASimple@tv-basicstudies",
      inputs: { length: 200 },
    },
  ],
  width: "100%",
  height: 600,
});

export const BASELINE_WIDGET_CONFIG = (symbol: string): TradingViewConfig => ({
  allow_symbol_change: false,
  calendar: false,
  details: false,
  hide_side_toolbar: true,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  interval: "D",
  locale: "en",
  save_image: false,
  style: 10,
  symbol: symbol.toUpperCase(),
  theme: "dark",
  timezone: "Etc/UTC",
  backgroundColor: "#141414",
  gridColor: "#141414",
  watchlist: [],
  withdateranges: false,
  compareSymbols: [],
  studies: [],
  width: "100%",
  height: 600,
});

export const TECHNICAL_ANALYSIS_WIDGET_CONFIG = (
  symbol: string
): TradingViewConfig => ({
  symbol: symbol.toUpperCase(),
  colorTheme: "dark",
  isTransparent: true,
  locale: "en",
  width: "100%",
  height: 400,
  interval: "1h",
  largeChartUrl: "",
});

export const COMPANY_PROFILE_WIDGET_CONFIG = (
  symbol: string
): TradingViewConfig => ({
  symbol: symbol.toUpperCase(),
  colorTheme: "dark",
  isTransparent: true,
  locale: "en",
  width: "100%",
  height: 440,
});

export const COMPANY_FINANCIALS_WIDGET_CONFIG = (
  symbol: string
): TradingViewConfig => ({
  symbol: symbol.toUpperCase(),
  colorTheme: "dark",
  isTransparent: true,
  locale: "en",
  width: "100%",
  height: 464,
  displayMode: "regular",
  largeChartUrl: "",
});

export const FUNDAMENTAL_DATA_WIDGET_CONFIG = (
  symbol: string
): TradingViewConfig => ({
  symbol: symbol.toUpperCase(),
  colorTheme: "dark",
  isTransparent: true,
  largeChartUrl: "",
  displayMode: "regular",
  width: "100%",
  height: 400,
  locale: "en",
});

export const SYMBOL_NEWS_WIDGET_CONFIG = (symbol: string): TradingViewConfig => ({
  feedMode: "symbol",
  symbol: symbol.toUpperCase(),
  colorTheme: "dark",
  isTransparent: true,
  displayMode: "regular",
  width: "100%",
  height: 600,
  locale: "en",
});

// ---------------------------
// Misc
// ---------------------------

export const POPULAR_STOCK_SYMBOLS = [
  // Tech Giants (the big technology companies)
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "META",
  "NVDA",
  "NFLX",
  "ORCL",
  "CRM",

  // Growing Tech Companies
  "ADBE",
  "INTC",
  "AMD",
  "PYPL",
  "UBER",
  "ZOOM",
  "SPOT",
  "SQ",
  "SHOP",
  "ROKU",

  // Newer Tech Companies
  "SNOW",
  "PLTR",
  "COIN",
  "RBLX",
  "DDOG",
  "CRWD",
  "NET",
  "OKTA",
  "TWLO",
  "ZM",

  // Consumer & Delivery Apps
  "DOCU",
  "PTON",
  "PINS",
  "SNAP",
  "LYFT",
  "DASH",
  "ABNB",
  "RIVN",
  "LCID",
  "NIO",

  // International Companies
  "XPEV",
  "LI",
  "BABA",
  "JD",
  "PDD",
  "TME",
  "BILI",
  "DIDI",
  "GRAB",
  "SE",
];

export const NO_MARKET_NEWS =
  '<p class="mobile-text" style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#4b5563;">No market news available today. Please check back tomorrow.</p>';

export const WATCHLIST_TABLE_HEADER = [
  "Company",
  "Symbol",
  "Price",
  "Change",
  "Market Cap",
  "P/E Ratio",
  "Alert",
  "Action",
];
