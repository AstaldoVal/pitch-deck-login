import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Check, ArrowRight, Home, FileUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const PropertyOnboarding = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    propertyType: ""
  });
  const [rentRollFile, setRentRollFile] = useState<File | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [step, setStep] = useState<'form' | 'file' | 'success'>('form');
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = [
    { id: 'form', title: 'Property Details', icon: Home, description: 'Enter property information' },
    { id: 'file', title: 'Upload Rent Roll', icon: FileUp, description: 'Upload or skip rent roll' },
    { id: 'success', title: 'Complete', icon: CheckCircle, description: 'Setup complete' }
  ];

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'address', 'city', 'state', 'zip', 'propertyType'];
    const isValid = requiredFields.every(field => formData[field].trim() !== '');
    
    if (!isValid) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setStep('file');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRentRollFile(file);
      setShowFilePreview(true);
    }
  };

  const handleFileConfirm = () => {
    // Simulate file processing
    setStep('success');
    toast({
      title: "Rent Roll uploaded successfully",
      description: "Our support team will contact you to help with setup"
    });
    
    // Save to localStorage for prototype
    localStorage.setItem('property', JSON.stringify({
      ...formData,
      hasRentRoll: true,
      rentRollFile: rentRollFile?.name
    }));
    
    setTimeout(() => {
      navigate('/property');
    }, 2000);
  };

  const handleSkipRentRoll = () => {
    setStep('success');
    toast({
      title: "Property created",
      description: "You can add units manually later or upload a rent roll"
    });
    
    // Save to localStorage for prototype
    localStorage.setItem('property', JSON.stringify({
      ...formData,
      hasRentRoll: false
    }));
    
    setTimeout(() => {
      navigate('/property');
    }, 2000);
  };

  const propertyTypes = [
    "Multi-Family: Military",
    "Multi-Family: Conventional", 
    "Multi-Family: Senior Living",
    "Multi-Family: Affordable",
    "Multi-Family: Student Housing",
    "Commercial: Office",
    "Commercial: Retail",
    "Commercial: Industrial",
    "Commercial: Mixed Use"
  ];

  const states = [
    "CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI",
    "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MO", "MD", "WI"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your First Property
          </h1>
          <p className="text-lg text-gray-600">
            Start simple with your first property - your RenoQuest journey begins here. You can always add more properties later!
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((stepItem, index) => {
              const isActive = stepItem.id === step;
              const isCompleted = steps.findIndex(s => s.id === step) > index;
              const StepIcon = stepItem.icon;
              
              return (
                <div key={stepItem.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'bg-blue-600 border-blue-600 text-white' : 
                      isCompleted ? 'bg-green-600 border-green-600 text-white' : 
                      'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-blue-600' : 
                        isCompleted ? 'text-green-600' : 
                        'text-gray-500'
                      }`}>
                        {stepItem.title}
                      </p>
                      <p className="text-xs text-gray-400">{stepItem.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="p-8">
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Property Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter property name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="mt-1 h-11"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter street address"
                    value={formData.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    className="mt-1 h-11"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                    className="mt-1 h-11"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State *
                  </Label>
                  <Select value={formData.state} onValueChange={(value) => handleFormChange('state', value)}>
                    <SelectTrigger className="mt-1 h-11">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="zip" className="text-sm font-medium text-gray-700">
                    ZIP Code *
                  </Label>
                  <Input
                    id="zip"
                    type="text"
                    placeholder="Enter ZIP code"
                    value={formData.zip}
                    onChange={(e) => handleFormChange('zip', e.target.value)}
                    className="mt-1 h-11"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700">
                    Property Type *
                  </Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleFormChange('propertyType', value)}>
                    <SelectTrigger className="mt-1 h-11">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                >
                  Continue
                </Button>
              </div>
            </form>
          )}

          {step === 'file' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload Rent Roll
                </h2>
                <p className="text-gray-600">
                  Upload a file with unit data or skip this step. 
                  Our support team will help you with setup.
                </p>
              </div>

              {!showFilePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="rentRoll"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="rentRoll" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drag file here or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported files: .xlsx, .xls, .csv
                    </p>
                  </label>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{rentRollFile?.name}</p>
                      <p className="text-sm text-green-700">File ready for processing</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleFileConfirm}
                      className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Confirm Upload
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowFilePreview(false)}
                      className="w-full h-11"
                    >
                      Choose Another File
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  variant="outline"
                  onClick={handleSkipRentRoll}
                  className="w-full h-11"
                >
                  Skip This Step
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Property Created Successfully!
                </h2>
                <p className="text-gray-600">
                  {rentRollFile ? 
                    "Our support team will contact you to help with setup" : 
                    "You can add units manually later or upload a rent roll"
                  }
                </p>
              </div>
              <Button 
                onClick={() => navigate('/property')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
              >
                Go to Property
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PropertyOnboarding;