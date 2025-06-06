'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function RedirectDefaultState() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const state = searchParams.get('state')
    if (!state && pathname === '/exhibitions') {
      router.replace('/exhibitions?state=current') // ✅ 替換網址但不重整
    }
  }, [searchParams, pathname, router])

  return null
}
