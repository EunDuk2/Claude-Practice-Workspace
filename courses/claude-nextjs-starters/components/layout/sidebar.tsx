'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: '대시보드', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: '분석', href: '/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: '설정', href: '/settings', icon: <Settings className="h-5 w-5" /> },
  { label: '도움말', href: '/help', icon: <HelpCircle className="h-5 w-5" /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useLocalStorage('sidebar-open', true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      className={cn(
        'border-r bg-background transition-all duration-200',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {isOpen && <h2 className="font-bold">메뉴</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto"
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform', isOpen && 'rotate-180')} />
        </Button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? 'default' : 'ghost'}
              className={cn('w-full justify-start gap-3', !isOpen && 'px-2')}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}
