import { AdminPageHeader } from '../components/AdminPageHeader';
import { DashboardCharts } from '../components/DashboardCharts';
import { RecentActivity } from '../components/RecentActivity';
import { adminConfig } from '@/admin.config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/admin/Icon';
import { CountUp } from '@/components/ui/CountUp';
import Link from 'next/link';

export default async function AdminDashboard() {
  // Fetch all stats in parallel
  const statsWithCounts = await Promise.all(
    adminConfig.dashboardStats.map(async (stat) => ({
      ...stat,
      count: stat.getCount ? await stat.getCount() : null,
    }))
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Kontrol Paneli"
        description="Genel bakış ve istatistikler"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-tour="dashboard-cards">
        {statsWithCounts.map((stat, index) => (
          <Link key={stat.id} href={stat.href}>
            <Card hover className="h-full group relative overflow-hidden">
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${stat.color.includes('blue') ? '#3B82F6' : stat.color.includes('green') ? '#10B981' : stat.color.includes('purple') ? '#8B5CF6' : stat.color.includes('pink') ? '#EC4899' : '#6366F1'}, transparent)`,
                }}
              />
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-gray-950 transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                    {/* Pulse Animation */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    <Icon name={stat.icon as any} size={24} className="text-white relative z-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900 group-hover:text-black transition-colors">
                  {stat.count !== null ? (
                    <CountUp
                      end={stat.count}
                      duration={1.5}
                      className="inline-block"
                    />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Toplam {stat.title.toLowerCase()}</p>
              </CardContent>
              
              {/* Hover Arrow Indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                  <Icon name="chevronDown" size={16} className="text-white rotate-[-90deg]" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts 
          pagesCount={0}
          projectsCount={0}
          postsCount={0}
          leadsCount={0}
        />
        <RecentActivity 
          recentPages={[]}
          recentProjects={[]}
          recentPosts={[]}
          recentLeads={[]}
        />
      </div>
    </div>
  );
}

