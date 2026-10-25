# SELAH 2026 — Pause. Explore. Renew. 🕊️✨

> **The official web platform for SELAH 2026**, the premier inter-church youth cultural & sports festival hosted by the **Carmel Youth Association (CYA)** of Carmel Mar Thoma Church, Pune. Uniting youth congregations in athletics, creative expressions, and fellowship.

---

## 🌟 Highlights & Features

### 1. 🎭 Immersive Hero & Welcome Experience
* **Interactive Welcome Screen**: A cinematic entry overlay (`WelcomeOverlay`) that unlocks ambient sound and synchronizes initial animations.
* **Ambient Theme Music Player**: Integrated audio player (`ThemeMusicPlayer`) with volume sliders, mute controls, and session-based persistence so theme music flows uninterrupted across page transitions.
* **Interactive 3D Silk Simulation**: High-performance WebGL shader canvas (`Silk`) rendering fluid cloth waves in brand colors (`#611e3c`, `#fff1cb`).
* **Real-time Event Countdown**: Live flip counter (`Counter`) tracking the exact time until the festival kickoff.

### 2. 🏆 Festival Tracks & Event Showcase
* **Sports & Cultural Showcases**: Categorized event cards with smooth track switching (Athletics, Football, Cricket, Badminton, Short Film, Live Canvas Painting, Solo Singing, Group Dance, etc.).
* **Interactive Bento Grid**: High-density feature showcase (`MagicBento`) with spotlight tracking and ambient border glows (`BorderGlow`).
* **Scrolling Marquee Ticker**: Continuous velocity-based text marquee (`ScrollVelocity`).
* **Seamless Rules Navigation**: Clicking any event automatically navigates to `/rules` and smoothly scrolls to the exact event regulations and tiebreaker criteria.

### 3. 📋 Multi-Step Parish Registration Portal (`/register`)
* **Interactive 4-Step Stepper Wizard**:
  1. **Parish Details**: Parish name, Vicar, Youth leader, contact information.
  2. **Sports Squads**: Dynamic event selection, team roster registration, gender restriction validations.
  3. **Cultural Squads**: Solo and group performance submissions with member entry fields.
  4. **Fee & Payment**: Real-time fee calculations (tiered group vs. individual pricing), integrated UPI QR code payment, transaction ID submission, and downloadable/printable payment confirmation receipt.
* **Serverless Backend Integration**: Instant submission to Cloud Firestore database via Next.js route handlers.

### 4. 📜 Comprehensive Event Rulebook (`/rules`)
* Complete rules and guidelines for both **Sports** and **Cultural** tracks.
* Categorized navigation tabs, real-time search filtering, and anchor targets for quick reference.
* General code of conduct, scoring metrics, referee guidelines, and tiebreaker procedures.

### 5. 👥 About CYA & Core Team Roster (`/about-cya`)
* Dedicated editorial profile celebrating the Carmel Youth Association history and spiritual mission.
* Styled with premium serif and modern sans typography (*Cormorant Garamond* & *Outfit*).
* Interactive 3D tilt profile cards (`ProfileCard`) for the Director, Animators, and Youth Committee members.

### 6. 🖼️ Visual Media Gallery (`/gallery`)
* Creative media showcase featuring festival highlights, memories, and announcements beneath ambient silk animation.

### 7. 🛡️ Admin Management Dashboard (`/register-admin`)
* Password-authenticated management suite for event coordinators.
* Real-time metrics: registered parishes, total participants, squad breakdowns, and payment statuses.
* Search, filter, inspection drawer, and one-click export to CSV spreadsheet format.

---

## 🎨 Design System & Aesthetics

| Token | Hex / Value | Description |
|---|---|---|
| **Primary (Wine)** | `#611e3c` | Main festival background & brand accent |
| **Accent (Olive)** | `#63752e` | Interactive highlights, pills, badges |
| **Foreground (Cream)** | `#fff1cb` | Typography, emblems, and contrast accents |
| **Frosted Glass** | `rgba(255, 241, 203, 0.72)` | Translucent floating navigation bar (`backdrop-filter: blur(16px)`) |
| **Mobile Drawer** | `rgba(97, 30, 60, 0.82)` | Translucent slide-out navigation (`backdrop-filter: blur(24px)`) |

---

## 🏗️ Project Architecture

```
selah_website/
├── public/                     # Static media assets, icons, audio, and event photos
│   ├── top_page/               # SELAH emblems, logos, and audio tracks
│   ├── events/                 # Sports and cultural event banner artwork
│   └── cya/                    # Core team portrait photos and badges
│
├── src/
│   ├── app/                    # Next.js App Router pages and endpoints
│   │   ├── page.tsx            # Festival Homepage
│   │   ├── register/           # Multi-step parish registration portal
│   │   ├── rules/              # Interactive festival rulebook
│   │   ├── about-cya/          # Carmel Youth Association & Core Team showcase
│   │   ├── gallery/            # Visual gallery
│   │   ├── register-admin/     # Secured event management admin dashboard
│   │   ├── globals.css         # Design system tokens, glassmorphism, animations
│   │   └── api/                # Serverless backend route handlers
│   │       ├── register/       # POST registration handler (Firestore)
│   │       └── admin/          # Admin authentication and registration records API
│   │
│   ├── components/
│   │   ├── web/                # High-level layout & website components
│   │   │   ├── Navbar.tsx      # Unified translucent desktop and mobile navigation
│   │   │   ├── Footer.tsx      # Site-wide interactive particle footer
│   │   │   ├── ThemeMusicPlayer.tsx # Audio experience & persistent floating player
│   │   │   └── WelcomeOverlay.tsx   # Initial cinematic entry overlay
│   │   │
│   │   └── ui/                 # Rich interactive UI animations & widgets
│   │       ├── Silk.jsx        # WebGL / OGL 3D cloth physics simulation
│   │       ├── MagicBento.jsx  # Interactive Bento grid with cursor tracking
│   │       ├── BorderGlow.jsx  # Dynamic card border spotlight glow
│   │       ├── Counter.jsx     # Flip countdown counter
│   │       ├── ParticleText.jsx# Interactive canvas particle typography
│   │       ├── ProfileCard.jsx # 3D perspective tilt team card
│   │       ├── ScrollVelocity.jsx # Variable velocity marquee ticker
│   │       ├── StaggeredMenu.jsx  # Mobile drawer navigation (GSAP)
│   │       ├── Stepper.jsx     # Registration multi-step wizard
│   │       ├── AnimatedContent.jsx# Scroll-triggered entrance animations
│   │       ├── morphing-text.tsx  # Dynamic SVG morphing headlines
│   │       ├── sparkles-text.tsx  # Sparkle animation generator
│   │       └── resizable-navbar.tsx # Responsive auto-shrinking desktop bar
│   │
│   └── lib/                    # Shared utilities & configurations
│       ├── firebase.ts         # Firebase App & Cloud Firestore client
│       ├── adminAuth.ts        # Admin session verification utilities
│       └── utils.ts            # Class name merger helper (cn)
│
├── package.json
└── tsconfig.json
```

---

## 🛠️ Technology Stack

* **Core Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, App Router, React 19)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Glassmorphism
* **Motion & Animation**:
  * [Framer Motion](https://www.framer.com/motion/) for micro-interactions & layout springs
  * [GSAP (GreenSock)](https://gsap.com/) for staggered timeline reveals
  * [OGL](https://github.com/oframe/ogl) for WebGL 3D cloth canvas simulation
* **Database & Storage**: [Google Firebase / Cloud Firestore](https://firebase.google.com/)
* **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** >= 18.18.0
* **npm**, **pnpm**, or **yarn**

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/SELAH_2026.git
cd SELAH_2026/selah_website
npm install
```

### 2. Environment Configuration
Create a `.env.local` file inside the `selah_website` directory:

```env
# Firebase Web App Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Admin Portal Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Running Locally
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Production Build & Verification
To test type safety and compile the optimized production bundle:

```bash
# Type check without emitting files
npx tsc --noEmit

# Compile production build
npm run build

# Start production server
npm run start
```

---

## 📡 API Reference

### `POST /api/register`
Submits a parish's complete registration payload (parish info, selected sports rosters, cultural squads, fee calculation, and payment transaction metadata) to Cloud Firestore.

### `POST /api/admin/login`
Authenticates event coordinators against secure server environment credentials.

### `GET /api/admin/registrations`
Fetches all confirmed parish registrations, participants, and payment records for admin overview and CSV export (protected route).

---

## 👥 Organizers & Credits

* **Organized by**: Carmel Youth Association (CYA), Carmel Parish, Pune
* **Patron**: Fr. Joy Kakkanatu (Director)
* **Animators**: Br. Jeeson & Br. Amalek
* **Developed by**: Joseph and Aaron

---

<p align="center">
  <b>SELAH 2026</b> • Pause. Explore. Renew.
</p>
