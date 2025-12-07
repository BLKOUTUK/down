-- DOWN Dating App Schema for Supabase
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('MEMBER', 'ADMIN', 'VISITOR');
CREATE TYPE application_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED');
CREATE TYPE cohort_status AS ENUM ('ACTIVE', 'FALLOW', 'UPCOMING');
CREATE TYPE event_type AS ENUM ('KICKOFF', 'DATE_NIGHT', 'GALA', 'WORKSHOP', 'SOCIAL', 'WELLNESS', 'CULTURAL');
CREATE TYPE message_status AS ENUM ('SENT', 'DELIVERED', 'READ');
CREATE TYPE relationship_style AS ENUM ('MONOGAMOUS', 'OPEN', 'POLYAMOROUS', 'EXPLORING', 'PREFER_NOT_TO_SAY');
CREATE TYPE looking_for AS ENUM ('RELATIONSHIP', 'FRIENDS', 'DATING', 'HOOKUPS', 'NETWORKING', 'OPEN_TO_ALL');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT NOT NULL,
  display_name TEXT,
  age INT,
  date_of_birth DATE,
  role user_role DEFAULT 'MEMBER',
  application_status application_status DEFAULT 'PENDING',
  
  -- Profile fields
  bio TEXT,
  headline TEXT,
  height TEXT,
  body_type TEXT,
  ethnicity TEXT,
  pronouns TEXT,
  hiv_status TEXT,
  relationship_style relationship_style,
  looking_for looking_for[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  sex_positions TEXT[] DEFAULT '{}',
  kinks TEXT[] DEFAULT '{}',
  
  -- Location
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  location_name TEXT,
  last_location_update TIMESTAMPTZ,
  
  -- Media
  avatar_url TEXT,
  
  -- Cohort & Membership
  cohort_id UUID,
  member_since TIMESTAMPTZ,
  is_visitor BOOLEAN DEFAULT FALSE,
  visitor_pass_expiry TIMESTAMPTZ,
  last_active TIMESTAMPTZ,
  
  -- Preferences
  age_range_min INT DEFAULT 18,
  age_range_max INT DEFAULT 99,
  max_distance INT DEFAULT 50,
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  
  -- Application fields
  application_note TEXT,
  referred_by TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media table for profile photos/videos
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  type TEXT DEFAULT 'image', -- image, video
  is_private BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  "order" INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cohorts table
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status cohort_status DEFAULT 'UPCOMING',
  is_active BOOLEAN DEFAULT FALSE,
  max_members INT DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for cohort
ALTER TABLE users ADD CONSTRAINT fk_cohort FOREIGN KEY (cohort_id) REFERENCES cohorts(id);

-- Time windows table
CREATE TABLE time_windows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INT DEFAULT 4, -- Thursday
  start_hour INT DEFAULT 16, -- 4pm
  end_day_of_week INT DEFAULT 5, -- Friday
  end_hour INT DEFAULT 24, -- Midnight
  is_active BOOLEAN DEFAULT TRUE
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  last_message TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  is_typing BOOLEAN DEFAULT FALSE,
  typing_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT, -- image, video, audio
  status message_status DEFAULT 'SENT',
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  image_url TEXT,
  max_capacity INT,
  price DECIMAL(10,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'going', -- going, maybe, not_going
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Endorsements
CREATE TABLE endorsements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endorser_id UUID REFERENCES users(id),
  message TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endorser_id)
);

-- Likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  liked_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, liked_id)
);

-- Blocks
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID REFERENCES users(id),
  reported_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, resolved
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor passes
CREATE TABLE visitor_passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 25,
  weekend_start TIMESTAMPTZ NOT NULL,
  weekend_end TIMESTAMPTZ NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_application_status ON users(application_status);
CREATE INDEX idx_users_cohort ON users(cohort_id);
CREATE INDEX idx_users_location ON users(latitude, longitude);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_media_user ON media(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Anyone can read approved profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON users
  FOR SELECT USING (application_status = 'APPROVED' OR auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can insert (signup)" ON users
  FOR INSERT WITH CHECK (true);

-- Media: Viewable if not private or owner
CREATE POLICY "Media viewable" ON media
  FOR SELECT USING (is_private = FALSE OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own media" ON media
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Events: Public events viewable by all
CREATE POLICY "Public events viewable" ON events
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'ADMIN')
  );

-- Messages: Only participants can view
CREATE POLICY "Message participants can view" ON messages
  FOR SELECT USING (
    auth.uid()::text = sender_id::text OR auth.uid()::text = receiver_id::text
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid()::text = sender_id::text);

-- Cohorts: Viewable by all
CREATE POLICY "Cohorts viewable by all" ON cohorts
  FOR SELECT USING (true);

-- Insert default time window
INSERT INTO time_windows (day_of_week, start_hour, end_day_of_week, end_hour, is_active)
VALUES (4, 16, 5, 24, true);

-- Insert initial cohorts
INSERT INTO cohorts (name, description, start_date, end_date, status, is_active)
VALUES 
  ('Cohort Alpha', 'The founding cohort of DOWN', '2025-02-01', '2025-05-31', 'ACTIVE', true),
  ('Cohort Beta', 'Second wave of community builders', '2025-06-01', '2025-09-30', 'UPCOMING', false),
  ('Cohort Gamma', 'Third rotation', '2025-10-01', '2026-01-31', 'UPCOMING', false);

-- Create storage buckets (run separately in Storage settings or use this)
-- Storage buckets are created via Supabase Dashboard > Storage

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for messages and typing indicators
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;

-- Add partnership fields to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_partnership BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_name TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_logo_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_website TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_type TEXT; -- lifestyle, voluntary, cultural, health, advocacy

-- Create partners table for reusable partner profiles
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  partner_type TEXT NOT NULL, -- lifestyle, voluntary, cultural, health, advocacy
  instagram TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some example Black queer UK organizations
INSERT INTO partners (name, partner_type, description, website) VALUES
('UK Black Pride', 'advocacy', 'Europe''s largest celebration for LGBTQ+ people of African, Asian, Caribbean, Latin American and Middle Eastern descent', 'https://ukblackpride.org.uk'),
('Black Out UK', 'lifestyle', 'A safe space for Black gay/bi men and allies to connect and engage', 'https://blkoutuk.com'),
('Stonewall', 'advocacy', 'LGBTQ+ rights charity campaigning for equality', 'https://stonewall.org.uk'),
('GMFA', 'health', 'Gay men''s health charity', 'https://gmfa.org.uk'),
('NAZ Project', 'health', 'Sexual health services for BAME communities', 'https://naz.org.uk'),
('Opening Doors London', 'voluntary', 'Supporting LGBTQ+ people over 50', 'https://openingdoorslondon.org.uk'),
('Queer Britain', 'cultural', 'UK''s first LGBTQ+ museum', 'https://queerbritain.org.uk')
ON CONFLICT DO NOTHING;
