import { LoginCard } from "@/features/auth/components/LoginCard";

export function LoginForm() {
  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/background.jpg")' }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 z-10" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto pt-16">
        <div className="space-y-12 max-w-lg mx-auto text-center">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold font-serif">
              <span className="bg-gradient-to-r from-crimson to-burnt-sienna bg-clip-text text-transparent">
                I'm Cheesed to See You!
              </span>
            </h1>
            <p className="text-xl text-cool-gray">
              Welcome back to your pizza paradise
            </p>
          </div>
          
          <LoginCard />
        </div>
      </div>
    </div>
  )
}