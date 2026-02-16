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

let shortIndex = 0;
const shortsTrack = document.querySelector(".shorts-track");
const shorts = document.querySelectorAll(".short");

const slideHeight = 600;

setInterval(() => {
  shortIndex++;

  if (shortIndex >= shorts.length) {
    shortIndex = 0;
  }

  shortsTrack.style.transform = `translateY(-${shortIndex * slideHeight}px)`;

}, 4000);
