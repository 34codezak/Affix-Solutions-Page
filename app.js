
/* =========================================================
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const mobileMenuToggle =
    document.getElementById("mobileMenuToggle");

const mobileMenu =
    document.getElementById("mobileMenu");

const navbar =
    document.getElementById("navbar");

const year =
    document.getElementById("year");

const contactForm =
    document.getElementById("contactForm");

const formStatus =
    document.getElementById("formStatus");

const submitButton =
    contactForm?.querySelector('button[type="submit"]');


/* =========================================================
   GOOGLE APPS SCRIPT API
========================================================= */

const GOOGLE_SCRIPT_URL =
    "YOUR_APPS_SCRIPT_WEB_APP_URL";


/* =========================================================
   MOBILE MENU
========================================================= */

function closeMenu() {

    if (!mobileMenuToggle) return;

    mobileMenuToggle.checked = false;

    mobileMenuToggle.dispatchEvent(
        new Event("change")
    );

}


if (mobileMenuToggle) {

    const menuLabel =
        document.querySelector(
            'label[for="mobileMenuToggle"]'
        );

    function updateMenuState() {

        const isOpen =
            mobileMenuToggle.checked;

        if (menuLabel) {

            menuLabel.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuLabel.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        }

    }

    mobileMenuToggle.addEventListener(
        "change",
        updateMenuState
    );

    updateMenuState();


    // Close menu when a navigation link is clicked

    if (mobileMenu) {

        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            });

    }


    // Close when clicking outside

    document.addEventListener(
        "click",
        function (event) {

            const clickedInsideMenu =
                mobileMenu?.contains(event.target);

            const clickedToggle =
                menuLabel?.contains(event.target);

            if (
                mobileMenuToggle.checked &&
                !clickedInsideMenu &&
                !clickedToggle
            ) {

                closeMenu();

            }

        }
    );


    // Escape key

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );


    // Close on desktop resize

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 900) {
                closeMenu();
            }

        }
    );

}


/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

function updateNavbar() {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.style.background =
            "rgba(8, 8, 8, 0.98)";

        navbar.style.boxShadow =
            "0 8px 30px rgba(0, 0, 0, 0.25)";

    } else {

        navbar.style.background =
            "rgba(8, 8, 8, 0.94)";

        navbar.style.boxShadow = "none";

    }

}


window.addEventListener(
    "scroll",
    updateNavbar
);

updateNavbar();


/* =========================================================
   CURRENT YEAR
========================================================= */

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =========================================================
   CONTACT FORM → GOOGLE SHEETS
========================================================= */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (submitButton?.disabled) return;


            // Browser validation

            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();
                return;

            }


            if (
                !GOOGLE_SCRIPT_URL ||
                GOOGLE_SCRIPT_URL.includes("YOUR_APPS_SCRIPT")
            ) {

                formStatus.textContent =
                    "Contact form is not configured yet.";

                return;

            }


            const formData =
                new FormData(contactForm);


            // Basic frontend validation

            const name =
                String(formData.get("name") || "").trim();

            const phone =
                String(formData.get("phone") || "").trim();

            const service =
                String(formData.get("service") || "").trim();

            const message =
                String(formData.get("message") || "").trim();


            if (!name || !phone || !service || !message) {

                formStatus.textContent =
                    "Please complete all required fields.";

                return;

            }


            // Disable button during submission

            const originalButtonText =
                submitButton.textContent;

            if (submitButton) {

                submitButton.disabled = true;
                submitButton.textContent = "Submitting...";

            }

            formStatus.textContent =
                "Sending your service request...";


            try {

                await fetch(GOOGLE_SCRIPT_URL, {

                    method: "POST",

                    mode: "no-cors",

                    body: new URLSearchParams(formData)

                });


                formStatus.textContent =
                    "Your request has been sent to the submission endpoint. " +
                    "Spreadsheet delivery cannot be confirmed here. " +
                    "For urgent assistance, contact us on WhatsApp.";


                // Keep entered data until delivery can be confirmed.


            } catch (error) {

                console.error(
                    "Contact form submission error:",
                    error
                );

                formStatus.textContent =
                    "Unable to send your request. Please try again or contact us on WhatsApp.";

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }

        }
    );

}


/* =========================================================
   SMOOTH ANCHOR OFFSET
========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetID =
                    this.getAttribute("href");

                if (!targetID || targetID === "#") {
                    return;
                }

                const target =
                    document.querySelector(targetID);

                if (!target) {
                    return;
                }

                event.preventDefault();

                const navbarHeight =
                    navbar
                        ? navbar.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    navbarHeight;

                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "Affix website loaded successfully."
);
