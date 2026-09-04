
// ========================================
// AM Digital Studio
// JavaScript - Part 1
// Navigation & Basic Interactions
// ========================================


// ===============================
// Select Elements
// ===============================

const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");


// ===============================
// Universal Menu Toggle
// Desktop + Mobile
// ===============================

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("active");

        menuToggle.classList.toggle(
            "active",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

    });

}

// ===============================
// Close Menu After Clicking Link
// ===============================

navItems.forEach(item => {

    item.addEventListener("click", () => {

        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");

    });

});


// ===============================
// Sticky Navbar
// ===============================

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.classList.add("sticky");

    } else {

        navbar.classList.remove("sticky");

    }

});


// ===============================
// ===============================
// Smooth Scrolling
// ===============================

navItems.forEach(link => {

    link.addEventListener("click", function (e) {

        const href = this.getAttribute("href");

        // Only smooth-scroll for same-page # links
        if (href && href.startsWith("#")) {

            const target = document.querySelector(href);

            if (target) {

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }

        // Close menu
        if (menuToggle && navLinks) {

            menuToggle.classList.remove("active");

            navLinks.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

});

// ===============================
// Active Navigation Link
// ===============================

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link => {

        link.classList.remove("current");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("current");

        }

    });

});


// ===============================
// Developer Console Message
// ===============================

console.log("%cAM Digital Studio",
"font-size:22px;font-weight:bold;color:#0077ff;");

console.log("%cWebsite Loaded Successfully",
"font-size:14px;color:green;");

// ========================================
// JavaScript - Part 2
// Hero Animation & Scroll Effects
// ========================================


// ===============================
// Scroll Reveal Animation
// ===============================

const revealElements = document.querySelectorAll(
    ".service-card, .hero-content, .section-title, .about-text, .contact-buttons, footer"
);

function revealOnScroll() {

    const windowHeight = window.innerHeight;

    revealElements.forEach((element) => {

        const revealTop = element.getBoundingClientRect().top;

        if (revealTop < windowHeight - 120) {

            element.classList.add("show");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


// ===============================
// Welcome Text Floating Effect
// ===============================

const welcome = document.querySelector(".welcome");

let direction = 1;
let position = 0;

function floatingText() {

    position += 0.15 * direction;

    if (position >= 10) {

        direction = -1;

    }

    if (position <= 0) {

        direction = 1;

    }

    if (welcome) {

        welcome.style.transform = `translateY(${position}px)`;

    }

    requestAnimationFrame(floatingText);

}

floatingText();


// ===============================
// Hero Fade Animation
// ===============================

window.addEventListener("load", () => {

    const hero = document.querySelector(".hero-content");

    if (hero) {

        hero.classList.add("hero-loaded");

    }

});


// ===============================
// Typing Cursor Blink
// ===============================

const studioName = document.querySelector(".studio-name");

if (studioName) {

    setInterval(() => {

        studioName.classList.toggle("cursor");

    }, 600);

}


// ===============================
// Parallax Effect
// ===============================

window.addEventListener("scroll", () => {

    const hero = document.querySelector(".hero");

    if (!hero) return;

    const offset = window.pageYOffset;

    hero.style.transform = `translateY(${offset * 0.15}px)`;

});


// ===============================
// Section Fade Delay
// ===============================

document.querySelectorAll(".service-card").forEach((card, index) => {

    card.style.transitionDelay = `${index * 0.08}s`;

});


// ===============================
// Page Loaded Class
// ===============================

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});


// ===============================
// Welcome Text Glow Pulse
// ===============================

let glow = 0;

setInterval(() => {

    glow++;

    if (welcome) {

        welcome.style.letterSpacing =
            glow % 2 === 0 ? "10px" : "8px";

    }

}, 900);


// ===============================
// End of Part 2
// ===============================


// ========================================
// JavaScript - Part 3
// Interactive UI Effects
// ========================================


// ===============================
// Button Hover Scale
// ===============================

const buttons = document.querySelectorAll(".primary-btn, .secondary-btn");

buttons.forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.style.transform = "translateY(-5px) scale(1.03)";

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "translateY(0) scale(1)";

    });

});


// ===============================
// Service Card Hover Effect
// ===============================

const cards = document.querySelectorAll(".service-card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-10px)";
        card.style.boxShadow = "0 15px 35px rgba(0,0,0,.12)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "translateY(0)";
        card.style.boxShadow = "";

    });

});


// ===============================
// Mouse Position Effect
// ===============================

document.addEventListener("mousemove", (e) => {

    document.documentElement.style.setProperty("--mouse-x", e.clientX + "px");
    document.documentElement.style.setProperty("--mouse-y", e.clientY + "px");

});


// ===============================
// Button Ripple Effect
// ===============================

buttons.forEach(button => {

    button.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        const rect = this.getBoundingClientRect();

        const size = Math.max(rect.width, rect.height);

        ripple.style.width = size + "px";
        ripple.style.height = size + "px";

        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

        ripple.classList.add("ripple");

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});


// ===============================
// Scroll Progress Bar
// ===============================

const progressBar = document.createElement("div");

progressBar.className = "progress-bar";

document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {

    const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress =
        (window.pageYOffset / totalHeight) * 100;

    progressBar.style.width = progress + "%";

});


// ===============================
// Current Year
// ===============================

const year = document.querySelector(".year");

if (year) {

    year.textContent = new Date().getFullYear();

}


// ===============================
// Image Lazy Animation
// ===============================

const images = document.querySelectorAll("img");

const imageObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("image-visible");

        }

    });

});

images.forEach(img => {

    imageObserver.observe(img);

});


// ===============================
// Disable Right Click
// (Remove this if you don't want it)
// ===============================

// document.addEventListener("contextmenu", e => {
//     e.preventDefault();
// });


// ===============================
// End of Part 3
// ===============================

// ========================================
// JavaScript - Part 4
// Final Features & Performance
// ========================================


// ===============================
// Page Loader
// ===============================

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});


// ===============================
// Navbar Shadow
// ===============================

window.addEventListener("scroll", () => {

    if (window.scrollY > 10) {

        navbar.style.boxShadow = "0 10px 25px rgba(0,0,0,.08)";

    } else {

        navbar.style.boxShadow = "none";

    }

});


// ===============================
// Back To Top Button
// ===============================

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.className = "back-to-top";

document.body.appendChild(topButton);

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

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
// Button Click Animation
// ===============================

document.querySelectorAll("button,a").forEach(item => {

    item.addEventListener("click", function () {

        this.classList.add("clicked");

        setTimeout(() => {

            this.classList.remove("clicked");

        }, 250);

    });

});


// ===============================
// Keyboard Shortcut
// Press H = Home
// ===============================

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "h") {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

});


// ===============================
// Window Resize
// ===============================

window.addEventListener("resize", () => {

    console.log(

        "Screen Size :",

        window.innerWidth + " x " + window.innerHeight

    );

});


// ===============================
// Prevent Double Click Zoom
// ===============================

let lastTouchEnd = 0;

document.addEventListener("touchend", function (event) {

    const now = Date.now();

    if (now - lastTouchEnd <= 300) {

        event.preventDefault();

    }

    lastTouchEnd = now;

}, {

    passive: false

});


// ===============================
// Console Branding
// ===============================

console.log("%cAM Digital Studio",

"font-size:28px;font-weight:bold;color:#2196f3;");

console.log("%cOfficial Website",

"font-size:16px;color:#555;");

console.log("%cDeveloped Successfully",

"font-size:14px;color:green;");


// ===============================
// Website Ready
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Website Ready!");

});

/* ==========================
   EMAIL POPUP
========================== */

const emailPopup = document.getElementById("emailPopup");
const openEmailPopup = document.getElementById("openEmailPopup");
const closeEmailPopup = document.getElementById("closeEmailPopup");

if (openEmailPopup && emailPopup) {
    openEmailPopup.addEventListener("click", () => {
        emailPopup.classList.add("active");
        document.body.style.overflow = "hidden";
    });
}

if (closeEmailPopup && emailPopup) {
    closeEmailPopup.addEventListener("click", () => {
        emailPopup.classList.remove("active");
        document.body.style.overflow = "";
    });
}

if (emailPopup) {
    emailPopup.addEventListener("click", (e) => {
        if (e.target === emailPopup) {
            emailPopup.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && emailPopup) {
        emailPopup.classList.remove("active");
        document.body.style.overflow = "";
    }
});


/* ==========================
   EMAILJS CONTACT FORM
========================== */

const emailForm = document.getElementById("emailForm");
const emailStatus = document.getElementById("emailStatus");
const sendEmailBtn = document.getElementById("sendEmailBtn");

if (emailForm && sendEmailBtn && emailStatus) {

    emailForm.addEventListener("submit", (e) => {

        e.preventDefault();

        sendEmailBtn.disabled = true;

        const buttonText = sendEmailBtn.querySelector("span");

        if (buttonText) {
            buttonText.textContent = "Sending...";
        }

        const templateParams = {
            name: document.getElementById("senderName").value.trim(),
            email: document.getElementById("senderEmail").value.trim(),
            subject: document.getElementById("emailSubject").value.trim(),
            message: document.getElementById("emailMessage").value.trim()
        };

        emailjs.send(
            "service_erxcjq7",
            "template_79wqgy1",
            templateParams
        )

        .then(() => {

            emailStatus.textContent = "✓ Message sent successfully!";
            emailStatus.className = "email-status success";

            emailForm.reset();

            if (buttonText) {
                buttonText.textContent = "Sent ✓";
            }

            setTimeout(() => {

                emailPopup.classList.remove("active");
                document.body.style.overflow = "";

                emailStatus.textContent = "";
                sendEmailBtn.disabled = false;

                if (buttonText) {
                    buttonText.textContent = "Send Message";
                }

            }, 2000);

        })

        .catch((error) => {

            console.error("Email sending failed:", error);

            emailStatus.textContent =
                "✕ Failed to send message. Please try again.";

            emailStatus.className = "email-status error";

            sendEmailBtn.disabled = false;

            if (buttonText) {
                buttonText.textContent = "Send Message";
            }

        });

    });

}

// ========================================
// PREMIUM SITE SEARCH
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("siteSearchInput");

    const searchResults =
        document.getElementById("searchResults");

    const clearSearch =
        document.getElementById("clearSearch");


    if (!searchInput || !searchResults) return;


    // ========================================
    // SEARCH DATA
    // ========================================

    const searchItems = [

        {
            title: "Services",
            description: "Explore all AM Digital Studio services",
            icon: "fa-layer-group",
            url: "#services"
        },

        {
            title: "Video Editing",
            description: "Professional video editing services",
            icon: "fa-video",
            url: "editing.html"
        },

        {
            title: "Web Development",
            description: "Business and portfolio websites",
            icon: "fa-code",
            url: "web.html"
        },

        {
            title: "Logo Design",
            description: "Professional logo design for your brand",
            icon: "fa-pen-nib",
            url: "logo.html"
        },

        {
            title: "Poster Design",
            description: "Modern professional poster designs",
            icon: "fa-image",
            url: "poster.html"
        },

        {
            title: "YouTube Thumbnail Design",
            description: "High CTR YouTube thumbnail designs",
            icon: "fa-youtube",
            url: "thumbnail.html"
        },

        {
            title: "Fiverr Gig SEO",
            description: "Optimize your Fiverr gig for better visibility",
            icon: "fa-chart-line",
            url: "seo.html"
        },

        {
            title: "About Us",
            description: "Learn more about AM Digital Studio",
            icon: "fa-users",
            url: "#about"
        },

        {
            title: "YouTube Videos",
            description: "Watch AM Digital Studio videos",
            icon: "fa-play",
            url: "#watch"
        },

        {
            title: "Contact Us",
            description: "Get in touch with AM Digital Studio",
            icon: "fa-envelope",
            url: "#contact"
        },

        {
            title: "Email Us",
            description: "Send us a message by email",
            icon: "fa-paper-plane",
            url: "#contact"
        },

        {
            title: "Videos",
            description: "Watch all videos and playlists",
            icon: "fa-circle-play",
            url: "video.html"
        }

    ];


    // ========================================
    // DISPLAY RESULTS
    // ========================================

    function displayResults(query) {

        const searchTerm =
            query.trim().toLowerCase();


        if (!searchTerm) {

            searchResults.innerHTML = "";

            searchResults.classList.remove("active");

            clearSearch.style.display = "none";

            return;

        }


        clearSearch.style.display = "flex";


        const filtered =
            searchItems.filter(item =>

                item.title
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                item.description
                    .toLowerCase()
                    .includes(searchTerm)

            );


        if (filtered.length === 0) {

            searchResults.innerHTML = `

                <div class="search-no-result">

                    <i class="fas fa-search"></i>

                    <br>

                    No results found for
                    "<strong>${query}</strong>"

                </div>

            `;

            searchResults.classList.add("active");

            return;

        }


        searchResults.innerHTML =
            filtered.map(item => `

                <a
                    href="${item.url}"
                    class="search-result"
                >

                    <span class="search-result-icon">

                        <i class="fas ${item.icon}"></i>

                    </span>

                    <span class="search-result-text">

                        <span class="search-result-title">

                            ${item.title}

                        </span>

                        <span class="search-result-description">

                            ${item.description}

                        </span>

                    </span>

                </a>

            `).join("");


        searchResults.classList.add("active");


        // Close dropdown after selecting

        document
            .querySelectorAll(".search-result")
            .forEach(result => {

                result.addEventListener("click", () => {

                    searchResults.classList.remove("active");

                    searchInput.value = "";

                    clearSearch.style.display = "none";

                });

            });

    }


    // ========================================
    // INPUT
    // ========================================

    searchInput.addEventListener(
        "input",
        () => {

            displayResults(
                searchInput.value
            );

        }
    );


    // ========================================
    // CLEAR
    // ========================================

    clearSearch.addEventListener(
        "click",
        () => {

            searchInput.value = "";

            searchResults.innerHTML = "";

            searchResults.classList.remove(
                "active"
            );

            clearSearch.style.display = "none";

            searchInput.focus();

        }
    );


    // ========================================
    // ESC KEY
    // ========================================

    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                searchResults.classList.remove(
                    "active"
                );

                searchInput.blur();

            }

        }
    );


    // ========================================
    // CLICK OUTSIDE
    // ========================================

    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".site-search"
                )
            ) {

                searchResults.classList.remove(
                    "active"
                );

            }

        }
    );

});
