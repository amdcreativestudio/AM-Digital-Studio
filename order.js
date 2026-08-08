
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

            currentPrice = 10;

        }

        else if (packageName === "standard") {

            currentPrice = 45;

        }

        else if (packageName === "premium") {

            currentPrice = 95;

        }

    }


    // ===============================
    // Logo Design
    // ===============================

    else if (service === "logo design") {

        if (packageName === "basic") {

            currentPrice = 15;

        }

        else if (packageName === "standard") {

            currentPrice = 35;

        }

        else if (packageName === "premium") {

            currentPrice = 70;

        }

    }


    // ===============================
    // Poster Design
    // ===============================

    else if (service === "poster design") {

        if (packageName === "basic") {

            currentPrice = 10;

        }

        else if (packageName === "standard") {

            currentPrice = 25;

        }

        else if (packageName === "premium") {

            currentPrice = 50;

        }

    }


    // ===============================
    // Thumbnail Design
    // ===============================

    else if (service === "thumbnail design") {

        if (packageName === "basic") {

            currentPrice = 10;

        }

        else if (packageName === "standard") {

            currentPrice = 25;

        }

        else if (packageName === "premium") {

            currentPrice = 50;

        }

    }


    // ===============================
    // Web Development
    // ===============================

    else if (service === "web development") {

        if (packageName === "basic") {

            currentPrice = 50;

        }

        else if (packageName === "standard") {

            currentPrice = 100;

        }

        else if (packageName === "premium") {

            currentPrice = 200;

        }

    }


    // ===============================
    // Fiverr Gig SEO
    // ===============================

    else if (service === "fiverr gig seo") {

        if (packageName === "basic") {

            currentPrice = 10;

        }

        else if (packageName === "standard") {

            currentPrice = 25;

        }

        else if (packageName === "premium") {

            currentPrice = 50;

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

    if (summaryPrice) {

        summaryPrice.textContent =
            "Rs." + currentPrice + "/-";

    }


    if (totalPrice) {

        totalPrice.textContent =
            "Rs." + currentPrice + "/-";

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
        currentPrice
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

continuePayment.addEventListener("click", () => {

    alert("Payment Gateway Coming Soon!");

    successModal.classList.remove("active");

});


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
// Coupon Button
// ===============================

const couponButton = document.querySelector(".coupon-input button");

if(couponButton){

    couponButton.addEventListener("click", () => {

        const coupon = document.getElementById("coupon").value.trim();

        if(coupon === ""){

            alert("Please enter a coupon code.");

            return;

        }

        alert("Coupon system will be available soon.");

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
