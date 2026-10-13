/* =====================================================
   RANA TYPING
   Main JavaScript
   ===================================================== */


/* =====================================================
   BUSINESS CONFIGURATION

   IMPORTANT:
   Replace the values below with your actual details.

   Example:
   phone: "919876543210"

   Do NOT put +, spaces or hyphens in WhatsApp number.
   ===================================================== */

const BUSINESS = {

  name: "Rana Typing",

  phone: "+917209366125",

  whatsapp: "917209366125",

  email: "deepanshukumar03@gmail.com",

  address:
    "Gate No. 02, Civil Court, Hazaribag, Jharkhand, India"

};


/* =====================================================
   MOBILE MENU
   ===================================================== */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

  menuToggle.addEventListener("click", () => {

    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });


  // Close menu when navigation link is clicked

  mainNav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}


/* =====================================================
   FAQ ACCORDION
   ===================================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {

    const alreadyOpen = item.classList.contains("active");


    // Close all

    faqItems.forEach(otherItem => {
      otherItem.classList.remove("active");
    });


    // Open clicked item

    if (!alreadyOpen) {
      item.classList.add("active");
    }

  });

});


/* =====================================================
   SCROLL REVEAL
   ===================================================== */

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          revealObserver.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12
    }
  );


revealElements.forEach(element => {

  revealObserver.observe(element);

});


/* =====================================================
   CURRENT YEAR
   ===================================================== */

const currentYear =
  document.getElementById("currentYear");

if (currentYear) {

  currentYear.textContent =
    new Date().getFullYear();

}


/* =====================================================
   CONTACT DETAILS
   ===================================================== */

const phoneDisplay =
  document.getElementById("phoneDisplay");

const emailDisplay =
  document.getElementById("emailDisplay");


if (BUSINESS.phone) {

  if (phoneDisplay) {

    phoneDisplay.innerHTML =
      `<a href="tel:${BUSINESS.phone}">
        ${BUSINESS.phone}
      </a>`;

  }

}


if (BUSINESS.email) {

  if (emailDisplay) {

    emailDisplay.innerHTML =
      `<a href="mailto:${BUSINESS.email}">
        ${BUSINESS.email}
      </a>`;

  }

}


/* =====================================================
   WHATSAPP
   ===================================================== */

function setupWhatsApp(buttonId) {

  const button =
    document.getElementById(buttonId);

  if (!button) return;


  if (!BUSINESS.whatsapp) {

    button.addEventListener("click", event => {

      event.preventDefault();

      alert(
        "WhatsApp number has not been added yet. Please update the BUSINESS.whatsapp value in script.js."
      );

    });

    return;
  }


  const message =
    encodeURIComponent(
      "Hello Rana Typing, I would like to know about your services."
    );


  button.href =
    `https://wa.me/${BUSINESS.whatsapp}?text=${message}`;

  button.target = "_blank";
  button.rel = "noopener noreferrer";

}


setupWhatsApp("whatsappButton");
setupWhatsApp("mobileWhatsApp");


/* =====================================================
   PHONE CLICK SUPPORT
   ===================================================== */

if (BUSINESS.phone) {

  document.querySelectorAll("[data-phone]")
    .forEach(element => {

      element.href =
        `tel:${BUSINESS.phone}`;

    });

}


/* =====================================================
   ACTIVE NAVIGATION
   ===================================================== */

const sections =
  document.querySelectorAll("main section[id]");

const navigationLinks =
  document.querySelectorAll(".main-nav a");


const sectionObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          navigationLinks.forEach(link => {

            link.classList.remove("active");

            if (
              link.getAttribute("href") ===
              `#${entry.target.id}`
            ) {

              link.classList.add("active");

            }

          });

        }

      });

    },
    {
      threshold: 0.35
    }
  );


sections.forEach(section => {

  sectionObserver.observe(section);

});

/* =========================================
   PREMIUM GALLERY SLIDER
========================================= */

const slides = document.querySelectorAll(".premium-slide");
const dots = document.querySelectorAll(".gallery-dot");

const previousButton = document.querySelector(".gallery-prev");
const nextButton = document.querySelector(".gallery-next");

const progressBar = document.querySelector(".gallery-progress-bar");

let currentSlide = 0;

const slideDuration = 5000;

let autoSlide;


/* Show slide */

function showSlide(index) {

  if (index >= slides.length) {
    index = 0;
  }

  if (index < 0) {
    index = slides.length - 1;
  }

  currentSlide = index;


  /* Slides */

  slides.forEach((slide, i) => {

    slide.classList.toggle(
      "active",
      i === currentSlide
    );

  });


  /* Dots */

  dots.forEach((dot, i) => {

    dot.classList.toggle(
      "active",
      i === currentSlide
    );

  });


  /* Restart progress animation */

  if (progressBar) {

    progressBar.style.animation = "none";

    void progressBar.offsetWidth;

    progressBar.style.animation =
      `galleryProgress ${slideDuration}ms linear`;

  }

}


/* Next */

function nextSlide() {

  showSlide(currentSlide + 1);

}


/* Previous */

function previousSlide() {

  showSlide(currentSlide - 1);

}


/* Automatic slideshow */

function startAutoSlide() {

  clearInterval(autoSlide);

  autoSlide = setInterval(
    nextSlide,
    slideDuration
  );

}


/* Next button */

if (nextButton) {

  nextButton.addEventListener(
    "click",
    () => {

      nextSlide();

      startAutoSlide();

    }
  );

}


/* Previous button */

if (previousButton) {

  previousButton.addEventListener(
    "click",
    () => {

      previousSlide();

      startAutoSlide();

    }
  );

}


/* Dots */

dots.forEach((dot, index) => {

  dot.addEventListener(
    "click",
    () => {

      showSlide(index);

      startAutoSlide();

    }
  );

});


/* Start */

showSlide(0);

startAutoSlide();


/* Back to Top — reliable click handling */

const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

const dropdownBtn =
  document.querySelector(".dropdown-btn");

const dropdownMenu =
  document.querySelector(".dropdown-menu");

if (dropdownBtn && dropdownMenu) {

  dropdownBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {

    if (
      !dropdownBtn.contains(event.target) &&
      !dropdownMenu.contains(event.target)
    ) {
      dropdownMenu.classList.remove("show");
    }

  });

}
