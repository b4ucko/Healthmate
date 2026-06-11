# HealthMate - Modern Healthcare Platform

HealthMate is a premium, AI-powered healthcare platform built to connect patients with doctors, schedule appointments, order medicines, access emergency services, and check blood availability. 

---

## 🌟 Key Features

* **AI Health Insights**: Personalized health recommendations powered by AI.
* **Doctor Consultations**: Find certified specialists and book appointments seamlessly.
* **Online Pharmacy**: Order medicines with ease (features up to 25% off and prescription scanning).
* **Emergency Services**: One-tap emergency care scheduling with nearest hospital routing and ambulance coordination.
* **Blood Bank Portal**: Check real-time blood group availability or request blood in emergency situations.
* **Priority Pregnancy Care**: Fast-tracked appointment scheduling and resources for expectant mothers.
* **Voice Assistant**: Talk directly to the built-in voice assistant to search doctors, book appointments, or navigate features.
* **Multi-Language Support**: Built-in translation system supporting English, Hindi, Bengali, Tamil, and Marathi.

---

## 🛠️ Tech Stack

* **Core**: React 18 & TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS, Framer Motion, and Glassmorphism design aesthetics
* **UI Components**: shadcn/ui & Radix UI primitives
* **Icons**: Lucide React
* **Routing & State**: React Query & React Router DOM

---

## 🚀 Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) and npm installed.

### Installation & Run

1. Clone or download the repository.
2. Install dependencies (this will also install `tesseract.js` for the OCR prescription scanner):
   ```sh
   npm install
   ```
3. Configure your environment variables:
   - Open the `.env` file in the root directory.
   - Set up your Supabase project credentials:
     ```env
     VITE_SUPABASE_PROJECT_ID="YOUR_SUPABASE_PROJECT_ID"
     VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_PUBLISHABLE_KEY"
     VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
     ```
4. Start the local development server:
   ```sh
   npm run dev
   ```
5. Build for production:
   ```sh
   npm run build
   ```

---

## 📂 Project Structure

```text
├── public/                # Static assets (Favicon, Logos, ayurvedic/medicine images)
│   └── logo.png           # Official HealthMate logo
├── src/
│   ├── components/        # Reusable UI Components
│   │   ├── ai/            # AI-powered features (Health recommendations)
│   │   ├── blood/         # Blood donation & requests
│   │   ├── chat/          # Chat templates
│   │   ├── doctor/        # Doctor components & dashboard elements
│   │   ├── emergency/     # First Aid Guide & hospital locator
│   │   ├── home/          # Hero section, features, testimonials
│   │   ├── layout/        # Shared Header (Navbar) & Footer
│   │   ├── theme/         # Light/Dark mode theme triggers
│   │   └── ui/            # shadcn base & custom GlassCard elements
│   ├── contexts/          # Auth Context & Translation/Language Context
│   ├── pages/             # Route-level pages (Index, BloodBank, Doctors, dashboards, etc.)
│   ├── translations/      # Multi-language translation dictionaries (en, hi, bn, ta, mr)
│   ├── App.tsx            # Main routes definition
│   ├── index.css          # Global styling and custom theme variables
│   └── main.tsx           # Application entry point
├── tailwind.config.ts     # Central theme palette & customization
└── vite.config.ts         # Vite bundler configuration
```

---