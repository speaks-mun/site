import { Button } from "@/components/ui/button"
import { UserStatusBanner } from "@/components/user-status-banner"
import Link from "next/link"
import { Globe, Users, Calendar, Target, Heart, Star } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* User Status */}
      <div className="p-6">
        <UserStatusBanner variant="minimal" showOnPage="all" className="inline-flex" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="bg-gradient-to-r from-primary-cta to-blue-500 bg-clip-text text-transparent">Speaks</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Empowering the Model United Nations community across South India through innovative technology and meaningful connections.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Speaks was born from a simple observation: the MUN community in South India was fragmented, 
                with incredible events happening in isolation. We wanted to change that.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform bridges the gap between delegates, organizers, and institutions, creating a 
                unified ecosystem where diplomatic excellence can flourish.
              </p>
              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-primary-cta to-blue-500 text-white">
                  Join Our Community
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-6 rounded-2xl text-center">
                <Users className="w-8 h-8 text-primary-cta mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">2K+ Delegates</h3>
                <p className="text-sm text-muted-foreground">Active community members</p>
              </div>
              <div className="bg-card p-6 rounded-2xl text-center">
                <Calendar className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">50+ Events</h3>
                <p className="text-sm text-muted-foreground">Conferences hosted</p>
              </div>
              <div className="bg-card p-6 rounded-2xl text-center">
                <Globe className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">15+ Cities</h3>
                <p className="text-sm text-muted-foreground">Across South India</p>
              </div>
              <div className="bg-card p-6 rounded-2xl text-center">
                <Target className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">100+ Organizers</h3>
                <p className="text-sm text-muted-foreground">Trusted institutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Community First</h3>
              <p className="text-muted-foreground">
                Every feature we build is designed to strengthen connections and foster collaboration within the MUN community.
              </p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for the highest standards in both our platform and the events we help organize.
              </p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Accessibility</h3>
              <p className="text-muted-foreground">
                Making MUN opportunities accessible to everyone, regardless of their background or experience level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Built by MUN Enthusiasts</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team consists of passionate MUN participants and organizers who understand the community&apos;s needs firsthand.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 