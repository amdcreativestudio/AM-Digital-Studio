
// ========================================
// AM Digital Studio
// order.js - Part 1
// Navigation + Global Functions
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
// Close Mobile Menu
// ===============================

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        if(menuToggle){

            menuToggle.classList.remove("active");

        }

        if(navLinks){

            navLinks.classList.remove("active");

        }

    });

});


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
// Page Loaded
// ===============================

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});


// ===============================
// Console
// ===============================

console.log(
    "%cAM Digital Studio Order Page",
    "font-size:18px;font-weight:bold;color:#1677ff;"
);
// ========================================
// order.js - Part 2
// Automatic Service + Package + Price
// ========================================


// ===============================
// Elements
// ===============================

const serviceInput =
    document.getElementById("serviceName");

const packageSelect =
    document.getElementById("package");

const summaryService =
    document.getElementById("summaryService");

const summaryPackage =
    document.getElementById("summaryPackage");

const summaryPrice =
    document.getElementById("summaryPrice");

const totalPrice =
    document.getElementById("totalPrice");
const deliverySelect =
    document.getElementById("delivery");

const summaryDelivery =
    document.getElementById("summaryDelivery");

// ===============================
// Read Order URL
// ===============================

const orderParams =
    new URLSearchParams(window.location.search);


// ===============================
// Get Selected Data
// ===============================

const urlService =
    orderParams.get("service");

const urlPackage =
    orderParams.get("package");

const urlPrice =
    orderParams.get("price");


// ===============================
// Service Name Formatter
// ===============================

function formatServiceName(service) {

    if (!service) return "";

    const serviceNames = {

        "video-editing":
            "Video Editing",

        "logo-design":
            "Logo Design",

        "poster-design":
            "Poster Design",

        "thumbnail-design":
            "Thumbnail Design",

        "web-development":
            "Web Development",

        "fiverr-seo":
            "Fiverr Gig SEO"

    };

    return serviceNames[service] || service;

}


// ===============================
// Package Formatter
// ===============================

function formatPackageName(packageName) {

    if (!packageName) return "";

    return (
        packageName.charAt(0).toUpperCase() +
        packageName.slice(1).toLowerCase()
    );

}


// ===============================
// Final Selected Values
// ===============================

let selectedService =
    urlService;

let selectedPackage =
    urlPackage;

let selectedPrice =
    urlPrice;


// ===============================
// Fallback - LocalStorage
// ===============================

if (!selectedService) {

    selectedService =
        localStorage.getItem("serviceName");

}

if (!selectedPackage) {

    selectedPackage =
        localStorage.getItem("selectedPackage");

}

if (!selectedPrice) {

    selectedPrice =
        localStorage.getItem("selectedPrice");

}


// ===============================
// Format Values
// ===============================

const displayService =
    formatServiceName(selectedService);

const displayPackage =
    formatPackageName(selectedPackage);


// ===============================
// Set Service
// ===============================

if (serviceInput && displayService) {

    serviceInput.value =
        displayService;

}


if (summaryService && displayService) {

    summaryService.textContent =
        displayService;

}


// ===============================
// Set Package Select
// ===============================

if (packageSelect && selectedPackage) {

    const packageValue =
        formatPackageName(selectedPackage);

    const optionExists =
        [...packageSelect.options].some(
            option =>
                option.value === packageValue
        );

    if (optionExists) {

        packageSelect.value =
            packageValue;

    }

}


// ===============================
// Update Summary
// ===============================

function updateOrderSummary() {

    const currentPackage =
        packageSelect
            ? packageSelect.value
            : displayPackage;

    let currentPrice =
        selectedPrice;
let deliveryDays = 2;
let deliveryExtra = 0;

    // If user manually changes package,
    // calculate the correct price for
    // the selected service.

    const service =
        displayService.toLowerCase();


    const packageName =
        currentPackage.toLowerCase();


    // ===============================
    // Video Editing
    // ===============================

    if (service === "video editing") {

        if (packageName === "basic") {

            currentPrice = 3300;

        }

        else if (packageName === "standard") {

            currentPrice = 8300;

        }

        else if (packageName === "premium") {

            currentPrice = 12500;

        }

    }


    // ===============================
    // Logo Design
    // ===============================

    else if (service === "logo design") {

        if (packageName === "basic") {

            currentPrice = 2500;

        }

        else if (packageName === "standard") {

            currentPrice = 4750;

        }

        else if (packageName === "premium") {

            currentPrice = 6200;

        }

    }


    // ===============================
    // Poster Design
    // ===============================

    else if (service === "poster design") {

        if (packageName === "basic") {

            currentPrice = 1700;

        }

        else if (packageName === "standard") {

            currentPrice = 2850;

        }

        else if (packageName === "premium") {

            currentPrice = 3600;

        }

    }


    // ===============================
    // Thumbnail Design
    // ===============================

    else if (service === "thumbnail design") {

        if (packageName === "basic") {

            currentPrice = 1800;

        }

        else if (packageName === "standard") {

            currentPrice = 2600;

        }

        else if (packageName === "premium") {

            currentPrice = 3300;

        }

    }


    // ===============================
    // Web Development
    // ===============================

    else if (service === "web development") {

        if (packageName === "basic") {

            currentPrice = 25000;

        }

        else if (packageName === "standard") {

            currentPrice = 46000;

        }

        else if (packageName === "premium") {

            currentPrice = 125000;

        }

    }


    // ===============================
    // Fiverr Gig SEO
    // ===============================

    else if (service === "fiverr gig seo") {

        if (packageName === "basic") {

            currentPrice = 4300;

        }

        else if (packageName === "standard") {

            currentPrice = 8200;

        }

        else if (packageName === "premium") {

            currentPrice = 11500;

        }

    }

// ===============================
// Service Delivery Settings
// ===============================

if (service === "video editing") {

    if (deliverySelect.value === "express") {
        deliveryDays = 1;
        deliveryExtra = 1000;
    } else {
        deliveryDays = 2;
        deliveryExtra = 0;
    }

}

else if (service === "web development") {

    if (deliverySelect.value === "express") {
        deliveryDays = 3;
        deliveryExtra = 5000;
    } else {
        deliveryDays = 7;
        deliveryExtra = 0;
    }

}

else if (
    service === "logo design" ||
    service === "poster design" ||
    service === "thumbnail design"
) {

    if (deliverySelect.value === "express") {
        deliveryDays = 1;
        deliveryExtra = 500;
    } else {
        deliveryDays = 2;
        deliveryExtra = 0;
    }

}

else if (service === "fiverr gig seo") {

    if (deliverySelect.value === "express") {
        deliveryDays = 1;
        deliveryExtra = 750;
    } else {
        deliveryDays = 2;
        deliveryExtra = 0;
    }

}
    // ===============================
    // Display Package
    // ===============================

    if (summaryPackage) {

        summaryPackage.textContent =
            currentPackage + " Package";

    }


    // ===============================
    // Display Price
    // ===============================

  // ===============================
// Final Price + Delivery
// ===============================

const finalPrice =
    Number(currentPrice) + deliveryExtra;


if (summaryDelivery) {

    summaryDelivery.textContent =
        deliveryDays + " Day" +
        (deliveryDays > 1 ? "s" : "") +
        " Delivery";

}


if (summaryPrice) {

    summaryPrice.textContent =
        "Rs." + currentPrice + "/-";

}


if (totalPrice) {

    totalPrice.textContent =
        "Rs." + finalPrice + "/-";

}


    // ===============================
    // Save Current Selection
    // ===============================

    localStorage.setItem(
        "serviceName",
        displayService
    );

    localStorage.setItem(
        "selectedPackage",
        currentPackage
    );

 localStorage.setItem(
    "selectedPrice",
    finalPrice
);
}


// ===============================
// Initial Load
// ===============================

updateOrderSummary();


// ===============================
// Package Change
// ===============================

if (packageSelect) {

    packageSelect.addEventListener(
        "change",
        updateOrderSummary
    );

}

// ===============================
// Delivery Change
// ===============================

if (deliverySelect) {

    deliverySelect.addEventListener(
        "change",
        updateOrderSummary
    );

}
// ===============================
// Console
// ===============================

console.log(
    "%cOrder Selection Loaded ✓",
    "font-size:16px;font-weight:bold;color:#1677ff;"
);
// ========================================
// order.js - Part 3
// Form Validation + Checkout
// ========================================


// ===============================
// Elements
// ===============================

const orderForm = document.getElementById("orderForm");

const checkoutBtn = document.getElementById("checkoutBtn");

const agreeTerms = document.getElementById("agreeTerms");

const loading = document.getElementById("paymentLoading");

const successModal = document.getElementById("successModal");

const continuePayment = document.getElementById("continuePayment");

const closeSuccess = document.getElementById("closeSuccess");


// ===============================
// Checkout Button
// ===============================

checkoutBtn.addEventListener("click", (e) => {

    e.preventDefault();

    // Check Required Fields

    if(!orderForm.checkValidity()){

        orderForm.reportValidity();

        return;

    }

    // Check Terms

    if(!agreeTerms.checked){

        alert("Please accept the Terms & Conditions.");

        return;

    }

    // Show Loading

    loading.classList.add("active");

    // Fake Processing

    setTimeout(() => {

        loading.classList.remove("active");

        successModal.classList.add("active");

    },2000);

});

// ===============================
// Continue Payment
// ===============================

if (continuePayment) {

    continuePayment.addEventListener("click", () => {

        // ===============================
        // Save Customer Information
        // ===============================

        localStorage.setItem(
            "customerName",
            document.getElementById("fullName")?.value.trim() || ""
        );

        localStorage.setItem(
            "customerEmail",
            document.getElementById("email")?.value.trim() || ""
        );

        localStorage.setItem(
            "customerWhatsApp",
            document.getElementById("phone")?.value.trim() || ""
        );

        localStorage.setItem(
            "customerCountry",
            document.getElementById("country")?.value.trim() || ""
        );


        // ===============================
        // Save Project Information
        // ===============================

        localStorage.setItem(
            "projectTitle",
            document.getElementById("projectTitle")?.value.trim() || ""
        );

        localStorage.setItem(
            "projectDescription",
            document.getElementById("description")?.value.trim() || ""
        );


        // ===============================
        // Save Delivery
        // ===============================

        localStorage.setItem(
            "selectedDelivery",
            deliverySelect?.value || "standard"
        );


        // ===============================
        // Close Modal
        // ===============================

        successModal.classList.remove("active");


        // ===============================
        // Open Final Payment Page
        // ===============================

        window.location.href = "finalpay.html";

    });

}

// ===============================
// Close Modal
// ===============================

closeSuccess.addEventListener("click", () => {

    successModal.classList.remove("active");

});


// ===============================
// Outside Click
// ===============================

successModal.addEventListener("click",(e)=>{

    if(e.target===successModal){

        successModal.classList.remove("active");

    }

});
// ========================================
// order.js - Part 4
// Back To Top + File Upload + Final
// ========================================


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
// File Upload Preview
// ===============================

const projectFiles = document.getElementById("projectFiles");

if(projectFiles){

    projectFiles.addEventListener("change", () => {

        const count = projectFiles.files.length;

        if(count > 0){

            alert(count + " file(s) selected successfully.");

        }

    });

}




// ===============================
// ESC Key Close Modal
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        if(successModal){

            successModal.classList.remove("active");

        }

    }

});


// ===============================
// Console
// ===============================

console.log(

    "%cOrder Page Ready",

    "font-size:16px;color:green;font-weight:bold;"

);


// ========================================
// End of order.js
// ========================================
