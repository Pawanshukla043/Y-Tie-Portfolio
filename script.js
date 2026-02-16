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

const track = document.querySelector(".shorts-track");
const shorts = document.querySelectorAll(".shorts-track iframe");

let shortIndex = 0;

function verticalSlide(){
  shortIndex++;

  if(shortIndex >= shorts.length){
    shortIndex = 0;
  }

  track.style.transform = `translateY(-${shortIndex * 365}px)`;
}

setInterval(verticalSlide, 3000);
