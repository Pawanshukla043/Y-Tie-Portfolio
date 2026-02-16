// let slideIndex = 0;
// const slides = document.querySelector(".slides");
// const totalSlides = document.querySelectorAll(".slide").length;

// document.querySelector(".next").onclick = () => {
//   slideIndex = (slideIndex + 1) % totalSlides;
//   slides.style.transform = `translateX(-${slideIndex * 100}%)`;
// };

// document.querySelector(".prev").onclick = () => {
//   slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
//   slides.style.transform = `translateX(-${slideIndex * 100}%)`;
// };


let slideIndex = 0;
const slides = document.querySelector(".slides");
const totalSlides = document.querySelectorAll(".slide").length;

function autoSlide() {
  slideIndex++;

  if(slideIndex >= totalSlides){
    slideIndex = 0;
  }

  slides.style.transition = "transform 0.6s ease";
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}

setInterval(autoSlide, 3000);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Vertical Reel
    const reel = new Swiper('.shorts-swiper', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Handle Hover-to-Play on the Bento Grid
    const bentoItems = document.querySelectorAll('.bento-item');

    bentoItems.forEach(item => {
        const videoId = item.getAttribute('data-id');
        const frame = item.querySelector('.v-frame');

        item.addEventListener('mouseenter', () => {
            reel.autoplay.stop(); // Pause the reel when looking at a feature
            
            // Inject Iframe on hover for performance and professional feel
            frame.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0" 
                    style="width:100%; height:100%; position:absolute; top:10; left:0; z-index:2;"
                    frameborder="0" 
                    allow="autoplay">
                </iframe>
            `;
            frame.style.opacity = '1';
        });

        item.addEventListener('mouseleave', () => {
            reel.autoplay.start();
            frame.innerHTML = ''; // Clean up resources
            frame.style.opacity = '0';
        });
    });
});