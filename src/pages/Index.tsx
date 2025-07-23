import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
      
      {/* Right Column - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src="/lovable-uploads/3d5b33cc-6a3f-44d3-868c-86f3e44588dc.png" 
          alt="Building with architectural elements"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Shaping the New Standard
          </h1>
          <h2 className="text-4xl font-bold text-primary">
            for Renovation Management
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Index;
