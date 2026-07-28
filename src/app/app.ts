import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { IgxAvatarModule } from 'igniteui-angular/avatar';
import { IgxBadgeModule } from 'igniteui-angular/badge';
import { IgxButtonModule } from 'igniteui-angular/directives';
import { IgxCardModule } from 'igniteui-angular/card';
import { IgxChipsModule } from 'igniteui-angular/chips';
import { IgxGridModule } from 'igniteui-angular/grids/grid';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxInputGroupModule } from 'igniteui-angular/input-group';
import { IgxListModule } from 'igniteui-angular/list';
import { IgxNavbarModule } from 'igniteui-angular/navbar';
import { IgxTabsModule } from 'igniteui-angular/tabs';
import {
  IgxCategoryChartModule,
  IgxDoughnutChartModule,
  IgxRingSeriesModule,
  IgxSparklineModule
} from 'igniteui-angular-charts';
import type { IgcCellContext } from 'igniteui-grid-lite';
import { html, type TemplateResult } from 'lit';

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

interface FleetMetric {
  label: string;
  value: number;
}

type FleetStatus = 'Active' | 'Available' | 'In Maintenance';

type FleetStatusFilter = 'all' | FleetStatus;

interface FleetVehicleSpecs {
  engine: string;
  generation: string;
  year: number;
  fuelType: string;
  power: string;
  mileage: string;
  doorsSeats: string;
  cubature: string;
  color: string;
  transmission: string;
  msrp: string;
  tollPassId: string;
}

interface FleetVehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  type: string;
  vin: string;
  status: FleetStatus;
  locationCity: string;
  locationGps: string;
  specs: FleetVehicleSpecs;
}

interface FleetTripRow {
  date: string;
  from: string;
  to: string;
  startMeter: string;
  endMeter: string;
  distance: string;
  duration: string;
  driver: string;
}

interface FleetMaintenanceRow {
  date: string;
  service: string;
  odometer: string;
  cost: string;
  status: 'Completed' | 'Scheduled';
}

interface FleetCostItem {
  label: string;
  value: number;
  tone: 'fuel' | 'maintenance' | 'insurance' | 'tolls';
}

interface FleetCostDistributionPoint {
  label: string;
  displayLabel: string;
  percentage: string;
  value: number;
  tone: FleetCostItem['tone'];
}

interface FleetMonthlySpendPoint {
  month: string;
  spend: number;
}

interface FleetUtilizationComparisonPoint {
  month: string;
  utilization2024: number;
  utilization2025: number;
}

interface EmployeeRecord {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  satisfactionRating: number;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract';
  emailAddress: string;
  department: 'Finance' | 'Engineering' | 'Marketing' | 'Sales';
  registeredOn: string;
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

type AppPage = 'dashboard' | 'financeAg' | 'financeSample' | 'fleetManagement' | 'employeeDirectory';

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
    IgxGridModule,
    IgxInputGroupModule,
    IgxChipsModule,
    IgxTabsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly fleetVehiclePhotoCatalog: readonly string[] = [
    'https://images.pexels.com/photos/261985/pexels-photo-261985.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/34712982/pexels-photo-34712982.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/32923911/pexels-photo-32923911.png?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/24906491/pexels-photo-24906491.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/25637367/pexels-photo-25637367.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/627719/pexels-photo-627719.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/27497572/pexels-photo-27497572.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/27497571/pexels-photo-27497571.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3002139/pexels-photo-3002139.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/12920557/pexels-photo-12920557.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/27229490/pexels-photo-27229490.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/17534546/pexels-photo-17534546.jpeg?auto=compress&cs=tinysrgb&w=1200'
  ];
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
    { label: 'IG Financial Sample', page: 'financeSample' },
    { label: 'Fleet Management', page: 'fleetManagement' },
    { label: 'Employee Directory', page: 'employeeDirectory' }
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
    { ticker: 'MCD', company: 'McDonalds Corporation', lastPrice: 281.27, changePct: 0.61, marketValue: 87.19, netProfit: 74.62, netProfitPct: 132.06, allocationPct: 0.17, averageCost: 121.21, position: 0.31, holdingPeriodDays: 610, tone: 'gold' },
    { ticker: 'INTC', company: 'Intel Corp.', lastPrice: 23.65, changePct: 0, marketValue: 6.39, netProfit: -16.56, netProfitPct: -72.18, allocationPct: 0.01, averageCost: 85, position: 0.27, holdingPeriodDays: 342, tone: 'green' },
    { ticker: 'NFLX', company: 'Netflix Inc.', lastPrice: 877.34, changePct: 0, marketValue: 105.28, netProfit: 99.88, netProfitPct: 1849.64, allocationPct: 0.19, averageCost: 45, position: 0.12, holdingPeriodDays: 289, tone: 'blue' },
    { ticker: 'ADBE', company: 'Adobe Inc.', lastPrice: 513.68, changePct: 0, marketValue: 174.65, netProfit: 148.13, netProfitPct: 558.56, allocationPct: 0.32, averageCost: 78, position: 0.34, holdingPeriodDays: 412, tone: 'gold' },
    { ticker: 'CRM', company: 'Salesforce Inc.', lastPrice: 341.45, changePct: 0, marketValue: 307.31, netProfit: 256.9, netProfitPct: 509.73, allocationPct: 0.56, averageCost: 56, position: 0.9, holdingPeriodDays: 198, tone: 'gold' },
    { ticker: 'BA', company: 'Boeing Co', lastPrice: 152.4, changePct: 0, marketValue: 71.63, netProfit: 28.39, netProfitPct: 65.65, allocationPct: 0.13, averageCost: 92, position: 0.47, holdingPeriodDays: 276, tone: 'red' },
    { ticker: 'IBM', company: 'IBM Corp.', lastPrice: 222.97, changePct: 0, marketValue: 66.89, netProfit: 53.39, netProfitPct: 395.49, allocationPct: 0.12, averageCost: 45, position: 0.3, holdingPeriodDays: 365, tone: 'blue' },
    { ticker: 'MDLZ', company: 'Mondelez International Inc', lastPrice: 64.4, changePct: 0, marketValue: 61.18, netProfit: -47.5, netProfitPct: -43.71, allocationPct: 0.11, averageCost: 114.4, position: 0.95, holdingPeriodDays: 2, tone: 'red' },
    { ticker: 'MS', company: 'Morgan Stanley', lastPrice: 131.2, changePct: 0, marketValue: 87.9, netProfit: -33.5, netProfitPct: -27.59, allocationPct: 0.16, averageCost: 181.2, position: 0.67, holdingPeriodDays: 13, tone: 'gold' },
    { ticker: 'SPOT', company: 'Spotify Technology SA', lastPrice: 475.87, changePct: 0, marketValue: 166.55, netProfit: -17.5, netProfitPct: -9.51, allocationPct: 0.3, averageCost: 525.87, position: 0.35, holdingPeriodDays: 41, tone: 'green' },
    { ticker: 'MMM', company: '3M Co.', lastPrice: 130.32, changePct: 0, marketValue: 195.48, netProfit: -30, netProfitPct: -13.3, allocationPct: 0.36, averageCost: 150.32, position: 1.5, holdingPeriodDays: 123, tone: 'slate' },
    { ticker: 'CSCO', company: 'Cisco Systems Inc.', lastPrice: 58.74, changePct: 0, marketValue: 28.2, netProfit: -19.2, netProfitPct: -40.51, allocationPct: 0.05, averageCost: 98.74, position: 0.48, holdingPeriodDays: 456, tone: 'green' },
    { ticker: 'SBUX', company: 'Starbucks Corp.', lastPrice: 101.51, changePct: 0, marketValue: 22.33, netProfit: -8.8, netProfitPct: -28.27, allocationPct: 0.04, averageCost: 141.51, position: 0.22, holdingPeriodDays: 234, tone: 'gold' },
    { ticker: 'AXP', company: 'American Express Co.', lastPrice: 304.28, changePct: 0, marketValue: 100.41, netProfit: -13.2, netProfitPct: -11.62, allocationPct: 0.18, averageCost: 344.28, position: 0.33, holdingPeriodDays: 389, tone: 'red' },
    { ticker: 'GE', company: 'General Electric Co.', lastPrice: 181.15, changePct: 0, marketValue: 126.8, netProfit: -28, netProfitPct: -18.09, allocationPct: 0.23, averageCost: 221.15, position: 0.7, holdingPeriodDays: 178, tone: 'green' },
    { ticker: 'UBER', company: 'Uber Technologies Inc', lastPrice: 71.51, changePct: 0, marketValue: 16.45, netProfit: 3.45, netProfitPct: 26.54, allocationPct: 0.03, averageCost: 56.51, position: 0.23, holdingPeriodDays: 487, tone: 'green' },
    { ticker: 'ZM', company: 'Zoom Video Communications Inc', lastPrice: 89.03, changePct: 0, marketValue: 9.79, netProfit: 3.85, netProfitPct: 64.78, allocationPct: 0.02, averageCost: 54.03, position: 0.11, holdingPeriodDays: 276, tone: 'red' },
    { ticker: 'CAT', company: 'Caterpillar Inc.', lastPrice: 406.35, changePct: 0, marketValue: 77.21, netProfit: -7.6, netProfitPct: -8.96, allocationPct: 0.14, averageCost: 446.35, position: 0.19, holdingPeriodDays: 87, tone: 'blue' },
    { ticker: 'HON', company: 'Honeywell International Inc.', lastPrice: 229.64, changePct: 0, marketValue: 50.52, netProfit: -8.8, netProfitPct: -14.83, allocationPct: 0.09, averageCost: 269.64, position: 0.22, holdingPeriodDays: 276, tone: 'orange' },
    { ticker: 'PYPL', company: 'PayPal Holdings Inc.', lastPrice: 86.57, changePct: 0, marketValue: 32.03, netProfit: -14.8, netProfitPct: -31.6, allocationPct: 0.06, averageCost: 126.57, position: 0.37, holdingPeriodDays: 412, tone: 'orange' }
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

  protected readonly financeAssetFilter = signal('');

  protected readonly filteredIgFinancialRows = computed(() => {
    const query = this.financeAssetFilter().trim().toLowerCase();
    if (!query) return this.igFinancialSampleRows;
    return this.igFinancialSampleRows.filter(
      (row) => row.ticker.toLowerCase().includes(query) || row.company.toLowerCase().includes(query)
    );
  });

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
  protected readonly fleetUtilizationComparisonBrushes = ['#ef3f81', '#48bc5e'];
  protected readonly fleetCostChartBrushes = ['#4c8be7', '#ef3f81', '#48bc5e', '#e2b04f'];
  protected readonly fleetChartLabelColor = '#aeb7c8';
  protected readonly fleetChartGridlineColor = 'rgba(255, 255, 255, 0.18)';

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

  protected readonly fleetVehicles: FleetVehicle[] = [
    {
      id: 'A00101',
      licensePlate: 'KVG 8850',
      make: 'Ford',
      model: 'Focus',
      type: 'Hatchback',
      vin: '1FADP3F24HL312717',
      status: 'Active',
      locationCity: 'New York, NY',
      locationGps: '40.743828, -74.037982',
      specs: {
        engine: '1.5 TSI',
        generation: 'Focus Mk4',
        year: 2020,
        fuelType: 'Gasoline',
        power: '150 Hp',
        mileage: '28,140 mi',
        doorsSeats: '5 / 5',
        cubature: '1498 cm3',
        color: 'Blue',
        transmission: 'Automatic',
        msrp: '$24,700',
        tollPassId: 'EZ-193482'
      }
    },
    {
      id: 'A00102',
      licensePlate: '5VLZ 91',
      make: 'Ford',
      model: 'Focus',
      type: 'Hatchback',
      vin: 'WF0KXXGCKCY565571',
      status: 'Active',
      locationCity: 'Boston, MA',
      locationGps: '42.352104, -71.075238',
      specs: {
        engine: '1.0 EcoBoost',
        generation: 'Focus Mk3',
        year: 2019,
        fuelType: 'Gasoline',
        power: '125 Hp',
        mileage: '32,905 mi',
        doorsSeats: '5 / 5',
        cubature: '999 cm3',
        color: 'Silver',
        transmission: 'Manual',
        msrp: '$20,900',
        tollPassId: 'EZ-402112'
      }
    },
    {
      id: 'A00103',
      licensePlate: 'C10 EFF',
      make: 'VW',
      model: 'Passat',
      type: 'Station Wagon',
      vin: '1VWZYZ33DER623111',
      status: 'Available',
      locationCity: 'Camden, NJ',
      locationGps: '39.926602, -75.105908',
      specs: {
        engine: '1.6 GDI',
        generation: 'Passat B8',
        year: 2021,
        fuelType: 'Gasoline',
        power: '128 Hp',
        mileage: '18,200 mi',
        doorsSeats: '4 / 5',
        cubature: '1591 cm3',
        color: 'White',
        transmission: 'Automatic',
        msrp: '$21,900',
        tollPassId: 'EZ-000000'
      }
    },
    {
      id: 'A00104',
      licensePlate: 'KUM 0269',
      make: 'VW',
      model: 'Passat',
      type: 'Station Wagon',
      vin: '1VWZYZ33ZWE623426',
      status: 'Active',
      locationCity: 'Philadelphia, PA',
      locationGps: '39.992220, -75.141041',
      specs: {
        engine: '2.0 TDI',
        generation: 'Passat B8',
        year: 2019,
        fuelType: 'Diesel',
        power: '150 Hp',
        mileage: '35,900 mi',
        doorsSeats: '4 / 5',
        cubature: '1968 cm3',
        color: 'Black',
        transmission: 'Automatic',
        msrp: '$23,500',
        tollPassId: 'EZ-733492'
      }
    },
    {
      id: 'A00105',
      licensePlate: 'C10 UAA',
      make: 'VW',
      model: 'Golf',
      type: 'Hatchback',
      vin: 'WVWZZZ3BZWE689725',
      status: 'Active',
      locationCity: 'Camden, NJ',
      locationGps: '39.935249, -75.101969',
      specs: {
        engine: '1.4 TSI',
        generation: 'Golf Mk7',
        year: 2018,
        fuelType: 'Gasoline',
        power: '122 Hp',
        mileage: '40,120 mi',
        doorsSeats: '5 / 5',
        cubature: '1395 cm3',
        color: 'Gray',
        transmission: 'Manual',
        msrp: '$19,800',
        tollPassId: 'EZ-118843'
      }
    },
    {
      id: 'A00106',
      licensePlate: 'C34 VBU',
      make: 'Kia',
      model: 'Ceed',
      type: 'Hatchback',
      vin: 'U5YFF23429L032112',
      status: 'Available',
      locationCity: 'Camden, NJ',
      locationGps: '39.920728, -75.113277',
      specs: {
        engine: '1.4 MPI',
        generation: 'Ceed CD',
        year: 2020,
        fuelType: 'Gasoline',
        power: '100 Hp',
        mileage: '21,860 mi',
        doorsSeats: '5 / 5',
        cubature: '1368 cm3',
        color: 'Red',
        transmission: 'Manual',
        msrp: '$18,700',
        tollPassId: 'EZ-290315'
      }
    },
    {
      id: 'A00107',
      licensePlate: 'MA MN4567',
      make: 'Honda',
      model: 'Civic',
      type: 'Sedan',
      vin: '19XFC2F59HEE67890',
      status: 'In Maintenance',
      locationCity: 'Cranbury, NJ',
      locationGps: '40.306846, -74.508342',
      specs: {
        engine: '2.0 i-VTEC',
        generation: 'Civic X',
        year: 2018,
        fuelType: 'Gasoline',
        power: '158 Hp',
        mileage: '51,100 mi',
        doorsSeats: '4 / 5',
        cubature: '1996 cm3',
        color: 'White',
        transmission: 'CVT',
        msrp: '$22,400',
        tollPassId: 'EZ-512009'
      }
    },
    {
      id: 'A00108',
      licensePlate: 'NY LK1234',
      make: 'Toyota',
      model: 'Corolla',
      type: 'Sedan',
      vin: 'JTDBR32E330C87654',
      status: 'In Maintenance',
      locationCity: 'Cranbury, NJ',
      locationGps: '40.306846, -74.508342',
      specs: {
        engine: '1.8 Hybrid',
        generation: 'Corolla E210',
        year: 2021,
        fuelType: 'Hybrid',
        power: '121 Hp',
        mileage: '26,470 mi',
        doorsSeats: '4 / 5',
        cubature: '1798 cm3',
        color: 'Pearl White',
        transmission: 'e-CVT',
        msrp: '$23,100',
        tollPassId: 'EZ-476237'
      }
    },
    {
      id: 'A00109',
      licensePlate: 'NJ RQ2714',
      make: 'Hyundai',
      model: 'Elantra',
      type: 'Sedan',
      vin: 'KMHD84LF8LU123409',
      status: 'Active',
      locationCity: 'Jersey City, NJ',
      locationGps: '40.728157, -74.077642',
      specs: {
        engine: '2.0 MPI',
        generation: 'Elantra CN7',
        year: 2022,
        fuelType: 'Gasoline',
        power: '147 Hp',
        mileage: '17,430 mi',
        doorsSeats: '4 / 5',
        cubature: '1999 cm3',
        color: 'Graphite',
        transmission: 'CVT',
        msrp: '$22,900',
        tollPassId: 'EZ-384225'
      }
    },
    {
      id: 'A00110',
      licensePlate: 'PA XH8802',
      make: 'Subaru',
      model: 'Outback',
      type: 'SUV',
      vin: '4S4BTANC6M3177410',
      status: 'Available',
      locationCity: 'Allentown, PA',
      locationGps: '40.608430, -75.490183',
      specs: {
        engine: '2.5 Boxer',
        generation: 'Outback BT',
        year: 2021,
        fuelType: 'Gasoline',
        power: '182 Hp',
        mileage: '24,680 mi',
        doorsSeats: '5 / 5',
        cubature: '2498 cm3',
        color: 'Autumn Green',
        transmission: 'CVT',
        msrp: '$31,600',
        tollPassId: 'EZ-621450'
      }
    },
    {
      id: 'A00111',
      licensePlate: 'CT MM5021',
      make: 'Mazda',
      model: 'CX-5',
      type: 'SUV',
      vin: 'JM3KFACM8N0145211',
      status: 'Active',
      locationCity: 'New Haven, CT',
      locationGps: '41.305561, -72.927067',
      specs: {
        engine: '2.5 Skyactiv-G',
        generation: 'CX-5 KF',
        year: 2022,
        fuelType: 'Gasoline',
        power: '187 Hp',
        mileage: '13,560 mi',
        doorsSeats: '5 / 5',
        cubature: '2488 cm3',
        color: 'Machine Gray',
        transmission: 'Automatic',
        msrp: '$30,200',
        tollPassId: 'EZ-245903'
      }
    },
    {
      id: 'A00112',
      licensePlate: 'DE KR9940',
      make: 'Chevrolet',
      model: 'Malibu',
      type: 'Sedan',
      vin: '1G1ZD5ST6MF204512',
      status: 'In Maintenance',
      locationCity: 'Wilmington, DE',
      locationGps: '39.744655, -75.548390',
      specs: {
        engine: '1.5 Turbo',
        generation: 'Malibu IX',
        year: 2020,
        fuelType: 'Gasoline',
        power: '160 Hp',
        mileage: '43,910 mi',
        doorsSeats: '4 / 5',
        cubature: '1490 cm3',
        color: 'Summit White',
        transmission: 'CVT',
        msrp: '$24,400',
        tollPassId: 'EZ-777213'
      }
    },
    {
      id: 'A00113',
      licensePlate: 'NJ ZT4408',
      make: 'Nissan',
      model: 'Altima',
      type: 'Sedan',
      vin: '1N4BL4DV9NN309113',
      status: 'Active',
      locationCity: 'Newark, NJ',
      locationGps: '40.735657, -74.172367',
      specs: {
        engine: '2.5 DOHC',
        generation: 'Altima L34',
        year: 2022,
        fuelType: 'Gasoline',
        power: '188 Hp',
        mileage: '15,880 mi',
        doorsSeats: '4 / 5',
        cubature: '2488 cm3',
        color: 'Gun Metallic',
        transmission: 'CVT',
        msrp: '$25,950',
        tollPassId: 'EZ-558194'
      }
    },
    {
      id: 'A00114',
      licensePlate: 'NY PU6172',
      make: 'Kia',
      model: 'Sportage',
      type: 'SUV',
      vin: 'KNDPU3AF2P7014114',
      status: 'Available',
      locationCity: 'Yonkers, NY',
      locationGps: '40.931210, -73.898747',
      specs: {
        engine: '2.5 GDI',
        generation: 'Sportage NQ5',
        year: 2023,
        fuelType: 'Gasoline',
        power: '187 Hp',
        mileage: '9,420 mi',
        doorsSeats: '5 / 5',
        cubature: '2497 cm3',
        color: 'Sapphire Blue',
        transmission: 'Automatic',
        msrp: '$29,300',
        tollPassId: 'EZ-163590'
      }
    },
    {
      id: 'A00115',
      licensePlate: 'PA JT2855',
      make: 'Honda',
      model: 'CR-V',
      type: 'SUV',
      vin: '2HKRS4H76PH631115',
      status: 'Active',
      locationCity: 'King of Prussia, PA',
      locationGps: '40.089340, -75.385140',
      specs: {
        engine: '1.5 Turbo',
        generation: 'CR-V VI',
        year: 2023,
        fuelType: 'Gasoline',
        power: '190 Hp',
        mileage: '11,070 mi',
        doorsSeats: '5 / 5',
        cubature: '1498 cm3',
        color: 'Urban Gray',
        transmission: 'CVT',
        msrp: '$33,100',
        tollPassId: 'EZ-449081'
      }
    },
    {
      id: 'A00116',
      licensePlate: 'MA CF7201',
      make: 'Toyota',
      model: 'RAV4',
      type: 'SUV',
      vin: '2T3P1RFV1NW181116',
      status: 'In Maintenance',
      locationCity: 'Cambridge, MA',
      locationGps: '42.366978, -71.105615',
      specs: {
        engine: '2.5 Dynamic Force',
        generation: 'RAV4 XA50',
        year: 2021,
        fuelType: 'Gasoline',
        power: '203 Hp',
        mileage: '29,540 mi',
        doorsSeats: '5 / 5',
        cubature: '2487 cm3',
        color: 'Lunar Rock',
        transmission: 'Automatic',
        msrp: '$31,850',
        tollPassId: 'EZ-903374'
      }
    },
    {
      id: 'A00117',
      licensePlate: 'NJ HB9916',
      make: 'Ford',
      model: 'Escape',
      type: 'SUV',
      vin: '1FMCU9H65NUA89117',
      status: 'Active',
      locationCity: 'Princeton, NJ',
      locationGps: '40.357298, -74.667221',
      specs: {
        engine: '1.5 EcoBoost',
        generation: 'Escape IV',
        year: 2022,
        fuelType: 'Gasoline',
        power: '181 Hp',
        mileage: '16,905 mi',
        doorsSeats: '5 / 5',
        cubature: '1498 cm3',
        color: 'Carbonized Gray',
        transmission: 'Automatic',
        msrp: '$28,700',
        tollPassId: 'EZ-528606'
      }
    },
    {
      id: 'A00118',
      licensePlate: 'RI DS4307',
      make: 'Volkswagen',
      model: 'Tiguan',
      type: 'SUV',
      vin: '3VV2B7AX4NM091118',
      status: 'Available',
      locationCity: 'Providence, RI',
      locationGps: '41.824577, -71.412118',
      specs: {
        engine: '2.0 TSI',
        generation: 'Tiguan AD1',
        year: 2022,
        fuelType: 'Gasoline',
        power: '184 Hp',
        mileage: '14,250 mi',
        doorsSeats: '5 / 7',
        cubature: '1984 cm3',
        color: 'Atlantic Blue',
        transmission: 'Automatic',
        msrp: '$30,900',
        tollPassId: 'EZ-640125'
      }
    },
    {
      id: 'A00119',
      licensePlate: 'PA LL2033',
      make: 'Jeep',
      model: 'Cherokee',
      type: 'SUV',
      vin: '1C4PJMBX2ND601119',
      status: 'Active',
      locationCity: 'Lancaster, PA',
      locationGps: '40.037876, -76.305514',
      specs: {
        engine: '3.2 Pentastar',
        generation: 'Cherokee KL',
        year: 2021,
        fuelType: 'Gasoline',
        power: '271 Hp',
        mileage: '22,180 mi',
        doorsSeats: '5 / 5',
        cubature: '3239 cm3',
        color: 'Granite Crystal',
        transmission: 'Automatic',
        msrp: '$34,750',
        tollPassId: 'EZ-710244'
      }
    },
    {
      id: 'A00120',
      licensePlate: 'NY FN8150',
      make: 'Chevrolet',
      model: 'Equinox',
      type: 'SUV',
      vin: '3GNAXKEV4NL271120',
      status: 'In Maintenance',
      locationCity: 'Albany, NY',
      locationGps: '42.652580, -73.756233',
      specs: {
        engine: '1.5 Turbo',
        generation: 'Equinox III',
        year: 2022,
        fuelType: 'Gasoline',
        power: '175 Hp',
        mileage: '20,640 mi',
        doorsSeats: '5 / 5',
        cubature: '1490 cm3',
        color: 'Mosaic Black',
        transmission: 'Automatic',
        msrp: '$28,150',
        tollPassId: 'EZ-862337'
      }
    },
    {
      id: 'A00121',
      licensePlate: 'NJ QC3302',
      make: 'Hyundai',
      model: 'Tucson',
      type: 'SUV',
      vin: '5NMJB3AE4PH331121',
      status: 'Active',
      locationCity: 'Edison, NJ',
      locationGps: '40.518715, -74.412095',
      specs: {
        engine: '2.5 Smartstream',
        generation: 'Tucson NX4',
        year: 2023,
        fuelType: 'Gasoline',
        power: '187 Hp',
        mileage: '8,960 mi',
        doorsSeats: '5 / 5',
        cubature: '2497 cm3',
        color: 'Amazon Gray',
        transmission: 'Automatic',
        msrp: '$29,980',
        tollPassId: 'EZ-332144'
      }
    },
    {
      id: 'A00122',
      licensePlate: 'CT YA1948',
      make: 'Nissan',
      model: 'Rogue',
      type: 'SUV',
      vin: 'JN8BT3BB5PW431122',
      status: 'Available',
      locationCity: 'Stamford, CT',
      locationGps: '41.053430, -73.538734',
      specs: {
        engine: '1.5 VC-Turbo',
        generation: 'Rogue T33',
        year: 2023,
        fuelType: 'Gasoline',
        power: '201 Hp',
        mileage: '7,850 mi',
        doorsSeats: '5 / 5',
        cubature: '1497 cm3',
        color: 'Caspian Blue',
        transmission: 'CVT',
        msrp: '$31,400',
        tollPassId: 'EZ-571890'
      }
    },
    {
      id: 'A00123',
      licensePlate: 'MA GX6243',
      make: 'Ford',
      model: 'Transit Connect',
      type: 'Van',
      vin: 'NM0LS7E21N1561123',
      status: 'Active',
      locationCity: 'Worcester, MA',
      locationGps: '42.262593, -71.802293',
      specs: {
        engine: '2.0 GDI',
        generation: 'Transit Connect II',
        year: 2022,
        fuelType: 'Gasoline',
        power: '162 Hp',
        mileage: '19,770 mi',
        doorsSeats: '4 / 2',
        cubature: '1999 cm3',
        color: 'Frozen White',
        transmission: 'Automatic',
        msrp: '$31,250',
        tollPassId: 'EZ-150763'
      }
    },
    {
      id: 'A00124',
      licensePlate: 'PA WR5118',
      make: 'Ram',
      model: 'ProMaster City',
      type: 'Van',
      vin: 'ZFBHRFAB7N6T31124',
      status: 'In Maintenance',
      locationCity: 'Reading, PA',
      locationGps: '40.335648, -75.926875',
      specs: {
        engine: '2.4 Tigershark',
        generation: 'ProMaster City VM',
        year: 2021,
        fuelType: 'Gasoline',
        power: '178 Hp',
        mileage: '33,420 mi',
        doorsSeats: '4 / 2',
        cubature: '2360 cm3',
        color: 'Bright White',
        transmission: 'Automatic',
        msrp: '$29,700',
        tollPassId: 'EZ-938522'
      }
    }
  ];

  private readonly viewportWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1280);

  @HostListener('window:resize')
  onResize(): void {
    this.viewportWidth.set(window.innerWidth);
  }

  protected readonly hideNarrowColumns = computed(() => this.viewportWidth() < 1200);
  protected readonly hideExtraColumns = computed(() => this.viewportWidth() < 900);
  protected readonly hideMostColumns = computed(() => this.viewportWidth() < 700);

  protected readonly fleetStatusFilter = signal<FleetStatusFilter>('all');
  protected readonly fleetSearchQuery = signal('');
  protected readonly filteredFleetVehicles = computed(() => {
    const query = this.fleetSearchQuery().trim().toLowerCase();
    const status = this.fleetStatusFilter();

    return this.fleetVehicles.filter((vehicle) => {
      if (status !== 'all' && vehicle.status !== status) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchTarget = [
        vehicle.id,
        vehicle.licensePlate,
        vehicle.vin,
        vehicle.make,
        vehicle.model,
        vehicle.locationCity
      ]
        .join(' ')
        .toLowerCase();

      return searchTarget.includes(query);
    });
  });

  protected readonly fleetMetrics = computed<FleetMetric[]>(() => {
    const active = this.fleetVehicles.filter((vehicle) => vehicle.status === 'Active').length;
    const available = this.fleetVehicles.filter((vehicle) => vehicle.status === 'Available').length;
    const maintenance = this.fleetVehicles.filter((vehicle) => vehicle.status === 'In Maintenance').length;

    return [
      { label: 'All vehicles', value: this.fleetVehicles.length },
      { label: 'Active', value: active },
      { label: 'Available', value: available },
      { label: 'In Maintenance', value: maintenance }
    ];
  });

  protected readonly employees: EmployeeRecord[] = [
    { avatarUrl: 'https://i.pravatar.cc/48?img=5', firstName: 'Grace', lastName: 'Moore', satisfactionRating: 4, employmentType: 'Contract', emailAddress: 'grace.moore@example.com', department: 'Finance', registeredOn: 'Aug 19, 2025, 11:58:46 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=11', firstName: 'Charlie', lastName: 'Jones', satisfactionRating: 3, employmentType: 'Part-Time', emailAddress: 'charlie.jones@example.com', department: 'Finance', registeredOn: 'Apr 3, 2026, 7:13:25 AM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=13', firstName: 'Peter', lastName: 'Jones', satisfactionRating: 4, employmentType: 'Part-Time', emailAddress: 'peter.jones@example.com', department: 'Finance', registeredOn: 'Nov 5, 2025, 2:49:26 AM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=17', firstName: 'Charlie', lastName: 'Thomas', satisfactionRating: 1, employmentType: 'Part-Time', emailAddress: 'charlie.thomas@example.com', department: 'Finance', registeredOn: 'Oct 26, 2025, 10:59:10 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=20', firstName: 'Grace', lastName: 'Williams', satisfactionRating: 4, employmentType: 'Part-Time', emailAddress: 'grace.williams@example.com', department: 'Engineering', registeredOn: 'Nov 17, 2025, 7:39:09 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=28', firstName: 'Henry', lastName: 'Johnson', satisfactionRating: 3, employmentType: 'Contract', emailAddress: 'henry.johnson@example.com', department: 'Finance', registeredOn: 'Nov 11, 2025, 7:23:03 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=32', firstName: 'Eve', lastName: 'Taylor', satisfactionRating: 3, employmentType: 'Contract', emailAddress: 'eve.taylor@example.com', department: 'Sales', registeredOn: 'Apr 12, 2026, 11:09:11 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=36', firstName: 'Jane', lastName: 'Davis', satisfactionRating: 5, employmentType: 'Full-Time', emailAddress: 'jane.davis@example.com', department: 'Marketing', registeredOn: 'Sep 21, 2025, 11:13:08 AM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=42', firstName: 'Kate', lastName: 'Jackson', satisfactionRating: 4, employmentType: 'Full-Time', emailAddress: 'kate.jackson@example.com', department: 'Engineering', registeredOn: 'Dec 19, 2025, 11:53:02 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=51', firstName: 'Jack', lastName: 'Johnson', satisfactionRating: 4, employmentType: 'Contract', emailAddress: 'jack.johnson@example.com', department: 'Finance', registeredOn: 'Sep 5, 2025, 5:39:57 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=56', firstName: 'Noah', lastName: 'Harris', satisfactionRating: 3, employmentType: 'Contract', emailAddress: 'noah.harris@example.com', department: 'Finance', registeredOn: 'Aug 30, 2025, 10:30:10 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=62', firstName: 'Alice', lastName: 'Garcia', satisfactionRating: 3, employmentType: 'Contract', emailAddress: 'alice.garcia@example.com', department: 'Engineering', registeredOn: 'Aug 1, 2025, 8:31:53 PM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=69', firstName: 'Rachel', lastName: 'Miller', satisfactionRating: 4, employmentType: 'Full-Time', emailAddress: 'rachel.miller@example.com', department: 'Marketing', registeredOn: 'Oct 14, 2025, 6:37:08 AM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=72', firstName: 'John', lastName: 'Brown', satisfactionRating: 5, employmentType: 'Full-Time', emailAddress: 'john.brown@example.com', department: 'Finance', registeredOn: 'Nov 19, 2025, 1:07:22 AM' },
    { avatarUrl: 'https://i.pravatar.cc/48?img=77', firstName: 'Diana', lastName: 'Moore', satisfactionRating: 4, employmentType: 'Full-Time', emailAddress: 'diana.moore@example.com', department: 'Engineering', registeredOn: 'Jul 18, 2026, 4:04:31 AM' }
  ];

  protected readonly employeeAvatarCellTemplate = (context: IgcCellContext<EmployeeRecord>): TemplateResult => {
    const employee = context.row.data;
    if (!employee) {
      return html``;
    }

    const initials = this.employeeInitials(employee);
    const background = this.employeeAvatarColor(employee);

    return html`
      <div style="display:flex; align-items:center; justify-content:center;">
        <igc-avatar
          class="employee-directory-avatar"
          shape="circle"
          initials="${initials}"
          aria-label="${employee.firstName} ${employee.lastName}"
          style="--ig-avatar-size:32px; --ig-avatar-background:${background}; --ig-avatar-color:#ffffff;"
        ></igc-avatar>
      </div>
    `;
  };

  protected readonly employeeRegisteredOnCellTemplate = (context: IgcCellContext<EmployeeRecord>): TemplateResult => {
    const employee = context.row.data;
    if (!employee) {
      return html``;
    }

    return html`
      <span style="display:block; white-space:normal; line-height:1.25; overflow-wrap:break-word;">
        ${employee.registeredOn}
      </span>
    `;
  };

  protected readonly employeeRatingCellTemplate = (context: IgcCellContext<EmployeeRecord>): TemplateResult => {
    const employee = context.row.data;
    if (!employee) {
      return html``;
    }

    return html`
      <igc-rating
        readonly
        .value=${employee.satisfactionRating}
        .max=${5}
        style="--symbol-full-color:#f0a12c; --symbol-empty-color:#c0c8d3;"
      ></igc-rating>
    `;
  };

  protected readonly employeeEmploymentCellTemplate = (context: IgcCellContext<EmployeeRecord>): TemplateResult => {
    const employee = context.row.data;
    if (!employee) {
      return html``;
    }

    const type = employee.employmentType;
    return html`<span style="${this.employeeEmploymentPillStyle(type)}">${type}</span>`;
  };

  protected readonly employeeDepartmentCellTemplate = (context: IgcCellContext<EmployeeRecord>): TemplateResult => {
    const employee = context.row.data;
    if (!employee) {
      return html``;
    }

    const department = employee.department;
    return html`<span style="${this.employeeDepartmentPillStyle(department)}">${department}</span>`;
  };

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

  protected fleetStatusClass(status: FleetVehicle['status']): string {
    if (status === 'Active') {
      return 'status-active';
    }

    if (status === 'Available') {
      return 'status-available';
    }

    return 'status-maintenance';
  }

  protected isFleetFilterActive(filter: FleetStatusFilter): boolean {
    return this.fleetStatusFilter() === filter;
  }

  protected setFleetFilter(filter: FleetStatusFilter): void {
    this.fleetStatusFilter.set(filter);
  }

  protected onFleetSearch(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.fleetSearchQuery.set(target.value);
  }

  protected onFinanceAssetSearch(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.financeAssetFilter.set(target.value);
  }

  protected fleetTripSummary(vehicle: FleetVehicle): { trips: number; totalDistance: string; avgTrip: string } {
    const seed = this.fleetSeed(vehicle);
    const trips = 18 + (seed % 8);
    const totalMiles = 248 + (seed % 9) * 16;
    const avgTrip = totalMiles / trips;

    return {
      trips,
      totalDistance: `${this.formatWholeNumber(totalMiles)} mi`,
      avgTrip: `${avgTrip.toFixed(1)} mi`
    };
  }

  protected fleetTripHistory(vehicle: FleetVehicle): FleetTripRow[] {
    const seed = this.fleetSeed(vehicle);
    const depot = `Depot - ${this.fleetCity(vehicle)}`;
    const client = `Client Site - ${this.fleetCity(vehicle)}`;
    const warehouse = `Warehouse - ${this.fleetCity(vehicle)}`;
    const regional = `Regional Office - ${this.fleetCity(vehicle)}`;
    const service = `Service Hub - ${this.fleetCity(vehicle)}`;
    const baseDistance = 8.4 + (seed % 5) * 1.3;
    const currentMileage = this.fleetMileageValue(vehicle);
    const tripDistances = [
      Number((baseDistance + 4.5).toFixed(1)),
      Number((baseDistance + 0.1).toFixed(1)),
      Number((baseDistance + 8.8).toFixed(1)),
      Number((baseDistance + 8.1).toFixed(1)),
      Number((baseDistance + 5.2).toFixed(1)),
      Number((baseDistance + 6.6).toFixed(1))
    ];

    let runningMeter = currentMileage + tripDistances.reduce((sum, value) => sum + value, 0);
    const buildMeters = (distance: number): { startMeter: string; endMeter: string } => {
      const endMeterValue = runningMeter;
      const startMeterValue = Math.max(0, endMeterValue - distance);
      runningMeter = startMeterValue;

      return {
        startMeter: `${this.formatOneDecimal(startMeterValue)} mi`,
        endMeter: `${this.formatOneDecimal(endMeterValue)} mi`
      };
    };

    return [
      { date: 'Jul 22', from: depot, to: client, ...buildMeters(tripDistances[0]), distance: `${tripDistances[0].toFixed(1)} mi`, duration: `${24 + (seed % 9)} min`, driver: this.fleetDriverName(vehicle, 0) },
      { date: 'Jul 21', from: client, to: depot, ...buildMeters(tripDistances[1]), distance: `${tripDistances[1].toFixed(1)} mi`, duration: `${19 + (seed % 6)} min`, driver: this.fleetDriverName(vehicle, 0) },
      { date: 'Jul 19', from: depot, to: warehouse, ...buildMeters(tripDistances[2]), distance: `${tripDistances[2].toFixed(1)} mi`, duration: `${32 + (seed % 10)} min`, driver: this.fleetDriverName(vehicle, 1) },
      { date: 'Jul 17', from: warehouse, to: depot, ...buildMeters(tripDistances[3]), distance: `${tripDistances[3].toFixed(1)} mi`, duration: `${30 + (seed % 9)} min`, driver: this.fleetDriverName(vehicle, 1) },
      { date: 'Jul 15', from: depot, to: regional, ...buildMeters(tripDistances[4]), distance: `${tripDistances[4].toFixed(1)} mi`, duration: `${26 + (seed % 8)} min`, driver: this.fleetDriverName(vehicle, 2) },
      { date: 'Jul 13', from: regional, to: service, ...buildMeters(tripDistances[5]), distance: `${tripDistances[5].toFixed(1)} mi`, duration: `${28 + (seed % 7)} min`, driver: this.fleetDriverName(vehicle, 3) }
    ];
  }

  protected fleetMaintenanceNotice(vehicle: FleetVehicle): string {
    const seed = this.fleetSeed(vehicle);
    const services = ['Tire rotation & balance', 'Brake fluid inspection', 'Air filter replacement', 'Multi-point inspection'];
    const service = services[seed % services.length];
    const dueMileage = this.nextServiceMileage(vehicle);
    return `Next service due: ${service} · est. ${this.formatWholeNumber(dueMileage)} mi`;
  }

  protected fleetMaintenanceRows(vehicle: FleetVehicle): FleetMaintenanceRow[] {
    const mileage = this.fleetMileageValue(vehicle);
    const dueMileage = this.nextServiceMileage(vehicle);

    return [
      { date: 'Jun 28, 2026', service: 'Oil & filter change', odometer: `${this.formatWholeNumber(Math.max(0, mileage - 2700))} mi`, cost: '$85', status: 'Completed' },
      { date: 'Mar 14, 2026', service: 'Brake pad replacement (front)', odometer: `${this.formatWholeNumber(Math.max(0, mileage - 6050))} mi`, cost: '$340', status: 'Completed' },
      { date: 'Dec 02, 2025', service: 'Annual inspection', odometer: `${this.formatWholeNumber(Math.max(0, mileage - 11500))} mi`, cost: '$120', status: 'Completed' },
      { date: 'Aug 30, 2026', service: this.fleetMaintenanceNotice(vehicle).split(': ')[1].split(' · ')[0], odometer: `est. ${this.formatWholeNumber(dueMileage)} mi`, cost: '—', status: 'Scheduled' }
    ];
  }

  protected fleetMaintenanceStatusClass(status: FleetMaintenanceRow['status']): string {
    return status === 'Completed' ? 'fleet-detail-pill-success' : 'fleet-detail-pill-warn';
  }

  protected fleetCostItems(vehicle: FleetVehicle): FleetCostItem[] {
    const seed = this.fleetSeed(vehicle);
    const maintenanceBase = vehicle.status === 'In Maintenance' ? 520 : 280;

    return [
      { label: 'Fuel / charging', value: 360 + (seed % 5) * 26, tone: 'fuel' },
      { label: 'Maintenance', value: maintenanceBase + (seed % 4) * 25, tone: 'maintenance' },
      { label: 'Insurance', value: 180 + (seed % 3) * 30, tone: 'insurance' },
      { label: 'Tolls & fees', value: 54 + (seed % 6) * 7, tone: 'tolls' }
    ];
  }

  protected fleetCostDistribution(vehicle: FleetVehicle): FleetCostDistributionPoint[] {
    const items = this.fleetCostItems(vehicle);
    const total = items.reduce((sum, item) => sum + item.value, 0);

    return items.map((item) => ({
      label: item.label,
      displayLabel: `${Math.round((item.value / total) * 100)}%`,
      percentage: `${Math.round((item.value / total) * 100)}%`,
      value: item.value,
      tone: item.tone
    }));
  }

  protected fleetMonthlyOperatingSpend(vehicle: FleetVehicle): FleetMonthlySpendPoint[] {
    const seed = this.fleetSeed(vehicle);
    const seasonalBase = [118, 148, 208, 238, 218, 258, 278, 208, 188, 228, 208, 178];

    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
      const variability = ((seed + index * 7) % 5) * 10;
      const maintenanceAdjustment = vehicle.status === 'In Maintenance' && (index === 6 || index === 7) ? 22 : 0;
      const utilizationAdjustment = vehicle.status === 'Available' && index >= 8 ? -12 : 0;

      return {
        month,
        spend: seasonalBase[index] + variability + maintenanceAdjustment + utilizationAdjustment
      };
    });
  }

  protected fleetCostTotal(vehicle: FleetVehicle): string {
    const total = this.fleetCostItems(vehicle).reduce((sum, item) => sum + item.value, 0);
    return `$${this.formatWholeNumber(total)}`;
  }

  protected fleetCostPerMile(vehicle: FleetVehicle): string {
    const total = this.fleetCostItems(vehicle).reduce((sum, item) => sum + item.value, 0);
    const distance = 248 + (this.fleetSeed(vehicle) % 9) * 16;
    return `$${(total / distance).toFixed(2)}`;
  }

  protected fleetCostDelta(vehicle: FleetVehicle): number {
    const seed = this.fleetSeed(vehicle);
    return vehicle.status === 'In Maintenance' ? 6 + (seed % 3) : seed % 2 === 0 ? 4 : -3;
  }

  protected fleetCostWidth(value: number, vehicle: FleetVehicle): string {
    const total = this.fleetCostItems(vehicle).reduce((sum, item) => sum + item.value, 0);
    return `${(value / total) * 100}%`;
  }

  protected fleetCostToneClass(tone: FleetCostItem['tone']): string {
    return `fleet-cost-tone-${tone}`;
  }

  protected fleetUtilizationSummary(vehicle: FleetVehicle): { rate: string; activeHours: string; idleHours: string; trips: number } {
    const seed = this.fleetSeed(vehicle);
    const rateValue = Math.max(52, 76 - (vehicle.status === 'In Maintenance' ? 9 : 0) - (vehicle.status === 'Available' ? 4 : 0) + (seed % 5));
    const activeHours = 92 + (seed % 16) * 2;
    const idleHours = Math.max(18, 44 - (seed % 7) * 2 + (vehicle.status === 'Available' ? 8 : 0));

    return {
      rate: `${rateValue}%`,
      activeHours: `${activeHours}h`,
      idleHours: `${idleHours}h`,
      trips: 18 + (seed % 8)
    };
  }

  protected fleetUtilizationSeries(vehicle: FleetVehicle): FleetUtilizationComparisonPoint[] {
    const seed = this.fleetSeed(vehicle);
    const base2024 = 160 + (seed % 5) * 14;
    const uplift2025 = 18 + (seed % 4) * 9;

    return [
      { month: 'Jan', utilization2024: base2024, utilization2025: base2024 + 42 },
      { month: 'Feb', utilization2024: base2024 + 22, utilization2025: base2024 + 4 },
      { month: 'Mar', utilization2024: base2024 + 140, utilization2025: base2024 + 118 },
      { month: 'Apr', utilization2024: base2024 + 316, utilization2025: base2024 + 278 },
      { month: 'May', utilization2024: base2024 + 418, utilization2025: base2024 + 472 },
      { month: 'Jun', utilization2024: base2024 + 502, utilization2025: base2024 + 564 },
      { month: 'Jul', utilization2024: base2024 + 560, utilization2025: base2024 + 586 + (vehicle.status === 'In Maintenance' ? -24 : uplift2025) },
      { month: 'Aug', utilization2024: base2024 + 594, utilization2025: base2024 + 650 + (vehicle.status === 'Available' ? -22 : uplift2025) },
      { month: 'Sep', utilization2024: base2024 + 506, utilization2025: base2024 + 480 + (vehicle.status === 'Available' ? -38 : 0) },
      { month: 'Oct', utilization2024: base2024 + 442, utilization2025: base2024 + 646 },
      { month: 'Nov', utilization2024: base2024 + 154, utilization2025: base2024 + 354 },
      { month: 'Dec', utilization2024: base2024 + 52, utilization2025: base2024 + 198 }
    ];
  }

  protected fleetVehiclePhotoUrl(vehicle: FleetVehicle): string {
    const baseIndex = this.fleetSeed(vehicle) % this.fleetVehiclePhotoCatalog.length;
    return this.fleetVehiclePhotoCatalog[baseIndex];
  }

  protected onFleetVehicleImageError(event: Event, vehicle: FleetVehicle): void {
    const target = event.target;

    if (!(target instanceof HTMLImageElement)) {
      return;
    }

    const currentOffset = Number(target.dataset['fallbackIndex'] ?? '0');
    const nextOffset = currentOffset + 1;
    const maxRetries = this.fleetVehiclePhotoCatalog.length - 1;

    if (nextOffset > maxRetries) {
      return;
    }

    target.dataset['fallbackIndex'] = String(nextOffset);
    const baseIndex = this.fleetSeed(vehicle) % this.fleetVehiclePhotoCatalog.length;
    const nextIndex = (baseIndex + nextOffset) % this.fleetVehiclePhotoCatalog.length;
    target.src = this.fleetVehiclePhotoCatalog[nextIndex];
  }

  private fleetSeed(vehicle: FleetVehicle): number {
    return Number(vehicle.id.replace(/\D/g, '')) || 1;
  }

  private fleetCity(vehicle: FleetVehicle): string {
    return vehicle.locationCity.split(',')[0];
  }

  private fleetMileageValue(vehicle: FleetVehicle): number {
    return Number(vehicle.specs.mileage.replace(/[^\d]/g, '')) || 0;
  }

  private nextServiceMileage(vehicle: FleetVehicle): number {
    const mileage = this.fleetMileageValue(vehicle);
    return Math.ceil((mileage + 3200) / 5000) * 5000;
  }

  private fleetDriverName(vehicle: FleetVehicle, offset: number): string {
    const drivers = ['M. Alvarez', 'R. Chen', 'S. Patel', 'J. Walker', 'A. Brooks', 'T. Nguyen'];
    return drivers[(this.fleetSeed(vehicle) + offset) % drivers.length];
  }

  private formatWholeNumber(value: number): string {
    return Math.round(value).toLocaleString('en-US');
  }

  private formatOneDecimal(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  }

  protected employeeEmploymentPillStyle(type: EmployeeRecord['employmentType']): string {
    if (type === 'Full-Time') {
      return this.pillStyle('var(--pill-positive-bg)', 'var(--pill-positive-text)');
    }

    if (type === 'Part-Time') {
      return this.pillStyle('var(--pill-proposal-bg)', 'var(--pill-proposal-text)');
    }

    return this.pillStyle('var(--pill-negotiation-bg)', 'var(--pill-negotiation-text)');
  }

  protected employeeDepartmentPillStyle(department: EmployeeRecord['department']): string {
    if (department === 'Finance') {
      return this.pillStyle('var(--pill-positive-bg)', 'var(--pill-positive-text)');
    }

    if (department === 'Engineering') {
      return this.pillStyle('var(--pill-negotiation-bg)', 'var(--pill-negotiation-text)');
    }

    if (department === 'Marketing') {
      return this.pillStyle('var(--pill-proposal-bg)', 'var(--pill-proposal-text)');
    }

    return this.pillStyle('var(--pill-negative-bg)', 'var(--pill-negative-text)');
  }

  private pillStyle(background: string, color: string): string {
    return `display:inline-flex; align-items:center; border-radius:999px; padding:0.15rem 0.48rem; font-size:0.75rem; font-weight:600; background:${background}; color:${color};`;
  }

  private employeeAvatarColor(employee: EmployeeRecord): string {
    const palette = ['#4f6bed', '#2ab184', '#f0a12c', '#d84b98', '#5b6678', '#3f8cff'];
    const seed = `${employee.firstName}${employee.lastName}`;
    let hash = 0;

    for (const char of seed) {
      hash = (hash << 5) - hash + char.charCodeAt(0);
      hash |= 0;
    }

    return palette[Math.abs(hash) % palette.length];
  }

  private employeeInitials(employee: EmployeeRecord): string {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase();
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

  protected badgeType(value: number): string {
    if (value > 0) return 'success';
    if (value < 0) return 'error';
    return 'info';
  }

  protected badgeLabel(value: number): string {
    const arrow = value > 0 ? '↑ ' : value < 0 ? '↓ ' : '';
    return `${arrow}${this.formatPercent(value)}`;
  }

  protected formatHoldingPeriod(days: number): string {
    return `${days} days`;
  }

  protected financeAvatarInitials(ticker: string): string {
    const normalized = ticker.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    return normalized.slice(0, 3) || 'EQ';
  }

  protected financeAvatarColor(tone: FinanceTone): string {
    return this.toneColor(tone);
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

}
