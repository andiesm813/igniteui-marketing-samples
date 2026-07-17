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
    IgxCardModule,
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
export class App implements OnInit {
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly navLinks = ['Overview', 'Pipeline', 'Reports', 'Team'];

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
    { company: 'Vantage Corp', stage: 'Closed Won', value: '$48,200', rep: 'Dana Voss', when: '2h ago', stageClass: 'stage-win' },
    { company: 'Northfield Retail', stage: 'Proposal Sent', value: '$22,000', rep: 'Priya Shah', when: '5h ago', stageClass: 'stage-proposal' },
    { company: 'Callisto Systems', stage: 'Negotiation', value: '$67,500', rep: 'Marcus Ibe', when: '1d ago', stageClass: 'stage-negotiation' },
    { company: 'Bright Path LLC', stage: 'Closed Won', value: '$15,300', rep: 'Tom Reyes', when: '1d ago', stageClass: 'stage-win' },
    { company: 'Ferro Industrial', stage: 'Qualified', value: '$91,000', rep: 'Elena Cruz', when: '2d ago', stageClass: 'stage-qualified' },
    { company: 'Atlas Foods', stage: 'Proposal Sent', value: '$38,400', rep: 'Leo Martin', when: '2d ago', stageClass: 'stage-proposal' },
    { company: 'Nimbus Health', stage: 'Negotiation', value: '$57,800', rep: 'Sofia Kim', when: '3d ago', stageClass: 'stage-negotiation' },
    { company: 'Summit Works', stage: 'Qualified', value: '$26,900', rep: 'Noah Bennett', when: '3d ago', stageClass: 'stage-qualified' },
    { company: 'Blue Harbor', stage: 'Closed Won', value: '$44,700', rep: 'Maya Patel', when: '4d ago', stageClass: 'stage-win' },
    { company: 'Orion Energy', stage: 'Proposal Sent', value: '$72,500', rep: 'Chris Nolan', when: '4d ago', stageClass: 'stage-proposal' },
    { company: 'Red Cedar Co', stage: 'Negotiation', value: '$33,600', rep: 'Dana Voss', when: '5d ago', stageClass: 'stage-negotiation' },
    { company: 'Apex Logistics', stage: 'Closed Won', value: '$58,100', rep: 'Marcus Ibe', when: '5d ago', stageClass: 'stage-win' },
    { company: 'North Ridge', stage: 'Qualified', value: '$19,400', rep: 'Priya Shah', when: '6d ago', stageClass: 'stage-qualified' },
    { company: 'Everfield Labs', stage: 'Proposal Sent', value: '$41,250', rep: 'Tom Reyes', when: '6d ago', stageClass: 'stage-proposal' },
    { company: 'Clearwater Tech', stage: 'Closed Won', value: '$63,900', rep: 'Elena Cruz', when: '1w ago', stageClass: 'stage-win' },
    { company: 'Harborline Media', stage: 'Negotiation', value: '$28,700', rep: 'Leo Martin', when: '1w ago', stageClass: 'stage-negotiation' },
    { company: 'Pioneer Metals', stage: 'Qualified', value: '$76,300', rep: 'Sofia Kim', when: '1w ago', stageClass: 'stage-qualified' }
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
}
