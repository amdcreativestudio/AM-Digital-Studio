/* =========================================
   FINAL PAYMENT PAGE
   PART 1 — LOAD ORDER DATA
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
     * Order data is stored by order.js
     * before the user reaches this page.
     */

    const orderData = {

        customerName:
            localStorage.getItem("customerName") || "",

        email:
            localStorage.getItem("customerEmail") || "",

        whatsapp:
            localStorage.getItem("customerWhatsapp") || "",

        country:
            localStorage.getItem("customerCountry") || "",

        service:
            localStorage.getItem("selectedService") || "",

        package:
            localStorage.getItem("selectedPackage") || "",

        delivery:
            localStorage.getItem("selectedDelivery") || "",

        price:
            localStorage.getItem("selectedPrice") || "0"

    };


    /*
     * Make the data available to the
     * remaining parts of finalpay.js.
     */

    window.finalOrderData = orderData;


    console.log(
        "Final Payment Order Data:",
        orderData
    );

});
/* =========================================
   PART 2 — PROCESS ORDER DATA
========================================= */

const orderData = window.finalOrderData;


/*
 * Clean a value before displaying it.
 */

function cleanValue(value, fallback = "Not provided") {

    if (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return String(value).trim();

}


/*
 * Format the price as Sri Lankan Rupees.
 */

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


/*
 * Prepare the final order information.
 */

const customerName =
    cleanValue(orderData.customerName);

const customerEmail =
    cleanValue(orderData.email);

const customerWhatsapp =
    cleanValue(orderData.whatsapp);

const customerCountry =
    cleanValue(orderData.country);

const selectedService =
    cleanValue(orderData.service);

const selectedPackage =
    cleanValue(orderData.package);

const selectedDelivery =
    cleanValue(orderData.delivery);

const selectedPrice =
    formatPrice(orderData.price);


/*
 * Make processed values available
 * to the remaining JavaScript parts.
 */

window.processedOrder = {

    customerName,
    customerEmail,
    customerWhatsapp,
    customerCountry,

    selectedService,
    selectedPackage,
    selectedDelivery,
    selectedPrice

};
/* =========================================
   PART 3 — FILL ORDER SUMMARY
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const data = window.processedOrder;


    /*
     * Get summary elements
     */

    const summaryService =
        document.getElementById("summaryService");

    const summaryPackage =
        document.getElementById("summaryPackage");

    const summaryDelivery =
        document.getElementById("summaryDelivery");

    const summaryEstimatedPrice =
        document.getElementById(
            "summaryEstimatedPrice"
        );

    const summaryTotal =
        document.getElementById("summaryTotal");


    /*
     * Display service
     */

    if (summaryService) {

        summaryService.textContent =
            data.selectedService;

    }


    /*
     * Display package
     */

    if (summaryPackage) {

        summaryPackage.textContent =
            data.selectedPackage;

    }


    /*
     * Display delivery
     */

    if (summaryDelivery) {

        summaryDelivery.textContent =
            data.selectedDelivery;

    }


    /*
     * Display estimated price
     */

    if (summaryEstimatedPrice) {

        summaryEstimatedPrice.textContent =
            data.selectedPrice;

    }


    /*
     * Display final total
     */

    if (summaryTotal) {

        summaryTotal.textContent =
            data.selectedPrice;

    }

});
/* =========================================
   PART 4 — CREATE ORDER MESSAGE
========================================= */

function createOrderMessage() {

    const data = window.processedOrder;

    const message = `
NEW ORDER REQUEST
==============================

CUSTOMER INFORMATION

Name: ${data.customerName}
Email: ${data.customerEmail}
WhatsApp: ${data.customerWhatsapp}
Country: ${data.customerCountry}


SERVICE DETAILS

Service: ${data.selectedService}
Package: ${data.selectedPackage}
Delivery: ${data.selectedDelivery}


ORDER SUMMARY

Total Amount: ${data.selectedPrice}


PAYMENT

Payment has been made.

The payment receipt / payment screenshot
will be attached in this chat.


==============================

Thank you.
AM Digital Studio
`;

    return message.trim();

}


/* =========================================
   COPY ORDER DETAILS
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

    } catch (error) {

        /*
         * Fallback for browsers where
         * Clipboard API is unavailable.
         */

        const textArea =
            document.createElement("textarea");

        textArea.value = message;

        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);

        textArea.select();

        try {

            document.execCommand("copy");

            document.body.removeChild(
                textArea
            );

            return true;

        } catch (copyError) {

            document.body.removeChild(
                textArea
            );

            console.error(
                "Unable to copy order details:",
                copyError
            );

            return false;
        }

    }

}


/*
 * Make the function available to
 * Part 5.
 */

window.createOrderMessage =
    createOrderMessage;

window.copyOrderDetails =
    copyOrderDetails;
/* =========================================
   PART 5 — GO TO FACEBOOK CHAT
========================================= */

/*
 * Replace this with your actual
 * Facebook Page Messenger link.
 *
 * Example:
 * https://m.me/YourPageUsername
 */

const FACEBOOK_PAGE_CHAT_URL =
    "https://m.me/YOUR_PAGE_USERNAME";


const goToChatBtn =
    document.getElementById("goToChatBtn");


if (goToChatBtn) {

    goToChatBtn.addEventListener(
        "click",
        async () => {

            /*
             * Create the order message.
             */

            const message =
                window.createOrderMessage();


            /*
             * Copy the complete order details
             * before opening Messenger.
             */

            const copied =
                await window.copyOrderDetails();


            /*
             * Open Facebook Messenger.
             */

            window.open(
                FACEBOOK_PAGE_CHAT_URL,
                "_blank"
            );


            /*
             * Tell the user what to do next.
             */

            if (copied) {

                setTimeout(() => {

                    alert(
                        "Your order details have been copied. " +
                        "Paste them in the chat, then attach " +
                        "your payment receipt or screenshot " +
                        "and send the message."
                    );

                }, 700);

            }

        }
    );

}
