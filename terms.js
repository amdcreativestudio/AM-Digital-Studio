// ========================================
// AM Digital Studio
// terms.js - Part 1
// Navigation + Mobile Menu
// ========================================


// ===============================
// Elements
// ===============================

const navbar = document.querySelector(".navbar");

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");


// ===============================
// Mobile Menu
// ===============================

if(menuToggle){

    menuToggle.addEventListener("click", () => {

        menuToggle.classList.toggle("active");

        navLinks.classList.toggle("active");

    });

}


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
// Smooth Scroll
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

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
// Console
// ===============================

console.log("%cAM Digital Studio",
"font-size:22px;font-weight:bold;color:#1677ff;");
// ========================================
// AM Digital Studio
// terms.js - Part 2
// Final Functions
// ========================================


// ===============================
// Reveal Cards Animation
// ===============================

const cards = document.querySelectorAll(".terms-card");

function revealCards(){

    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {

        const top = card.getBoundingClientRect().top;

        if(top < trigger){

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
// Back To Top Button
// ===============================

const topButton = document.createElement("button");

topButton.className = "back-to-top";

topButton.innerHTML = "↑";

document.body.appendChild(topButton);

window.addEventListener("scroll", () => {

    if(window.scrollY > 400){

        topButton.classList.add("show-top");

    }else{

        topButton.classList.remove("show-top");

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


// ===============================
// Page Loaded Effect
// ===============================

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});


// ===============================
// Console Message
// ===============================

console.log(
    "%cTerms & Conditions Ready",
    "font-size:16px;font-weight:bold;color:green;"
);


// ========================================
// End of terms.js
// ========================================
