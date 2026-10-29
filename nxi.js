/* ========================================
   NXI NAIL STUDIO - JavaScript
======================================== */

/*
    مهم:
    استبدلي الرقم التالي برقم واتساب النشاط الحقيقي.
    اكتبيه برمز الدولة، من غير + أو مسافات.
    الرقم الحالي تجريبي ولن يضمن وصول الرسائل.
*/
const WHATSAPP_NUMBER = "201000000000";

document.addEventListener("DOMContentLoaded", () => {

    // 1. Elements
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    const bookingForm = document.getElementById("bookingForm");
    const serviceSelect = document.getElementById("serviceSelect");

    const customerName = document.getElementById("customerName");
    const preferredDate = document.getElementById("preferredDate");
    const customerMessage = document.getElementById("customerMessage");

    const backToTop = document.getElementById("backToTop");
    const currentYear = document.getElementById("currentYear");

    // 2. Current Year
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // 3. Prevent Selecting a Past Date
    if (preferredDate) {
        const today = new Date();
        const localDate = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        preferredDate.min = localDate;
    }

    // 4. Mobile Navigation
    function closeMenu() {
        if (!menuToggle || !navMenu) return;

        menuToggle.classList.remove("open");
        navMenu.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "فتح قائمة التنقل");
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");

            menuToggle.classList.toggle("open", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل"
            );
        });

        navLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", event => {
            const clickedInsideMenu = navMenu.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });
    }

    // 5. Gallery Filters
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach(item => {
                const isActive = item === button;

                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            galleryItems.forEach(item => {
                const category = item.dataset.category;

                const shouldShow =
                    selectedFilter === "all" ||
                    category === selectedFilter;

                item.classList.toggle("hidden", !shouldShow);
            });
        });
    });

    // 6. Select a Service from a Service Card
    const bookingLinks = document.querySelectorAll(".booking-link");

    bookingLinks.forEach(link => {
        link.addEventListener("click", () => {
            const selectedService = link.dataset.service;

            if (!selectedService || !serviceSelect) return;

            const matchingOption = Array.from(serviceSelect.options)
                .find(option => option.value === selectedService);

            if (matchingOption) {
                serviceSelect.value = selectedService;
            } else {
                serviceSelect.value = "استفسار عام";
            }
        });
    });

    // 7. WhatsApp URL
    function createWhatsAppURL(message) {
        const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, "");

        if (!cleanNumber) {
            return null;
        }

        return (
            "https://wa.me/" +
            cleanNumber +
            "?text=" +
            encodeURIComponent(message)
        );
    }

    // 8. Booking Form Validation and WhatsApp
    if (bookingForm) {
        bookingForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!bookingForm.reportValidity()) {
                return;
            }

            const name = customerName.value.trim();
            const service = serviceSelect.value;
            const date = preferredDate.value;
            const extraMessage = customerMessage.value.trim();

            if (!name || !service) {
                return;
            }

            // Use the date as entered; no booking is confirmed yet.
            const messageParts = [
                "مرحبًا NXI Nail Studio،",
                "",
                "أرغب في الاستفسار عن حجز موعد.",
                "",
                "الاسم: " + name,
                "الخدمة: " + service
            ];

            if (date) {
                messageParts.push("التاريخ المفضل: " + date);
            }

            if (extraMessage) {
                messageParts.push(
                    "تفاصيل إضافية: " + extraMessage
                );
            }

            messageParts.push(
                "",
                "يرجى إخباري بالسعر والمواعيد المتاحة."
            );

            const message = messageParts.join("\n");
            const whatsappURL = createWhatsAppURL(message);

            if (!whatsappURL) {
                alert("يرجى إعداد رقم واتساب صحيح في ملف nxi.js أولًا.");
                return;
            }

            /*
                This opens WhatsApp with a prepared message.
                The customer must review and send it herself.
                This does not confirm an appointment.
            */
            window.open(whatsappURL, "_blank", "noopener,noreferrer");

            // Track the click locally without saving form details.
            trackEvent("booking_whatsapp_click", {
                service: service
            });
        });
    }

    // 9. Lightweight Local Interaction Tracking
    // Counts are stored in this browser only.
    // This is not a shared analytics dashboard.
    function trackEvent(eventName, details = {}) {
        try {
            const storageKey = "nxi_demo_analytics";

            const savedData = JSON.parse(
                localStorage.getItem(storageKey) || "{}"
            );

            if (!savedData[eventName]) {
                savedData[eventName] = 0;
            }

            savedData[eventName] += 1;

            localStorage.setItem(
                storageKey,
                JSON.stringify(savedData)
            );

            console.info("NXI interaction:", eventName, details);
        } catch (error) {
            // The site continues to work if storage is unavailable.
            console.info("Interaction tracking unavailable.");
        }
    }

    // Track clicks on links that lead toward booking.
    document.querySelectorAll('a[href="#booking"]').forEach(link => {
        link.addEventListener("click", () => {
            trackEvent("booking_section_click");
        });
    });

    // Track gallery filter selections.
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            trackEvent("gallery_filter_click", {
                filter: button.dataset.filter
            });
        });
    });

    // 10. Back to Top Button
    function updateBackToTop() {
        if (!backToTop) return;

        backToTop.classList.toggle(
            "visible",
            window.scrollY > 450
        );
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 11. Active Navigation Link
    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    navLinks.forEach(link => {
                        const isActive =
                            link.getAttribute("href") === "#" + currentId;

                        link.classList.toggle("active", isActive);
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    console.info("NXI Nail Studio is ready.");
});
"use strict";

// Replace with the studio's approved WhatsApp number.
// Use country code + number, digits only, no "+" or spaces.
const WHATSAPP_NUMBER = "201000000000";

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const dateInput = document.getElementById("preferredDate");
  const serviceSelect = document.getElementById("serviceSelect");

  // Do not allow a date in the past.
  if (dateInput) {
    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;
  }

  // Fill the selected service when a booking link is clicked.
  document.querySelectorAll(".booking-link").forEach((link) => {
    link.addEventListener("click", () => {
      const service = link.dataset.service;

      if (service && serviceSelect) {
        serviceSelect.value = service;
      }
    });
  });

  // Send the booking request through WhatsApp.
  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!bookingForm.reportValidity()) {
        return;
      }

      const name = document.getElementById("clientName").value.trim();
      const phone = document.getElementById("clientPhone").value.trim();
      const service = serviceSelect.value;
      const date = dateInput.value;
      const notes =
        document.getElementById("bookingNotes")?.value.trim() || "None";

      if (!name || !phone || !service || !date) {
        alert("Please complete all required fields.");
        return;
      }

      if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
        alert("The studio's WhatsApp number needs to be configured.");
        return;
      }

      const message = [
        "Hello NXI Nail Studio!",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Requested service: ${service}`,
        `Preferred date: ${date}`,
        `Additional details: ${notes}`,
        "",
        "Please confirm availability and the final price."
      ].join("\n");

      const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }

  // Highlight links that point to the current page section.
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetID = link.getAttribute("href");
      if (!targetID || targetID === "#") return;

      const target = document.querySelector(targetID);
      if (target) {
        target.setAttribute("tabindex", "-1");
      }
    });
  });

  // Report broken gallery images while developing.
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener("error", () => {
      console.warn("Check this image path:", img.getAttribute("src"));
    });
  });
});