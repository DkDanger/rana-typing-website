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
    if (!card || card === slides[current]) return;
    const active = ((current - count) % count + count) % count;
    const target = Number(card.dataset.logicalIndex);
    const ahead = (target - active + count) % count;
    move(ahead <= count / 2 ? 1 : -1);
  });
  document.addEventListener('visibilitychange', schedule);
  position(false);
  schedule();
})();


/* Slow, seamless horizontal service card movement. Duplicate groups are decorative
   for the loop; links in the original cards remain keyboard-accessible. */
(() => {
  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.service-marquee').forEach((marquee, index) => {
    const track = marquee.querySelector('.service-marquee-track');
    if (!track) return;
    const originalGroup = track.querySelector('.service-marquee-group');
    if (!originalGroup) return;
    const count = originalGroup.children.length;
    if (!count) return;

    if (prefersReducedMotion) {
      marquee.style.overflowX = 'auto';
      track.style.animation = 'none';
      return;
    }

    const duplicate = originalGroup.cloneNode(true);
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('a, button, input, select, textarea').forEach(el => {
      el.setAttribute('tabindex', '-1');
    });
    duplicate.querySelectorAll('img').forEach(img => { img.setAttribute('alt', ''); });
    track.appendChild(duplicate);

    /* Longer durations make the cards glide slowly rather than jump between slides. */
    const durations = [43, 48, 40];
    track.style.setProperty('--service-marquee-duration', (durations[index] || 44) + 's');
    const direction = marquee.dataset.direction || (index === 1 ? 'right' : 'left');
    track.style.animationDirection = direction === 'right' ? 'reverse' : 'normal';
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
    const key = heading?.textContent.trim() || '';
    const item = details[key];
    const lang = document.documentElement.lang === 'hi' ? 'hi' : 'en';
    title.textContent = lang === 'hi' ? (heading?.textContent || key) : key;
    description.textContent = item ? item[lang] : (summary?.textContent || '');
    dialog.showModal();
  };

  document.querySelectorAll('.service-photo-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', event => {
      if (event.target.closest('a')) event.preventDefault();
      openCard(card);
    });
    card.addEventListener('keydown', event => {
      if (event.target !== card) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCard(card);
      }
    });
  });

  close?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
})();
