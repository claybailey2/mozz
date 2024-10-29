import { SignupForm } from '@/features/auth/SignupForm'

export function HomePage() {
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
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold font-serif">
              <span className="bg-gradient-to-r from-crimson to-burnt-sienna bg-clip-text text-transparent">
                Craft Your Perfect
              </span>
              <br />
              Pizza Menu
            </h1>
            
            <p className="text-xl text-slate-600">
              Empower your pizza chefs with an intuitive menu management system. 
              Create, customize, and collaborate on your pizza offerings with ease.
            </p>
            
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-burnt-sienna" />
                Easy menu management for multiple locations
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-burnt-sienna" />
                Seamless chef collaboration
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-burnt-sienna" />
                Real-time topping inventory tracking
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-6">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}