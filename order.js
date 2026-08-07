
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
// Service + Package + Price
// ========================================


// ===============================
// Elements
// ===============================

const serviceInput = document.getElementById("serviceName");

const packageSelect = document.getElementById("package");

const summaryService = document.getElementById("summaryService");

const summaryPackage = document.getElementById("summaryPackage");

const summaryPrice = document.getElementById("summaryPrice");

const totalPrice = document.getElementById("totalPrice");


// ===============================
// Package Prices
// ===============================

const packagePrices = {

    Basic:10,

    Standard:25,

    Premium:50

};


// ===============================
// Load Service
// ===============================

const savedService = localStorage.getItem("serviceName");

if(savedService){

    serviceInput.value = savedService;

    summaryService.textContent = savedService;

}


// ===============================
// Update Package
// ===============================

function updateOrderSummary(){

    const selectedPackage = packageSelect.value;

    const price = packagePrices[selectedPackage];

    summaryPackage.textContent =

        selectedPackage + " Package";

    summaryPrice.textContent =

        "$" + price;

    totalPrice.textContent =

        "$" + price;

}


// First Load

updateOrderSummary();


// Package Change

packageSelect.addEventListener(

    "change",

    updateOrderSummary

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
