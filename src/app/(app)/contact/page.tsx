import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-heading-text mb-4">
          Contact Us
        </h1>
        <p className="text-body-text text-lg">
          Get in touch with the Speaks team. We're here to help!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-heading-text">Get Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-cta" />
                <div>
                  <p className="font-medium text-heading-text">Email</p>
                  <a 
                    href="mailto:support@speaks.com" 
                    className="text-primary-cta hover:underline"
                  >
                    support@speaks.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-primary-cta" />
                <div>
                  <p className="font-medium text-heading-text">WhatsApp</p>
                  <a 
                    href="https://wa.me/919876543210" 
                    className="text-primary-cta hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-cta" />
                <div>
                  <p className="font-medium text-heading-text">Phone</p>
                  <a 
                    href="tel:+919876543210" 
                    className="text-primary-cta hover:underline"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-cta" />
                <div>
                  <p className="font-medium text-heading-text">Location</p>
                  <p className="text-body-text">
                    Bangalore, Karnataka, India
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-heading-text">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-primary-cta text-white hover:bg-primary-cta/90"
                onClick={() => window.open('mailto:support@speaks.com?subject=General Inquiry', '_blank')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send us an email
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-primary-cta text-primary-cta hover:bg-primary-cta hover:text-white"
                onClick={() => window.open('mailto:admin@speaks.com?subject=Request for Event Creation Access', '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Request organizer access
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ or Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-heading-text">Frequently Asked</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-heading-text mb-2">
                  How do I create an event?
                </h4>
                <p className="text-body-text text-sm">
                  You need an organizer invite code. Request access through our contact form or email admin@speaks.com
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-heading-text mb-2">
                  How do I register for events?
                </h4>
                <p className="text-body-text text-sm">
                  Simply browse events on the discover page and click "Register" to be redirected to the event's registration page
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-heading-text mb-2">
                  Can I bookmark events?
                </h4>
                <p className="text-body-text text-sm">
                  Yes! Click the heart icon on any event card to bookmark it for later viewing
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-heading-text mb-2">
                  Is Speaks free to use?
                </h4>
                <p className="text-body-text text-sm">
                  Yes, Speaks is completely free for students and event discovery. Event creation requires verification.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-heading-text">About Speaks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-text">
                Speaks is South India's premier platform for Model United Nations events. 
                We connect students, colleges, and organizers to build a thriving MUN community 
                focused on diplomacy, debate, and global awareness.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 