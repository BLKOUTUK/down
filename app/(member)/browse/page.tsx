'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Crown, MapPin, Heart, X, MessageCircle, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';
import type { User } from '@/lib/types';
import { calculateDistance, formatDistance } from '@/lib/distance';

export default function BrowsePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageMin: 18,
    ageMax: 99,
    maxDistance: 50
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    getUserLocation();
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
      .select('*')
      .eq('id', sessionUser.id)
      .single();

    if (!data || data.application_status !== 'APPROVED') {
      router.push('/login');
      return;
    }

    setCurrentUser(data);
    setFilters({
      ageMin: data.age_range_min || 18,
      ageMax: data.age_range_max || 99,
      maxDistance: data.max_distance || 50
    });
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location error:', error);
          // Default to central London
          setUserLocation({ lat: 51.5074, lon: -0.1278 });
        }
      );
    } else {
      setUserLocation({ lat: 51.5074, lon: -0.1278 });
    }
  };

  useEffect(() => {
    if (currentUser && userLocation) {
      fetchProfiles();
    }
  }, [currentUser, userLocation, filters]);

  const fetchProfiles = async () => {
    if (!currentUser) return;
    setLoading(true);

    // Get users the current user has already liked or blocked
    const { data: likedUsers } = await supabase
      .from('likes')
      .select('liked_id')
      .eq('user_id', currentUser.id);

    const { data: blockedUsers } = await supabase
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', currentUser.id);

    const excludeIds = [
      currentUser.id,
      ...(likedUsers?.map(l => l.liked_id) || []),
      ...(blockedUsers?.map(b => b.blocked_id) || [])
    ];

    // Fetch approved members
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        media(*)
      `)
      .eq('application_status', 'APPROVED')
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .gte('age', filters.ageMin)
      .lte('age', filters.ageMax)
      .order('last_active', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching profiles:', error);
      setLoading(false);
      return;
    }

    // Calculate distances and filter by max distance
    const usersWithDistance = (users || []).map(user => {
      let distance = null;
      if (userLocation && user.latitude && user.longitude) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          user.latitude,
          user.longitude
        );
      }
      return { ...user, distance };
    }).filter(user => {
      if (!user.distance) return true; // Include users without location
      return user.distance <= filters.maxDistance;
    }).sort((a, b) => {
      // Sort by distance if available
      if (a.distance && b.distance) return a.distance - b.distance;
      return 0;
    });

    setProfiles(usersWithDistance);
    setCurrentIndex(0);
    setLoading(false);
  };

  const handleLike = async () => {
    if (!currentUser || !profiles[currentIndex]) return;

    const likedUser = profiles[currentIndex];

    // Add like
    await supabase.from('likes').insert({
      user_id: currentUser.id,
      liked_id: likedUser.id
    });

    // Check if mutual
    const { data: mutualLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', likedUser.id)
      .eq('liked_id', currentUser.id)
      .single();

    if (mutualLike) {
      // It's a match! Create conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (conversation) {
        await supabase.from('conversation_participants').insert([
          { conversation_id: conversation.id, user_id: currentUser.id },
          { conversation_id: conversation.id, user_id: likedUser.id }
        ]);
      }

      // Show match notification
      alert(`It's a match! You and ${likedUser.display_name || likedUser.name} liked each other!`);
    }

    nextProfile();
  };

  const handlePass = () => {
    nextProfile();
  };

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevProfile = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentProfile = profiles[currentIndex];

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
          <h1 className="text-xl font-bold text-gold">Browse</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-b border-gold/20 p-4">
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Age Range: {filters.ageMin} - {filters.ageMax}</label>
              <div className="flex gap-4">
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={filters.ageMin}
                  onChange={(e) => setFilters(f => ({ ...f, ageMin: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="18"
                  max="99"
                  value={filters.ageMax}
                  onChange={(e) => setFilters(f => ({ ...f, ageMax: parseInt(e.target.value) }))}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Max Distance: {filters.maxDistance} miles</label>
              <input
                type="range"
                min="1"
                max="100"
                value={filters.maxDistance}
                onChange={(e) => setFilters(f => ({ ...f, maxDistance: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4">
        <div className="max-w-lg mx-auto">
          {profiles.length === 0 ? (
            <div className="text-center py-20">
              <Crown className="h-16 w-16 text-gold/50 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gold mb-2">No More Profiles</h2>
              <p className="text-gray-400 mb-6">You've seen everyone for now. Check back during the next access window!</p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-gold-gradient text-black font-bold rounded-lg"
              >
                Return to Dashboard
              </Link>
            </div>
          ) : currentProfile ? (
            <>
              {/* Profile Card */}
              <div className="bg-card/80 backdrop-blur-sm border border-gold/20 rounded-2xl overflow-hidden">
                {/* Photo */}
                <div className="relative aspect-[3/4] bg-gradient-to-b from-purple-dark to-black">
                  {currentProfile.avatar_url || currentProfile.media?.[0]?.url ? (
                    <img
                      src={currentProfile.avatar_url || currentProfile.media?.[0]?.url}
                      alt={currentProfile.display_name || currentProfile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Crown className="h-24 w-24 text-gold/30" />
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Profile info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {currentProfile.display_name || currentProfile.name}
                          {currentProfile.age && <span className="text-gold">, {currentProfile.age}</span>}
                        </h2>
                        {currentProfile.headline && (
                          <p className="text-gray-300 mt-1">{currentProfile.headline}</p>
                        )}
                        {currentProfile.distance !== undefined && currentProfile.distance !== null && (
                          <p className="text-sm text-gray-400 flex items-center gap-1 mt-2">
                            <MapPin className="h-4 w-4" />
                            {formatDistance(currentProfile.distance)}
                          </p>
                        )}
                      </div>
                      {currentProfile.is_verified && (
                        <div className="bg-gold/20 px-2 py-1 rounded-full">
                          <span className="text-gold text-sm">Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation arrows */}
                  <button
                    onClick={prevProfile}
                    disabled={currentIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white disabled:opacity-30"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextProfile}
                    disabled={currentIndex === profiles.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white disabled:opacity-30"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Profile Details */}
                <div className="p-6 space-y-4">
                  {currentProfile.bio && (
                    <p className="text-gray-300">{currentProfile.bio}</p>
                  )}

                  {currentProfile.looking_for && currentProfile.looking_for.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Looking for</p>
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.looking_for.map((item) => (
                          <span key={item} className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full">
                            {item.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentProfile.interests && currentProfile.interests.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.interests.map((interest) => (
                          <span key={interest} className="px-3 py-1 bg-purple/10 text-purple-light text-sm rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-6 mt-6">
                <button
                  onClick={handlePass}
                  className="w-16 h-16 bg-card border border-gold/20 rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-colors"
                  data-testid="pass-button"
                >
                  <X className="h-8 w-8" />
                </button>
                <button
                  onClick={handleLike}
                  className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center text-black hover:opacity-90 transition-opacity shadow-lg shadow-gold/30"
                  data-testid="like-button"
                >
                  <Heart className="h-10 w-10" />
                </button>
                <Link
                  href={`/messages?user=${currentProfile.id}`}
                  className="w-16 h-16 bg-card border border-gold/20 rounded-full flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/50 transition-colors"
                >
                  <MessageCircle className="h-8 w-8" />
                </Link>
              </div>

              {/* Counter */}
              <p className="text-center text-gray-500 text-sm mt-4">
                {currentIndex + 1} of {profiles.length} profiles
              </p>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
