import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Youtube, Facebook, Instagram, Clock, SkipForward, Download } from "lucide-react";

export const AIExtensionPage = () => {
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
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <Card className="p-8 lg:p-12 bg-gradient-card border-border/50">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Supercharge Your Browsing with Our <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">AI Extension</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Take back control of your digital life. Our AI-powered browser extension is designed to help you build healthier habits, stay focused, and browse safely.
              </p>
              <Button variant="hero" size="lg" className="text-lg px-8 py-6 h-auto w-full sm:w-auto">
                <Download className="w-5 h-5 mr-2" />
                Download for Chrome
              </Button>
               <p className="text-sm text-muted-foreground">
                Also available for Firefox and Safari.
              </p>
            </div>
            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow flex-shrink-0">
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
    </div>
  );
};
