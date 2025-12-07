'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, ChevronLeft, Camera, Plus, X, Loader2, Save, MapPin, Heart, Sparkles, Shield, Flame, Calendar, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User, Media } from '@/lib/types';

const LOOKING_FOR_OPTIONS = [
  { value: 'RELATIONSHIP', label: 'Relationship' },
  { value: 'FRIENDS', label: 'Friends' },
  { value: 'DATING', label: 'Dating' },
  { value: 'HOOKUPS', label: 'Hookups' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'OPEN_TO_ALL', label: 'Open to All' }
];

const RELATIONSHIP_STYLES = [
  { value: 'MONOGAMOUS', label: 'Monogamous' },
  { value: 'OPEN', label: 'Open Relationship' },
  { value: 'POLYAMOROUS', label: 'Polyamorous' },
  { value: 'EXPLORING', label: 'Exploring' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer Not to Say' }
];

const HOSTING_OPTIONS = [
  { value: 'can_host', label: 'Can accommodate', emoji: '🏠' },
  { value: 'prefer_travel', label: 'Prefer to travel', emoji: '🚗' },
  { value: 'either', label: 'Either works', emoji: '🔄' },
  { value: 'cant_host', label: "Can't accommodate", emoji: '🚫' }
];

const POSITION_OPTIONS = [
  { value: 'top', label: 'Top', emoji: '⬆️' },
  { value: 'bottom', label: 'Bottom', emoji: '⬇️' },
  { value: 'vers', label: 'Vers', emoji: '↕️' },
  { value: 'vers_top', label: 'Vers Top', emoji: '⬆️↕️' },
  { value: 'vers_bottom', label: 'Vers Bottom', emoji: '⬇️↕️' },
  { value: 'side', label: 'Side', emoji: '↔️' }
];

const SEX_AND_ME_OPTIONS = [
  'Adventurous', 'Affectionate', 'Assertive', 'Attentive', 'Caring', 'Communicative',
  'Confident', 'Creative', 'Curious', 'Dominant', 'Energetic', 'Experimental',
  'Generous', 'Gentle', 'Intense', 'Intimate', 'Kinky', 'Passionate',
  'Patient', 'Playful', 'Romantic', 'Sensual', 'Spontaneous', 'Submissive',
  'Tender', 'Vocal', 'Wild'
];

const SEX_AND_YOU_OPTIONS = [
  'Adventurous', 'Affectionate', 'Assertive', 'Attentive', 'Caring', 'Communicative',
  'Confident', 'Creative', 'Curious', 'Dominant', 'Energetic', 'Experienced',
  'Generous', 'Gentle', 'Intense', 'Intimate', 'Kinky', 'Masculine',
  'Open-minded', 'Passionate', 'Patient', 'Playful', 'Romantic', 'Sensual',
  'Spontaneous', 'Submissive', 'Tender', 'Vocal'
];

const INTEREST_SUGGESTIONS = [
  'Music', 'Art', 'Film', 'Theatre', 'Reading', 'Writing', 'Travel', 'Food', 'Cooking',
  'Fitness', 'Yoga', 'Dancing', 'Fashion', 'Photography', 'Gaming', 'Sports', 'Nightlife',
  'Politics', 'Activism', 'Spirituality', 'Nature', 'Tech', 'Science', 'History'
];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Form state
  const [formData, setFormData] = useState({
    display_name: '',
    headline: '',
    bio: '',
    age: 0,
    height: '',
    body_type: '',
    pronouns: '',
    hiv_status: '',
    relationship_style: '',
    looking_for: [] as string[],
    interests: [] as string[],
    age_range_min: 18,
    age_range_max: 99,
    max_distance: 50,
    // Sex-positive fields
    hosting_preference: '',
    sexual_position: '',
    sex_and_me: [] as string[],
    sex_and_you: [] as string[],
    last_health_checkup: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const stored = localStorage.getItem('down_user');
    if (!stored) {
      router.push('/login');
      return;
    }

    const sessionUser = JSON.parse(stored);
    
    const { data } = await supabase
      .from('users')
      .select(`
        *,
        media(*)
      `)
      .eq('id', sessionUser.id)
      .single();

    if (!data) {
      router.push('/login');
      return;
    }

    setUser(data);
    setMedia(data.media || []);
    setFormData({
      display_name: data.display_name || '',
      headline: data.headline || '',
      bio: data.bio || '',
      age: data.age || 0,
      height: data.height || '',
      body_type: data.body_type || '',
      pronouns: data.pronouns || '',
      hiv_status: data.hiv_status || '',
      relationship_style: data.relationship_style || '',
      looking_for: data.looking_for || [],
      interests: data.interests || [],
      age_range_min: data.age_range_min || 18,
      age_range_max: data.age_range_max || 99,
      max_distance: data.max_distance || 50,
      // Sex-positive fields
      hosting_preference: data.hosting_preference || '',
      sexual_position: data.sexual_position || '',
      sex_and_me: data.sex_and_me || [],
      sex_and_you: data.sex_and_you || [],
      last_health_checkup: data.last_health_checkup || ''
    });
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('users')
      .update(formData)
      .eq('id', user.id);

    if (error) {
      alert('Failed to save profile');
    } else {
      alert('Profile saved!');
    }
    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const isVideo = file.type.startsWith('video/');

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-media')
        .getPublicUrl(fileName);

      // Save to media table
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert({
          user_id: user.id,
          url: urlData.publicUrl,
          type: isVideo ? 'video' : 'image',
          is_primary: media.length === 0,
          order: media.length
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      setMedia(prev => [...prev, mediaData]);

      // Update avatar if first photo
      if (media.length === 0 && !isVideo) {
        await supabase
          .from('users')
          .update({ avatar_url: urlData.publicUrl })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId);

    if (!error) {
      setMedia(prev => prev.filter(m => m.id !== mediaId));
    }
  };

  const handleSetPrimary = async (mediaId: string) => {
    if (!user) return;

    // Reset all to non-primary
    await supabase
      .from('media')
      .update({ is_primary: false })
      .eq('user_id', user.id);

    // Set selected as primary
    const { error } = await supabase
      .from('media')
      .update({ is_primary: true })
      .eq('id', mediaId);

    if (!error) {
      const selectedMedia = media.find(m => m.id === mediaId);
      if (selectedMedia) {
        await supabase
          .from('users')
          .update({ avatar_url: selectedMedia.url })
          .eq('id', user.id);
      }
      setMedia(prev => prev.map(m => ({ ...m, is_primary: m.id === mediaId })));
    }
  };

  const toggleLookingFor = (value: string) => {
    setFormData(prev => ({
      ...prev,
      looking_for: prev.looking_for.includes(value)
        ? prev.looking_for.filter(v => v !== value)
        : [...prev.looking_for, value]
    }));
  };

  const toggleInterest = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter(v => v !== value)
        : [...prev.interests, value]
    }));
  };

  const toggleSexAndMe = (value: string) => {
    setFormData(prev => ({
      ...prev,
      sex_and_me: prev.sex_and_me.includes(value)
        ? prev.sex_and_me.filter(v => v !== value)
        : prev.sex_and_me.length < 3 
          ? [...prev.sex_and_me, value]
          : prev.sex_and_me // Max 3
    }));
  };

  const toggleSexAndYou = (value: string) => {
    setFormData(prev => ({
      ...prev,
      sex_and_you: prev.sex_and_you.includes(value)
        ? prev.sex_and_you.filter(v => v !== value)
        : prev.sex_and_you.length < 3 
          ? [...prev.sex_and_you, value]
          : prev.sex_and_you // Max 3
    }));
  };

  const getHealthCheckupStatus = () => {
    if (!formData.last_health_checkup) return { status: 'unknown', message: 'Not recorded' };
    const lastCheck = new Date(formData.last_health_checkup);
    const now = new Date();
    const monthsDiff = (now.getFullYear() - lastCheck.getFullYear()) * 12 + (now.getMonth() - lastCheck.getMonth());
    
    if (monthsDiff <= 3) return { status: 'good', message: 'Up to date', color: 'text-green-400' };
    if (monthsDiff <= 6) return { status: 'due', message: 'Due soon', color: 'text-yellow-400' };
    return { status: 'overdue', message: 'Overdue', color: 'text-red-400' };
  };

  const updateLocation = () => {
    if (!navigator.geolocation || !user) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await supabase
          .from('users')
          .update({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            last_location_update: new Date().toISOString()
          })
          .eq('id', user.id);
        alert('Location updated!');
      },
      (error) => {
        alert('Could not get location');
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxe-gradient afro-pattern flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxe-gradient afro-pattern">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gold">
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-xl font-bold text-gold">My Profile</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gold-gradient text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden border-4 border-gold/30">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Crown className="h-16 w-16 text-gold/50" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black hover:opacity-90 transition-opacity"
              >
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gold mt-4">
              {user?.display_name || user?.name}
            </h2>
            <p className="text-gray-400">{user?.email}</p>
            {user?.is_verified && (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-gold/20 text-gold text-sm rounded-full">
                <Shield className="h-4 w-4" /> Verified
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gold/20 mb-6 overflow-x-auto">
            {['photos', 'about', 'intimacy', 'preferences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center font-medium capitalize transition-colors whitespace-nowrap px-2 ${
                  activeTab === tab
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-400 hover:text-gold'
                }`}
              >
                {tab === 'intimacy' ? '🔥 Intimacy' : tab}
              </button>
            ))}
          </div>

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {media.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden bg-card border border-gold/20">
                    {item.type === 'video' ? (
                      <video src={item.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    )}
                    {item.is_primary && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-gold text-black text-xs font-bold rounded">
                        Primary
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!item.is_primary && item.type === 'image' && (
                        <button
                          onClick={() => handleSetPrimary(item.id)}
                          className="p-2 bg-gold rounded-full text-black"
                          title="Set as primary"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="p-2 bg-red-500 rounded-full text-white"
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Add Photo Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-lg border-2 border-dashed border-gold/30 flex flex-col items-center justify-center text-gold/50 hover:text-gold hover:border-gold/50 transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-8 w-8" />
                      <span className="text-xs mt-1">Add Photo/Video</span>
                    </>
                  )}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <p className="text-sm text-gray-500 text-center">
                Photos with your face visible are required for verification. Videos up to 30 seconds are supported.
              </p>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData(f => ({ ...f, display_name: e.target.value }))}
                  className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                  placeholder="How you want to appear"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData(f => ({ ...f, headline: e.target.value }))}
                  className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                  placeholder="A short intro"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(f => ({ ...f, bio: e.target.value }))}
                  className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50 h-32 resize-none"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pronouns</label>
                  <select
                    value={formData.pronouns}
                    onChange={(e) => setFormData(f => ({ ...f, pronouns: e.target.value }))}
                    className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                  >
                    <option value="">Select</option>
                    <option value="he/him">He/Him</option>
                    <option value="they/them">They/Them</option>
                    <option value="he/they">He/They</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData(f => ({ ...f, height: e.target.value }))}
                    className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                    placeholder="e.g. 5'10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Relationship Style</label>
                <select
                  value={formData.relationship_style}
                  onChange={(e) => setFormData(f => ({ ...f, relationship_style: e.target.value }))}
                  className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                >
                  <option value="">Select</option>
                  {RELATIONSHIP_STYLES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Looking For</label>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => toggleLookingFor(opt.value)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        formData.looking_for.includes(opt.value)
                          ? 'bg-gold text-black'
                          : 'bg-card border border-gold/20 text-gray-400 hover:border-gold/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_SUGGESTIONS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-purple text-white'
                          : 'bg-card border border-purple/20 text-gray-400 hover:border-purple/50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Intimacy Tab */}
          {activeTab === 'intimacy' && (
            <div className="space-y-6">
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Flame className="h-6 w-6 text-pink-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-pink-400">Sex Positive Space</h3>
                    <p className="text-sm text-gray-400">This information helps you find compatible connections. All fields are optional and only visible to other members.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hosting</label>
                  <select
                    value={formData.hosting_preference}
                    onChange={(e) => setFormData(f => ({ ...f, hosting_preference: e.target.value }))}
                    className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                  >
                    <option value="">Select</option>
                    {HOSTING_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.emoji} {opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <select
                    value={formData.sexual_position}
                    onChange={(e) => setFormData(f => ({ ...f, sexual_position: e.target.value }))}
                    className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                  >
                    <option value="">Select</option>
                    {POSITION_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.emoji} {opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sex & Me <span className="text-gold">(Pick up to 3)</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">How would you describe yourself intimately?</p>
                <div className="flex flex-wrap gap-2">
                  {SEX_AND_ME_OPTIONS.map(option => (
                    <button
                      key={option}
                      onClick={() => toggleSexAndMe(option)}
                      disabled={!formData.sex_and_me.includes(option) && formData.sex_and_me.length >= 3}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.sex_and_me.includes(option)
                          ? 'bg-pink-500 text-white'
                          : formData.sex_and_me.length >= 3
                            ? 'bg-card border border-gray-700 text-gray-600 cursor-not-allowed'
                            : 'bg-card border border-pink-500/30 text-gray-400 hover:border-pink-500/60'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sex & You <span className="text-gold">(Pick up to 3)</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">What are you looking for in a partner?</p>
                <div className="flex flex-wrap gap-2">
                  {SEX_AND_YOU_OPTIONS.map(option => (
                    <button
                      key={option}
                      onClick={() => toggleSexAndYou(option)}
                      disabled={!formData.sex_and_you.includes(option) && formData.sex_and_you.length >= 3}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.sex_and_you.includes(option)
                          ? 'bg-purple text-white'
                          : formData.sex_and_you.length >= 3
                            ? 'bg-card border border-gray-700 text-gray-600 cursor-not-allowed'
                            : 'bg-card border border-purple/30 text-gray-400 hover:border-purple/60'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gold/20">
                <h3 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sexual Health
                </h3>
                
                <div className="bg-card/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300">Last Checkup</p>
                      <p className={`text-sm ${getHealthCheckupStatus().color || 'text-gray-500'}`}>
                        {getHealthCheckupStatus().message}
                      </p>
                    </div>
                    {formData.last_health_checkup && (
                      <div className="text-right">
                        <p className="text-gold font-semibold">
                          {new Date(formData.last_health_checkup).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date of Last Checkup
                  </label>
                  <input
                    type="date"
                    value={formData.last_health_checkup}
                    onChange={(e) => setFormData(f => ({ ...f, last_health_checkup: e.target.value }))}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full bg-card border border-gold/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-teal-400 font-medium">Regular testing is self-care</p>
                      <p className="text-xs text-gray-400 mt-1">
                        We recommend getting tested every 3 months if sexually active. 
                        Find your nearest clinic at <a href="https://www.tht.org.uk/centres-and-services" target="_blank" rel="noopener noreferrer" className="text-teal-400 underline">THT</a> or 
                        <a href="https://www.nhs.uk/service-search/sexual-health" target="_blank" rel="noopener noreferrer" className="text-teal-400 underline ml-1">NHS Sexual Health</a>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age Range: {formData.age_range_min} - {formData.age_range_max}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="18"
                    max="99"
                    value={formData.age_range_min}
                    onChange={(e) => setFormData(f => ({ ...f, age_range_min: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-gold">to</span>
                  <input
                    type="range"
                    min="18"
                    max="99"
                    value={formData.age_range_max}
                    onChange={(e) => setFormData(f => ({ ...f, age_range_max: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Distance: {formData.max_distance} miles
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.max_distance}
                  onChange={(e) => setFormData(f => ({ ...f, max_distance: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div className="pt-4 border-t border-gold/20">
                <h3 className="text-lg font-bold text-gold mb-4">Location</h3>
                <button
                  onClick={updateLocation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-card border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-colors"
                >
                  <MapPin className="h-5 w-5" />
                  Update My Location
                </button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Your location is used to show nearby members. It's approximate and never shared exactly.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
