import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
      
      {/* Right Column - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-white">
        <div className="flex items-center justify-center h-full">
          <img 
            src="/lovable-uploads/0d24ec0e-6cc1-4a91-ba1e-c10a73e6503b.png" 
            alt="Modern building with architectural elements"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-16 left-8 right-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
            Shaping the New Standard
          </h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            for Renovation Management
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Index;
