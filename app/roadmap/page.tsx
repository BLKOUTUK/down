'use client';

import React, { useState } from 'react';

const DownRoadmap = () => {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const phases = [
    {
      id: 1,
      title: 'Foundation',
      period: 'Feb-Mar 2026',
      color: '#D4A574',
      features: [
        'Realtime messaging',
        'Settings & Community pages',
        'Moderation tools',
        'Status indicators'
      ]
    },
    {
      id: 2,
      title: 'Intimacy Features',
      period: 'Apr-May 2026',
      color: '#E8C5A0',
      features: [
        'Private photo albums',
        'Disappearing messages',
        'Endorsements',
        'Feedback prompts'
      ]
    },
    {
      id: 3,
      title: 'Community & Events',
      period: 'Jun-Aug 2026',
      color: '#C49A6C',
      features: [
        'Buddy system (training-gated)',
        'Member-hosted meetups',
        'Voice notes',
        'Match messaging always-on'
      ]
    },
    {
      id: 4,
      title: 'Growth',
      period: 'Sep-Nov 2026',
      color: '#B8956A',
      features: [
        'Partner discounts',
        'Traveller profiles',
        'Party hosting',
        'Tiered access'
      ]
    }
  ];

  const values = [
    {
      icon: '✊',
      label: 'Community-powered operations',
      points: [
        'Members shape features through feedback, not algorithms',
        'Moderation by trained community members who know us',
        'Surplus reinvested in sexual health and mental health support'
      ]
    },
    {
      icon: '🤝',
      label: 'Values-aligned partnerships',
      points: [
        'Outsavvy over Stripe — keeping revenue in community ecosystems',
        'Partner venues that share our commitment to safety and joy',
        'Black-owned and queer-owned businesses first, always'
      ]
    },
    {
      icon: '📚',
      label: 'Training before features',
      points: [
        'Buddy system unlocked through community education, not just clicks',
        'Building trust and skills alongside every new tool',
        'Powerful features come with accountability built in'
      ]
    },
    {
      icon: '🎯',
      label: 'Focus over distraction',
      points: [
        '36-hour windows mean everyone online is actually present',
        'Forced breaks protect wellbeing, not engagement metrics',
        'Quality connections over infinite scrolling'
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0D0D0D 0%, #1A1A1A 40%, #0D0D0D 100%)',
      color: '#F5F0EB',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: '0',
      overflow: 'hidden'
    }}>
      {/* Decorative grain overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{
          padding: '48px 32px 32px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(212, 165, 116, 0.15)'
        }}>
          <div style={{
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            <h1 style={{
              fontSize: '72px',
              fontWeight: '900',
              letterSpacing: '-4px',
              margin: 0,
              background: 'linear-gradient(135deg, #D4A574 0%, #F5E6D3 50%, #D4A574 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 80px rgba(212, 165, 116, 0.3)'
            }}>
              DOWN
            </h1>
          </div>
          <p style={{
            fontSize: '14px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#D4A574',
            margin: '8px 0 24px',
            fontWeight: '500'
          }}>
            Put Your Phone Down. Get Down.
          </p>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '300',
            color: '#F5F0EB',
            margin: '0 0 8px',
            letterSpacing: '-0.5px'
          }}>
            First Impressions Survey
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(245, 240, 235, 0.6)',
            margin: 0
          }}>
            Product Roadmap · February 2026 — February 2027
          </p>
        </header>

        {/* Survey CTA */}
        <section style={{
          padding: '48px 32px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(212, 165, 116, 0.08) 0%, transparent 100%)'
        }}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdk3azo5qC4KToH9jmfX4wt2v7YIHGc18HX0vE_Sf_sjwMQyA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '20px 48px',
              background: 'linear-gradient(135deg, #D4A574 0%, #C49A6C 100%)',
              color: '#0D0D0D',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 24px rgba(212, 165, 116, 0.3)'
            }}
          >
            Share Your Feedback →
          </a>
          <p style={{
            marginTop: '16px',
            fontSize: '14px',
            color: 'rgba(245, 240, 235, 0.5)'
          }}>
            Your voice shapes what we build
          </p>
        </section>

        {/* Design Principles Section */}
        <section style={{
          padding: '48px 32px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontSize: '12px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#D4A574',
              marginBottom: '16px'
            }}>
              Built From Experience
            </h3>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#F5F0EB',
              margin: '0 0 16px',
              lineHeight: '1.3'
            }}>
              For Us, By Us — Community-Owned & Asset-Locked
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'rgba(245, 240, 235, 0.7)',
              lineHeight: '1.7',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Every feature comes from lived experience. As a <strong style={{ color: '#D4A574' }}>Community Benefit Society</strong>,
              all surplus is legally locked for reinvestment in our community — sexual health, mental health,
              and the infrastructure that makes connection possible. The app includes signposting via
              <strong style={{ color: '#D4A574' }}> IVOR AI</strong> to sexual health services, social groups,
              and community support. No extraction. No exits. Just us.
            </p>
          </div>

          {/* Principles Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {/* Black Space */}
            <div style={{
              background: 'rgba(212, 165, 116, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '12px'
              }}>🖤</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#F5F0EB',
                margin: '0 0 12px'
              }}>
                A Black Space
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(245, 240, 235, 0.7)',
                lineHeight: '1.6',
                margin: 0
              }}>
                Black-owned, Black-led, Black-focused. The initial cohort is Black only.
                Future mixed cohorts happen only if Black members want them — the community
                decides who the community is, not market pressure.
              </p>
            </div>

            {/* Expansive Queer Identity */}
            <div style={{
              background: 'rgba(212, 165, 116, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '12px'
              }}>🌈</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#F5F0EB',
                margin: '0 0 12px'
              }}>
                All of Us
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(245, 240, 235, 0.7)',
                lineHeight: '1.6',
                margin: 0
              }}>
                Trans, non-binary, cis. Gay, bisexual, MSM, SGL — however you identify.
                Your pronouns are your choice. We&apos;re convening an advisory group to ensure
                we build this right. Expansive, not exclusive.
              </p>
            </div>

            {/* Sex-Positive Without Shame */}
            <div style={{
              background: 'rgba(212, 165, 116, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '12px'
              }}>💫</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#F5F0EB',
                margin: '0 0 12px'
              }}>
                Sex-Positive, Shame-Free
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(245, 240, 235, 0.7)',
                lineHeight: '1.6',
                margin: 0
              }}>
                We&apos;re adults. Sex is part of this. The only questions are timing, mutual interest,
                and what you&apos;re open to right now. No false binaries between &quot;dating&quot; and &quot;hooking up&quot;
                — just honest connection.
              </p>
            </div>

            {/* Mediation Over Cancellation */}
            <div style={{
              background: 'rgba(212, 165, 116, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '12px'
              }}>🤝</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#F5F0EB',
                margin: '0 0 12px'
              }}>
                Mediation, Not Cancellation
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(245, 240, 235, 0.7)',
                lineHeight: '1.6',
                margin: 0
              }}>
                Repair over disposal. When harm happens, we work toward accountability
                and healing — not just removing people and moving on. This requires investment,
                but it&apos;s how communities actually grow.
              </p>
            </div>

            {/* Intimacy Through Limits */}
            <div style={{
              background: 'rgba(212, 165, 116, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '12px'
              }}>🔐</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#F5F0EB',
                margin: '0 0 12px'
              }}>
                Intimacy Through Limits
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(245, 240, 235, 0.7)',
                lineHeight: '1.6',
                margin: 0
              }}>
                500 per cohort. 36-hour windows. Periodic rotation. You can&apos;t hide in a crowd,
                the app can&apos;t become compulsive, and everyone online is actually present.
                Constraints that protect, not extract.
              </p>
            </div>

            {/* Connections That Continue */}
            <div style={{
              background: 'rgba(212, 165, 116, 0.08)',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '24px',
                marginBottom: '12px'
              }}>🔗</div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#F5F0EB',
                margin: '0 0 12px'
              }}>
                Bonds Don&apos;t Break at Midnight
              </h4>
              <p style={{
                fontSize: '14px',
                color: 'rgba(245, 240, 235, 0.7)',
                lineHeight: '1.6',
                margin: 0
              }}>
                Mutual matches stay connected between windows. The 36-hour limit protects
                browsing, not conversations. Once you&apos;ve matched, the thread continues —
                continuity over transactional encounters.
              </p>
            </div>
          </div>
        </section>

        {/* MVP Section */}
        <section style={{
          padding: '32px 32px 48px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'rgba(212, 165, 116, 0.05)',
            border: '1px solid rgba(212, 165, 116, 0.2)',
            borderRadius: '8px',
            padding: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(212, 165, 116, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <span style={{
                background: '#D4A574',
                color: '#0D0D0D',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                borderRadius: '2px'
              }}>
                MVP Launch
              </span>
              <span style={{
                color: 'rgba(245, 240, 235, 0.6)',
                fontSize: '14px'
              }}>
                Community Member Workshop · Early February 2026
              </span>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 16px',
              color: '#F5F0EB'
            }}>
              What You&apos;re Seeing Now
            </h3>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.7',
              color: 'rgba(245, 240, 235, 0.8)',
              margin: 0
            }}>
              The prototype you&apos;re reviewing is our minimum viable product. Core features include
              <strong style={{ color: '#D4A574' }}> member profiles</strong> with our distinctive
              <strong style={{ color: '#D4A574' }}> Intimacy Tab</strong>,
              <strong style={{ color: '#D4A574' }}> photo uploads</strong>,
              browse/like/match functionality, basic messaging, and event listings with RSVP.
            </p>
          </div>
        </section>

        {/* Roadmap */}
        <section style={{
          padding: '48px 32px 64px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: '12px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#D4A574',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Development Roadmap
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {phases.map((phase) => (
              <div
                key={phase.id}
                onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                style={{
                  background: activePhase === phase.id
                    ? 'rgba(212, 165, 116, 0.12)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${activePhase === phase.id ? phase.color : 'rgba(212, 165, 116, 0.15)'}`,
                  borderRadius: '8px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: phase.color,
                  opacity: activePhase === phase.id ? 1 : 0.5,
                  transition: 'opacity 0.3s ease'
                }} />
                <div style={{
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: phase.color,
                  marginBottom: '8px',
                  fontWeight: '600'
                }}>
                  Phase {phase.id}
                </div>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 4px',
                  color: '#F5F0EB'
                }}>
                  {phase.title}
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(245, 240, 235, 0.5)',
                  margin: '0 0 16px'
                }}>
                  {phase.period}
                </p>
                <ul style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none'
                }}>
                  {phase.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '14px',
                        color: 'rgba(245, 240, 235, 0.7)',
                        padding: '6px 0',
                        borderTop: idx > 0 ? '1px solid rgba(212, 165, 116, 0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{
                        width: '4px',
                        height: '4px',
                        background: phase.color,
                        borderRadius: '50%',
                        flexShrink: 0
                      }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Our Approach */}
        <section style={{
          padding: '48px 32px 64px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(212, 165, 116, 0.05) 100%)'
        }}>
          <h3 style={{
            fontSize: '12px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#D4A574',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Our Approach
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {values.map((value, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '28px',
                  borderRadius: '8px',
                  border: '1px solid rgba(212, 165, 116, 0.15)',
                  position: 'relative'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(212, 165, 116, 0.1)'
                }}>
                  <span style={{
                    fontSize: '24px',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(212, 165, 116, 0.1)',
                    borderRadius: '50%'
                  }}>{value.icon}</span>
                  <span style={{
                    fontSize: '16px',
                    color: '#F5F0EB',
                    fontWeight: '600',
                    lineHeight: '1.3'
                  }}>
                    {value.label}
                  </span>
                </div>
                <ul style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none'
                }}>
                  {value.points.map((point, pointIdx) => (
                    <li
                      key={pointIdx}
                      style={{
                        fontSize: '14px',
                        color: 'rgba(245, 240, 235, 0.7)',
                        padding: '8px 0',
                        paddingLeft: '16px',
                        position: 'relative',
                        lineHeight: '1.5'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: '14px',
                        width: '6px',
                        height: '6px',
                        background: '#D4A574',
                        borderRadius: '50%'
                      }} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <footer style={{
          padding: '48px 32px',
          textAlign: 'center',
          borderTop: '1px solid rgba(212, 165, 116, 0.15)'
        }}>
          <p style={{
            fontSize: '24px',
            fontWeight: '300',
            color: '#F5F0EB',
            margin: '0 0 24px',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.5'
          }}>
            Your feedback shapes this roadmap.<br />
            <strong style={{ color: '#D4A574', fontWeight: '600' }}>What matters most to you?</strong>
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdk3azo5qC4KToH9jmfX4wt2v7YIHGc18HX0vE_Sf_sjwMQyA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'transparent',
              color: '#D4A574',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              border: '2px solid #D4A574',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }}
          >
            Take the Survey
          </a>
          <div style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(212, 165, 116, 0.1)'
          }}>
            <p style={{
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(245, 240, 235, 0.4)',
              margin: 0
            }}>
              BLKOUT Creative Ltd · Community Benefit Society
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DownRoadmap;
