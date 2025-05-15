'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../_styles/ex-page.module.scss'

export default function Tabs() {
  const pathname = usePathname()

  return (
    <ul className={`${styles.tabs} mt-5`}>
      <li>
        <Link
          href="/exhibitions"
          className={`${styles.tabItem} ${pathname === '/exhibitions' ? styles.active : ''}`}
        >
          當期展覽
        </Link>
      </li>
      <li>
        <Link
          href="/exhibitions/future"
          className={`${styles.tabItem} ${pathname === '/exhibitions/future' ? styles.active : ''}`}
        >
          展覽預告
        </Link>
      </li>
      <li>
        <Link
          href="/exhibitions/past"
          className={`${styles.tabItem} ${pathname === '/exhibitions/past' ? styles.active : ''}`}
        >
          展覽回顧
        </Link>
      </li>
    </ul>
  )
}
