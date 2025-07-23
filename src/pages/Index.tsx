import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
      
      {/* Right Column - Hero Content */}
      <div className="hidden lg:block lg:w-1/2 bg-white">
        <div className="w-full h-full flex flex-col md:flex-row justify-between gap-16 items-center px-5 md:px-10">
          {/* Text Block */}
          <div className="flex flex-col justify-center items-start text-left gap-8">
            <h1 className="lg:text-[72px] md:text-[56px] text-[36px] font-semibold leading-none max-w-[900px] bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Shaping the new standard for renovation management
            </h1>
          </div>
          
          {/* Image Block */}
          <div>
            <img 
              src="/lovable-uploads/0d24ec0e-6cc1-4a91-ba1e-c10a73e6503b.png" 
              alt="Modern building with architectural elements"
              className="w-full max-w-[600px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
