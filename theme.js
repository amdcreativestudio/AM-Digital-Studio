/* =========================================
   AM DIGITAL STUDIO
   DARK / LIGHT MODE
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("themeToggle");

    const icon = document.querySelector(".theme-icon");

    const text = document.querySelector(".theme-text");


    if (!toggle) return;


    /* =========================
       GET SAVED THEME
    ========================= */

    let savedTheme = localStorage.getItem("amds-theme");


    /* =========================
       DEFAULT THEME
    ========================= */

    if (!savedTheme) {

        savedTheme = "light";

    }


    /* =========================
       APPLY THEME
    ========================= */

    function applyTheme(theme) {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );


        if (theme === "dark") {

            icon.textContent = "☀";

            text.textContent = "Light Mode";

            toggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        } else {

            icon.textContent = "☾";

            text.textContent = "Dark Mode";

            toggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

        }


        localStorage.setItem(
            "amds-theme",
            theme
        );

    }


    /* =========================
       INITIAL THEME
    ========================= */

    applyTheme(savedTheme);


    /* =========================
       BUTTON CLICK
    ========================= */

    toggle.addEventListener("click", function () {

        const currentTheme =
            document.documentElement.getAttribute(
                "data-theme"
            );


        if (currentTheme === "dark") {

            applyTheme("light");

        } else {

            applyTheme("dark");

        }

    });

});
