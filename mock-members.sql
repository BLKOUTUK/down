-- Mock Members for DOWN Dating App
-- All users can login with password: admin123

-- Add the new columns first (run these if not already added)
ALTER TABLE users ADD COLUMN IF NOT EXISTS hosting_preference TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sexual_position TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS sex_and_me TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS sex_and_you TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_health_checkup DATE;

-- Add partnership fields to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_partnership BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_name TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_logo_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_website TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS partner_type TEXT;

-- Insert admin user
INSERT INTO users (email, password, name, display_name, role, application_status)
VALUES ('admin@down.community', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG', 'Admin User', 'Admin', 'ADMIN', 'APPROVED')
ON CONFLICT (email) DO NOTHING;

-- Insert 20 mock members
INSERT INTO users (
  email, password, name, display_name, age, pronouns, bio, headline,
  role, application_status,
  looking_for, interests, relationship_style,
  height, body_type, location_name, latitude, longitude,
  is_verified, member_since, last_active,
  hosting_preference, sexual_position, sex_and_me, sex_and_you, last_health_checkup
) VALUES

-- Member 1: Marcus
('marcus@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Marcus Johnson', 'Marcus J', 32, 'he/him',
'Creative director by day, home chef by night. Looking for someone who appreciates good food and better conversation.',
'Creative soul seeking genuine connection',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'DATING']::text[], ARRAY['Art', 'Cooking', 'Film', 'Travel', 'Photography']::text[], 'MONOGAMOUS',
'6''1"', 'Athletic', 'Brixton, London', 51.4613, -0.1156,
true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '2 hours',
'can_host', 'vers_top', ARRAY['Passionate', 'Attentive', 'Romantic']::text[], ARRAY['Affectionate', 'Communicative', 'Sensual']::text[], '2025-06-15'),

-- Member 2: Kwame
('kwame@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Kwame Asante', 'Kwame', 28, 'he/him',
'Software engineer with a passion for music production. Weekend DJ at queer nights. Always down for a spontaneous adventure.',
'Tech nerd with good vibes',
'MEMBER', 'APPROVED',
ARRAY['DATING', 'FRIENDS', 'HOOKUPS']::text[], ARRAY['Music', 'Tech', 'Gaming', 'Nightlife', 'Fitness']::text[], 'OPEN',
'5''10"', 'Slim', 'Shoreditch, London', 51.5245, -0.0792,
true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 hour',
'either', 'vers', ARRAY['Adventurous', 'Playful', 'Energetic']::text[], ARRAY['Spontaneous', 'Open-minded', 'Confident']::text[], '2025-07-20'),

-- Member 3: Jamal
('jamal@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Jamal Williams', 'Jay', 35, 'he/him',
'Lawyer who knows how to leave work at work. Love theatre, brunch, and deep conversations. Looking for my person.',
'Professional by day, romantic by nature',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP']::text[], ARRAY['Theatre', 'Reading', 'Food', 'Wine', 'Politics']::text[], 'MONOGAMOUS',
'5''11"', 'Average', 'Canary Wharf, London', 51.5054, -0.0235,
true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 hours',
'can_host', 'bottom', ARRAY['Romantic', 'Sensual', 'Intimate']::text[], ARRAY['Dominant', 'Assertive', 'Caring']::text[], '2025-05-10'),

-- Member 4: Darnell
('darnell@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Darnell Brown', 'Dee', 26, 'he/they',
'Non-binary artist and activist. Creating spaces for our community through art. Vegan foodie always looking for new spots.',
'Art is resistance ✊🏿',
'MEMBER', 'APPROVED',
ARRAY['FRIENDS', 'DATING', 'NETWORKING']::text[], ARRAY['Art', 'Activism', 'Food', 'Fashion', 'Writing']::text[], 'POLYAMOROUS',
'5''8"', 'Slim', 'Peckham, London', 51.4693, -0.0686,
false, NOW() - INTERVAL '1 month', NOW() - INTERVAL '30 minutes',
'prefer_travel', 'vers_bottom', ARRAY['Creative', 'Gentle', 'Curious']::text[], ARRAY['Patient', 'Open-minded', 'Tender']::text[], '2025-07-01'),

-- Member 5: Tyrone
('tyrone@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Tyrone Clarke', 'Ty', 41, 'he/him',
'Been around long enough to know what I want. NHS doctor, gym enthusiast, terrible dancer but always the first on the floor.',
'Mature, grounded, and still young at heart',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'FRIENDS']::text[], ARRAY['Fitness', 'Wellness', 'Travel', 'Science', 'Dancing']::text[], 'MONOGAMOUS',
'6''2"', 'Muscular', 'Hampstead, London', 51.5565, -0.1781,
true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '1 day',
'can_host', 'top', ARRAY['Confident', 'Caring', 'Generous']::text[], ARRAY['Submissive', 'Affectionate', 'Sensual']::text[], '2025-08-01'),

-- Member 6: Andre
('andre@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Andre Thompson', 'Dre', 29, 'he/him',
'Fitness coach helping our community get stronger. Love a good laugh and don''t take myself too seriously. Dog dad to a rescue staffie.',
'Gains and good energy only 💪🏿',
'MEMBER', 'APPROVED',
ARRAY['DATING', 'HOOKUPS', 'FRIENDS']::text[], ARRAY['Fitness', 'Sports', 'Nature', 'Dogs', 'Comedy']::text[], 'OPEN',
'5''9"', 'Muscular', 'Stratford, London', 51.5430, -0.0005,
true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 hours',
'either', 'vers_top', ARRAY['Energetic', 'Playful', 'Wild']::text[], ARRAY['Adventurous', 'Confident', 'Spontaneous']::text[], '2025-06-20'),

-- Member 7: Oluwaseun
('seun@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Oluwaseun Adeyemi', 'Seun', 31, 'he/him',
'Nigerian-British banker who''s more than his job. Passionate about mentoring young Black professionals.',
'Success with substance',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'NETWORKING']::text[], ARRAY['Finance', 'Mentoring', 'Food', 'Travel', 'Politics']::text[], 'MONOGAMOUS',
'5''11"', 'Athletic', 'City of London', 51.5155, -0.0922,
true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '6 hours',
'can_host', 'vers', ARRAY['Assertive', 'Passionate', 'Generous']::text[], ARRAY['Intelligent', 'Confident', 'Romantic']::text[], '2025-07-15'),

-- Member 8: Leroy
('leroy@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Leroy Mitchell', 'Leroy', 38, 'he/him',
'Caribbean roots, London raised. Chef at a Michelin restaurant. Food is love, and I''ve got plenty to share.',
'Feed you well, treat you better',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'DATING']::text[], ARRAY['Cooking', 'Food', 'Travel', 'Nature', 'Music']::text[], 'MONOGAMOUS',
'6''0"', 'Average', 'Notting Hill, London', 51.5139, -0.2052,
false, NOW() - INTERVAL '4 months', NOW() - INTERVAL '12 hours',
'can_host', 'top', ARRAY['Romantic', 'Attentive', 'Sensual']::text[], ARRAY['Affectionate', 'Appreciative', 'Tender']::text[], '2025-04-30'),

-- Member 9: Xavier
('xavier@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Xavier Reid', 'Xav', 25, 'he/him',
'Recent grad figuring life out. Music journalist by day, bedroom producer by night. Looking for good vibes.',
'Young, ambitious, and open',
'MEMBER', 'APPROVED',
ARRAY['DATING', 'FRIENDS', 'HOOKUPS']::text[], ARRAY['Music', 'Writing', 'Nightlife', 'Fashion', 'Gaming']::text[], 'EXPLORING',
'5''7"', 'Slim', 'Dalston, London', 51.5483, -0.0757,
false, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '15 minutes',
'prefer_travel', 'vers_bottom', ARRAY['Curious', 'Playful', 'Spontaneous']::text[], ARRAY['Experienced', 'Patient', 'Dominant']::text[], '2025-08-05'),

-- Member 10: Malik
('malik@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Malik Hassan', 'Malik', 33, 'he/him',
'Architect designing spaces that inspire. Quiet confidence, loud laugh. Looking for someone who can match my energy.',
'Building dreams, seeking connection',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP']::text[], ARRAY['Art', 'Architecture', 'Photography', 'Travel', 'Yoga']::text[], 'MONOGAMOUS',
'6''0"', 'Athletic', 'King''s Cross, London', 51.5320, -0.1245,
true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '4 hours',
'can_host', 'vers_top', ARRAY['Creative', 'Passionate', 'Intense']::text[], ARRAY['Intelligent', 'Sensual', 'Communicative']::text[], '2025-06-01'),

-- Member 11: Jerome
('jerome@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Jerome Davis', 'Rome', 30, 'he/him',
'Actor and drama teacher. Every conversation is an audition for my heart. Hopeless romantic who believes in movie-worthy love.',
'Main character energy ✨',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'DATING']::text[], ARRAY['Theatre', 'Film', 'Dancing', 'Reading', 'Travel']::text[], 'MONOGAMOUS',
'5''10"', 'Average', 'Greenwich, London', 51.4826, -0.0077,
true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 hours',
'either', 'vers', ARRAY['Romantic', 'Vocal', 'Passionate']::text[], ARRAY['Affectionate', 'Spontaneous', 'Adventurous']::text[], '2025-07-10'),

-- Member 12: Kofi
('kofi@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Kofi Mensah', 'Kofi', 27, 'he/him',
'Ghanaian-British entrepreneur. Started a sustainable fashion brand that celebrates African textiles.',
'Fashion-forward, future-focused',
'MEMBER', 'APPROVED',
ARRAY['DATING', 'NETWORKING', 'FRIENDS']::text[], ARRAY['Fashion', 'Business', 'Art', 'Travel', 'Activism']::text[], 'OPEN',
'5''9"', 'Slim', 'Hackney, London', 51.5450, -0.0553,
false, NOW() - INTERVAL '1 month', NOW() - INTERVAL '8 hours',
'either', 'vers_bottom', ARRAY['Creative', 'Adventurous', 'Playful']::text[], ARRAY['Confident', 'Assertive', 'Generous']::text[], '2025-05-20'),

-- Member 13: Darren
('darren@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Darren Taylor', 'D', 36, 'he/him',
'Mental health therapist specialising in LGBTQ+ wellbeing. Believe in the power of vulnerability.',
'Here to connect, not collect',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP']::text[], ARRAY['Wellness', 'Reading', 'Yoga', 'Nature', 'Spirituality']::text[], 'MONOGAMOUS',
'5''11"', 'Average', 'Clapham, London', 51.4618, -0.1384,
true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '1 day',
'can_host', 'side', ARRAY['Intimate', 'Gentle', 'Communicative']::text[], ARRAY['Patient', 'Affectionate', 'Tender']::text[], '2025-08-10'),

-- Member 14: Nathaniel
('nathaniel@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Nathaniel James', 'Nate', 24, 'he/they',
'Non-binary makeup artist for film and TV. Breaking boundaries in beauty. Love a good rave.',
'Colour outside the lines 🎨',
'MEMBER', 'APPROVED',
ARRAY['DATING', 'FRIENDS', 'HOOKUPS']::text[], ARRAY['Art', 'Fashion', 'Nightlife', 'Film', 'Music']::text[], 'POLYAMOROUS',
'5''6"', 'Slim', 'Camden, London', 51.5391, -0.1426,
false, NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '45 minutes',
'prefer_travel', 'bottom', ARRAY['Submissive', 'Playful', 'Sensual']::text[], ARRAY['Dominant', 'Assertive', 'Experienced']::text[], '2025-07-25'),

-- Member 15: Terrence
('terrence@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Terrence Walker', 'Terry', 44, 'he/him',
'University professor teaching African diaspora studies. Silver fox who''s earned every grey hair.',
'Distinguished and down to earth',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'FRIENDS']::text[], ARRAY['History', 'Reading', 'Politics', 'Travel', 'Wine']::text[], 'MONOGAMOUS',
'5''10"', 'Average', 'Bloomsbury, London', 51.5246, -0.1289,
true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '3 days',
'can_host', 'top', ARRAY['Confident', 'Patient', 'Generous']::text[], ARRAY['Curious', 'Intelligent', 'Submissive']::text[], '2025-06-05'),

-- Member 16: Jordan
('jordan@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Jordan Campbell', 'JC', 28, 'he/him',
'Professional footballer (you''ve probably not heard of my club). Keeping my identity private here, but open about who I am.',
'More than the game',
'MEMBER', 'APPROVED',
ARRAY['DATING', 'HOOKUPS']::text[], ARRAY['Sports', 'Fitness', 'Gaming', 'Travel', 'Music']::text[], 'PREFER_NOT_TO_SAY',
'6''1"', 'Athletic', 'Fulham, London', 51.4749, -0.2106,
false, NOW() - INTERVAL '1 month', NOW() - INTERVAL '20 minutes',
'prefer_travel', 'vers_top', ARRAY['Confident', 'Energetic', 'Wild']::text[], ARRAY['Discreet', 'Adventurous', 'Spontaneous']::text[], '2025-07-30'),

-- Member 17: Ezra
('ezra@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Ezra Solomon', 'Ez', 31, 'he/him',
'Ethiopian-British photographer documenting Black queer joy. My work has been in galleries, but I''m most proud of community portraits.',
'Seeing beauty everywhere',
'MEMBER', 'APPROVED',
ARRAY['DATING', 'FRIENDS', 'NETWORKING']::text[], ARRAY['Photography', 'Art', 'Travel', 'Fashion', 'Activism']::text[], 'OPEN',
'5''8"', 'Slim', 'Brixton, London', 51.4613, -0.1156,
true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '5 hours',
'either', 'vers', ARRAY['Creative', 'Sensual', 'Attentive']::text[], ARRAY['Artistic', 'Passionate', 'Open-minded']::text[], '2025-08-01'),

-- Member 18: Christopher
('christopher@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Christopher Okonkwo', 'Chris', 34, 'he/him',
'Investment banker who invests in experiences, not just portfolios. Work hard, play harder.',
'Living well is the best revenge',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'DATING']::text[], ARRAY['Finance', 'Travel', 'Wine', 'Fitness', 'Art']::text[], 'MONOGAMOUS',
'6''0"', 'Athletic', 'Mayfair, London', 51.5099, -0.1478,
true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '7 hours',
'can_host', 'top', ARRAY['Assertive', 'Generous', 'Confident']::text[], ARRAY['Elegant', 'Submissive', 'Sensual']::text[], '2025-05-15'),

-- Member 19: Isaiah
('isaiah@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Isaiah Grant', 'Zay', 26, 'he/him',
'Social worker by profession, activist by passion. Fighting for housing justice. Looking for someone who cares about community.',
'Here for the movement and the moment',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'FRIENDS']::text[], ARRAY['Activism', 'Politics', 'Music', 'Reading', 'Community']::text[], 'MONOGAMOUS',
'5''9"', 'Average', 'Lewisham, London', 51.4415, -0.0117,
false, NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '2 hours',
'prefer_travel', 'vers_bottom', ARRAY['Caring', 'Passionate', 'Communicative']::text[], ARRAY['Assertive', 'Supportive', 'Romantic']::text[], '2025-06-25'),

-- Member 20: Brandon
('brandon@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Brandon Mitchell', 'B', 39, 'he/him',
'Recently divorced, back in the scene after 10 years. Rediscovering myself and what I want. Patient, kind, and ready for something real.',
'New chapter, same authenticity',
'MEMBER', 'APPROVED',
ARRAY['RELATIONSHIP', 'FRIENDS']::text[], ARRAY['Cooking', 'Nature', 'Film', 'Dogs', 'Wellness']::text[], 'MONOGAMOUS',
'5''10"', 'Average', 'Richmond, London', 51.4613, -0.3037,
false, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 hour',
'can_host', 'vers', ARRAY['Patient', 'Romantic', 'Tender']::text[], ARRAY['Understanding', 'Gentle', 'Affectionate']::text[], '2025-07-05')

ON CONFLICT (email) DO NOTHING;

-- Add sample events including partnership events
INSERT INTO events (title, description, event_type, event_date, location, max_capacity, price, is_partnership, partner_name, partner_type) VALUES
('Summer Date Night', 'An intimate evening of connection and conversation. Speed dating, icebreakers, and the chance to meet someone special.', 'DATE_NIGHT', NOW() + INTERVAL '7 days', 'The Glory, Haggerston', 30, 15, false, NULL, NULL),
('Cohort Alpha Welcome Party', 'Welcome to the DOWN community! Meet your fellow cohort members and kick off four months of connection.', 'KICKOFF', NOW() + INTERVAL '3 days', 'Soho House Dean Street', 50, 0, false, NULL, NULL),
('DOWN x UK Black Pride Mixer', 'Join us for an exclusive pre-Pride mixer in partnership with UK Black Pride. Celebrate Black queer excellence!', 'SOCIAL', NOW() + INTERVAL '14 days', 'Dalston Superstore', 75, 10, true, 'UK Black Pride', 'advocacy'),
('Wellness Wednesday: Yoga & Brunch', 'Start your day with movement and mindfulness, followed by a healthy brunch with the community.', 'WELLNESS', NOW() + INTERVAL '5 days', 'Third Space Canary Wharf', 20, 25, false, NULL, NULL),
('DOWN Gala 2025', 'Our signature annual celebration of Black queer excellence. Red carpet, live entertainment, awards, and an unforgettable night.', 'GALA', NOW() + INTERVAL '30 days', 'Troxy, Limehouse', 200, 55, false, NULL, NULL),
('Black Out UK: Sexual Health Workshop', 'An open and honest conversation about sexual health in our community. In partnership with Black Out UK.', 'WORKSHOP', NOW() + INTERVAL '10 days', 'The Pineapple, Kentish Town', 25, 0, true, 'Black Out UK', 'health'),
('Queer Britain Museum Visit', 'A private tour of Queer Britain followed by drinks and discussion about our history and heritage.', 'CULTURAL', NOW() + INTERVAL '21 days', 'Queer Britain, Kings Cross', 30, 12, true, 'Queer Britain', 'cultural')
ON CONFLICT DO NOTHING;
