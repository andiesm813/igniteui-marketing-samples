import { ChangeDetectionStrategy, Component, ElementRef, OnInit, inject } from '@angular/core';
import { IgxAvatarModule } from 'igniteui-angular/avatar';
import { IgxBadgeModule } from 'igniteui-angular/badge';
import { IgxButtonModule } from 'igniteui-angular/directives';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxGridModule } from 'igniteui-angular/grids/grid';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxListModule } from 'igniteui-angular/list';
import { IgxNavbarModule } from 'igniteui-angular/navbar';
import {
  IgxCategoryChartModule,
  IgxDoughnutChartModule,
  IgxRingSeriesModule,
  IgxSparklineModule
} from 'igniteui-angular-charts';

interface MetricCard {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: string;
  iconClass: string;
}

interface LeaderboardItem {
  rank: number;
  name: string;
  quota: string;
  amount: string;
  delta: string;
  positive: boolean;
}

interface ActivityRow {
  company: string;
  region: string;
  stage: string;
  value: string;
  rep: string;
  source: string;
  when: string;
  stageClass: string;
}

interface WeeklyDealPoint {
  day: string;
  deals: number;
}

interface FinanceHolding {
  ticker: string;
  company: string;
  timeline: number[];
  instrument: 'Bond' | 'ETF' | 'Crypto' | 'Stock';
  pnl: number;
  score: number;
  totalChange: number;
  marketValue: number;
  quantity: number;
  tone: 'blue' | 'orange' | 'green' | 'slate' | 'gold' | 'red';
}

type FinanceTone = 'blue' | 'orange' | 'green' | 'slate' | 'gold' | 'red';

interface FinanceAvatarSource {
  ticker: string;
  tone: FinanceTone;
}

interface PriceTrendPoint {
  value: number;
}

interface IgFinancialSampleRow {
  ticker: string;
  company: string;
  tone: FinanceTone;
  priceTrend: PriceTrendPoint[];
  lastPrice: number;
  changePct: number;
  marketValue: number;
  netProfit: number;
  netProfitPct: number;
  allocationPct: number;
  averageCost: number;
  position: number;
  holdingPeriodDays: number;
}

interface IgFinancialSeedRow {
  ticker: string;
  company: string;
  lastPrice: number;
  changePct: number;
  marketValue: number;
  netProfit: number;
  netProfitPct: number;
  allocationPct: number;
  averageCost: number;
  position: number;
  holdingPeriodDays: number;
  tone: FinanceTone;
}

interface LegacyIgFinanceMappedRow {
  instrument: FinanceHolding['instrument'];
  pnl: number;
  score: number;
  marketValue: number;
  quantity: number;
  tone: FinanceTone;
}

type AppPage = 'dashboard' | 'financeAg' | 'financeSample';

interface AppNavLink {
  label: string;
  page: AppPage;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IgxNavbarModule,
    IgxButtonModule,
    IgxCardModule,
    IgxIconModule,
    IgxBadgeModule,
    IgxCategoryChartModule,
    IgxDoughnutChartModule,
    IgxRingSeriesModule,
    IgxSparklineModule,
    IgxListModule,
    IgxAvatarModule,
    IgxGridModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly tickerLogoCache = new Map<string, string>();
  private readonly currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  private readonly numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  private readonly quantityFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  private readonly percentFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  protected readonly navLinks: AppNavLink[] = [
    { label: 'Sales Dashboard', page: 'dashboard' },
    { label: 'Financial AG Grid', page: 'financeAg' },
    { label: 'IG Financial Sample', page: 'financeSample' }
  ];

  protected currentPage: AppPage = 'dashboard';

  protected readonly financeHoldings: FinanceHolding[] = [
    {
      ticker: 'US10Y',
      company: 'U.S. Treasury 10-Year Bond',
      timeline: [62, 58, 55, 54, 57, 56, 61, 84, 68, 60, 59, 58, 61, 60, 62, 63, 74, 76, 72, 77, 43, 24, 16, 20],
      instrument: 'Bond',
      pnl: -326.58,
      score: 166.84,
      totalChange: -32657.59,
      marketValue: 16684.17,
      quantity: 1000,
      tone: 'blue'
    },
    {
      ticker: 'CAD30Y',
      company: 'Canada 30-Year Government Bond',
      timeline: [42, 41, 39, 40, 73, 77, 75, 70, 57, 55, 35, 32, 54, 53, 28, 22, 25, 20, 18, 17, 20, 19, 15, 16],
      instrument: 'Bond',
      pnl: -119.12,
      score: 103.16,
      totalChange: -11435.59,
      marketValue: 9903.82,
      quantity: 550,
      tone: 'orange'
    },
    {
      ticker: 'MUB',
      company: 'iShares National Muni Bond ETF',
      timeline: [52, 51, 50, 49, 50, 51, 49, 50, 52, 53, 80, 82, 47, 12, 14, 11, 13, 14, 11, 10, 13, 15, 12, 16],
      instrument: 'ETF',
      pnl: -14.8,
      score: 17.37,
      totalChange: -1701.66,
      marketValue: 1997.22,
      quantity: 75,
      tone: 'green'
    },
    {
      ticker: 'BTC-USD',
      company: 'Bitcoin',
      timeline: [16, 58, 49, 34, 31, 36, 38, 44, 35, 37, 39, 40, 41, 42, 43, 42, 41, 40, 39, 38, 37, 37, 36, 35],
      instrument: 'Crypto',
      pnl: 0,
      score: 0.3,
      totalChange: 0,
      marketValue: 9001.25,
      quantity: 200,
      tone: 'gold'
    },
    {
      ticker: 'T',
      company: 'AT&T Inc.',
      timeline: [38, 37, 36, 35, 35, 34, 33, 34, 35, 36, 35, 34, 33, 35, 36, 37, 34, 30, 45, 62, 44, 38, 27, 26],
      instrument: 'Stock',
      pnl: -6.91,
      score: 79.5,
      totalChange: -138.3,
      marketValue: 1590.07,
      quantity: 100,
      tone: 'blue'
    },
    {
      ticker: 'FRN2027',
      company: 'France Government Bond 2027',
      timeline: [65, 64, 63, 62, 61, 60, 56, 54, 49, 46, 45, 44, 45, 49, 53, 60, 66, 70, 18, 5, 11, 8, 9, 8],
      instrument: 'Bond',
      pnl: 25.15,
      score: 120.16,
      totalChange: 2565.29,
      marketValue: 12256.03,
      quantity: 400,
      tone: 'slate'
    },
    {
      ticker: 'ADI',
      company: 'Analog Devices, Inc.',
      timeline: [20, 22, 21, 20, 21, 50, 62, 70, 72, 69, 66, 61, 56, 50, 30, 12, 6, 5, 4, 5, 6, 7, 8, 10],
      instrument: 'Stock',
      pnl: 5.27,
      score: 9.02,
      totalChange: 842.73,
      marketValue: 1443.05,
      quantity: 30,
      tone: 'blue'
    },
    {
      ticker: 'AIG',
      company: 'American International Group',
      timeline: [41, 36, 32, 29, 38, 46, 49, 48, 47, 46, 45, 73, 75, 71, 54, 40, 29, 21, 24, 30, 19, 22, 16, 40],
      instrument: 'Stock',
      pnl: 55.37,
      score: 74.76,
      totalChange: 2879.46,
      marketValue: 3887.27,
      quantity: 80,
      tone: 'slate'
    },
    {
      ticker: 'DAL',
      company: 'Delta Air Lines Inc',
      timeline: [20, 21, 20, 19, 20, 21, 22, 20, 21, 22, 24, 27, 31, 33, 66, 72, 59, 26, 48, 37, 29, 19, 24, 22],
      instrument: 'Stock',
      pnl: 15.48,
      score: 63.64,
      totalChange: 619.38,
      marketValue: 2545.67,
      quantity: 70,
      tone: 'red'
    },
    {
      ticker: 'BP',
      company: 'BP plc',
      timeline: [44, 28, 40, 48, 52, 53, 38, 35, 33, 37, 35, 30, 28, 29, 29, 31, 31, 31, 30, 2, 2, 3, 3, 2],
      instrument: 'Stock',
      pnl: -4.2,
      score: 4.83,
      totalChange: -1280.15,
      marketValue: 1472.35,
      quantity: 75,
      tone: 'green'
    },
    {
      ticker: 'MA',
      company: 'Mastercard Inc',
      timeline: [34, 20, 17, 29, 31, 43, 43, 44, 44, 45, 44, 43, 42, 41, 42, 43, 44, 45, 44, 3, 2, 2, 3, 2],
      instrument: 'Stock',
      pnl: -0.3,
      score: 0.56,
      totalChange: -104.21,
      marketValue: 195.78,
      quantity: 15,
      tone: 'orange'
    },
    {
      ticker: 'VGT',
      company: 'Vanguard Information Tech ETF',
      timeline: [52, 57, 58, 56, 55, 55, 54, 53, 53, 54, 56, 58, 59, 58, 56, 55, 54, 53, 52, 3, 2, 3, 2, 3],
      instrument: 'ETF',
      pnl: 1.92,
      score: 3.22,
      totalChange: 711.47,
      marketValue: 1190.42,
      quantity: 25,
      tone: 'red'
    },
    {
      ticker: 'PBR',
      company: 'Petrobras',
      timeline: [20, 17, 12, 8, 8, 7, 8, 9, 10, 12, 13, 14, 13, 12, 12, 12, 11, 10, 14, 24, 42, 50, 47, 40],
      instrument: 'Stock',
      pnl: 0,
      score: 259.86,
      totalChange: 0,
      marketValue: 2598.63,
      quantity: 100,
      tone: 'green'
    },
    {
      ticker: 'EUBOND',
      company: 'Eurozone 20-Year Government Bond',
      timeline: [46, 47, 48, 47, 47, 46, 45, 46, 47, 48, 49, 50, 47, 43, 39, 36, 24, 18, 20, 15, 13, 12, 14, 13],
      instrument: 'Bond',
      pnl: -45.69,
      score: 20.91,
      totalChange: -4569.16,
      marketValue: 2090.73,
      quantity: 150,
      tone: 'orange'
    },
    {
      ticker: 'CORPBOND',
      company: 'Corporate Bond Generic',
      timeline: [50, 51, 49, 48, 47, 46, 45, 44, 36, 33, 31, 28, 30, 35, 34, 32, 31, 29, 27, 24, 21, 20, 18, 17],
      instrument: 'Bond',
      pnl: -22.51,
      score: 67.36,
      totalChange: -2363.12,
      marketValue: 7072.89,
      quantity: 200,
      tone: 'gold'
    },
    {
      ticker: 'JNJ',
      company: 'Johnson & Johnson',
      timeline: [72, 71, 70, 69, 67, 65, 63, 58, 54, 45, 39, 32, 30, 27, 8, 5, 6, 5, 4, 5, 6, 7, 6, 7],
      instrument: 'Stock',
      pnl: -6.71,
      score: 5.04,
      totalChange: -1073.42,
      marketValue: 806.88,
      quantity: 40,
      tone: 'red'
    },
    {
      ticker: 'V',
      company: 'Visa Inc',
      timeline: [70, 69, 68, 67, 66, 65, 64, 63, 61, 60, 59, 57, 55, 52, 9, 6, 5, 5, 6, 5, 5, 6, 5, 5],
      instrument: 'Stock',
      pnl: 1,
      score: 4.22,
      totalChange: 120.17,
      marketValue: 886.63,
      quantity: 25,
      tone: 'blue'
    },
    {
      ticker: 'PEP',
      company: 'PepsiCo Inc',
      timeline: [76, 74, 48, 32, 31, 30, 29, 30, 31, 32, 31, 30, 29, 30, 31, 32, 33, 31, 29, 4, 4, 4, 4, 4],
      instrument: 'Stock',
      pnl: 0.36,
      score: 8.37,
      totalChange: 57.97,
      marketValue: 1339.32,
      quantity: 40,
      tone: 'slate'
    },
    {
      ticker: 'UBER',
      company: 'Uber Technologies Inc',
      timeline: [30, 29, 48, 58, 60, 61, 59, 57, 55, 53, 40, 36, 35, 34, 33, 32, 33, 34, 33, 32, 30, 29, 26, 24],
      instrument: 'Stock',
      pnl: -16.56,
      score: 38.34,
      totalChange: -728.68,
      marketValue: 1686.97,
      quantity: 70,
      tone: 'slate'
    },
    {
      ticker: 'XLF',
      company: 'Financial Select Sector SPDR Fund',
      timeline: [22, 21, 20, 19, 18, 20, 24, 41, 53, 35, 28, 44, 51, 53, 54, 49, 35, 26, 34, 42, 48, 50, 31, 12],
      instrument: 'ETF',
      pnl: 60.68,
      score: 110.65,
      totalChange: 2002.36,
      marketValue: 3651.46,
      quantity: 75,
      tone: 'blue'
    },
    {
      ticker: 'MRNA',
      company: 'Moderna Inc',
      timeline: [45, 46, 47, 46, 45, 44, 43, 42, 28, 14, 11, 36, 49, 53, 51, 48, 46, 45, 44, 43, 42, 41, 40, 7],
      instrument: 'Stock',
      pnl: 0,
      score: 6.08,
      totalChange: 0,
      marketValue: 911.96,
      quantity: 50,
      tone: 'red'
    }
  ];

  private readonly igFinancialSeedRows: IgFinancialSeedRow[] = [
    { ticker: 'AMD', company: 'Advanced Micro Devices Inc.', lastPrice: 130.36, changePct: 0, marketValue: 3128.64, netProfit: 1315.68, netProfitPct: 72.57, allocationPct: 4.38, averageCost: 75.54, position: 24, holdingPeriodDays: 157, tone: 'blue' },
    { ticker: 'ETH', company: 'Ethereum', lastPrice: 3567.93, changePct: -0.2, marketValue: 10073.79, netProfit: 3074.79, netProfitPct: 40.3, allocationPct: 18.43, averageCost: 2543, position: 3, holdingPeriodDays: 120, tone: 'slate' },
    { ticker: 'ABNB', company: 'Airbnb Inc.', lastPrice: 130.65, changePct: -0.77, marketValue: 3004.95, netProfit: 1709.59, netProfitPct: 131.98, allocationPct: 3.13, averageCost: 56.32, position: 23, holdingPeriodDays: 540, tone: 'red' },
    { ticker: 'BABA', company: 'Alibaba Group Holding Limited', lastPrice: 81.81, changePct: 1.22, marketValue: 981.72, netProfit: -310.92, netProfitPct: -24.05, allocationPct: 3.12, averageCost: 107.72, position: 12, holdingPeriodDays: 91, tone: 'orange' },
    { ticker: 'BTC', company: 'Bitcoin', lastPrice: 95300.86, changePct: 0.72, marketValue: 19060.17, netProfit: 7013.97, netProfitPct: 58.23, allocationPct: 29.1, averageCost: 60231, position: 0.2, holdingPeriodDays: 323, tone: 'gold' },
    { ticker: 'BKNG', company: 'Booking Holdings Inc', lastPrice: 4932.51, changePct: 1.03, marketValue: 986.5, netProfit: 110.86, netProfitPct: 12.66, allocationPct: 2.12, averageCost: 4378.21, position: 0.2, holdingPeriodDays: 17, tone: 'blue' },
    { ticker: 'COST', company: 'Costco Wholesale Corporation', lastPrice: 911.37, changePct: -0.33, marketValue: 9113.7, netProfit: 212.5, netProfitPct: 2.39, allocationPct: 21.5, averageCost: 890.12, position: 10, holdingPeriodDays: 32, tone: 'red' },
    { ticker: 'DPZ', company: 'Dominos Pizza Inc', lastPrice: 19.5, changePct: 0, marketValue: 409.5, netProfit: -96.6, netProfitPct: -19.09, allocationPct: 1.22, averageCost: 24.1, position: 21, holdingPeriodDays: 54, tone: 'red' },
    { ticker: 'FDX', company: 'FedEx Corporation', lastPrice: 286.96, changePct: 0.35, marketValue: 573.92, netProfit: 35.82, netProfitPct: 6.66, allocationPct: 1.3, averageCost: 269.05, position: 2, holdingPeriodDays: 72, tone: 'orange' },
    { ticker: 'F', company: 'Ford Motor Company', lastPrice: 10.41, changePct: 0, marketValue: 58.3, netProfit: -26.88, netProfitPct: -31.56, allocationPct: 0.21, averageCost: 15.21, position: 5.6, holdingPeriodDays: 431, tone: 'blue' },
    { ticker: 'GM', company: 'General Motors Company', lastPrice: 53.25, changePct: 0, marketValue: 165.08, netProfit: 65.07, netProfitPct: 65.07, allocationPct: 0.24, averageCost: 32.26, position: 3.1, holdingPeriodDays: 652, tone: 'blue' },
    { ticker: 'AAPL', company: 'Apple Inc.', lastPrice: 223.36, changePct: 0.45, marketValue: 245.7, netProfit: 76.07, netProfitPct: 44.84, allocationPct: 0.41, averageCost: 154.21, position: 1.1, holdingPeriodDays: 632, tone: 'slate' },
    { ticker: 'MSFT', company: 'Microsoft Corp.', lastPrice: 401.22, changePct: 0.5, marketValue: 280.85, netProfit: -20.15, netProfitPct: -6.69, allocationPct: 0.73, averageCost: 430, position: 0.7, holdingPeriodDays: 342, tone: 'blue' },
    { ticker: 'GOOGL', company: 'Alphabet Inc.', lastPrice: 160.02, changePct: 1.25, marketValue: 208.03, netProfit: -18.17, netProfitPct: -8.03, allocationPct: 0.55, averageCost: 174, position: 1.3, holdingPeriodDays: 376, tone: 'green' },
    { ticker: 'AMZN', company: 'Amazon.com Inc.', lastPrice: 205.87, changePct: 0.49, marketValue: 885.24, netProfit: -285.82, netProfitPct: -24.41, allocationPct: 2.83, averageCost: 272.34, position: 4.3, holdingPeriodDays: 352, tone: 'gold' },
    { ticker: 'JPM', company: 'JPMorgan Chase and Co', lastPrice: 238.84, changePct: -0.42, marketValue: 71.65, netProfit: 1.42, netProfitPct: 2.02, allocationPct: 0.17, averageCost: 234.11, position: 0.3, holdingPeriodDays: 13, tone: 'blue' },
    { ticker: 'TSLA', company: 'Tesla Inc.', lastPrice: 332.92, changePct: 0.9, marketValue: 1598.02, netProfit: 157.01, netProfitPct: 10.9, allocationPct: 3.48, averageCost: 300.21, position: 4.8, holdingPeriodDays: 452, tone: 'red' },
    { ticker: 'NVDA', company: 'NVIDIA Corp.', lastPrice: 136.92, changePct: 0, marketValue: 164.3, netProfit: 44.3, netProfitPct: 36.92, allocationPct: 0.29, averageCost: 100, position: 1.2, holdingPeriodDays: 237, tone: 'green' },
    { ticker: 'K', company: 'Kellogg Company', lastPrice: 76.66, changePct: 0, marketValue: 15.33, netProfit: -0.31, netProfitPct: -1.98, allocationPct: 0.04, averageCost: 78.23, position: 0.2, holdingPeriodDays: 2, tone: 'red' },
    { ticker: 'V', company: 'Visa Inc.', lastPrice: 307.92, changePct: 0.65, marketValue: 24.63, netProfit: -2.37, netProfitPct: -8.78, allocationPct: 0.07, averageCost: 337.6, position: 0.08, holdingPeriodDays: 365, tone: 'blue' },
    { ticker: 'JNJ', company: 'Johnson & Johnson', lastPrice: 155.77, changePct: -0.64, marketValue: 327.12, netProfit: -33.41, netProfitPct: -9.27, allocationPct: 0.87, averageCost: 171.68, position: 2.1, holdingPeriodDays: 420, tone: 'red' },
    { ticker: 'PG', company: 'Procter & Gamble Co.', lastPrice: 156.89, changePct: 0, marketValue: 141.2, netProfit: -9.01, netProfitPct: -6, allocationPct: 0.36, averageCost: 166.9, position: 0.9, holdingPeriodDays: 150, tone: 'slate' },
    { ticker: 'WMT', company: 'Walmart Inc.', lastPrice: 145.65, changePct: -1.37, marketValue: 52.43, netProfit: 9.23, netProfitPct: 21.37, allocationPct: 0.1, averageCost: 120, position: 0.36, holdingPeriodDays: 250, tone: 'blue' },
    { ticker: 'HD', company: 'The Home Depot Inc.', lastPrice: 428.61, changePct: -1.4, marketValue: 145.73, netProfit: -7.72, netProfitPct: -5.03, allocationPct: 0.37, averageCost: 451.31, position: 0.34, holdingPeriodDays: 290, tone: 'orange' },
    { ticker: 'KO', company: 'Coca-Cola Co.', lastPrice: 56.79, changePct: 0, marketValue: 22.72, netProfit: -11.87, netProfitPct: -34.32, allocationPct: 0.08, averageCost: 86.46, position: 0.4, holdingPeriodDays: 180, tone: 'red' },
    { ticker: 'PEP', company: 'PepsiCo Inc.', lastPrice: 184.37, changePct: -1.08, marketValue: 36.87, netProfit: -1.16, netProfitPct: -3.05, allocationPct: 0.09, averageCost: 190.15, position: 0.2, holdingPeriodDays: 430, tone: 'slate' },
    { ticker: 'DIS', company: 'Walt Disney Co.', lastPrice: 178, changePct: 0.56, marketValue: 33.82, netProfit: -8.47, netProfitPct: -20.03, allocationPct: 0.1, averageCost: 222.56, position: 0.19, holdingPeriodDays: 380, tone: 'red' },
    { ticker: 'PFE', company: 'Pfizer Inc.', lastPrice: 39.81, changePct: 0, marketValue: 3.98, netProfit: -0.15, netProfitPct: -3.63, allocationPct: 0.01, averageCost: 41.32, position: 0.1, holdingPeriodDays: 180, tone: 'blue' },
    { ticker: 'XOM', company: 'Exxon Mobil Corp.', lastPrice: 114.38, changePct: 1.75, marketValue: 388.89, netProfit: -100.06, netProfitPct: -20.46, allocationPct: 1.18, averageCost: 143.81, position: 3.4, holdingPeriodDays: 400, tone: 'red' },
    { ticker: 'CVX', company: 'Chevron Corp.', lastPrice: 179.62, changePct: -0.56, marketValue: 71.85, netProfit: 11.12, netProfitPct: 18.31, allocationPct: 0.15, averageCost: 151.82, position: 0.4, holdingPeriodDays: 320, tone: 'blue' },
    { ticker: 'MCD', company: 'McDonalds Corporation', lastPrice: 281.27, changePct: 0.61, marketValue: 87.19, netProfit: 74.62, netProfitPct: 132.06, allocationPct: 0.17, averageCost: 121.21, position: 0.31, holdingPeriodDays: 610, tone: 'gold' }
  ];

  protected readonly igFinancialSampleRows: IgFinancialSampleRow[] = this.igFinancialSeedRows.map((row) => ({
    ticker: row.ticker,
    company: row.company,
    tone: row.tone,
    priceTrend: this.buildPriceTrend(row.ticker, row.lastPrice, row.changePct),
    lastPrice: row.lastPrice,
    changePct: row.changePct,
    marketValue: row.marketValue,
    netProfit: row.netProfit,
    netProfitPct: row.netProfitPct,
    allocationPct: row.allocationPct,
    averageCost: row.averageCost,
    position: row.position,
    holdingPeriodDays: row.holdingPeriodDays
  }));

  protected readonly maxAllocationPct = Math.max(
    ...this.igFinancialSampleRows.map((row) => Math.abs(row.allocationPct)),
    0
  );

  protected readonly metrics: MetricCard[] = [
    { label: 'Revenue MTD', value: '$842.3K', delta: '12.4% vs target', positive: true, icon: 'attach_money', iconClass: 'rank-badge rank-1' },
    { label: 'Quota Attainment', value: '94%', delta: '1.3 pts vs last month', positive: true, icon: 'percent', iconClass: 'rank-badge rank-2' },
    { label: 'Deals Closed (Mtd)', value: '37', delta: '6 vs last month', positive: true, icon: 'tag', iconClass: 'rank-badge rank-3' },
    { label: 'Avg Deal Size', value: '$22.8K', delta: '1.9% vs last month', positive: false, icon: 'diamond', iconClass: 'icon-avg' }
  ];

  protected readonly revenueTrend = [
    { month: 'Jan', revenue: 648, targetLine: 635 },
    { month: 'Feb', revenue: 662, targetLine: 646 },
    { month: 'Mar', revenue: 684, targetLine: 658 },
    { month: 'Apr', revenue: 702, targetLine: 672 },
    { month: 'May', revenue: 728, targetLine: 696 },
    { month: 'Jun', revenue: 760, targetLine: 724 },
    { month: 'Jul', revenue: 790, targetLine: 752 }
  ];

  protected readonly revenueByRegion = [
    { region: 'West', value: 37 },
    { region: 'East', value: 32 },
    { region: 'Central', value: 22 },
    { region: 'International', value: 9 }
  ];

  protected readonly weeklyDeals: WeeklyDealPoint[] = [
    { day: 'Mon', deals: 18 },
    { day: 'Tue', deals: 23 },
    { day: 'Wed', deals: 16 },
    { day: 'Thu', deals: 29 },
    { day: 'Fri', deals: 35 },
    { day: 'Sat', deals: 42 },
    { day: 'Sun', deals: 25 }
  ];

  protected chartPalette = ['#7b62e8', '#2ab184', '#f0a12c', '#d84b98'];
  protected trendBrushes = [this.chartPalette[0], this.chartPalette[3]];
  protected dealsBrushes = [this.chartPalette[0]];

  protected readonly leaderboard: LeaderboardItem[] = [
    { rank: 1, name: 'Dana Voss', quota: '128% of quota', amount: '$312,400', delta: '18%', positive: true },
    { rank: 2, name: 'Marcus Ibe', quota: '116% of quota', amount: '$284,900', delta: '8%', positive: true },
    { rank: 3, name: 'Priya Shah', quota: '104% of quota', amount: '$256,100', delta: '14%', positive: true },
    { rank: 4, name: 'Tom Reyes', quota: '98% of quota', amount: '$231,700', delta: '-2%', positive: false },
    { rank: 5, name: 'Elena Cruz', quota: '91% of quota', amount: '$198,300', delta: '-5%', positive: false },
    { rank: 6, name: 'Leo Martin', quota: '89% of quota', amount: '$186,900', delta: '4%', positive: true },
    { rank: 7, name: 'Sofia Kim', quota: '86% of quota', amount: '$174,200', delta: '3%', positive: true },
    { rank: 8, name: 'Noah Bennett', quota: '82% of quota', amount: '$162,800', delta: '-1%', positive: false },
    { rank: 9, name: 'Maya Patel', quota: '79% of quota', amount: '$154,600', delta: '2%', positive: true },
    { rank: 10, name: 'Chris Nolan', quota: '75% of quota', amount: '$148,100', delta: '-3%', positive: false }
  ];

  protected readonly activityRows: ActivityRow[] = [
    { company: 'Vantage Corp', region: 'West', stage: 'Closed Won', value: '$48,200', rep: 'Dana Voss', source: 'Referral', when: '2h ago', stageClass: 'stage-win' },
    { company: 'Northfield Retail', region: 'Central', stage: 'Proposal Sent', value: '$22,000', rep: 'Priya Shah', source: 'Inbound', when: '5h ago', stageClass: 'stage-proposal' },
    { company: 'Callisto Systems', region: 'East', stage: 'Negotiation', value: '$67,500', rep: 'Marcus Ibe', source: 'Outbound', when: '1d ago', stageClass: 'stage-negotiation' },
    { company: 'Bright Path LLC', region: 'West', stage: 'Closed Won', value: '$15,300', rep: 'Tom Reyes', source: 'Partner', when: '1d ago', stageClass: 'stage-win' },
    { company: 'Ferro Industrial', region: 'International', stage: 'Qualified', value: '$91,000', rep: 'Elena Cruz', source: 'Conference', when: '2d ago', stageClass: 'stage-qualified' },
    { company: 'Atlas Foods', region: 'Central', stage: 'Proposal Sent', value: '$38,400', rep: 'Leo Martin', source: 'Inbound', when: '2d ago', stageClass: 'stage-proposal' },
    { company: 'Nimbus Health', region: 'East', stage: 'Negotiation', value: '$57,800', rep: 'Sofia Kim', source: 'Outbound', when: '3d ago', stageClass: 'stage-negotiation' },
    { company: 'Summit Works', region: 'West', stage: 'Qualified', value: '$26,900', rep: 'Noah Bennett', source: 'Referral', when: '3d ago', stageClass: 'stage-qualified' },
    { company: 'Blue Harbor', region: 'International', stage: 'Closed Won', value: '$44,700', rep: 'Maya Patel', source: 'Partner', when: '4d ago', stageClass: 'stage-win' },
    { company: 'Orion Energy', region: 'East', stage: 'Proposal Sent', value: '$72,500', rep: 'Chris Nolan', source: 'Conference', when: '4d ago', stageClass: 'stage-proposal' },
    { company: 'Red Cedar Co', region: 'Central', stage: 'Negotiation', value: '$33,600', rep: 'Dana Voss', source: 'Outbound', when: '5d ago', stageClass: 'stage-negotiation' },
    { company: 'Apex Logistics', region: 'West', stage: 'Closed Won', value: '$58,100', rep: 'Marcus Ibe', source: 'Inbound', when: '5d ago', stageClass: 'stage-win' },
    { company: 'North Ridge', region: 'Central', stage: 'Qualified', value: '$19,400', rep: 'Priya Shah', source: 'Referral', when: '6d ago', stageClass: 'stage-qualified' },
    { company: 'Everfield Labs', region: 'East', stage: 'Proposal Sent', value: '$41,250', rep: 'Tom Reyes', source: 'Partner', when: '6d ago', stageClass: 'stage-proposal' },
    { company: 'Clearwater Tech', region: 'International', stage: 'Closed Won', value: '$63,900', rep: 'Elena Cruz', source: 'Inbound', when: '1w ago', stageClass: 'stage-win' },
    { company: 'Harborline Media', region: 'West', stage: 'Negotiation', value: '$28,700', rep: 'Leo Martin', source: 'Outbound', when: '1w ago', stageClass: 'stage-negotiation' },
    { company: 'Pioneer Metals', region: 'Central', stage: 'Qualified', value: '$76,300', rep: 'Sofia Kim', source: 'Conference', when: '1w ago', stageClass: 'stage-qualified' }
  ];

  ngOnInit(): void {
    const resolvedPalette = this.resolveChartPalette();
    this.chartPalette = resolvedPalette;
    this.trendBrushes = [resolvedPalette[0], resolvedPalette[3]];
    this.dealsBrushes = [resolvedPalette[0]];
  }

  private resolveChartPalette(): string[] {
    const styles = getComputedStyle(this.host.nativeElement);
    return [
      this.resolveCssColor(styles, '--chart-1', '#7b62e8'),
      this.resolveCssColor(styles, '--chart-2', '#2ab184'),
      this.resolveCssColor(styles, '--chart-3', '#f0a12c'),
      this.resolveCssColor(styles, '--chart-4', '#d84b98')
    ];
  }

  private resolveCssColor(styles: CSSStyleDeclaration, token: string, fallback: string): string {
    const value = styles.getPropertyValue(token).trim();
    return value || fallback;
  }

  protected stageClassFor(stage: string): string {
    if (stage === 'Closed Won') {
      return 'stage-win';
    }

    if (stage === 'Proposal Sent') {
      return 'stage-proposal';
    }

    if (stage === 'Negotiation') {
      return 'stage-negotiation';
    }

    if (stage === 'Qualified') {
      return 'stage-qualified';
    }

    return '';
  }

  protected openPage(page: AppPage): void {
    this.currentPage = page;
  }

  protected isActivePage(page: AppPage): boolean {
    return this.currentPage === page;
  }

  protected financePageTitle(): string {
    return this.currentPage === 'financeSample' ? 'IG Financial Sample' : 'Financial AG Grid';
  }

  protected activeFinanceHoldings(): FinanceHolding[] {
    return this.financeHoldings;
  }

  protected signedCurrency(value: number): string {
    if (value === 0) {
      return this.currencyFormatter.format(0);
    }

    return this.currencyFormatter.format(Math.abs(value));
  }

  protected deltaClass(value: number): string {
    if (value > 0) {
      return 'positive';
    }

    if (value < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  protected formatNumber(value: number): string {
    return this.numberFormatter.format(value);
  }

  protected formatCurrency(value: number): string {
    return this.currencyFormatter.format(value);
  }

  protected formatQuantity(value: number): string {
    return this.quantityFormatter.format(value);
  }

  protected formatPercent(value: number): string {
    return `${this.percentFormatter.format(Math.abs(value))}%`;
  }

  protected formatHoldingPeriod(days: number): string {
    return `${days} days`;
  }

  protected allocationWidth(value: number): string {
    const magnitude = Math.abs(value);
    if (magnitude === 0) {
      return '0%';
    }

    if (this.maxAllocationPct <= 0) {
      return '0%';
    }

    const scaled = (magnitude / this.maxAllocationPct) * 100;
    const minVisible = 6;
    return `${Math.min(100, Math.max(minVisible, scaled))}%`;
  }

  protected tickerLogo(holding: FinanceAvatarSource): string {
    const cacheKey = `${holding.ticker}:${holding.tone}`;
    const cached = this.tickerLogoCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const logo = this.buildTickerAvatarSvg(this.logoText(holding.ticker), this.toneColor(holding.tone));
    this.tickerLogoCache.set(cacheKey, logo);
    return logo;
  }

  private logoText(ticker: string): string {
    return ticker.replace(/[^A-Z0-9]/gi, '').slice(0, 3).toUpperCase() || 'EQ';
  }

  private buildPriceTrend(ticker: string, lastPrice: number, changePct: number): PriceTrendPoint[] {
    const points = 30;
    const target = Number(changePct.toFixed(2));
    const volatility = Math.max(0.2, Math.min(1.15, Math.abs(changePct) * 0.55 + 0.25));
    const hashSeed = ticker.split('').reduce((acc, ch) => ((acc * 31) + ch.charCodeAt(0)) >>> 0, 2166136261);
    let seed = hashSeed;
    let value = 0;
    const series: PriceTrendPoint[] = [];

    const nextRandom = (): number => {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4294967296;
    };

    for (let index = 0; index < points; index++) {
      const t = index / (points - 1);
      const directionalTarget = target * t;
      const randomStep = (nextRandom() - 0.5) * volatility;
      const pull = (directionalTarget - value) * 0.22;
      const microWave = Math.sin((t * Math.PI * 9) + (hashSeed % 11)) * 0.06;

      value += randomStep + pull + microWave;
      series.push({ value: Number(value.toFixed(2)) });
    }

    if (series.length > 0) {
      series[series.length - 1] = { value: target };
    }

    return series;
  }

  protected sparklineBrush(changePct: number): string {
    if (changePct < 0) {
      return '#e34b4b';
    }

    return '#1dbf63';
  }

  protected sparklineNegativeBrush(changePct: number): string {
    if (changePct < 0) {
      return '#ff7a7a';
    }

    return '#e34b4b';
  }

  private toneColor(tone: FinanceTone): string {
    const colors: Record<FinanceTone, string> = {
      blue: '#2f74c0',
      orange: '#d97b23',
      green: '#3ea35b',
      slate: '#5c7399',
      gold: '#c7a43b',
      red: '#bf4a4a'
    };

    return colors[tone];
  }

  private buildTickerAvatarSvg(text: string, background: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${background}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Barlow,Segoe UI,sans-serif" font-size="24" font-weight="700" fill="#ffffff">${text}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

}
