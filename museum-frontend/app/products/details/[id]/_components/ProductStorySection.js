import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import '../_styles/ProductStorySection.scss'

export default function ProductStorySection({
  story = `自古以來就常被用來作為圖鑑植物的木槿花，
旺盛錦簇的花朵總為平凡的圖鑑增添了幾分美麗的想像。

從春季一路開到秋季，
花期漫長擁有著旺盛生命力的木槿花，
甚至被韓國選為國花，
提醒人們永遠不要忘了生命帶來的無窮希望。`, // 你之後會從資料庫傳入 story
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.8 })

  const paragraphLines = story.split('\n')

  const lineVariants = {
    hidden: { opacity: 0, y: 40 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  }

  return (
    <section className="product-story-section">
      <div className="outer-frame-wrap">
        <div className="outer-frame-golden">
          <div className="story-inner" ref={ref}>
            <motion.div
              className="scroll-frame-alt story-border"
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              variants={{}}
            >
              <div className="story-box">
                <img
                  src="/icon/story-line.svg"
                  alt="Story Icon"
                  className="story-icon mb-2"
                />
                <h3 className="story-heading">
                  <span className="en">Story</span> 作品故事
                </h3>
                <div className="divider my-3"></div>
                <div className="story-paragraph white-space-pre-line">
                  {paragraphLines.map((line, i) => (
                    <motion.p
                      key={i}
                      className="story-line"
                      custom={i}
                      variants={lineVariants}
                      initial="hidden"
                      animate={inView ? 'show' : 'hidden'}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
