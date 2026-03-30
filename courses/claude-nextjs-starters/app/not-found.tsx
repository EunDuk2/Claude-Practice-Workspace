import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-3xl font-bold">페이지를 찾을 수 없습니다</h2>
        </div>

        <p className="text-muted-foreground text-lg">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        <Link href="/">
          <Button size="lg" className="gap-2">
            홈으로 돌아가기
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
