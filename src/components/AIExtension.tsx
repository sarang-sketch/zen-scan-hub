import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Youtube, Facebook, Instagram, Clock, SkipForward } from "lucide-react";

export const AIExtension = () => {
  const features = [
    {
      icon: Clock,
      title: "Screen Time Monitoring",
      description: "Monitors your screen time and provides detailed reports to help you manage your digital habits.",
    },
    {
      icon: Youtube,
      title: "Productive Social Media",
      description: "Manages the algorithms of Instagram, Facebook, and YouTube to promote productive content.",
    },
    {
      icon: ShieldCheck,
      title: "Adult Content Skipper",
      description: "Automatically skips adult content to ensure a safe browsing experience.",
    },
    {
        icon: SkipForward,
        title: "Excessive Usage Reminders",
        description: "Sends reminders when you exceed your set usage time on various applications.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <Card className="p-8 lg:p-12 bg-gradient-card border-border/50">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Download Our AI Extension
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Take control of your digital life with our AI-powered browser extension. It monitors your screen time, manages social media algorithms for productivity, and helps you stay focused.
              </p>
              <Button variant="hero" size="lg" className="text-lg px-8 py-6 h-auto">
                Download Now
              </Button>
            </div>
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
