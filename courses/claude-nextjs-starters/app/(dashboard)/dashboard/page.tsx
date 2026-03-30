'use client'

import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounceValue } from 'usehooks-ts'

export default function DashboardPage() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebounceValue(searchInput, 500)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (debouncedSearch) {
      console.log('검색:', debouncedSearch)
    }
  }, [debouncedSearch])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      title: '전체 사용자',
      value: '12,543',
      change: '+12.5%',
      icon: Users,
    },
    {
      title: '매출',
      value: '$45,231.89',
      change: '+8.2%',
      icon: TrendingUp,
    },
    {
      title: '활성 세션',
      value: '2,431',
      change: '+23.1%',
      icon: Activity,
    },
    {
      title: '전환율',
      value: '3.24%',
      change: '+1.2%',
      icon: BarChart3,
    },
  ]

  return (
    <div className="container py-8 space-y-8">
      <PageHeader
        title="대시보드"
        description="핵심 메트릭과 통계를 한눈에 확인하세요."
      />

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <Badge variant="secondary" className="mt-2">
                      {stat.change}
                    </Badge>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 탭 섹션 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
          <TabsTrigger value="reports">보고서</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
              <CardDescription>지난 7일간의 활동 요약</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>사용자 가입 증가</span>
                    <Badge>+245</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>매출 성장</span>
                    <Badge variant="secondary">+$12,450</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded">
                    <span>활동 증가</span>
                    <Badge variant="outline">+54%</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>분석</CardTitle>
              <CardDescription>상세한 통계 데이터</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">분석 차트가 여기에 표시됩니다.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>보고서</CardTitle>
              <CardDescription>월간/분기별 보고서</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">보고서 다운로드 링크가 여기에 표시됩니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 검색 예시 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 (useDebounce 활용)</CardTitle>
          <CardDescription>입력 후 0.5초 후 자동으로 검색됩니다</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="검색어를 입력하세요..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <div className="mt-4 p-4 bg-muted rounded">
              <p className="text-sm text-muted-foreground">
                검색 결과: &quot;{debouncedSearch}&quot;
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
