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

/* Small image preview shared by Achievements and Rana Typing in Pictures. */
function openPhotoViewer(image) {
  const dialog = document.getElementById("photoViewerDialog");
  const preview = document.getElementById("photoViewerImage");
  const caption = document.getElementById("photoViewerCaption");
  if (!dialog || !preview || !image) return;

  preview.src = image.currentSrc || image.src;
  preview.alt = image.alt || "Rana Typing photo";
  if (caption) caption.textContent = image.alt || "";
  if (!dialog.open) dialog.showModal();
}

(() => {
  const dialog = document.getElementById("photoViewerDialog");
  const close = document.getElementById("photoViewerClose");
  if (!dialog) return;

  close?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll(".premium-gallery .premium-slide img").forEach(image => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", "Open photo: " + (image.alt || "Rana Typing photo"));
    image.closest(".premium-slide")?.addEventListener("click", () => openPhotoViewer(image));
    image.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPhotoViewer(image);
      }
    });
  });
})();

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

/* Achievement carousel: layered 2D loop, without rotating the photos themselves. */
(() => {
  const gallery = document.querySelector('[data-achievement-gallery]');
  const viewport = gallery?.querySelector('[data-achievement-viewport]');
  const track = gallery?.querySelector('[data-achievement-track]');
  if (!gallery || !viewport || !track) return;

  const originals = [...track.children];
  const count = originals.length;
  let current = count;
  let timer;
  let fallbackTimer;
  let moving = false;

  const clone = (slide, index) => {
    const copy = slide.cloneNode(true);
    copy.dataset.logicalIndex = String(index);
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    return copy;
  };
  const slides = [
    ...originals.map((slide, index) => clone(slide, index)),
    ...originals,
    ...originals.map((slide, index) => clone(slide, index))
  ];
  slides.forEach((slide, index) => { slide.dataset.logicalIndex = String(index % count); });
  track.replaceChildren(...slides);

  function position(animate = true) {
    slides.forEach((slide, index) => {
      if (!animate) slide.style.transition = 'none';
      slide.classList.toggle('is-active', index === current);
      slide.classList.toggle('is-prev', index === current - 1);
      slide.classList.toggle('is-next', index === current + 1);
      if (index === current) slide.setAttribute('aria-current', 'true');
      else slide.removeAttribute('aria-current');
    });
    if (!animate) requestAnimationFrame(() => slides.forEach(slide => { slide.style.transition = ''; }));
  }

  function schedule() {
    clearTimeout(timer);
    if (!document.hidden && !moving) timer = setTimeout(() => move(1), 1500);
  }

  function normalize() {
    if (current >= count * 2) current -= count;
    if (current < count) current += count;
    position(false);
  }

  function finish() {
    if (!moving) return;
    clearTimeout(fallbackTimer);
    normalize();
    moving = false;
    schedule();
  }

  function move(direction) {
    if (moving) return;
    clearTimeout(timer);
    moving = true;
    current += direction;
    position(true);
    fallbackTimer = setTimeout(finish, 1000);
  }

  track.addEventListener('transitionend', event => {
    if (event.target === slides[current] && event.propertyName === 'transform') finish();
  });
  gallery.querySelector('[data-achievement-prev]')?.addEventListener('click', () => move(-1));
  gallery.querySelector('[data-achievement-next]')?.addEventListener('click', () => move(1));
  track.addEventListener('click', event => {
    const card = event.target.closest('.achievement-card');
    if (!card) return;
    const image = card.querySelector('img');
    if (image) openPhotoViewer(image);
  });
  document.addEventListener('visibilitychange', schedule);
  position(false);
  schedule();
})();


/* Responsive service card rows move only while cards overflow the visible width. */
(() => {
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.service-marquee').forEach((marquee, index) => {
    const track = marquee.querySelector('.service-marquee-track');
    const category = marquee.closest('.service-category');
    const group = track?.querySelector('.service-marquee-group');
    if (!track || !group || !group.children.length) return;
    let duplicate = null;
    const durations = [43, 48, 40];
    const direction = marquee.dataset.direction || (index === 1 ? 'right' : 'left');
    track.style.setProperty('--service-marquee-duration', (durations[index] || 44) + 's');
    const update = () => {
      const overflow = group.scrollWidth > marquee.clientWidth + 1;
      category?.classList.toggle('has-overflow', overflow);
      if (overflow && !reducedMotion) {
        if (!duplicate) {
          duplicate = group.cloneNode(true);
          duplicate.setAttribute('aria-hidden', 'true');
          duplicate.querySelectorAll('a,button,input,select,textarea').forEach(el => el.setAttribute('tabindex', '-1'));
          duplicate.querySelectorAll('img').forEach(img => { img.alt = ''; });
          track.appendChild(duplicate);
        }
        track.style.animation = 'serviceMarqueeMove var(--service-marquee-duration) linear infinite';
        track.style.animationDirection = direction === 'right' ? 'reverse' : 'normal';
        marquee.style.overflowX = 'hidden';
      } else {
        duplicate?.remove();
        duplicate = null;
        track.style.animation = 'none';
        track.style.animationDirection = '';
        marquee.style.overflowX = reducedMotion && overflow ? 'auto' : 'hidden';
      }
    };
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(update);
      observer.observe(marquee);
      observer.observe(group);
    } else {
      window.addEventListener('resize', update, { passive: true });
    }
    requestAnimationFrame(update);
  });
})();


/* Open a translated detail dialog when any service, CSC or Extra Work card is tapped. */
(() => {
  const dialog = document.getElementById('serviceDetailDialog');
  const title = document.getElementById('serviceDetailTitle');
  const description = document.getElementById('serviceDetailDescription');
  const close = document.getElementById('serviceDetailClose');
  if (!dialog || !title || !description) return;

  const details = {
    "Typing & Documentation": {
      en: "Get help typing applications, letters, declarations and other documents in a clean, readable format.",
      hi: "आवेदन, पत्र, घोषणा और अन्य दस्तावेज़ साफ़ और पढ़ने योग्य प्रारूप में टाइप कराने में सहायता पाएँ।"
    },
    "Affidavit & Agreements": {
      en: "Typing and formatting assistance for affidavits, agreements, undertakings and related paperwork. Legal review, where required, should be done by a qualified advocate.",
      hi: "शपथपत्र, एग्रीमेंट, वचनपत्र और संबंधित कागज़ात की टाइपिंग व फॉर्मेटिंग सहायता। जहाँ आवश्यक हो, कानूनी जाँच योग्य अधिवक्ता से कराएँ।"
    },
    "Printing & Photocopy": {
      en: "Bring your files or documents for printing, photocopying, scanning and basic document preparation.",
      hi: "प्रिंटिंग, फोटोकॉपी, स्कैनिंग और सामान्य दस्तावेज़ तैयार कराने के लिए अपनी फाइल या दस्तावेज़ लाएँ।"
    },
    "Online Forms & Applications": {
      en: "Assistance with online forms, application entry and supporting-document preparation. Final approval depends on the relevant authority.",
      hi: "ऑनलाइन फॉर्म, आवेदन भरने और सहायक दस्तावेज़ तैयार करने में सहायता। अंतिम स्वीकृति संबंधित विभाग पर निर्भर करती है।"
    },
    "GST Registration & Filing": {
      en: "Ask about GST registration, return-filing support and related documentation. Requirements and charges depend on your case.",
      hi: "GST पंजीकरण, रिटर्न फाइलिंग सहायता और संबंधित दस्तावेज़ों के बारे में पूछें। आवश्यकताएँ और शुल्क आपके मामले पर निर्भर करेंगे।"
    },
    "Income Tax Return (ITR)": {
      en: "Get assistance preparing information and documents for an income-tax return. Filing depends on the details and documents you provide.",
      hi: "आयकर रिटर्न के लिए जानकारी और दस्तावेज़ तैयार करने में सहायता पाएँ। फाइलिंग आपके दिए गए विवरण और दस्तावेज़ों पर निर्भर करेगी।"
    },
    "Company Registration & DIN": {
      en: "Documentation and online-process assistance for company registration and DIN-related requirements.",
      hi: "कंपनी पंजीकरण और DIN से जुड़ी आवश्यकताओं के दस्तावेज़ तथा ऑनलाइन प्रक्रिया में सहायता।"
    },
    "Accounting & Data Entry": {
      en: "Support for basic accounting records, billing, spreadsheet data entry and business documentation.",
      hi: "बुनियादी अकाउंटिंग रिकॉर्ड, बिलिंग, स्प्रेडशीट डेटा एंट्री और व्यावसायिक दस्तावेज़ीकरण में सहायता।"
    },
    "Land & Property Papers": {
      en: "Typing and application support for land or property-related paperwork. This service does not replace legal advice or official verification.",
      hi: "भूमि या संपत्ति से संबंधित कागज़ात की टाइपिंग और आवेदन सहायता। यह सेवा कानूनी सलाह या आधिकारिक सत्यापन का विकल्प नहीं है।"
    },
    "Aadhaar Services": {
      en: "Ask about available Aadhaar-related assistance. Services are subject to official enrolment rules, permissions and eligibility.",
      hi: "उपलब्ध आधार-संबंधी सहायता के बारे में पूछें। सेवाएँ आधिकारिक नियमों, अनुमतियों और पात्रता के अधीन हैं।"
    },
    "PAN Card Services": {
      en: "Get help with PAN application information, corrections, reprints and status-check steps where available.",
      hi: "जहाँ उपलब्ध हो, PAN आवेदन की जानकारी, सुधार, दोबारा प्रिंट और स्टेटस जाँच के चरणों में सहायता पाएँ।"
    },
    "Banking & BC Services": {
      en: "Ask about available banking or Business Correspondent services. Transactions depend on the authorised provider and applicable rules.",
      hi: "उपलब्ध बैंकिंग या बिज़नेस कॉरेस्पॉन्डेंट सेवाओं के बारे में पूछें। लेन-देन अधिकृत प्रदाता और लागू नियमों पर निर्भर हैं।"
    },
    "Insurance Services": {
      en: "Ask about available insurance-related assistance and required documents. Policy terms are determined by the insurer.",
      hi: "उपलब्ध बीमा-संबंधी सहायता और आवश्यक दस्तावेज़ों के बारे में पूछें। पॉलिसी की शर्तें बीमा कंपनी तय करती है।"
    },
    "Government Schemes": {
      en: "Get information and application assistance for eligible schemes. Eligibility and final decisions remain with the relevant department.",
      hi: "पात्र योजनाओं की जानकारी और आवेदन सहायता पाएँ। पात्रता और अंतिम निर्णय संबंधित विभाग के अधिकार में हैं।"
    },
    "Government Forms & Certificates": {
      en: "Assistance preparing online forms for eligible certificates and public services. Issuance is handled by the competent authority.",
      hi: "पात्र प्रमाणपत्रों और सार्वजनिक सेवाओं के ऑनलाइन फॉर्म तैयार करने में सहायता। प्रमाणपत्र संबंधित सक्षम प्राधिकारी जारी करता है।"
    },
    "Utility Bill Payments": {
      en: "Ask about supported utility-bill payment options. Check the bill details and receipt after payment.",
      hi: "समर्थित उपयोगिता बिल भुगतान विकल्पों के बारे में पूछें। भुगतान के बाद बिल विवरण और रसीद जाँचें।"
    },
    "Mobile & DTH Recharge": {
      en: "Recharge assistance for supported mobile and DTH providers. Confirm the number, operator and plan before payment.",
      hi: "समर्थित मोबाइल और DTH प्रदाताओं के रिचार्ज में सहायता। भुगतान से पहले नंबर, ऑपरेटर और प्लान की पुष्टि करें।"
    },
    "Education Services": {
      en: "Help with available student registrations, exam forms, results and online education services. Check official dates and eligibility.",
      hi: "उपलब्ध विद्यार्थी पंजीकरण, परीक्षा फॉर्म, परिणाम और ऑनलाइन शिक्षा सेवाओं में सहायता। आधिकारिक तारीख और पात्रता जाँचें।"
    },
    "Online Applications": {
      en: "Assistance filling eligible forms for public services, jobs and admissions. Please provide accurate information and documents.",
      hi: "सार्वजनिक सेवाओं, नौकरियों और प्रवेश के पात्र फॉर्म भरने में सहायता। सही जानकारी और दस्तावेज़ उपलब्ध कराएँ।"
    },
    "Printing & Scanning": {
      en: "Bring your paper or digital file for printing, scanning, photocopying and preparing supporting documents.",
      hi: "प्रिंटिंग, स्कैनिंग, फोटोकॉपी और सहायक दस्तावेज़ तैयार करने के लिए कागज़ या डिजिटल फाइल लाएँ।"
    },
    "Digital Documentation": {
      en: "Get help with document typing, formatting, PDF preparation and organising digital files.",
      hi: "दस्तावेज़ टाइपिंग, फॉर्मेटिंग, PDF तैयार करने और डिजिटल फाइल व्यवस्थित करने में सहायता पाएँ।"
    },
    "Advocate Connection": {
      en: "Ask about connecting with an advocate for legal consultation. Any legal advice is provided by the advocate, not by this website.",
      hi: "कानूनी परामर्श के लिए अधिवक्ता से संपर्क कराने के बारे में पूछें। कानूनी सलाह अधिवक्ता देंगे, यह वेबसाइट नहीं।"
    },
    "Certified Copy Assistance": {
      en: "Get guidance on the certified-copy application process and the documents required by the relevant court.",
      hi: "प्रमाणित प्रति के आवेदन की प्रक्रिया और संबंधित अदालत द्वारा माँगे जाने वाले दस्तावेज़ों के बारे में मार्गदर्शन पाएँ।"
    },
    "Web Design": {
      en: "Discuss a responsive website design for your business, service or professional profile, including layout and content needs.",
      hi: "अपने व्यवसाय, सेवा या पेशेवर प्रोफाइल के लिए responsive वेबसाइट डिज़ाइन, लेआउट और सामग्री की ज़रूरतों पर चर्चा करें।"
    },
    "Website Making": {
      en: "Share your website goals and required features to discuss planning, development and an estimated cost.",
      hi: "वेबसाइट के उद्देश्य और आवश्यक सुविधाएँ बताकर योजना, विकास और अनुमानित लागत पर चर्चा करें।"
    },
    "Android App Making": {
      en: "Discuss your Android app idea, its features and project scope before requesting an estimate.",
      hi: "अनुमान माँगने से पहले अपने Android ऐप के विचार, सुविधाओं और काम के दायरे पर चर्चा करें।"
    },
    "Custom Lithium Battery Packs": {
      en: "Ask about custom battery-pack work after intended use, voltage, capacity, protection and safety requirements are reviewed.",
      hi: "उपयोग, वोल्टेज, क्षमता, सुरक्षा सर्किट और सुरक्षा आवश्यकताओं की जाँच के बाद कस्टम बैटरी पैक कार्य के बारे में पूछें।"
    },
    "Experienced Electrician": {
      en: "Ask about availability for electrical installation, repair or maintenance work. Work scope and safety requirements should be confirmed first.",
      hi: "इलेक्ट्रिकल इंस्टॉलेशन, मरम्मत या रखरखाव के लिए उपलब्धता पूछें। पहले काम और सुरक्षा आवश्यकताओं की पुष्टि करें।"
    },
    "Experienced Carpenter": {
      en: "Ask about availability for furniture, fittings and other woodwork. Confirm the job scope and estimate before work begins.",
      hi: "फर्नीचर, फिटिंग और अन्य लकड़ी के काम के लिए उपलब्धता पूछें। काम शुरू होने से पहले दायरा और अनुमान तय करें।"
    }
  };

  const openCard = card => {
    const heading = card.querySelector('h3');
    const summary = card.querySelector('.service-photo-content p');
    const key = card.dataset.serviceKey || heading?.textContent.trim() || '';
    const item = details[key];
    const lang = document.documentElement.lang === 'hi' ? 'hi' : 'en';
    title.textContent = lang === 'hi' ? (heading?.textContent || key) : key;
    description.textContent = item ? item[lang] : (summary?.textContent || '');
    dialog.showModal();
  };

  document.querySelectorAll('.service-photo-card').forEach(card => {
    card.setAttribute('tabindex', card.closest('[aria-hidden="true"]') ? '-1' : '0');
    card.setAttribute('role', 'button');
    card.dataset.serviceKey = card.querySelector('h3')?.textContent.trim() || '';
  });
  /* Delegation also covers the seamless visual copies used by the moving carousel. */
  document.addEventListener('click', event => {
    const card = event.target.closest('.service-photo-card');
    if (!card) return;
    if (event.target.closest('a')) event.preventDefault();
    openCard(card);
  });
  document.addEventListener('keydown', event => {
    const card = event.target.closest('.service-photo-card');
    if (!card || event.target !== card) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCard(card);
    }
  });

  close?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });


})();

/* Independent UPI payment form: open the installed UPI app with the entered amount. */
(() => {
  const form = document.getElementById('upiPaymentForm');
  const amountField = document.getElementById('paymentAmount');
  const status = document.getElementById('paymentStatus');
  if (!form || !amountField) return;

  let fallbackTimer;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (status) {
      status.hidden = true;
      status.textContent = '';
    }
    if (!form.reportValidity()) return;

    const amount = Number(amountField.value);
    if (!Number.isFinite(amount) || amount < 1) {
      amountField.setCustomValidity('Enter an amount of at least ₹1.');
      amountField.reportValidity();
      amountField.setCustomValidity('');
      return;
    }

    const amountText = amount.toFixed(2);
    const params = new URLSearchParams({
      pa: '7209366125@ptsbi',
      pn: 'Rana Typing',
      tr: 'RT' + Date.now().toString(36).toUpperCase(),
      tn: 'Payment to Rana Typing',
      am: amountText,
      cu: 'INR'
    });
    const upiUrl = 'upi://pay?' + params.toString();
    const isHindi = document.documentElement.lang === 'hi';

    if (status) {
      status.hidden = false;
      status.textContent = isHindi
        ? '₹' + amountText + ' का भुगतान अनुरोध UPI ऐप में खोला जा रहा है…'
        : 'Opening a UPI payment request for ₹' + amountText + '…';
    }

    clearTimeout(fallbackTimer);
    const onAppSwitch = () => {
      if (document.visibilityState === 'hidden') clearTimeout(fallbackTimer);
    };
    document.addEventListener('visibilitychange', onAppSwitch, { once: true });
    fallbackTimer = window.setTimeout(() => {
      if (!status || document.visibilityState !== 'visible') return;
      status.textContent = isHindi
        ? 'अगर UPI ऐप नहीं खुला, तो QR कोड स्कैन करें, ₹' + amountText + ' दर्ज करें, Rana Typing और UPI ID 7209366125@ptsbi की पुष्टि करके भुगतान पूरा करें।'
        : 'If your UPI app did not open, scan the QR code, enter ₹' + amountText + ', verify Rana Typing and UPI ID 7209366125@ptsbi, then complete payment in your app.';
    }, 1800);

    window.location.href = upiUrl;
  });
})();


/* Warm the local Act PDFs after the page has fully loaded, without navigating away. */
(() => {
  const actPdfFiles = [
    'assets/acts/BNS-2023-english.pdf', 'assets/acts/BNS-2023-hindi.pdf',
    'assets/acts/BNSS-2023-english.pdf', 'assets/acts/BNSS-2023-hindi.pdf',
    'assets/acts/BSA-2023-english.pdf', 'assets/acts/BSA-2023-hindi.pdf',
    'assets/acts/IPC-1860-english.pdf', 'assets/acts/IPC-1860-hindi.pdf'
  ];
  const warm = async () => {
    if (!('caches' in window) || !navigator.onLine) return;
    try {
      const cache = await caches.open('rana-acts-pdf-cache-v1');
      for (const path of actPdfFiles) {
        try {
          const request = new Request(new URL(path, location.href).href);
          if (await cache.match(request)) continue;
          const response = await fetch(request, { cache: 'force-cache', priority: 'low' });
          if (response.ok) await cache.put(request, response);
        } catch (error) {
          if (error?.name === 'QuotaExceededError') break;
        }
      }
    } catch (_) {}
  };
  const start = () => window.setTimeout(() => { void warm(); }, 1800);
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 20000 });
    else window.setTimeout(start, 5000);
  }, { once: true });
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('assets/act-pdf-cache-sw.js', { scope: 'assets/' }).catch(() => {});
    }, { once: true });
  }
})();


/* Official portal rows use a seamless smooth marquee, alternating direction by category. */
(() => {
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.official-carousel-row').forEach((row, index) => {
    const viewport = row.querySelector('.official-links-viewport');
    const track = row.querySelector('.official-links-track');
    if (!viewport || !track) return;

    const originalCards = [...track.children].filter(card => card.matches('.official-link-card'));
    if (!originalCards.length) return;
    const direction = index % 2 === 0 ? 'left' : 'right';
    const group = document.createElement('div');
    group.className = 'official-links-group';
    group.append(...originalCards);
    track.replaceChildren(group);
    let duplicate = null;
    let paused = false;
    let resumeTimer;

    const update = () => {
      const overflow = group.scrollWidth > viewport.clientWidth + 1;
      row.classList.toggle('is-overflowing', overflow);
      if (overflow && !reducedMotion) {
        if (!duplicate) {
          duplicate = group.cloneNode(true);
          duplicate.setAttribute('aria-hidden', 'true');
          duplicate.querySelectorAll('a,button,input,select,textarea').forEach(el => el.setAttribute('tabindex', '-1'));
          duplicate.querySelectorAll('img').forEach(img => { img.alt = ''; });
          track.appendChild(duplicate);
        }
        const duration = Math.max(22, group.scrollWidth / 65);
        track.style.setProperty('--official-marquee-duration', duration + 's');
        track.style.animation = 'officialCardsMove var(--official-marquee-duration) linear infinite';
        track.style.animationDirection = direction === 'right' ? 'reverse' : 'normal';
        viewport.style.overflowX = 'hidden';
      } else {
        duplicate?.remove();
        duplicate = null;
        track.style.animation = 'none';
        track.style.animationDirection = '';
        viewport.style.overflowX = overflow ? 'auto' : 'hidden';
      }
    };

    const pause = () => {
      paused = true;
      track.style.animationPlayState = 'paused';
    };
    const resumeSoon = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
        track.style.animationPlayState = '';
      }, 1200);
    };
    row.addEventListener('pointerenter', pause);
    row.addEventListener('pointerleave', () => {
      if (!row.contains(document.activeElement)) {
        paused = false;
        track.style.animationPlayState = '';
      }
    });
    row.addEventListener('focusin', pause);
    row.addEventListener('focusout', resumeSoon);

    row.querySelectorAll('[data-official-scroll]').forEach(button => {
      button.addEventListener('click', () => {
        if (!update()) return;
        const card = group.querySelector('.official-link-card');
        const gap = parseFloat(getComputedStyle(group).columnGap || getComputedStyle(group).gap) || 0;
        const step = (card?.getBoundingClientRect().width || viewport.clientWidth * .8) + gap;
        const animation = track.getAnimations().find(item => item.playState !== 'idle');
        if (!animation) {
          const dir = Number(button.dataset.officialScroll) < 0 ? -1 : 1;
          viewport.scrollBy({ left: dir * step, behavior: 'smooth' });
          return;
        }
        const duration = typeof animation.effect?.getTiming().duration === 'number'
          ? animation.effect.getTiming().duration : 40000;
        const visualDirection = getComputedStyle(track).animationDirection === 'reverse' ? 1 : -1;
        const wantedDirection = Number(button.dataset.officialScroll) < 0 ? -1 : 1;
        const delta = duration * step / group.getBoundingClientRect().width * wantedDirection / visualDirection;
        const keepPaused = paused || animation.playState === 'paused';
        animation.pause();
        animation.currentTime = ((Number(animation.currentTime || 0) + delta) % duration + duration) % duration;
        if (!keepPaused) animation.play();
      });
    });

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(update);
      observer.observe(viewport);
      observer.observe(group);
    } else {
      window.addEventListener('resize', update, { passive: true });
    }
    update();
  });
})();
/* Service arrows move by exactly one card while the row keeps gliding. */
(() => {
  document.querySelectorAll('.service-category').forEach(category => {
    const marquee = category.querySelector('.service-marquee');
    const track = marquee?.querySelector('.service-marquee-track');
    const group = track?.querySelector('.service-marquee-group');
    if (!marquee || !track || !group) return;
    category.querySelectorAll('[data-service-scroll]').forEach(button => {
      button.addEventListener('click', () => {
        const animation = track.getAnimations().find(item => item.playState !== 'idle');
        if (!animation) return;
        const card = group.querySelector('.service-card');
        const gap = parseFloat(getComputedStyle(group).columnGap || getComputedStyle(group).gap) || 0;
        const cardStep = (card?.getBoundingClientRect().width || 270) + gap;
        const groupWidth = group.getBoundingClientRect().width;
        const timing = animation.effect?.getTiming();
        const duration = typeof timing?.duration === 'number' ? timing.duration : 43000;
        const visualDirection = getComputedStyle(track).animationDirection === 'reverse' ? 1 : -1;
        const wantedDirection = Number(button.dataset.serviceScroll) < 0 ? -1 : 1;
        const delta = duration * cardStep / groupWidth * wantedDirection / visualDirection;
        animation.pause();
        animation.currentTime = ((Number(animation.currentTime || 0) + delta) % duration + duration) % duration;
        animation.play();
      });
    });
  });
})();
/* Local Indian month calendar; the calendar grid itself opens the official court holiday list. */
(() => {
  const monthNode = document.getElementById('indianCalendarMonth');
  const weekdaysNode = document.getElementById('indianCalendarWeekdays');
  const daysNode = document.getElementById('indianCalendarDays');
  if (!monthNode || !weekdaysNode || !daysNode) return;
  const todayParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
  const part = type => Number(todayParts.find(item => item.type === type)?.value || 1);
  let cursor = new Date(Date.UTC(part('year'), part('month') - 1, 1));
  const weekdayNames = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
  };
  const render = () => {
    const lang = document.documentElement.lang === 'hi' ? 'hi' : 'en';
    monthNode.textContent = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(cursor);
    weekdaysNode.innerHTML = weekdayNames[lang].map(day => '<span>' + day + '</span>').join('');
    daysNode.innerHTML = '';
    const year = cursor.getUTCFullYear(), month = cursor.getUTCMonth();
    const offset = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const numberFormat = new Intl.NumberFormat(lang === 'hi' ? 'hi-IN' : 'en-IN');
    for (let i = 0; i < offset; i++) daysNode.appendChild(document.createElement('span')).className = 'calendar-day calendar-day-empty';
    for (let day = 1; day <= count; day++) {
      const cell = document.createElement('span');
      cell.className = 'calendar-day';
      cell.textContent = numberFormat.format(day);
      if (year === part('year') && month === part('month') - 1 && day === part('day')) cell.classList.add('calendar-today');
      daysNode.appendChild(cell);
    }
  };
  document.querySelectorAll('[data-calendar-month]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    cursor.setUTCMonth(cursor.getUTCMonth() + Number(button.dataset.calendarMonth));
    render();
  }));
  window.setOfficialCalendarLanguage = render;
  render();
})();

/* Indian Acts cards remain fixed in place; no carousel animation. */
