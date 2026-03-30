import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container max-w-4xl mx-auto py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 브랜드 */}
          <div>
            <h3 className="font-bold text-lg mb-4">스타터킷</h3>
            <p className="text-sm text-muted-foreground">
              Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui로 만든 모던 웹 스타터킷입니다.
            </p>
          </div>

          {/* 제품 */}
          <div>
            <h4 className="font-semibold mb-4">제품</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  기능
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  가격
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  보안
                </Link>
              </li>
            </ul>
          </div>

          {/* 커뮤니티 */}
          <div>
            <h4 className="font-semibold mb-4">커뮤니티</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  블로그
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  문서
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          {/* 법률 */}
          <div>
            <h4 className="font-semibold mb-4">법률</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  개인정보보호정책
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  쿠키
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} 스타터킷. 모든 권리 보유.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              X (Twitter)
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              GitHub
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
