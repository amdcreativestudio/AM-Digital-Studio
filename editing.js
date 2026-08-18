
// ========================================
// AM Digital Studio
// editing.js - Part 1
// Navigation + FAQ
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

    menuToggle.addEventListener("click",()=>{

        menuToggle.classList.toggle("active");

        navLinks.classList.toggle("active");

    });

}


// ===============================
// Sticky Navbar
// ===============================

window.addEventListener("scroll",()=>{

    if(window.scrollY > 50){

        navbar.classList.add("sticky");

    }else{

        navbar.classList.remove("sticky");

    }

});


// ===============================
// Smooth Scroll
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        const target=document.querySelector(

            this.getAttribute("href")

        );

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

document.querySelectorAll(".nav-links a").forEach(link=>{

    link.addEventListener("click",()=>{

        menuToggle.classList.remove("active");

        navLinks.classList.remove("active");

    });

});


// ===============================
// FAQ Accordion
// ===============================

const faqItems=document.querySelectorAll(".faq-item");

faqItems.forEach(item=>{

    const question=item.querySelector(".faq-question");

    question.addEventListener("click",()=>{

        faqItems.forEach(f=>{

            if(f!==item){

                f.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});


// ===============================
// Console
// ===============================

console.log(

"%cAM Digital Studio",

"font-size:22px;font-weight:bold;color:#1677ff;"

);

// ========================================
// AM Digital Studio
// editing.js - Part 2
// Final Functions
// ========================================


// ===============================
// Scroll Reveal Animation
// ===============================

const revealElements = document.querySelectorAll(

".package-card, .feature-card, .why-item, .portfolio-card, .review-card"

);

function revealOnScroll(){

    const trigger = window.innerHeight * 0.85;

    revealElements.forEach(element=>{

        const top = element.getBoundingClientRect().top;

        if(top < trigger){

            element.style.opacity="1";

            element.style.transform="translateY(0)";

        }

    });

}

revealElements.forEach(element=>{

    element.style.opacity="0";

    element.style.transform="translateY(40px)";

    element.style.transition=".6s ease";

});

window.addEventListener("scroll",revealOnScroll);

window.addEventListener("load",revealOnScroll);


// ===============================
// Progress Bar
// ===============================

const progressBar=document.createElement("div");

progressBar.className="progress-bar";

document.body.appendChild(progressBar);

window.addEventListener("scroll",()=>{

    const scrollTop=document.documentElement.scrollTop;

    const scrollHeight=

        document.documentElement.scrollHeight-

        document.documentElement.clientHeight;

    const progress=(scrollTop/scrollHeight)*100;

    progressBar.style.width=progress+"%";

});


// ===============================
// Back To Top Button
// ===============================

const topButton=document.createElement("button");

topButton.className="back-to-top";

topButton.innerHTML='<i class="fas fa-arrow-up"></i>';

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

    if(window.scrollY>400){

        topButton.classList.add("show-top");

    }else{

        topButton.classList.remove("show-top");

    }

});

topButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});





// ===============================
// Console
// ===============================

console.log(

"%cProfessional Video Editing Page Ready",

"font-size:16px;font-weight:bold;color:green;"

);


// ========================================
// End of editing.js
// ========================================
