import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="flex items-center justify-between p-4 md:px-8 lg:px-12">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-cta rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-heading-text text-xl font-bold">Speaks</span>
        </div>
        
        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/events" className="text-body-text hover:text-heading-text transition-colors">
            Events
          </Link>
          <Link href="/about" className="text-body-text hover:text-heading-text transition-colors">
            About
          </Link>
          <Link href="/features" className="text-body-text hover:text-heading-text transition-colors">
            Features
          </Link>
          <Link href="/contact" className="text-body-text hover:text-heading-text transition-colors">
            Contact
          </Link>
        </nav>
        
        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="ghost" className="hidden md:inline-flex text-body-text hover:text-heading-text">
              Login
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button className="bg-primary-cta text-white hover:bg-primary-cta/90">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 lg:py-32">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 text-sm mb-6">
          <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
          South India's Premier MUN Platform
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-heading-text mb-6 max-w-4xl mx-auto leading-tight">
          Discover & Create{" "}
          <span className="text-primary-cta">MUN Events</span>
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-body-text max-w-3xl mx-auto mb-12 leading-relaxed">
          Connect with the vibrant Model United Nations community across South India. 
          Find conferences, create events, and build diplomatic excellence.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-20">
          <Link href="/discover">
            <Button 
              className="bg-primary-cta text-white hover:bg-primary-cta/90 px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              Explore Events →
            </Button>
          </Link>
          
          <Link href="/auth/login">
            <Button 
              variant="outline" 
              className="border-2 border-border-divider text-heading-text hover:bg-card-background px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              Create Account
            </Button>
          </Link>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cta mb-2">50+</div>
            <div className="text-body-text">Active Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cta mb-2">2K+</div>
            <div className="text-body-text">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cta mb-2">15+</div>
            <div className="text-body-text">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cta mb-2">100+</div>
            <div className="text-body-text">Organizers</div>
          </div>
        </div>
      </main>
    </div>
  );
}
