import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MessagesProvider } from "@/contexts/MessagesContext";
import { MessagesSidebar } from "@/components/MessagesSidebar";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyOnboarding from "./pages/PropertyOnboarding";
import PropertyEdit from "./pages/PropertyEdit";
import PropertyAdd from "./pages/PropertyAdd";
import Property from "./pages/Property";
import PropertyEmpty from "./pages/PropertyEmpty";
import PropertyUnits from "./pages/PropertyUnits";
import PropertyBids from "./pages/PropertyBids";
import BidsList from "./pages/BidsList";
import BidDetails from "./pages/BidDetails";
import Settings from "./pages/Settings";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MessagesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/onboarding" element={<PropertyOnboarding />} />
            <Route path="/property/add" element={<PropertyAdd />} />
            <Route path="/property/edit/:id" element={<PropertyEdit />} />
            <Route path="/property" element={<Property />} />
            <Route path="/propertyEmpty" element={<PropertyEmpty />} />
            <Route path="/property/units" element={<PropertyUnits />} />
            <Route path="/property/bids" element={<PropertyBids />} />
            <Route path="/property/bids-list" element={<BidsList />} />
            <Route path="/property/bid/:bidId" element={<BidDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contractors" element={<Contacts />} />
            <Route path="/property/contractors" element={<Contacts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MessagesSidebar />
        </BrowserRouter>
      </MessagesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
