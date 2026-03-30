'use client'

import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    siteName: 'My App',
    email: 'admin@example.com',
    timezone: 'Asia/Seoul',
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleToggle = (field: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="container py-8 space-y-8">
      <PageHeader
        title="설정"
        description="애플리케이션 설정 및 환경설정을 관리하세요."
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>

        {/* 일반 설정 */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>일반 설정</CardTitle>
              <CardDescription>애플리케이션의 기본 설정을 변경하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">사이트명</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="사이트명 입력"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">관리자 이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="이메일 입력"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">시간대</Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  placeholder="시간대 입력"
                />
              </div>

              <Button>저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 수신 방식을 설정하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 이메일 알림 */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>이메일 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    중요한 업데이트를 이메일로 받습니다.
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>

              <Separator />

              {/* 푸시 알림 */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>푸시 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    실시간 알림을 받습니다.
                  </p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={() => handleToggle('pushNotifications')}
                />
              </div>

              <Separator />

              {/* 주간 보고서 */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>주간 보고서</Label>
                  <p className="text-sm text-muted-foreground">
                    매주 일요일 요약 보고서를 받습니다.
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={() => handleToggle('weeklyReport')}
                />
              </div>

              <Button className="mt-4">저장</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription>계정 보안을 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>비밀번호</Label>
                    <p className="text-sm text-muted-foreground">
                      마지막 변경: 2024년 1월 15일
                    </p>
                  </div>
                  <Button variant="outline">변경</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>2단계 인증</Label>
                    <p className="text-sm text-muted-foreground">
                      추가 보안을 위해 활성화하세요.
                    </p>
                  </div>
                  <Button variant="outline">설정</Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>로그인 세션</Label>
                    <p className="text-sm text-muted-foreground">
                      활성 로그인 세션을 관리하세요.
                    </p>
                  </div>
                  <Button variant="outline">관리</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
