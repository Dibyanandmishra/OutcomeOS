import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      <main className="flex-grow">
        <Hero heroImage="/hero.png" />
        <Features />
        
        {/* Call to Action Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 -z-10" />
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Accelerate Your <span className="text-blue-500">Outcome?</span>
            </h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Join hundreds of professionals who are transforming their workflows with AI. Start your journey with OutcomeOS today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/signup" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all text-center"
              >
                Create Free Account
              </a>
              <a 
                href="/login" 
                className="w-full sm:w-auto px-8 py-4 glass text-white font-semibold rounded-full hover:bg-white/10 transition-all text-center"
              >
                Sign In
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
