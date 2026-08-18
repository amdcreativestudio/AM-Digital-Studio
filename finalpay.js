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
            localStorage.getItem("customerWhatsapp") || "",

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


    /* Continue processing */

    fillOrderSummary(orderData);

});


/* =========================================
   PART 2 — HELPER FUNCTIONS
========================================= */


/* Clean empty values */

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


/* Format price */

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


/* Format package */

function formatPackage(packageName) {

    if (!packageName) {

        return "Not provided";

    }


    return (
        packageName.charAt(0).toUpperCase() +
        packageName.slice(1).toLowerCase() +
        " Package"
    );

}


/* Format delivery */

function formatDelivery(
    service,
    delivery
) {

    service =
        String(service).toLowerCase();

    delivery =
        String(delivery).toLowerCase();


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


    /* Service */

    const summaryService =
        document.getElementById(
            "summaryService"
        );

    if (summaryService) {

        summaryService.textContent =
            service;

    }


    /* Package */

    const summaryPackage =
        document.getElementById(
            "summaryPackage"
        );

    if (summaryPackage) {

        summaryPackage.textContent =
            packageName;

    }


    /* Delivery */

    const summaryDelivery =
        document.getElementById(
            "summaryDelivery"
        );

    if (summaryDelivery) {

        summaryDelivery.textContent =
            delivery;

    }


    /* Estimated Price */

    const summaryEstimatedPrice =
        document.getElementById(
            "summaryEstimatedPrice"
        );

    if (summaryEstimatedPrice) {

        summaryEstimatedPrice.textContent =
            price;

    }


    /* Total */

    const summaryTotal =
        document.getElementById(
            "summaryTotal"
        );

    if (summaryTotal) {

        summaryTotal.textContent =
            price;

    }

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


    const message = `

NEW ORDER REQUEST
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

AM Digital Studio

`;


    return message.trim();

}


/* =========================================
   PART 5 — COPY ORDER DETAILS
========================================= */

async function copyOrderDetails() {

    const message =
        createOrderMessage();


    try {

        await navigator.clipboard.writeText(
            message
        );


        console.log(
            "Order details copied successfully."
        );


        return true;

    }

    catch (error) {

        /* Clipboard fallback */

        const textArea =
            document.createElement(
                "textarea"
            );


        textArea.value =
            message;


        textArea.style.position =
            "fixed";

        textArea.style.left =
            "-9999px";


        document.body.appendChild(
            textArea
        );


        textArea.focus();

        textArea.select();


        try {

            document.execCommand("copy");


            document.body.removeChild(
                textArea
            );


            return true;

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


/*
 * IMPORTANT:
 * Replace YOUR_PAGE_USERNAME
 * with your actual Facebook Page username.
 *
 * Example:
 *
 * https://m.me/AMDigitalStudio
 *
 */

const FACEBOOK_PAGE_CHAT_URL =
    "https://m.me/amdigitalstudio01";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const goToChatBtn =
            document.getElementById(
                "goToChatBtn"
            );


        if (!goToChatBtn) {

            return;

        }


        goToChatBtn.addEventListener(
            "click",
            async () => {


                /* Copy order details */

                const copied =
                    await copyOrderDetails();


                /* Open Messenger */

                window.open(
                    FACEBOOK_PAGE_CHAT_URL,
                    "_blank"
                );


                /* User instruction */
if (copied) {

    setTimeout(() => {

        showCopyNotification();

    }, 700);

}

                else {

                    alert(
                        "Please copy your order details manually " +
                        "and send them in the Facebook chat."
                    );

                }

            }
        );

    }
);


/* =========================================
   PART 7 — OPTIONAL COPY BUTTON
========================================= */


/*
 * If you later add a button with:
 *
 * id="copyOrderBtn"
 *
 * this code will automatically make it work.
 */

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

                    alert(
                        "Order details copied successfully. " +
                        "You can now paste them into the chat."
                    );

                }

            }
        );

    }
);


/* =========================================
   END
========================================= */

console.log(
    "%cAM Digital Studio Final Payment Page Ready ✓",
    "font-size:16px;font-weight:bold;color:#1677ff;"
);
/* =========================================
   COPY SUCCESS NOTIFICATION
========================================= */

function showCopyNotification() {

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
                    <strong>💻 Computer</strong>
                    <span>Press <b>Ctrl + V</b></span>
                </div>

                <div>
                    <strong>📱 Phone</strong>
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


    /* Show animation */

    setTimeout(() => {

        notification.classList.add(
            "show"
        );

    }, 20);


    /* Close button */

    const closeButton =
        notification.querySelector(
            ".copy-notification-close"
        );


    closeButton.addEventListener(
        "click",
        () => {

            closeCopyNotification(
                notification
            );

        }
    );


    /* Automatically disappear */

    setTimeout(() => {

        closeCopyNotification(
            notification
        );

    }, 9000);

}


/* =========================================
   CLOSE NOTIFICATION
========================================= */

function closeCopyNotification(
    notification
) {

    if (!notification) return;


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
