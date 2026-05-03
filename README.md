# OutcomeOS 🚀

OutcomeOS is a premium, AI-powered productivity platform designed to help professionals and learners accelerate their outcomes. Built with a modern glassmorphic design and a cutting-edge tech stack, it provides guided learning modules, real-time activity tracking, and a streaming AI assistant.

![OutcomeOS Hero Image](public/hero.png)

## ✨ Core Features

-   **🌊 AI Streaming Assistance**: Real-time interactive chat powered by Llama 3.3 and Groq for zero-latency responses.
-   **📊 Impact Visualization**: Dynamic analytics dashboard with AreaCharts and Heatmaps to track "Hours Saved" through AI automation.
-   **📚 Guided Modules**: Step-by-step course content with automated "Key Takeaway" generation on completion.
-   **🎙️ Voice Input**: Integrated speech-to-text for a seamless, hands-free AI interaction.
-   **🔐 Secure Auth**: Robust authentication system built with Auth.js (NextAuth), including Role-Based Access Control (RBAC).
-   **⚡ High-Performance UI**: Beautiful glassmorphic design system using Tailwind CSS, Framer Motion, and Lucide Icons.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [Auth.js v5](https://authjs.dev/)
-   **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

### Prerequisites

-   Node.js 20+
-   A PostgreSQL database (Supabase recommended)
-   A Groq API Key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/outcome-os.git
    cd outcome-os
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Copy `.env.example` to `.env` and fill in your credentials.
    ```bash
    cp .env.example .env
    ```

4.  **Database Migration**:
    ```bash
    npx prisma db push
    npx prisma db seed
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

6.  **Login**:
    Open [http://localhost:3000](http://localhost:3000) and use the temporary admin credentials visible on the login page.

## 📝 License

Not Available

---

Built with ❤️ by Dibyanand Mishra for the House Of Edtech Internship.
