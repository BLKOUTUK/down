-- Mock Members for DOWN Dating App
-- Password for all: testpass123 (hashed)
-- $2a$10$rQnM1rJk8vKzF5LqN5u5/.XvS.jR3mPQaQ5C5T.s5yZ5B5v5X5v5.

-- First, let's use a simpler approach - insert with the same password hash as admin
-- All users can login with password: admin123

INSERT INTO users (
  email, password, name, display_name, age, pronouns, bio, headline,
  role, application_status, cohort_id,
  looking_for, interests, relationship_style,
  height, body_type, location_name, latitude, longitude,
  is_verified, member_since, last_active
) VALUES

-- Member 1: Marcus
('marcus@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Marcus Johnson', 'Marcus J', 32, 'he/him',
'Creative director by day, home chef by night. Looking for someone who appreciates good food and better conversation. Originally from Birmingham, London is home now.',
'Creative soul seeking genuine connection',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'DATING']::looking_for[], ARRAY['Art', 'Cooking', 'Film', 'Travel', 'Photography']::text[], 'MONOGAMOUS',
'6''1"', 'Athletic', 'Brixton, London', 51.4613, -0.1156,
true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '2 hours'),

-- Member 2: Kwame
('kwame@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Kwame Asante', 'Kwame', 28, 'he/him',
'Software engineer with a passion for music production. Weekend DJ at queer nights. Always down for a spontaneous adventure or a quiet night in.',
'Tech nerd with good vibes',
'MEMBER', 'APPROVED', NULL,
ARRAY['DATING', 'FRIENDS', 'NETWORKING']::looking_for[], ARRAY['Music', 'Tech', 'Gaming', 'Nightlife', 'Fitness']::text[], 'OPEN',
'5''10"', 'Slim', 'Shoreditch, London', 51.5245, -0.0792,
true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 hour'),

-- Member 3: Jamal
('jamal@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Jamal Williams', 'Jay', 35, 'he/him',
'Lawyer who knows how to leave work at work. Love theatre, brunch, and deep conversations. Looking for my person.',
'Professional by day, romantic by nature',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP']::looking_for[], ARRAY['Theatre', 'Reading', 'Food', 'Wine', 'Politics']::text[], 'MONOGAMOUS',
'5''11"', 'Average', 'Canary Wharf, London', 51.5054, -0.0235,
true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 hours'),

-- Member 4: Darnell
('darnell@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Darnell Brown', 'Dee', 26, 'he/they',
'Non-binary artist and activist. Creating spaces for our community through art. Vegan foodie always looking for new spots.',
'Art is resistance ✊🏿',
'MEMBER', 'APPROVED', NULL,
ARRAY['FRIENDS', 'DATING', 'NETWORKING']::looking_for[], ARRAY['Art', 'Activism', 'Food', 'Fashion', 'Writing']::text[], 'POLYAMOROUS',
'5''8"', 'Slim', 'Peckham, London', 51.4693, -0.0686,
false, NOW() - INTERVAL '1 month', NOW() - INTERVAL '30 minutes'),

-- Member 5: Tyrone
('tyrone@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Tyrone Clarke', 'Ty', 41, 'he/him',
'Been around long enough to know what I want. NHS doctor, gym enthusiast, terrible dancer but always the first on the floor.',
'Mature, grounded, and still young at heart',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'FRIENDS']::looking_for[], ARRAY['Fitness', 'Wellness', 'Travel', 'Science', 'Dancing']::text[], 'MONOGAMOUS',
'6''2"', 'Muscular', 'Hampstead, London', 51.5565, -0.1781,
true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '1 day'),

-- Member 6: Andre
('andre@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Andre Thompson', 'Dre', 29, 'he/him',
'Fitness coach helping our community get stronger. Love a good laugh and don''t take myself too seriously. Dog dad to a rescue staffie.',
'Gains and good energy only 💪🏿',
'MEMBER', 'APPROVED', NULL,
ARRAY['DATING', 'HOOKUPS', 'FRIENDS']::looking_for[], ARRAY['Fitness', 'Sports', 'Nature', 'Dogs', 'Comedy']::text[], 'OPEN',
'5''9"', 'Muscular', 'Stratford, London', 51.5430, -0.0005,
true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '3 hours'),

-- Member 7: Oluwaseun
('seun@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Oluwaseun Adeyemi', 'Seun', 31, 'he/him',
'Nigerian-British banker who''s more than his job. Passionate about mentoring young Black professionals. Looking for intellectual stimulation and genuine chemistry.',
'Success with substance',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'NETWORKING']::looking_for[], ARRAY['Finance', 'Mentoring', 'Food', 'Travel', 'Politics']::text[], 'MONOGAMOUS',
'5''11"', 'Athletic', 'City of London', 51.5155, -0.0922,
true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '6 hours'),

-- Member 8: Leroy
('leroy@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Leroy Mitchell', 'Leroy', 38, 'he/him',
'Caribbean roots, London raised. Chef at a Michelin restaurant. Food is love, and I''ve got plenty to share. Early riser, sunset chaser.',
'Feed you well, treat you better',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'DATING']::looking_for[], ARRAY['Cooking', 'Food', 'Travel', 'Nature', 'Music']::text[], 'MONOGAMOUS',
'6''0"', 'Average', 'Notting Hill, London', 51.5139, -0.2052,
false, NOW() - INTERVAL '4 months', NOW() - INTERVAL '12 hours'),

-- Member 9: Xavier
('xavier@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Xavier Reid', 'Xav', 25, 'he/him',
'Recent grad figuring life out. Music journalist by day, bedroom producer by night. Looking for good vibes and even better connections.',
'Young, ambitious, and open',
'MEMBER', 'APPROVED', NULL,
ARRAY['DATING', 'FRIENDS', 'OPEN_TO_ALL']::looking_for[], ARRAY['Music', 'Writing', 'Nightlife', 'Fashion', 'Gaming']::text[], 'EXPLORING',
'5''7"', 'Slim', 'Dalston, London', 51.5483, -0.0757,
false, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '15 minutes'),

-- Member 10: Malik
('malik@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Malik Hassan', 'Malik', 33, 'he/him',
'Architect designing spaces that inspire. Quiet confidence, loud laugh. Looking for someone who can match my energy and challenge my perspective.',
'Building dreams, seeking connection',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP']::looking_for[], ARRAY['Art', 'Architecture', 'Photography', 'Travel', 'Yoga']::text[], 'MONOGAMOUS',
'6''0"', 'Athletic', 'King''s Cross, London', 51.5320, -0.1245,
true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '4 hours'),

-- Member 11: Jerome
('jerome@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Jerome Davis', 'Rome', 30, 'he/him',
'Actor and drama teacher. Every conversation is an audition for my heart. Hopeless romantic who believes in movie-worthy love stories.',
'Main character energy ✨',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'DATING']::looking_for[], ARRAY['Theatre', 'Film', 'Dancing', 'Reading', 'Travel']::text[], 'MONOGAMOUS',
'5''10"', 'Average', 'Greenwich, London', 51.4826, -0.0077,
true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '2 hours'),

-- Member 12: Kofi
('kofi@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Kofi Mensah', 'Kofi', 27, 'he/him',
'Ghanaian-British entrepreneur. Started a sustainable fashion brand that celebrates African textiles. Looking for someone who values culture and creativity.',
'Fashion-forward, future-focused',
'MEMBER', 'APPROVED', NULL,
ARRAY['DATING', 'NETWORKING', 'FRIENDS']::looking_for[], ARRAY['Fashion', 'Business', 'Art', 'Travel', 'Activism']::text[], 'OPEN',
'5''9"', 'Slim', 'Hackney, London', 51.5450, -0.0553,
false, NOW() - INTERVAL '1 month', NOW() - INTERVAL '8 hours'),

-- Member 13: Darren
('darren@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Darren Taylor', 'D', 36, 'he/him',
'Mental health therapist specialising in LGBTQ+ wellbeing. Believe in the power of vulnerability. Looking for depth, not just surface connections.',
'Here to connect, not collect',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP']::looking_for[], ARRAY['Wellness', 'Reading', 'Yoga', 'Nature', 'Spirituality']::text[], 'MONOGAMOUS',
'5''11"', 'Average', 'Clapham, London', 51.4618, -0.1384,
true, NOW() - INTERVAL '4 months', NOW() - INTERVAL '1 day'),

-- Member 14: Nathaniel
('nathaniel@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Nathaniel James', 'Nate', 24, 'he/they',
'Non-binary makeup artist for film and TV. Breaking boundaries in beauty. Love a good rave and an even better conversation.',
'Colour outside the lines 🎨',
'MEMBER', 'APPROVED', NULL,
ARRAY['DATING', 'FRIENDS', 'HOOKUPS']::looking_for[], ARRAY['Art', 'Fashion', 'Nightlife', 'Film', 'Music']::text[], 'POLYAMOROUS',
'5''6"', 'Slim', 'Camden, London', 51.5391, -0.1426,
false, NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '45 minutes'),

-- Member 15: Terrence
('terrence@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Terrence Walker', 'Terry', 44, 'he/him',
'University professor teaching African diaspora studies. Silver fox who''s earned every grey hair. Looking for intellectual equals who can also be silly.',
'Distinguished and down to earth',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'FRIENDS']::looking_for[], ARRAY['History', 'Reading', 'Politics', 'Travel', 'Wine']::text[], 'MONOGAMOUS',
'5''10"', 'Average', 'Bloomsbury, London', 51.5246, -0.1289,
true, NOW() - INTERVAL '5 months', NOW() - INTERVAL '3 days'),

-- Member 16: Jordan
('jordan@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Jordan Campbell', 'JC', 28, 'he/him',
'Professional footballer (you''ve probably not heard of my club). Keeping my identity private here, but open about who I am. DL-friendly but hate the term.',
'More than the game',
'MEMBER', 'APPROVED', NULL,
ARRAY['DATING', 'HOOKUPS']::looking_for[], ARRAY['Sports', 'Fitness', 'Gaming', 'Travel', 'Music']::text[], 'PREFER_NOT_TO_SAY',
'6''1"', 'Athletic', 'Fulham, London', 51.4749, -0.2106,
false, NOW() - INTERVAL '1 month', NOW() - INTERVAL '20 minutes'),

-- Member 17: Ezra
('ezra@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Ezra Solomon', 'Ez', 31, 'he/him',
'Ethiopian-British photographer documenting Black queer joy. My work has been in galleries, but I''m most proud of the community portraits. Let me capture your essence.',
'Seeing beauty everywhere',
'MEMBER', 'APPROVED', NULL,
ARRAY['DATING', 'FRIENDS', 'NETWORKING']::looking_for[], ARRAY['Photography', 'Art', 'Travel', 'Fashion', 'Activism']::text[], 'OPEN',
'5''8"', 'Slim', 'Brixton, London', 51.4613, -0.1156,
true, NOW() - INTERVAL '2 months', NOW() - INTERVAL '5 hours'),

-- Member 18: Christopher
('christopher@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Christopher Okonkwo', 'Chris', 34, 'he/him',
'Investment banker who invests in experiences, not just portfolios. Work hard, play harder. Looking for someone to share the finer things with.',
'Living well is the best revenge',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'DATING']::looking_for[], ARRAY['Finance', 'Travel', 'Wine', 'Fitness', 'Art']::text[], 'MONOGAMOUS',
'6''0"', 'Athletic', 'Mayfair, London', 51.5099, -0.1478,
true, NOW() - INTERVAL '3 months', NOW() - INTERVAL '7 hours'),

-- Member 19: Isaiah
('isaiah@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Isaiah Grant', 'Zay', 26, 'he/him',
'Social worker by profession, activist by passion. Fighting for housing justice. Looking for someone who cares about community as much as I do.',
'Here for the movement and the moment',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'FRIENDS']::looking_for[], ARRAY['Activism', 'Politics', 'Music', 'Reading', 'Community']::text[], 'MONOGAMOUS',
'5''9"', 'Average', 'Lewisham, London', 51.4415, -0.0117,
false, NOW() - INTERVAL '6 weeks', NOW() - INTERVAL '2 hours'),

-- Member 20: Brandon
('brandon@example.com', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG',
'Brandon Mitchell', 'B', 39, 'he/him',
'Recently divorced, back in the scene after 10 years. Rediscovering myself and what I want. Patient, kind, and ready for something real.',
'New chapter, same authenticity',
'MEMBER', 'APPROVED', NULL,
ARRAY['RELATIONSHIP', 'FRIENDS']::looking_for[], ARRAY['Cooking', 'Nature', 'Film', 'Dogs', 'Wellness']::text[], 'MONOGAMOUS',
'5''10"', 'Dad bod', 'Richmond, London', 51.4613, -0.3037,
false, NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '1 hour');

-- Also add the admin user if not exists
INSERT INTO users (email, password, name, display_name, role, application_status)
VALUES ('admin@down.community', '$2a$10$lO/kpqTfJTJfB8kxLhZwwutOPF1KFmbEkREtD61VRAGZWxAbR/kJG', 'Admin User', 'Admin', 'ADMIN', 'APPROVED')
ON CONFLICT (email) DO NOTHING;

-- Add some sample events
INSERT INTO events (title, description, event_type, event_date, location, max_capacity, price, is_partnership, partner_name, partner_type) VALUES
('Summer Date Night', 'An intimate evening of connection and conversation. Speed dating, icebreakers, and the chance to meet someone special.', 'DATE_NIGHT', NOW() + INTERVAL '7 days', 'The Glory, Haggerston', 30, 15, false, NULL, NULL),
('Cohort Alpha Welcome Party', 'Welcome to the DOWN community! Meet your fellow cohort members and kick off four months of connection.', 'KICKOFF', NOW() + INTERVAL '3 days', 'Soho House Dean Street', 50, 0, false, NULL, NULL),
('DOWN x UK Black Pride Mixer', 'Join us for an exclusive pre-Pride mixer in partnership with UK Black Pride.', 'SOCIAL', NOW() + INTERVAL '14 days', 'Dalston Superstore', 75, 10, true, 'UK Black Pride', 'advocacy'),
('Wellness Wednesday: Yoga & Brunch', 'Start your day with movement and mindfulness, followed by a healthy brunch.', 'WELLNESS', NOW() + INTERVAL '5 days', 'Third Space Canary Wharf', 20, 25, false, NULL, NULL),
('DOWN Gala 2025', 'Our signature annual celebration of Black queer excellence. Red carpet, live entertainment, awards, and an unforgettable night.', 'GALA', NOW() + INTERVAL '30 days', 'Troxy, Limehouse', 200, 55, false, NULL, NULL),
('Black Out UK Partnership: Sexual Health Workshop', 'An open and honest conversation about sexual health in our community. In partnership with Black Out UK.', 'WORKSHOP', NOW() + INTERVAL '10 days', 'The Pineapple, Kentish Town', 25, 0, true, 'Black Out UK', 'health'),
('Queer Britain Museum Visit', 'A private tour of Queer Britain followed by drinks and discussion.', 'CULTURAL', NOW() + INTERVAL '21 days', 'Queer Britain, Kings Cross', 30, 12, true, 'Queer Britain', 'cultural');
