import React from 'react'

export default function MuseumVideo() {
  return (
    <section className="museum-video-section full-vh">
      <h2 className="museum-video-section__title">博物館內部導覽</h2>
      <p className="museum-video-section__desc">
        透過 360° 街景，帶你線上探索博物館的每個角落。
      </p>
      <div className="museum-video-card">
        <iframe
          src="https://www.google.com/maps/embed?pb=!4v1748084465731!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRDRndnFsWFE.!2m2!1d34.69345038669045!2d135.5054797545238!3f291.4747666093877!4f1.140874278307166!5f0.7820865974627469"
          title="Google Maps 360"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  )
}
