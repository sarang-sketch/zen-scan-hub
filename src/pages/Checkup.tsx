import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Heart, Brain, Moon, Users, Smartphone, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  options: Array<{ text: string; value: number; emoji: string }>;
  isSafety?: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    text: "How often does everything feel 'too much' to handle?",
    icon: Brain,
    options: [
      { text: "Never", value: 0, emoji: "😌" },
      { text: "Sometimes", value: 1, emoji: "😐" },
      { text: "Often", value: 2, emoji: "😰" },
      { text: "Almost always", value: 3, emoji: "😵" }
    ]
  },
  {
    id: 2,
    text: "Do you worry a lot about exams, future, or small things?",
    icon: Brain,
    options: [
      { text: "Rarely worry", value: 0, emoji: "😊" },
      { text: "Sometimes worry", value: 1, emoji: "😯" },
      { text: "Often worried", value: 2, emoji: "😟" },
      { text: "Constantly worried", value: 3, emoji: "😰" }
    ]
  },
  {
    id: 3,
    text: "Do you still enjoy your usual activities (friends, hobbies)?",
    icon: Heart,
    options: [
      { text: "Love them!", value: 0, emoji: "🥰" },
      { text: "Most of the time", value: 1, emoji: "😊" },
      { text: "Sometimes", value: 2, emoji: "😐" },
      { text: "Not really", value: 3, emoji: "😞" }
    ]
  },
  {
    id: 4,
    text: "How's your sleep quality lately?",
    icon: Moon,
    options: [
      { text: "Great sleep", value: 0, emoji: "😴" },
      { text: "Pretty good", value: 1, emoji: "😊" },
      { text: "Restless", value: 2, emoji: "😪" },
      { text: "Very poor", value: 3, emoji: "😵‍💫" }
    ]
  },
  {
    id: 5,
    text: "If you're upset, do you have someone to talk to?",
    icon: Users,
    options: [
      { text: "Always", value: 0, emoji: "🤗" },
      { text: "Usually", value: 1, emoji: "😊" },
      { text: "Sometimes", value: 2, emoji: "😐" },
      { text: "Never", value: 3, emoji: "😔" }
    ]
  },
  {
    id: 6,
    text: "Do you scroll on your phone late at night?",
    icon: Smartphone,
    options: [
      { text: "Never", value: 0, emoji: "😇" },
      { text: "Sometimes", value: 1, emoji: "😊" },
      { text: "Often", value: 2, emoji: "📱" },
      { text: "Every night", value: 3, emoji: "🤳" }
    ]
  },
  {
    id: 7,
    text: "Have you had thoughts of hurting yourself?",
    icon: Shield,
    options: [
      { text: "Never", value: 0, emoji: "💚" },
      { text: "Once or twice", value: 3, emoji: "⚠️" },
      { text: "Sometimes", value: 3, emoji: "🚨" },
      { text: "Often", value: 3, emoji: "🆘" }
    ],
    isSafety: true
  }
];

export const Checkup = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const Icon = question.icon;

  const handleAnswer = (value: number) => {
    setSelectedAnswer(value);
    
    // Check for safety concern
    if (question.isSafety && value > 0) {
      // Immediate redirect to help resources
      setTimeout(() => {
        navigate("/help", { state: { emergency: true } });
      }, 1000);
      return;
    }

    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Please select an answer",
        description: "Choose the option that best describes your experience",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate score and navigate to results
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0) + (selectedAnswer || 0);
      navigate("/results", { state: { score: totalScore, answers: { ...answers, [question.id]: selectedAnswer } } });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[questions[currentQuestion - 1].id] ?? null);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Mental Wellness Checkup
            </h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Question Card */}
          <Card className="p-8 bg-gradient-card border-border/50 shadow-wellness mb-8">
            <div className="space-y-8">
              {/* Question Header */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${question.isSafety ? 'bg-gradient-to-br from-red-500 to-orange-600' : 'bg-gradient-hero'} flex items-center justify-center shadow-glow`}>
                  {question.isSafety ? (
                    <AlertTriangle className="w-8 h-8 text-white" />
                  ) : (
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground leading-relaxed">
                    {question.text}
                  </h2>
                  {question.isSafety && (
                    <p className="text-sm text-red-400 mt-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      This is a safety question - your wellbeing matters
                    </p>
                  )}
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid gap-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedAnswer === option.value
                        ? 'border-primary bg-primary/10 shadow-glow'
                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-foreground font-medium">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              variant="default"
              onClick={handleNext}
              disabled={selectedAnswer === null}
            >
              {currentQuestion === questions.length - 1 ? 'Get Results' : 'Next'}
            </Button>
          </div>

          {/* Safety Notice */}
          {question.isSafety && (
            <Card className="mt-6 p-4 bg-red-500/10 border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-red-400 font-medium mb-1">Important Safety Information</p>
                  <p className="text-red-300">
                    If you're having thoughts of self-harm, please know that help is available. 
                    We'll provide resources and support options based on your response.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};