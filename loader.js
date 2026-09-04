/* =========================================
   AM DIGITAL STUDIO
   GLOBAL PREMIUM PAGE LOADER
========================================= */

(function () {

    /* =====================================
       CREATE LOADER
    ===================================== */

    const loader = document.createElement("div");

    loader.id = "globalPageLoader";

    loader.innerHTML = `

        <div class="global-loader-content">

          <div class="global-loader-logo">
    <img src="https://raw.githubusercontent.com/amdcreativestudio/AM-Digital-Studio/main/wdf.png" alt="AM Digital Studio">
</div>

            <div class="global-loader-ring"></div>

            <div class="global-loader-title">
                AM DIGITAL STUDIO
            </div>

            <div class="global-loader-text">
                Loading...
            </div>

        </div>

    `;

    document.documentElement.appendChild(loader);


    /* =====================================
       LOADER CSS
    ===================================== */

    const style = document.createElement("style");

    style.textContent = `

        #globalPageLoader {

            position: fixed;

            inset: 0;

            width: 100%;
            height: 100vh;

            background: #05070d;

            display: flex;

            align-items: center;
            justify-content: center;

            z-index: 999999999;

            opacity: 1;

            visibility: visible;

            transition:
                opacity .6s ease,
                visibility .6s ease;

        }


        #globalPageLoader.loader-hidden {

            opacity: 0;

            visibility: hidden;

            pointer-events: none;

        }


        .global-loader-content {

            text-align: center;

            font-family:
                Arial,
                sans-serif;

        }


        .global-loader-logo {

            width: 82px;
            height: 82px;

            margin: 0 auto 22px;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: 24px;

            color: white;

            font-size: 30px;

            font-weight: 900;

            background:
                linear-gradient(
                    135deg,
                    #1677ff,
                    #00c6ff,
                    #6d5dfc
                );

            box-shadow:
                0 0 40px
                rgba(22,119,255,.45);

            animation:
                globalLoaderPulse
                2s ease-in-out infinite;

        }


        .global-loader-ring {

            width: 42px;
            height: 42px;

            margin: 0 auto 22px;

            border-radius: 50%;

            border:
                3px solid
                rgba(255,255,255,.12);

            border-top-color:
                #1677ff;

            border-right-color:
                #00c6ff;

            animation:
                globalLoaderSpin
                1s linear infinite;

        }


        .global-loader-title {

            color: white;

            font-size: 17px;

            font-weight: 700;

            letter-spacing: 3px;

            margin-bottom: 8px;

        }


        .global-loader-text {

            color:
                rgba(255,255,255,.55);

            font-size: 13px;

            letter-spacing: 1px;

        }


        @keyframes globalLoaderSpin {

            to {

                transform:
                    rotate(360deg);

            }

        }


        @keyframes globalLoaderPulse {

            0%,
            100% {

                transform:
                    scale(1);

            }

            50% {

                transform:
                    scale(1.06);

            }

        }


        @media (max-width: 768px) {

            .global-loader-logo {

                width: 70px;
                height: 70px;

                font-size: 25px;

            }


            .global-loader-title {

                font-size: 14px;

                letter-spacing: 2px;

            }

        }

    `;

    document.head.appendChild(style);


    /* =====================================
       HIDE LOADER AFTER PAGE LOAD
    ===================================== */

    window.addEventListener("load", function () {

        setTimeout(function () {

            loader.classList.add(
                "loader-hidden"
            );

        }, 600);

    });


    /* =====================================
       PAGE NAVIGATION LOADING
    ===================================== */

    document.addEventListener(
        "click",
        function (event) {

            const link =
                event.target.closest("a");

            if (!link) return;


            const href =
                link.getAttribute("href");

            if (!href) return;


            /* Ignore special links */

            if (
                href.startsWith("#") ||
                href.startsWith("http") ||
                href.startsWith("//") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:") ||
                link.target === "_blank" ||
                link.hasAttribute("download")
            ) {

                return;

            }


            /* Ignore javascript links */

            if (
                href.startsWith("javascript:")
            ) {

                return;

            }


            /* Show loader */

            loader.classList.remove(
                "loader-hidden"
            );

        }

    );


})();
