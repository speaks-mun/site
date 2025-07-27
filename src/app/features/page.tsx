import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Globe, 
  Users, 
  Calendar, 
  Search, 
  Filter,
  Heart,
  Bell,
  Shield,
  Smartphone,
  Zap,
  MapPin,
  CheckCircle
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Platform <span className="bg-gradient-to-r from-primary-cta to-blue-500 bg-clip-text text-transparent">Features</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to discover, create, and participate in MUN events across South India.
          </p>
          <Link href="/auth/login">
            <Button className="bg-gradient-to-r from-primary-cta to-blue-500 text-white" size="lg">
              Explore Features
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Core Features</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Event Discovery */}
            <div className="bg-card p-8 rounded-2xl border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-cta to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Event Discovery</h3>
              <p className="text-muted-foreground mb-4">
                Find MUN conferences and events across South India with our interactive map and smart search.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Interactive map view
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Advanced filtering
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Event categories
                </li>
              </ul>
            </div>

            {/* Event Creation */}
            <div className="bg-card p-8 rounded-2xl border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Event Creation</h3>
              <p className="text-muted-foreground mb-4">
                Organize your own MUN conferences with our comprehensive event management tools.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Multi-step creation form
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Invite-only access
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Real-time publishing
                </li>
              </ul>
            </div>

            {/* Community Building */}
            <div className="bg-card p-8 rounded-2xl border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Community Building</h3>
              <p className="text-muted-foreground mb-4">
                Connect with fellow MUN enthusiasts, delegates, and organizers across the region.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  User profiles
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Event bookmarking
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Networking opportunities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Advanced Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-6 rounded-xl text-center">
              <Search className="w-8 h-8 text-primary-cta mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Smart Search</h3>
              <p className="text-sm text-muted-foreground">Powerful search with filters</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl text-center">
              <Filter className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Advanced Filters</h3>
              <p className="text-sm text-muted-foreground">Filter by type, location, dates</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Bookmarks</h3>
              <p className="text-sm text-muted-foreground">Save events for later</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl text-center">
              <Bell className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground">Stay updated on events</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl text-center">
              <Shield className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Verified Events</h3>
              <p className="text-sm text-muted-foreground">All events are verified</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl text-center">
              <Smartphone className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Mobile First</h3>
              <p className="text-sm text-muted-foreground">Optimized for mobile</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl text-center">
              <Zap className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Fast Performance</h3>
              <p className="text-sm text-muted-foreground">Lightning-fast loading</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl text-center">
              <MapPin className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Location Services</h3>
              <p className="text-sm text-muted-foreground">Find nearby events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Coming Soon</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're constantly working on new features to enhance your MUN experience.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-6 rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">In-App Messaging</h3>
              <p className="text-sm text-muted-foreground">Connect directly with organizers and fellow delegates</p>
            </div>
            <div className="bg-card p-6 rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">Event Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed insights for event organizers</p>
            </div>
          </div>
          
          <Link href="/auth/login">
            <Button className="bg-gradient-to-r from-primary-cta to-blue-500 text-white" size="lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 