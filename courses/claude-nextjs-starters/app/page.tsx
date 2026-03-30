'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, ArrowRight, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'
import { useState } from 'react'

export default function Home() {
  const [, copyToClipboard] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  const techStack = [
    'Next.js 16',
    'React 19',
    'TypeScript',
    'Tailwind CSS v4',
    'shadcn/ui',
    'Lucide React',
  ]

  const codeExample = `npm create next-app@latest my-app -- \\
  --typescript \\
  --tailwind \\
  --eslint`

  const handleCopy = () => {
    copyToClipboard(codeExample)
    setCopied(true)
    toast.success('클립보드에 복사되었습니다!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container space-y-12 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-6 pt-12 pb-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            모던 웹 개발을
            <br />
            <span className="text-primary">빠르게 시작하세요</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Next.js 16, TypeScript, Tailwind CSS, shadcn/ui로 구성된 프로덕션 레디 스타터킷.
            복잡한 설정 없이 즉시 개발을 시작할 수 있습니다.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              데모 보기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            문서 보기
          </Button>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Components Showcase */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">컴포넌트 쇼케이스</h2>

        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="buttons">버튼</TabsTrigger>
            <TabsTrigger value="cards">카드</TabsTrigger>
            <TabsTrigger value="alerts">알림</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>다양한 버튼 스타일</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>기본</Button>
                  <Button variant="secondary">보조</Button>
                  <Button variant="outline">아웃라인</Button>
                  <Button variant="ghost">고스트</Button>
                  <Button variant="destructive">위험</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>카드 제목</CardTitle>
                  <CardDescription>카드 설명</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>카드 콘텐츠가 여기에 들어갑니다.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>또 다른 카드</CardTitle>
                  <CardDescription>shadcn/ui 카드 컴포넌트</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>깔끔하고 세련된 디자인의 카드입니다.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>주목</AlertTitle>
              <AlertDescription>shadcn/ui의 Alert 컴포넌트입니다.</AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </section>

      {/* Getting Started */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">시작하기</h2>
        <Card>
          <CardHeader>
            <CardTitle>설치 명령어</CardTitle>
            <CardDescription>프로젝트를 시작하는 방법</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <pre className="text-sm overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    복사
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Toast Demo */}
      <section className="space-y-6 pb-12">
        <h2 className="text-2xl font-bold">알림 테스트</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => toast.success('성공 메시지입니다!')}
            variant="outline"
          >
            성공 토스트
          </Button>
          <Button
            onClick={() => toast.error('에러 메시지입니다!')}
            variant="outline"
          >
            에러 토스트
          </Button>
          <Button
            onClick={() => toast.info('정보 메시지입니다!')}
            variant="outline"
          >
            정보 토스트
          </Button>
        </div>
      </section>
    </div>
  )
}
