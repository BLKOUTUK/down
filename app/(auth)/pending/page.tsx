'use client';

import Link from 'next/link';
import { Crown, Clock, Mail, CheckCircle } from 'lucide-react';

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-luxe-gradient afro-pattern flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-2xl p-8">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-gold" />
          </div>
          
          <h1 className="text-3xl font-bold text-gold mb-4">Application Received</h1>
          
          <p className="text-gray-300 mb-6">
            Thank you for applying to join DOWN. Our community team will review your application and get back to you soon.
          </p>

          <div className="bg-background/30 rounded-lg p-4 mb-6">
            <h3 className="text-gold font-semibold mb-3">What happens next?</h3>
            <ul className="text-sm text-gray-300 space-y-3 text-left">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span>Our team reviews your application (usually within 48 hours)</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span>You'll receive an email with our decision</span>
              </li>
              <li className="flex items-start gap-2">
                <Crown className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span>If approved, you'll be invited to complete your profile and join your cohort</span>
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-block px-6 py-3 border border-gold/50 text-gold rounded-lg hover:bg-gold/10 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
