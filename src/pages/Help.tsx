import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Phone, MessageCircle, Heart, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Help = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmergency = location.state?.emergency;

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support in English and Spanish",
      available: "24/7"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free, 24/7 crisis support via text message",
      available: "24/7"
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      available: "24/7"
    }
  ];

  const supportResources = [
    {
      title: "Talk to Someone You Trust",
      description: "Reach out to a family member, friend, teacher, or counselor",
      icon: MessageCircle
    },
    {
      title: "Professional Help",
      description: "Consider speaking with a therapist or mental health professional",
      icon: Heart
    },
    {
      title: "Emergency Services",
      description: "If in immediate danger, call 911 or go to your nearest emergency room",
      icon: Phone
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Emergency Header */}
          {isEmergency && (
            <Card className="p-6 bg-red-500/10 border-red-500/20">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                <div>
                  <h1 className="text-2xl font-bold text-red-400 mb-2">
                    We're Here to Help You
                  </h1>
                  <p className="text-red-300">
                    Your safety and wellbeing are important. If you're having thoughts of self-harm, 
                    please reach out for support. You don't have to go through this alone.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Crisis Resources */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground text-center">
              Immediate Support Resources
            </h2>
            <div className="grid gap-6">
              {crisisResources.map((resource, index) => (
                <Card key={index} className="p-6 bg-gradient-card border-border/50 hover:shadow-wellness transition-all duration-300">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">{resource.name}</h3>
                      <p className="text-muted-foreground">{resource.description}</p>
                      <p className="text-sm text-accent">Available: {resource.available}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{resource.number}</p>
                      <Button variant="hero" size="sm" className="mt-2">
                        <Phone className="w-4 h-4" />
                        Call Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Support */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground text-center">
              Additional Support Options
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {supportResources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card key={index} className="p-6 bg-gradient-card border-border/50 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{resource.title}</h3>
                        <p className="text-muted-foreground text-sm">{resource.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Safety Plan */}
          <Card className="p-8 bg-gradient-hero">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold text-primary-foreground">
                Create a Safety Plan
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                Having a safety plan can help you recognize warning signs and know what steps to take 
                when you're in crisis. Work with a mental health professional to create one.
              </p>
              <Button variant="secondary">
                Learn About Safety Planning
              </Button>
            </div>
          </Card>

          {/* Remember */}
          <Card className="p-6 bg-accent/10 border-accent/20">
            <div className="text-center space-y-4">
              <Heart className="w-12 h-12 mx-auto text-accent" />
              <h3 className="text-xl font-semibold text-foreground">Remember</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These feelings are temporary. With proper support and care, things can and will get better. 
                You matter, and there are people who want to help you through this difficult time.
              </p>
            </div>
          </Card>

          {/* Navigation */}
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};