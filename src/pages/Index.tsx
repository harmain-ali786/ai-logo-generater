import LogoGenerator from "@/components/LogoGenerator";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Logo Generation</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Create Your
            <span className="block gradient-text">Brand Logo</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Transform your brand name into a stunning, professional logo in seconds with the power of AI.
          </p>
        </header>

        {/* Generator Component */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <LogoGenerator />
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-muted-foreground text-sm">
          <p>Logos are generated using AI and are unique to your brand</p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
