// components/OrderPageHeader.jsx
'use client'

import Image from 'next/image'
import { CiShoppingTag } from 'react-icons/ci'
import { PiBankDuotone, PiColumns, PiMaskHappy } from 'react-icons/pi'

export default function OrderPageHeader() {
  return (
    <div className="relative bg-[#f4f1ea] py-5 px-4 mb-4 rounded-lg border border-[#d4bba2] shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <CiShoppingTag className="text-[#7b2d12] text-2xl" />
        <h2 className="text-xl font-bold text-[#7b2d12]">我的訂單</h2>
      </div>

      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-6 text-[#7b2d12]">
          <div className="flex items-center gap-2">
            <PiColumns className="text-3xl" />
            <span>歷史紀錄</span>
          </div>
          <div className="flex items-center gap-2">
            <PiBankDuotone className="text-3xl" />
            <span>藝術支持</span>
          </div>
          <div className="flex items-center gap-2">
            <PiMaskHappy className="text-3xl" />
            <span>展覽回憶</span>
          </div>
        </div>

        <div className="hidden sm:block">
          <Image
            src="/images/museum-header-bg.svg"
            alt="博物館裝飾圖"
            width={140}
            height={140}
            className="opacity-70"
          />
        </div>
      </div>

      <p className="text-sm text-[#3c3a36] mt-3">
        感謝您支持藝術與文化！歡迎再次造訪我們的展覽 🏛️
      </p>
    </div>
  )
}
