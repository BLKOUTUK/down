// Database types for DOWN app

export type UserRole = 'MEMBER' | 'ADMIN' | 'VISITOR';
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';
export type CohortStatus = 'ACTIVE' | 'FALLOW' | 'UPCOMING';
export type EventType = 'KICKOFF' | 'DATE_NIGHT' | 'GALA' | 'WORKSHOP' | 'SOCIAL' | 'WELLNESS' | 'CULTURAL';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';
export type RelationshipStyle = 'MONOGAMOUS' | 'OPEN' | 'POLYAMOROUS' | 'EXPLORING' | 'PREFER_NOT_TO_SAY';
export type LookingFor = 'RELATIONSHIP' | 'FRIENDS' | 'DATING' | 'HOOKUPS' | 'NETWORKING' | 'OPEN_TO_ALL';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  display_name?: string;
  age?: number;
  date_of_birth?: string;
  role: UserRole;
  application_status: ApplicationStatus;
  
  // Profile
  bio?: string;
  headline?: string;
  height?: string;
  body_type?: string;
  ethnicity?: string;
  pronouns?: string;
  hiv_status?: string;
  relationship_style?: RelationshipStyle;
  looking_for?: LookingFor[];
  interests?: string[];
  sex_positions?: string[];
  kinks?: string[];
  
  // Location
  latitude?: number;
  longitude?: number;
  location_name?: string;
  last_location_update?: string;
  
  // Media
  avatar_url?: string;
  
  // Membership
  cohort_id?: string;
  member_since?: string;
  is_visitor?: boolean;
  visitor_pass_expiry?: string;
  last_active?: string;
  
  // Preferences
  age_range_min?: number;
  age_range_max?: number;
  max_distance?: number;
  
  // Verification
  is_verified?: boolean;
  verified_at?: string;
  
  // Application
  application_note?: string;
  referred_by?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relations (when joined)
  cohort?: Cohort;
  media?: Media[];
}

export interface Media {
  id: string;
  user_id: string;
  url: string;
  thumbnail_url?: string;
  type: 'image' | 'video';
  is_private: boolean;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface Cohort {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: CohortStatus;
  is_active: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;
  member_count?: number;
}

export interface Conversation {
  id: string;
  last_message?: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  messages?: Message[];
  other_user?: User;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  last_read_at?: string;
  is_typing: boolean;
  typing_at?: string;
  created_at: string;
  user?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio';
  status: MessageStatus;
  delivered_at?: string;
  read_at?: string;
  created_at: string;
  sender?: User;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: EventType;
  event_date: string;
  end_date?: string;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  max_capacity?: number;
  price: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  rsvp_count?: number;
  user_rsvp?: EventRsvp;
}

export interface EventRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'maybe' | 'not_going';
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  liked_id: string;
  created_at: string;
  is_mutual?: boolean;
}

export interface TimeWindow {
  id: string;
  day_of_week: number;
  start_hour: number;
  end_day_of_week: number;
  end_hour: number;
  is_active: boolean;
}

export interface TimeWindowStatus {
  isWithinWindow: boolean;
  nextWindowStart?: Date;
  nextWindowEnd?: Date;
  currentWindowEnd?: Date;
  timeUntilNext?: number;
}
