import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-blue-flow rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-blue-flow rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Login Form */}
          <div className="order-2 lg:order-1">
            <LoginForm />
          </div>
          
          {/* Right Column - Hero Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-blue-light rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-primary rounded-full opacity-40"></div>
              
              {/* Main Hero Text */}
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Shaping the New Standard
                <br />
                <span className="text-primary">for Renovation Management</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                The all-in-one renovation management platform for property owners, 
                operators, and investors. Streamline your projects with clarity and confidence.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-blue-light rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">Project Tracking</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-blue-light rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">Budget Control</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-blue-light rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">Team Collaboration</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-blue-light rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-foreground">Real-time Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
