import { useState } from 'react';
import styles from '../_styles/CourseList.module.scss';

export default function CourseNotice({ defaultOpen = false }) {
  const [noticeOpen, setNoticeOpen] = useState(defaultOpen);
  return (
    <div className={styles.courseNoticeBox}>
      <div className={styles.courseNoticeHeader}>
        <span>課程購買注意事項</span>
        <button
          className={`btn btn-info ${styles.courseNoticeToggleBtn}`}
          onClick={() => setNoticeOpen((v) => !v)}
        >
          {noticeOpen ? '收合 ▲' : '展開 ▼'}
        </button>
      </div>
      <div
        className={styles.courseNoticeContent + (noticeOpen ? ' ' + styles.open : '')}
        style={!noticeOpen ? { maxHeight: '320px' } : {}}
      >
        <div className={styles.courseNoticeInner}>
          <p>一、學員完成繳費後無法上課，依下列規定辦理退費：</p>
          <ol>
            <li>自繳費後至開課日前第60日以前提出退費申請者，應退還當期開班約定繳納費用總額95%。但所收取的5%部分將不超過新台幣1,000元。</li>
            <li>自繳費後至開課日前第59~課程開始前提出退費申請者，應退還當期開班約定繳納費用總額90%。但所收取的10%部分將不超過新台幣1,000元。</li>
            <li>於實際開課日當天課程結束後，第二日（次）上課前（不含當次）提出退費申請者，應退還當期開班約定繳納費用總額70%。</li>
            <li>於第二日（次）上課後且未逾全期（或總課程時數）三分之一期間內提出退費申請，應退還當期開班約定繳納費用總額50%。</li>
            <li>已逾全期（或總課程時數）三分之一以上期間提出退費申請者，所收取之當期開班約定繳納費用得全數不予退還。</li>
            <li>團體報名退費辦法
              <ol>
                <li>團報後欲申請退費者，將會要求退費需先補加收團報與原價之間的差額，再扣除手續費後，餘額才是退回款項。其他團報者費用則不再追繳差額。</li>
                <li>例如課程原價5,400元，團報價4,860元，以開課日前8-15天以上退出者為例，退費計算方式為是4860-(5400-4860)-(5400*10%) = 3780元</li>
              </ol>
            </li>
          </ol>
          <p>※備註：</p>
          <ul>
            <li>上述計算以實際天數計(含例假日)，不以上班日計。</li>
          </ul>
          <br />
          <p>二、特殊情況，可酌情給予全額退費：</p>
          <ol>
            <li>奔喪：但限直系親屬或三等親內，且提供相關證明。</li>
            <li>學員本人因重病住院或感染流行性疾病﹙需附中央健保局特約區域醫院以上之醫院出具之證明﹚無法上課，如於開課前發生所繳費用全額退還；已上課後則依未參與時數比例退費。</li>
            <li>如遇颱風地震等無法抗力之天災，依照台北市政府人事行政局公告停班，承辦人會先通知課程延期，如無法延期而取消開課，則會辦理全額退費。</li>
            <li>因招生不足致無法開班、經資格審查後無法參與課程等因素。</li>
          </ol>
        </div>
        {!noticeOpen && <div className={styles.courseNoticeMask}></div>}
      </div>
    </div>
  );
} 