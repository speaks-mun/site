import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserStatusBanner } from "@/components/user-status-banner";
import Link from "next/link";
import { 
  Globe, 
  Users, 
  Calendar, 
  Trophy, 
  ArrowRight, 
  Sparkles,
  MapPin,
  Star,
  CheckCircle
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-cta/5 via-transparent to-blue-500/5"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-cta/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Minimalist Theme Toggle */}
      <ThemeToggle variant="landing" />
      
      {/* Header Navigation */}
      <header className="relative z-10 flex items-center justify-between p-6 md:px-12 lg:px-16">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-cta to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <span className="text-heading-text text-2xl font-bold">Speaks</span>
            <div className="text-xs text-body-text font-medium">MUN Platform</div>
          </div>
        </div>
        
        {/* Navigation Links - Hidden on mobile */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="/discover" className="text-body-text hover:text-primary-cta transition-colors font-medium">
            Discover
          </Link>
          <Link href="/about" className="text-body-text hover:text-primary-cta transition-colors font-medium">
            About
          </Link>
          <Link href="/features" className="text-body-text hover:text-primary-cta transition-colors font-medium">
            Features
          </Link>
          <Link href="/contact" className="text-body-text hover:text-primary-cta transition-colors font-medium">
            Contact
          </Link>
        </nav>
        
        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="hidden md:inline-flex text-body-text hover:text-heading-text font-medium">
              Login
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button className="bg-gradient-to-r from-primary-cta to-blue-500 text-white hover:from-primary-cta/90 hover:to-blue-500/90 shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* User Status Indicator */}
      <div className="relative z-10 px-6 md:px-12 lg:px-16 -mt-2">
        <UserStatusBanner variant="minimal" showOnPage="all" className="inline-flex" />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 md:py-20 lg:py-24">
        {/* Floating Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-cta/10 to-blue-500/10 border border-primary-cta/20 text-primary-cta text-sm mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 mr-2" />
          South India&apos;s Premier MUN Platform
          <Star className="w-4 h-4 ml-2 fill-current" />
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-heading-text mb-8 max-w-6xl mx-auto leading-tight">
          Discover & Create{" "}
          <span className="bg-gradient-to-r from-primary-cta to-blue-500 bg-clip-text text-transparent">
            MUN Events
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-xl md:text-2xl text-body-text max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
          Connect with the vibrant Model United Nations community across South India. 
          <br className="hidden md:block" />
          Find conferences, create events, and build diplomatic excellence.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/auth/login">
            <Button 
              className="bg-gradient-to-r from-primary-cta to-blue-500 text-white hover:from-primary-cta/90 hover:to-blue-500/90 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              size="lg"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/discover">
            <Button 
              variant="outline" 
              className="border-2 border-primary-cta/30 text-heading-text hover:bg-primary-cta/10 hover:border-primary-cta px-10 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
              size="lg"
            >
              Explore Events
            </Button>
          </Link>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-20 text-body-text">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Verified Events</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Secure Platform</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Free to Join</span>
          </div>
        </div>
        
        {/* Enhanced Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-card-background/50 backdrop-blur-sm border border-border-divider/50 rounded-2xl p-6 text-center hover:bg-card-background/80 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-cta to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-primary-cta mb-2">50+</div>
            <div className="text-body-text font-medium">Active Events</div>
          </div>
          
          <div className="bg-card-background/50 backdrop-blur-sm border border-border-divider/50 rounded-2xl p-6 text-center hover:bg-card-background/80 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-emerald-500 mb-2">2K+</div>
            <div className="text-body-text font-medium">Participants</div>
          </div>
          
          <div className="bg-card-background/50 backdrop-blur-sm border border-border-divider/50 rounded-2xl p-6 text-center hover:bg-card-background/80 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">15+</div>
            <div className="text-body-text font-medium">Cities</div>
          </div>
          
          <div className="bg-card-background/50 backdrop-blur-sm border border-border-divider/50 rounded-2xl p-6 text-center hover:bg-card-background/80 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">100+</div>
            <div className="text-body-text font-medium">Organizers</div>
          </div>
        </div>
      </main>

      {/* Features Preview Section */}
      <section className="relative z-10 px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-heading-text mb-4">
              Why Choose Speaks?
            </h2>
            <p className="text-xl text-body-text max-w-3xl mx-auto">
              Everything you need to discover, create, and manage MUN events in one platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card-background/30 backdrop-blur-sm border border-border-divider/50 rounded-2xl p-8 text-center hover:bg-card-background/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-cta to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-heading-text mb-4">Discover Events</h3>
              <p className="text-body-text">
                Find MUN conferences and events across South India with our interactive map and smart filters.
              </p>
            </div>
            
            <div className="bg-card-background/30 backdrop-blur-sm border border-border-divider/50 rounded-2xl p-8 text-center hover:bg-card-background/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-heading-text mb-4">Create Events</h3>
              <p className="text-body-text">
                Organize your own MUN conferences with our comprehensive event creation and management tools.
              </p>
            </div>
            
            <div className="bg-card-background/30 backdrop-blur-sm border border-border-divider/50 rounded-2xl p-8 text-center hover:bg-card-background/60 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-heading-text mb-4">Build Community</h3>
              <p className="text-body-text">
                Connect with fellow MUN enthusiasts, delegates, and organizers in the South Indian MUN community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-heading-text mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl text-body-text mb-8">
            Start your MUN journey today and connect with thousands of delegates across South India.
          </p>
          
          <Link href="/auth/login">
            <Button 
              className="bg-gradient-to-r from-primary-cta to-blue-500 text-white hover:from-primary-cta/90 hover:to-blue-500/90 px-12 py-4 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              size="lg"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-divider/50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-cta to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-heading-text text-xl font-bold">Speaks</span>
          </div>
          
          <div className="text-body-text text-sm">
            © 2024 Speaks. All rights reserved. Building the future of MUN in South India.
          </div>
        </div>
      </footer>
    </div>
  );
}
