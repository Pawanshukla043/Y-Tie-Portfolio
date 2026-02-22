const API_URL = "https://script.google.com/macros/s/AKfycbzw5fQxF08EcGq3MvR0yOZ2u8SMpdKtxgiXLFQACB2KbWE8xALxs7d1_QNqX598z6o/exec";

let slideIndex = 0;
let totalSlides = 0;
let shortsSwiper = null;

async function loadContent() {
  const res = await fetch(API_URL);
  const data = await res.json();

  /* ================= SETTINGS ================= */

  const s = data.settings;

  document.getElementById("hero_title").innerText = s.hero_title || "";
  document.getElementById("hero_tagline").innerText = s.hero_tagline || "";

  const heroBtn = document.getElementById("hero_button");
  heroBtn.innerText = s.hero_button_text || "";
  heroBtn.href = s.hero_button_link || "#";

  document.getElementById("about_heading").innerHTML = s.about_heading || "";
  document.getElementById("about_para_1").innerText = s.about_para_1 || "";
  document.getElementById("about_para_2").innerText = s.about_para_2 || "";

  document.getElementById("contact_email").innerText = s.contact_email || "";
  document.getElementById("contact_phone").innerText = s.contact_phone || "";

  document.getElementById("album_title").innerHTML = s.album_title || "";
  document.getElementById("album_description").innerText = s.album_description || "";
  document.getElementById("album_button").innerText = s.album_button_text || "Listen Now";
  document.getElementById("album_button").href = s.album_button_link || "#";

  document.getElementById("vision_heading").innerHTML = s.vision_heading || "";
  document.getElementById("vision_text").innerText = s.vision_text || "";

/* ================= JOURNEY ================= */

const journeyContainer = document.getElementById("journey_slides");

if (journeyContainer && Array.isArray(data.journey)) {

  journeyContainer.innerHTML = data.journey.map(item => `
    <div class="slide" style="background-image:url('/img/${item.image}')">
      <h3>${item.year}</h3>
      <p>${item.description}</p>
    </div>
  `).join("");

  // IMPORTANT: count only journey slides
  totalSlides = journeyContainer.querySelectorAll(".slide").length;

  // Reset position
  slideIndex = 0;

  // Force proper width calculation after DOM render
  setTimeout(initSlider, 100);
}

  /* ================= STATS ================= */

  const statsContainer = document.getElementById("stats_container");
  statsContainer.innerHTML = "";

  data.stats.forEach(stat => {
    statsContainer.innerHTML += `
      <div class="card">
        <h3>${stat.number}</h3>
        <p>${stat.label}</p>
      </div>
    `;
  });

  /* ================= MUSIC ================= */

  const albumContainer = document.getElementById("album_iframe");
  const singlesContainer = document.getElementById("singles_container");

  albumContainer.innerHTML = "";
  singlesContainer.innerHTML = "";

  data.music_iframes.forEach(item => {
    if (item.type === "album") {
      albumContainer.innerHTML = item.embed_code;
    } else {
      singlesContainer.innerHTML += item.embed_code;
    }
  });

  /* ================= VIDEOS ================= */

  const videoBento = document.getElementById("video_bento");

  if (videoBento && data.videos) {

    const v = data.videos;

    function getYoutubeId(url) {
      if (!url) return null;
      const regExp = /(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([^?&/]+)/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    }

    function createYoutubeThumbnail(url) {
      const id = getYoutubeId(url);
      if (!id) return "";
      return `
        <div class="video-wrapper" data-video-id="${id}">
          <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" 
               onerror="this.src='https://img.youtube.com/vi/${id}/0.jpg'" 
               alt="Video thumbnail" 
               class="video-thumb">
        </div>
      `;
    }

    videoBento.innerHTML = `
      <div class="bento-item feature-video">
          ${createYoutubeThumbnail(v.video_feature_embed)}
          <div class="v-label">FEATURED RELEASE</div>
      </div>

      <div class="bento-item">${createYoutubeThumbnail(v.video_1_embed)}</div>
      <div class="bento-item">${createYoutubeThumbnail(v.video_2_embed)}</div>
      <div class="bento-item">${createYoutubeThumbnail(v.video_3_embed)}</div>
      <div class="bento-item">${createYoutubeThumbnail(v.video_4_embed)}</div>
      <div class="bento-item">${createYoutubeThumbnail(v.video_5_embed)}</div>
    `;

    // Hover effect with auto-play
    const bentoItems = videoBento.querySelectorAll('.bento-item');
    bentoItems.forEach(item => {
      const wrapper = item.querySelector('.video-wrapper');
      if (!wrapper) return;

      item.addEventListener('mouseenter', () => {
        videoBento.classList.add('has-hover');
        item.classList.add('hovered');
        
        // Pause swiper
        if (shortsSwiper && shortsSwiper.autoplay) {
          shortsSwiper.autoplay.stop();
        }

        // Inject iframe
        const videoId = wrapper.dataset.videoId;
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`;
        iframe.allow = 'autoplay';
        iframe.style.opacity = '0';
        wrapper.appendChild(iframe);
        
        setTimeout(() => iframe.style.opacity = '1', 100);
      });

      item.addEventListener('mouseleave', () => {
        videoBento.classList.remove('has-hover');
        item.classList.remove('hovered');
        
        // Resume swiper
        if (shortsSwiper && shortsSwiper.autoplay) {
          shortsSwiper.autoplay.start();
        }

        // Remove iframe
        const iframe = wrapper.querySelector('iframe');
        if (iframe) iframe.remove();
      });
    });
  }

  /* ================= SHORTS + REELS ================= */

  const shortsContainer = document.getElementById("shorts_container");

  if (shortsContainer && Array.isArray(data.shorts)) {

    let html = "";

    function getYoutubeId(url) {
      if (!url) return null;
      const regExp = /(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([^?&/]+)/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    }

    data.shorts.forEach(item => {

      let embed = "";

      /* ===== YOUTUBE SHORTS ===== */
      if (item.platform === "youtube") {
        const id = getYoutubeId(item.url);
        if (id) {
          embed = `
          <iframe 
            src="https://www.youtube.com/embed/${id}" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        `;
        }
      }

      /* ===== INSTAGRAM REELS ===== */
      if (item.platform === "instagram") {

        // Clean URL (remove tracking params)
        const cleanUrl = item.url.split("?")[0];

        embed = `
        <blockquote 
          class="instagram-media"
          data-instgrm-permalink="${cleanUrl}"
          data-instgrm-version="14"
          style="background:#000; border:0; margin:0 auto; max-width:100%;">
        </blockquote>
      `;
      }

      if (embed) {
        html += `<div class="swiper-slide">${embed}</div>`;
      }
    });

    shortsContainer.innerHTML = html;

    /* IMPORTANT: Re-process Instagram embeds */
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }

    initSwiper();
  }
}

/* ================= SLIDER ================= */

function initSlider() {

  const slidesWrapper = document.querySelector("#journey_slides");
  if (!slidesWrapper) return;

  const slides = slidesWrapper.querySelectorAll(".slide");
  if (!slides.length) return;

  slidesWrapper.style.display = "flex";
  slidesWrapper.style.transition = "transform 0.6s ease";

  slideIndex = 0;

  setInterval(() => {

    slideIndex++;
    if (slideIndex >= slides.length) slideIndex = 0;

    slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;

  }, 4000);
}

/* ================= SWIPER ================= */

function initSwiper() {

  if (shortsSwiper) {
    shortsSwiper.destroy(true, true);
  }

  shortsSwiper = new Swiper('.shorts-swiper', {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}

document.addEventListener("DOMContentLoaded", loadContent);