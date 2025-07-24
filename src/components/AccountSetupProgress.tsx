import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, MessageCircle, CheckCircle, FileText } from "lucide-react";

interface AccountSetupProgressProps {
  hasRentRoll: boolean;
  rentRollFile?: string;
  uploadTime?: Date;
}

export function AccountSetupProgress({ hasRentRoll, rentRollFile, uploadTime }: AccountSetupProgressProps) {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    if (!hasRentRoll) return;

    // Simulate progress for demo
    const startTime = uploadTime || new Date();
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    
    const updateProgress = () => {
      const now = new Date();
      const totalTime = endTime.getTime() - startTime.getTime();
      const elapsedTime = now.getTime() - startTime.getTime();
      const progressPercent = Math.min((elapsedTime / totalTime) * 100, 100);
      
      setProgress(progressPercent);
      
      if (progressPercent < 100) {
        const remaining = endTime.getTime() - now.getTime();
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining("Complete");
      }
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [hasRentRoll, uploadTime]);

  if (!hasRentRoll) {
    return (
      <Card className="bg-blue-50 border-blue-200 p-6">
        <div className="flex items-start space-x-4">
          <FileText className="w-6 h-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Accelerate Your Setup
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Upload your rent roll to have our Customer Success team set up your account automatically within 24 hours. 
              This saves you hours of manual data entry and ensures optimal configuration.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Upload Rent Roll
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat Support
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-green-50 border-green-200 p-6">
      <div className="flex items-start space-x-4">
        <div className="w-6 h-6 mt-1">
          {progress >= 100 ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <Clock className="w-6 h-6 text-green-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 mb-2">
            {progress >= 100 ? "Account Setup Complete!" : "Setting Up Your Account"}
          </h3>
          <p className="text-sm text-green-700 mb-4">
            {progress >= 100 ? 
              "Your RenoQuest account is ready! Our Customer Success Manager will contact you to guide you through the next steps." :
              `We're processing your rent roll "${rentRollFile}" and configuring your account for optimal performance. Our Customer Success team will contact you soon.`
            }
          </p>
          
          {progress < 100 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Setup Progress</span>
                <span className="text-green-600 font-medium">
                  {timeRemaining} remaining
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <Button variant="outline" size="sm" className="mt-4">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Live Support
          </Button>
        </div>
      </div>
    </Card>
  );
}