'use client'

import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LineChart, BarChart3, PieChart } from 'lucide-react'

export default function AnalyticsPage() {
  const chartData = [
    { month: '1월', users: 400, revenue: 2400 },
    { month: '2월', users: 300, revenue: 1398 },
    { month: '3월', users: 200, revenue: 9800 },
    { month: '4월', users: 278, revenue: 3908 },
    { month: '5월', users: 189, revenue: 4800 },
    { month: '6월', users: 239, revenue: 3800 },
  ]

  const metrics = [
    { label: '일일 활성 사용자', value: '1,234', change: '+12%' },
    { label: '월간 수익', value: '$45,231', change: '+8.2%' },
    { label: '전환율', value: '3.24%', change: '+1.2%' },
    { label: '이탈율', value: '2.14%', change: '-0.5%' },
  ]

  return (
    <div className="container py-8 space-y-8">
      <PageHeader
        title="분석"
        description="사이트 방문자 및 성과 분석을 확인하세요."
      />

      {/* 분석 메트릭 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{metric.value}</div>
              <Badge variant="secondary">{metric.change}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 분석 탭 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="traffic">트래픽</TabsTrigger>
          <TabsTrigger value="conversion">전환</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>월별 사용자 및 수익</CardTitle>
              <CardDescription>지난 6개월간의 트렌드</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground h-64">
                <LineChart className="w-8 h-8" />
                <p>차트 데이터: {JSON.stringify(chartData[0])}</p>
              </div>
              <div className="space-y-2 text-sm">
                {chartData.map((data) => (
                  <div key={data.month} className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>{data.month}</span>
                    <span className="font-semibold">{data.users} 사용자 / ${data.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>트래픽 분석</CardTitle>
              <CardDescription>사용자 트래픽 소스 분석</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground h-48">
                <BarChart3 className="w-8 h-8" />
                <p>트래픽 소스: 유기검색(45%), 직접(30%), 소셜(15%), 기타(10%)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>전환 분석</CardTitle>
              <CardDescription>사용자 행동 및 전환 추적</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground h-48">
                <PieChart className="w-8 h-8" />
                <p>전환 단계: 방문(100%) → 가입(45%) → 구매(12%)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
