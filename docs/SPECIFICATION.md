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

*Document Version: 2.0*
*Last Updated: 2025-12-07*
*Prepared by: SuperClaude (🎯 Strategist + 🌍 Advocate)*
*For: BLKOUT UK Community Cooperative*

---

```
✊🏿 By Us, For Us
🤝 Mediation over exclusion
💛 Community culture, co-created
🎉 See you at Black Meat Market!
```
