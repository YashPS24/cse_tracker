/**
 * Seed data for 20 major CSE companies
 * Source: Annual reports from cse.lk — update each year from new filings
 * financials[] is ordered oldest → newest (index 0 = FY2015, index 9 = FY2024)
 */
export const SEED_COMPANIES = [
  {
    symbol: 'COMB.N0000', ticker: 'COMB', name: 'Commercial Bank of Ceylon PLC',
    sector: 'Banking', ownerGroup: 'EPF / David Pieris / DFCC',
    relatedCompanies: ['HNB', 'SAMP', 'NTB'],
    description: 'Largest private bank. 291 branches, international operations in Bangladesh, Maldives, Myanmar.',
    price: 108, pe: 7.2, eps: 22.4, divYield: 5.8, de: 1.92, icr: 3.8, payout: 42,
    financials: [
      { year:2015, revenue:85,  netIncome:8.2,  eps:10.2, dividend:6,  totalDebt:680, equity:320 },
      { year:2016, revenue:90,  netIncome:9.1,  eps:11.4, dividend:7,  totalDebt:720, equity:345 },
      { year:2017, revenue:96,  netIncome:10.3, eps:12.8, dividend:8,  totalDebt:780, equity:380 },
      { year:2018, revenue:88,  netIncome:9.8,  eps:12.2, dividend:8,  totalDebt:800, equity:390 },
      { year:2019, revenue:102, netIncome:11.2, eps:14.0, dividend:8,  totalDebt:840, equity:420 },
      { year:2020, revenue:118, netIncome:13.5, eps:16.8, dividend:10, totalDebt:880, equity:460 },
      { year:2021, revenue:125, netIncome:15.2, eps:18.9, dividend:12, totalDebt:900, equity:470 },
      { year:2022, revenue:131, netIncome:16.8, eps:20.8, dividend:13, totalDebt:910, equity:475 },
      { year:2023, revenue:140, netIncome:18.1, eps:22.1, dividend:14, totalDebt:915, equity:478 },
      { year:2024, revenue:148, netIncome:19.4, eps:22.4, dividend:15, totalDebt:920, equity:480 },
    ]
  },
  {
    symbol: 'JKH.N0000', ticker: 'JKH', name: 'John Keells Holdings PLC',
    sector: 'Diversified', ownerGroup: 'John Keells Group',
    relatedCompanies: ['KFOO', 'TAJ', 'UAL'],
    description: 'Sri Lanka\'s largest listed conglomerate. Hotels, retail, logistics, IT, financial services.',
    price: 188, pe: 14.1, eps: 14.2, divYield: 2.2, de: 0.73, icr: 6.2, payout: 31,
    financials: [
      { year:2015, revenue:142, netIncome:9.8,  eps:7.2,  dividend:4, totalDebt:210, equity:480 },
      { year:2016, revenue:155, netIncome:10.5, eps:7.7,  dividend:4, totalDebt:225, equity:500 },
      { year:2017, revenue:168, netIncome:12.1, eps:8.9,  dividend:5, totalDebt:250, equity:520 },
      { year:2018, revenue:172, netIncome:11.8, eps:8.6,  dividend:5, totalDebt:260, equity:515 },
      { year:2019, revenue:148, netIncome:9.2,  eps:6.7,  dividend:4, totalDebt:270, equity:500 },
      { year:2020, revenue:182, netIncome:11.5, eps:8.4,  dividend:5, totalDebt:290, equity:510 },
      { year:2021, revenue:205, netIncome:14.8, eps:10.8, dividend:6, totalDebt:310, equity:525 },
      { year:2022, revenue:221, netIncome:16.2, eps:11.9, dividend:6, totalDebt:340, equity:515 },
      { year:2023, revenue:238, netIncome:17.8, eps:13.1, dividend:7, totalDebt:360, equity:518 },
      { year:2024, revenue:254, netIncome:19.4, eps:14.2, dividend:8, totalDebt:380, equity:520 },
    ]
  },
  {
    symbol: 'DIAL.N0000', ticker: 'DIAL', name: 'Dialog Axiata PLC',
    sector: 'Telecom', ownerGroup: 'Axiata Group (Malaysia)',
    relatedCompanies: [],
    description: 'Largest mobile operator in Sri Lanka. 4G/LTE, fiber broadband, digital services.',
    price: 14.8, pe: 18.5, eps: 0.42, divYield: 3.5, de: 0.88, icr: 4.1, payout: 65,
    financials: [
      { year:2015, revenue:95,  netIncome:4.2, eps:0.22, dividend:0.2,  totalDebt:180, equity:250 },
      { year:2016, revenue:102, netIncome:4.8, eps:0.25, dividend:0.22, totalDebt:190, equity:260 },
      { year:2017, revenue:109, netIncome:5.2, eps:0.27, dividend:0.25, totalDebt:200, equity:270 },
      { year:2018, revenue:115, netIncome:5.0, eps:0.26, dividend:0.25, totalDebt:210, equity:272 },
      { year:2019, revenue:112, netIncome:4.8, eps:0.25, dividend:0.2,  totalDebt:215, equity:268 },
      { year:2020, revenue:122, netIncome:5.5, eps:0.29, dividend:0.25, totalDebt:225, equity:278 },
      { year:2021, revenue:135, netIncome:6.2, eps:0.32, dividend:0.28, totalDebt:240, equity:285 },
      { year:2022, revenue:144, netIncome:6.8, eps:0.35, dividend:0.3,  totalDebt:250, equity:290 },
      { year:2023, revenue:151, netIncome:7.4, eps:0.38, dividend:0.32, totalDebt:255, equity:292 },
      { year:2024, revenue:160, netIncome:8.0, eps:0.42, dividend:0.35, totalDebt:260, equity:295 },
    ]
  },
  {
    symbol: 'HNB.N0000', ticker: 'HNB', name: 'Hatton National Bank PLC',
    sector: 'Banking', ownerGroup: 'Stassen Group',
    relatedCompanies: ['COMB', 'SAMP', 'NTB'],
    description: 'Second-largest private bank. Strong retail banking, trade finance, SME lending.',
    price: 242, pe: 6.1, eps: 26.8, divYield: 7.2, de: 2.5, icr: 3.2, payout: 44,
    financials: [
      { year:2015, revenue:72,  netIncome:6.8,  eps:14.2, dividend:9,  totalDebt:780, equity:340 },
      { year:2016, revenue:78,  netIncome:7.5,  eps:15.8, dividend:10, totalDebt:820, equity:360 },
      { year:2017, revenue:85,  netIncome:8.6,  eps:18.0, dividend:11, totalDebt:870, equity:380 },
      { year:2018, revenue:89,  netIncome:9.2,  eps:19.2, dividend:12, totalDebt:900, equity:390 },
      { year:2019, revenue:82,  netIncome:8.0,  eps:16.8, dividend:10, totalDebt:920, equity:395 },
      { year:2020, revenue:98,  netIncome:10.5, eps:22.0, dividend:12, totalDebt:960, equity:405 },
      { year:2021, revenue:112, netIncome:12.0, eps:25.1, dividend:14, totalDebt:990, equity:412 },
      { year:2022, revenue:122, netIncome:13.2, eps:27.6, dividend:15, totalDebt:1020,equity:418 },
      { year:2023, revenue:134, netIncome:14.1, eps:29.5, dividend:16, totalDebt:1040,equity:420 },
      { year:2024, revenue:145, netIncome:12.8, eps:26.8, dividend:18, totalDebt:1050,equity:420 },
    ]
  },
  {
    symbol: 'EXPO.N0000', ticker: 'EXPO', name: 'Expolanka Holdings PLC',
    sector: 'Logistics', ownerGroup: 'SG Holdings (Japan)',
    relatedCompanies: [],
    description: 'Global freight and logistics leader. Sri Lanka\'s most profitable company in 2021–22.',
    price: 55, pe: 5.8, eps: 9.4, divYield: 6.2, de: 0.30, icr: 8.8, payout: 36,
    financials: [
      { year:2015, revenue:148, netIncome:1.2, eps:0.5, dividend:0.5, totalDebt:55,  equity:180 },
      { year:2016, revenue:165, netIncome:1.8, eps:0.8, dividend:0.8, totalDebt:60,  equity:195 },
      { year:2017, revenue:192, netIncome:2.2, eps:1.0, dividend:1.0, totalDebt:65,  equity:210 },
      { year:2018, revenue:225, netIncome:2.8, eps:1.2, dividend:1.2, totalDebt:70,  equity:230 },
      { year:2019, revenue:240, netIncome:2.4, eps:1.0, dividend:1.0, totalDebt:75,  equity:240 },
      { year:2020, revenue:680, netIncome:14.5,eps:3.0, dividend:3.0, totalDebt:120, equity:420 },
      { year:2021, revenue:820, netIncome:24.8,eps:5.0, dividend:5.0, totalDebt:140, equity:580 },
      { year:2022, revenue:520, netIncome:19.2,eps:4.0, dividend:4.0, totalDebt:160, equity:610 },
      { year:2023, revenue:380, netIncome:14.5,eps:3.0, dividend:3.0, totalDebt:170, equity:620 },
      { year:2024, revenue:310, netIncome:9.8, eps:2.5, dividend:2.5, totalDebt:185, equity:620 },
    ]
  },
  {
    symbol: 'CTC.N0000', ticker: 'CTC', name: 'Ceylon Tobacco Company PLC',
    sector: 'Manufacturing', ownerGroup: 'British American Tobacco (UK)',
    relatedCompanies: [],
    description: 'Monopoly tobacco manufacturer. Very high consistent dividends but declining volumes.',
    price: 880, pe: 11.2, eps: 52.4, divYield: 9.8, de: 0.12, icr: 18.5, payout: 92,
    financials: [
      { year:2015, revenue:48, netIncome:8.2,  eps:42.8, dividend:42, totalDebt:12, equity:156 },
      { year:2016, revenue:50, netIncome:8.5,  eps:44.5, dividend:44, totalDebt:14, equity:162 },
      { year:2017, revenue:51, netIncome:8.6,  eps:45.2, dividend:45, totalDebt:15, equity:165 },
      { year:2018, revenue:52, netIncome:8.8,  eps:46.0, dividend:46, totalDebt:16, equity:168 },
      { year:2019, revenue:52, netIncome:8.7,  eps:45.5, dividend:45, totalDebt:18, equity:170 },
      { year:2020, revenue:54, netIncome:9.0,  eps:47.1, dividend:47, totalDebt:20, equity:178 },
      { year:2021, revenue:55, netIncome:9.3,  eps:48.8, dividend:49, totalDebt:20, equity:182 },
      { year:2022, revenue:56, netIncome:9.5,  eps:49.8, dividend:50, totalDebt:21, equity:184 },
      { year:2023, revenue:57, netIncome:9.9,  eps:51.8, dividend:52, totalDebt:22, equity:185 },
      { year:2024, revenue:58, netIncome:10.0, eps:52.4, dividend:54, totalDebt:22, equity:186 },
    ]
  },
  {
    symbol: 'MELS.N0000', ticker: 'MELS', name: 'Melstacorp PLC',
    sector: 'Diversified', ownerGroup: 'Dhammika Perera Group',
    relatedCompanies: ['DIST', 'SPEN', 'BIL'],
    description: 'Major conglomerate with interests in distilleries, insurance, telecom, retail.',
    price: 82, pe: 6.5, eps: 8.2, divYield: 3.8, de: 0.78, icr: 5.5, payout: 25,
    financials: [
      { year:2015, revenue:62,  netIncome:3.2, eps:4.5, dividend:1.5, totalDebt:200, equity:320 },
      { year:2016, revenue:68,  netIncome:3.8, eps:5.2, dividend:1.75,totalDebt:210, equity:335 },
      { year:2017, revenue:74,  netIncome:4.2, eps:5.8, dividend:2.0, totalDebt:215, equity:350 },
      { year:2018, revenue:78,  netIncome:4.0, eps:5.5, dividend:2.0, totalDebt:220, equity:355 },
      { year:2019, revenue:65,  netIncome:3.2, eps:4.4, dividend:1.5, totalDebt:225, equity:345 },
      { year:2020, revenue:88,  netIncome:5.0, eps:6.9, dividend:2.5, totalDebt:250, equity:370 },
      { year:2021, revenue:96,  netIncome:5.8, eps:8.0, dividend:2.75,totalDebt:268, equity:388 },
      { year:2022, revenue:102, netIncome:6.2, eps:8.5, dividend:3.0, totalDebt:280, equity:398 },
      { year:2023, revenue:110, netIncome:6.5, eps:8.9, dividend:3.0, totalDebt:295, equity:405 },
      { year:2024, revenue:118, netIncome:6.0, eps:8.2, dividend:3.5, totalDebt:320, equity:410 },
    ]
  },
  {
    symbol: 'SPEN.N0000', ticker: 'SPEN', name: 'Aitken Spence PLC',
    sector: 'Diversified', ownerGroup: 'Aitken Spence Group',
    relatedCompanies: ['MELS', 'AHUN'],
    description: 'Hotels, logistics, travel, power generation. Strong Maldives and Sri Lanka resort portfolio.',
    price: 77, pe: 9.8, eps: 6.4, divYield: 2.9, de: 0.78, icr: 4.2, payout: 28,
    financials: [
      { year:2015, revenue:38, netIncome:2.8, eps:4.2, dividend:1.5,  totalDebt:140, equity:215 },
      { year:2016, revenue:42, netIncome:3.1, eps:4.6, dividend:1.5,  totalDebt:148, equity:222 },
      { year:2017, revenue:46, netIncome:3.5, eps:5.2, dividend:1.75, totalDebt:155, equity:232 },
      { year:2018, revenue:50, netIncome:3.8, eps:5.6, dividend:2.0,  totalDebt:160, equity:238 },
      { year:2019, revenue:28, netIncome:1.2, eps:1.8, dividend:0.5,  totalDebt:165, equity:225 },
      { year:2020, revenue:42, netIncome:2.5, eps:3.7, dividend:1.0,  totalDebt:170, equity:230 },
      { year:2021, revenue:52, netIncome:3.5, eps:5.2, dividend:1.5,  totalDebt:175, equity:238 },
      { year:2022, revenue:58, netIncome:4.0, eps:5.9, dividend:1.75, totalDebt:180, equity:242 },
      { year:2023, revenue:64, netIncome:4.5, eps:6.6, dividend:2.0,  totalDebt:185, equity:244 },
      { year:2024, revenue:70, netIncome:4.4, eps:6.4, dividend:2.25, totalDebt:190, equity:245 },
    ]
  },
  {
    symbol: 'LHCL.N0000', ticker: 'LHCL', name: 'Lanka Hospitals Corporation PLC',
    sector: 'Healthcare', ownerGroup: 'Apollo Hospitals (India)',
    relatedCompanies: [],
    description: 'Premier private hospital in Colombo. Backed by Apollo Hospitals India. High-growth defensive sector.',
    price: 130, pe: 22.4, eps: 5.8, divYield: 1.8, de: 0.34, icr: 7.2, payout: 40,
    financials: [
      { year:2015, revenue:8,  netIncome:0.5, eps:2.8, dividend:1.0,  totalDebt:18, equity:62 },
      { year:2016, revenue:9,  netIncome:0.6, eps:3.2, dividend:1.0,  totalDebt:20, equity:66 },
      { year:2017, revenue:10, netIncome:0.7, eps:3.8, dividend:1.25, totalDebt:22, equity:70 },
      { year:2018, revenue:12, netIncome:0.9, eps:4.8, dividend:1.5,  totalDebt:24, equity:75 },
      { year:2019, revenue:11, netIncome:0.7, eps:3.8, dividend:0.75, totalDebt:25, equity:74 },
      { year:2020, revenue:14, netIncome:0.9, eps:5.0, dividend:1.5,  totalDebt:26, equity:78 },
      { year:2021, revenue:16, netIncome:1.1, eps:6.1, dividend:1.75, totalDebt:27, equity:80 },
      { year:2022, revenue:18, netIncome:1.3, eps:7.2, dividend:2.0,  totalDebt:27, equity:81 },
      { year:2023, revenue:21, netIncome:1.6, eps:8.8, dividend:2.25, totalDebt:28, equity:82 },
      { year:2024, revenue:24, netIncome:1.1, eps:5.8, dividend:2.5,  totalDebt:28, equity:82 },
    ]
  },
  {
    symbol: 'DIST.N0000', ticker: 'DIST', name: 'Distilleries Company of Sri Lanka PLC',
    sector: 'Beverages', ownerGroup: 'Melstacorp / Dhammika Perera',
    relatedCompanies: ['MELS', 'BIL'],
    description: 'Dominant spirits manufacturer. High market share, strong cash generation, consistent dividends.',
    price: 18.5, pe: 6.2, eps: 2.1, divYield: 8.1, de: 0.45, icr: 9.2, payout: 71,
    financials: [
      { year:2015, revenue:82,  netIncome:5.8, eps:1.5, dividend:1.25, totalDebt:40, equity:105 },
      { year:2016, revenue:88,  netIncome:6.2, eps:1.6, dividend:1.25, totalDebt:42, equity:108 },
      { year:2017, revenue:92,  netIncome:6.8, eps:1.8, dividend:1.5,  totalDebt:44, equity:115 },
      { year:2018, revenue:96,  netIncome:7.2, eps:1.9, dividend:1.5,  totalDebt:46, equity:118 },
      { year:2019, revenue:88,  netIncome:6.0, eps:1.6, dividend:1.25, totalDebt:48, equity:112 },
      { year:2020, revenue:102, netIncome:7.5, eps:2.0, dividend:1.5,  totalDebt:50, equity:120 },
      { year:2021, revenue:110, netIncome:8.2, eps:2.2, dividend:1.75, totalDebt:52, equity:126 },
      { year:2022, revenue:107, netIncome:7.8, eps:2.1, dividend:1.5,  totalDebt:54, equity:128 },
      { year:2023, revenue:112, netIncome:8.0, eps:2.1, dividend:1.5,  totalDebt:56, equity:130 },
      { year:2024, revenue:118, netIncome:8.5, eps:2.1, dividend:1.75, totalDebt:58, equity:130 },
    ]
  },
]

export const SECTORS = [
  'Banking', 'Diversified', 'Telecom', 'Manufacturing',
  'Plantation', 'Hotels & Travel', 'Healthcare',
  'Insurance', 'Retail', 'Energy', 'Logistics', 'Beverages',
  'IT', 'Construction', 'Motor'
]
