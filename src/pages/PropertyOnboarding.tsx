import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Check, ArrowRight } from "lucide-react";
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
        title: "Заполните все обязательные поля",
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
      title: "Rent Roll успешно загружен",
      description: "Команда поддержки свяжется с вами для помощи"
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
      title: "Property создан",
      description: "Вы можете добавить юниты позже вручную или загрузить Rent Roll"
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
    "Apartment Complex",
    "Single Family Home",
    "Townhouse",
    "Condominium",
    "Commercial Building",
    "Mixed Use"
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
            Создайте вашу первую Property
          </h1>
          <p className="text-lg text-gray-600">
            Заполните основную информацию и загрузите Rent Roll или пропустите этот шаг
          </p>
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
                    <SelectContent>
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
                  Продолжить
                </Button>
              </div>
            </form>
          )}

          {step === 'file' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Загрузите Rent Roll
                </h2>
                <p className="text-gray-600">
                  Загрузите файл с данными о юнитах или пропустите этот шаг. 
                  Наша команда поддержки поможет вам с настройкой.
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
                      Перетащите файл сюда или нажмите для выбора
                    </p>
                    <p className="text-sm text-gray-500">
                      Поддерживаются файлы: .xlsx, .xls, .csv
                    </p>
                  </label>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{rentRollFile?.name}</p>
                      <p className="text-sm text-green-700">Файл готов к обработке</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleFileConfirm}
                      className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Подтвердить загрузку
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowFilePreview(false)}
                      className="w-full h-11"
                    >
                      Выбрать другой файл
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
                  Пропустить этот шаг
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
                  Property успешно создан!
                </h2>
                <p className="text-gray-600">
                  {rentRollFile ? 
                    "Команда поддержки свяжется с вами для помощи с настройкой" : 
                    "Вы можете добавить юниты позже вручную или загрузить Rent Roll"
                  }
                </p>
              </div>
              <Button 
                onClick={() => navigate('/property')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
              >
                Перейти к Property
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