# Premium SaaS Feature Cards Section – Figma AI Prompt

Create a premium modern SaaS website section featuring 3 glowing feature cards. The design should feel like a combination of Stripe, Linear, Vercel, and modern AI startup branding.

## Design Direction

Maintain the exact component structure, layout hierarchy, spacing system, and card composition described below.

Refine only:

* Color palette
* Typography
* Card visual styling
* Glow effects
* Premium enterprise aesthetics
* Modern SaaS UI polish

The overall visual style should feel:

* Premium
* Futuristic
* Professional
* Enterprise-grade
* Clean and minimal
* High-end product design

---

## Color Tokens

Primary Red:
#FF4E45

Deep Navy:
#0A1330

Outer Space Blue:
#192545

White:
#FFFFFF

Soft Gray:
#F5F7FB

Border Gray:
#E5EAF3

Muted Text:
#647089

Success Accent:
#22C55E

---

## Typography System

Use Neoverse Sans style.

### Display / Hero

* 64–76px
* ExtraBold
* Line Height: 105%

### H1

* 56–64px
* Bold

### H2

* 40–48px
* Bold

### H3

* 28–34px
* Bold

### Card Title

* 20px
* SemiBold
* Tight letter spacing

### Body Text

* 16px
* Regular
* Line Height: 160%

### Small Label

* 12px
* Uppercase
* Letter spacing 12%

### Button

* 15px
* SemiBold

---

## Section Background

Use a dark premium gradient background:

Background:
Linear Gradient
180deg
#050811 → #0A1330

Add subtle radial ambient lights:

* Top Left Glow: Red (#FF4E45 at 10% opacity)
* Bottom Right Glow: Blue (#4361EE at 8% opacity)

Create a luxurious dark atmosphere.

---

## Global Layout

Main wrapper:

* Min Height: 100vh
* Center aligned
* Horizontal and vertical center
* Spacious padding
* Maximum content width: 936px

Grid Layout:

* 3 columns desktop
* 1 column mobile
* Consistent spacing
* Perfect visual balance

---

# Feature Card Component

Create a reusable Feature Card component.

Props:

* Title
* Description
* Icon
* Gradient
* Animation Delay

---

## Card Shape

Keep the original dimensions.

Upgrade shape:

* Large 40px border radius
* Soft geometric corners
* Premium glass-panel appearance

Card Height:
300px

Card Width:
300px

---

## Glow Layer (Behind Card)

Create an oversized blurred glow.

Glow Settings:

* Opacity: 60%
* Blur: 45px
* Radius: 40px

The glow should smoothly blend into the background.

Use the supplied card gradient colors.

Glow must appear elegant, not neon.

---

## Foreground Card

Use a premium layered card design.

Background:
Linear Gradient
180deg
#10172F
#0A1330

Border:
8px transparent border

Use gradient-border technique.

Add:

* Inner highlight
* Subtle glass reflection
* Soft edge lighting

Shadow:
0 20px 60px rgba(0,0,0,0.45)

---

## Hover Effects

On hover:

* Card lifts 10px
* Glow intensity increases
* Border becomes brighter
* Icon scales to 105%
* Smooth transition 0.4s

Maintain elegant motion.

---

## Icon Area

Position:
Top Left

Size:
32px

Style:

* White
* Slight glow
* High contrast

Icon Container:

* 56px circular glass surface
* Background:
  rgba(255,255,255,0.06)
* Border:
  1px rgba(255,255,255,0.08)

---

## Title Styling

Color:
#FFFFFF

Font:
Neoverse Sans SemiBold

Size:
20px

Letter Spacing:
-1%

---

## Description Styling

Color:
#647089

Font Size:
16px

Line Height:
160%

Maximum readability.

---

# Card Data

## Card 1

Title:
Hardware

Icon:
Monitor

Description:
"My entire desktop setup is built for power. It is silent, durable, and holds my focus."

Gradient:
linear-gradient(
137deg,
#FF4E45 0%,
#FF8A82 45%,
#FFD3D0 100%
)

Animation Delay:
0.1

---

## Card 2

Title:
Studio

Icon:
Palette

Description:
"Studio is where I define every single pixel. It is the hub for each canvas I deliver."

Gradient:
linear-gradient(
137deg,
#FFFFFF 0%,
#7DD3FC 45%,
#06B6D4 100%
)

Animation Delay:
0.2

---

## Card 3

Title:
Motion

Icon:
Zap

Description:
"I use Motion to build lively prototypes, bridging the gap between views and code."

Gradient:
linear-gradient(
137deg,
#4361EE 0%,
#E0AEFF 45%,
#FF4E45 100%
)

Animation Delay:
0.3

---

# Button Components

Create a complete button system.

## Primary Button

Background:
#FF4E45

Text:
White

Shape:
Pill

Height:
52px

Glow:
Red subtle outer glow

Icon:
Arrow Right

---

## Secondary Button

Background:
White

Text:
#0A1330

Border:
1px solid #E5EAF3

Shape:
Pill

---

## Dark Button

Background:
#0A1330

Text:
White

Shape:
Pill

---

## Text Link

Text:
#0A1330

Arrow:
#FF4E45

Underline on hover.

---

## Icon Button

Circular button.

Background:
White

Icon:
Red or Navy

Soft shadow.

---

## Animation

Use Motion / Framer Motion.

Card Animation:

Initial:
{
opacity: 0,
y: 30
}

Animate:
{
opacity: 1,
y: 0
}

Transition:
{
duration: 0.8,
ease: "easeOut",
delay
}

Hover:
{
y: -10,
scale: 1.02
}

---

## Final Design Goal

Create a world-class premium SaaS feature section that looks suitable for:

* AI Company
* Enterprise Software
* Digital Agency
* Fintech Platform
* Startup Landing Page

The design should feel modern, expensive, highly polished, conversion-focused, and ready for production.
