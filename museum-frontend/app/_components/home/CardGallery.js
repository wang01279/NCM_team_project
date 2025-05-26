import { useRef } from 'react'
import styles from './_style/CardGallery.module.scss'

const cards = [
  {
    img: '/img/ceramics/1.jpeg',
    title: '青花紋',
    subtitle: '以鈷藍色於白胎上繪製，線條瀟灑、濃淡分明。',
  },
  {
    img: '/img/ceramics/2.jpeg',
    title: '粉彩／鬥彩',
    subtitle: '色彩柔和、層次豐富，康雍乾三朝鼎盛之作。',
  },
  {
    img: '/img/ceramics/3.jpeg',
    title: '唐草紋',
    subtitle: '藤蔓捲草盤旋不絕，象徵生命繁茂與永續。',
  },
  {
    img: '/img/ceramics/4.jpeg',
    title: '雷紋／回文紋',
    subtitle: '龍鳳呈祥，雍容華貴，皇室專用紋樣。',
  },
  {
    img: '/img/ceramics/5.jpeg',
    title: '龍鳳紋',
    subtitle: '方格回紋規整簡約，可用於邊框或分隔。',
  },
  {
    img: '/img/ceramics/6.jpeg',
    title: '魚鱗紋',
    subtitle: '菱形重疊如魚鱗，質感細膩，寓「年年有餘」。',
  },
  {
    img: '/img/ceramics/7.jpeg',
    title: '寶相華紋',
    subtitle: '蓮瓣八寶組合，肅穆而富麗，多見於佛教器皿。',
  },
  {
    img: '/img/ceramics/8.jpeg',
    title: '五彩紋',
    subtitle: '朱、黃、綠、藍多色並用，彰顯吉慶氛圍。',
  },
  {
    img: '/img/ceramics/9.jpeg',
    title: '掐絲珐瑯紋',
    subtitle: '銅絲勾勒紋樣，填入琺瑯色彩，線條明亮分明。',
  },
  {
    img: '/img/ceramics/10.jpeg',
    title: '山水故事紋',
    subtitle: '小器大景，山川人物一氣呵成，宛如行旅畫卷。',
  },
]

export default function CardGallery() {
  const scrollerRef = useRef(null)

  const scroll = (dir) => {
    const el = scrollerRef.current
    if (!el) return
    const cardWidth = el.querySelector(`.${styles.card}`)?.offsetWidth || 220
    el.scrollBy({ left: dir * (cardWidth + 32), behavior: 'smooth' })
  }

  return (
    <div className={styles.gallery}>
      <h2 className={styles.title}>走進陶瓷紋飾的千變萬化</h2>
      <div className={styles.subtitle}>從經典青花到祥瑞龍鳳，細賞每一道紋樣背後的故事</div>
      <div className={styles.carouselWrapper}>
        <button className={styles.arrow} onClick={() => scroll(-1)} aria-label="左移">&#8592;</button>
        <div className={styles.carousel} ref={scrollerRef}>
          {cards.map((card, i) => (
            <div className={styles.card} key={i}>
              <img src={card.img} alt={card.title} />
              <div className={styles.info}>
                <div className={styles.cardTitle}>{card.title}</div>
                <div className={styles.cardSubtitle}>{card.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.arrow} onClick={() => scroll(1)} aria-label="右移">&#8594;</button>
      </div>
    </div>
  )
} 