import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
      
      {/* Right Column - Hero Image */}
      <div className="hidden lg:block lg:w-1/2 bg-white">
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/480dc4df-5a23-4fed-860a-767c4bec08fa.png" 
            alt="Shaping the New Standard for Renovation Management"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
