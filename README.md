<div align="center">
  <h1> OutcomeOS</h1>
  <p><strong>A Premium AI-Powered Learning & Productivity Engine</strong></p>

  <p>
    <!-- Add your badges here -->
    <a href="https://outcomeos.onrender.com">
      <img src="https://img.shields.io/badge/Click_For_Live_Demo-OutcomeOS-blue?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
  </p>
</div>

---

## ⚡ Elevate Your Workflow
OutcomeOS is not just another dashboard—it's a high-performance productivity platform engineered for modern professionals. Designed with a stunning, fluid glassmorphic interface, OutcomeOS seamlessly integrates guided learning modules with a real-time, zero-latency streaming AI assistant to dramatically accelerate task completion and knowledge acquisition.

![OutcomeOS Hero Image](public/hero.png)

## ✨ Core Capabilities

*   **🌊 Zero-Latency AI Engine**: Experience real-time streaming AI chat powered by Llama 3.3 and Groq, delivering instantaneous responses and intelligent code/text generation.
*   **🎙️ Hands-Free Voice Control**: Native browser speech-to-text integration for rapid, conversational interactions with the AI.
*   **📊 Dynamic Impact Analytics**: Professional-grade data visualizations (AreaCharts, Heatmaps) that actively track and visualize the exact hours you've saved using AI.
*   **📚 Intelligent Learning Paths**: Structured, progressive modules with automated "Key Takeaway" extraction to solidify knowledge.
*   **🔐 Enterprise-Grade Security**: A hardened NextAuth (Auth.js) implementation featuring JWT session strategies and robust Role-Based Access Control (RBAC).
*   **💎 Premium Aesthetics**: A meticulously crafted UI utilizing Tailwind CSS, Framer Motion, and a sophisticated glassmorphic design system for a truly premium feel.

## 🛠️ Technology Arsenal

OutcomeOS leverages the bleeding edge of the modern web stack:

*   **Core Architecture**: Next.js 15+ (App Router), React 19, TypeScript
*   **Styling & Motion**: Tailwind CSS v4, Framer Motion, Lucide Icons
*   **Database & ORM**: PostgreSQL (via Supabase), Prisma ORM
*   **Authentication**: Auth.js v5 (NextAuth)
*   **AI Infrastructure**: Vercel AI SDK, Groq SDK
*   **Data Visualization**: Recharts

## 📁 Project Architecture

The codebase is organized for maximum scalability, adhering to modern Next.js architectural patterns:

```bash
outcome_os/
├── prisma/                 # Database schema, migrations, and seed data
│   └── schema.prisma
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router entry points
│   │   ├── (auth)/         # Authentication routes (Login, Signup)
│   │   ├── api/            # Serverless API routes (AI, Progress, Admin)
│   │   ├── dashboard/      # Protected dashboard application
│   │   ├── layout.tsx      # Global layout & Providers
│   │   └── page.tsx        # Marketing landing page
│   ├── components/         # Modular, reusable React components
│   │   ├── auth/           # Login/Signup forms
│   │   ├── dashboard/      # Complex dashboard widgets (ChatBox, Impact)
│   │   ├── marketing/      # Landing page sections
│   │   └── ui/             # Core UI elements (Toaster, etc.)
│   └── lib/                # Shared utilities and configurations
│       ├── auth.ts         # NextAuth configuration
│       ├── prisma.ts       # Database client singleton
│       └── utils.ts        # Tailwind merge utilities
├── next.config.ts          # Next.js build configuration
└── tailwind.config.ts      # Design system configuration
```

## 🚀 Deployment & Links

*   **Live Application**: [INSERT_DEPLOYMENT_LINK_HERE]
*   **Project Repository**: [INSERT_GITHUB_REPO_LINK_HERE]
*   **Portfolio / Developer Profile**: [INSERT_YOUR_PORTFOLIO_LINK_HERE]

## 💻 Local Development

Want to run OutcomeOS locally? Follow these steps:

### Prerequisites
*   Node.js 20+
*   A PostgreSQL database (Supabase recommended)
*   A [Groq API Key](https://console.groq.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Dibyanandmishra/OutcomeOS.git
    cd OutcomeOS
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL="your_postgres_connection_string"
    DIRECT_URL="your_postgres_direct_connection_string"
    AUTH_SECRET="generate_via_openssl_rand_base64_32"
    GROQ_API_KEY="your_groq_api_key"

    ```

4.  **Database Initialization**:
    ```bash
    npx prisma db push
    npx prisma db seed
    ```

5.  **Ignite the Engine**:
    ```bash
    npm run dev
    ```
    Navigate to `http://localhost:3000`. Use the temporary admin credentials displayed on the login page to access the full system.

---
<div align="center">
  <p>Engineered with precision by <strong>Dibyanand Mishra</strong> for the House Of Edtech Internship Application.</p>
</div>

## 👨‍💻 Author

**Dibyanand Mishra**

## 🌐 Connect with Me

[![GitHub](https://img.shields.io/badge/GitHub-Dibyanandmishra-181717?style=for-the-badge&logo=github)](https://github.com/Dibyanandmishra)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Dibyanand%20Mishra-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/dibya-nand-mishra-84865a301/)
