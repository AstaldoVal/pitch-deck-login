import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  Plus, 
  Upload, 
  Users, 
  DollarSign,
  AlertCircle,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

interface PropertyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  hasRentRoll: boolean;
  rentRollFile?: string;
}

const Property = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [showOnboardingTip, setShowOnboardingTip] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load property data from localStorage (for prototype)
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
  }, []);

  const handleAddUnits = () => {
    toast({
      title: "Добавление юнитов",
      description: "Эта функция будет доступна в следующей версии"
    });
  };

  const handleUploadRentRoll = () => {
    toast({
      title: "Загрузка Rent Roll",
      description: "Эта функция будет доступна в следующей версии"
    });
  };

  if (!propertyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-6" />
          <p className="text-lg text-gray-600">Данные Property не найдены</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                Property Owner
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {propertyData.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {propertyData.address}, {propertyData.city}, {propertyData.state} {propertyData.zip}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
              <Building2 className="w-3 h-3 mr-1" />
              {propertyData.propertyType}
            </Badge>
          </div>

          {/* Onboarding Tip */}
          {showOnboardingTip && (
            <Card className="bg-blue-50 border-blue-200 p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-1">
                    Добавьте юниты, чтобы начать работу
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    {propertyData.hasRentRoll ? 
                      "Ваш Rent Roll обрабатывается. Команда поддержки свяжется с вами для завершения настройки." :
                      "Вы можете добавить юниты вручную или загрузить Rent Roll для автоматического импорта."
                    }
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleAddUnits}>
                      <Plus className="w-3 h-3 mr-1" />
                      Добавить юниты
                    </Button>
                    {!propertyData.hasRentRoll && (
                      <Button variant="outline" size="sm" onClick={handleUploadRentRoll}>
                        <Upload className="w-3 h-3 mr-1" />
                        Загрузить Rent Roll
                      </Button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setShowOnboardingTip(false)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего юнитов</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Общий доход</p>
                <p className="text-2xl font-bold text-gray-900">$0</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Занятость</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
              <Building2 className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Units Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Юниты</h2>
              <Button onClick={handleAddUnits} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Добавить юнит
              </Button>
            </div>
            
            <div className="text-center py-12 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Юниты не добавлены</p>
              <p className="text-sm">Добавьте первый юнит или загрузите Rent Roll</p>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Последняя активность</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Property "{propertyData.name}" создан
                  </p>
                  <p className="text-xs text-gray-500">Только что</p>
                </div>
              </div>

              {propertyData.hasRentRoll && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Rent Roll "{propertyData.rentRollFile}" загружен
                    </p>
                    <p className="text-xs text-gray-500">Обрабатывается...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Property;