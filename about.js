```javascript
/* =====================================================
   AM DIGITAL STUDIO — ABOUT PAGE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. MOBILE NAVIGATION
    ========================= */

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const menuIcon = menuToggle
        ? menuToggle.querySelector("i")
        : null;

    function closeMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        if (menuIcon) {
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }
    }

    function openMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        if (menuIcon) {
            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-xmark");
        }
    }

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuMenuIsOpen();

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        function menuMenuIsOpen() {
            return navMenu.classList.contains("active");
        }

        // Close when a navigation link is selected.
        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Close with Escape.
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Close if the user clicks outside the navbar.
        document.addEventListener("click", event => {
            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });

        // Close the mobile menu when switching to desktop width.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 800) {
                closeMenu();
            }
        });
    }


    /* =========================
       2. NAVBAR SCROLL EFFECT
    ========================= */

    const header = document.getElementById("site-header");

    function updateHeader() {
        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =========================
       3. CURRENT FOOTER YEAR
    ========================= */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================
       4. BACK TO TOP
    ========================= */

    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {
        backToTop.addEventListener("click", event => {
            const target = document.querySelector("#about-home");

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    }


    /* =========================
       5. SCROLL REVEAL ANIMATIONS
    ========================= */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealElements = document.querySelectorAll(
        ".story-grid, " +
        ".section-heading, " +
        ".purpose-card, " +
        ".service-card, " +
        ".values-intro, " +
        ".value-item, " +
        ".founder-grid, " +
        ".cta-card"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });
    } else {

        // Add animation styles without overriding the main stylesheet.
        const revealStyle = document.createElement("style");

        revealStyle.textContent = `
            .js-reveal {
                opacity: 0;
                transform: translateY(24px);
                transition:
                    opacity 0.65s ease,
                    transform 0.65s ease;
            }

            .js-reveal.is-visible {
                opacity: 1;
                transform: translateY(0);
            }

            @media (prefers-reduced-motion: reduce) {
                .js-reveal,
                .js-reveal.is-visible {
                    opacity: 1;
                    transform: none;
                    transition: none;
                }
            }
        `;

        document.head.appendChild(revealStyle);

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {
            element.classList.add("js-reveal");
            revealObserver.observe(element);
        });
    }


    /* =========================
       6. SMOOTH INTERNAL LINKS
    ========================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            // Keep the URL hash in sync with the destination.
            if (history.replaceState) {
                history.replaceState(null, "", href);
            }
        });

    });


    /* =========================
       7. SERVICE CARD HOVER
       CSS handles the visual effect.
       No extra listeners needed.
    ========================= */

    console.log("AM Digital Studio About page initialized.");

});
```
