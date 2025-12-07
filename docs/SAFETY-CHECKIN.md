# DOWN Safety Check-In Feature Scope
## *Accountability Partner / Risk Management Peer-to-Peer Tool*

---

```
🛡️ SEALED ENVELOPE SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ Going somewhere?                         │
│ Tell a trusted peer.                     │
│ If you don't check in, they'll know.     │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Feature**: Safety Check-In / Sealed Envelope System
**Priority**: P1 (Community Safety Feature)
**Target Version**: v1.1
**Date**: 2025-12-07

---

## Executive Summary

Black queer men face disproportionate risks when meeting strangers. This feature provides a **peer-to-peer accountability system** where users can:

1. **Create a "sealed envelope"** with critical info before a meetup
2. **Designate a trusted peer** who will be notified if check-in is missed
3. **Set a deadline** for checking in safely
4. **Seal sensitive data** that only opens if something goes wrong

---

## Core Concept: Sealed Envelope Model

```
SEALED (Normal State)              OPENED (Triggered)
┌─────────────────────────┐       ┌─────────────────────────┐
│ 📍 ████████████████     │  →→→  │ 📍 47 Commercial St     │
│ 👤 ████████████████     │       │ 👤 Darnell from DOWN    │
│ 📝 ████████████████     │       │ 📝 "Call me first..."   │
│                         │       │                         │
│ Opens: 11:00 PM         │       │ ⚠️ MISSED CHECK-IN      │
│ Peer: Marcus            │       │ Opened: 11:07 PM        │
└─────────────────────────┘       └─────────────────────────┘
```

---

## Check-In States

| State | Description | Peer Sees |
|-------|-------------|-----------|
| `ACTIVE` 🟢 | Timer running | "Check-in exists" only |
| `SAFE` ✅ | User confirmed safe | "All clear" notification |
| `EXTENDED` 🟡 | User requested more time | New deadline |
| `MISSED` 🔴 | Deadline passed | Full sealed data |
| `SOS` 🚨 | User triggered emergency | Full data + urgent alert |
| `CANCELLED` ⚪ | User cancelled | "Cancelled" notification |

---

## Database Schema

```sql
-- Trusted safety contacts
CREATE TABLE safety_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  contact_type TEXT CHECK (contact_type IN ('down_user', 'phone', 'email')),
  down_user_id UUID REFERENCES users(id),
  phone TEXT,
  email TEXT,
  nickname TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Check-in records
CREATE TABLE safety_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  peer_contact_id UUID REFERENCES safety_contacts(id),
  status TEXT DEFAULT 'ACTIVE',
  deadline TIMESTAMPTZ NOT NULL,
  checked_in_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  meeting_down_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sealed envelope data (encrypted)
CREATE TABLE checkin_sealed_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_id UUID REFERENCES safety_checkins(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  destination_notes TEXT,
  meeting_person_name TEXT,
  meeting_person_photo_url TEXT,
  custom_notes TEXT,
  share_live_location BOOLEAN DEFAULT false,
  last_known_lat DECIMAL(10, 8),
  last_known_lng DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## UI Flow

**Create Check-In (3 steps)**:
1. Where & When → Address, deadline, optional live location
2. Who → Name, photo, DOWN profile link if applicable
3. Peer → Select from contacts or add new

**Active Check-In Card**:
```
┌─────────────────────────────────────────┐
│ 🟢 Active: Meeting Darnell              │
│ Check in by 11:00 PM (2h 15m)           │
│                                         │
│ [ ✅ I'M SAFE ] [ ⏰ Extend ] [ 🚨 SOS ] │
└─────────────────────────────────────────┘
```

---

## Estimated Effort

| Component | Days |
|-----------|------|
| Database schema | 0.5 |
| API endpoints | 2 |
| Deadline cron job | 0.5 |
| Create check-in UI | 2 |
| Active check-in card | 1 |
| Peer notification view | 1.5 |
| In-app notifications | 1 |
| SMS integration | 1.5 |
| Testing | 2 |
| **Total** | **~12 days** |

---

## Integration Points

- Prompt in messaging when meetup discussed
- Link to DOWN profiles if meeting app user
- Safety badges for responsive peers

---

*Prepared by: SuperClaude (🛡️ Guardian + 🏗️ Architect)*
