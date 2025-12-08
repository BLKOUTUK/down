# DOWN v1.0.1 Revised Specification
## Target: Black Meat Market Away Weekend (Feb 6-8, 2026)
## Hard Deadline: Feb 1, 2026

---

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 LAUNCH TARGET: BLACK MEAT MARKET AWAY WEEKEND          │
│                                                             │
│  Feb 6-8, 2026 • Digital Facilitation Space                │
│  App must be live by Feb 1st                                │
│                                                             │
│  ~7 working weeks from Dec 7 (excluding holidays)           │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 1: Values-Led Design Updates

### 🌍 Advocate's Interventions

Based on community values, three significant design shifts:

---

### 1. Mediation Over Blocking

**Old Model (Typical Apps)**:
```
Conflict → Block → Silence → No accountability
```

**New Model (DOWN)**:
```
Conflict → Pause → Reflect → Mediate (optional) → Resolve or Separate
```

#### Implementation

| Action | What It Does | Reversible? | Visibility |
|--------|--------------|-------------|------------|
| **Pause** 🟡 | 48-hour cooling off, no messages | Yes, auto-expires | "Taking space" |
| **Mute** 🔇 | Hide from browse, no notifications | Yes, anytime | Private |
| **Request Mediation** 🤝 | Community steward facilitates | N/A | Both parties notified |
| **Separate** 🚫 | Permanent no-contact | Admin review | Private |

#### Mediation Flow
```
┌─────────────────────────────────────────────────────────────┐
│  😔 Something's not right with Marcus                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  What would help?                                           │
│                                                             │
│  [ 🟡 Pause for 48 hours ]                                  │
│  Take space. You won't see each other's profiles or         │
│  messages. Auto-expires, or you can reconnect early.        │
│                                                             │
│  [ 🔇 Mute ]                                                │
│  Hide Marcus from your browse. You can unmute anytime.      │
│                                                             │
│  [ 🤝 Request mediation ]                                   │
│  A community steward will reach out to both of you          │
│  to help resolve this. Confidential.                        │
│                                                             │
│  [ 🚫 Separate permanently ]                                │
│  This is reviewed by community stewards. Use for            │
│  serious harm. Tell us what happened (optional).            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Database Additions
```sql
-- Relationship states (replaces simple blocks)
CREATE TYPE relationship_state AS ENUM (
  'NORMAL',
  'PAUSED',      -- 48-hour cooling off
  'MUTED',       -- One-way hide
  'SEPARATED'    -- Permanent, admin-reviewed
);

CREATE TABLE user_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  other_user_id UUID REFERENCES users(id),
  state relationship_state DEFAULT 'NORMAL',
  reason TEXT,
  expires_at TIMESTAMPTZ, -- For PAUSED
  mediation_requested BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mediation requests
CREATE TABLE mediation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES users(id),
  other_party_id UUID REFERENCES users(id),
  steward_id UUID REFERENCES users(id), -- Assigned mediator
  status TEXT DEFAULT 'PENDING',
  requester_statement TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
```

---

### 2. Events for Relationship Building

**Beyond Hookups**: Events should foster genuine community bonds.

#### Event Types

| Type | Icon | Purpose | Example |
|------|------|---------|---------|
| **Social** | 🎉 | General mingling | Black Meat Market Weekend |
| **Skill Share** | 🎓 | Learning together | "Cooking Jerk Chicken" |
| **Story Circle** | 💬 | Vulnerability & connection | "Coming Out Stories" |
| **Mentorship** | 🌱 | Elders + newcomers | "Career Advice Mixer" |
| **Wellness** | 🧘 | Health & self-care | "Morning Yoga Session" |
| **Creative** | 🎨 | Making together | "Afrobeats Dance Class" |
| **Political Ed** | ✊🏿 | Learning & organizing | "Reading: Sister Outsider" |
| **Celebration** | 🎂 | Honoring community | "February Birthdays" |
| **Discussion** | 💭 | Weekly online chat | "Active Members Check-In" |
| **Hotseat** | 🔥 | Featured BLKOUTHUB member Q&A | "Meet the Founders" |
| **Governance** | 📋 | Rules review & feedback | "Community Guidelines Review" |
| **Date Night** | 💕 | Structured connection event | "Speed Dating Evening" |
| **Pitch Night** | 💡 | Member ideas for events/travel | "What Should We Do Next?" |

---

### Sample Month Calendar (Cohort Active Period)

```
FEBRUARY 2026 - COHORT "GENESIS" CALENDAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WEEK 1 (Feb 2-8) - LAUNCH WEEK
────────────────────────────────────────────────────────────
Mon 2   📋 7pm  Community Rules Review (Start) - Online
                "Welcome & Guidelines Walkthrough"

Wed 4   💭 8pm  Weekly Discussion - Online
                "Introductions: Who Are You Beyond Your Profile?"

Thu 5   🔥 7pm  BLKOUTHUB Hotseat - Online
                "Meet Marcus: Founder Story"

Fri 6   🎉 ALL DAY - BLACK MEAT MARKET AWAY WEEKEND BEGINS
Sat 7   🎉 BMM Away Weekend continues
Sun 8   🎉 BMM Away Weekend closes

────────────────────────────────────────────────────────────
WEEK 2 (Feb 9-15)
────────────────────────────────────────────────────────────
Wed 11  💭 8pm  Weekly Discussion - Online
                "Dating as a Black Queer Man in London"

Thu 12  🔥 7pm  BLKOUTHUB Hotseat - Online
                "Meet Darnell: Community Building"

Fri 13  💕 8pm  DATE NIGHT #1 - In Person (Venue TBC)
                "Valentine's Eve Speed Dating"

────────────────────────────────────────────────────────────
WEEK 3 (Feb 16-22)
────────────────────────────────────────────────────────────
Mon 16  📋 7pm  Community Rules Review (Midpoint) - Online
                "How's It Going? Feedback Session"

Wed 18  💭 8pm  Weekly Discussion - Online
                "Navigating Intimacy & Boundaries"

Thu 19  🔥 7pm  BLKOUTHUB Hotseat - Online
                "Meet Jay: Tech & Community"

Sat 21  💡 6pm  PITCH NIGHT - Online
                "Submit Your Ideas: Events, Meetups, Travel"

────────────────────────────────────────────────────────────
WEEK 4 (Feb 23 - Mar 1)
────────────────────────────────────────────────────────────
Wed 25  💭 8pm  Weekly Discussion - Online
                "Reflections: What Have You Learned?"

Thu 26  🔥 7pm  BLKOUTHUB Hotseat - Online
                "Community Spotlight: Member Feature"

Fri 27  💕 8pm  DATE NIGHT #2 - In Person (Venue TBC)
                "End of Month Mixer"

Sun 1   📋 7pm  Community Rules Review (End) - Online
                "Cohort Closeout & Feedback"

        🎊 7pm  GALA LAUNCH CELEBRATION
                "Genesis Cohort Closing Party"
```

---

### Pitch Night Feature

```
┌─────────────────────────────────────────────────────────────┐
│  💡 PITCH NIGHT - Submit Your Ideas                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  What would you love to see the community do?               │
│                                                             │
│  Category:                                                  │
│  ( ) Event idea (workshop, party, social)                   │
│  ( ) Meetup (casual gathering, activity)                    │
│  ( ) Travel (group trip, away weekend)                      │
│  ( ) Other                                                  │
│                                                             │
│  Your Idea:                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ "Beach day trip to Brighton in summer..."            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Would you help organise?                                   │
│  [ ] Yes, I'd co-host    [ ] Happy to help                  │
│  [ ] Just suggesting     [ ] I'd attend                     │
│                                                             │
│  [ Submit Pitch ]                                           │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  🗳️ VOTE ON PITCHES                                         │
│                                                             │
│  🏖️ "Summer Beach Trip" - by Marcus (12 votes)              │
│  🎮 "Gaming Tournament" - by Jay (8 votes)                  │
│  🍳 "Cooking Class Collab" - by Darnell (15 votes)          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### In-Event Features (for Away Weekend)

```
┌─────────────────────────────────────────────────────────────┐
│  🎉 Black Meat Market Away Weekend                          │
│  Feb 6-8, 2026 • Brighton                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📅 SCHEDULE                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Fri 6th                                              │   │
│  │ 4pm  Check-in & Welcome                              │   │
│  │ 7pm  Opening Circle                                  │   │
│  │ 9pm  Meet & Greet Social                             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Sat 7th                                              │   │
│  │ 10am Yoga & Breathwork                               │   │
│  │ 1pm  Skill Share: [TBD]                              │   │
│  │ 4pm  Free time / Connections                         │   │
│  │ 8pm  Main Event                                      │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Sun 8th                                              │   │
│  │ 11am Closing Circle & Brunch                         │   │
│  │ 2pm  Departures                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  👥 ATTENDEES (47)                                          │
│  [ Browse attendees → ]                                     │
│                                                             │
│  💡 ICEBREAKERS                                             │
│  "Find someone who shares your star sign"                   │
│  [ Get new prompt ]                                         │
│                                                             │
│  🏠 MY ROOM                                                 │
│  Room 12 • Shared with: @marcus_j                           │
│                                                             │
│  🛡️ SAFETY                                                  │
│  [ Create safety check-in for the weekend ]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Icebreaker Prompts System
```sql
CREATE TABLE icebreaker_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  category TEXT, -- 'fun', 'deep', 'spicy'
  submitted_by UUID REFERENCES users(id),
  is_approved BOOLEAN DEFAULT false,
  times_used INT DEFAULT 0
);

-- Seed prompts
INSERT INTO icebreaker_prompts (prompt, category, is_approved) VALUES
('Find someone who shares your star sign', 'fun', true),
('Find someone from a different city', 'fun', true),
('Find someone who''s been to Africa', 'deep', true),
('Find someone who knows your favorite artist', 'fun', true),
('Find someone you''ve never spoken to', 'fun', true),
('Ask someone about their chosen family', 'deep', true),
('Find someone with the same love language', 'deep', true),
('Find someone who''s verse like you (or opposite)', 'spicy', true);
```

---

### 3. User Co-Creation of Culture

#### Cohort Kickoff: Community Agreements

At the start of each cohort, members vote on which agreements to adopt:

```
┌─────────────────────────────────────────────────────────────┐
│  ✊🏿 Cohort Alpha Kickoff                                   │
│  Help shape our community culture                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Vote for the agreements you want our cohort to live by:    │
│  (Top 5 will become our shared commitments)                 │
│                                                             │
│  COMMUNICATION                                              │
│  [ 73% ] 💬 We respond within 24 hours                      │
│  [ 45% ] 🚫 We don't ghost - we say "not interested"        │
│  [ 61% ] 🙏🏿 We thank people for their honesty              │
│                                                             │
│  RESPECT                                                    │
│  [ 89% ] ✊🏿 We celebrate Blackness in all its forms        │
│  [ 67% ] 🏳️‍⚧️ We respect all gender expressions              │
│  [ 52% ] 💪🏿 We uplift, we don't tear down                  │
│                                                             │
│  SAFETY                                                     │
│  [ 78% ] 🛡️ We look out for each other                      │
│  [ 41% ] 📍 We use safety check-ins for meetups             │
│  [ 55% ] 🤝 We try mediation before separation              │
│                                                             │
│  INTIMACY                                                   │
│  [ 82% ] 💛 Consent is enthusiastic and ongoing             │
│  [ 59% ] 🩺 We're honest about our sexual health            │
│  [ 47% ] 🔒 What happens in DOWN stays in DOWN              │
│                                                             │
│  [ Submit my votes ]                                        │
│                                                             │
│  Voting closes: Feb 3rd                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Display in App
```
┌─────────────────────────────────────────────────────────────┐
│  ✨ Cohort Alpha Agreements                                 │
├─────────────────────────────────────────────────────────────┤
│  Voted by our community:                                    │
│                                                             │
│  1. ✊🏿 We celebrate Blackness in all its forms (89%)       │
│  2. 💛 Consent is enthusiastic and ongoing (82%)            │
│  3. 🛡️ We look out for each other (78%)                    │
│  4. 💬 We respond within 24 hours (73%)                     │
│  5. 🏳️‍⚧️ We respect all gender expressions (67%)             │
│                                                             │
│  [ Suggest a new agreement for next cohort ]                │
└─────────────────────────────────────────────────────────────┘
```

#### Skin/Theme Customization

```sql
CREATE TABLE cohort_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES cohorts(id),
  name TEXT NOT NULL,
  primary_color TEXT, -- hex
  secondary_color TEXT,
  accent_color TEXT,
  background_pattern TEXT, -- CSS or image URL
  submitted_by UUID REFERENCES users(id),
  votes INT DEFAULT 0,
  is_active BOOLEAN DEFAULT false
);
```

**For Away Weekend**: Could have a custom theme just for the event:
- Brighton seaside vibes
- Weekend-specific color palette
- Event logo/artwork

---

## Part 2: Revised Timeline for Feb 1st

### Reality Check

| Factor | Impact |
|--------|--------|
| Today | Dec 7, 2025 |
| Target | Feb 1, 2026 |
| Calendar weeks | 8 weeks |
| Holiday break (Dec 23 - Jan 1) | -1 week |
| **Working weeks** | **~7 weeks** |

### Ruthless Prioritization

#### MUST HAVE for Black Meat Market (Feb 1)

| Feature | Days | Notes |
|---------|------|-------|
| Profiles with Intimacy Tab | 3 | Core identity |
| Photo upload (3-5 photos) | 2 | Essential for connection |
| Browse attendees | 2 | Filter by event |
| Like/Match system | 2 | Mutual interest |
| Basic messaging | 3 | Doesn't need realtime |
| Event page with schedule | 2 | Weekend program |
| Icebreaker prompts | 1 | Fun connection tool |
| Pause/Mute (simple) | 1 | Mediation can wait |
| Production deployment | 2 | Vercel + Supabase |
| **Total** | **18 days** | ~4 weeks |

#### NICE TO HAVE (if time permits)

| Feature | Days | Notes |
|---------|------|-------|
| Community agreements voting | 2 | Quick win for values |
| Safety Check-In (basic) | 5 | Important for away weekend |
| Read receipts | 1 | Polish |
| Weekend-specific theme | 1 | Visual identity |

#### DEFER TO v1.1 (after Feb 8)

| Feature | Notes |
|---------|-------|
| Full mediation system | Requires steward training |
| Realtime messaging | Polling works for MVP |
| Cohort rotation | Not needed for one event |
| Full event programming | Build after learning from BMM |
| Skin customization | Nice but not essential |
| **Private media albums** | Time-limited intimate photo sharing |
| **Media moderation dashboard** | Admin tools for content review |
| **Settings page** | Account, privacy, notifications, blocked users |
| **Community page** | Guidelines, values, resources, safety info |
| **Buddy system** | Pair up for safety at events/meetups, check-in alerts |
| **Constructive feedback prompts** | Post-interaction feedback to encourage dialogue |
| **Endorsements** | Display up to 3 endorsements on profile drawn from peer feedback |
| **Cohort opt-in flow** | Process for members to opt into next active cohort rotation |
| **Weekend/Event tickets** | Opt-in for special event access (e.g., BMM Away Weekend) |
| **Traveller profiles** | Temporary location mode for visitors/travelling members |
| **Traveller Experiences** | Premium upsell for Black queer tourists: member-led scene tours, curated event+accommodation packages, immersive local experiences. Also provides novelty for active DOWN members through hosted experiences and city guide features. Revenue opportunity through booking commissions and experience hosting fees. |
| **Member-hosted meetups** | Members can propose/host casual gatherings (pre-drinks, cinema, etc.) |
| **Party hosting** | Host private parties with invite lists, RSVP, location sharing |
| **BLKOUT promotions** | Rotating upsells to BLKOUT engagement/membership tiers |
| **Partner discounts** | Curated partner offers (paid/in-kind) benefiting community |
| **Tiered window access** | Extended browse window, scheduled DMs, fallow member access |
| **Weekly check-in/status** | Share week updates & weekend plans during down-time |

---

### Revised Sprint Plan

```
SPRINT 1: FOUNDATION (Dec 9 - Dec 20) [2 weeks]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 1 (Dec 9-13)
├── Complete Intimacy Tab UI                    [2 days]
├── Photo upload to Supabase Storage            [2 days]
└── Profile view page                           [1 day]

Week 2 (Dec 16-20)
├── Browse with filters                         [2 days]
├── Like system API                             [1 day]
├── Match detection & notification              [1 day]
└── Basic messaging (send/receive)              [1 day]

🎄 HOLIDAY BREAK (Dec 23 - Jan 1) - Reduced capacity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SPRINT 2: MESSAGING & EVENTS (Jan 2 - Jan 17) [2.5 weeks]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 3 (Jan 2-3) - Short week
├── Message thread UI                           [2 days]

Week 4 (Jan 6-10)
├── Conversation list                           [1 day]
├── Event page with schedule                    [2 days]
├── Icebreaker prompts system                   [1 day]
└── Pause/Mute relationship states              [1 day]

Week 5 (Jan 13-17)
├── "Attending this event" badge/filter         [1 day]
├── Community agreements voting (stretch)       [2 days]
└── Buffer / bug fixes                          [2 days]

SPRINT 3: PRODUCTION (Jan 20 - Jan 31) [2 weeks]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 6 (Jan 20-24)
├── Vercel production setup                     [1 day]
├── Environment configuration                   [0.5 days]
├── Supabase production project                 [0.5 days]
├── Safety Check-In (basic) - stretch           [3 days]

Week 7 (Jan 27-31)
├── QA testing with real devices                [2 days]
├── Bug fixes                                   [2 days]
└── Final deployment & smoke test               [1 day]

🚀 LAUNCH: Feb 1, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 BLACK MEAT MARKET AWAY WEEKEND: Feb 6-8, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── Friday: App goes live for attendees
├── Weekend: Active usage, feedback collection
└── Sunday: Post-event retrospective

POST-EVENT (Feb 10+)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── User feedback synthesis
├── Bug fixes from real usage
├── Full Safety Check-In
├── Mediation system
└── Cohort system refinement
```

---

## Part 3: Black Meat Market Away Weekend Integration

### Event-Specific Features

```sql
-- Event attendance (for filtering)
CREATE TABLE event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'CONFIRMED',
  room_number TEXT, -- For away weekends
  roommate_id UUID REFERENCES users(id),
  dietary_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Event schedule items
CREATE TABLE event_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location TEXT,
  event_type TEXT, -- 'social', 'workshop', 'wellness', etc.
  is_optional BOOLEAN DEFAULT false
);
```

### Browse Filters for Event

```
┌─────────────────────────────────────────────────────────────┐
│  👥 Browse                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [ 🎉 At Black Meat Market ▼ ] [ All attendees ▼ ]         │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ Marcus  │  │ Darnell │  │ Kwame   │  │ Jerome  │       │
│  │ 🎉 BMM  │  │ 🎉 BMM  │  │ 🎉 BMM  │  │ 🎉 BMM  │       │
│  │ Room 5  │  │ Room 12 │  │ Room 8  │  │ Room 3  │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Weekend Safety Considerations

For an away weekend specifically:
- **Room sharing info** (who's your roommate)
- **Venue details** accessible to all attendees
- **Organizer contact** prominent
- **Quiet spaces** listed in schedule
- **Consent reminders** at key moments

---

## Part 4: Success Metrics for Launch

### Pre-Launch (by Feb 1)
| Metric | Target |
|--------|--------|
| Core features complete | 100% of MUST HAVEs |
| Production deployed | Live on Vercel |
| Test accounts working | 10+ test profiles |
| Event page live | BMM schedule visible |

### During Weekend (Feb 6-8)
| Metric | Target |
|--------|--------|
| Active users | 80%+ of attendees |
| Profiles completed | 90%+ |
| Matches made | 30%+ of users |
| Messages sent | 5+ per user |
| Icebreakers used | 50%+ |
| App crashes | 0 critical |

### Post-Weekend
| Metric | Method |
|--------|--------|
| NPS score | Post-event survey |
| Feature requests | Collected & prioritized |
| Bugs identified | Logged & triaged |
| "Would use again" | Survey |

---

## Part 5: Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Feature creep | High | Delays | Strict scope freeze Jan 15 |
| Holiday slowdown | Medium | 1 week lost | Already factored in |
| Supabase issues | Low | Critical | Early production setup |
| Photo upload fails | Medium | High | Test early, have fallback |
| Low adoption at event | Low | Learning | Onboard in person |
| Bug during weekend | Medium | High | On-call support plan |

---

## Summary: What's Changed

| Aspect | Original v1.0.1 | Revised for BMM |
|--------|-----------------|-----------------|
| **Deadline** | "February 2026" | **Feb 1, 2026 (hard)** |
| **Target users** | Cohort Alpha (500) | BMM attendees (~50) |
| **Blocking** | Simple block | Pause/Mute + Mediation path |
| **Events** | Basic system | Relationship-building focus |
| **Culture** | Top-down rules | User-voted agreements |
| **Scope** | Full platform | MVP for event |

---

## Part 6: v1.1 Features (Post-BMM)

### Private Media Albums (Intimate Photo Sharing)

Users can share private/intimate photos with time-limited access to specific members.

#### Storage Structure
```
profile-media/
├── {user_id}/
│   ├── public/          # Profile photos (visible to all members)
│   │   └── *.jpg
│   └── private/         # Intimate photos (access by invitation only)
│       └── *.jpg
```

#### Access Control Model

| Role | Public Folder | Private Folder |
|------|---------------|----------------|
| Owner | Full access | Full access |
| Invited user | View only | View only (time-limited) |
| Other members | View only | No access |
| Moderators | View + Delete | View + Delete (for moderation) |

#### Database Schema
```sql
-- Private media access grants
CREATE TABLE private_media_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  granted_to_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,  -- e.g., 24 hours from grant
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMPTZ,
  UNIQUE(owner_id, granted_to_id)
);

-- Index for quick access checks
CREATE INDEX idx_private_media_access_granted
ON private_media_access(granted_to_id, expires_at)
WHERE revoked = false;

-- Media reports for moderation
CREATE TABLE media_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES media(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,  -- 'inappropriate', 'misleading', 'non_consensual', 'other'
  details TEXT,
  status TEXT DEFAULT 'pending',  -- 'pending', 'actioned', 'dismissed'
  moderator_id UUID REFERENCES users(id),
  action_taken TEXT,  -- 'removed', 'warning_issued', 'account_suspended', 'none'
  moderator_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- Add is_private flag to media table
ALTER TABLE media ADD COLUMN is_private BOOLEAN DEFAULT false;
```

#### UI Flow: Sharing Private Album
```
┌─────────────────────────────────────────────────────────────┐
│  🔒 Share Private Album with Marcus                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  You have 3 private photos                                  │
│                                                             │
│  ⏱️ Access expires after:                                   │
│  [ 1 hour ] [ 24 hours ✓ ] [ 48 hours ] [ 1 week ]         │
│                                                             │
│  [ 🔓 Share Access ]                                        │
│                                                             │
│  ⚠️ Marcus will be notified. You can revoke access          │
│  anytime from your profile settings.                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### UI Flow: Reporting Media
```
┌─────────────────────────────────────────────────────────────┐
│  🚩 Report This Photo                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Why are you reporting this?                                │
│                                                             │
│  [ ] Inappropriate content                                  │
│  [ ] Misleading/catfish                                     │
│  [ ] Used without consent                                   │
│  [ ] Other                                                  │
│                                                             │
│  Additional details (optional):                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [ Submit Report ]                                          │
│                                                             │
│  Reports are reviewed by community stewards within 24h.     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 7: Year 1 Roadmap (Feb 2026 - Feb 2027)

### Strategic Principles

| Principle | Implementation |
|-----------|----------------|
| **Community-powered operations** | Volunteers as skills development, not cost centre |
| **Values-aligned partnerships** | Outsavvy over Stripe, community over extraction |
| **Training before features** | Buddy system needs culture before code |
| **Match focus over distraction** | One conversation at a time, not endless scrolling |
| **Realtime for intimacy** | Messaging must be immediate, not email-paced |

---

### Phase 1: Foundation & Safety (Feb-Mar 2026)
*Post-BMM learnings, trust infrastructure*

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| **Settings page** | 3 days | Essential | Account controls, privacy, notifications |
| **Community page** | 3 days | Essential | Guidelines, values, resources, safety info |
| **Steward dashboard** | 5 days | Critical | Moderation queue, content review tools |
| **Realtime messaging upgrade** | 5 days | High | Supabase Realtime, typing indicators, read receipts |
| **Volunteer role badges** | 2 days | Medium | Recognition system for stewards |
| **Functional colour system** | 1 day | Polish | Crown status indicator, cohort colour foundations |

**Phase 1 Total:** ~4 weeks | £0 additional cost

**Community Development:**
- BMM debrief and steward recruitment (3-5 candidates)
- First steward training cohort

---

### Phase 2: Intimacy & Trust (Apr-May 2026)
*Differentiating features, safety culture*

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| **Private media albums** | 2 weeks | Killer feature | Time-limited intimate photo sharing |
| **Disappearing messages** | 3 days | High | View-once photos, screenshot detection |
| **Photo sharing in chat** | 4 days | Essential | Camera/gallery integration |
| **Constructive feedback prompts** | 3 days | Medium | Post-interaction dialogue encouragement |
| **Endorsements (3 max)** | 4 days | Medium | Peer-sourced trust signals |

**Phase 2 Total:** ~5 weeks | ~£60/year storage

**Community Development:**
- Navigator training (mediation) - 2-3 trained
- Buddy system pilot preparation
- BLKOUTHUB "Looking Out" course development

---

### Phase 3: Engagement & Events (Jun-Aug 2026)
*Community-led activity, revenue foundations*

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| **Member-hosted meetups** | 1.5 weeks | High | Members propose casual gatherings |
| **Weekend/event tickets** | 1 week | Revenue | Outsavvy integration (1.5% vs Stripe 2.9%) |
| **Cohort opt-in flow** | 4 days | Required | June cohort rotation support |
| **Buddy system (trained access)** | 1 week | High | Requires BLKOUTHUB course completion |
| **Voice notes** | 4 days | Differentiator | Audio messages |
| **Match messaging always-on** | 2 days | Retention | Matches can chat outside window |

**Phase 3 Total:** ~6 weeks | Outsavvy fees (~1.5%)

**Community Development:**
- Event Host workshop (4-6 trained)
- Buddy Coordinator onboarding (3-4 coordinators)
- BLKOUTHUB course launch, facilitated cohort

---

### Phase 4: Growth & Revenue (Sep-Nov 2026)
*Monetization, partnerships, sustainability*

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| **Partner discounts portal** | 1 week | Revenue positive | Curated partner offers |
| **BLKOUT promotions** | 4 days | Cross-platform | Engagement/membership tier upsells |
| **Tiered window access** | 1 week | Premium revenue | Extended access for subscribers |
| **Party hosting** | 1.5 weeks | Advanced | Private parties with invite management |
| **Traveller profiles** | 1 week | Expansion | Temporary location mode |
| **Location sharing (time-limited)** | 4 days | Safety | For meetup coordination with buddy alert |

**Phase 4 Total:** ~6 weeks | Revenue positive

**Community Development:**
- Cross-training (steward ↔ navigator)
- New cohort steward recruitment cycle
- Community of practice gathering

---

### Phase 5: Innovation (Dec 2026 - Year 2)
*Advanced features, geographic expansion*

| Feature | Effort | Impact | Notes |
|---------|--------|--------|-------|
| **Traveller Experiences** | 2 weeks | Premium upsell | Scene tours, accommodation packages |
| **Video chat (WebRTC)** | 3 weeks | High effort | Real-time video calls |
| **Weekly check-in/status** | 4 days | Engagement | Off-window activity |
| **Group chats** | 1 week | Meetup coordination | For event attendee groups |

**Community Development:**
- Annual review & recognition
- Year 2 planning & succession

---

### Community-Powered Operations Model

#### Volunteer Roles

| Role | Training | Commitment | Skills Developed |
|------|----------|------------|------------------|
| **Community Stewards** | 2hr workshop + shadowing | 2-4 hrs/week | Content policy, safeguarding, trauma-informed practice |
| **Conflict Navigators** | Half-day workshop + role-play | On-call rotation | Active listening, de-escalation, restorative practice |
| **Event Hosts** | Workshop + mentored practice | 1-2 events/quarter | Planning, risk assessment, facilitation |
| **Buddy Coordinators** | BLKOUTHUB course | 1 hr/week | Peer support, check-in protocols |

#### Peripatetic Resource Strategy

```
Each cohort rotation → Recruit 2-3 volunteers
                     ↓
Volunteers trained → Join service pool
                     ↓
Fallow members → Stay engaged through roles
                     ↓
Growing bench → Distributed knowledge, no single point of failure
```

#### Cost Comparison

| Model | Annual Cost |
|-------|-------------|
| **Traditional (paid staff)** | £30-45k |
| **Community-powered** | £1-2k (training + recognition) |
| **Community returns** | Skills transfer, ownership, retention, leadership pipeline |

---

### Buddy System Implementation

#### Graduated Rollout

| Stage | Timing | Approach |
|-------|--------|----------|
| **Pilot** | BMM Weekend (Feb) | 10-15 pairs, in-person workshop, high-touch support |
| **Course Development** | Mar | BLKOUTHUB "Looking Out" course creation |
| **Facilitated Cohort** | Apr-May | 20-30 members, async course + weekly calls |
| **Self-Service** | Jun+ | Course prerequisite, in-app matching, peer community |

#### Platform Gating

```
Buddy feature access requires:
✓ BLKOUTHUB "Looking Out" course completion
✓ Annual re-certification
```

#### Course Modules

1. Why Buddying? (30 min) - History, harm reduction, community care
2. The Buddy Agreement (45 min) - Expectations, boundaries, check-in rhythms
3. Check-In Skills (45 min) - Questions, listening, distress signals
4. When Things Go Sideways (30 min) - Escalation, limits, self-care
5. Being a Good Buddy (30 min) - Reciprocity, boundaries, ending well

---

### Messaging Strategy

#### Window Rules (Revised)

| Status | Feature Availability |
|--------|---------------------|
| **Window OPEN** (Thu 4pm - Fri midnight) | Browse, Like, Message anyone, All features |
| **Window CLOSED** | Browse locked, Like locked, **Match messaging ALWAYS ON**, View match profiles |

**Rationale:** Once matched, the connection is established. Killing conversations mid-flow is user-hostile. Discovery stays window-locked for intentional scarcity.

#### Realtime Features Roadmap

| Phase | Features |
|-------|----------|
| **Launch** | Polling chat, text-only |
| **Phase 1** | Supabase Realtime, typing indicators, read receipts |
| **Phase 2** | Photo sharing, disappearing messages |
| **Phase 3** | Voice notes, quick intimacy prompts |
| **Phase 4** | Location sharing (with buddy integration) |
| **Phase 5** | Video chat |

#### Sex-Positive Messaging

```
Quick Prompts:
[🔥 You're hot]  [📍 You free tonight?]
[👀 Show me more] [🏠 Can host]
[🚗 Can travel]   [💬 Let's chat first]

Disappearing Photos:
- View once
- 24-hour expiry option
- Screenshot detection alert

Location Sharing:
- 15 min / 1 hour / until turned off
- Automatic buddy notification prompt
```

---

### Functional Colour System

Colour as visual language - status at a glance, cohort identity, not vanity theming.

#### Crown Status Indicator

| Crown Colour | Meaning |
|--------------|---------|
| **Gold** | Window OPEN (active) |
| **Purple** | Window opening soon (< 1 hour) |
| **Grey** | Window CLOSED |

#### Cohort Colour Palette

| Cohort | Colour | Hex | Use |
|--------|--------|-----|-----|
| **Alpha** | Deep Purple | `#7C3AED` | Chat bubbles, profile accents, badges |
| **Beta** | Teal | `#14B8A6` | Chat bubbles, profile accents, badges |
| **Gamma** | Amber | `#F59E0B` | Chat bubbles, profile accents, badges |
| **Delta** | Rose | `#F43F5E` | Chat bubbles, profile accents, badges |
| **Your messages** | Gold | `#D4AF37` | Always your brand colour |

#### Phased Implementation

| Phase | Elements | Effort |
|-------|----------|--------|
| **Phase 1** | Crown status indicator | 30 min |
| **Phase 2** | Chat bubble cohort colours, typing indicator colours | 2 hours |
| **Phase 3** | Profile card cohort accents, event badges | 2 hours |
| **Phase 4** | Match notifications, read receipt colours | 1 hour |

#### Visual Language Summary

```
Gold      → You / Your actions / Window open
Purple    → Alpha cohort / Premium / Closing soon
Teal      → Beta cohort
Amber     → Gamma cohort
Rose      → Delta cohort
Grey      → Inactive / Closed / Unavailable
Green     → Available / Online / Confirmed
Red       → Alert / Urgent / Declined
```

---

### Partnership Strategy

#### Values-Aligned Partnerships

| Use Case | Extractive Option | Community Option |
|----------|-------------------|------------------|
| **Event tickets** | Stripe (2.9%) | **Outsavvy (1.5%)** |
| **Donations** | GoFundMe (10.9%) | Open Collective (0%) |
| **Memberships** | Patreon (8-12%) | Ko-fi (0%) or direct |

#### Outsavvy Partnership Model

- Embed ticketing within DOWN events page
- Target: 1-1.5% fees or waived for community events
- Cross-promotion to their LGBTQ+ audience
- "DOWN Tickets powered by Outsavvy"

---

### Year 1 Cost Summary

| Phase | Dev Weeks | Cost | Revenue |
|-------|-----------|------|---------|
| Phase 1 (Feb-Mar) | 4 | £0 | - |
| Phase 2 (Apr-May) | 5 | £60 storage | - |
| Phase 3 (Jun-Aug) | 6 | Outsavvy 1.5% | Ticket sales |
| Phase 4 (Sep-Nov) | 6 | £0 | Partner revenue, premium tiers |
| Phase 5 (Dec-Feb) | 4 | £0 | Traveller experiences |
| **Total** | **~25 weeks** | **~£300** | **Revenue positive by Q4** |

---

### Year 1 Training Calendar

| Month | Focus | Volunteers Developed |
|-------|-------|---------------------|
| **Feb** | BMM debrief, steward recruitment | 3-5 candidates |
| **Mar** | Steward training (moderation) | 3-5 trained |
| **Apr** | Navigator training (mediation) | 2-3 trained |
| **May** | Event Host workshop | 4-6 trained |
| **Jun** | Buddy Coordinator onboarding | 3-4 coordinators |
| **Jul** | Advanced steward training | Level-up existing |
| **Aug** | Cross-training | Multi-skilled volunteers |
| **Sep** | New cohort recruitment | Cycle repeats |
| **Oct** | Community of practice | Knowledge sharing |
| **Nov** | Annual review & recognition | Retention |
| **Dec** | Year 2 planning | Succession |

---

### Infrastructure

| Item | Timing | Impact |
|------|--------|--------|
| **Migrate to Coolify/Hostinger** | Post Phase 1 | Saves ~£200/year at scale |
| **Supabase Pro upgrade** | When >200 concurrent | ~£25/month for realtime |

---

## Part 8: Deferred Features (Year 2+)

| Feature | Notes |
|---------|-------|
| **Full realtime infrastructure** | Matrix/Element if scale demands |
| **International expansion** | After UK model proven |
| **Native mobile apps** | PWA sufficient for Year 1 |
| **Advanced theming** | User-selectable colour schemes beyond functional system |

---

*Document Version: 2.3*
*Last Updated: 2025-12-08*
*Prepared by: SuperClaude (🎯 Strategist + 🌍 Advocate)*
*For: BLKOUT UK Community Cooperative*

---

```
✊🏿 By Us, For Us
🤝 Mediation over exclusion
💛 Community culture, co-created
🎓 Skills development, not just features
💬 Realtime connection, intentional focus
🎉 See you at Black Meat Market!
```
