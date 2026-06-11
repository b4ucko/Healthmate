# HealthMate - Project Requirements Specification

This document details the functional, non-functional, and system requirements for the **HealthMate** healthcare platform.

---

## 📋 1. Functional Requirements (Module Wise)

### 👥 1.1 User Authentication & Role Management
* **Roles Supported**: Patients, Doctors, and Wholesalers.
* **Patient Portal**: Register/Sign-in, view personal medical metrics, track upcoming appointments, and access logs for blood/pregnancy services.
* **Doctor Portal**: Manage schedules, approve/decline patient appointment requests, view medical records, and check demographics reports.


### 🩺 1.2 Doctor Discovery & Scheduling
* **Search & Filters**: Find specialists by name, specialty (Cardiology, Dermatology, Neurology, Orthopedics, Pediatrics, Psychiatry, Ayurveda), location, and availability (Today/Tomorrow).
* **Booking types**: Support both **In-Person Visits** and **Virtual consultations** (video).

### 🚨 1.3 Emergency Care & Hospital Finder
* **Location Finder**: Automatically detect user location and fetch nearby hospitals (with ETA, distance, and direction routing via Google Maps).
* **Emergency Bookings**: Allow one-tap priority emergency scheduling *without* forcing user sign-in.
* **First Aid**: View step-by-step guidance card for critical situations (fever, bleeding control, airway clearing, vital checking).

### 🩸 1.4 Blood Bank & Donor Portal
* **Availability Checks**: Real-time status lookup (High, Medium, Low, Critical) of units for A+, A-, B+, B-, O+, O-, AB+, AB- blood groups.
* **Blood Requests**: Send inquiries to central blood banks with required units, contact info, and patient purpose.
* **Donor Registration**: Validate user input (Age > 18, Weight > 50kg) to register them in the neighborhood donor directory.

### 🤰 1.5 Priority Pregnancy Care
* **Priority Routing**: Fast-tracked consultations booking bypassing waiting lines.
* **Pregnancy details**: Track pregnancy by months and request specific Ob/Gyn specialists.

### 🎙️ 1.6 Intelligent Voice Assistant
* **Speech-to-Text**: Hands-free navigation and action triggering.
* **Smart commands**: Support voice actions like:
  * "book appointment", "emergency", "pharmacy", "blood services".
  * Direct specialty searches (e.g. "Looking for Cardiology specialist").

### 💊 1.7 Online Pharmacy & Cart Checkout
* **Medicine store**: Browse generic medicines and Ayurvedic healthcare products.
* **Prescription Scanning**: Support uploading prescription files with mock scanning/detection of medicine names.
* **Incentive calculation**: Auto-calculate discounts (up to 20% off) at cart checkout.

---

## 🌐 2. Non-Functional Requirements

### 🌍 2.1 Accessibility & Localization
* **Languages**: Interface localizable into **English**, **Hindi (हिन्दी)**, **Bengali (বাংলা)**, **Tamil (தமிழ்)**, and **Marathi (मराठी)**.
* **Fallback translation**: Smooth key resolution; fallback to English key translation when localized string is missing.

### 🎨 2.2 Design & Aesthetics
* **Theme**: Responsive Light and Dark themes.
* **Contrast Compliance**: Clean text contrast on cards in dark mode.
* **Micro-interactions**: Smooth cards transition, loading animations, hover transforms (`translate-y`), and glowing active indicators.
* **Branding**: Official medical waves logo used as Favicon, Header logo, and Footer logo.
* **Offline Robustness**: All critical blog assets, doctors profile pictures, and product images saved locally inside `/public` directory to ensure absolute load stability.

---

## 💻 3. System & Build Requirements

* **Environment**: Node.js `v18+` & npm `v9+`.
* **Database/Backend Integration**: Supabase (configured via `.env` keys).
* **Build Server**: Vite compiler (production bundle built inside `dist/` directory).
