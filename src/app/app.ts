import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IgxAvatarModule } from 'igniteui-angular/avatar';
import { IgxBadgeModule } from 'igniteui-angular/badge';
import { IgxButtonModule } from 'igniteui-angular/directives';
import { IgxGridModule } from 'igniteui-angular/grids/grid';
import { IgxIconModule } from 'igniteui-angular/icon';
import { IgxListModule } from 'igniteui-angular/list';
import { IgxNavbarModule } from 'igniteui-angular/navbar';
import {
  IgxCategoryChartModule,
  IgxDoughnutChartModule,
  IgxRingSeriesModule
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
  stage: string;
  value: string;
  rep: string;
  when: string;
  stageClass: string;
}

interface WeeklyDealPoint {
  day: string;
  deals: number;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IgxNavbarModule,
    IgxButtonModule,
    IgxIconModule,
    IgxBadgeModule,
    IgxCategoryChartModule,
    IgxDoughnutChartModule,
    IgxRingSeriesModule,
    IgxListModule,
    IgxAvatarModule,
    IgxGridModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly navLinks = ['Overview', 'Pipeline', 'Reports', 'Team'];

  protected readonly metrics: MetricCard[] = [
    { label: 'Revenue MTD', value: '$842.3K', delta: '12.4% vs target', positive: true, icon: 'attach_money', iconClass: 'icon-revenue' },
    { label: 'Quota Attainment', value: '94%', delta: '1.3 pts vs last month', positive: true, icon: 'percent', iconClass: 'icon-quota' },
    { label: 'Deals Closed (Mtd)', value: '37', delta: '6 vs last month', positive: true, icon: 'tag', iconClass: 'icon-deals' },
    { label: 'Avg Deal Size', value: '$22.8K', delta: '1.9% vs last month', positive: false, icon: 'diamond', iconClass: 'icon-avg' }
  ];

  protected readonly revenueTrend = [
    { month: 'Jan', revenue: 640, target: 650 },
    { month: 'Feb', revenue: 655, target: 662 },
    { month: 'Mar', revenue: 693, target: 685 },
    { month: 'Apr', revenue: 705, target: 706 },
    { month: 'May', revenue: 742, target: 726 },
    { month: 'Jun', revenue: 783, target: 760 }
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

  protected readonly revenueRegionBrushes = ['#5f86ad', '#5a8b7d', '#c79b45', '#cc7c62'];

  protected readonly leaderboard: LeaderboardItem[] = [
    { rank: 1, name: 'Dana Voss', quota: '128% of quota', amount: '$312,400', delta: '18%', positive: true },
    { rank: 2, name: 'Marcus Ibe', quota: '116% of quota', amount: '$284,900', delta: '8%', positive: true },
    { rank: 3, name: 'Priya Shah', quota: '104% of quota', amount: '$256,100', delta: '14%', positive: true },
    { rank: 4, name: 'Tom Reyes', quota: '98% of quota', amount: '$231,700', delta: '-2%', positive: false },
    { rank: 5, name: 'Elena Cruz', quota: '91% of quota', amount: '$198,300', delta: '-5%', positive: false }
  ];

  protected readonly activityRows: ActivityRow[] = [
    { company: 'Vantage Corp', stage: 'Closed Won', value: '$48,200', rep: 'Dana Voss', when: '2h ago', stageClass: 'stage-win' },
    { company: 'Northfield Retail', stage: 'Proposal Sent', value: '$22,000', rep: 'Priya Shah', when: '5h ago', stageClass: 'stage-proposal' },
    { company: 'Callisto Systems', stage: 'Negotiation', value: '$67,500', rep: 'Marcus Ibe', when: '1d ago', stageClass: 'stage-negotiation' },
    { company: 'Bright Path LLC', stage: 'Closed Won', value: '$15,300', rep: 'Tom Reyes', when: '1d ago', stageClass: 'stage-win' },
    { company: 'Ferro Industrial', stage: 'Qualified', value: '$91,000', rep: 'Elena Cruz', when: '2d ago', stageClass: 'stage-qualified' }
  ];
}
