import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  Building2, 
  Plus, 
  Users,
  Search,
  Filter,
  X,
  Hash,
  Home,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertySidebar } from "@/components/PropertySidebar";
import { AppHeader } from "@/components/AppHeader";

interface PropertyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  hasRentRoll: boolean;
  rentRollFile?: string;
  yearBuilt?: number;
  buildingType?: string;
  assetManager?: string;
}

interface Unit {
  id: string;
  unitNumber: string;
  floor: string;
  unitType: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: "Vacant" | "Occupied" | "Maintenance";
}

interface QuickUnit {
  unitNumber: string;
  unitType: string;
  bedrooms: number;
  bathrooms: number;
}

const PropertyUnits = () => {
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("template");
  const { toast } = useToast();

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    prefix: "",
    startNumber: 1,
    endNumber: 10,
    floors: ["1", "2", "3"],
    unitsPerFloor: 4,
    unitType: "1BR/1BA",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650
  });

  // Quick add form state
  const [quickUnits, setQuickUnits] = useState<QuickUnit[]>([
    { unitNumber: "", unitType: "1BR/1BA", bedrooms: 1, bathrooms: 1 }
  ]);

  useEffect(() => {
    // Load property data from localStorage (for prototype)
    const savedProperty = localStorage.getItem('property');
    if (savedProperty) {
      setPropertyData(JSON.parse(savedProperty));
    }
  }, []);

  const generateUnitsFromTemplate = () => {
    const newUnits: Unit[] = [];
    
    if (templateForm.floors.length > 0) {
      // Generate by floors
      templateForm.floors.forEach(floor => {
        for (let i = 1; i <= templateForm.unitsPerFloor; i++) {
          const unitNumber = `${templateForm.prefix}${floor}${i.toString().padStart(2, '0')}`;
          newUnits.push({
            id: `unit-${Date.now()}-${unitNumber}`,
            unitNumber,
            floor,
            unitType: templateForm.unitType,
            bedrooms: templateForm.bedrooms,
            bathrooms: templateForm.bathrooms,
            sqft: templateForm.sqft,
            status: "Vacant"
          });
        }
      });
    } else {
      // Generate by range
      for (let i = templateForm.startNumber; i <= templateForm.endNumber; i++) {
        const unitNumber = `${templateForm.prefix}${i.toString().padStart(3, '0')}`;
        newUnits.push({
          id: `unit-${Date.now()}-${unitNumber}`,
          unitNumber,
          floor: Math.ceil(i / 10).toString(),
          unitType: templateForm.unitType,
          bedrooms: templateForm.bedrooms,
          bathrooms: templateForm.bathrooms,
          sqft: templateForm.sqft,
          status: "Vacant"
        });
      }
    }

    setUnits(prev => [...prev, ...newUnits]);
    setShowAddForm(false);
    toast({
      title: "Units Created",
      description: `Successfully created ${newUnits.length} units.`
    });
  };

  const addQuickUnits = () => {
    const validUnits = quickUnits.filter(unit => unit.unitNumber.trim() !== "");
    const newUnits: Unit[] = validUnits.map(unit => ({
      id: `unit-${Date.now()}-${unit.unitNumber}`,
      unitNumber: unit.unitNumber,
      floor: unit.unitNumber.charAt(0) || "1",
      unitType: unit.unitType,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      sqft: 650, // Default
      status: "Vacant"
    }));

    setUnits(prev => [...prev, ...newUnits]);
    setQuickUnits([{ unitNumber: "", unitType: "1BR/1BA", bedrooms: 1, bathrooms: 1 }]);
    setShowAddForm(false);
    toast({
      title: "Units Added",
      description: `Successfully added ${newUnits.length} units.`
    });
  };

  const addQuickUnitRow = () => {
    setQuickUnits(prev => [...prev, { unitNumber: "", unitType: "1BR/1BA", bedrooms: 1, bathrooms: 1 }]);
  };

  const removeQuickUnitRow = (index: number) => {
    setQuickUnits(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuickUnit = (index: number, field: keyof QuickUnit, value: any) => {
    setQuickUnits(prev => prev.map((unit, i) => 
      i === index ? { ...unit, [field]: value } : unit
    ));
  };

  const removeUnit = (unitId: string) => {
    setUnits(prev => prev.filter(unit => unit.id !== unitId));
    toast({
      title: "Unit Removed",
      description: "Unit has been removed successfully."
    });
  };

  const handleAddUnit = () => {
    setShowAddForm(true);
  };

  const handleImportUnits = () => {
    toast({
      title: "Import Units",
      description: "This feature will be available in the next version"
    });
  };

  if (!propertyData) {
    return (
      <SidebarProvider>
        <div className="min-h-screen w-full flex">
          <PropertySidebar />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-gray-600">Property data not found</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <PropertySidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Units</h1>
                    <p className="text-gray-600 mt-1">
                      Manage units for {propertyData.name}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleImportUnits}>
                      <Building2 className="w-4 h-4 mr-2" />
                      Import from Rent Roll
                    </Button>
                    <Button onClick={handleAddUnit}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Unit
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <Card className="p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search units..." 
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </Card>

              {/* Add Units Dialog */}
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Units</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="template">Template Generation</TabsTrigger>
                        <TabsTrigger value="manual">Quick Manual Add</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="template" className="space-y-4 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Unit Prefix</Label>
                            <Input
                              placeholder="e.g., APT, UNIT"
                              value={templateForm.prefix}
                              onChange={(e) => setTemplateForm(prev => ({ ...prev, prefix: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Number</Label>
                            <Input
                              type="number"
                              value={templateForm.startNumber}
                              onChange={(e) => setTemplateForm(prev => ({ ...prev, startNumber: parseInt(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Number</Label>
                            <Input
                              type="number"
                              value={templateForm.endNumber}
                              onChange={(e) => setTemplateForm(prev => ({ ...prev, endNumber: parseInt(e.target.value) }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Unit Type</Label>
                            <Select
                              value={templateForm.unitType}
                              onValueChange={(value) => setTemplateForm(prev => ({ ...prev, unitType: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Studio">Studio</SelectItem>
                                <SelectItem value="1BR/1BA">1BR/1BA</SelectItem>
                                <SelectItem value="2BR/1BA">2BR/1BA</SelectItem>
                                <SelectItem value="2BR/2BA">2BR/2BA</SelectItem>
                                <SelectItem value="3BR/2BA">3BR/2BA</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Bedrooms</Label>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              value={templateForm.bedrooms}
                              onChange={(e) => setTemplateForm(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Bathrooms</Label>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              step="0.5"
                              value={templateForm.bathrooms}
                              onChange={(e) => setTemplateForm(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Square Feet</Label>
                            <Input
                              type="number"
                              value={templateForm.sqft}
                              onChange={(e) => setTemplateForm(prev => ({ ...prev, sqft: parseInt(e.target.value) }))}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setShowAddForm(false)}>
                            Cancel
                          </Button>
                          <Button onClick={generateUnitsFromTemplate}>
                            Generate {templateForm.endNumber - templateForm.startNumber + 1} Units
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="manual" className="space-y-4 mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <Label className="text-base font-medium">Units to Add</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addQuickUnitRow}
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Row
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {quickUnits.map((unit, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                              <div className="space-y-2">
                                <Label>Unit Number</Label>
                                <Input
                                  placeholder="e.g., 101, A-12"
                                  value={unit.unitNumber}
                                  onChange={(e) => updateQuickUnit(index, 'unitNumber', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                  value={unit.unitType}
                                  onValueChange={(value) => updateQuickUnit(index, 'unitType', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Studio">Studio</SelectItem>
                                    <SelectItem value="1BR/1BA">1BR/1BA</SelectItem>
                                    <SelectItem value="2BR/1BA">2BR/1BA</SelectItem>
                                    <SelectItem value="2BR/2BA">2BR/2BA</SelectItem>
                                    <SelectItem value="3BR/2BA">3BR/2BA</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Bedrooms</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="5"
                                  value={unit.bedrooms}
                                  onChange={(e) => updateQuickUnit(index, 'bedrooms', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Bathrooms</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="5"
                                  step="0.5"
                                  value={unit.bathrooms}
                                  onChange={(e) => updateQuickUnit(index, 'bathrooms', parseFloat(e.target.value))}
                                />
                              </div>
                              <div className="flex justify-end">
                                {quickUnits.length > 1 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeQuickUnitRow(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setShowAddForm(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addQuickUnits}>
                            Add {quickUnits.filter(u => u.unitNumber.trim()).length} Units
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Units List */}
              {units.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Units ({units.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {units.map((unit) => (
                        <div key={unit.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Home className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">{unit.unitNumber}</h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeUnit(unit.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span>{unit.unitType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Floor:</span>
                              <span>{unit.floor}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bed/Bath:</span>
                              <span>{unit.bedrooms}BR/{unit.bathrooms}BA</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sq Ft:</span>
                              <span>{unit.sqft}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={unit.status === "Vacant" ? "secondary" : 
                                           unit.status === "Occupied" ? "default" : "destructive"}>
                                {unit.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="p-8">
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-medium mb-2">No units added yet</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Get started by adding your first unit or importing units from a rent roll file
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button variant="outline" onClick={handleImportUnits}>
                        <Building2 className="w-4 h-4 mr-2" />
                        Import from Rent Roll
                      </Button>
                      <Button onClick={handleAddUnit}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Unit
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PropertyUnits;