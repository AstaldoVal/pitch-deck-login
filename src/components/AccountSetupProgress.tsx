import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, MessageCircle, CheckCircle, FileText, Upload, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AccountSetupProgressProps {
  hasRentRoll: boolean;
  rentRollFile?: string;
  uploadTime?: Date;
  onRentRollUploaded?: (fileName: string) => void;
}

export function AccountSetupProgress({ hasRentRoll, rentRollFile, uploadTime, onRentRollUploaded }: AccountSetupProgressProps) {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowFilePreview(true);
    }
  };

  const handleFileConfirm = () => {
    if (selectedFile) {
      // Update property data in localStorage
      const currentProperty = JSON.parse(localStorage.getItem('property') || '{}');
      const updatedProperty = {
        ...currentProperty,
        hasRentRoll: true,
        rentRollFile: selectedFile.name,
        uploadTime: new Date()
      };
      localStorage.setItem('property', JSON.stringify(updatedProperty));
      
      // Call the callback to update parent component
      onRentRollUploaded?.(selectedFile.name);
      
      toast({
        title: "Rent Roll Uploaded",
        description: "Your rent roll has been uploaded successfully. Setup will be completed within 24 hours."
      });
      
      setShowFilePreview(false);
      setSelectedFile(null);
    }
  };

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
            {!showFilePreview ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="rentRollUpload"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="rentRollUpload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Click to upload rent roll
                    </p>
                    <p className="text-xs text-blue-600">
                      Supported: .xlsx, .xls, .csv
                    </p>
                  </label>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat Support
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{selectedFile?.name}</p>
                      <p className="text-sm text-green-700">File ready for processing</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleFileConfirm}
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Upload
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowFilePreview(false)}
                      size="sm"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
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