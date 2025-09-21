import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Utensils, User, Sparkles, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScanResult {
  type: 'food' | 'selfie';
  analysis: {
    calories?: number;
    nutrients?: { name: string; amount: string; color: string }[];
    healthMetrics?: { name: string; status: string; advice: string; color: string }[];
    recommendations: string[];
  };
}

export const Scanner = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'food' | 'selfie' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async (type: 'food' | 'selfie') => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please choose an image to scan.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanType(type);
    setScanResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('health-scanner', {
        body: { image: selectedImage, scanType: type },
      });

      if (error) {
        throw new Error(error.message);
      }

      setScanResult(data);
      toast({
        title: "Scan Complete!",
        description: `Your ${type} analysis is ready with personalized recommendations.`,
      });
    } catch (error) {
      console.error("Error scanning image:", error);
      toast({
        title: "Scan Failed",
        description: "Could not get analysis from the AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setScanResult(null);
    setScanType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Health & Food Scanner
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload a photo to get instant AI-powered analysis of your food's nutrition 
              or health insights from your appearance.
            </p>
          </div>

          {!selectedImage ? (
            /* Upload Section */
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-wellness transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <Utensils className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">Food Analysis</h3>
                    <p className="text-muted-foreground">
                      Get instant nutrition facts, calorie count, and dietary recommendations
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4" />
                    Scan Food
                  </Button>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-wellness transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">Health Check</h3>
                    <p className="text-muted-foreground">
                      Analyze visible health indicators like sleep quality and stress levels
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4" />
                    Take Selfie
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            /* Image Preview & Analysis */
            <div className="space-y-8">
              <Card className="p-6 bg-gradient-card border-border/50">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">Your Image</h3>
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Selected for analysis"
                        className="w-full h-64 object-cover rounded-xl shadow-card"
                      />
                      <div className="absolute inset-0 bg-gradient-glow opacity-20 rounded-xl" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">Choose Analysis Type</h3>
                    <div className="space-y-3">
                      <Button
                        variant={scanType === 'food' ? 'default' : 'outline'}
                        onClick={() => handleScan('food')}
                        disabled={isScanning}
                        className="w-full justify-start gap-3 h-12"
                      >
                        <Utensils className="w-5 h-5" />
                        Food & Nutrition Analysis
                      </Button>
                      <Button
                        variant={scanType === 'selfie' ? 'default' : 'outline'}
                        onClick={() => handleScan('selfie')}
                        disabled={isScanning}
                        className="w-full justify-start gap-3 h-12"
                      >
                        <User className="w-5 h-5" />
                        Health & Wellness Check
                      </Button>
                    </div>
                    
                    {isScanning && (
                      <div className="text-center space-y-3">
                        <Sparkles className="w-8 h-8 mx-auto text-primary animate-spin" />
                        <p className="text-muted-foreground">AI is analyzing your image...</p>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      onClick={resetScan}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Different Image
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Results */}
              {scanResult && (
                <Card className="p-8 bg-gradient-card border-border/50 shadow-wellness">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                        {scanResult.type === 'food' ? (
                          <Utensils className="w-6 h-6 text-primary-foreground" />
                        ) : (
                          <User className="w-6 h-6 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-foreground">
                          {scanResult.type === 'food' ? 'Nutrition Analysis' : 'Health Analysis'}
                        </h3>
                        <p className="text-muted-foreground">AI-powered insights and recommendations</p>
                      </div>
                    </div>

                    {scanResult.type === 'food' && scanResult.analysis.calories && (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-foreground">Calorie Count</h4>
                          <div className="text-center p-6 rounded-xl bg-gradient-hero">
                            <p className="text-4xl font-bold text-primary-foreground">{scanResult.analysis.calories}</p>
                            <p className="text-primary-foreground/80">calories</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-foreground">Nutrition Breakdown</h4>
                          <div className="space-y-3">
                            {scanResult.analysis.nutrients?.map((nutrient, index) => (
                              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <span className="text-foreground">{nutrient.name}</span>
                                <span className={`px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${nutrient.color}`}>
                                  {nutrient.amount}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {scanResult.type === 'selfie' && scanResult.analysis.healthMetrics && (
                      <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-foreground">Health Metrics</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {scanResult.analysis.healthMetrics.map((metric, index) => (
                            <Card key={index} className="p-4 bg-muted/30">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-foreground">{metric.name}</span>
                                  <span className={`px-3 py-1 rounded-full text-white text-sm bg-gradient-to-r ${metric.color}`}>
                                    {metric.status}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{metric.advice}</p>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Personalized Recommendations
                      </h4>
                      <div className="grid gap-3">
                        {scanResult.analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
                            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-accent-foreground text-sm font-bold">{index + 1}</span>
                            </div>
                            <p className="text-foreground">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};