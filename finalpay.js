/* =========================================
   AM DIGITAL STUDIO
   FINAL PAYMENT PAGE
   FINALPAY.JS
========================================= */


/* =========================================
   PART 1 — LOAD ORDER DATA
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const orderData = {

        /* Customer Information */

        customerName:
            localStorage.getItem("customerName") || "",

        email:
            localStorage.getItem("customerEmail") || "",

        whatsapp:
            localStorage.getItem("customerWhatsApp") || "",

        country:
            localStorage.getItem("customerCountry") || "",


        /* Service Information */

        service:
            localStorage.getItem("serviceName") || "",

        package:
            localStorage.getItem("selectedPackage") || "",

        delivery:
            localStorage.getItem("selectedDelivery") || "",

        price:
            localStorage.getItem("selectedPrice") || "0",


        /* Project Information */

        projectTitle:
            localStorage.getItem("projectTitle") || "",

        projectDescription:
            localStorage.getItem("projectDescription") || ""

    };


    window.finalOrderData = orderData;


    console.log(
        "Final Payment Order Data:",
        orderData
    );


    fillOrderSummary(orderData);

});


/* =========================================
   PART 2 — HELPER FUNCTIONS
========================================= */

function cleanValue(
    value,
    fallback = "Not provided"
) {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {

        return fallback;

    }

    return String(value).trim();

}


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(price) {

    const numericPrice =
        Number(
            String(price)
                .replace(/[^0-9.]/g, "")
        );


    if (
        Number.isNaN(numericPrice) ||
        numericPrice <= 0
    ) {

        return "Rs.0/-";

    }


    return (
        "Rs." +
        numericPrice.toLocaleString("en-LK") +
        "/-"
    );

}


/* =========================================
   FORMAT PACKAGE
========================================= */

function formatPackage(packageName) {

    if (!packageName) {

        return "Not provided";

    }


    const name =
        String(packageName).trim();


    if (
        name.toLowerCase().includes("package")
    ) {

        return name;

    }


    return (
        name.charAt(0).toUpperCase() +
        name.slice(1).toLowerCase() +
        " Package"
    );

}


/* =========================================
   FORMAT DELIVERY
========================================= */

function formatDelivery(
    service,
    delivery
) {

    service =
        String(service || "").toLowerCase();

    delivery =
        String(delivery || "").toLowerCase();


    let days = 2;


    if (service === "video editing") {

        days =
            delivery === "express"
                ? 1
                : 2;

    }

    else if (service === "web development") {

        days =
            delivery === "express"
                ? 3
                : 7;

    }

    else if (
        service === "logo design" ||
        service === "poster design" ||
        service === "thumbnail design"
    ) {

        days =
            delivery === "express"
                ? 1
                : 2;

    }

    else if (service === "fiverr gig seo") {

        days =
            delivery === "express"
                ? 1
                : 2;

    }


    return (
        days +
        " Day" +
        (days > 1 ? "s" : "") +
        " Delivery"
    );

}


/* =========================================
   PART 3 — FILL ORDER SUMMARY
========================================= */

function fillOrderSummary(orderData) {

    const service =
        cleanValue(orderData.service);


    const packageName =
        formatPackage(
            orderData.package
        );


    const delivery =
        formatDelivery(
            service,
            orderData.delivery
        );


    const price =
        formatPrice(
            orderData.price
        );


    const summaryService =
        document.getElementById(
            "summaryService"
        );


    const summaryPackage =
        document.getElementById(
            "summaryPackage"
        );


    const summaryDelivery =
        document.getElementById(
            "summaryDelivery"
        );


    const summaryEstimatedPrice =
        document.getElementById(
            "summaryEstimatedPrice"
        );


    const summaryTotal =
        document.getElementById(
            "summaryTotal"
        );


    if (summaryService) {

        summaryService.textContent =
            service;

    }


    if (summaryPackage) {

        summaryPackage.textContent =
            packageName;

    }


    if (summaryDelivery) {

        summaryDelivery.textContent =
            delivery;

    }


    if (summaryEstimatedPrice) {

        summaryEstimatedPrice.textContent =
            price;

    }


    if (summaryTotal) {

        summaryTotal.textContent =
            price;

    }


    console.log(
        "Order Summary Loaded ✓"
    );

}


/* =========================================
   PART 4 — CREATE ORDER MESSAGE
========================================= */

function createOrderMessage() {

    const data =
        window.finalOrderData || {};


    const customerName =
        cleanValue(data.customerName);

    const email =
        cleanValue(data.email);

    const whatsapp =
        cleanValue(data.whatsapp);

    const country =
        cleanValue(data.country);

    const service =
        cleanValue(data.service);

    const packageName =
        formatPackage(data.package);

    const delivery =
        formatDelivery(
            service,
            data.delivery
        );

    const price =
        formatPrice(data.price);

    const projectTitle =
        cleanValue(data.projectTitle);

    const projectDescription =
        cleanValue(
            data.projectDescription
        );


    const message = `NEW ORDER REQUEST
==============================

CUSTOMER INFORMATION

Name: ${customerName}
Email: ${email}
WhatsApp: ${whatsapp}
Country: ${country}


SERVICE DETAILS

Service: ${service}
Package: ${packageName}
Delivery: ${delivery}


ORDER SUMMARY

Estimated Price: ${price}
Total Amount: ${price}


PROJECT INFORMATION

Project Title: ${projectTitle}

Project Description:
${projectDescription}


PAYMENT

Payment has been completed.

I will send the payment receipt
or payment confirmation screenshot
in this chat.


==============================

AM Digital Studio`;


    return message.trim();

}


/* =========================================
   PART 5 — COPY ORDER DETAILS
========================================= */

async function copyOrderDetails() {

    const message =
        createOrderMessage();


    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                message
            );

            console.log(
                "Order details copied successfully ✓"
            );

            return true;

        }


        throw new Error(
            "Clipboard API unavailable"
        );

    }

    catch (error) {

        console.log(
            "Using clipboard fallback..."
        );


        const textArea =
            document.createElement("textarea");


        textArea.value =
            message;


        textArea.style.position =
            "fixed";

        textArea.style.left =
            "-9999px";

        textArea.style.top =
            "0";


        document.body.appendChild(
            textArea
        );


        textArea.focus();
        textArea.select();


        try {

            const successful =
                document.execCommand("copy");


            document.body.removeChild(
                textArea
            );


            return successful;

        }

        catch (copyError) {

            document.body.removeChild(
                textArea
            );


            console.error(
                "Copy failed:",
                copyError
            );


            return false;

        }

    }

}


/* =========================================
   PART 6 — FACEBOOK MESSENGER
========================================= */

const FACEBOOK_PAGE_CHAT_URL =
    "https://m.me/amdigitalstudio01";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const goToChatBtn =
            document.getElementById("goToChatBtn");


        if (!goToChatBtn) {

            console.error(
                "Go To Chat button not found."
            );

            return;
        }


        goToChatBtn.addEventListener(
            "click",
            async () => {

                /*
                 * IMPORTANT:
                 * Copy BEFORE opening Messenger.
                 * This keeps the user's click gesture
                 * available for clipboard access.
                 */

                const copied =
                    await copyOrderDetails();


                if (!copied) {

                    showCopyFailedNotification();

                    return;
                }


                /*
                 * Show the green notification.
                 */

                showCopyNotification();


                /*
                 * Open Facebook Messenger
                 * after copying is completed.
                 */

                window.location.href =
                    FACEBOOK_PAGE_CHAT_URL;

            }
        );

    }
);

/* =========================================
   PART 7 — COPY SUCCESS NOTIFICATION
========================================= */

function showCopyNotification() {

    /*
     * Remove old notification
     * if one already exists.
     */

    const oldNotification =
        document.querySelector(
            ".copy-notification"
        );


    if (oldNotification) {

        oldNotification.remove();

    }


    const notification =
        document.createElement("div");


    notification.className =
        "copy-notification";


    notification.innerHTML = `

        <div class="copy-notification-icon">
            ✓
        </div>


        <div class="copy-notification-content">

            <h3>
                Order Details Copied!
            </h3>


            <p>
                Your complete order details are ready
                to paste into the Facebook chat.
            </p>


            <div class="paste-instructions">

                <div>

                    <strong>
                        💻 Computer
                    </strong>

                    <span>
                        Press <b>Ctrl + V</b>
                    </span>

                </div>


                <div>

                    <strong>
                        📱 Phone
                    </strong>

                    <span>
                        Press and hold the message box,
                        then tap <b>Paste</b>
                    </span>

                </div>

            </div>


            <p class="receipt-reminder">

                After pasting the order details,
                attach your payment receipt or
                payment screenshot and send the message.

            </p>

        </div>


        <button
            class="copy-notification-close"
            type="button"
            aria-label="Close">

            ×

        </button>

    `;


    document.body.appendChild(
        notification
    );


    /*
     * Show animation.
     */

    requestAnimationFrame(() => {

        notification.classList.add(
            "show"
        );

    });


    /*
     * Manual close only.
     */

    const closeButton =
        notification.querySelector(
            ".copy-notification-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                closeCopyNotification(
                    notification
                );

            }
        );

    }

}


/* =========================================
   CLOSE NOTIFICATION
========================================= */

function closeCopyNotification(
    notification
) {

    if (!notification) {

        return;

    }


    notification.classList.remove(
        "show"
    );


    setTimeout(() => {

        if (notification.parentNode) {

            notification.parentNode.removeChild(
                notification
            );

        }

    }, 400);

}


/* =========================================
   OPTIONAL COPY BUTTON
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const copyButton =
            document.getElementById(
                "copyOrderBtn"
            );


        if (!copyButton) {

            return;

        }


        copyButton.addEventListener(
            "click",
            async () => {

                const copied =
                    await copyOrderDetails();


                if (copied) {

                    showCopyNotification();

                }

            }
        );

    }
);


/* =========================================
   READY
========================================= */

console.log(
    "%cAM Digital Studio Final Payment Page Ready ✓",
    "font-size:16px;font-weight:bold;color:#1677ff;"
);
// ========================================
// PAGE LOADED
// ========================================

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});
