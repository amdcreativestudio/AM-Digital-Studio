
// ========================================
// AM Digital Studio
// web.js - Part 1
// Navigation + Mobile Menu + Smooth Scroll
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

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        menuToggle.classList.toggle("active");

        navLinks.classList.toggle("active");

    });

}


// ===============================
// Sticky Navbar
// ===============================

window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.classList.add("sticky");

    } else {

        navbar.classList.remove("sticky");

    }

});


// ===============================
// Close Mobile Menu
// ===============================

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        if (menuToggle) {

            menuToggle.classList.remove("active");

        }

        if (navLinks) {

            navLinks.classList.remove("active");

        }

    });

});


// ===============================
// Smooth Scroll
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

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

console.log(
    "%cAM Digital Studio - Web Development",
    "font-size:18px;font-weight:bold;color:#1677ff;"
);
// ========================================
// web.js - Part 2
// Package Selection + Order Navigation
// ========================================


// ===============================
// Package Buttons
// ===============================

const packageButtons = document.querySelectorAll(".package-btn");


// ===============================
// Web Development Package Data
// ===============================

const webPackages = {

    basic: {
        service: "Web Development",
        package: "Basic",
        price: 50
    },

    standard: {
        service: "Web Development",
        package: "Standard",
        price: 100
    },

    premium: {
        service: "Web Development",
        package: "Premium",
        price: 200
    }

};


// ===============================
// Handle Package Buttons
// ===============================

packageButtons.forEach(button => {

    button.addEventListener("click", function (e) {

        const link = this.getAttribute("href");


        // If HTML already has an order URL,
        // allow the normal link to work.

        if (link && link.includes("order.html")) {

            return;

        }


        e.preventDefault();


        // Get button text

        const buttonText = this.textContent
            .trim()
            .toLowerCase();


        let selectedPackage = null;


        // Detect selected package

        if (buttonText.includes("basic")) {

            selectedPackage = webPackages.basic;

        }

        else if (buttonText.includes("standard")) {

            selectedPackage = webPackages.standard;

        }

        else if (buttonText.includes("premium")) {

            selectedPackage = webPackages.premium;

        }


        // ===============================
        // Package Not Found
        // ===============================

        if (!selectedPackage) {

            console.error(
                "Web development package not found."
            );

            return;

        }


        // ===============================
        // Save Order Information
        // ===============================

        localStorage.setItem(
            "serviceName",
            selectedPackage.service
        );


        localStorage.setItem(
            "selectedPackage",
            selectedPackage.package
        );


        localStorage.setItem(
            "selectedPrice",
            selectedPackage.price
        );


        // ===============================
        // Create Order URL
        // ===============================

        const orderURL =
            "order.html" +
            "?service=" +
            encodeURIComponent(
                selectedPackage.service
            ) +
            "&package=" +
            encodeURIComponent(
                selectedPackage.package
            ) +
            "&price=" +
            encodeURIComponent(
                selectedPackage.price
            );


        // ===============================
        // Go To Order Page
        // ===============================

        window.location.href = orderURL;

    });

});


// ===============================
// Console
// ===============================

console.log(
    "%cWeb Development Package System Ready",
    "font-size:16px;color:#1677ff;font-weight:bold;"
);

// ========================================
// web.js - Part 3
// FAQ + Scroll Effects + Back To Top
// ========================================


// ===============================
// FAQ Accordion
// ===============================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    const answer = item.querySelector(".faq-answer");


    if (!question || !answer) return;


    question.addEventListener("click", () => {

        const isActive =
            item.classList.contains("active");


        // Close other FAQ items

        faqItems.forEach(otherItem => {

            if (otherItem !== item) {

                otherItem.classList.remove("active");

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");

                if (otherAnswer) {

                    otherAnswer.style.maxHeight = null;

                }

            }

        });


        // Toggle current FAQ

        if (isActive) {

            item.classList.remove("active");

            answer.style.maxHeight = null;

        } else {

            item.classList.add("active");

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        }

    });

});


// ===============================
// Back To Top Button
// ===============================

const topButton = document.createElement("button");

topButton.className = "back-to-top";

topButton.innerHTML =
    '<i class="fa-solid fa-arrow-up"></i>';

topButton.setAttribute(
    "aria-label",
    "Back to top"
);

document.body.appendChild(topButton);


// ===============================
// Show / Hide Back To Top
// ===============================

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topButton.classList.add("show-top");

    } else {

        topButton.classList.remove("show-top");

    }

});


// ===============================
// Back To Top Click
// ===============================

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


// ===============================
// Scroll Reveal
// ===============================

const revealElements = document.querySelectorAll(
    ".web-service-card, .pricing-card, .why-card, .process-card"
);


function revealOnScroll() {

    const triggerPoint =
        window.innerHeight * 0.88;


    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;


        if (elementTop < triggerPoint) {

            element.classList.add("show");

        }

    });

}


window.addEventListener(
    "scroll",
    revealOnScroll
);


window.addEventListener(
    "load",
    revealOnScroll
);


// ===============================
// Resize FAQ
// ===============================

window.addEventListener("resize", () => {

    document
        .querySelectorAll(
            ".faq-item.active .faq-answer"
        )
        .forEach(answer => {

            answer.style.maxHeight =
                answer.scrollHeight + "px";

        });

});


// ===============================
// Page Ready
// ===============================

document.body.classList.add(
    "web-page-ready"
);


// ===============================
// Console
// ===============================

console.log(
    "%cWeb Development Page Ready ✓",
    "font-size:16px;font-weight:bold;color:#1677ff;"
);


// ========================================
// End of web.js
// ========================================
