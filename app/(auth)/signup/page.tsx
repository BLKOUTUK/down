'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Mail, Lock, User, Calendar, FileText, ArrowRight, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import bcrypt from 'bcryptjs';

const STEPS = ['Account', 'Profile', 'About You', 'Review'];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    displayName: '',
    dateOfBirth: '',
    pronouns: '',
    bio: '',
    headline: '',
    referredBy: '',
    applicationNote: '',
    agreeTerms: false,
    agreePrivacy: false,
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateStep = (): boolean => {
    setError('');
    
    if (step === 0) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('All fields are required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
    }
    
    if (step === 1) {
      if (!formData.name || !formData.dateOfBirth) {
        setError('Name and date of birth are required');
        return false;
      }
      const age = calculateAge(formData.dateOfBirth);
      if (age < 18) {
        setError('You must be 18 or older to join');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.agreeTerms || !formData.agreePrivacy) {
        setError('Please agree to terms and privacy policy');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    setError('');

    try {
      // Check if email exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.email.toLowerCase())
        .single();

      if (existing) {
        throw new Error('An account with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const age = calculateAge(formData.dateOfBirth);

      // Create user
      const { data: user, error: insertError } = await supabase
        .from('users')
        .insert({
          email: formData.email.toLowerCase(),
          password: hashedPassword,
          name: formData.name,
          display_name: formData.displayName || formData.name,
          date_of_birth: formData.dateOfBirth,
          age,
          pronouns: formData.pronouns,
          bio: formData.bio,
          headline: formData.headline,
          referred_by: formData.referredBy,
          application_note: formData.applicationNote,
          role: 'MEMBER',
          application_status: 'PENDING'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Store session
      localStorage.setItem('down_user', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        application_status: user.application_status
      }));

      router.push('/pending');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxe-gradient afro-pattern py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Crown className="h-12 w-12 text-gold" />
            <span className="text-4xl font-bold text-gold">DOWN</span>
          </Link>
          <p className="text-gray-400 mt-2">Apply for Membership</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                i < step ? 'bg-gold text-black' : 
                i === step ? 'bg-gold/20 text-gold border-2 border-gold' : 
                'bg-card text-gray-500'
              }`}>
                {i < step ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 md:w-24 h-1 mx-2 ${
                  i < step ? 'bg-gold' : 'bg-card'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Step 0: Account */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Create Your Account</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="w-full bg-background/50 border border-gold/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
                    placeholder="you@example.com"
                    data-testid="signup-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    className="w-full bg-background/50 border border-gold/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
                    placeholder="Min 8 characters"
                    data-testid="signup-password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateForm('confirmPassword', e.target.value)}
                    className="w-full bg-background/50 border border-gold/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
                    placeholder="Confirm your password"
                    data-testid="signup-confirm-password"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Profile */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Your Profile</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    className="w-full bg-background/50 border border-gold/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => updateForm('displayName', e.target.value)}
                  className="w-full bg-background/50 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
                  placeholder="How you want to appear to others"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                    className="w-full bg-background/50 border border-gold/20 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold/50"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">You must be 18 or older</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pronouns</label>
                <select
                  value={formData.pronouns}
                  onChange={(e) => updateForm('pronouns', e.target.value)}
                  className="w-full bg-background/50 border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                >
                  <option value="">Select pronouns</option>
                  <option value="he/him">He/Him</option>
                  <option value="they/them">They/Them</option>
                  <option value="he/they">He/They</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: About You */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Tell Us About Yourself</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => updateForm('headline', e.target.value)}
                  className="w-full bg-background/50 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
                  placeholder="A short intro about yourself"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => updateForm('bio', e.target.value)}
                  className="w-full bg-background/50 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 h-32 resize-none"
                  placeholder="Share more about yourself, what you're looking for, your interests..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Referred By</label>
                <input
                  type="text"
                  value={formData.referredBy}
                  onChange={(e) => updateForm('referredBy', e.target.value)}
                  className="w-full bg-background/50 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50"
                  placeholder="Name of member who referred you (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Why do you want to join DOWN?</label>
                <textarea
                  value={formData.applicationNote}
                  onChange={(e) => updateForm('applicationNote', e.target.value)}
                  className="w-full bg-background/50 border border-gold/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold/50 h-24 resize-none"
                  placeholder="Tell us what drew you to our community..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gold mb-4">Review & Submit</h2>
              
              <div className="bg-background/30 rounded-lg p-4 space-y-3">
                <p className="text-gray-300"><span className="text-gold">Email:</span> {formData.email}</p>
                <p className="text-gray-300"><span className="text-gold">Name:</span> {formData.name}</p>
                <p className="text-gray-300"><span className="text-gold">Display Name:</span> {formData.displayName || formData.name}</p>
                <p className="text-gray-300"><span className="text-gold">Date of Birth:</span> {formData.dateOfBirth}</p>
                {formData.pronouns && <p className="text-gray-300"><span className="text-gold">Pronouns:</span> {formData.pronouns}</p>}
                {formData.headline && <p className="text-gray-300"><span className="text-gold">Headline:</span> {formData.headline}</p>}
              </div>

              <div className="bg-purple-dark/30 border border-purple/30 rounded-lg p-4">
                <h3 className="text-gold font-bold mb-2">Membership Terms</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• £20 one-time vetting fee upon approval</li>
                  <li>• £15/month during active cohort periods (4 months)</li>
                  <li>• £5/month during fallow periods for community access</li>
                  <li>• Access window: Thursday 4pm - Friday midnight</li>
                </ul>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => updateForm('agreeTerms', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gold/50 bg-background/50 text-gold focus:ring-gold"
                />
                <span className="text-sm text-gray-300">
                  I agree to the <span className="text-gold">Terms of Service</span> and understand the membership structure
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreePrivacy}
                  onChange={(e) => updateForm('agreePrivacy', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gold/50 bg-background/50 text-gold focus:ring-gold"
                />
                <span className="text-sm text-gray-300">
                  I agree to the <span className="text-gold">Privacy Policy</span> and consent to data processing as described
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-gold/50 text-gold rounded-lg hover:bg-gold/10 transition-colors"
              >
                Back
              </button>
            ) : (
              <Link
                href="/login"
                className="px-6 py-3 text-gray-400 hover:text-gold transition-colors"
              >
                Already have an account?
              </Link>
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-gold-gradient text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                data-testid="submit-application"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
