import React from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Briefcase,
  Globe,
  Layers,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";

import heroCluster from "../../../Public/Assets/axclade-hero/cluster-composition.png";

const FONT = "'Plus Jakarta Sans', sans-serif";

const T = {
  red: "#FF4E45",
  red2: "#FF3B30",
  navy: "#08193F",
  blue: "#4F6BFF",
  text: "#4A5675",
  border: "#E5EAF3",
  ringBlue: "rgba(108, 127, 255, 0.18)",
  ringRed: "rgba(255, 78, 69, 0.13)",
} as const;

const services = [
  { label: "Websites", icon: Globe, color: T.blue },
  { label: "Marketing", icon: BarChart3, color: T.red },
  { label: "Automation", icon: Bot, color: T.blue },
  { label: "Apps", icon: Layers, color: T.blue },
  { label: "Growth Systems", icon: TrendingUp, color: T.red },
] as const;

const trustLogos = [
  { name: "Google", src: "/Assets/axclade-hero/logos/google_PNG19644.png", height: 18, maxWidth: 92 },
  { name: "Meta", src: "/Assets/axclade-hero/logos/Meta.png", height: 18, maxWidth: 104 },
  { name: "HubSpot", src: "/Assets/axclade-hero/logos/HubSpot_Logo.png", height: 18, maxWidth: 104 },
  { name: "Shopify", src: "/Assets/axclade-hero/logos/Shopify_logo.svg.png", height: 24, maxWidth: 112 },
  { name: "Webflow", src: "/Assets/axclade-hero/logos/Webflow.png", height: 18, maxWidth: 108 },
  { name: "AWS", src: "/Assets/axclade-hero/logos/AWS.png", height: 26, maxWidth: 70 },
] as const;

const cards = [
  { key: "leads", pos: { top: "-24%", left: "8%" }, width: 176 },
  { key: "analytics", pos: { top: "-14%", right: "-6%" }, width: 150 },
  { key: "satisfaction", pos: { top: "14%", left: "-16%" }, width: 166 },
  { key: "projects", pos: { bottom: "13%", left: "7%" }, width: 164 },
  { key: "rating", pos: { bottom: "15%", right: "-7%" }, width: 172 },
] as const;

type AxcladeHomeHeroProps = {
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
};

const dragCardProps = {
  drag: true as const,
  dragConstraints: { left: -28, right: 28, top: -28, bottom: 28 },
  dragElastic: 0.12,
  dragMomentum: false,
  whileDrag: { scale: 1.03, y: -4 },
  whileHover: { y: -2 },
  style: { cursor: "grab" as const },
};

function TrustLogo({ logo }: { logo: (typeof trustLogos)[number] }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: 34, minWidth: logo.maxWidth, maxWidth: logo.maxWidth }}
    >
      <img
        src={logo.src}
        alt={logo.name}
        style={{ height: logo.height, maxWidth: logo.maxWidth, width: "auto", objectFit: "contain", display: "block" }}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

function GlassCard({
  children,
  style,
  className = "",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] ${className}`}
      style={{
        background: "rgba(255,255,255,.82)",
        border: "1px solid rgba(255,255,255,.92)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        boxShadow: "0 24px 60px rgba(8,25,63,.10), inset 0 1px 0 rgba(255,255,255,.95)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function VisualCard({ card, index }: { card: (typeof cards)[number]; index: number }) {
  if (card.key === "leads") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.06 + index * 0.05 }}
        {...dragCardProps}
        className="absolute z-[8]"
        style={{ ...dragCardProps.style, ...card.pos, width: card.width }}
      >
        <GlassCard className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15, color: T.navy, lineHeight: 1.05 }}>+250%</div>
              <div className="mt-2" style={{ fontFamily: FONT, fontSize: 10, color: T.text }}>Leads Generated</div>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "rgba(255,78,69,.10)", color: T.red }}>
              <TrendingUp size={12} />
            </div>
          </div>
          <div className="mt-3 h-10 overflow-hidden rounded-[16px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,78,69,.14) 100%)", position: "relative" }}>
            <svg viewBox="0 0 180 52" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <path d="M8 40 C 24 30, 38 46, 56 33 S 94 38, 111 21 S 148 28, 172 10" fill="none" stroke="#FF4E45" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  if (card.key === "analytics") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.06 + index * 0.05 }}
        {...dragCardProps}
        className="absolute z-[8]"
        style={{ ...dragCardProps.style, ...card.pos, width: card.width }}
      >
        <GlassCard className="p-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11, color: T.navy }}>Growth Analytics</div>
              <div className="mt-1" style={{ fontFamily: FONT, fontSize: 9, color: T.text }}>This Month</div>
            </div>
            <span className="rounded-full px-2 py-1" style={{ fontFamily: FONT, fontSize: 7.5, color: "#7B88AA", background: "#F3F6FD" }}>
              This Month
            </span>
          </div>
          <div className="mt-1.5 flex items-end gap-1.5">
            {[24, 38, 32, 58, 72].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  height: h * 0.52,
                  background: i === 4 ? "linear-gradient(180deg, #FF7D8B 0%, #FF4E45 100%)" : "linear-gradient(180deg, #BFCBFF 0%, #6E8AFF 100%)",
                }}
              />
            ))}
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  if (card.key === "satisfaction") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.06 + index * 0.05 }}
        {...dragCardProps}
        className="absolute z-[8]"
        style={{ ...dragCardProps.style, ...card.pos, width: card.width }}
      >
        <GlassCard className="p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(79,107,255,.10)", color: T.blue }}>
              <Bot size={14} />
            </div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: T.navy, lineHeight: 1.05 }}>98%</div>
              <div className="mt-1.5" style={{ fontFamily: FONT, fontSize: 9.5, color: T.text }}>Client Satisfaction</div>
              <div className="mt-2.5 flex items-center gap-1" style={{ color: "#FFBF2F" }}>
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} size={11} fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  if (card.key === "projects") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.06 + index * 0.05 }}
        {...dragCardProps}
        className="absolute z-[8]"
        style={{ ...dragCardProps.style, ...card.pos, width: card.width }}
      >
        <GlassCard className="p-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl" style={{ background: "rgba(255,78,69,.10)", color: T.red }}>
              <Briefcase size={14} />
            </div>
            <div style={{ marginLeft: 2 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: T.navy, lineHeight: 1.05 }}>120+</div>
              <div className="mt-1.5" style={{ fontFamily: FONT, fontSize: 9.5, color: T.text }}>Projects Done</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: 0.06 + index * 0.05 }}
      {...dragCardProps}
      className="absolute z-[8]"
      style={{ ...dragCardProps.style, ...card.pos, width: card.width }}
    >
      <GlassCard className="p-3.5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(79,107,255,.12)", color: T.blue }}>
            <Star size={14} />
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: T.navy, lineHeight: 1.05 }}>4.9</div>
            <div className="mt-1.5" style={{ fontFamily: FONT, fontSize: 9.5, color: T.text }}>Average Rating</div>
            <div className="mt-2.5 flex items-center gap-1" style={{ color: "#FFBF2F" }}>
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} size={11} fill="currentColor" />
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[800px]" style={{ height: "min(730px, 68vh)" }}>
      <div className="absolute inset-[6%] rounded-full border border-dashed opacity-60" style={{ borderColor: T.ringBlue }} />
      <div className="absolute inset-[17%] rounded-full border border-dashed opacity-50" style={{ borderColor: T.ringRed }} />
      <div className="absolute inset-[29%] rounded-full border border-dashed opacity-42" style={{ borderColor: T.ringBlue }} />

      <div className="absolute left-[11%] top-[34%] h-14 w-14 rounded-full" style={{ background: "linear-gradient(160deg, rgba(255,255,255,.9), rgba(210,220,255,.32))", border: "1px solid rgba(255,255,255,.9)", boxShadow: "0 18px 34px rgba(79,107,255,.11)" }} />
      <div className="absolute right-[17%] top-[2%] h-16 w-16 rounded-full" style={{ background: "linear-gradient(160deg, rgba(255,255,255,.92), rgba(210,220,255,.28))", border: "1px solid rgba(255,255,255,.88)", boxShadow: "0 18px 34px rgba(79,107,255,.12)" }} />
      <div className="absolute right-[4%] top-[42%] h-14 w-14 rounded-full" style={{ background: "linear-gradient(160deg, rgba(255,255,255,.9), rgba(210,220,255,.28))", border: "1px solid rgba(255,255,255,.88)", boxShadow: "0 18px 34px rgba(79,107,255,.12)" }} />
      <div className="absolute left-[18%] bottom-[15%] h-14 w-14 rounded-full" style={{ background: "linear-gradient(160deg, rgba(255,255,255,.9), rgba(210,220,255,.28))", border: "1px solid rgba(255,255,255,.88)", boxShadow: "0 18px 34px rgba(79,107,255,.12)" }} />
      <div className="absolute right-[11%] bottom-[5%] h-24 w-24 rounded-full" style={{ background: "linear-gradient(160deg, rgba(255,255,255,.92), rgba(210,220,255,.28))", border: "1px solid rgba(255,255,255,.88)", boxShadow: "0 18px 34px rgba(79,107,255,.12)" }} />

      <div className="absolute right-[12%] top-[23%] h-[210px] w-[210px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,78,69,.10), rgba(255,78,69,0) 70%)", filter: "blur(14px)" }} />
      <div className="absolute bottom-[20%] right-[21%] h-[220px] w-[220px] rounded-full" style={{ background: "radial-gradient(circle, rgba(79,107,255,.18), rgba(79,107,255,0) 70%)", filter: "blur(18px)" }} />

      {cards.map((card, index) => (
        <VisualCard key={card.key} card={card} index={index} />
      ))}

      <div className="absolute left-[8%] right-[2%] bottom-[10%] h-[110px] z-[6]" style={{ background: "linear-gradient(90deg, rgba(8,25,63,0) 0%, rgba(8,25,63,.05) 16%, rgba(8,25,63,.11) 38%, rgba(8,25,63,.1) 63%, rgba(8,25,63,.04) 82%, rgba(8,25,63,0) 100%)", filter: "blur(32px)", opacity: 0.26 }} />
      <div className="absolute left-[20%] right-[0%] bottom-[-2%] h-[156px] z-[7]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.10) 18%, rgba(255,255,255,.82) 66%, rgba(255,255,255,1) 100%)", filter: "blur(16px)" }} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="absolute bottom-[-7%] right-[14%] z-[7] w-[76%] min-w-[400px] max-w-[595px] pointer-events-none"
      >
        <img
          src={heroCluster}
          alt="3D social media hand composition"
          style={{ width: "100%", objectFit: "contain", objectPosition: "center bottom", filter: "drop-shadow(0 34px 52px rgba(8,25,63,.12))" }}
        />
      </motion.div>
    </div>
  );
}

export default function AxcladeHomeHero({ onPrimaryAction, onSecondaryAction }: AxcladeHomeHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F7F8FC 56%, #EEF2F8 100%)",
      }}
    >
      <div className="axclade-hero-dotmask absolute inset-0 pointer-events-none opacity-55" />
      <div className="absolute -left-24 top-28 h-[340px] w-[340px] rounded-full" style={{ background: "radial-gradient(circle, rgba(79,107,255,.14), rgba(79,107,255,0) 70%)", filter: "blur(14px)" }} />
      <div className="absolute right-[-60px] top-[100px] h-[300px] w-[300px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,78,69,.11), rgba(255,78,69,0) 68%)", filter: "blur(12px)" }} />

      <div className="relative mx-auto flex max-w-[1440px] flex-col px-5 pb-5 pt-20 sm:px-6 sm:pt-24 lg:min-h-[calc(100vh-58px)] lg:px-10 lg:pb-6 lg:pt-24 xl:px-14">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] lg:gap-4 lg:pb-[158px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.44 }}
            className="relative z-10 max-w-[620px] self-center pt-4 lg:pt-0"
          >
            <h1
              className="max-w-[680px]"
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 4.45vw, 4.25rem)",
                lineHeight: 0.9,
                letterSpacing: "-2.8px",
                color: T.navy,
              }}
            >
              Smart Digital
              <br />
              Growth Solutions
              <br />
              for{" "}
              <span style={{ background: `linear-gradient(135deg, ${T.red} 0%, ${T.red2} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Modern
              </span>
              <br />
              <span style={{ background: `linear-gradient(135deg, ${T.red} 0%, ${T.red2} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Businesses
              </span>
            </h1>

            <p className="mt-4 max-w-[520px]" style={{ fontFamily: FONT, fontWeight: 400, fontSize: "clamp(1rem, 1.5vw, 1.32rem)", lineHeight: 1.68, color: T.text }}>
              We help businesses generate leads, build stronger brands, and scale with smarter digital systems.
            </p>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onPrimaryAction}
                className="inline-flex h-[56px] min-w-[304px] items-center justify-center gap-2 rounded-[17px] px-5.5 text-white"
                style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, background: `linear-gradient(135deg, ${T.red} 0%, ${T.red2} 100%)`, boxShadow: "0 22px 40px rgba(255,78,69,.28)", whiteSpace: "nowrap" }}
              >
                Book Free Growth Consultation <ArrowRight size={16} />
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSecondaryAction}
                className="inline-flex h-[56px] min-w-[282px] items-center justify-center gap-2 rounded-[17px] px-5.5"
                style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: T.navy, background: "rgba(255,255,255,.94)", border: `1px solid ${T.border}`, boxShadow: "0 16px 34px rgba(8,25,63,.08)", whiteSpace: "nowrap" }}
              >
                Explore Growth Packages <ArrowUpRight size={16} />
              </motion.button>
            </div>

            <div className="mt-8 flex max-w-[760px] flex-wrap gap-2 sm:flex-nowrap sm:justify-between">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.label}
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[13px] px-3 sm:min-w-0"
                    style={{ background: "rgba(255,255,255,.94)", border: `1px solid ${T.border}`, boxShadow: "0 10px 24px rgba(8,25,63,.05)" }}
                  >
                    <span style={{ color: service.color }}>
                      <Icon size={14} />
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: 11.5, fontWeight: 600, color: T.navy, whiteSpace: "nowrap" }}>{service.label}</span>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-6 inline-flex max-w-[610px] items-start gap-3 rounded-[18px] px-4 py-4"
              style={{ background: "rgba(255,255,255,.76)", border: "1px solid rgba(229,234,243,.88)" }}
            >
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl" style={{ background: "rgba(79,107,255,.12)", color: T.blue }}>
                <Shield size={17} />
              </div>
              <p style={{ fontFamily: FONT, fontSize: 13, lineHeight: 1.65, color: T.text }}>
                Trusted by ambitious brands worldwide to drive measurable growth.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.44, delay: 0.08 }}
            className="relative z-10 self-end lg:mr-[-4px]"
          >
            <HeroVisual />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.42 }}
          className="relative z-20 mt-8 rounded-[26px] px-4 py-5 sm:px-5 lg:absolute lg:bottom-14 lg:left-3 lg:right-3 lg:mt-0 lg:px-4 lg:py-6 xl:left-4 xl:right-4"
        >
          <div
            className="pointer-events-none absolute inset-x-[4%] -top-2 bottom-[-8px] z-0 rounded-[30px]"
            style={{
              background: "rgba(255,255,255,.88)",
              filter: "blur(20px)",
              opacity: 0.9,
            }}
          />
          <GlassCard
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,.78) 0%, rgba(255,255,255,.68) 100%)",
              border: "1px solid rgba(255,255,255,.9)",
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
              boxShadow: "0 28px 60px rgba(8,25,63,.10), inset 0 1px 0 rgba(255,255,255,.96)",
            }}
            className="relative z-[1]"
          >
            <div className="flex flex-col gap-6 px-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-4">
              <div className="lg:min-w-[210px] lg:pr-3">
                <span style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: T.navy }}>Trusted by leading brands</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:flex-1 lg:flex-nowrap lg:justify-center lg:px-3">
                {trustLogos.map((logo) => (
                  <TrustLogo key={logo.name} logo={logo} />
                ))}
              </div>

              <div className="flex flex-nowrap items-center lg:ml-3 lg:pl-2">
                {[["500+", "Projects Delivered"], ["98%", "Client Satisfaction"]].map(([value, label]) => (
                  <div key={label} className="min-w-[128px] px-4 py-2" style={{ borderLeft: "1px solid rgba(214,223,241,.82)" }}>
                    <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 800, color: T.navy, lineHeight: 1.1 }}>{value}</div>
                    <div className="mt-1" style={{ fontFamily: FONT, fontSize: 10.5, color: T.text }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
