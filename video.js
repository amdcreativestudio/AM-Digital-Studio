// ========================================
// AM Digital Studio
// video.js - Part 1
// Navigation + Video Popup
// ========================================


// ===============================
// Elements
// ===============================

const navbar = document.querySelector(".navbar");

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

const videoCards = document.querySelectorAll(".video-card");

const popup = document.querySelector(".video-popup");

const player = document.getElementById("youtubePlayer");

const closePopup = document.querySelector(".close-popup");


// ===============================
// Mobile Menu
// ===============================

menuToggle.addEventListener("click", () => {

    menuToggle.classList.toggle("active");

    navLinks.classList.toggle("active");

});


// ===============================
// Sticky Navbar
// ===============================

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        navbar.classList.add("sticky");

    }else{

        navbar.classList.remove("sticky");

    }

});


// ===============================
// Open Video Popup
// ===============================

videoCards.forEach(card => {

    card.addEventListener("click", () => {

        const videoURL = card.dataset.video;

        player.src = videoURL;

        popup.classList.add("active");

        document.body.style.overflow = "hidden";

    });

});


// ===============================
// Smooth Scroll
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(

            this.getAttribute("href")

        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


// ===============================
// Console
// ===============================

console.log("%cAM Digital Studio",

"font-size:24px;font-weight:bold;color:#1677ff;");

// ========================================
// video.js - Part 2
// Final Functions
// ========================================


// ===============================
// Close Popup
// ===============================

function closeVideo() {

    popup.classList.remove("active");

    player.src = "";

    document.body.style.overflow = "auto";

}

closePopup.addEventListener("click", closeVideo);


// ===============================
// Outside Click Close
// ===============================

popup.addEventListener("click", (e) => {

    if (e.target === popup) {

        closeVideo();

    }

});


// ===============================
// ESC Key Close
// ===============================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        closeVideo();

    }

});


// ===============================
// Close Mobile Menu
// ===============================

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        menuToggle.classList.remove("active");

        navLinks.classList.remove("active");

    });

});


// ===============================
// Scroll Reveal
// ===============================

const cards = document.querySelectorAll(".video-card");

function revealCards() {

    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {

        const top = card.getBoundingClientRect().top;

        if (top < trigger) {

            card.classList.add("show");

        }

    });

}

window.addEventListener("scroll", revealCards);

window.addEventListener("load", revealCards);


// ===============================
// Progress Bar
// ===============================

const progressBar = document.createElement("div");

progressBar.className = "progress-bar";

document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = (scrollTop / scrollHeight) * 100;

    progressBar.style.width = progress + "%";

});


// ===============================
// Back To Top
// ===============================

const topButton = document.createElement("button");

topButton.className = "back-to-top";

topButton.innerHTML = "↑";

document.body.appendChild(topButton);

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        topButton.classList.add("show-top");

    } else {

        topButton.classList.remove("show-top");

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


// ===============================
// Page Loaded
// ===============================

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});


// ===============================
// Console
// ===============================

console.log("%cVideo Library Ready",
"font-size:16px;color:green;font-weight:bold;");


// ========================================
// End of video.js
// ========================================
