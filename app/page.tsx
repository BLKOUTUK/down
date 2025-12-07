import Link from 'next/link';
import { Crown, Users, Clock, Shield, Sparkles, Calendar } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-luxe-gradient afro-pattern">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-gold" />
              <span className="text-2xl font-bold text-gold">DOWN</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gold hover:text-gold-light transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gold-gradient text-black font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gold mb-6">
            Connection, Reimagined
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            A sex-positive, community-owned platform designed for Black queer men.
            Built with intentional friction that serves you, not shareholders.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-4 bg-gold-gradient text-black text-lg font-bold rounded-lg hover:opacity-90 transition-opacity shadow-2xl"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Join the Community
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-12 w-12 text-gold" />}
              title="Rotating Cohorts"
              description="4-month active periods with built-in breaks for wellbeing. Three cohorts rotate annually."
            />
            <FeatureCard
              icon={<Clock className="h-12 w-12 text-gold" />}
              title="Concentrated Windows"
              description="Access Thursday 4pm to Friday midnight. When everyone's online, they're actually available."
            />
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-gold" />}
              title="Curated Community"
              description="Capped at 500 members per cohort in London. Vetted profiles with accountability."
            />
            <FeatureCard
              icon={<Crown className="h-12 w-12 text-gold" />}
              title="Community Owned"
              description="Surplus reinvested in sexual health, mental health, and community infrastructure."
            />
            <FeatureCard
              icon={<Calendar className="h-12 w-12 text-gold" />}
              title="Weekly Events"
              description="Wednesday kick-offs, discussions, date nights, and three annual gala launches."
            />
            <FeatureCard
              icon={<Sparkles className="h-12 w-12 text-gold" />}
              title="Premium Experience"
              description="Luxe Wakanda aesthetic. Afrofuturistic design that celebrates Black excellence."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-dark to-purple p-12 rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-bold text-gold mb-6">
            Ready to Connect Differently?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join a platform that prioritizes your wellbeing and actual connection.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-4 bg-gold-gradient text-black text-lg font-bold rounded-lg hover:opacity-90 transition-opacity shadow-2xl"
          >
            Apply for Membership
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gold/20">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 DOWN. Community-owned, member-first.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all hover:shadow-xl hover:shadow-gold/10">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
