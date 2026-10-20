// Jihan Bhagat portfolio — Firebase inquiry form + existing site interactions
// Replace every placeholder in firebaseConfig with the values from Firebase Console:
// Project settings → General → Your apps → SDK setup and configuration.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
const firebaseConfigured =
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID" &&
  firebaseConfig.appId !== "YOUR_APP_ID";

if (firebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.info("Firebase is not configured yet. Add your Firebase web app configuration in script.js.");
}

(() => {
  "use strict";

  // Current year in all footer/rail locations.
  document.querySelectorAll(".year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Close the Bootstrap mobile navigation after selecting a section.
  const nav = document.getElementById("nav");
  if (nav && window.bootstrap) {
    const collapse = window.bootstrap.Collapse.getOrCreateInstance(nav, { toggle: false });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992 && nav.classList.contains("show")) collapse.hide();
      });
    });
  }

  // Update active navigation item and back-to-top button.
  const links = [...document.querySelectorAll(".topbar .nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const topButton = document.getElementById("toTop");
  let scheduled = false;

  const updateScrollUI = () => {
    topButton?.classList.toggle("visible", window.scrollY > 400);
    let current = null;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < 150) current = section;
    });
    if (current) {
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current.id}`);
      });
    }
    scheduled = false;
  };

  window.addEventListener("scroll", () => {
    if (!scheduled) {
      window.requestAnimationFrame(updateScrollUI);
      scheduled = true;
    }
  }, { passive: true });

  topButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  });
  updateScrollUI();

  // Firebase Firestore project inquiry form.
  const form = document.getElementById("projectInquiryForm");
  if (!form) return;

  const submitButton = document.getElementById("inquirySubmit");
  const submitLabel = form.querySelector(".submit-label");
  const status = document.getElementById("inquiryStatus");

  const setStatus = (message, kind = "") => {
    status.textContent = message;
    status.classList.remove("is-success", "is-error");
    if (kind) status.classList.add(`is-${kind}`);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (!db) {
      setStatus(
        "Firebase isn't configured yet. Add your Firebase web app settings in script.js, then try again.",
        "error"
      );
      return;
    }

    const name = document.getElementById("inquiryName").value.trim();
    const email = document.getElementById("inquiryEmail").value.trim().toLowerCase();
    const projectType = document.getElementById("inquiryType").value;
    const budget = document.getElementById("inquiryBudget").value;
    const details = document.getElementById("inquiryDetails").value.trim();

    if (name.length < 2 || name.length > 100) {
      setStatus("Please enter a name between 2 and 100 characters.", "error");
      return;
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.", "error");
      return;
    }
    if (details.length < 5 || details.length > 3000) {
      setStatus("Please describe your idea in 5 to 3,000 characters.", "error");
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = "Sending inquiry…";
    setStatus("Sending your inquiry securely…");

    try {
      await addDoc(collection(db, "project_inquiries"), {
        name,
        email,
        projectType,
        budget,
        details,
        createdAt: serverTimestamp()
      });

      form.reset();
      setStatus("Inquiry sent successfully. Thanks for reaching out — I'll review your idea!", "success");
    } catch (error) {
      console.error("Could not submit project inquiry:", error);
      if (error?.code === "permission-denied") {
        setStatus("Submission was blocked by Firestore rules. Check that the project_inquiries create rule is published.", "error");
      } else if (error?.code === "unavailable" || !navigator.onLine) {
        setStatus("Connection issue. Check your internet and try again.", "error");
      } else {
        setStatus("Couldn't send your inquiry right now. Please try again in a moment.", "error");
      }
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = "Send project inquiry";
    }
  });
})();
