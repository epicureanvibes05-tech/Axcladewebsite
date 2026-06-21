import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import {
  ArrowRight, ArrowUpRight, Star, Check, ChevronDown,
  Globe, Smartphone, Code2, Bot, Cpu, TrendingUp, Users, Shield,
  Target, Rocket, Brain, LineChart, Layers, Zap, BarChart3,
  Sparkles, Monitor, Briefcase, ShoppingBag, Building2, Utensils,
  Scissors, Dumbbell, HeartPulse, Send, MessageSquare,
  Mail, Phone, MapPin, Menu, X, Activity, Package,
} from "lucide-react";
import AxcladeHomeHero from "./components/AxcladeHomeHero";
import solutionsHeroComposition from "../../Public/Assets/solutions-hero-composition.png";
import axcladeLogo from "../../Public/Assets/branding/axclade-logo.png";
import axcladeIcon from "../../Public/Assets/branding/axclade-icon.png";
import axcladeFinalIcon from "../../Public/Assets/branding/axclade-final-icon.png";
import axcladeLogoObject from "../../Public/Assets/branding/axclade-logo-object.png";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  red:    "#FF4E45",
  navy:   "#0A1330",
  space:  "#192545",
  white:  "#FFFFFF",
  soft:   "#F5F7FB",
  border: "#E5EAF3",
  muted:  "#647089",
  success:"#22C55E",
  blue:   "#4361EE",
} as const;

const FONT = "'Plus Jakarta Sans', sans-serif";

type Page = "home"|"packages"|"solutions"|"industries"|"process"|"case-studies"|"about"|"contact";

const sparkData = [{v:80},{v:120},{v:95},{v:160},{v:140},{v:210},{v:185},{v:260}];

const GLOBAL_CSS = `
  /* ── Base ───────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  img  { max-width: 100%; height: auto; display: block; }
  ::selection { background: #FF4E4520; color: #0A1330; }

  /* ── Scrollbar ──────────────────────────────────────────── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(10,19,48,.18); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(10,19,48,.32); }
  * { scrollbar-width: thin; scrollbar-color: rgba(10,19,48,.18) transparent; }

  /* ── Keyframes ──────────────────────────────────────────── */
  @keyframes marquee  { from { transform: translateX(0) }  to { transform: translateX(-50%) } }
  @keyframes float    { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
  @keyframes floatB   { 0%,100% { transform: translateY(0) } 50% { transform: translateY(8px)  } }
  @keyframes glowPulse{ 0%,100% { box-shadow: 0 0 0 0 rgba(255,78,69,0) }
                         50%     { box-shadow: 0 0 20px 6px rgba(255,78,69,.2) } }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin-slow{ from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

  /* ── Global hover transitions ───────────────────────────── */
  button, a { -webkit-tap-highlight-color: transparent; }
  .ax-card  { transition: transform .22s ease, box-shadow .22s ease; }
  .ax-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(10,19,48,.12); }

  /* ── Button arrow slide ─────────────────────────────────── */
  .ax-btn-arrow { display: inline-flex; align-items: center; gap: 6px; }
  .ax-btn-arrow svg { transition: transform .25s ease; }
  .ax-btn-arrow:hover svg { transform: translateX(4px); }

  /* ── Input focus ring ───────────────────────────────────── */
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #FF4E45 !important;
    box-shadow: 0 0 0 3px rgba(255,78,69,.12) !important;
  }

  /* ── Card hover lift + glow for pricing ─────────────────── */
  .ax-pricing-card { transition: transform .3s ease, box-shadow .3s ease; cursor: pointer; }
  .ax-pricing-card:hover { transform: translateY(-8px); }
  .ax-pricing-card-pop:hover {
    box-shadow: 0 40px 100px rgba(255,78,69,.25), 0 0 0 2px #FF4E45 !important;
  }

  /* ── Service card hover ─────────────────────────────────── */
  .ax-service-card { transition: transform .22s ease, box-shadow .22s ease; }
  .ax-service-card:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(10,19,48,.12); }

  /* ── CTA glow button ────────────────────────────────────── */
  .ax-glow-btn { transition: box-shadow .3s ease, transform .2s ease, opacity .2s ease; }
  .ax-glow-btn:hover {
    box-shadow: 0 0 32px rgba(255,78,69,.5), 0 6px 24px rgba(255,78,69,.3) !important;
    transform: scale(1.03);
  }
  .ax-glow-btn:active { transform: scale(.98); }

  /* ── Footer icon hover ──────────────────────────────────── */
  .ax-footer-link { transition: color .18s ease; }
  .ax-footer-link:hover { color: #FF4E45 !important; }

  /* ── Accordion ──────────────────────────────────────────── */
  .ax-accordion-body { overflow: hidden; transition: height .25s ease, opacity .25s ease; }

  /* ── Case study card reveal ─────────────────────────────── */
  .ax-reveal { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
  .ax-reveal.visible { opacity: 1; transform: translateY(0); }

  /* ── Process step connector ─────────────────────────────── */
  .ax-connector { background: linear-gradient(to right, #E5EAF3, #E5EAF3); transition: background .4s ease; }
  .ax-connector.active { background: linear-gradient(to right, #FF4E45, #4361EE); }

  /* ── Mobile touch targets ───────────────────────────────── */
  @media (max-width: 640px) {
    button, a { min-height: 40px; }
    .ax-mobile-full { width: 100% !important; }
    .ax-mobile-stack { flex-direction: column !important; }
    .ax-mobile-center { text-align: center !important; justify-content: center !important; }
    .ax-mobile-hide { display: none !important; }
    .ax-mobile-pad { padding-left: 16px !important; padding-right: 16px !important; }
  }

  /* ── Tablet ─────────────────────────────────────────────── */
  @media (min-width: 641px) and (max-width: 1023px) {
    .ax-tab-2col { grid-template-columns: repeat(2,1fr) !important; }
    .ax-tab-hide  { display: none !important; }
    .ax-tab-stack { flex-direction: column !important; }
  }

  /* ── Safe area for mobile notch ─────────────────────────── */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .ax-safe-bottom { padding-bottom: calc(24px + env(safe-area-inset-bottom)); }
  }

  /* ── Smooth image loading ───────────────────────────────── */
  img { transition: opacity .3s ease; }
  img[loading] { opacity: 0; }
  img.loaded   { opacity: 1; }

  /* ── Typography clamps (mobile first) ───────────────────── */
  .ax-hero-h1 { font-size: clamp(2.2rem, 8vw, 4.4rem); line-height: 1.06; }
  .ax-h2      { font-size: clamp(1.7rem, 5vw, 2.9rem); line-height: 1.1; }
  .ax-sub     { font-size: clamp(.9rem, 3vw, 1.1rem);  line-height: 1.6; }
  @keyframes ax-orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes ax-orbit-spin-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  .axclade-hero-ring-a { animation: ax-orbit-spin 28s linear infinite; }
  .axclade-hero-ring-b { animation: ax-orbit-spin-rev 34s linear infinite; }
  .axclade-hero-ring-c { animation: ax-orbit-spin 42s linear infinite; }
  .axclade-hero-dotmask {
    background-image: radial-gradient(circle, rgba(8,25,63,.11) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  .axclade-hero-card {
    background: rgba(255,255,255,.82);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,.75);
    box-shadow: 0 24px 60px rgba(8,25,63,.12), inset 0 1px 0 rgba(255,255,255,.95);
  }
  .axclade-hero-bubble {
    background: linear-gradient(160deg, rgba(255,255,255,.82), rgba(219,233,255,.38));
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    border: 1px solid rgba(255,255,255,.72);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 16px 30px rgba(67,97,238,.1);
  }

  /* ── Reduced motion ─────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
    }
  }
`;

function useScrollY(){
  const [y,setY]=useState(0);
  useEffect(()=>{const fn=()=>setY(window.scrollY);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);
  return y;
}
function useTick(ms=2000){
  const [t,setT]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setT(n=>n+1),ms);return()=>clearInterval(id);},[ms]);
  return t;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ATOMS
// ═══════════════════════════════════════════════════════════════════════════════
function AxcladeLogoImage({
  className = "",
  alt = "Axclade",
  style,
  src,
}:{
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
  src?: string;
}){
  return <img src={src ?? axcladeLogo} alt={alt} className={className} style={style}/>;
}

function Logo({ dark=false, context="header" }:{ dark?:boolean; context?:"header"|"footer" }){
  const isFooter=context==="footer";
  return(
    <div className="select-none cursor-pointer">
      <div
        className="inline-flex items-center rounded-xl"
        style={dark ? {
          background:isFooter ? "transparent" : "rgba(255,255,255,.98)",
          border:isFooter ? "none" : "1px solid rgba(255,255,255,.16)",
          boxShadow:isFooter ? "none" : "0 12px 28px rgba(0,0,0,.14)",
          padding:isFooter ? "0" : "7px 10px",
        } : undefined}
      >
        <AxcladeLogoImage
          src={isFooter ? axcladeLogoObject : undefined}
          className={isFooter
            ? "w-auto object-contain"
            : "w-auto object-contain"}
          style={isFooter
            ? { height: 42, maxWidth: 220 }
            : { height: 48, maxWidth: 264 }}
        />
      </div>
    </div>
  );
}

function Eyebrow({ text, light=false }:{ text:string; light?:boolean }){
  return(
    <div className="flex items-center gap-2 mb-4">
      <span className="block w-5 h-[2px] rounded-full" style={{background:T.red}}/>
      <span style={{fontFamily:FONT,fontWeight:700,fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase" as const,color:light?"rgba(255,255,255,.5)":T.red}}>
        {text}
      </span>
    </div>
  );
}

function SH({ children, light=false, center=false }:{children:React.ReactNode;light?:boolean;center?:boolean}){
  return(
    <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2rem,3.6vw,2.9rem)",color:light?"#fff":T.navy,
      lineHeight:1.1,letterSpacing:"-.5px",textAlign:center?"center" as const:"left" as const}}>
      {children}
    </h2>
  );
}

function BtnPrimary({ children,onClick,large=false,glow=false }:{children:React.ReactNode;onClick?:()=>void;large?:boolean;glow?:boolean}){
  return(
    <button onClick={onClick}
      className={`ax-btn-arrow ax-glow-btn inline-flex items-center gap-2 rounded-full font-bold text-white`}
      style={{padding:large?"16px 32px":"12px 24px",fontSize:large?16:14,fontFamily:FONT,fontWeight:700,
        background:T.red,boxShadow:glow?`0 0 32px ${T.red}55,0 6px 20px ${T.red}35`:`0 4px 18px ${T.red}35`}}>
      {children}
    </button>
  );
}
function BtnOutline({ children,onClick,dark=false }:{children:React.ReactNode;onClick?:()=>void;dark?:boolean}){
  return(
    <button onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full font-bold transition-all hover:scale-[1.02]"
      style={{padding:"12px 24px",fontSize:14,fontFamily:FONT,fontWeight:700,
        background:dark?"rgba(255,255,255,.1)":T.white,color:dark?T.white:T.navy,
        border:`1.5px solid ${dark?"rgba(255,255,255,.2)":T.border}`}}>
      {children}
    </button>
  );
}

function Chip({ children, color=T.red }:{children:React.ReactNode;color?:string}){
  return(
    <span className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold"
      style={{padding:"5px 12px",fontFamily:FONT,fontWeight:700,background:`${color}14`,color,border:`1px solid ${color}25`}}>
      {children}
    </span>
  );
}

function Glass({ children, className="", style={} }:{children:React.ReactNode;className?:string;style?:React.CSSProperties}){
  return(
    <div className={`rounded-3xl ${className}`}
      style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
        border:"1px solid rgba(255,255,255,.9)",boxShadow:"0 8px 40px rgba(10,19,48,.09)",...style}}>
      {children}
    </div>
  );
}

function Glow({ color, size, className="" }:{color:string;size:number;className?:string}){
  return(
    <div className={`absolute rounded-full pointer-events-none ${className}`}
      style={{width:size,height:size,background:color,filter:`blur(${size*.55}px)`,opacity:.15}}/>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════════════════
const NAV_ITEMS:{label:string;page:Page}[]=[
  {label:"Home",page:"home"},{label:"Packages",page:"packages"},
  {label:"Solutions",page:"solutions"},{label:"Industries",page:"industries"},
  {label:"Our Process",page:"process"},{label:"Case Studies",page:"case-studies"},
  {label:"About",page:"about"},{label:"Contact",page:"contact"},
];

function Nav({ current, go }:{current:Page;go:(p:Page)=>void}){
  const y=useScrollY(), [open,setOpen]=useState(false), scrolled=y>24;
  const nav=(p:Page)=>{ go(p); setOpen(false); window.scrollTo(0,0); };
  return(
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{background:scrolled?"rgba(245,247,251,.95)":"rgba(245,247,251,.6)",
        backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",
        borderBottom:scrolled?`1px solid ${T.border}`:"1px solid transparent",
        boxShadow:scrolled?"0 2px 24px rgba(10,19,48,.07)":"none"}}>
      <div className="max-w-[1380px] mx-auto px-5 flex items-center justify-between" style={{height:58}}>
        <button onClick={()=>nav("home")}><Logo context="header"/></button>
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_ITEMS.map(n=>(
            <button key={n.page} onClick={()=>nav(n.page)}
              className="relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{fontFamily:FONT,color:current===n.page?T.red:T.navy,background:current===n.page?`${T.red}0D`:"transparent"}}>
              {n.label}
              {current===n.page&&<span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" style={{background:T.red}}/>}
            </button>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <BtnOutline onClick={()=>nav("contact")}>Free Audit</BtnOutline>
          <BtnPrimary onClick={()=>nav("contact")}>Book Consultation <ArrowRight size={13}/></BtnPrimary>
        </div>
        <button className="lg:hidden p-2" onClick={()=>setOpen(!open)}>
          {open?<X size={20} style={{color:T.navy}}/>:<Menu size={20} style={{color:T.navy}}/>}
        </button>
      </div>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            className="lg:hidden px-5 pb-5 pt-2 grid grid-cols-2 gap-1"
            style={{background:"rgba(245,247,251,.98)",borderTop:`1px solid ${T.border}`}}>
            {NAV_ITEMS.map(n=>(
              <button key={n.page} onClick={()=>nav(n.page)}
                className="text-left text-sm font-bold py-2.5 px-3 rounded-xl"
                style={{fontFamily:FONT,color:current===n.page?T.red:T.navy,background:current===n.page?`${T.red}0A`:"transparent"}}>
                {n.label}
              </button>
            ))}
            <div className="col-span-2 mt-2">
              <BtnPrimary onClick={()=>nav("contact")}>Book Free Consultation <ArrowRight size={13}/></BtnPrimary>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
function Footer({ go }:{go:(p:Page)=>void}){
  const [email,setEmail]=useState("");
  const nav=(p:Page)=>{ go(p); window.scrollTo(0,0); };
  const cols=[
    {title:"Packages",links:[{t:"Local & Startup Growth",p:"packages"},{t:"E-commerce Growth",p:"packages"},{t:"B2B Lead Generation",p:"packages"},{t:"Social Media Growth",p:"packages"}]},
    {title:"Solutions",links:[{t:"Web Development",p:"solutions"},{t:"App Development",p:"solutions"},{t:"Software Development",p:"solutions"},{t:"AI Automation",p:"solutions"},{t:"SaaS Development",p:"solutions"}]},
    {title:"Company",links:[{t:"About",p:"about"},{t:"Our Process",p:"process"},{t:"Case Studies",p:"case-studies"},{t:"Blog",p:"about"},{t:"Contact",p:"contact"}]},
    {title:"Contact",links:[{t:"hello@axclade.com",p:"contact"},{t:"WhatsApp Us",p:"contact"},{t:"Privacy Policy",p:"contact"},{t:"Terms of Service",p:"contact"}]},
  ];
  return(
    <footer style={{background:T.navy}} className="pt-16 pb-8 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b" style={{borderColor:"rgba(255,255,255,.08)"}}>
          <div className="col-span-2">
            <Logo dark context="footer"/>
            <p className="mt-4 text-sm leading-relaxed" style={{color:"rgba(255,255,255,.38)",fontFamily:FONT,maxWidth:260}}>
              Axclade helps businesses build stronger brands, generate better leads, automate operations, and scale with smart digital systems.
            </p>
            <div className="mt-5 flex gap-2">
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                className="flex-1 text-sm px-4 py-2.5 rounded-xl outline-none text-white"
                style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",fontFamily:FONT}}/>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:T.red}}>
                <Send size={14} className="text-white"/>
              </button>
            </div>
            <div className="mt-4 flex gap-4">
              {["Twitter","LinkedIn","Instagram"].map(s=>(
                <a key={s} href="#" className="text-xs font-semibold hover:text-white transition-colors"
                  style={{color:"rgba(255,255,255,.28)",fontFamily:FONT}}>{s}</a>
              ))}
            </div>
          </div>
          {cols.map(col=>(
            <div key={col.title}>
              <h4 className="text-xs font-extrabold text-white mb-4 tracking-widest uppercase" style={{fontFamily:FONT}}>{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l=>(
                  <li key={l.t}>
                    <button onClick={()=>nav(l.p as Page)} className="text-sm text-left hover:text-white transition-colors"
                      style={{color:"rgba(255,255,255,.35)",fontFamily:FONT}}>{l.t}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{color:"rgba(255,255,255,.22)",fontFamily:FONT}}>
            © 2026 Axclade. All rights reserved. Ad spend & third-party fees are separate. Results vary by market, budget & competition.
          </p>
          <p className="text-xs" style={{color:"rgba(255,255,255,.22)",fontFamily:FONT}}>Smart Digital Growth Solutions</p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED CTA BANNER
// ═══════════════════════════════════════════════════════════════════════════════
function CTABanner({ go }:{go:(p:Page)=>void}){
  const nav=(p:Page)=>{ go(p); window.scrollTo(0,0); };
  return(
    <section className="py-16 px-6" style={{background:T.soft}}>
      <div className="max-w-[1280px] mx-auto">
        <div className="relative rounded-[32px] overflow-hidden py-20 px-8 text-center" style={{background:T.navy}}>
          <Glow color={T.red} size={500} className="-top-40 left-1/2 -translate-x-1/2"/>
          <Glow color={T.blue} size={400} className="-bottom-20 right-0"/>
          <div className="absolute inset-0 pointer-events-none opacity-[.06]"
            style={{backgroundImage:`radial-gradient(circle,#fff 1px,transparent 1px)`,backgroundSize:"30px 30px"}}/>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-7 flex items-center justify-center"
              style={{background:`${T.red}22`,border:`1px solid ${T.red}38`,boxShadow:`0 0 32px ${T.red}45`}}>
              <Rocket size={24} style={{color:T.red}}/>
            </div>
            <h2 className="font-extrabold text-white" style={{fontSize:"clamp(2rem,4vw,3rem)",fontFamily:FONT,letterSpacing:"-.5px",lineHeight:1.1}}>
              Ready To Build Your<br/>Digital Growth Engine?
            </h2>
            <p className="mt-4 text-base max-w-lg mx-auto" style={{color:"rgba(255,255,255,.48)",fontFamily:FONT}}>
              Book a free 30-minute strategy call. We'll audit your digital presence and recommend the best growth path for your business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <BtnPrimary onClick={()=>nav("contact")} large glow>Book Free Consultation <ArrowRight size={15}/></BtnPrimary>
              <BtnOutline onClick={()=>nav("contact")} dark>Get Free Digital Audit</BtnOutline>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-7">
              {["No commitment","Free 30-min call","Custom growth plan"].map(t=>(
                <div key={t} className="flex items-center gap-2 text-sm" style={{color:"rgba(255,255,255,.4)",fontFamily:FONT}}>
                  <Check size={13} style={{color:T.red}}/>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PageHero({ badge, title, sub }:{badge:string;title:React.ReactNode;sub?:string}){
  return(
    <section className="pt-32 pb-20 px-6 relative overflow-hidden"
      style={{background:`linear-gradient(160deg,${T.soft} 0%,#EAEEf8 100%)`}}>
      <div className="max-w-[1280px] mx-auto text-center relative z-10">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5}}>
          <Chip color={T.red}><Sparkles size={10}/> {badge}</Chip>
          <h1 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2.4rem,5vw,3.8rem)",
            color:T.navy,lineHeight:1.08,letterSpacing:"-.6px",marginTop:16}}>
            {title}
          </h1>
          {sub&&<p className="mt-5 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{fontFamily:FONT,color:T.muted}}>{sub}</p>}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HERO VISUAL
// ═══════════════════════════════════════════════════════════════════════════════
function HeroVisual(){
  const tick=useTick(2400);
  const leads=[2847,2913,2779,3041,2982,3124][tick%6];
  return(
    <div className="relative w-full h-[560px] flex items-center justify-center">
      <Glow color={T.red} size={380} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
      <Glow color={T.blue} size={260} className="top-8 right-4"/>
      <div className="absolute inset-14 rounded-full pointer-events-none" style={{border:`1.5px dashed rgba(10,19,48,.09)`}}/>
      <div className="absolute inset-28 rounded-full pointer-events-none" style={{border:`1px dashed ${T.red}18`}}/>

      {/* 3D Axclade cube */}
      <motion.div animate={{y:[-8,8,-8]}} transition={{duration:6,repeat:Infinity,ease:"easeInOut"}}
        className="relative z-10 flex flex-col items-center">
        <div className="relative rounded-3xl p-8 flex flex-col items-center justify-center w-44 h-44"
          style={{background:`linear-gradient(145deg,${T.space},${T.navy})`,
            boxShadow:`0 20px 64px ${T.navy}50,inset 0 1px 0 rgba(255,255,255,.08)`,
            border:`1.5px solid rgba(255,255,255,.07)`}}>
          <div className="rounded-2xl px-4 py-3" style={{background:"rgba(255,255,255,.98)"}}>
            <AxcladeLogoImage className="h-8 w-auto max-w-[132px] object-contain"/>
          </div>
          <div className="absolute top-0 left-4 right-4 h-px" style={{background:"linear-gradient(to right,transparent,rgba(255,255,255,.12),transparent)"}}/>
        </div>
        <div className="w-36 h-4 rounded-full mt-1" style={{background:T.navy,filter:"blur(16px)",opacity:.4}}/>
      </motion.div>

      {/* Analytics card */}
      <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:.4}}
        className="absolute z-20 top-8 right-0 lg:right-4 rounded-2xl p-4 w-64"
        style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(20px)",border:`1px solid ${T.border}`,boxShadow:"0 12px 48px rgba(10,19,48,.13)"}}>
        <div className="flex items-center justify-between mb-3">
          <span style={{fontFamily:FONT,fontWeight:700,fontSize:12,color:T.navy}}>Growth Analytics</span>
          <span className="flex items-center gap-1 text-xs font-bold rounded-full px-2 py-0.5"
            style={{background:"#DCFCE7",color:"#16A34A",fontFamily:FONT}}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#16A34A"}}/>LIVE
          </span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <div style={{fontFamily:FONT,fontSize:11,color:T.muted}}>Total Leads</div>
            <motion.div key={leads} initial={{opacity:.6}} animate={{opacity:1}}
              style={{fontFamily:FONT,fontWeight:800,fontSize:22,color:T.navy,lineHeight:1}}>
              {leads.toLocaleString()}
            </motion.div>
          </div>
          <span className="text-xs font-bold rounded-lg px-2 py-1" style={{background:"#DCFCE7",color:"#16A34A",fontFamily:FONT}}>↑ +143%</span>
        </div>
        <div style={{height:48}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.blue} stopOpacity={.28}/><stop offset="95%" stopColor={T.blue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={T.blue} strokeWidth={2} fill="url(#sg)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          {[["Conv.","4.8%",T.blue],["ROAS","3.2×",T.red],["Ret.","95%","#8B5CF6"]].map(([l,v,c])=>(
            <div key={l as string} className="rounded-xl py-2 text-center" style={{background:`${c as string}0F`}}>
              <div style={{fontFamily:FONT,fontWeight:800,fontSize:13,color:c as string,lineHeight:1}}>{v as string}</div>
              <div style={{fontFamily:FONT,fontSize:9,color:T.muted,marginTop:2}}>{l as string}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating stat pills */}
      {[
        {v:"+250%",l:"Leads Generated",  icon:<TrendingUp size={13}/>,col:T.red,    pos:"top-6 -left-2 sm:left-0 lg:-left-4",        hide:false},
        {v:"98%",  l:"Client Satisfaction",icon:<Users size={13}/>,    col:"#8B5CF6",pos:"bottom-32 -left-1 sm:left-0 lg:left-4",     hide:true},
        {v:"4.9★", l:"Average Rating",   icon:<Star size={13}/>,       col:T.success,pos:"bottom-14 -right-2 sm:right-0 lg:right-6",  hide:false},
        {v:"120+", l:"Projects Done",    icon:<Zap size={13}/>,        col:T.navy,   pos:"bottom-32 -right-1 sm:right-0 lg:-right-2", hide:true},
      ].map((p,i)=>(
        <motion.div key={p.l} initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:.4+i*.1}}
          className={`absolute z-20 rounded-2xl px-3.5 py-2.5 ${p.pos} ${p.hide?"hidden sm:flex":"flex"}`}
          style={{background:i===3?T.navy:T.white,border:i===3?"none":`1px solid ${T.border}`,boxShadow:"0 6px 28px rgba(10,19,48,.10)"}}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{background:`${p.col}${i===3?"28":"15"}`,color:i===3?"#fff":p.col}}>{p.icon}</div>
            <div>
              <div style={{fontFamily:FONT,fontWeight:800,fontSize:14,lineHeight:1,color:i===3?"#fff":T.navy}}>{p.v}</div>
              <div style={{fontFamily:FONT,fontSize:10,color:i===3?"rgba(255,255,255,.5)":T.muted,marginTop:2}}>{p.l}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM DARK FEATURE CARDS (from premium-feature-cards.md spec)
// ═══════════════════════════════════════════════════════════════════════════════
const FEAT_CARDS=[
  {title:"AI Automation",desc:"Intelligent workflows and chatbots that work 24/7 to grow your business without lifting a finger.",icon:<Bot size={22}/>,
    grad:"linear-gradient(137deg,#FF4E45 0%,#FF8A82 45%,#FFD3D0 100%)",delay:.1},
  {title:"Growth Analytics",desc:"Real-time dashboards that turn raw data into clear growth decisions. Know exactly what's working.",icon:<BarChart3 size={22}/>,
    grad:"linear-gradient(137deg,#FFFFFF 0%,#7DD3FC 45%,#4361EE 100%)",delay:.2},
  {title:"Smart Strategy",desc:"Custom digital growth roadmaps built around your market, competition, and budget — not generic templates.",icon:<Zap size={22}/>,
    grad:"linear-gradient(137deg,#4361EE 0%,#C084FC 45%,#FF4E45 100%)",delay:.3},
];

function PremiumFeatureCards(){
  return(
    <section className="py-28 px-6 relative overflow-hidden"
      style={{background:"linear-gradient(180deg,#050811 0%,#0A1330 100%)"}}>
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{background:T.red,filter:"blur(120px)",opacity:.09}}/>
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{background:T.blue,filter:"blur(120px)",opacity:.08}}/>
      <div className="absolute inset-0 pointer-events-none opacity-[.04]"
        style={{backgroundImage:`radial-gradient(circle,#fff 1px,transparent 1px)`,backgroundSize:"32px 32px"}}/>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <Eyebrow text="Core Capabilities" light/>
          <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2rem,3.6vw,2.9rem)",color:"#fff",lineHeight:1.1,letterSpacing:"-.5px"}}>
            The systems that power<br/><span style={{color:T.red}}>real digital growth</span>
          </h2>
          <p className="mt-4 max-w-md mx-auto" style={{fontFamily:FONT,fontSize:15,color:"rgba(255,255,255,.42)",lineHeight:1.6}}>
            Three integrated capabilities that compound your results month after month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          {FEAT_CARDS.map((card)=>(
            <motion.div key={card.title}
              initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              transition={{duration:.8,ease:"easeOut",delay:card.delay}}
              whileHover={{y:-10,scale:1.02,transition:{duration:.4}}}
              className="relative cursor-default">
              {/* Glow behind card */}
              <div className="absolute inset-[-4px] rounded-[44px] pointer-events-none"
                style={{background:card.grad,filter:"blur(45px)",opacity:.55}}/>
              {/* Card */}
              <div className="relative rounded-[40px] p-7 flex flex-col gap-5 overflow-hidden"
                style={{background:"linear-gradient(180deg,#10172F 0%,#0A1330 100%)",
                  border:"1.5px solid rgba(255,255,255,.07)",boxShadow:"0 20px 60px rgba(0,0,0,.45)",minHeight:300}}>
                <div className="absolute inset-0 rounded-[40px] pointer-events-none"
                  style={{background:"linear-gradient(180deg,rgba(255,255,255,.05) 0%,transparent 60%)"}}/>
                <div className="absolute top-0 left-8 right-8 h-px rounded-full"
                  style={{background:"rgba(255,255,255,.08)"}}/>
                {/* Icon container */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)"}}>
                  <div style={{background:card.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",display:"contents"}}>
                    <span style={{color:"#fff",filter:`drop-shadow(0 0 10px ${T.red}60)`}}>{card.icon}</span>
                  </div>
                </div>
                <div>
                  <h3 style={{fontFamily:FONT,fontWeight:700,fontSize:20,color:"#fff",letterSpacing:"-.3px",marginBottom:8}}>{card.title}</h3>
                  <p style={{fontFamily:FONT,fontSize:15,color:"#647089",lineHeight:1.6}}>{card.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none rounded-b-[40px]"
                  style={{background:`linear-gradient(to top,rgba(255,78,69,.04),transparent)`}}/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const PACKAGES=[
  {name:"Local & Startup Growth",from:"$199",tag:"Best for local",desc:"Local SEO, Google Business Profile, Meta Ads, Lead Generation.",icon:<Target size={22}/>,col:T.blue,featured:false,items:["Local SEO","Google Business Profile","Meta Ads","Lead Generation"]},
  {name:"E-commerce Growth",from:"$299",tag:"★ Most Popular",desc:"Meta Ads, Google Shopping, Email Marketing, Conversion Optimization.",icon:<ShoppingBag size={22}/>,col:T.red,featured:true,items:["Meta Ads","Google Shopping","Email Marketing","Conversion CRO"]},
  {name:"B2B Lead Generation",from:"$349",tag:"Best for B2B",desc:"LinkedIn Marketing, Lead Funnels, Content Strategy, Outreach Systems.",icon:<Briefcase size={22}/>,col:"#8B5CF6",featured:false,items:["LinkedIn Ads","Lead Funnels","Content Strategy","Outreach Systems"]},
  {name:"Brand & Social Media",from:"$149",tag:"Best for brands",desc:"Content Creation, Reels, Brand Positioning, Social Growth.",icon:<Sparkles size={22}/>,col:"#F59E0B",featured:false,items:["Content Creation","Reels & TikToks","Brand Positioning","Social Growth"]},
];

const SOLUTIONS=[
  {icon:<Globe size={26}/>,title:"Web Design & Development",desc:"Conversion-focused websites built to perform. Fast, SEO-ready, beautiful.",col:"navy",span:"lg:col-span-2"},
  {icon:<Smartphone size={26}/>,title:"App Development",desc:"iOS & Android apps for modern businesses.",col:"red",span:""},
  {icon:<Bot size={26}/>,title:"AI Automation",desc:"Workflows that work 24/7 without your team.",col:"white",span:""},
  {icon:<Layers size={26}/>,title:"Brand & UI/UX",desc:"Identity systems that command instant trust.",col:"white",span:""},
  {icon:<Cpu size={26}/>,title:"SaaS Development",desc:"Turn ideas into scalable software products.",col:"white",span:"lg:col-span-2"},
];

const INDUSTRIES=[
  {icon:<Utensils size={18}/>,name:"Restaurants"},{icon:<Scissors size={18}/>,name:"Salons"},
  {icon:<HeartPulse size={18}/>,name:"Clinics"},{icon:<Dumbbell size={18}/>,name:"Gyms"},
  {icon:<Building2 size={18}/>,name:"Real Estate"},{icon:<ShoppingBag size={18}/>,name:"E-commerce"},
  {icon:<Monitor size={18}/>,name:"SaaS"},{icon:<Rocket size={18}/>,name:"Startups"},{icon:<Briefcase size={18}/>,name:"B2B"},
];

const WHY=[
  {icon:<Target size={18}/>,title:"Growth-Focused Strategy",desc:"Every decision tied back to your business growth metrics."},
  {icon:<BarChart3 size={18}/>,title:"Performance Marketing",desc:"Data-driven campaigns optimised weekly for max ROI."},
  {icon:<Sparkles size={18}/>,title:"Creative Branding",desc:"Design that positions your brand as the premium choice."},
  {icon:<Brain size={18}/>,title:"AI-Powered Systems",desc:"Intelligent automation that works while you sleep."},
  {icon:<Shield size={18}/>,title:"Transparent Reporting",desc:"Monthly reports with clear KPIs and honest results."},
  {icon:<Rocket size={18}/>,title:"Scalable Solutions",desc:"Built to grow with your business from day one."},
];

const CASE_PREVIEWS=[
  {cat:"Local Business",title:"DinePro Restaurant",metric:"3× Online Orders",col:T.blue,img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&h=420&fit=crop&auto=format"},
  {cat:"E-commerce",title:"Lumio Shop Redesign",metric:"+120% Sales",col:T.red,img:"https://images.unsplash.com/photo-1661956602944-249bcd04b63f?w=640&h=420&fit=crop&auto=format"},
  {cat:"B2B",title:"Nexus Analytics",metric:"+200% Engagement",col:"#8B5CF6",img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=420&fit=crop&auto=format"},
  {cat:"Brand",title:"Vero Wellness",metric:"+180% Leads",col:"#F59E0B",img:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=640&h=420&fit=crop&auto=format"},
];

function HomePage({ go }:{go:(p:Page)=>void}){
  const nav=(p:Page)=>{ go(p); window.scrollTo(0,0); };
  return(
    <>
      <AxcladeHomeHero
        onPrimaryAction={() => nav("contact")}
        onSecondaryAction={() => nav("packages")}
      />


      {/* What we help achieve */}
      <section className="py-24 px-6 mt-0" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <Eyebrow text="What We Deliver"/>
              <SH>Digital Growth Built<br/>Around <span style={{color:T.red}}>Results</span></SH>
              <p className="mt-5 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
                Axclade combines digital marketing, branding, content, advertising, automation, and technology to help businesses grow smarter and faster.
              </p>
              <div className="mt-8"><BtnPrimary onClick={()=>nav("packages")}>View Growth Packages <ArrowRight size={13}/></BtnPrimary></div>
            </motion.div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {icon:<TrendingUp size={18}/>,title:"More Leads",desc:"Structured systems that bring qualified prospects consistently."},
                {icon:<Globe size={18}/>,title:"Better Visibility",desc:"Dominate search results and social feeds in your market."},
                {icon:<Sparkles size={18}/>,title:"Stronger Brand",desc:"Premium identity that commands trust and separates you."},
                {icon:<Users size={18}/>,title:"Better Engagement",desc:"Content and campaigns that turn browsers into buyers."},
                {icon:<Brain size={18}/>,title:"Smarter Systems",desc:"AI-powered automation that reduces manual work."},
                {icon:<LineChart size={18}/>,title:"Sustainable Growth",desc:"Digital infrastructure that compounds over time."},
              ].map((a,i)=>(
                <motion.div key={a.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
                  className="rounded-2xl p-5" style={{background:T.soft,border:`1px solid ${T.border}`}}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{background:`${T.red}10`,color:T.red}}>{a.icon}</div>
                  <p style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy,marginBottom:4}}>{a.title}</p>
                  <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5}}>{a.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-28 px-6" style={{background:T.soft}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <Eyebrow text="Growth Packages"/>
            <SH center>Growth Solutions Designed For<br/><span style={{color:T.red}}>Every Business Type</span></SH>
            <p className="mt-4 max-w-lg mx-auto" style={{fontFamily:FONT,fontSize:15,color:T.muted}}>
              Choose a package designed specifically for your business model and growth stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PACKAGES.map((pkg,i)=>(
              <motion.div key={pkg.name} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.09}}
                whileHover={{y:-6,transition:{duration:.2}}} onClick={()=>nav("packages")}
                className="relative rounded-3xl flex flex-col cursor-pointer"
                style={{background:pkg.featured?T.navy:T.white,border:pkg.featured?`2px solid ${T.red}`:`1px solid ${T.border}`,
                  boxShadow:pkg.featured?`0 20px 60px ${T.navy}30`:"0 4px 24px rgba(10,19,48,.05)",
                  padding:pkg.featured?"36px 28px 28px":"28px",overflow:"visible"}}>
                {pkg.featured&&<Glow color={T.red} size={200} className="-top-8 -right-8"/>}
                {pkg.featured&&(
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-white rounded-full px-4 py-1.5 whitespace-nowrap"
                    style={{background:T.red,fontFamily:FONT,boxShadow:`0 4px 16px ${T.red}50`,zIndex:10}}>★ Most Popular</div>
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 relative z-10" style={{background:`${pkg.col}14`,color:pkg.col}}>{pkg.icon}</div>
                <div className="mb-3 relative z-10"><Chip color={pkg.featured?T.red:pkg.col}>{pkg.tag}</Chip></div>
                <div className="flex items-baseline gap-1 mb-2 relative z-10">
                  <span style={{fontFamily:FONT,fontWeight:800,fontSize:26,color:pkg.featured?T.red:T.navy}}>from {pkg.from}</span>
                  <span style={{fontFamily:FONT,fontSize:13,color:pkg.featured?"rgba(255,255,255,.38)":T.muted}}>/mo</span>
                </div>
                <h3 className="font-extrabold text-base mb-2 relative z-10"
                  style={{fontFamily:FONT,color:pkg.featured?"#fff":T.navy}}>{pkg.name}</h3>
                <p className="text-xs leading-relaxed mb-4 flex-1 relative z-10"
                  style={{fontFamily:FONT,color:pkg.featured?"rgba(255,255,255,.48)":T.muted}}>{pkg.desc}</p>
                <ul className="space-y-2 mb-5 relative z-10">
                  {pkg.items.map(item=>(
                    <li key={item} className="flex items-center gap-2 text-xs"
                      style={{fontFamily:FONT,color:pkg.featured?"rgba(255,255,255,.6)":T.muted}}>
                      <Check size={11} style={{color:pkg.featured?T.red:T.success,flexShrink:0}}/>{item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-sm font-bold relative z-10"
                  style={{color:pkg.featured?T.red:T.navy,fontFamily:FONT}}>
                  View packages <ArrowRight size={13}/>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <BtnPrimary onClick={()=>nav("packages")} large>View All Packages <ArrowRight size={13}/></BtnPrimary>
          </div>
        </div>
      </section>

      {/* Solutions mosaic */}
      <section className="py-24 px-6" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-[760px]">
              <Eyebrow text="Digital Solutions"/>
              <SH>Technology Solutions That<br/><span style={{color:T.red}}>Support Business Growth</span></SH>
            </div>
            <BtnOutline onClick={()=>nav("solutions")}>Explore All Solutions <ArrowRight size={13}/></BtnOutline>
          </div>
          <div
            className="rounded-[34px] p-4 md:p-5 lg:p-6"
            style={{
              background:"linear-gradient(180deg,#FFFFFF 0%, #F8FAFF 100%)",
              border:`1px solid ${T.border}`,
              boxShadow:"0 24px 72px rgba(10,19,48,.08)",
            }}
          >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-[220px]">
            {SOLUTIONS.map((s,i)=>{
              const navy=s.col==="navy", red=s.col==="red", dark=navy||red;
              const cardClass =
                i===0 ? "lg:col-span-8" :
                i===1 ? "lg:col-span-4" :
                i===4 ? "lg:col-span-12" :
                "lg:col-span-6";
              return(
                <motion.div key={s.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}
                  whileHover={{y:-6,scale:1.01}} onClick={()=>nav("solutions")}
                  className={`relative rounded-[30px] p-7 md:p-8 flex flex-col overflow-hidden cursor-pointer ${cardClass}`}
                  style={{
                    background:navy
                      ? "linear-gradient(135deg, #0B163F 0%, #121C4A 100%)"
                      : red
                        ? "linear-gradient(135deg, #FF5A52 0%, #FF463D 100%)"
                        : "linear-gradient(180deg, #FFFFFF 0%, #F9FBFF 100%)",
                    border:dark?"1px solid rgba(255,255,255,.06)":`1px solid ${T.border}`,
                    boxShadow:navy
                      ? `0 24px 60px ${T.navy}24`
                      : red
                        ? `0 24px 54px ${T.red}22`
                        : "0 10px 30px rgba(10,19,48,.05)",
                  }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: dark
                        ? "linear-gradient(180deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,0) 55%)"
                        : "linear-gradient(180deg, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 38%)",
                    }}/>
                  {dark&&<div className="absolute -bottom-12 -right-10 w-40 h-40 rounded-full pointer-events-none blur-3xl"
                    style={{background:navy?T.blue:"#fff",opacity:.14}}/>}
                  {!dark&&<div className="absolute -top-8 right-10 w-24 h-24 rounded-full pointer-events-none blur-2xl"
                    style={{background:`${T.blue}12`}}/>}
                  <div className="relative z-10 w-12 h-12 rounded-[18px] flex items-center justify-center mb-6"
                    style={{background:navy?`${T.red}22`:red?"rgba(255,255,255,.18)":`${T.blue}10`,color:navy?T.red:dark?"#fff":T.blue}}>
                    {s.icon}
                  </div>
                  <div className="relative z-10 max-w-[92%]">
                    <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:i===0?28:22,color:dark?"#fff":T.navy,marginBottom:10,letterSpacing:"-.4px",lineHeight:1.08}}>
                      {s.title}
                    </h3>
                    <p style={{fontFamily:FONT,fontSize:14,color:dark?"rgba(255,255,255,.62)":T.muted,lineHeight:1.65,maxWidth:i===4?520:440}}>
                      {s.desc}
                    </p>
                  </div>
                  <div className="mt-auto relative z-10 flex items-center gap-2 text-sm font-bold"
                    style={{color:navy?T.red:dark?"rgba(255,255,255,.84)":T.navy,fontFamily:FONT}}>
                    Explore <ArrowUpRight size={13}/>
                  </div>
                </motion.div>
              );
            })}
          </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 px-6" style={{background:T.soft}}>
        <div className="max-w-[1280px] mx-auto text-center">
          <Eyebrow text="Industries"/>
          <SH center>Built for Businesses That<br/><span style={{color:T.red}}>Want to Grow Smarter</span></SH>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {INDUSTRIES.map((ind,i)=>(
              <motion.button key={ind.name} initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.05}}
                whileHover={{y:-2,scale:1.03}} onClick={()=>nav("industries")}
                className="flex items-center gap-2.5 rounded-full transition-all"
                style={{padding:"10px 20px",background:T.white,border:`1px solid ${T.border}`,boxShadow:"0 2px 12px rgba(10,19,48,.05)"}}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:`${T.red}12`,color:T.red}}>{ind.icon}</div>
                <span style={{fontFamily:FONT,fontWeight:600,fontSize:13,color:T.navy}}>{ind.name}</span>
              </motion.button>
            ))}
          </div>
          <div className="mt-8"><BtnOutline onClick={()=>nav("industries")}>View All Industries <ArrowRight size={13}/></BtnOutline></div>
        </div>
      </section>

      {/* Premium dark feature cards */}
      <PremiumFeatureCards/>

      {/* Why Axclade */}
      <section className="py-28 px-6" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <Eyebrow text="Why Axclade"/>
              <SH>Built For The New Era<br/>Of <span style={{color:T.red}}>Digital Growth</span></SH>
              <p className="mt-5 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
                Axclade combines design, technology, AI automation, digital marketing, and growth strategy into one integrated system. One partner that compounds your results.
              </p>
              <blockquote className="mt-6 pl-5 italic text-base font-semibold"
                style={{borderLeft:`3px solid ${T.red}`,fontFamily:FONT,color:T.navy}}>
                "Every business has potential — only the right digital system unlocks real growth."
              </blockquote>
              <div className="mt-8 flex gap-3">
                <BtnPrimary onClick={()=>nav("contact")}>Work With Us <ArrowRight size={13}/></BtnPrimary>
                <BtnOutline onClick={()=>nav("about")}>Our Story</BtnOutline>
              </div>
            </motion.div>
            <div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {WHY.map((f,i)=>(
                  <motion.div key={f.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.07}}
                    className="rounded-2xl p-5" style={{background:T.soft,border:`1px solid ${T.border}`}}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{background:`${T.red}10`,color:T.red}}>{f.icon}</div>
                    <p style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy,marginBottom:4}}>{f.title}</p>
                    <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5}}>{f.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[["250+","Clients"],["120+","Projects"],["10+","Years"],["24/7","AI"]].map(([v,l])=>(
                  <div key={l} className="rounded-2xl p-4 text-center" style={{background:T.navy}}>
                    <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:T.red}}>{v}</div>
                    <div style={{fontFamily:FONT,fontSize:10,color:"rgba(255,255,255,.4)",marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies preview */}
      <section className="py-28 px-6" style={{background:T.soft}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <Eyebrow text="Case Studies"/>
              <SH>Digital Growth Systems<br/><span style={{color:T.red}}>In Action</span></SH>
            </div>
            <BtnOutline onClick={()=>nav("case-studies")}>View All Case Studies <ArrowRight size={13}/></BtnOutline>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CASE_PREVIEWS.map((c,i)=>(
              <motion.div key={c.title} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.09}}
                whileHover={{y:-5}} onClick={()=>nav("case-studies")}
                className="group rounded-3xl overflow-hidden cursor-pointer"
                style={{background:T.white,border:`1px solid ${T.border}`,boxShadow:"0 4px 24px rgba(10,19,48,.06)"}}>
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute inset-0" style={{background:`${T.navy}38`}}/>
                  <div className="absolute top-3 left-3"><Chip color={c.col}>{c.cat}</Chip></div>
                  <div className="absolute bottom-3 left-3">
                    <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:"#fff"}}>{c.metric}</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:T.navy}}>{c.title}</h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-bold" style={{color:c.col,fontFamily:FONT}}>
                    View Project <ArrowRight size={11}/>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 px-6" style={{background:T.navy}}>
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["250+","Happy Clients"],["120+","Projects Delivered"],["4.9★","Average Rating"],["24/7","AI Support Active"]].map(([v,l])=>(
            <div key={l}>
              <p style={{fontFamily:FONT,fontWeight:800,fontSize:36,color:T.red,lineHeight:1}}>{v}</p>
              <p style={{fontFamily:FONT,fontSize:13,color:"rgba(255,255,255,.45)",marginTop:6}}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6" style={{background:T.soft}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <Eyebrow text="Client Results"/>
            <SH center>Real Results. <span style={{color:T.red}}>Real Impact.</span></SH>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="rounded-3xl p-8 flex flex-col items-center justify-center text-center"
              style={{background:T.navy,border:`2px solid ${T.red}`,boxShadow:`0 20px 60px ${T.navy}30`}}>
              <div style={{fontFamily:FONT,fontWeight:800,fontSize:52,color:T.red,lineHeight:1}}>4.9</div>
              <div className="text-white text-sm mt-1 mb-3" style={{fontFamily:FONT}}>out of 5.0</div>
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_,j)=><Star key={j} size={16} fill={T.red} stroke="none"/>)}</div>
              <div style={{fontFamily:FONT,fontSize:11,color:"rgba(255,255,255,.38)"}}>Based on 150+ reviews</div>
              <div className="mt-6 grid grid-cols-3 gap-2 w-full">
                {[["210%","More Leads"],["80+","Hrs Saved"],["190%","Sales"]].map(([v,l])=>(
                  <div key={l} className="rounded-xl py-2" style={{background:"rgba(255,255,255,.07)"}}>
                    <div style={{fontFamily:FONT,fontWeight:800,fontSize:14,color:T.red}}>{v}</div>
                    <div style={{fontFamily:FONT,fontSize:9,color:"rgba(255,255,255,.35)",marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {[
              {name:"Sarah Mitchell",role:"CEO, Lumio Shop",quote:"Axclade didn't just build us a website — they built us a growth engine. Our leads tripled in 90 days.",result:"+300% Leads"},
              {name:"James Okafor",role:"Founder, Nexus Analytics",quote:"The AI automation saves our team 30+ hours every week. It's transformed how we operate and the ROI is extraordinary.",result:"30hrs/wk saved"},
              {name:"Priya Sharma",role:"Marketing Director, Vero Wellness",quote:"Our brand now looks as premium as our product. Axclade increased inquiry quality and our conversion rate dramatically.",result:"+180% Conversions"},
            ].map(t=>(
              <Glass key={t.name} className="p-7 flex flex-col gap-5">
                <div className="flex gap-1">{[...Array(5)].map((_,j)=><Star key={j} size={13} fill={T.red} stroke="none"/>)}</div>
                <p className="flex-1 text-sm leading-relaxed" style={{fontFamily:FONT,color:T.navy}}>"{t.quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t" style={{borderColor:T.border}}>
                  <div>
                    <div style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy}}>{t.name}</div>
                    <div style={{fontFamily:FONT,fontSize:11,color:T.muted,marginTop:2}}>{t.role}</div>
                  </div>
                  <span className="text-xs font-bold rounded-xl px-2.5 py-1.5"
                    style={{background:`${T.red}0E`,color:T.red,fontFamily:FONT}}>{t.result}</span>
                </div>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      <CTABanner go={go}/>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PACKAGES PAGE — Premium Animated Pricing Cards
// ═══════════════════════════════════════════════════════════════════════════════

// Glow color per tier
function tierGlow(name:string,popular:boolean):string{
  if(popular) return `linear-gradient(135deg,${T.red}80,#4361EE80)`;
  if(name==="Starter"||name==="Scale") return "#4361EE";
  return `${T.navy}`;
}

// Individual pricing card with full micro-interactions
function PricingCard({ tier, catCol, delay, go }:{
  tier:{name:string;price:string;note:string;popular:boolean;features:string[];cta:string;extra?:string};
  catCol:string; delay:number; go:(p:Page)=>void;
}){
  const [hovered,setHovered]=useState(false);
  const [cursor,setCursor]=useState({x:150,y:150});
  const ref=useRef<HTMLDivElement>(null);

  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{
    if(!ref.current) return;
    const r=ref.current.getBoundingClientRect();
    setCursor({x:e.clientX-r.left,y:e.clientY-r.top});
  };

  const isPop=tier.popular;

  return(
    <motion.div
      ref={ref}
      initial={{opacity:0,y:60,scale:.95}}
      whileInView={{opacity:1,y:0,scale:isPop?1.05:1}}
      viewport={{once:true,margin:"-60px"}}
      transition={{duration:.8,ease:"easeOut",delay}}
      whileHover={{y:-12,scale:isPop?1.07:1.02,transition:{duration:.4,ease:"easeOut"}}}
      onMouseMove={onMove}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      className="relative flex flex-col"
      style={{
        background:"rgba(255,255,255,0.85)",
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        borderRadius:32,
        border:isPop?`2px solid ${T.red}`:`1px solid rgba(255,255,255,.6)`,
        boxShadow:isPop
          ?`0 30px 80px rgba(255,78,69,.20),0 0 0 1px ${T.red}18`
          :`0 20px 60px rgba(10,19,48,.08)`,
        padding:32,
        paddingTop:isPop?44:32,
        outline:"none",
        overflow:"visible",
      }}>

      {/* Ambient glow behind card (outside, z-index trick via margin) */}
      <div className="absolute -inset-6 -z-10 rounded-[48px] pointer-events-none transition-all duration-500"
        style={{
          background:tierGlow(tier.name,isPop),
          filter:"blur(80px)",
          opacity:hovered?.35:.14,
        }}/>

      {/* Cursor-following radial glow */}
      <div className="absolute inset-0 pointer-events-none rounded-[32px] overflow-hidden"
        style={{
          background:`radial-gradient(280px circle at ${cursor.x}px ${cursor.y}px, ${isPop?`${T.red}22`:"#4361EE18"}, transparent 70%)`,
          opacity:hovered?1:0,
          transition:"opacity .4s ease",
        }}/>

      {/* Glass reflection sweep on hover — clipped to card bounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]" style={{zIndex:1}}>
      <motion.div className="absolute inset-0 pointer-events-none"
        initial={{x:"-110%"}}
        animate={hovered?{x:"220%"}:{x:"-110%"}}
        transition={{duration:.65,ease:"easeOut"}}
        style={{
          background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,.12) 50%,transparent 60%)",
          transform:"skewX(-15deg)",
          zIndex:1,
        }}/>
      </div>

      {/* Most Popular floating badge */}
      {isPop&&(
        <motion.div
          animate={{y:[0,-4,0]}}
          transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-xs font-extrabold text-white rounded-full px-5 py-1.5 whitespace-nowrap"
          style={{background:T.red,fontFamily:FONT,boxShadow:`0 4px 20px ${T.red}50`}}>
          ★ Most Popular
        </motion.div>
      )}

      {/* Plan badge */}
      <div className="mb-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold"
          style={{padding:"4px 12px",background:`${isPop?T.red:catCol}12`,color:isPop?T.red:catCol,
            border:`1px solid ${isPop?T.red:catCol}25`,fontFamily:FONT}}>
          {tier.name}
        </span>
      </div>

      {/* Price */}
      <div className="mb-2 relative z-10">
        <div className="flex items-baseline gap-1">
          <motion.span
            animate={hovered?{color:T.red}:{color:T.navy}}
            transition={{duration:.3}}
            style={{fontFamily:FONT,fontWeight:800,fontSize:52,lineHeight:1,display:"block"}}>
            {tier.price}
          </motion.span>
          <span style={{fontFamily:FONT,fontSize:13,color:T.muted}}>/mo</span>
        </div>
        <p style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:4}}>{tier.note}</p>
      </div>

      {/* Extra note (e.g. performance bonus) */}
      {tier.extra&&(
        <p className="mb-4 text-xs rounded-xl px-3 py-2 relative z-10"
          style={{fontFamily:FONT,color:catCol,background:`${catCol}10`,border:`1px solid ${catCol}20`}}>
          {tier.extra}
        </p>
      )}

      {/* Features — staggered fade in */}
      <ul className="space-y-2.5 flex-1 mt-2 relative z-10">
        {tier.features.map((f,fi)=>(
          <motion.li key={f}
            initial={{opacity:0,x:-8}}
            whileInView={{opacity:1,x:0}}
            viewport={{once:true}}
            transition={{delay:.15+fi*.05,duration:.4}}
            className="flex items-center gap-2.5 group/feat"
            style={{fontFamily:FONT,fontSize:13,color:T.navy}}>
            <motion.div
              whileHover={{rotate:5,scale:1.2}}
              className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
              style={{background:`${T.success}14`}}>
              <Check size={9} style={{color:T.success}}/>
            </motion.div>
            <span className="transition-colors duration-200 group-hover/feat:text-navy" style={{color:T.navy}}>{f}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <motion.button
        onClick={()=>{ go("contact"); window.scrollTo(0,0); }}
        whileHover={{scale:1.05}}
        className="mt-7 w-full flex items-center justify-center gap-2 rounded-full font-bold text-sm relative z-10 group/cta overflow-hidden"
        style={{
          height:52,fontFamily:FONT,fontWeight:700,
          background:isPop?T.red:`${T.navy}09`,
          color:isPop?"#fff":T.navy,
          border:isPop?"none":`1.5px solid ${T.border}`,
          boxShadow:isPop?`0 0 25px rgba(255,78,69,.35)`:"none",
          transition:"box-shadow .3s ease",
        }}>
        <span className="relative z-10">{tier.cta}</span>
        <motion.div
          animate={hovered?{x:4}:{x:0}}
          transition={{duration:.3}}
          className="relative z-10">
          <ArrowRight size={14}/>
        </motion.div>
        {/* Button glow sweep */}
        {isPop&&(
          <motion.div className="absolute inset-0"
            initial={{x:"-100%"}} animate={hovered?{x:"200%"}:{x:"-100%"}}
            transition={{duration:.5}}
            style={{background:"linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent)"}}/>
        )}
      </motion.button>
    </motion.div>
  );
}

// Floating background orb
function FloatOrb({ color, size, x, y, dur }:{color:string;size:number;x:string;y:string;dur:number}){
  return(
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{width:size,height:size,background:color,filter:`blur(${size*.6}px)`,opacity:.12,left:x,top:y}}
      animate={{y:[0,-24,0],x:[0,12,0]}}
      transition={{duration:dur,repeat:Infinity,ease:"easeInOut"}}/>
  );
}

function PackagesPage({ go }:{go:(p:Page)=>void}){
  const [tab,setTab]=useState(0);

  const cats=[
    {
      name:"Local & Startup Growth",col:T.blue,icon:<Target size={16}/>,
      desc:"For local businesses, startups, restaurants, salons, dentists, gyms, plumbers, real estate, and clinics.",
      tiers:[
        {name:"Starter",price:"$199",note:"Basic trust and local presence.",popular:false,cta:"Start with Local Starter",
          features:["Google Business Profile Optimization","Local SEO Setup","Business Citations","Review System Setup","Monthly Report"]},
        {name:"Growth",price:"$449",note:"Active lead generation & ads.",popular:true,cta:"Choose Local Growth",
          features:["Everything in Starter","Weekly GMB Posts","Meta Ads Management","Call Tracking","Lead Tracking","Monthly Performance Review"]},
        {name:"Authority",price:"$799",note:"Full local market dominance.",popular:false,cta:"Build Local Authority",
          features:["Everything in Growth","Google Search Ads","Competitor Monitoring","Advanced Analytics","Bi-Weekly Reviews"]},
      ],
    },
    {
      name:"E-commerce Growth",col:T.red,icon:<ShoppingBag size={16}/>,
      desc:"For Shopify stores, WooCommerce stores, clothing, beauty, food products, and online brands.",
      tiers:[
        {name:"Starter",price:"$299",note:"Basic marketing setup.",popular:false,cta:"Start E-commerce Setup",
          features:["Meta Pixel Check","Product Catalog Setup","Basic Meta Ads OR Email Automation","Welcome Email Flow","Abandoned Cart Flow","Thank You Email Flow","Monthly Basic Report"]},
        {name:"Growth",price:"$699",note:"Regular sales campaigns.",popular:true,cta:"Choose E-commerce Growth",
          features:["Meta Ads Management","Google Search / Shopping Ads","4 Email Campaigns/mo","Abandoned Cart Optimization","4 Ad Creatives/mo","Basic Conversion Tracking","Monthly Report"]},
        {name:"Scale",price:"$1,299",note:"Full multi-platform scaling.",popular:false,cta:"Scale My Store",extra:"Optional: +3% on revenue above agreed baseline.",
          features:["Meta Ads Management","Google Ads Management","TikTok Ads Management","Complete Email Automation","Advanced ROAS Tracking","Conversion Optimisation Suggestions","8 Ad Creatives/mo","Weekly Review"]},
      ],
    },
    {
      name:"B2B Lead Generation",col:"#8B5CF6",icon:<Briefcase size={16}/>,
      desc:"For software houses, SaaS companies, consultants, agencies, IT services, and B2B companies.",
      tiers:[
        {name:"Starter",price:"$349",note:"B2B positioning and setup.",popular:false,cta:"Start B2B Setup",
          features:["LinkedIn Profile Optimization","Company Page Improvement","Ideal Customer Profile","1 LinkedIn Campaign Setup","Basic Outreach Message Structure","Monthly Basic Report"]},
        {name:"Growth",price:"$799",note:"Regular lead generation.",popular:true,cta:"Choose B2B Growth",
          features:["LinkedIn Ads Management","B2B Marketing Strategy","2 SEO Blog Posts/mo","Lead Magnet Planning","Landing Page Audit","Monthly Lead Performance Report"]},
        {name:"Sales Engine",price:"$1,499",note:"Full B2B sales funnel.",popular:false,cta:"Build My Sales Engine",
          features:["LinkedIn ABM Campaign Management","B2B SEO Content Strategy","Email Outreach Strategy","CRM Tracking Setup Guidance","Landing Page Optimisation","Advanced Analytics Dashboard","Weekly Review"]},
      ],
    },
    {
      name:"Brand & Social Media",col:"#F59E0B",icon:<Sparkles size={16}/>,
      desc:"For restaurants, cafes, gyms, beauty brands, fashion brands, clinics, startups, and personal brands.",
      tiers:[
        {name:"Starter",price:"$149",note:"Basic social presence.",popular:false,cta:"Start Social Presence",extra:"No reels, no ads, no DM management.",
          features:["10 Posts Per Month","Basic Captions","Hashtag Research","Monthly Content Calendar","Basic Page Optimisation"]},
        {name:"Growth",price:"$349",note:"Strong brand content & visuals.",popular:true,cta:"Choose Social Growth",
          features:["18 Posts Per Month","4 Reels / TikToks Editing","Story Designs","Brand Visual Direction","Monthly Content Calendar","Monthly Report"]},
        {name:"Authority",price:"$649",note:"Full social management.",popular:false,cta:"Build Brand Authority",
          features:["26 Posts Per Month","8 Reels / TikToks Editing","Community Management","Competitor Analysis","Monthly Content Strategy","Monthly Review Call"]},
      ],
    },
  ];

  const faq=[
    {q:"Do you guarantee leads or sales?",a:"No agency can honestly guarantee exact leads or sales because results depend on market, offer, budget, competition, and customer demand. We focus on improving visibility, tracking, campaigns, conversion performance, and digital systems."},
    {q:"Is ad spend included in the package?",a:"No. Ad spend is separate and paid directly by the client to platforms like Meta, Google, LinkedIn, or TikTok."},
    {q:"Is there a minimum contract?",a:"We recommend a minimum 3-month commitment because SEO, ads optimisation, branding, and digital growth need time to deliver proper results."},
    {q:"Can I start with a small package and upgrade?",a:"Yes. Starter packages are designed for setup and basic presence. You can upgrade at any time as your business grows."},
    {q:"Which package is best for my business?",a:"It depends on your business type, goals, budget, and current digital presence. Book a free consultation and we'll recommend the best option."},
  ];

  const [openFaq,setOpenFaq]=useState<number|null>(null);
  const active=cats[tab];

  return(
    <>
      <PageHero
        badge="Growth Packages"
        title={<>Digital Growth Packages<br/><span style={{color:T.red}}>For Every Business</span></>}
        sub="Choose a digital growth package designed to improve your visibility, strengthen your brand, generate better leads, and build a stronger online presence."/>

      {/* Important notes banner */}
      <section className="px-6 py-8" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="rounded-2xl px-6 py-5 flex flex-wrap gap-x-8 gap-y-2 items-center justify-center"
            style={{background:`${T.blue}08`,border:`1px solid ${T.blue}20`}}>
            <span style={{fontFamily:FONT,fontWeight:700,fontSize:12,color:T.blue}}>ℹ Important Notes</span>
            {["Minimum 3-month commitment recommended","Ad spend is separate","Paid tools & software fees are separate","Results vary by market, budget & competition"].map(n=>(
              <div key={n} className="flex items-center gap-1.5" style={{fontFamily:FONT,fontSize:12,color:T.muted}}>
                <div className="w-1 h-1 rounded-full" style={{background:T.muted}}/>
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <section className="pb-2 px-6" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {cats.map((c,i)=>(
              <motion.button key={c.name} onClick={()=>setTab(i)}
                whileHover={{scale:1.03}} whileTap={{scale:.98}}
                className="flex items-center gap-2 rounded-full text-sm font-bold transition-all"
                style={{padding:"11px 22px",fontFamily:FONT,
                  background:tab===i?T.navy:`rgba(10,19,48,.06)`,
                  color:tab===i?"#fff":T.navy,
                  border:tab===i?`2px solid ${T.red}`:"2px solid transparent",
                  boxShadow:tab===i?`0 4px 20px ${T.navy}28`:"none"}}>
                <span style={{color:tab===i?c.col:"inherit"}}>{c.icon}</span>
                {c.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-16 px-6 relative overflow-hidden" style={{background:T.soft}}>
        {/* Floating background orbs */}
        <FloatOrb color={T.red}  size={320} x="5%"  y="10%"  dur={18}/>
        <FloatOrb color={T.blue} size={280} x="75%" y="5%"   dur={22}/>
        <FloatOrb color={T.blue} size={200} x="60%" y="70%"  dur={15}/>
        <FloatOrb color={T.red}  size={180} x="15%" y="75%"  dur={20}/>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
              transition={{duration:.28}}>

              {/* Category heading */}
              <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.1}}
                className="text-center mb-12">
                <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.6rem,3vw,2.2rem)",color:T.navy,letterSpacing:"-.4px"}}>
                  {active.name}
                </h3>
                <p className="mt-2" style={{fontFamily:FONT,fontSize:14,color:T.muted}}>{active.desc}</p>
              </motion.div>

              {/* Cards grid — pt-6 gives room for the floating badge */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-6">
                {active.tiers.map((tier,ti)=>(
                  <PricingCard key={tier.name} tier={tier as any} catCol={active.col} delay={.1+ti*.1} go={go}/>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-20 px-6" style={{background:T.white}}>
        <div className="max-w-[780px] mx-auto">
          <div className="text-center mb-10">
            <Eyebrow text="FAQ"/>
            <SH center>Common <span style={{color:T.red}}>Questions</span></SH>
          </div>
          <div className="space-y-3">
            {faq.map((f,i)=>(
              <motion.div key={i} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}
                className="rounded-2xl overflow-hidden" style={{border:`1px solid ${T.border}`,background:T.white}}>
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                  <span style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.navy}}>{f.q}</span>
                  <motion.div animate={{rotate:openFaq===i?45:0}} transition={{duration:.2}}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:openFaq===i?T.red:`${T.navy}09`,color:openFaq===i?"#fff":T.navy}}>
                      <span style={{fontSize:16,lineHeight:1,marginTop:-1}}>+</span>
                    </div>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq===i&&(
                    <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.22}}>
                      <p className="px-6 pb-5 text-sm leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* "Not Sure" premium CTA panel */}
      <section className="py-16 px-6" style={{background:T.soft}}>
        <div className="max-w-[1280px] mx-auto">
          <motion.div initial={{opacity:0,scale:.98}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.6}}>
            <div className="relative rounded-3xl overflow-hidden px-10 py-16 text-center"
              style={{background:"rgba(255,255,255,.82)",backdropFilter:"blur(24px)",border:`1px solid rgba(255,255,255,.9)`,
                boxShadow:"0 24px 80px rgba(10,19,48,.10)"}}>
              {/* Gradient overlay strip */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{background:"linear-gradient(90deg,#FF4E45,#4361EE)"}}/>
              {/* Ambient glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
                style={{background:`linear-gradient(135deg,${T.red},${T.blue})`,filter:"blur(80px)",opacity:.1}}/>

              <div className="relative z-10">
                <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.7rem,3.2vw,2.4rem)",color:T.navy,letterSpacing:"-.5px",lineHeight:1.15}}>
                  Not Sure Which Package<br/>Is Right For You?
                </h2>
                <p className="mt-4 max-w-md mx-auto" style={{fontFamily:FONT,fontSize:15,color:T.muted,lineHeight:1.6}}>
                  Book a free 30-minute package consultation. We'll review your business goals and recommend the best growth system for your stage and budget.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <motion.button
                    onClick={()=>{ go("contact"); window.scrollTo(0,0); }}
                    whileHover={{scale:1.05,boxShadow:`0 0 32px ${T.red}50`}}
                    className="inline-flex items-center gap-2 rounded-full font-bold text-white"
                    style={{padding:"16px 36px",fontSize:15,fontFamily:FONT,background:T.red,boxShadow:`0 4px 20px ${T.red}35`}}>
                    Book a Free Package Consultation <ArrowRight size={15}/>
                  </motion.button>
                  <motion.button
                    onClick={()=>{ go("contact"); window.scrollTo(0,0); }}
                    whileHover={{scale:1.03}}
                    className="inline-flex items-center gap-2 rounded-full font-bold"
                    style={{padding:"16px 36px",fontSize:15,fontFamily:FONT,background:"transparent",
                      color:T.navy,border:`1.5px solid ${T.border}`}}>
                    Get a Free Digital Audit
                  </motion.button>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-6">
                  {["No commitment","Free 30-min call","Customised plan included"].map(t=>(
                    <div key={t} className="flex items-center gap-2 text-sm" style={{color:T.muted,fontFamily:FONT}}>
                      <Check size={13} style={{color:T.success}}/>{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SOLUTIONS PAGE — Five distinct section layouts
// ═══════════════════════════════════════════════════════════════════════════════

// Reusable service pill grid
function ServicePills({ items, accent=T.red }:{items:string[];accent?:string}){
  return(
    <div className="flex flex-wrap gap-2 mt-4">
      {items.map((s,i)=>(
        <motion.span key={s} initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.04}}
          className="inline-flex items-center gap-1.5 rounded-full text-xs font-semibold"
          style={{padding:"6px 14px",fontFamily:FONT,background:`${accent}0E`,color:accent,border:`1px solid ${accent}22`}}>
          <Check size={9}/>{s}
        </motion.span>
      ))}
    </div>
  );
}

// Section number badge
function SolNum({ n }:{n:string}){
  return(
    <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl mb-4 font-black text-base"
      style={{background:`${T.red}10`,color:T.red,fontFamily:FONT}}>{n}</div>
  );
}

// ── 1. WEB DESIGN — Split layout (content left, browser mockup right) ─────────
function SolWeb({ go }:{go:(p:Page)=>void}){
  return(
    <section id="web" className="py-24 px-6" style={{background:T.white}}>
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: content */}
        <motion.div initial={{opacity:0,x:-28}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65}}>
          <SolNum n="01"/>
          <Eyebrow text="Web Design & Development"/>
          <SH>Modern websites designed to<br/><span style={{color:T.red}}>convert visitors into customers.</span></SH>
          <p className="mt-5 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
            Every Axclade website is engineered for performance, conversion, and search visibility — not just aesthetics. We build digital storefronts that generate real business results.
          </p>
          <ServicePills items={["Business websites","Landing pages","E-commerce websites","Restaurant websites","Booking websites","Website redesign","Speed optimisation","Mobile responsive design"]}/>
          <div className="mt-8">
            <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>Build My Website <ArrowRight size={13}/></BtnPrimary>
          </div>
        </motion.div>

        {/* Right: browser mockup */}
        <motion.div initial={{opacity:0,x:28}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65,delay:.1}} className="relative">
          {/* Browser chrome frame */}
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{border:`1px solid ${T.border}`}}>
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3" style={{background:T.soft,borderBottom:`1px solid ${T.border}`}}>
              <div className="flex gap-1.5">
                {["#FF5F57","#FEBC2E","#28C840"].map(c=><div key={c} className="w-3 h-3 rounded-full" style={{background:c}}/>)}
              </div>
              <div className="flex-1 rounded-lg px-3 py-1.5 text-xs" style={{background:"rgba(10,19,48,.06)",color:T.muted,fontFamily:FONT}}>
                axclade.com/client-site
              </div>
            </div>
            {/* Website preview */}
            <div className="relative overflow-hidden" style={{height:320,background:"linear-gradient(160deg,#F0F4FF,#E8EEFF)"}}>
              <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=500&fit=crop&auto=format"
                alt="Website preview" className="w-full h-full object-cover opacity-70"/>
              {/* Overlay UI elements */}
              <div className="absolute inset-0 flex flex-col p-6 gap-3">
                <div className="rounded-xl px-4 py-3 w-56" style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(12px)"}}>
                  <div className="text-xs font-bold mb-1" style={{color:T.navy,fontFamily:FONT}}>Monthly Visitors</div>
                  <div className="text-2xl font-extrabold" style={{color:T.red,fontFamily:FONT}}>12,847</div>
                  <div className="text-xs" style={{color:T.muted,fontFamily:FONT}}>↑ +143% from last month</div>
                </div>
                <div className="ml-auto rounded-xl px-4 py-3 w-48" style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(12px)"}}>
                  <div className="text-xs font-bold mb-1" style={{color:T.navy,fontFamily:FONT}}>Conv. Rate</div>
                  <div className="text-2xl font-extrabold" style={{color:"#22C55E",fontFamily:FONT}}>4.8%</div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating badge */}
          <motion.div animate={{y:[0,-8,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}
            className="absolute -bottom-4 -left-6 rounded-2xl px-4 py-3 shadow-xl"
            style={{background:T.white,border:`1px solid ${T.border}`}}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:`${T.red}12`,color:T.red}}><Zap size={16}/></div>
              <div>
                <div className="text-xs font-bold" style={{color:T.navy,fontFamily:FONT}}>PageSpeed Score</div>
                <div className="text-sm font-extrabold" style={{color:"#22C55E",fontFamily:FONT}}>98 / 100</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── 2. APP DEVELOPMENT — Dark navy feature card ────────────────────────────────
function SolApp({ go }:{go:(p:Page)=>void}){
  return(
    <section id="app" className="py-24 px-6 relative overflow-hidden" style={{background:T.navy}}>
      <Glow color={T.red} size={500} className="-top-40 left-1/4"/>
      <Glow color={T.blue} size={400} className="-bottom-20 right-1/4"/>
      <div className="absolute inset-0 pointer-events-none opacity-[.05]"
        style={{backgroundImage:`radial-gradient(circle,#fff 1px,transparent 1px)`,backgroundSize:"30px 30px"}}/>

      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: phone mockups */}
        <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65}}
          className="flex justify-center gap-4">
          {/* Tall phone */}
          <div className="relative">
            <div className="w-44 rounded-[32px] overflow-hidden shadow-2xl"
              style={{background:T.space,border:`2px solid rgba(255,255,255,.1)`,height:320}}>
              <div className="h-7 flex items-center justify-center">
                <div className="w-16 h-1 rounded-full" style={{background:"rgba(255,255,255,.15)"}}/>
              </div>
              <div className="px-3 pb-3 flex flex-col gap-2">
                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=400&fit=crop&auto=format"
                  alt="App screen" className="rounded-2xl w-full" style={{height:180,objectFit:"cover"}}/>
                <div className="rounded-xl p-2.5" style={{background:"rgba(255,255,255,.07)"}}>
                  <div className="text-xs font-bold text-white mb-1" style={{fontFamily:FONT}}>Active Users</div>
                  <div className="text-lg font-extrabold" style={{color:T.red,fontFamily:FONT}}>2,481</div>
                </div>
              </div>
            </div>
            <motion.div animate={{y:[0,-6,0]}} transition={{duration:3.5,repeat:Infinity}}
              className="absolute -right-8 top-12 rounded-2xl px-3 py-2.5 shadow-xl"
              style={{background:"rgba(255,255,255,.12)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.15)"}}>
              <div className="text-xs font-bold text-white whitespace-nowrap" style={{fontFamily:FONT}}>★ 4.9 App Store</div>
            </motion.div>
          </div>
          {/* Short phone */}
          <div className="w-36 rounded-[28px] overflow-hidden shadow-xl mt-12"
            style={{background:T.space,border:`2px solid rgba(255,255,255,.08)`,height:240}}>
            <div className="h-6 flex items-center justify-center">
              <div className="w-12 h-1 rounded-full" style={{background:"rgba(255,255,255,.12)"}}/>
            </div>
            <div className="px-3">
              <div className="rounded-xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=200&fit=crop&auto=format"
                  alt="App UI" className="w-full" style={{height:120,objectFit:"cover"}}/>
              </div>
              <div className="mt-2 rounded-lg p-2" style={{background:"rgba(255,255,255,.07)"}}>
                <div className="flex gap-1">{[...Array(5)].map((_,j)=><div key={j} className="flex-1 h-1 rounded-full" style={{background:j<4?T.red:"rgba(255,255,255,.15)"}}/>)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: content */}
        <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65,delay:.1}}>
          <SolNum n="02"/>
          <Eyebrow text="App Design & Development" light/>
          <SH light>Mobile experiences that improve<br/><span style={{color:T.red}}>customer engagement.</span></SH>
          <p className="mt-5 text-base leading-relaxed" style={{fontFamily:FONT,color:"rgba(255,255,255,.55)"}}>
            From customer-facing apps to delivery and booking platforms — we design and develop mobile experiences that keep your business in your customers' hands, 24/7.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {["iOS apps","Android apps","Cross-platform apps","Customer apps","Admin apps","Delivery apps","Booking apps","Ordering apps"].map((s,i)=>(
              <motion.span key={s} initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.04}}
                className="inline-flex items-center gap-1.5 rounded-full text-xs font-semibold"
                style={{padding:"6px 14px",fontFamily:FONT,background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.8)",border:"1px solid rgba(255,255,255,.12)"}}>
                <Check size={9} style={{color:T.red}}/>{s}
              </motion.span>
            ))}
          </div>
          <div className="mt-8">
            <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>Start My App Project <ArrowRight size={13}/></BtnPrimary>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── 3. SOFTWARE — Glassmorphism card grid ─────────────────────────────────────
function SolSoftware({ go }:{go:(p:Page)=>void}){
  const items=[
    {icon:<Users size={20}/>,title:"CRM Systems",desc:"Manage leads, clients, and pipelines in one place."},
    {icon:<Monitor size={20}/>,title:"Admin Dashboards",desc:"Internal control panels with real-time data."},
    {icon:<Package size={20}/>,title:"Order Management",desc:"End-to-end order tracking and fulfilment."},
    {icon:<BarChart3 size={20}/>,title:"Booking Systems",desc:"Appointment and reservation management."},
    {icon:<Layers size={20}/>,title:"Inventory Systems",desc:"Stock tracking and automated alerts."},
    {icon:<Globe size={20}/>,title:"Customer Portals",desc:"Self-service hubs for your clients."},
    {icon:<Shield size={20}/>,title:"Staff Portals",desc:"Internal tools for team management."},
    {icon:<LineChart size={20}/>,title:"Reporting Dashboards",desc:"Live analytics and exportable reports."},
  ];

  return(
    <section id="software" className="py-24 px-6 relative overflow-hidden" style={{background:T.soft}}>
      <Glow color={T.blue} size={400} className="-top-20 right-10"/>
      <Glow color={T.red} size={300} className="bottom-0 left-10"/>

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left sticky content */}
          <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65}} className="lg:sticky lg:top-24">
            <SolNum n="03"/>
            <Eyebrow text="Software Design & Development"/>
            <SH>Custom software systems built<br/><span style={{color:T.red}}>around business workflows.</span></SH>
            <p className="mt-5 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Off-the-shelf software rarely fits your business perfectly. We design and build custom systems tailored to exactly how your team operates — so every tool actually gets used.
            </p>
            {/* Mini dashboard preview */}
            <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.3}}
              className="mt-8 rounded-2xl overflow-hidden shadow-xl" style={{border:`1px solid ${T.border}`}}>
              <div className="px-5 py-3 flex items-center justify-between" style={{background:T.navy}}>
                <span className="text-xs font-bold text-white" style={{fontFamily:FONT}}>Axclade CRM Dashboard</span>
                <div className="flex gap-1.5">{["#FF5F57","#FEBC2E","#28C840"].map(c=><div key={c} className="w-2 h-2 rounded-full" style={{background:c}}/>)}</div>
              </div>
              <div className="p-5" style={{background:"rgba(255,255,255,.9)",backdropFilter:"blur(16px)"}}>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[["847","Active Leads",T.blue],["124","Won This Month","#22C55E"],["3.2×","Avg. ROAS",T.red]].map(([v,l,c])=>(
                    <div key={l as string} className="rounded-xl p-3 text-center" style={{background:`${c as string}0D`}}>
                      <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:c as string,lineHeight:1}}>{v as string}</div>
                      <div style={{fontFamily:FONT,fontSize:10,color:T.muted,marginTop:3}}>{l as string}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {[70,45,85,55,90,65,80].map((h,i)=>(
                    <div key={i} className="flex-1 rounded-t-sm" style={{height:h/2,background:i===4?T.red:`${T.navy}18`,borderRadius:2}}/>
                  ))}
                </div>
              </div>
            </motion.div>
            <div className="mt-7">
              <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>Discuss Custom Software <ArrowRight size={13}/></BtnPrimary>
            </div>
          </motion.div>

          {/* Right: glass card grid */}
          <div className="grid grid-cols-2 gap-4">
            {items.map((item,i)=>(
              <motion.div key={item.title}
                initial={{opacity:0,y:24,scale:.96}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true}} transition={{delay:i*.07,duration:.5}}
                whileHover={{y:-4,scale:1.02}}
                className="rounded-2xl p-5"
                style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(20px)",
                  border:"1px solid rgba(255,255,255,.9)",boxShadow:"0 6px 32px rgba(10,19,48,.08)"}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:`${T.blue}12`,color:T.blue}}>{item.icon}</div>
                <h4 style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:T.navy,marginBottom:5}}>{item.title}</h4>
                <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5}}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 4. AI AUTOMATION — Dark workflow visualization section ─────────────────────
function SolAI({ go }:{go:(p:Page)=>void}){
  const tick=useTick(900);
  const activeNode=tick%5;

  const nodes=[
    {label:"Lead Capture",icon:<Users size={18}/>,col:"#4361EE"},
    {label:"AI Analysis",icon:<Brain size={18}/>,col:"#8B5CF6"},
    {label:"Auto Action",icon:<Zap size={18}/>,col:T.red},
    {label:"CRM Update",icon:<Activity size={18}/>,col:"#22C55E"},
    {label:"Report Gen.",icon:<BarChart3 size={18}/>,col:"#F59E0B"},
  ];

  const logs=[
    {t:"just now",txt:"New lead qualified — score 94/100",col:"#22C55E"},
    {t:"1m ago",txt:"WhatsApp reply sent automatically",col:T.blue},
    {t:"3m ago",txt:"CRM contact record created",col:"#8B5CF6"},
    {t:"7m ago",txt:"Abandoned cart email triggered",col:"#F59E0B"},
  ];

  return(
    <section id="ai" className="py-24 px-6 relative overflow-hidden"
      style={{background:"linear-gradient(180deg,#050811 0%,#0A1330 100%)"}}>
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{background:T.red,filter:"blur(140px)",opacity:.08}}/>
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{background:T.blue,filter:"blur(120px)",opacity:.08}}/>
      <div className="absolute inset-0 pointer-events-none opacity-[.04]"
        style={{backgroundImage:`radial-gradient(circle,#fff 1px,transparent 1px)`,backgroundSize:"30px 30px"}}/>

      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: content */}
        <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65}}>
          <SolNum n="04"/>
          <Eyebrow text="AI Automation Systems" light/>
          <SH light>Automate repetitive tasks and<br/><span style={{color:T.red}}>improve operational efficiency.</span></SH>
          <p className="mt-5 text-base leading-relaxed" style={{fontFamily:FONT,color:"rgba(255,255,255,.52)"}}>
            Every hour your team spends on repetitive tasks is an hour not spent growing your business. Our AI automation systems handle lead capture, follow-up, CRM updates, and reporting — automatically.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {["AI chatbots","Lead capture automation","CRM automation","WhatsApp automation","Email automation","Customer support automation","Appointment automation","Reporting automation"].map((s,i)=>(
              <motion.span key={s} initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.04}}
                className="inline-flex items-center gap-1.5 rounded-full text-xs font-semibold"
                style={{padding:"6px 14px",fontFamily:FONT,background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.75)",border:"1px solid rgba(255,255,255,.1)"}}>
                <Check size={9} style={{color:T.red}}/>{s}
              </motion.span>
            ))}
          </div>
          {/* Stat cards */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[["−62%","Manual Work"],["< 90s","Lead Response"],["24/7","AI Active"]].map(([v,l])=>(
              <div key={l} className="rounded-2xl p-4 text-center" style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)"}}>
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:T.red,lineHeight:1}}>{v}</div>
                <div style={{fontFamily:FONT,fontSize:10,color:"rgba(255,255,255,.38)",marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-7">
            <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>Automate My Business <ArrowRight size={13}/></BtnPrimary>
          </div>
        </motion.div>

        {/* Right: workflow visualization */}
        <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65,delay:.1}}>
          <div className="rounded-3xl p-7"
            style={{background:"rgba(255,255,255,.05)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.08)",boxShadow:"0 24px 80px rgba(0,0,0,.4)"}}>
            <div className="flex items-center justify-between mb-6">
              <span style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:"#fff"}}>Live Automation Flow</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{background:"#22C55E14",border:"1px solid #22C55E28"}}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#22C55E"}}/>
                <span style={{fontFamily:FONT,fontSize:11,fontWeight:700,color:"#22C55E"}}>RUNNING</span>
              </div>
            </div>

            {/* Workflow nodes */}
            <div className="flex items-center justify-between gap-1 mb-8">
              {nodes.map((n,i)=>(
                <div key={n.label} className="flex items-center gap-1 flex-1">
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <motion.div animate={activeNode===i?{boxShadow:`0 0 24px ${n.col}80`}:{boxShadow:"none"}}
                      transition={{duration:.3}}
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{background:activeNode===i?n.col:`${n.col}18`,color:activeNode===i?"#fff":n.col,
                        border:`1.5px solid ${activeNode===i?n.col:`${n.col}30`}`}}>
                      {n.icon}
                    </motion.div>
                    <span style={{fontFamily:FONT,fontSize:9,color:"rgba(255,255,255,.4)",textAlign:"center",maxWidth:52,lineHeight:1.2}}>{n.label}</span>
                  </div>
                  {i<nodes.length-1&&(
                    <motion.div className="flex-1 h-px"
                      animate={{opacity:activeNode===i?[.3,1,.3]:.25}}
                      transition={{duration:.8,repeat:Infinity}}
                      style={{background:`linear-gradient(to right,${n.col},${nodes[i+1].col})`}}/>
                  )}
                </div>
              ))}
            </div>

            {/* Activity log */}
            <div className="rounded-2xl p-4" style={{background:"rgba(0,0,0,.2)"}}>
              <div className="text-xs font-bold mb-3 tracking-widest uppercase" style={{fontFamily:FONT,color:"rgba(255,255,255,.3)"}}>Live Activity</div>
              <div className="space-y-2.5">
                {logs.map((l,i)=>(
                  <motion.div key={i} initial={{opacity:0,x:-8}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.1}}
                    className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:l.col}}/>
                    <span style={{fontFamily:FONT,fontSize:12,color:"rgba(255,255,255,.65)",flex:1}}>{l.txt}</span>
                    <span style={{fontFamily:FONT,fontSize:10,color:"rgba(255,255,255,.28)",flexShrink:0}}>{l.t}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── 5. SAAS DEVELOPMENT — CTA-rich feature block ──────────────────────────────
function SolSaaS({ go }:{go:(p:Page)=>void}){
  const features=[
    {icon:<Target size={20}/>,title:"SaaS MVP Development",desc:"Ship your first product in weeks, not months."},
    {icon:<Brain size={20}/>,title:"Product Strategy",desc:"Roadmaps built around market fit and growth."},
    {icon:<Layers size={20}/>,title:"SaaS UI/UX Design",desc:"Interfaces users love from day one."},
    {icon:<Users size={20}/>,title:"User Dashboard",desc:"Self-service portals with full functionality."},
    {icon:<Shield size={20}/>,title:"Admin Dashboard",desc:"Complete control panel for your team."},
    {icon:<Zap size={20}/>,title:"Subscription & Payments",desc:"Stripe/Paddle integration, done right."},
    {icon:<BarChart3 size={20}/>,title:"Analytics Dashboard",desc:"Real-time usage and revenue data."},
    {icon:<Rocket size={20}/>,title:"Roadmap Planning",desc:"Post-launch growth strategy and feature planning."},
  ];

  return(
    <section id="saas" className="py-24 px-6" style={{background:T.white}}>
      <div className="max-w-[1280px] mx-auto">
        {/* Top: centered heading + description */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <SolNum n="05"/>
          <Eyebrow text="SaaS Product Development"/>
          <SH center>Turn ideas into scalable<br/><span style={{color:T.red}}>software products.</span></SH>
          <p className="mt-5 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
            From the initial concept to a production-ready SaaS platform — Axclade designs, engineers, and helps launch software products that attract users and generate recurring revenue.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((f,i)=>(
            <motion.div key={f.title}
              initial={{opacity:0,y:20,scale:.96}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true}} transition={{delay:i*.06,duration:.5}}
              whileHover={{y:-4,scale:1.02}}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{background:T.soft,border:`1px solid ${T.border}`}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${T.red}10`,color:T.red}}>{f.icon}</div>
              <div>
                <h4 style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy,marginBottom:4}}>{f.title}</h4>
                <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5}}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Banner CTA inside section */}
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="relative rounded-3xl overflow-hidden px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{background:T.navy}}>
          <Glow color={T.red} size={300} className="-top-20 -left-10"/>
          <Glow color={T.blue} size={200} className="bottom-0 right-20"/>
          <div className="relative z-10">
            <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.4rem,2.5vw,1.9rem)",color:"#fff",lineHeight:1.2}}>
              Ready to build your SaaS product?
            </h3>
            <p className="mt-2" style={{fontFamily:FONT,fontSize:14,color:"rgba(255,255,255,.5)"}}>
              Let's turn your idea into a production-ready platform.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0 relative z-10 flex-wrap">
            <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }} glow>Build My SaaS Product <ArrowRight size={13}/></BtnPrimary>
            <BtnOutline dark onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>Book a Call</BtnOutline>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Final custom project CTA ───────────────────────────────────────────────────
function SolFinalCTA({ go }:{go:(p:Page)=>void}){
  return(
    <section className="py-24 px-6" style={{background:T.soft}}>
      <div className="max-w-[900px] mx-auto text-center">
        <motion.div initial={{opacity:0,scale:.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.6}}>
          <div className="w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{background:`linear-gradient(135deg,${T.red},#4361EE)`,boxShadow:`0 0 40px ${T.red}45`}}>
            <Cpu size={28} className="text-white"/>
          </div>
          <Eyebrow text="Custom Solutions"/>
          <SH center>Need a custom digital solution?</SH>
          <p className="mt-5 text-base leading-relaxed max-w-lg mx-auto" style={{fontFamily:FONT,color:T.muted}}>
            For businesses that need something beyond a standard package — websites, apps, software, AI systems, or full SaaS platforms — Axclade delivers complete digital product development.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }} large glow>
              Discuss a Custom Project <ArrowRight size={14}/>
            </BtnPrimary>
            <BtnOutline onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>
              Book a Free Consultation
            </BtnOutline>
          </div>
          {/* Solution type tags */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {["Websites","Mobile Apps","Custom Software","AI Automation","SaaS Products","CRM Systems","Booking Systems","Dashboards"].map(t=>(
              <span key={t} style={{fontFamily:FONT,fontWeight:600,fontSize:12,color:T.navy,
                padding:"6px 14px",background:T.white,border:`1px solid ${T.border}`,borderRadius:99}}>{t}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Hero visual for Solutions page ────────────────────────────────────────────
function SolHeroVisual(){
  return(
    <div className="relative w-full h-[420px] flex items-center justify-center mt-8 lg:mt-0">
      <Glow color={T.red} size={300} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
      <Glow color={T.blue} size={220} className="top-4 right-4"/>

      {/* Central panel */}
      <motion.div animate={{y:[-6,6,-6]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}
        className="relative z-10 rounded-2xl p-5 w-72"
        style={{background:"rgba(255,255,255,.88)",backdropFilter:"blur(20px)",border:`1px solid rgba(255,255,255,.95)`,boxShadow:"0 20px 72px rgba(10,19,48,.14)"}}>
        <div className="flex items-center justify-between mb-4">
          <span style={{fontFamily:FONT,fontWeight:700,fontSize:12,color:T.navy}}>Project Dashboard</span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{background:"#22C55E12",border:"1px solid #22C55E25"}}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:"#22C55E"}}/>
            <span style={{fontFamily:FONT,fontSize:10,fontWeight:700,color:"#16A34A"}}>LIVE</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[["12","Active Projects",T.blue],["98%","On Schedule","#22C55E"],["4.9★","Avg. Rating",T.red],["< 14d","Avg. Delivery","#8B5CF6"]].map(([v,l,c])=>(
            <div key={l as string} className="rounded-xl p-2.5" style={{background:`${c as string}0D`}}>
              <div style={{fontFamily:FONT,fontWeight:800,fontSize:16,color:c as string,lineHeight:1}}>{v as string}</div>
              <div style={{fontFamily:FONT,fontSize:10,color:T.muted,marginTop:3}}>{l as string}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-3" style={{background:`${T.navy}06`,border:`1px solid ${T.navy}0F`}}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:`linear-gradient(135deg,${T.red},#4361EE)`}}>
            <Bot size={16} className="text-white"/>
          </div>
          <div>
            <div style={{fontFamily:FONT,fontWeight:700,fontSize:11,color:T.navy}}>AI Build Assistant</div>
            <div style={{fontFamily:FONT,fontSize:10,color:T.muted}}>Reviewing your project scope...</div>
          </div>
        </div>
      </motion.div>

      {/* Floating labels */}
      {[
        {v:"Web",col:T.blue,pos:"top-4 left-4"},
        {v:"Apps",col:"#8B5CF6",pos:"top-4 right-4"},
        {v:"SaaS",col:T.red,pos:"bottom-20 left-2"},
        {v:"AI",col:"#F59E0B",pos:"bottom-20 right-2"},
      ].map(p=>(
        <motion.div key={p.v} animate={{y:[0,-5,0]}} transition={{duration:3+Math.random()*2,repeat:Infinity}}
          className={`absolute z-20 rounded-2xl px-4 py-2.5 ${p.pos}`}
          style={{background:"rgba(255,255,255,.88)",backdropFilter:"blur(12px)",border:`1px solid ${T.border}`,boxShadow:"0 4px 20px rgba(10,19,48,.1)"}}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:`${p.col}14`,color:p.col}}>
              <Check size={10}/>
            </div>
            <span style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy}}>{p.v}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SolutionsHeroComposition(){
  return(
    <div className="relative w-full h-[560px] flex items-center justify-center mt-8 lg:mt-0">
      <Glow color={T.red} size={320} className="top-1/2 right-16 -translate-y-1/2"/>
      <Glow color={T.blue} size={260} className="bottom-10 left-8"/>
      <motion.div
        initial={{opacity:0,scale:.96,y:14}}
        animate={{opacity:1,scale:1,y:0}}
        transition={{duration:.7,delay:.08}}
        className="relative z-10 w-[130%] max-w-[1040px] -ml-[8%] pointer-events-none"
      >
        <img
          src={solutionsHeroComposition}
          alt="Business growth solutions composition"
          style={{
            width:"100%",
            objectFit:"contain",
            filter:"drop-shadow(0 34px 72px rgba(10,19,48,.12))",
            WebkitMaskImage:"radial-gradient(circle at center, rgba(0,0,0,1) 56%, rgba(0,0,0,.92) 68%, rgba(0,0,0,.42) 82%, transparent 96%)",
            maskImage:"radial-gradient(circle at center, rgba(0,0,0,1) 56%, rgba(0,0,0,.92) 68%, rgba(0,0,0,.42) 82%, transparent 96%)",
          }}
        />
      </motion.div>
    </div>
  );
}

function SolutionsPage({ go }:{go:(p:Page)=>void}){
  return(
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden"
        style={{background:`linear-gradient(160deg,${T.soft} 0%,#EAEEf8 100%)`}}>
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{duration:.65}}>
            <Chip color={T.red}><Sparkles size={10}/> Digital Solutions</Chip>
            <h1 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2.4rem,5vw,3.8rem)",color:T.navy,lineHeight:1.08,letterSpacing:"-.6px",marginTop:16}}>
              Advanced Digital Solutions For<br/><span style={{color:T.red}}>Businesses Ready To Scale</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Axclade provides custom digital systems that support marketing performance, operational efficiency, and long-term growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }} large>
                Discuss a Custom Project <ArrowRight size={14}/>
              </BtnPrimary>
              <BtnOutline onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>
                Book a Free Consultation
              </BtnOutline>
            </div>
            {/* Jump links */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[{label:"Web",href:"#web"},{label:"Apps",href:"#app"},{label:"Software",href:"#software"},{label:"AI Automation",href:"#ai"},{label:"SaaS",href:"#saas"}].map(l=>(
                <a key={l.label} href={l.href}
                  className="text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-70"
                  style={{background:`${T.navy}09`,color:T.navy,fontFamily:FONT,border:`1px solid ${T.border}`}}>
                  {l.label} ↓
                </a>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{duration:.65,delay:.1}}>
            <SolutionsHeroComposition/>
          </motion.div>
        </div>
      </section>

      {/* Five sections, each visually distinct */}
      <SolWeb go={go}/>
      <SolApp go={go}/>
      <SolSoftware go={go}/>
      <SolAI go={go}/>
      <SolSaaS go={go}/>
      <SolFinalCTA go={go}/>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INDUSTRIES PAGE — Full premium build
// ═══════════════════════════════════════════════════════════════════════════════
function IndustriesPage({ go }:{go:(p:Page)=>void}){
  const [active,setActive]=useState<string|null>(null);

  // Primary 7 industries with full content
  const primary=[
    {
      id:"restaurants",icon:<Utensils size={28}/>,col:"#F59E0B",
      name:"Restaurants & Cafes",
      headline:"Turn hungry browsers into loyal regulars.",
      desc:"Axclade builds complete digital growth systems for restaurants and cafes — combining local visibility, engaging content, targeted ads, and online ordering to bring customers through your door and keep them coming back.",
      challenge:"Most restaurants rely on word of mouth. That ceiling is low and unpredictable.",
      solution:"We build a system: local SEO to get found, ads to bring people in, content to build loyalty, and tracking to show you what works.",
      services:["Local SEO & Google Maps","Google Business Profile","Meta Ads & Instagram Ads","Branded Social Content","Online Ordering Integration","Review Generation System","WhatsApp Automation","Monthly Performance Report"],
      results:[{v:"+185%",l:"Walk-in Customers"},{v:"4.8★",l:"Avg Google Rating"},{v:"3×",l:"Online Orders"}],
      cta:"Grow My Restaurant",
      img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=480&fit=crop&auto=format",
    },
    {
      id:"salons",icon:<Scissors size={28}/>,col:"#EC4899",
      name:"Salons & Beauty Brands",
      headline:"Fill your appointment book — every week.",
      desc:"Beauty businesses win on reputation, visual brand, and convenience. Axclade builds your online presence so potential clients find you, trust you, and book you — on autopilot.",
      challenge:"Most salons rely on repeat clients and referrals. Growth stalls without a system to attract new bookings consistently.",
      solution:"We combine Instagram strategy, a professional booking website, local SEO, and Meta Ads to build a steady stream of new clients.",
      services:["Online Booking Website","Instagram Growth Strategy","Meta Ads Management","Local SEO Setup","Brand Identity Design","Story & Reel Content","Google Business Profile","Client Retention Automation"],
      results:[{v:"+220%",l:"New Bookings"},{v:"-40%",l:"No-Shows"},{v:"8×",l:"Instagram Growth"}],
      cta:"Grow My Beauty Business",
      img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&h=480&fit=crop&auto=format",
    },
    {
      id:"clinics",icon:<HeartPulse size={28}/>,col:T.red,
      name:"Dentists & Clinics",
      headline:"Build a patient pipeline that runs itself.",
      desc:"Patients search for healthcare providers online. If you're not appearing, you're losing business to competitors. Axclade builds the digital foundation that makes your practice the obvious choice.",
      challenge:"Healthcare providers often have no consistent digital lead generation system, depending solely on referrals.",
      solution:"We build a professional website, Google Ads campaigns, reputation management, and appointment automation that converts searchers into booked patients.",
      services:["Professional Medical Website","Google Search Ads","Local SEO & Map Pack","Appointment Booking System","Reputation & Review Management","Patient Follow-up Automation","Google Business Profile","Monthly Lead Report"],
      results:[{v:"+160%",l:"New Patients"},{v:"70%",l:"No-show Reduction"},{v:"4.9★",l:"Google Reviews"}],
      cta:"Grow My Clinic",
      img:"https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&h=480&fit=crop&auto=format",
    },
    {
      id:"gyms",icon:<Dumbbell size={28}/>,col:"#22C55E",
      name:"Gyms & Fitness Businesses",
      headline:"Turn leads into members — and members into advocates.",
      desc:"Fitness businesses need a constant flow of qualified leads and a system that converts them into paying members. Axclade builds the full acquisition and retention funnel for gyms, studios, and personal trainers.",
      challenge:"Most fitness brands spend on ads without a proper funnel — wasting budget on clicks that never become members.",
      solution:"We build a lead-capturing landing page, Meta & Google ad campaigns, a booking system, and WhatsApp follow-up automation to maximise every lead.",
      services:["Lead Generation Landing Page","Meta Ads Management","Google Ads Management","Membership Booking System","WhatsApp Lead Follow-up","Social Media Content","Referral Programme Setup","Monthly Growth Report"],
      results:[{v:"+300%",l:"Lead Volume"},{v:"+45%",l:"Membership Sign-ups"},{v:"2.4×",l:"Cost Per Member"}],
      cta:"Grow My Fitness Brand",
      img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&h=480&fit=crop&auto=format",
    },
    {
      id:"realestate",icon:<Building2 size={28}/>,col:T.blue,
      name:"Real Estate",
      headline:"Generate qualified property leads — at scale.",
      desc:"Real estate runs on leads. Axclade builds your digital pipeline: high-converting landing pages, paid ad campaigns, CRM follow-ups, and local SEO — so your pipeline is always full.",
      challenge:"Most agents rely on portals and referrals with no owned marketing system that generates leads consistently.",
      solution:"We create dedicated landing pages per property type, run targeted Meta & Google ads, and set up CRM automation to follow up every lead instantly.",
      services:["Property Landing Pages","Meta Ads (Buyers & Renters)","Google Search Ads","Local SEO Strategy","CRM Setup & Automation","Lead Follow-up Sequences","WhatsApp Integration","Monthly Lead Report"],
      results:[{v:"+240%",l:"Qualified Leads"},{v:"< 2min",l:"Lead Response Time"},{v:"+180%",l:"Viewing Bookings"}],
      cta:"Grow My Real Estate Business",
      img:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&h=480&fit=crop&auto=format",
    },
    {
      id:"ecommerce",icon:<ShoppingBag size={28}/>,col:"#8B5CF6",
      name:"E-commerce Brands",
      headline:"Scale your store with systems, not guesswork.",
      desc:"E-commerce growth is about traffic, conversion, and retention — working together. Axclade builds the complete system: ads that bring buyers, a store that converts, and emails that bring them back.",
      challenge:"Most e-commerce brands run ads without fixing conversion or retention, leading to high cost per acquisition and poor ROI.",
      solution:"We audit your entire funnel, launch Meta & Google shopping campaigns, build abandoned cart sequences, and optimise your store for conversion.",
      services:["Meta Ads Management","Google Shopping Ads","TikTok Ads","Email Marketing Automation","Abandoned Cart Sequences","Conversion Rate Optimisation","Product Catalog Setup","Weekly ROAS Reporting"],
      results:[{v:"+320%",l:"Monthly Revenue"},{v:"1.2%→4.8%",l:"Conv. Rate"},{v:"3.8×",l:"Average ROAS"}],
      cta:"Grow My Store",
      img:"https://images.unsplash.com/photo-1661956602944-249bcd04b63f?w=700&h=480&fit=crop&auto=format",
    },
    {
      id:"saas",icon:<Monitor size={28}/>,col:"#4361EE",
      name:"SaaS & B2B Companies",
      headline:"Build a predictable B2B lead generation engine.",
      desc:"B2B growth requires a different playbook: LinkedIn positioning, content authority, targeted outreach, and a funnel built for longer sales cycles. Axclade builds the demand generation system for software and service companies.",
      challenge:"Most B2B companies rely on referrals and cold outreach without a scalable inbound lead engine.",
      solution:"We position your brand on LinkedIn, run ABM campaigns, create lead magnet content, and set up CRM automation to nurture every prospect through your funnel.",
      services:["LinkedIn Ads & ABM","B2B Landing Pages","Lead Magnet Creation","Content & SEO Strategy","Google Search Ads","CRM Tracking Setup","Email Outreach Strategy","Monthly Pipeline Report"],
      results:[{v:"+200%",l:"Inbound Leads"},{v:"-50%",l:"Cost Per Lead"},{v:"+4×",l:"Pipeline Value"}],
      cta:"Generate B2B Leads",
      img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=480&fit=crop&auto=format",
    },
  ];

  // Quick-access extra industries
  const extra=[
    {icon:<Zap size={16}/>,name:"Local Services",col:"#F59E0B",desc:"Plumbers, electricians, cleaners, and local trades."},
    {icon:<Rocket size={16}/>,name:"Startups",col:T.blue,desc:"MVP websites, brand identity, and growth campaigns."},
    {icon:<Users size={16}/>,name:"Personal Brands",col:"#8B5CF6",desc:"LinkedIn authority, content strategy, email lists."},
    {icon:<Briefcase size={16}/>,name:"Consultants & Agencies",col:T.red,desc:"Lead gen, positioning, and B2B marketing systems."},
    {icon:<Globe size={16}/>,name:"Food & Beverage Brands",col:"#22C55E",desc:"Product brands, DTC growth, Amazon, and retail."},
    {icon:<LineChart size={16}/>,name:"Financial Services",col:"#4361EE",desc:"Trust-building, lead generation, and compliance-safe marketing."},
  ];

  const activeInd = primary.find(p=>p.id===active);

  return(
    <>
      {/* HERO */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden"
        style={{background:`linear-gradient(160deg,${T.soft} 0%,#EAEEf8 100%)`}}>
        <Glow color={T.red} size={500} className="-top-40 -right-24"/>
        <Glow color={T.blue} size={400} className="-bottom-28 -left-16"/>
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{backgroundImage:`radial-gradient(circle,${T.navy}12 1px,transparent 1px)`,backgroundSize:"38px 38px"}}/>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="text-center max-w-3xl mx-auto">
            <Chip color={T.red}><Sparkles size={10}/> Industries We Serve</Chip>
            <h1 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2.4rem,5vw,3.8rem)",color:T.navy,lineHeight:1.08,letterSpacing:"-.6px",marginTop:16}}>
              Digital Growth Solutions For<br/><span style={{color:T.red}}>Every Industry</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Axclade helps local businesses, e-commerce brands, B2B companies, restaurants, clinics, service providers, and technology companies build smarter digital growth systems.
            </p>
          </motion.div>

          {/* Industry quick-nav pills */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.5}}
            className="mt-10 flex flex-wrap gap-2.5 justify-center">
            {primary.map(ind=>(
              <button key={ind.id}
                onClick={()=>{
                  setActive(a=>a===ind.id?null:ind.id);
                  setTimeout(()=>document.getElementById(`ind-${ind.id}`)?.scrollIntoView({behavior:"smooth",block:"start"}),100);
                }}
                className="flex items-center gap-2 rounded-full text-sm font-bold transition-all hover:scale-[1.03]"
                style={{padding:"10px 20px",fontFamily:FONT,
                  background:active===ind.id?ind.col:`rgba(255,255,255,.8)`,
                  color:active===ind.id?"#fff":T.navy,
                  border:active===ind.id?`2px solid ${ind.col}`:`1px solid ${T.border}`,
                  backdropFilter:"blur(12px)",
                  boxShadow:active===ind.id?`0 4px 20px ${ind.col}38`:"0 2px 12px rgba(10,19,48,.06)"}}>
                <span style={{color:active===ind.id?"#fff":ind.col}}>{React.cloneElement(ind.icon,{size:15})}</span>
                {ind.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-8 px-6" style={{background:T.white,borderBottom:`1px solid ${T.border}`}}>
        <div className="max-w-[1280px] mx-auto flex flex-wrap gap-8 justify-center items-center">
          {[["7+","Industries Served"],["120+","Clients Across Sectors"],["$4M+","Revenue Generated"],["95%","Client Retention"],["4.9★","Average Rating"]].map(([v,l])=>(
            <div key={l} className="text-center">
              <div style={{fontFamily:FONT,fontWeight:800,fontSize:22,color:T.navy,lineHeight:1}}>{v}</div>
              <div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRIMARY INDUSTRY CARDS */}
      <section className="py-20 px-6" style={{background:T.soft}}>
        <div className="max-w-[1280px] mx-auto space-y-8">
          {primary.map((ind,i)=>{
            const isEven=i%2===0;
            const isHighlight=i===1; // Salons highlighted as dark card

            return(
              <motion.div key={ind.id} id={`ind-${ind.id}`}
                initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}} transition={{duration:.6,delay:.08}}
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background:isHighlight?T.navy:T.white,
                  border:isHighlight?`2px solid ${ind.col}`:`1px solid ${T.border}`,
                  boxShadow:isHighlight?`0 20px 72px ${T.navy}30`:`0 6px 40px rgba(10,19,48,.06)`,
                }}>

                {isHighlight&&<Glow color={ind.col} size={400} className="-top-20 right-1/4"/>}

                <div className={`grid lg:grid-cols-2 ${!isEven?"":""}`}>
                  {/* Image panel */}
                  <div className={`relative overflow-hidden ${!isEven?"lg:order-2":""}`} style={{minHeight:340}}>
                    <img src={ind.img} alt={ind.name} className="w-full h-full object-cover absolute inset-0"
                      style={{filter:isHighlight?"brightness(.7)":"none"}}/>
                    <div className="absolute inset-0" style={{background:isHighlight?`${ind.col}28`:`${T.navy}30`}}/>

                    {/* Industry badge */}
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
                        style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(16px)"}}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:`${ind.col}15`,color:ind.col}}>
                          {React.cloneElement(ind.icon,{size:18})}
                        </div>
                        <span style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy}}>{ind.name}</span>
                      </div>
                    </div>

                    {/* Result chips floating on image */}
                    <div className="absolute bottom-6 left-6 right-6 flex gap-2 flex-wrap">
                      {ind.results.map(r=>(
                        <div key={r.l} className="rounded-xl px-3 py-2"
                          style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(12px)"}}>
                          <div style={{fontFamily:FONT,fontWeight:800,fontSize:16,color:ind.col,lineHeight:1}}>{r.v}</div>
                          <div style={{fontFamily:FONT,fontSize:10,color:T.muted,marginTop:2}}>{r.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content panel */}
                  <div className={`p-10 lg:p-12 flex flex-col justify-center ${!isEven?"lg:order-1":""}`}>
                    {/* Number */}
                    <div className="text-xs font-black tracking-widest mb-3"
                      style={{fontFamily:FONT,color:isHighlight?`${ind.col}80`:`${T.navy}22`}}>
                      {String(i+1).padStart(2,"0")}
                    </div>

                    <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.5rem,2.5vw,2rem)",
                      color:isHighlight?"#fff":T.navy,letterSpacing:"-.4px",lineHeight:1.15,marginBottom:8}}>
                      {ind.headline}
                    </h2>

                    <p style={{fontFamily:FONT,fontSize:14,lineHeight:1.7,
                      color:isHighlight?"rgba(255,255,255,.58)":T.muted,marginBottom:20}}>
                      {ind.desc}
                    </p>

                    {/* Challenge / Solution mini cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[{label:"Challenge",text:ind.challenge,col:"#F59E0B"},{label:"Solution",text:ind.solution,col:"#22C55E"}].map(cs=>(
                        <div key={cs.label} className="rounded-2xl p-4"
                          style={{background:isHighlight?`rgba(255,255,255,.07)`:`${cs.col}08`,border:`1px solid ${cs.col}20`}}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:cs.col}}/>
                            <span style={{fontFamily:FONT,fontWeight:700,fontSize:10,color:cs.col,letterSpacing:".1em",textTransform:"uppercase" as const}}>
                              {cs.label}
                            </span>
                          </div>
                          <p style={{fontFamily:FONT,fontSize:11,color:isHighlight?"rgba(255,255,255,.55)":T.muted,lineHeight:1.5}}>
                            {cs.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Service list */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-7">
                      {ind.services.map(s=>(
                        <div key={s} className="flex items-center gap-2 text-xs"
                          style={{fontFamily:FONT,color:isHighlight?"rgba(255,255,255,.65)":T.navy}}>
                          <Check size={11} style={{color:ind.col,flexShrink:0}}/>{s}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <motion.button
                        onClick={()=>{ go("contact"); window.scrollTo(0,0); }}
                        whileHover={{scale:1.04,boxShadow:`0 0 24px ${ind.col}50`}}
                        className="inline-flex items-center gap-2 rounded-full font-bold text-white text-sm"
                        style={{padding:"13px 28px",fontFamily:FONT,background:ind.col,boxShadow:`0 4px 18px ${ind.col}35`}}>
                        {ind.cta} <ArrowRight size={13}/>
                      </motion.button>
                      <BtnOutline onClick={()=>{ go("packages"); window.scrollTo(0,0); }}>
                        View Packages
                      </BtnOutline>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* EXTRA INDUSTRIES GRID */}
      <section className="py-20 px-6" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <Eyebrow text="More Industries"/>
            <SH center>We Also Work With</SH>
            <p className="mt-3 max-w-lg mx-auto" style={{fontFamily:FONT,fontSize:14,color:T.muted}}>
              Axclade serves businesses across many more sectors. If your industry isn't listed, reach out — we've likely solved a similar challenge.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extra.map((e,i)=>(
              <motion.div key={e.name}
                initial={{opacity:0,y:16,scale:.97}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true}} transition={{delay:i*.07,duration:.5}}
                whileHover={{y:-4,scale:1.02}}
                className="flex items-start gap-4 rounded-2xl p-6 cursor-default"
                style={{background:T.soft,border:`1px solid ${T.border}`}}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{background:`${e.col}12`,color:e.col}}>
                  {e.icon}
                </div>
                <div>
                  <h3 style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:T.navy,marginBottom:5}}>{e.name}</h3>
                  <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5}}>{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL STRIP */}
      <section className="py-14 px-6" style={{background:T.soft,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {q:"Axclade tripled our online orders in 90 days. Their local SEO and Meta Ads work is extraordinary.",name:"Marco T.",role:"Owner, DinePro Restaurant",ind:"Restaurants",col:"#F59E0B"},
              {q:"We went from 20 new patients a month to over 70. The appointment funnel they built runs completely automatically.",name:"Dr. Priya S.",role:"Principal, Vero Dental",ind:"Clinics",col:T.red},
              {q:"Our Shopify store went from 1.2% to 4.8% conversion rate. The email automations alone paid for the whole engagement.",name:"James K.",role:"Founder, Lumio Shop",ind:"E-commerce",col:"#8B5CF6"},
            ].map(t=>(
              <Glass key={t.name} className="p-7 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold rounded-full px-3 py-1"
                    style={{background:`${t.col}12`,color:t.col,fontFamily:FONT}}>{t.ind}</span>
                  <div className="flex gap-0.5 ml-auto">{[...Array(5)].map((_,j)=><Star key={j} size={11} fill={T.red} stroke="none"/>)}</div>
                </div>
                <p className="flex-1 text-sm leading-relaxed" style={{fontFamily:FONT,color:T.navy}}>"{t.q}"</p>
                <div className="pt-4 border-t" style={{borderColor:T.border}}>
                  <div style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy}}>{t.name}</div>
                  <div style={{fontFamily:FONT,fontSize:11,color:T.muted,marginTop:2}}>{t.role}</div>
                </div>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6" style={{background:T.white}}>
        <div className="max-w-[820px] mx-auto text-center">
          <motion.div initial={{opacity:0,scale:.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.6}}>
            <Eyebrow text="Find Your Growth System"/>
            <SH center>Find the right growth system<br/><span style={{color:T.red}}>for your industry.</span></SH>
            <p className="mt-5 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Every industry has different growth levers. Book a free 30-minute consultation and we'll identify exactly which digital systems will move the needle for your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }} large glow>
                Book Free Industry Consultation <ArrowRight size={14}/>
              </BtnPrimary>
              <BtnOutline onClick={()=>{ go("packages"); window.scrollTo(0,0); }}>
                View Growth Packages
              </BtnOutline>
            </div>
            {/* Industry chips */}
            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              {primary.map(ind=>(
                <span key={ind.id} className="inline-flex items-center gap-1.5 rounded-full text-xs font-semibold"
                  style={{padding:"6px 14px",fontFamily:FONT,background:`${ind.col}0E`,color:ind.col,border:`1px solid ${ind.col}22`}}>
                  {React.cloneElement(ind.icon,{size:11})}{ind.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESS PAGE — Premium roadmap layout
// ═══════════════════════════════════════════════════════════════════════════════
function ProcessPage({ go }:{go:(p:Page)=>void}){
  const [viewed,setViewed]=useState<Set<number>>(new Set());

  const steps=[
    {
      n:"01",title:"Discover",sub:"Business Audit",
      icon:<Target size={28}/>,accentCol:"#4361EE",
      headline:"We map your entire digital landscape.",
      desc:"Before building anything, we need to understand everything. We conduct a comprehensive business audit covering your current digital presence, competitors, audience, goals, budget, and growth opportunities.",
      detail:"Every strategy we build is grounded in real data — not assumptions. This phase typically takes 2–3 business days and results in a complete picture of where you are and where you need to go.",
      items:[
        {label:"Business & Goals Review",desc:"We understand what you sell, who buys it, and what success looks like to you."},
        {label:"Competitor Analysis",desc:"We map your top 5 competitors' digital strategy, strengths, and weaknesses."},
        {label:"Target Audience Mapping",desc:"We define your ideal customer profile with demographics, behaviour, and intent."},
        {label:"Current Digital Audit",desc:"We review your website, social channels, ad accounts, SEO, and tracking."},
        {label:"Growth Opportunity Identification",desc:"We identify the fastest and highest-leverage paths to your growth goals."},
      ],
      output:"Full business audit report delivered within 48 hours.",
      outputIcon:<BarChart3 size={16}/>,
    },
    {
      n:"02",title:"Strategy",sub:"Growth Roadmap",
      icon:<Brain size={28}/>,accentCol:"#8B5CF6",
      headline:"Your bespoke digital growth roadmap.",
      desc:"Based on the discovery findings, we design a tailored digital growth strategy. This is your roadmap — channel by channel, month by month — built around your specific business model, market, and goals.",
      detail:"We don't sell generic solutions. Every strategy recommendation is justified by your discovery data and benchmarked against real industry performance.",
      items:[
        {label:"Channel Selection",desc:"We recommend exactly which platforms and channels will deliver the best ROI for your business."},
        {label:"Budget Allocation Strategy",desc:"We plan how to distribute your budget across channels for maximum growth velocity."},
        {label:"Content & Creative Direction",desc:"We define the messaging, visuals, and content types that will resonate with your audience."},
        {label:"KPI & Success Metrics",desc:"We agree on the exact numbers we'll measure — leads, conversion rate, ROAS, retention."},
        {label:"90-Day Growth Roadmap",desc:"A phased, prioritised plan with clear milestones for each month of the engagement."},
      ],
      output:"Complete 90-day digital growth strategy document.",
      outputIcon:<Target size={16}/>,
    },
    {
      n:"03",title:"Build",sub:"Marketing Assets & Systems",
      icon:<Layers size={28}/>,accentCol:T.red,
      headline:"We engineer your complete growth infrastructure.",
      desc:"This is where the strategy becomes reality. We design and build every digital asset and system your growth engine needs — from websites and funnels to ad accounts, automations, and tracking.",
      detail:"Every asset we build is tested before anything goes live. We don't launch until every component is working exactly as intended.",
      items:[
        {label:"Website or Landing Page",desc:"High-converting, fast, mobile-optimised pages built to turn visitors into leads."},
        {label:"Ad Account Setup",desc:"Meta, Google, LinkedIn, or TikTok accounts configured with the right campaign architecture."},
        {label:"Automation Workflows",desc:"AI-powered lead follow-up, email sequences, CRM integrations, and WhatsApp automation."},
        {label:"Brand & Creative Assets",desc:"Ad creatives, social content, copy, and visuals crafted for your audience."},
        {label:"Tracking & Analytics Setup",desc:"Pixels, conversion events, Google Analytics 4, and custom dashboards fully configured."},
      ],
      output:"All assets built and reviewed before go-live.",
      outputIcon:<Zap size={16}/>,
    },
    {
      n:"04",title:"Launch",sub:"Campaigns & Tracking",
      icon:<Rocket size={28}/>,accentCol:"#22C55E",
      headline:"We activate your growth system with precision.",
      desc:"Launch day is not a gamble — it's a coordinated activation. We go live with campaigns, automation, and tracking only after every element has been verified and tested.",
      detail:"In the first 72 hours, we monitor every campaign closely, making real-time adjustments to ensure your budget is working from day one.",
      items:[
        {label:"Campaign Activation",desc:"All ad campaigns go live on the agreed date with initial budgets and targeting configured."},
        {label:"Tracking Verification",desc:"Every pixel, conversion event, and goal is confirmed working across all platforms."},
        {label:"Systems Go-Live",desc:"Website, booking system, CRM, automations, and integrations all activated simultaneously."},
        {label:"Initial 72hr Performance Check",desc:"We monitor closely in the first 3 days and fix any issues immediately."},
        {label:"Client Walkthrough",desc:"We walk you through every live system so you know exactly what's running and why."},
      ],
      output:"Full launch report with first 72-hour performance summary.",
      outputIcon:<Activity size={16}/>,
    },
    {
      n:"05",title:"Optimise",sub:"Performance Improvements",
      icon:<LineChart size={28}/>,accentCol:"#F59E0B",
      headline:"We compound your results through continuous improvement.",
      desc:"Growth doesn't stop at launch — it starts there. Our optimisation process is systematic and data-driven. Every week, we review performance and make targeted improvements across the entire system.",
      detail:"Our clients typically see a 30–60% improvement in campaign efficiency within the first 60 days of optimisation — as the algorithms learn and our refinements take effect.",
      items:[
        {label:"Weekly Performance Review",desc:"Every week we analyse results, identify trends, and action the highest-priority improvements."},
        {label:"A/B Testing",desc:"Continuous creative, copy, and audience testing to find the highest-performing combinations."},
        {label:"Campaign Budget Adjustments",desc:"We shift budget to what's working and pause or fix what's not, in real time."},
        {label:"Creative Refreshes",desc:"New ad creatives produced regularly to prevent fatigue and maintain engagement rates."},
        {label:"Monthly Report & Call",desc:"A comprehensive monthly performance review with clear results, learnings, and next steps."},
      ],
      output:"Monthly optimisation report + recorded strategy review call.",
      outputIcon:<Shield size={16}/>,
    },
    {
      n:"06",title:"Scale",sub:"Growth Expansion",
      icon:<TrendingUp size={28}/>,accentCol:T.blue,
      headline:"We expand what works — systematically.",
      desc:"Once your core system is performing, we work with you to scale. This means expanding into new channels, increasing budgets intelligently, building advanced automation, and growing your digital infrastructure.",
      detail:"Scaling is not just spending more — it's knowing what to scale, when, and how. Our data-driven approach ensures every growth decision is justified by performance, not guesswork.",
      items:[
        {label:"Strategy Expansion",desc:"New channels, audiences, and campaigns added based on proven performance data."},
        {label:"Budget Scaling",desc:"Structured budget increases that maintain or improve ROAS as you spend more."},
        {label:"Advanced Automation",desc:"More sophisticated lead nurturing, segmentation, and personalisation systems added."},
        {label:"Technology Upgrades",desc:"New tools, integrations, and platforms introduced to support your growing operation."},
        {label:"Quarterly Roadmap Review",desc:"Every quarter we update your growth roadmap to reflect results, market changes, and new opportunities."},
      ],
      output:"Quarterly growth roadmap update + scale strategy session.",
      outputIcon:<Rocket size={16}/>,
    },
  ];

  // Step indicator colors per step
  const stepColors=["#4361EE","#8B5CF6",T.red,"#22C55E","#F59E0B",T.blue];

  return(
    <>
      {/* HERO */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden"
        style={{background:`linear-gradient(160deg,${T.soft} 0%,#EAEEf8 100%)`}}>
        <Glow color={T.red} size={450} className="-top-32 -right-20"/>
        <Glow color={T.blue} size={350} className="-bottom-20 -left-16"/>
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{backgroundImage:`radial-gradient(circle,${T.navy}12 1px,transparent 1px)`,backgroundSize:"38px 38px"}}/>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}
            className="max-w-3xl mx-auto text-center">
            <Chip color={T.red}><Sparkles size={10}/> Our Process</Chip>
            <h1 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2.4rem,5vw,3.8rem)",color:T.navy,lineHeight:1.08,letterSpacing:"-.6px",marginTop:16}}>
              A Proven Process Built<br/><span style={{color:T.red}}>Around Growth</span>
            </h1>
            <p className="mt-5 text-lg max-w-2xl mx-auto leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Axclade follows a structured process designed to understand your business, build the right system, launch with clarity, and optimise for long-term growth.
            </p>
          </motion.div>

          {/* Horizontal step progress map */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.5}}
            className="mt-14 max-w-4xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Connector line */}
              <div className="absolute top-5 left-8 right-8 h-px" style={{background:T.border}}/>
              {steps.map((s,i)=>(
                <div key={s.n} className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 bg-white"
                    style={{fontFamily:FONT,color:stepColors[i],borderColor:stepColors[i],boxShadow:`0 0 0 4px white`}}>
                    {s.n}
                  </div>
                  <span className="text-xs font-bold hidden sm:block" style={{fontFamily:FONT,color:T.navy}}>{s.title}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE STEPS */}
      <section className="py-20 px-6 relative" style={{background:T.white}}>
        {/* Vertical connector */}
        <div className="hidden lg:block absolute left-1/2 top-20 bottom-20 w-px -translate-x-1/2 pointer-events-none"
          style={{background:`linear-gradient(to bottom,transparent,${T.border} 8%,${T.border} 92%,transparent)`}}/>

        <div className="max-w-[1280px] mx-auto space-y-10">
          {steps.map((step,i)=>{
            const isRight=i%2!==0;
            const isDark=i===2; // Build step gets dark treatment
            const col=stepColors[i];

            return(
              <motion.div key={step.n}
                initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}}
                viewport={{once:true,margin:"-80px"}}
                onViewportEnter={()=>setViewed(v=>{const s=new Set(v);s.add(i);return s;})}
                transition={{duration:.65,ease:"easeOut"}}>

                <div className={`grid lg:grid-cols-2 gap-8 items-stretch ${isRight?"lg:rtl":""}`}>
                  {/* Card */}
                  <div className={isRight?"lg:ltr":""}>
                    <div className="relative rounded-3xl overflow-hidden h-full"
                      style={{
                        background:isDark?T.navy:T.white,
                        border:isDark?`2px solid ${col}`:`1px solid ${T.border}`,
                        boxShadow:isDark?`0 24px 72px ${T.navy}30,0 0 0 1px ${col}30`:`0 8px 48px rgba(10,19,48,.07)`,
                      }}>

                      {isDark&&<Glow color={col} size={300} className="-top-12 -right-12"/>}

                      {/* Top gradient accent */}
                      <div className="h-1 w-full" style={{background:`linear-gradient(90deg,${col},${i<5?stepColors[i+1]:col})`}}/>

                      <div className="p-8 lg:p-10 flex flex-col gap-6 relative z-10">
                        {/* Step header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                              style={{background:isDark?`${col}22`:` ${col}12`,color:col,boxShadow:isDark?`0 0 24px ${col}40`:"none"}}>
                              {step.icon}
                            </div>
                            <div>
                              <div style={{fontFamily:FONT,fontWeight:800,fontSize:13,letterSpacing:".12em",textTransform:"uppercase" as const,color:col}}>
                                Step {step.n}
                              </div>
                              <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.4rem,2.4vw,1.9rem)",color:isDark?"#fff":T.navy,lineHeight:1.15,letterSpacing:"-.3px"}}>
                                {step.title}
                              </h2>
                              <div style={{fontFamily:FONT,fontSize:12,color:isDark?"rgba(255,255,255,.4)":T.muted,marginTop:2}}>{step.sub}</div>
                            </div>
                          </div>
                          {/* Large number watermark */}
                          <div style={{fontFamily:FONT,fontWeight:900,fontSize:72,lineHeight:1,color:isDark?`${col}22`:`${T.navy}08`}}>{step.n}</div>
                        </div>

                        {/* Headline */}
                        <div className="rounded-2xl p-4" style={{background:isDark?`rgba(255,255,255,.06)`:`${col}08`,border:`1px solid ${col}18`}}>
                          <p style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:isDark?"#fff":T.navy,lineHeight:1.4}}>
                            "{step.headline}"
                          </p>
                        </div>

                        {/* Description */}
                        <p style={{fontFamily:FONT,fontSize:14,color:isDark?"rgba(255,255,255,.6)":T.muted,lineHeight:1.7}}>{step.desc}</p>

                        {/* Detail */}
                        <p style={{fontFamily:FONT,fontSize:13,color:isDark?"rgba(255,255,255,.42)":T.muted,lineHeight:1.6,fontStyle:"italic"}}>{step.detail}</p>

                        {/* Output badge */}
                        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 mt-auto"
                          style={{background:isDark?`rgba(255,255,255,.08)`:`${col}0C`,border:`1px solid ${col}20`}}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:`${col}18`,color:col}}>
                            {step.outputIcon}
                          </div>
                          <div>
                            <div style={{fontFamily:FONT,fontSize:10,fontWeight:700,color:col,letterSpacing:".1em",textTransform:"uppercase" as const}}>Deliverable</div>
                            <div style={{fontFamily:FONT,fontSize:12,color:isDark?"rgba(255,255,255,.65)":T.navy,marginTop:1}}>{step.output}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checklist panel */}
                  <div className={isRight?"lg:ltr":""}>
                    <div className="h-full rounded-3xl p-8 lg:p-10 flex flex-col gap-5"
                      style={{background:T.soft,border:`1px solid ${T.border}`}}>
                      <h3 style={{fontFamily:FONT,fontWeight:700,fontSize:15,color:T.navy,marginBottom:4}}>
                        What happens in this step:
                      </h3>
                      <div className="space-y-4 flex-1">
                        {step.items.map((item,fi)=>(
                          <motion.div key={item.label}
                            initial={{opacity:0,x:-12}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                            transition={{delay:.1+fi*.08,duration:.4}}
                            className="flex gap-3.5">
                            <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{background:`${col}15`,color:col}}>
                              <Check size={10}/>
                            </div>
                            <div>
                              <p style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy,marginBottom:3}}>{item.label}</p>
                              <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5}}>{item.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA at bottom of Build step */}
                      {isDark&&(
                        <div className="pt-4 mt-2 border-t" style={{borderColor:T.border}}>
                          <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>
                            Start With Axclade <ArrowRight size={13}/>
                          </BtnPrimary>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Connector dot between steps */}
                {i<steps.length-1&&(
                  <div className="flex justify-center mt-6 hidden lg:flex">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{background:stepColors[i+1]}}/>
                      <div className="w-px h-4" style={{background:`linear-gradient(to bottom,${stepColors[i]},${stepColors[i+1]})`}}/>
                      <div className="w-2 h-2 rounded-full" style={{background:stepColors[i+1]}}/>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PROCESS SUMMARY BAR */}
      <section className="py-12 px-6" style={{background:T.navy}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-0">
            {steps.map((s,i)=>(
              <React.Fragment key={s.n}>
                <div className="flex flex-col items-center gap-2 flex-1 text-center py-4 px-2">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{background:`${stepColors[i]}22`,color:stepColors[i]}}>
                    {React.cloneElement(s.icon,{size:18})}
                  </div>
                  <div style={{fontFamily:FONT,fontWeight:800,fontSize:13,color:"#fff"}}>{s.title}</div>
                  <div style={{fontFamily:FONT,fontSize:10,color:"rgba(255,255,255,.38)"}}>{s.sub}</div>
                </div>
                {i<steps.length-1&&(
                  <div className="hidden md:block w-8 h-px flex-shrink-0" style={{background:"rgba(255,255,255,.12)"}}/>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / COMMON QUESTIONS */}
      <section className="py-20 px-6" style={{background:T.soft}}>
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-10">
            <Eyebrow text="Common Questions"/>
            <SH center>Questions about <span style={{color:T.red}}>our process</span></SH>
          </div>
          <div className="space-y-3">
            {[
              {q:"How long does the entire process take to start producing results?",a:"Most clients begin seeing measurable results within 30–60 days of launch. SEO results typically take 60–90 days. Paid ads can show results within the first week. The full compounding effect of the system usually becomes visible between months 2 and 4."},
              {q:"What do I need to provide to get started?",a:"We need access to your existing assets (website, ad accounts, analytics), information about your business and goals, and your budget clarity. Our onboarding process guides you through everything step by step."},
              {q:"How involved do I need to be in the process?",a:"We designed the process to require minimal client time — typically 1–2 hours per week maximum. You'll have a monthly strategy call, and we handle everything else. You focus on running your business."},
              {q:"Is there a minimum contract length?",a:"We recommend a minimum 3-month engagement because digital growth systems need time to optimise and compound. Most of our clients see the biggest results between months 3 and 6."},
              {q:"What if things aren't working as expected?",a:"Our optimisation step (Step 5) is designed specifically for this. We review data every week, identify what's underperforming, and make targeted improvements. Transparency and honest communication are core to how we work."},
            ].map((faq,fi)=>{
              const [open,setOpen]=useState(false);
              return(
                <div key={fi} className="rounded-2xl overflow-hidden" style={{background:T.white,border:`1px solid ${T.border}`}}>
                  <button onClick={()=>setOpen(!open)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                    <span style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:T.navy}}>{faq.q}</span>
                    <motion.div animate={{rotate:open?45:0}} transition={{duration:.2}}
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:open?T.red:`${T.navy}09`,color:open?"#fff":T.navy}}>
                      <span style={{fontSize:16,lineHeight:1,marginTop:-1}}>+</span>
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {open&&(
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.22}}>
                        <p className="px-6 pb-5 text-sm leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6" style={{background:T.white}}>
        <div className="max-w-[860px] mx-auto">
          <motion.div initial={{opacity:0,scale:.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.6}}>
            <div className="relative rounded-3xl overflow-hidden px-10 py-16 text-center" style={{background:T.navy}}>
              <Glow color={T.red} size={400} className="-top-24 left-1/2 -translate-x-1/2"/>
              <Glow color={T.blue} size={300} className="bottom-0 right-0"/>
              <div className="absolute inset-0 pointer-events-none opacity-[.06]"
                style={{backgroundImage:`radial-gradient(circle,#fff 1px,transparent 1px)`,backgroundSize:"28px 28px"}}/>
              <div className="relative z-10">
                {/* Step dots recap */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {stepColors.map((c,i)=>(
                    <React.Fragment key={i}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold"
                        style={{background:`${c}22`,color:c,border:`1.5px solid ${c}40`,fontFamily:FONT}}>
                        {String(i+1).padStart(2,"0")}
                      </div>
                      {i<5&&<div className="w-6 h-px" style={{background:"rgba(255,255,255,.12)"}}/>}
                    </React.Fragment>
                  ))}
                </div>

                <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.8rem,4vw,2.8rem)",color:"#fff",letterSpacing:"-.5px",lineHeight:1.15}}>
                  Ready to start your<br/><span style={{color:T.red}}>growth process?</span>
                </h2>
                <p className="mt-4 max-w-md mx-auto" style={{fontFamily:FONT,fontSize:15,color:"rgba(255,255,255,.5)"}}>
                  Book a free consultation. We'll walk through your current digital situation and show you exactly how our process applies to your business.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }} large glow>
                    Book Free Consultation <ArrowRight size={14}/>
                  </BtnPrimary>
                  <BtnOutline dark onClick={()=>{ go("packages"); window.scrollTo(0,0); }}>
                    View Growth Packages
                  </BtnOutline>
                </div>
                <div className="mt-7 flex flex-wrap justify-center gap-6">
                  {["Free 30-min call","No commitment","Includes digital audit"].map(t=>(
                    <div key={t} className="flex items-center gap-2 text-sm" style={{color:"rgba(255,255,255,.42)",fontFamily:FONT}}>
                      <Check size={12} style={{color:T.red}}/>{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CASE STUDIES PAGE — Full premium build
// ═══════════════════════════════════════════════════════════════════════════════
function CaseStudiesPage({ go }:{go:(p:Page)=>void}){
  const [filter,setFilter]=useState("All");
  const [expanded,setExpanded]=useState<string|null>(null);

  const CATS=[
    {label:"All",col:T.navy},
    {label:"Local Business Growth",col:"#F59E0B"},
    {label:"E-commerce Growth",col:"#8B5CF6"},
    {label:"B2B Lead Generation",col:T.blue},
    {label:"Brand Development",col:"#EC4899"},
    {label:"Website Projects",col:T.red},
    {label:"AI Automation",col:"#22C55E"},
    {label:"Software Systems",col:"#4361EE"},
    {label:"SaaS Products",col:"#06B6D4"},
  ];

  const cases=[
    {
      id:"dinepro",cat:"Local Business Growth",catCol:"#F59E0B",
      title:"Restaurant Digital Growth System",industry:"Restaurant / Food Business",
      headline:"Weak online presence turned into a full customer acquisition engine.",
      challenge:"Weak online visibility, inconsistent branding, and no clear customer acquisition system. Customers couldn't find the restaurant online, reviews were mixed, and walk-ins were declining.",
      solution:"Website improvement, Google Business Profile optimisation, social media content, local SEO, ads setup, and tracking. We built a complete system from the ground up.",
      outcome:"Improved digital presence, customer trust, local visibility, and a consistent lead generation system that works without manual effort.",
      metrics:[{v:"3×",l:"Online Orders"},{v:"+185%",l:"Walk-in Customers"},{v:"4.8★",l:"Google Rating"},{v:"+220%",l:"Profile Views"}],
      services:["Website Development","Local SEO","Google Business Profile","Social Media Content","Meta Ads","Tracking Setup"],
      img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=520&fit=crop&auto=format",
      duration:"90 days",
      featured:true,
    },
    {
      id:"lumio",cat:"E-commerce Growth",catCol:"#8B5CF6",
      title:"Lumio Shop — E-commerce Revenue Scale",industry:"Fashion / E-commerce Brand",
      headline:"Low-converting store scaled to a high-performance sales machine.",
      challenge:"Shopify store had significant traffic but a 1.2% conversion rate, high cart abandonment, and no email retention system. Ad spend was wasted on traffic that never converted.",
      solution:"Full Shopify CRO audit, product page redesign, Meta Ads restructure, email automation with abandoned cart, welcome series, and win-back flows.",
      outcome:"Conversion rate increased from 1.2% to 4.8%. Monthly revenue grew by 120%. Email automation now generates 28% of total revenue passively.",
      metrics:[{v:"+120%",l:"Monthly Revenue"},{v:"4.8%",l:"Conv. Rate"},{v:"3.8×",l:"ROAS"},{v:"28%",l:"Email Revenue"}],
      services:["Meta Ads Management","Google Shopping","Email Automation","Abandoned Cart Flow","Conversion Optimisation","Product Page Redesign"],
      img:"https://images.unsplash.com/photo-1661956602944-249bcd04b63f?w=800&h=520&fit=crop&auto=format",
      duration:"60 days",
      featured:false,
    },
    {
      id:"nexus",cat:"B2B Lead Generation",catCol:T.blue,
      title:"Nexus Analytics — B2B Pipeline System",industry:"SaaS / B2B Analytics",
      headline:"Referral-dependent company built a scalable inbound lead engine.",
      challenge:"Nexus relied entirely on referrals for new clients. They had no LinkedIn presence, no content strategy, and no inbound funnel. Growth was unpredictable and capped.",
      solution:"LinkedIn company page rebuild, ABM campaign setup, lead magnet creation (industry benchmarking report), landing page optimisation, and CRM automation for lead nurturing.",
      outcome:"Monthly inbound leads increased by 200%. Cost per qualified lead dropped by 50%. The ABM campaign generated 14 enterprise conversations in the first 60 days.",
      metrics:[{v:"+200%",l:"Inbound Leads"},{v:"−50%",l:"Cost Per Lead"},{v:"14",l:"Enterprise Leads"},{v:"−60%",l:"Churn Rate"}],
      services:["LinkedIn Ads","ABM Campaigns","Lead Magnet Creation","Landing Page","CRM Automation","UI/UX Redesign"],
      img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=520&fit=crop&auto=format",
      duration:"120 days",
      featured:false,
    },
    {
      id:"vero",cat:"Brand Development",catCol:"#EC4899",
      title:"Vero Wellness — Brand & Growth System",industry:"Health & Wellness",
      headline:"Generic clinic brand transformed into a premium market leader.",
      challenge:"Vero had no consistent brand identity — different fonts, colours, and tone across every touchpoint. Potential clients couldn't distinguish them from competitors. Inquiry quality was low.",
      solution:"Complete brand identity system (logo, colours, typography, tone), website redesign, Instagram content strategy, and Meta Ads campaign for new patient acquisition.",
      outcome:"Inquiry volume increased by 180%. Premium brand perception attracted higher-value clients. Instagram grew from 800 to 6,200 followers in 4 months.",
      metrics:[{v:"+180%",l:"Inquiries"},{v:"9.4/10",l:"Brand Score"},{v:"7.7×",l:"Instagram Growth"},{v:"+65%",l:"Avg. Client Value"}],
      services:["Brand Identity Design","Website Redesign","Instagram Strategy","Meta Ads","Social Media Content","Reels Editing"],
      img:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=520&fit=crop&auto=format",
      duration:"75 days",
      featured:false,
    },
    {
      id:"fittrack",cat:"Website Projects",catCol:T.red,
      title:"FitTrack Pro — Fitness App Launch",industry:"Fitness / Health Tech",
      headline:"From idea to 4.8★ App Store product in 14 weeks.",
      challenge:"FitTrack Pro had an idea and a basic wireframe but no technical team, no design system, and no go-to-market strategy. They needed everything built from zero.",
      solution:"Full iOS & Android app design and development, brand identity, App Store optimisation, landing page, and launch campaign including Meta Ads and influencer coordination.",
      outcome:"App launched to a 4.8-star App Store rating with 2,400 downloads in the first 30 days. The landing page converts at 6.2% — well above industry average.",
      metrics:[{v:"+150%",l:"Month 2 Downloads"},{v:"4.8★",l:"App Store Rating"},{v:"6.2%",l:"Landing Conv."},{v:"2.4K",l:"Day-30 Users"}],
      services:["iOS App Development","Android App Development","UI/UX Design","Brand Identity","App Store Optimisation","Launch Campaign"],
      img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=520&fit=crop&auto=format",
      duration:"14 weeks",
      featured:false,
    },
    {
      id:"medquick",cat:"AI Automation",catCol:"#22C55E",
      title:"MedQuick Clinic — AI Appointment System",industry:"Healthcare / Dental",
      headline:"40 hours of manual admin work automated away every week.",
      challenge:"MedQuick's reception team spent 40+ hours per week on appointment calls, reminders, and follow-ups. No-show rate was 35%. Staff were overwhelmed and response times were slow.",
      solution:"AI chatbot for website and WhatsApp, automated appointment booking, SMS & WhatsApp reminder sequences, post-appointment follow-up flows, and CRM integration.",
      outcome:"Staff time saved: 40 hours per week. No-show rate dropped from 35% to 11%. New patient inquiries increased 60% as the chatbot handles them 24/7.",
      metrics:[{v:"40hrs",l:"Saved Per Week"},{v:"−70%",l:"No-show Rate"},{v:"+60%",l:"New Inquiries"},{v:"24/7",l:"Chatbot Active"}],
      services:["AI Chatbot","WhatsApp Automation","Appointment System","CRM Integration","SMS Reminders","Follow-up Flows"],
      img:"https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=520&fit=crop&auto=format",
      duration:"45 days",
      featured:false,
    },
    {
      id:"propflow",cat:"Software Systems",catCol:"#4361EE",
      title:"PropFlow — Real Estate CRM Platform",industry:"Real Estate",
      headline:"Custom CRM built that replaced 4 disconnected tools.",
      challenge:"A real estate group used 4 separate tools — spreadsheets, WhatsApp, a generic CRM, and email — that didn't talk to each other. Leads fell through the cracks and follow-up was inconsistent.",
      solution:"Custom CRM system with property listing management, lead pipeline tracking, automated WhatsApp/email follow-up, agent performance dashboards, and client portal.",
      outcome:"Lead-to-viewing conversion improved by 80%. Agent follow-up time reduced by 65%. The system now manages 400+ active leads across 12 agents seamlessly.",
      metrics:[{v:"+80%",l:"Lead Conversion"},{v:"−65%",l:"Follow-up Time"},{v:"400+",l:"Active Leads"},{v:"12",l:"Agents On Platform"}],
      services:["Custom CRM","Admin Dashboard","Lead Pipeline","WhatsApp Integration","Client Portal","Agent Analytics"],
      img:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=520&fit=crop&auto=format",
      duration:"10 weeks",
      featured:false,
    },
    {
      id:"clarafin",cat:"SaaS Products",catCol:"#06B6D4",
      title:"ClaraFin — Fintech SaaS MVP",industry:"Fintech / Financial Services",
      headline:"Concept to funded MVP in 16 weeks.",
      challenge:"A fintech founder had a validated idea for a personal finance dashboard but no technical co-founder, no design, and a tight seed budget. They needed an investor-ready MVP, fast.",
      solution:"Product strategy workshop, SaaS UI/UX design, full-stack MVP development with user and admin dashboards, Stripe subscription integration, onboarding flow, and analytics.",
      outcome:"MVP launched on schedule. Used to close a seed round. 320 beta users signed up in week one. Investors described the product as 'polished and production-ready'.",
      metrics:[{v:"16wks",l:"To Launch"},{v:"320",l:"Beta Users W1"},{v:"Seed",l:"Round Closed"},{v:"4.9★",l:"Beta Rating"}],
      services:["Product Strategy","SaaS UI/UX Design","Full-stack Development","Stripe Integration","Admin Dashboard","User Onboarding"],
      img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=520&fit=crop&auto=format",
      duration:"16 weeks",
      featured:false,
    },
  ];

  const shown=filter==="All"?cases:cases.filter(c=>c.cat===filter);
  const catObj=CATS.find(c=>c.label===filter)||CATS[0];

  return(
    <>
      {/* HERO */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden"
        style={{background:`linear-gradient(160deg,${T.soft} 0%,#EAEEf8 100%)`}}>
        <Glow color={T.red} size={480} className="-top-32 -right-20"/>
        <Glow color={T.blue} size={380} className="-bottom-20 -left-16"/>
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{backgroundImage:`radial-gradient(circle,${T.navy}12 1px,transparent 1px)`,backgroundSize:"38px 38px"}}/>

        <div className="max-w-[1280px] mx-auto relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
            <Chip color={T.red}><Sparkles size={10}/> Case Studies</Chip>
            <h1 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2.4rem,5vw,3.8rem)",color:T.navy,lineHeight:1.08,letterSpacing:"-.6px",marginTop:16}}>
              Digital Growth Systems<br/><span style={{color:T.red}}>In Action</span>
            </h1>
            <p className="mt-5 text-lg max-w-2xl mx-auto leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Explore how Axclade helps businesses improve digital presence, strengthen systems, and create better growth opportunities.
            </p>
          </motion.div>

          {/* Summary stats */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.5}}
            className="mt-10 flex flex-wrap gap-6 justify-center">
            {[["120+","Projects Delivered"],["8","Industry Categories"],["$4M+","Client Revenue Generated"],["4.9★","Average Project Rating"]].map(([v,l])=>(
              <div key={l} className="text-center">
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:22,color:T.navy,lineHeight:1}}>{v}</div>
                <div style={{fontFamily:FONT,fontSize:12,color:T.muted,marginTop:3}}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="py-8 px-6 sticky top-14 z-40 border-b"
        style={{background:"rgba(245,247,251,.95)",backdropFilter:"blur(16px)",borderColor:T.border}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATS.map(c=>(
              <motion.button key={c.label} onClick={()=>setFilter(c.label)}
                whileHover={{scale:1.04}} whileTap={{scale:.97}}
                className="rounded-full text-xs font-bold transition-all"
                style={{
                  padding:"8px 16px",fontFamily:FONT,
                  background:filter===c.label?c.col:`rgba(10,19,48,.06)`,
                  color:filter===c.label?"#fff":T.navy,
                  border:filter===c.label?`2px solid ${c.col}`:"2px solid transparent",
                  boxShadow:filter===c.label?`0 4px 18px ${c.col}38`:"none",
                }}>
                {c.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CASE STUDY (Restaurant — always shown at top) */}
      {(filter==="All"||filter==="Local Business Growth")&&(
        <section className="py-16 px-6" style={{background:T.white}}>
          <div className="max-w-[1280px] mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold rounded-full px-3 py-1.5"
                style={{background:`${T.red}12`,color:T.red,fontFamily:FONT}}>★ Featured Case Study</span>
              <span style={{fontFamily:FONT,fontSize:13,color:T.muted}}>Our most comprehensive project example</span>
            </div>

            {(() => {
              const c=cases[0];
              return(
                <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6}}
                  className="relative rounded-3xl overflow-hidden grid lg:grid-cols-2"
                  style={{background:T.navy,boxShadow:`0 24px 80px ${T.navy}35`,border:`2px solid ${c.catCol}30`}}>
                  <Glow color={c.catCol} size={400} className="-top-20 right-0"/>

                  {/* Image */}
                  <div className="relative min-h-[360px] overflow-hidden">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover absolute inset-0"
                      style={{filter:"brightness(.55)"}}/>
                    {/* Metric grid overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold"
                          style={{padding:"5px 12px",background:`${c.catCol}22`,color:c.catCol,border:`1px solid ${c.catCol}40`,fontFamily:FONT}}>
                          {c.cat}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {c.metrics.map(m=>(
                          <div key={m.l} className="rounded-2xl px-4 py-3"
                            style={{background:"rgba(255,255,255,.12)",backdropFilter:"blur(12px)"}}>
                            <div style={{fontFamily:FONT,fontWeight:800,fontSize:22,color:c.catCol,lineHeight:1}}>{m.v}</div>
                            <div style={{fontFamily:FONT,fontSize:10,color:"rgba(255,255,255,.6)",marginTop:3}}>{m.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-10 flex flex-col justify-center relative z-10">
                    <div style={{fontFamily:FONT,fontSize:11,color:"rgba(255,255,255,.4)",letterSpacing:".12em",textTransform:"uppercase" as const,marginBottom:8}}>{c.industry}</div>
                    <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.5rem,2.5vw,2rem)",color:"#fff",lineHeight:1.2,letterSpacing:"-.4px",marginBottom:8}}>
                      {c.title}
                    </h2>
                    <p style={{fontFamily:FONT,fontWeight:600,fontSize:14,color:c.catCol,marginBottom:16,lineHeight:1.4}}>{c.headline}</p>

                    <div className="space-y-4 mb-6">
                      {[{label:"Challenge",text:c.challenge,col:"#F59E0B"},{label:"Solution",text:c.solution,col:"#22C55E"},{label:"Outcome",text:c.outcome,col:c.catCol}].map(row=>(
                        <div key={row.label}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-2 h-2 rounded-full" style={{background:row.col}}/>
                            <span style={{fontFamily:FONT,fontWeight:700,fontSize:11,color:row.col,letterSpacing:".1em",textTransform:"uppercase" as const}}>{row.label}</span>
                          </div>
                          <p style={{fontFamily:FONT,fontSize:13,color:"rgba(255,255,255,.58)",lineHeight:1.55,paddingLeft:14}}>{row.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-7">
                      {c.services.map(s=>(
                        <span key={s} style={{fontFamily:FONT,fontSize:11,padding:"4px 10px",borderRadius:99,
                          background:"rgba(255,255,255,.09)",color:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.12)"}}>{s}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }}>
                        Start a Similar Project <ArrowRight size={13}/>
                      </BtnPrimary>
                      <span style={{fontFamily:FONT,fontSize:12,color:"rgba(255,255,255,.35)"}}>Completed in {c.duration}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </section>
      )}

      {/* CASE STUDY GRID */}
      <section className="py-8 pb-20 px-6" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto">
          {/* Result count */}
          <div className="flex items-center justify-between mb-8">
            <p style={{fontFamily:FONT,fontSize:13,color:T.muted}}>
              Showing <strong style={{color:T.navy}}>{shown.filter(c=>!c.featured||filter!=="All").length}</strong> case {shown.length===1?"study":"studies"}
              {filter!=="All"&&<> in <span style={{color:catObj.col,fontWeight:700}}> {filter}</span></>}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={filter}
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.22}}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {shown.filter(c=>!(c.featured&&filter==="All")).map((c,i)=>{
                const isOpen=expanded===c.id;
                return(
                  <motion.div key={c.id}
                    layout
                    initial={{opacity:0,y:24,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,scale:.97}}
                    transition={{delay:i*.07,duration:.45}}
                    whileHover={!isOpen?{y:-5,transition:{duration:.2}}:{}}
                    className="group rounded-3xl overflow-hidden flex flex-col cursor-pointer"
                    style={{background:T.white,border:isOpen?`2px solid ${c.catCol}`:`1px solid ${T.border}`,
                      boxShadow:isOpen?`0 16px 56px ${c.catCol}20`:"0 4px 24px rgba(10,19,48,.06)",
                      transition:"box-shadow .3s,border .3s"}}>

                    {/* Image */}
                    <div className="relative overflow-hidden" style={{height:200,background:"#F5F7FB"}}>
                      <img src={c.img} alt={c.title}
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"/>
                      <div className="absolute inset-0" style={{background:`${T.navy}32`}}/>

                      {/* Category chip */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold"
                          style={{padding:"4px 10px",fontFamily:FONT,background:`${c.catCol}22`,color:c.catCol,
                            border:`1px solid ${c.catCol}40`,backdropFilter:"blur(8px)"}}>
                          {c.cat}
                        </span>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute top-4 right-4 rounded-xl px-2.5 py-1.5"
                        style={{background:"rgba(255,255,255,.92)",backdropFilter:"blur(8px)"}}>
                        <span style={{fontFamily:FONT,fontWeight:700,fontSize:10,color:T.navy}}>{c.duration}</span>
                      </div>

                      {/* Primary metric on image */}
                      <div className="absolute bottom-4 left-4">
                        <div style={{fontFamily:FONT,fontWeight:800,fontSize:24,color:"#fff",lineHeight:1}}>{c.metrics[0].v}</div>
                        <div style={{fontFamily:FONT,fontSize:10,color:"rgba(255,255,255,.65)",marginTop:2}}>{c.metrics[0].l}</div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex flex-col flex-1">
                      <div style={{fontFamily:FONT,fontSize:10,fontWeight:700,color:T.muted,letterSpacing:".12em",textTransform:"uppercase" as const,marginBottom:5}}>
                        {c.industry}
                      </div>
                      <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:16,color:T.navy,marginBottom:5}}>{c.title}</h3>
                      <p style={{fontFamily:FONT,fontSize:12,color:c.catCol,fontWeight:600,marginBottom:10,lineHeight:1.4}}>{c.headline}</p>

                      {/* Metrics row */}
                      <div className="grid grid-cols-4 gap-2 mb-5">
                        {c.metrics.map(m=>(
                          <div key={m.l} className="rounded-xl py-2 text-center" style={{background:`${c.catCol}09`}}>
                            <div style={{fontFamily:FONT,fontWeight:800,fontSize:13,color:c.catCol,lineHeight:1}}>{m.v}</div>
                            <div style={{fontFamily:FONT,fontSize:8,color:T.muted,marginTop:2,lineHeight:1.2}}>{m.l}</div>
                          </div>
                        ))}
                      </div>

                      {/* Challenge always visible */}
                      <div className="mb-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-2 h-2 rounded-full" style={{background:"#F59E0B"}}/>
                          <span style={{fontFamily:FONT,fontWeight:700,fontSize:10,color:"#F59E0B",letterSpacing:".1em",textTransform:"uppercase" as const}}>Challenge</span>
                        </div>
                        <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5,paddingLeft:14}}>{c.challenge}</p>
                      </div>

                      {/* Expand / Collapse */}
                      <AnimatePresence>
                        {isOpen&&(
                          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} transition={{duration:.25}}>
                            <div className="space-y-3 mb-4">
                              {[{label:"Solution",text:c.solution,col:"#22C55E"},{label:"Outcome",text:c.outcome,col:c.catCol}].map(row=>(
                                <div key={row.label}>
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{background:row.col}}/>
                                    <span style={{fontFamily:FONT,fontWeight:700,fontSize:10,color:row.col,letterSpacing:".1em",textTransform:"uppercase" as const}}>{row.label}</span>
                                  </div>
                                  <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5,paddingLeft:14}}>{row.text}</p>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {c.services.map(s=>(
                                <span key={s} style={{fontFamily:FONT,fontSize:10,padding:"3px 8px",borderRadius:99,
                                  background:`${c.catCol}0E`,color:c.catCol,border:`1px solid ${c.catCol}20`}}>{s}</span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* View / Close toggle + CTA */}
                      <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{borderColor:T.border}}>
                        <button onClick={()=>setExpanded(isOpen?null:c.id)}
                          className="flex items-center gap-1.5 text-xs font-bold transition-all"
                          style={{fontFamily:FONT,color:isOpen?T.muted:c.catCol}}>
                          {isOpen?"Show Less ↑":"View Project ↓"}
                        </button>
                        <motion.button
                          onClick={()=>{ go("contact"); window.scrollTo(0,0); }}
                          whileHover={{scale:1.05}}
                          className="flex items-center gap-1.5 rounded-full text-xs font-bold text-white"
                          style={{padding:"8px 16px",fontFamily:FONT,background:c.catCol,boxShadow:`0 4px 14px ${c.catCol}35`}}>
                          Start Similar <ArrowRight size={11}/>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {shown.filter(c=>!c.featured||filter!=="All").length===0&&(
            <div className="text-center py-20">
              <p style={{fontFamily:FONT,fontSize:16,color:T.muted}}>No case studies in this category yet.</p>
              <p className="mt-2" style={{fontFamily:FONT,fontSize:13,color:T.muted}}>
                We add new projects regularly. <button onClick={()=>{ go("contact"); window.scrollTo(0,0); }}
                  className="underline" style={{color:T.red}}>Contact us</button> to discuss your project.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* RESULTS TRUST BAR */}
      <section className="py-12 px-6" style={{background:T.navy}}>
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="mb-8" style={{fontFamily:FONT,fontSize:13,color:"rgba(255,255,255,.4)",letterSpacing:".1em",textTransform:"uppercase" as const}}>
            Results across all industries
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[["$4M+","Client Revenue Generated"],["120+","Projects Delivered"],["95%","Client Retention Rate"],["4.9★","Average Project Rating"]].map(([v,l])=>(
              <div key={l}>
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:36,color:T.red,lineHeight:1}}>{v}</div>
                <div style={{fontFamily:FONT,fontSize:13,color:"rgba(255,255,255,.42)",marginTop:5}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6" style={{background:T.soft}}>
        <div className="max-w-[860px] mx-auto text-center">
          <motion.div initial={{opacity:0,scale:.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.6}}>
            <div className="relative rounded-3xl overflow-hidden px-10 py-16" style={{background:T.white,border:`1px solid ${T.border}`,boxShadow:"0 16px 60px rgba(10,19,48,.08)"}}>
              {/* Red gradient accent top */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{background:`linear-gradient(90deg,${T.red},#4361EE)`}}/>

              <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{background:`${T.red}10`,border:`1px solid ${T.red}20`}}>
                <Rocket size={24} style={{color:T.red}}/>
              </div>

              <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.7rem,3vw,2.4rem)",color:T.navy,letterSpacing:"-.5px",lineHeight:1.2}}>
                Want your business to be<br/><span style={{color:T.red}}>our next success story?</span>
              </h2>
              <p className="mt-4 max-w-md mx-auto" style={{fontFamily:FONT,fontSize:15,color:T.muted,lineHeight:1.6}}>
                Book a free 30-minute project consultation. We'll assess your current situation and map out exactly how we'd approach your growth.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }} large glow>
                  Start Your Project <ArrowRight size={14}/>
                </BtnPrimary>
                <BtnOutline onClick={()=>{ go("packages"); window.scrollTo(0,0); }}>
                  View Growth Packages
                </BtnOutline>
              </div>

              {/* Category chips */}
              <div className="mt-8 flex flex-wrap gap-2 justify-center">
                {CATS.slice(1).map(c=>(
                  <button key={c.label} onClick={()=>{setFilter(c.label);window.scrollTo({top:0,behavior:"smooth"});}}
                    className="text-xs font-semibold rounded-full transition-all hover:opacity-70"
                    style={{padding:"5px 12px",fontFamily:FONT,background:`${c.col}0E`,color:c.col,border:`1px solid ${c.col}22`}}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABOUT PAGE — Full premium storytelling build
// ═══════════════════════════════════════════════════════════════════════════════
function AboutPage({ go }:{go:(p:Page)=>void}){

  const values=[
    {icon:<Target size={22}/>,name:"Precision",col:"#4361EE",
      desc:"Every strategy, campaign, and deliverable is built with a specific goal in mind — not just activity, but outcomes.",
      detail:"We don't believe in vanity metrics. Every decision we make is tied to a real business result."},
    {icon:<Sparkles size={22}/>,name:"Innovation",col:"#8B5CF6",
      desc:"We use modern technology and creative thinking to solve real business problems — not templates from five years ago.",
      detail:"AI, automation, and emerging platforms aren't trends to us. They're tools we use to give our clients an edge."},
    {icon:<TrendingUp size={22}/>,name:"Growth",col:T.red,
      desc:"Growth is not a side effect of good work — it's the explicit purpose behind every system we build.",
      detail:"We measure our success entirely by the growth it creates for the businesses we work with."},
    {icon:<Shield size={22}/>,name:"Transparency",col:"#22C55E",
      desc:"Clear reporting, honest communication, realistic expectations, and no hidden fees or surprise costs.",
      detail:"We say no to work we can't deliver well. We report results honestly — good months and bad months alike."},
    {icon:<Users size={22}/>,name:"Partnership",col:"#F59E0B",
      desc:"We treat every client's business as if it were our own — because long-term success is better than short-term revenue.",
      detail:"Most of our clients stay with us for years. That's the relationship we aim for from day one."},
  ];

  const timeline=[
    {year:"Year 1",title:"The Belief",desc:"Axclade was founded on a simple premise: most businesses have untapped potential locked behind weak digital systems. We set out to fix that."},
    {year:"Year 2",title:"The System",desc:"We developed our proprietary 6-step growth process — Discover, Strategy, Build, Launch, Optimise, Scale — after working across dozens of industries."},
    {year:"Year 3",title:"The Expansion",desc:"We expanded from digital marketing into web development, app development, branding, and AI automation — becoming a full-service digital growth partner."},
    {year:"Today",title:"The Future",desc:"Axclade is building digital growth engines for businesses across the globe — from local restaurants to funded SaaS companies.",highlight:true},
  ];

  const capabilities=[
    {icon:<Globe size={20}/>,title:"Web Design & Development"},
    {icon:<BarChart3 size={20}/>,title:"Digital Marketing & Ads"},
    {icon:<Bot size={20}/>,title:"AI Automation Systems"},
    {icon:<Layers size={20}/>,title:"Branding & UI/UX Design"},
    {icon:<Smartphone size={20}/>,title:"App Development"},
    {icon:<Cpu size={20}/>,title:"SaaS & Software Development"},
  ];

  return(
    <>
      {/* HERO — Large brand mark centered */}
      <section className="pt-32 pb-0 px-6 relative overflow-hidden"
        style={{background:`linear-gradient(170deg,${T.soft} 0%,#E8ECF9 100%)`}}>
        <Glow color={T.red} size={500} className="-top-40 left-1/4"/>
        <Glow color={T.blue} size={400} className="bottom-0 right-1/4"/>
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{backgroundImage:`radial-gradient(circle,${T.navy}12 1px,transparent 1px)`,backgroundSize:"38px 38px"}}/>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.7}}
            className="text-center max-w-5xl mx-auto pb-16">
            <Chip color={T.red}><Sparkles size={10}/> About Axclade</Chip>
            <h1 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2.2rem,4.9vw,3.7rem)",color:T.navy,lineHeight:1.08,letterSpacing:"-.8px",marginTop:16}}>
              A Digital Growth Agency<br/>Built For The <span style={{color:T.red}}>New Era Of Business</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Axclade is a modern digital technology agency helping businesses grow through smart websites, digital marketing, AI automation, branding, apps, and scalable digital systems.
            </p>
          </motion.div>

          {/* Giant brand mark — visual anchor */}
          <motion.div initial={{opacity:0,scale:.9,y:20}} animate={{opacity:1,scale:1,y:0}} transition={{duration:.8,delay:.2}}
            className="flex justify-center -mt-3 pb-0">
            <div className="relative">
              {/* Mark */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                <img
                  src={axcladeFinalIcon}
                  alt="Axclade final icon"
                  className="w-full h-full object-contain"
                  style={{filter:"none"}}
                />
              </div>
              {/* Floating caption */}
              <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:12,color:T.muted,letterSpacing:".12em",textTransform:"uppercase" as const}}>
                  Smart Digital Growth Solutions
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="mt-20 h-12 w-full" style={{background:`linear-gradient(to bottom,transparent,${T.white})`}}/>
      </section>

      {/* STATS ROW */}
      <section className="py-14 px-6" style={{background:T.white,borderBottom:`1px solid ${T.border}`}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {v:"120+",l:"Projects Completed",sub:"Across 8+ industries",col:T.red},
              {v:"250+",l:"Happy Clients",sub:"Local to enterprise",col:"#4361EE"},
              {v:"$4M+",l:"Revenue Generated",sub:"For our clients",col:"#22C55E"},
              {v:"4.9★",l:"Average Rating",sub:"Based on 150+ reviews",col:"#F59E0B"},
            ].map((s,i)=>(
              <motion.div key={s.l} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}
                className="rounded-3xl p-7 text-center relative overflow-hidden"
                style={{background:T.soft,border:`1px solid ${T.border}`}}>
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10"
                  style={{background:s.col,filter:"blur(16px)"}}/>
                <div style={{fontFamily:FONT,fontWeight:800,fontSize:40,color:s.col,lineHeight:1}}>{s.v}</div>
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:T.navy,marginTop:6}}>{s.l}</div>
                <div style={{fontFamily:FONT,fontSize:11,color:T.muted,marginTop:3}}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY — Brand belief + what we solve */}
      <section className="py-24 px-6" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65}}>
            <Eyebrow text="Our Story"/>
            <SH>The belief that<br/><span style={{color:T.red}}>started everything.</span></SH>
            <div className="mt-8 relative pl-6" style={{borderLeft:`3px solid ${T.red}`}}>
              <p style={{fontFamily:FONT,fontWeight:700,fontSize:18,color:T.navy,lineHeight:1.5,fontStyle:"italic"}}>
                "Every business has potential — but only the right digital system unlocks real growth."
              </p>
            </div>
            <p className="mt-7 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Axclade was created after seeing the same problem repeated across hundreds of businesses: they had great products and services, but weak digital systems preventing them from reaching the right customers.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Scattered marketing. Outdated websites. Weak branding. Inefficient, manual operations. No tracking. No system.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              We built Axclade to solve this — not as just another digital marketing agency, but as a <strong style={{color:T.navy}}>growth engineering company</strong> that builds complete digital systems from the ground up.
            </p>
          </motion.div>

          {/* Problem cards */}
          <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.65,delay:.1}}>
            <div className="rounded-2xl p-5 mb-4" style={{background:`${T.red}06`,border:`1px solid ${T.red}18`}}>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:12,color:T.red,letterSpacing:".1em",textTransform:"uppercase" as const,marginBottom:12}}>
                Problems We Solve
              </div>
              <div className="space-y-3">
                {["Scattered, inconsistent digital marketing","Outdated or low-converting websites","Weak brand identity and positioning","No lead generation system","Manual operations with no automation","Zero tracking or performance data"].map((p,i)=>(
                  <motion.div key={p} initial={{opacity:0,x:-12}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.07}}
                    className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:`${T.red}14`,color:T.red}}>
                      <span style={{fontSize:11,fontWeight:800}}>×</span>
                    </div>
                    <span style={{fontFamily:FONT,fontSize:14,color:T.navy}}>{p}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{background:"#22C55E08",border:"1px solid #22C55E20"}}>
              <div style={{fontFamily:FONT,fontWeight:700,fontSize:12,color:"#22C55E",letterSpacing:".1em",textTransform:"uppercase" as const,marginBottom:12}}>
                What We Build Instead
              </div>
              <div className="space-y-3">
                {["Integrated digital growth systems","High-converting websites and funnels","Premium brand identities that command trust","Consistent lead generation pipelines","AI-powered automation that works 24/7","Clear data dashboards and monthly reporting"].map((p,i)=>(
                  <motion.div key={p} initial={{opacity:0,x:-12}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:.4+i*.07}}
                    className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:"#22C55E14",color:"#22C55E"}}>
                      <Check size={10}/>
                    </div>
                    <span style={{fontFamily:FONT,fontSize:14,color:T.navy}}>{p}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NAME MEANING — Axis + Cascade */}
      <section className="py-24 px-6 relative overflow-hidden" style={{background:T.navy}}>
        <Glow color={T.red} size={500} className="-top-32 left-1/4"/>
        <Glow color={T.blue} size={400} className="-bottom-20 right-1/4"/>
        <div className="absolute inset-0 pointer-events-none opacity-[.05]"
          style={{backgroundImage:`radial-gradient(circle,#fff 1px,transparent 1px)`,backgroundSize:"28px 28px"}}/>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center mb-14">
            <Eyebrow text="The Name" light/>
            <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2rem,4vw,3rem)",color:"#fff",letterSpacing:"-.5px",lineHeight:1.1}}>
              What does <span style={{color:T.red}}>Axclade</span> mean?
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-center">
            {/* Axis */}
            <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.6}}
              className="rounded-3xl p-10"
              style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",backdropFilter:"blur(12px)"}}>
              <div className="text-6xl font-black mb-5" style={{fontFamily:FONT,color:T.red,lineHeight:1}}>Ax</div>
              <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:20,color:"#fff",marginBottom:10}}>From "Axis"</h3>
              <p style={{fontFamily:FONT,fontSize:14,color:"rgba(255,255,255,.55)",lineHeight:1.7}}>
                Structure. Direction. Foundation. Precision.<br/>
                The central axis around which everything else rotates. A fixed point of strength and reference.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Structure","Direction","Foundation","Precision"].map(t=>(
                  <span key={t} style={{fontFamily:FONT,fontSize:11,padding:"4px 10px",borderRadius:99,
                    background:`${T.red}20`,color:T.red,border:`1px solid ${T.red}30`}}>{t}</span>
                ))}
              </div>
            </motion.div>

            {/* Central connector */}
            <motion.div initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:.6,delay:.15}}
              className="text-center flex flex-col items-center gap-4">
              <div className="text-6xl font-black" style={{fontFamily:FONT,color:"rgba(255,255,255,.12)"}}>+</div>
              <div className="flex items-center justify-center">
                <AxcladeLogoImage src={axcladeLogoObject} className="h-12 w-auto max-w-[220px] object-contain"/>
              </div>
              <div>
                <div style={{fontFamily:FONT,fontSize:12,color:"rgba(255,255,255,.38)",marginTop:3,letterSpacing:".1em",textTransform:"uppercase" as const}}>
                  Structure + Momentum
                </div>
              </div>
              <p style={{fontFamily:FONT,fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.6,maxWidth:220,textAlign:"center" as const}}>
                Together: systems, direction, and unstoppable forward growth.
              </p>
            </motion.div>

            {/* Cascade */}
            <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.6,delay:.1}}
              className="rounded-3xl p-10"
              style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",backdropFilter:"blur(12px)"}}>
              <div className="text-6xl font-black mb-5" style={{fontFamily:FONT,color:T.blue,lineHeight:1}}>clade</div>
              <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:20,color:"#fff",marginBottom:10}}>From "Cascade"</h3>
              <p style={{fontFamily:FONT,fontSize:14,color:"rgba(255,255,255,.55)",lineHeight:1.7}}>
                Continuous flow. Scaling. Expansion. Forward movement.<br/>
                A cascade builds momentum — each layer creating the foundation for the next.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Flow","Scaling","Expansion","Momentum"].map(t=>(
                  <span key={t} style={{fontFamily:FONT,fontSize:11,padding:"4px 10px",borderRadius:99,
                    background:`${T.blue}22`,color:"#7DD3FC",border:`1px solid ${T.blue}35`}}>{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 px-6" style={{background:T.soft}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <Eyebrow text="Our Journey"/>
            <SH center>How we got <span style={{color:T.red}}>to where we are.</span></SH>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{background:`linear-gradient(to bottom,transparent,${T.border} 10%,${T.border} 90%,transparent)`}}/>

            <div className="space-y-6">
              {timeline.map((t,i)=>(
                <motion.div key={t.year}
                  initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.12,duration:.55}}
                  className={`relative grid lg:grid-cols-2 gap-6 ${i%2===0?"":""}`}>

                  {/* Dot on the line */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-8 z-10 items-center justify-center">
                    <motion.div animate={{boxShadow:t.highlight?[`0 0 0 0 ${T.red}40`,`0 0 0 12px ${T.red}00`]:`0 0 0 0 transparent`}}
                      transition={{duration:1.5,repeat:Infinity}}
                      className="w-5 h-5 rounded-full border-2 bg-white"
                      style={{borderColor:t.highlight?T.red:T.border}}/>
                  </div>

                  <div className={i%2===0?"lg:pr-10":"lg:order-2 lg:pl-10"}>
                    <div className={`rounded-2xl p-7 h-full ${t.highlight?"shadow-xl":""}`}
                      style={{
                        background:t.highlight?T.navy:T.white,
                        border:t.highlight?`2px solid ${T.red}`:`1px solid ${T.border}`,
                        boxShadow:t.highlight?`0 16px 56px ${T.navy}28`:"none",
                      }}>
                      <div style={{fontFamily:FONT,fontWeight:800,fontSize:12,letterSpacing:".14em",textTransform:"uppercase" as const,
                        color:t.highlight?T.red:T.muted,marginBottom:6}}>{t.year}</div>
                      <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:20,color:t.highlight?"#fff":T.navy,marginBottom:8}}>{t.title}</h3>
                      <p style={{fontFamily:FONT,fontSize:14,color:t.highlight?"rgba(255,255,255,.58)":T.muted,lineHeight:1.6}}>{t.desc}</p>
                      {t.highlight&&(
                        <div className="mt-5 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{background:T.red}}/>
                          <span style={{fontFamily:FONT,fontSize:12,color:"rgba(255,255,255,.4)"}}>This is where we are now</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={i%2===0?"":"lg:order-1"}/>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION + VISION */}
      <section className="py-24 px-6" style={{background:T.white}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <Eyebrow text="Purpose"/>
            <SH center>Why we exist and<br/><span style={{color:T.red}}>where we're going.</span></SH>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mission — dark navy */}
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.6}}
              className="relative rounded-3xl p-10 overflow-hidden" style={{background:T.navy}}>
              <Glow color={T.red} size={300} className="-top-16 -left-16"/>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{background:`${T.red}22`,boxShadow:`0 0 28px ${T.red}40`,border:`1px solid ${T.red}30`}}>
                  <Target size={24} style={{color:T.red}}/>
                </div>
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:11,color:T.red,letterSpacing:".16em",textTransform:"uppercase" as const,marginBottom:10}}>Our Mission</div>
                <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.5rem,2.5vw,2rem)",color:"#fff",lineHeight:1.25,marginBottom:14}}>
                  Deliver Smart Digital Growth Solutions.
                </h3>
                <p style={{fontFamily:FONT,fontSize:15,color:"rgba(255,255,255,.55)",lineHeight:1.7}}>
                  To deliver Smart Digital Growth Solutions that combine creativity, technology, and automation — helping businesses grow faster, smarter, and more sustainably than they could alone.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[["🎨","Creativity"],["⚡","Technology"],["🤖","Automation"]].map(([em,l])=>(
                    <div key={l} className="rounded-xl p-3 text-center" style={{background:"rgba(255,255,255,.07)"}}>
                      <div style={{fontSize:20,marginBottom:4}}>{em}</div>
                      <div style={{fontFamily:FONT,fontSize:11,color:"rgba(255,255,255,.5)"}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vision — light with red accent */}
            <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:.6,delay:.1}}
              className="flex flex-col gap-5">
              <div className="relative rounded-3xl p-10 flex-1 overflow-hidden"
                style={{background:T.soft,border:`1px solid ${T.border}`}}>
                <div className="absolute top-0 left-0 right-0 h-1" style={{background:`linear-gradient(90deg,${T.red},#4361EE)`}}/>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{background:`${T.blue}12`,border:`1px solid ${T.blue}20`}}>
                  <Rocket size={24} style={{color:T.blue}}/>
                </div>
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:11,color:T.blue,letterSpacing:".16em",textTransform:"uppercase" as const,marginBottom:10}}>Our Vision</div>
                <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.3rem,2vw,1.8rem)",color:T.navy,lineHeight:1.3,marginBottom:12}}>
                  Become a global leader in digital transformation.
                </h3>
                <p style={{fontFamily:FONT,fontSize:15,color:T.muted,lineHeight:1.7}}>
                  To become a global leader in digital transformation by building intelligent systems that empower businesses to grow without limits — regardless of size, industry, or geography.
                </p>
              </div>

              {/* Capabilities mini-grid */}
              <div className="rounded-3xl p-6" style={{background:T.white,border:`1px solid ${T.border}`}}>
                <div style={{fontFamily:FONT,fontWeight:700,fontSize:12,color:T.muted,letterSpacing:".1em",textTransform:"uppercase" as const,marginBottom:14}}>What we build</div>
                <div className="grid grid-cols-3 gap-2">
                  {capabilities.map((c)=>(
                    <div key={c.title} className="flex flex-col items-center gap-2 text-center p-2 rounded-xl"
                      style={{background:T.soft}}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:`${T.red}10`,color:T.red}}>{c.icon}</div>
                      <span style={{fontFamily:FONT,fontSize:10,color:T.navy,fontWeight:600,lineHeight:1.3}}>{c.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-6 relative overflow-hidden" style={{background:T.soft}}>
        <Glow color={T.blue} size={400} className="-top-20 right-10"/>
        <Glow color={T.red} size={300} className="bottom-0 left-10"/>

        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="text-center mb-14">
            <Eyebrow text="Our Values"/>
            <SH center>The principles we build<br/><span style={{color:T.red}}>everything around.</span></SH>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((v,i)=>(
              <motion.div key={v.name}
                initial={{opacity:0,y:24,scale:.96}} whileInView={{opacity:1,y:0,scale:1}} viewport={{once:true}} transition={{delay:i*.1,duration:.55}}
                whileHover={{y:-6,scale:1.02}}
                className="relative rounded-3xl p-7 flex flex-col gap-4 overflow-hidden"
                style={{background:T.white,border:`1px solid ${T.border}`,boxShadow:"0 6px 32px rgba(10,19,48,.07)"}}>
                {/* Color accent top */}
                <div className="h-0.5 absolute top-0 left-6 right-6 rounded-full" style={{background:v.col}}/>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{background:`${v.col}12`,color:v.col}}>
                  {v.icon}
                </div>
                <div>
                  <h3 style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:T.navy,marginBottom:6}}>{v.name}</h3>
                  <p style={{fontFamily:FONT,fontSize:13,color:T.muted,lineHeight:1.55,marginBottom:8}}>{v.desc}</p>
                  <p style={{fontFamily:FONT,fontSize:12,color:T.muted,lineHeight:1.5,fontStyle:"italic",borderLeft:`2px solid ${v.col}`,paddingLeft:10}}>
                    {v.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL STATEMENT */}
      <section className="py-24 px-6" style={{background:T.white}}>
        <div className="max-w-[900px] mx-auto">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7}}>
            <div className="relative rounded-3xl overflow-hidden px-12 py-16 text-center" style={{background:T.navy}}>
              <Glow color={T.red} size={400} className="-top-24 left-1/2 -translate-x-1/2"/>
              <Glow color={T.blue} size={300} className="bottom-0 right-0"/>
              <div className="absolute inset-0 pointer-events-none opacity-[.06]"
                style={{backgroundImage:`radial-gradient(circle,#fff 1px,transparent 1px)`,backgroundSize:"26px 26px"}}/>

              <div className="relative z-10">
                {/* Brand mark small */}
                <div className="w-fit mx-auto mb-8">
                  <img
                    src={axcladeIcon}
                    alt="Axclade icon"
                    className="h-14 w-14 object-contain"
                    style={{filter:`drop-shadow(0 10px 24px ${T.red}22)`}}
                  />
                </div>

                <p style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.6rem,3.5vw,2.6rem)",color:"#fff",lineHeight:1.2,letterSpacing:"-.4px"}}>
                  Axclade is building digital growth engines<br/>
                  <span style={{color:T.red}}>for the future.</span>
                </p>

                <p className="mt-5 max-w-lg mx-auto" style={{fontFamily:FONT,fontSize:15,color:"rgba(255,255,255,.48)",lineHeight:1.6}}>
                  From local restaurants to global SaaS products — we're helping businesses of every size and stage unlock their digital potential through smart, scalable systems.
                </p>

                <div className="mt-10 flex flex-wrap gap-3 justify-center">
                  <BtnPrimary onClick={()=>{ go("contact"); window.scrollTo(0,0); }} large glow>
                    Work With Axclade <ArrowRight size={14}/>
                  </BtnPrimary>
                  <BtnOutline dark onClick={()=>{ go("case-studies"); window.scrollTo(0,0); }}>
                    See Our Work
                  </BtnOutline>
                </div>

                <div className="mt-10 pt-10 border-t flex flex-wrap justify-center gap-8"
                  style={{borderColor:"rgba(255,255,255,.08)"}}>
                  {[["120+","Projects"],["250+","Clients"],["8+","Industries"],["4.9★","Rating"]].map(([v,l])=>(
                    <div key={l} className="text-center">
                      <div style={{fontFamily:FONT,fontWeight:800,fontSize:22,color:T.red,lineHeight:1}}>{v}</div>
                      <div style={{fontFamily:FONT,fontSize:11,color:"rgba(255,255,255,.35)",marginTop:3}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT PAGE — Premium split layout
// ═══════════════════════════════════════════════════════════════════════════════
function ContactPage(){
  const [form,setForm]=useState({
    name:"",business:"",businessType:"",email:"",phone:"",website:"",service:"",budget:"",message:""
  });
  const [done,setDone]=useState(false);
  const [focused,setFocused]=useState<string|null>(null);

  const set=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>
    setForm(f=>({...f,[k]:e.target.value}));

  const SERVICES=[
    "Local & Startup Growth","E-commerce Growth","B2B Lead Generation",
    "Brand Development & Social Media","Web Design & Development","App Design & Development",
    "Software Design & Development","AI Automation Systems","SaaS Product Development",
    "Not Sure / Need Consultation",
  ];
  const BUDGETS=[
    "Under $300/month","$300–$700/month","$700–$1,500/month",
    "$1,500+/month","Custom project budget","Not sure yet",
  ];

  // Shared input style factory
  const inp=(k:string):React.CSSProperties=>({
    width:"100%",padding:"13px 16px",borderRadius:14,fontSize:14,outline:"none",
    fontFamily:FONT,color:T.navy,
    background:focused===k?"#fff":T.soft,
    border:`1.5px solid ${focused===k?T.red:T.border}`,
    transition:"border .2s,background .2s",
    boxShadow:focused===k?`0 0 0 3px ${T.red}12`:"none",
  });

  const Label=({children}:{children:React.ReactNode})=>(
    <label style={{fontFamily:FONT,fontWeight:700,fontSize:11,color:T.navy,
      display:"block" as const,marginBottom:6,letterSpacing:".04em"}}>
      {children}
    </label>
  );

  const Field=({k,label,ph,type="text",half=true}:{k:string;label:string;ph:string;type?:string;half?:boolean})=>(
    <div className={half?"":"md:col-span-2"}>
      <Label>{label}</Label>
      <input type={type} placeholder={ph} value={(form as any)[k]} onChange={set(k)}
        onFocus={()=>setFocused(k)} onBlur={()=>setFocused(null)}
        style={inp(k)}/>
    </div>
  );

  const trust=[
    {icon:<Check size={13}/>,text:"Free 30-minute consultation — no commitment"},
    {icon:<Check size={13}/>,text:"Response guaranteed within 24 hours"},
    {icon:<Check size={13}/>,text:"Personalised package recommendation included"},
    {icon:<Check size={13}/>,text:"No sales pressure — just honest advice"},
  ];

  const freebies=[
    "Free Digital Growth Audit",
    "Free Website Performance Review",
    "Free Google Business Profile Audit",
    "Free E-commerce Funnel Review",
    "Free AI Automation Consultation",
  ];

  return(
    <>
      {/* HERO */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden"
        style={{background:`linear-gradient(160deg,${T.soft} 0%,#EAEEf8 100%)`}}>
        <Glow color={T.red} size={420} className="-top-32 -right-20"/>
        <Glow color={T.blue} size={340} className="-bottom-20 -left-16"/>
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{backgroundImage:`radial-gradient(circle,${T.navy}12 1px,transparent 1px)`,backgroundSize:"38px 38px"}}/>

        <div className="max-w-[1280px] mx-auto relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
            <Chip color={T.red}><MessageSquare size={10}/> Get In Touch</Chip>
            <h1 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(2.4rem,5vw,3.8rem)",color:T.navy,lineHeight:1.08,letterSpacing:"-.6px",marginTop:16}}>
              Let's Build Your<br/><span style={{color:T.red}}>Growth System</span>
            </h1>
            <p className="mt-5 text-lg max-w-xl mx-auto leading-relaxed" style={{fontFamily:FONT,color:T.muted}}>
              Tell us about your business, goals, and challenges. Axclade will help you choose the right package or custom solution.
            </p>
          </motion.div>

          {/* Quick-action options */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.5}}
            className="mt-8 flex flex-wrap gap-3 justify-center">
            {[{emoji:"📋",text:"Fill the form below"},
              {emoji:"💬",text:"Chat on WhatsApp"},
              {emoji:"📧",text:"hello@axclade.com"}].map(a=>(
              <div key={a.text} className="flex items-center gap-2 rounded-full px-4 py-2"
                style={{background:"rgba(255,255,255,.8)",backdropFilter:"blur(12px)",border:`1px solid ${T.border}`,
                  fontFamily:FONT,fontSize:13,color:T.navy,fontWeight:600}}>
                <span>{a.emoji}</span>{a.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MAIN SPLIT LAYOUT */}
      <section className="py-16 pb-24 px-6 relative" style={{background:T.white}}>
        <Glow color={T.blue} size={350} className="top-0 right-0 opacity-[.06]"/>
        <div className="max-w-[1320px] mx-auto grid lg:grid-cols-5 gap-10 items-start">

          {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-24">

            {/* Communication object — 3D-style visual */}
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.65}}
              className="relative rounded-3xl overflow-hidden p-8" style={{background:T.navy,minHeight:220}}>
              <Glow color={T.red} size={250} className="-top-16 -left-16"/>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{background:`${T.red}22`,border:`1px solid ${T.red}30`,boxShadow:`0 0 20px ${T.red}40`}}>
                    <Rocket size={22} style={{color:T.red}}/>
                  </div>
                  <div>
                    <div style={{fontFamily:FONT,fontWeight:800,fontSize:16,color:"#fff"}}>Let's start here.</div>
                    <div style={{fontFamily:FONT,fontSize:12,color:"rgba(255,255,255,.4)"}}>No fluff. Just real advice.</div>
                  </div>
                </div>
                <p style={{fontFamily:FONT,fontSize:14,color:"rgba(255,255,255,.6)",lineHeight:1.65}}>
                  Fill in the form with as much or as little as you know. We'll ask the right questions, understand your business, and recommend the best path forward — for free.
                </p>

                {/* Trust points */}
                <div className="mt-6 space-y-2.5">
                  {trust.map(t=>(
                    <div key={t.text} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{background:`${T.red}25`,color:T.red}}>{t.icon}</div>
                      <span style={{fontFamily:FONT,fontSize:12,color:"rgba(255,255,255,.58)",lineHeight:1.5}}>{t.text}</span>
                    </div>
                  ))}
                </div>

                {/* Floating live badge */}
                <motion.div animate={{opacity:[.7,1,.7]}} transition={{duration:2.5,repeat:Infinity}}
                  className="mt-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{background:"#22C55E"}}/>
                  <span style={{fontFamily:FONT,fontSize:11,color:"rgba(255,255,255,.4)"}}>Team available Mon–Fri, 9am–7pm</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Details */}
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.65,delay:.1}}
              className="rounded-3xl p-7" style={{background:T.soft,border:`1px solid ${T.border}`}}>
              <h4 style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:T.navy,marginBottom:16}}>Contact Details</h4>
              {[
                {icon:<Mail size={15}/>,label:"Email",val:"hello@axclade.com",col:T.blue},
                {icon:<Phone size={15}/>,label:"WhatsApp",val:"+1 (555) 123-4567",col:"#22C55E"},
                {icon:<MapPin size={15}/>,label:"Location",val:"Global — Remote & On-site",col:T.red},
              ].map(c=>(
                <div key={c.label} className="flex items-center gap-3 mb-4 last:mb-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{background:`${c.col}12`,color:c.col}}>{c.icon}</div>
                  <div>
                    <div style={{fontFamily:FONT,fontSize:10,fontWeight:600,color:T.muted,letterSpacing:".08em",textTransform:"uppercase" as const}}>{c.label}</div>
                    <div style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy,marginTop:2}}>{c.val}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* WhatsApp card */}
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.65,delay:.18}}
              className="rounded-3xl p-7 relative overflow-hidden"
              style={{background:"linear-gradient(135deg,#128C7E,#25D366)"}}>
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                style={{background:"rgba(255,255,255,.1)",filter:"blur(20px)"}}/>
              <div className="relative z-10">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                  style={{background:"rgba(255,255,255,.2)"}}>
                  <MessageSquare size={22} className="text-white"/>
                </div>
                <h4 style={{fontFamily:FONT,fontWeight:800,fontSize:16,color:"#fff",marginBottom:6}}>Prefer a Quick Chat?</h4>
                <p style={{fontFamily:FONT,fontSize:13,color:"rgba(255,255,255,.75)",lineHeight:1.55,marginBottom:16}}>
                  Message us on WhatsApp and tell us what you want to build or improve. We usually respond within a few hours.
                </p>
                <motion.a href="https://wa.me/" target="_blank" rel="noopener noreferrer"
                  whileHover={{scale:1.03}} whileTap={{scale:.97}}
                  className="flex items-center justify-center gap-2.5 w-full rounded-full font-bold text-sm py-3.5"
                  style={{background:"rgba(255,255,255,.95)",color:"#128C7E",fontFamily:FONT,fontWeight:700}}>
                  <MessageSquare size={15}/> Chat on WhatsApp
                </motion.a>
              </div>
            </motion.div>

            {/* Free resources */}
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.65,delay:.25}}
              className="rounded-3xl p-7" style={{background:T.soft,border:`1px solid ${T.border}`}}>
              <h4 style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:T.navy,marginBottom:14}}>
                What's included — for free
              </h4>
              <div className="space-y-3">
                {freebies.map((f,i)=>(
                  <motion.div key={f} initial={{opacity:0,x:-8}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.06}}
                    className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:`${T.red}10`,color:T.red}}>
                      <Check size={11}/>
                    </div>
                    <span style={{fontFamily:FONT,fontSize:13,color:T.navy}}>{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT — FORM ──────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {done?(
                <motion.div key="done"
                  initial={{opacity:0,scale:.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0}}
                  transition={{duration:.5}}
                  className="rounded-3xl overflow-hidden"
                  style={{background:"rgba(255,255,255,.85)",backdropFilter:"blur(20px)",
                    border:`1px solid rgba(255,255,255,.9)`,boxShadow:"0 20px 72px rgba(10,19,48,.10)"}}>

                  {/* Red top accent */}
                  <div className="h-1 w-full" style={{background:`linear-gradient(90deg,${T.red},#4361EE)`}}/>

                  <div className="p-14 text-center flex flex-col items-center">
                    {/* Animated success mark */}
                    <motion.div initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:.5,type:"spring"}}
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-7"
                      style={{background:`${T.red}10`,border:`2px solid ${T.red}25`,boxShadow:`0 0 40px ${T.red}25`}}>
                      <Check size={36} style={{color:T.red}}/>
                    </motion.div>

                    <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.8rem,3vw,2.4rem)",color:T.navy,letterSpacing:"-.5px",marginBottom:14}}>
                      Inquiry Received!
                    </h2>
                    <p style={{fontFamily:FONT,fontSize:15,color:T.muted,lineHeight:1.7,maxWidth:420}}>
                      Thank you for reaching out. We've received your details and will review them carefully. You'll hear from us within <strong style={{color:T.navy}}>24 hours</strong> with personalised recommendations.
                    </p>

                    {/* What happens next */}
                    <div className="mt-10 w-full max-w-md text-left">
                      <p style={{fontFamily:FONT,fontWeight:700,fontSize:12,color:T.muted,letterSpacing:".1em",textTransform:"uppercase" as const,marginBottom:14}}>
                        What happens next
                      </p>
                      {[
                        {step:"01",text:"We review your inquiry and research your business.",icon:<BarChart3 size={15}/>},
                        {step:"02",text:"We prepare a personalised package or solution recommendation.",icon:<Brain size={15}/>},
                        {step:"03",text:"We reach out within 24 hours — by email or WhatsApp.",icon:<MessageSquare size={15}/>},
                      ].map(s=>(
                        <div key={s.step} className="flex items-start gap-4 mb-4 last:mb-0">
                          <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{background:`${T.red}10`,color:T.red}}>{s.icon}</div>
                          <div>
                            <span style={{fontFamily:FONT,fontWeight:700,fontSize:10,color:T.red,letterSpacing:".1em"}}>{s.step}</span>
                            <p style={{fontFamily:FONT,fontSize:13,color:T.navy,lineHeight:1.5,marginTop:2}}>{s.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp fallback */}
                    <div className="mt-10 w-full max-w-md rounded-2xl p-5 flex items-center gap-4"
                      style={{background:"#22C55E08",border:"1px solid #22C55E20"}}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{background:"#22C55E14",color:"#22C55E"}}>
                        <MessageSquare size={18}/>
                      </div>
                      <div className="flex-1">
                        <p style={{fontFamily:FONT,fontWeight:700,fontSize:13,color:T.navy}}>Want a faster response?</p>
                        <p style={{fontFamily:FONT,fontSize:12,color:T.muted}}>Chat with us directly on WhatsApp.</p>
                      </div>
                      <a href="https://wa.me/" target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full text-xs font-bold text-white flex-shrink-0"
                        style={{background:"#25D366",fontFamily:FONT}}>WhatsApp</a>
                    </div>
                  </div>
                </motion.div>
              ):(
                <motion.form key="form"
                  initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  transition={{duration:.5}}
                  onSubmit={e=>{e.preventDefault();setDone(true);}}
                  className="rounded-3xl overflow-hidden"
                  style={{background:"rgba(255,255,255,.85)",backdropFilter:"blur(20px)",
                    border:`1px solid rgba(255,255,255,.9)`,boxShadow:"0 20px 72px rgba(10,19,48,.10)"}}>

                  {/* Red gradient top accent */}
                  <div className="h-1 w-full" style={{background:`linear-gradient(90deg,${T.red},#4361EE)`}}/>

                  <div className="p-8 lg:p-10">
                    <div className="flex items-start justify-between gap-4 mb-8">
                      <div>
                        <div style={{fontFamily:FONT,fontWeight:700,fontSize:11,color:T.red,letterSpacing:".14em",textTransform:"uppercase" as const,marginBottom:6}}>
                          Free Consultation
                        </div>
                        <h2 style={{fontFamily:FONT,fontWeight:800,fontSize:"clamp(1.5rem,2.5vw,2rem)",color:T.navy,letterSpacing:"-.4px",lineHeight:1.2}}>
                          Get a Free Growth Consultation
                        </h2>
                      </div>
                      {/* Step indicator */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full" style={{background:T.red}}/>
                        <div className="w-2 h-2 rounded-full" style={{background:T.border}}/>
                        <div className="w-2 h-2 rounded-full" style={{background:T.border}}/>
                      </div>
                    </div>

                    {/* Form grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field k="name" label="Full Name *" ph="Your full name"/>
                      <Field k="business" label="Business Name *" ph="Your business name"/>
                      <Field k="email" label="Email Address *" ph="you@company.com" type="email"/>
                      <Field k="phone" label="Phone / WhatsApp *" ph="+1 (555) 000-0000" type="tel"/>
                      <Field k="website" label="Website URL" ph="https://yourbusiness.com" type="url"/>
                      <Field k="businessType" label="Business Type" ph="e.g. Restaurant, SaaS, E-commerce"/>

                      {/* Service dropdown */}
                      <div className="md:col-span-2">
                        <Label>Interested Service *</Label>
                        <div className="relative">
                          <select value={form.service} onChange={set("service")}
                            onFocus={()=>setFocused("service")} onBlur={()=>setFocused(null)}
                            style={{...inp("service"),appearance:"none" as const,paddingRight:44}}>
                            <option value="" disabled>Select the service you need...</option>
                            {SERVICES.map(s=><option key={s}>{s}</option>)}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{color:T.muted}}>
                            <ChevronDown size={16}/>
                          </div>
                        </div>
                      </div>

                      {/* Budget dropdown */}
                      <div className="md:col-span-2">
                        <Label>Monthly Budget Range</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {BUDGETS.map(b=>(
                            <button key={b} type="button"
                              onClick={()=>setForm(f=>({...f,budget:b}))}
                              className="rounded-xl py-2.5 px-3 text-xs font-semibold text-left transition-all"
                              style={{
                                fontFamily:FONT,
                                background:form.budget===b?T.navy:`${T.navy}06`,
                                color:form.budget===b?"#fff":T.navy,
                                border:form.budget===b?`1.5px solid ${T.red}`:`1.5px solid ${T.border}`,
                                boxShadow:form.budget===b?`0 0 0 2px ${T.red}18`:"none",
                              }}>
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="md:col-span-2">
                        <Label>Message / Goals</Label>
                        <div className="relative">
                          <textarea rows={5} value={form.message} onChange={set("message")}
                            onFocus={()=>setFocused("message")} onBlur={()=>setFocused(null)}
                            placeholder="Tell us about your current situation, goals, and what you'd like to improve or build. The more context you share, the better we can help."
                            style={{...inp("message"),resize:"none" as const}}/>
                          <div className="absolute bottom-3 right-4"
                            style={{fontFamily:FONT,fontSize:10,color:T.muted}}>
                            {form.message.length}/500
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Privacy note */}
                    <p className="mt-4 text-xs" style={{fontFamily:FONT,color:T.muted,lineHeight:1.5}}>
                      By submitting this form you agree to our Privacy Policy. We never share your data and will only use it to respond to your inquiry.
                    </p>

                    {/* Submit row */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <motion.button type="submit"
                        whileHover={{scale:1.02,boxShadow:`0 0 32px ${T.red}50`}}
                        whileTap={{scale:.98}}
                        className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-full font-bold text-white transition-shadow"
                        style={{background:T.red,fontFamily:FONT,fontWeight:700,fontSize:15,
                          boxShadow:`0 0 24px ${T.red}38`}}>
                        Submit Inquiry <ArrowRight size={15}/>
                      </motion.button>
                      <motion.a href="https://wa.me/" target="_blank" rel="noopener noreferrer"
                        whileHover={{scale:1.02}} whileTap={{scale:.98}}
                        className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-bold text-sm text-white"
                        style={{background:"#25D366",fontFamily:FONT,fontWeight:700,
                          boxShadow:"0 4px 18px rgba(37,211,102,.35)"}}>
                        <MessageSquare size={15}/> WhatsApp
                      </motion.a>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Below form — social proof */}
            {!done&&(
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.4,duration:.5}}
                className="mt-5 grid grid-cols-3 gap-3">
                {[["120+","Projects Delivered"],["4.9★","Client Rating"],["< 24hr","Response Time"]].map(([v,l])=>(
                  <div key={l} className="rounded-2xl p-4 text-center" style={{background:T.soft,border:`1px solid ${T.border}`}}>
                    <div style={{fontFamily:FONT,fontWeight:800,fontSize:18,color:T.navy,lineHeight:1}}>{v}</div>
                    <div style={{fontFamily:FONT,fontSize:11,color:T.muted,marginTop:3}}>{l}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ mini strip */}
      <section className="py-16 px-6" style={{background:T.soft,borderTop:`1px solid ${T.border}`}}>
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <Eyebrow text="Common Questions"/>
            <SH center>Quick <span style={{color:T.red}}>answers</span></SH>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {q:"How quickly will you respond?",a:"We respond to all inquiries within 24 hours on business days. WhatsApp messages are often answered within a few hours."},
              {q:"What if I'm not sure what I need?",a:"That's perfectly fine — and very common. Our consultation is designed to help you figure out exactly what you need. Just fill in what you know."},
              {q:"Is the consultation really free?",a:"Yes. No commitment, no credit card, no sales pressure. It's a genuine conversation about your business and how we can help."},
            ].map((faq)=>(
              <div key={faq.q} className="rounded-2xl p-6" style={{background:T.white,border:`1px solid ${T.border}`}}>
                <h4 style={{fontFamily:FONT,fontWeight:700,fontSize:14,color:T.navy,marginBottom:8}}>{faq.q}</h4>
                <p style={{fontFamily:FONT,fontSize:13,color:T.muted,lineHeight:1.55}}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Responsive utility hook ──────────────────────────────────────────────────
function useIsMobile(bp=768){
  const [mobile,setMobile]=useState(()=>typeof window!=="undefined"?window.innerWidth<bp:false);
  useEffect(()=>{
    const fn=()=>setMobile(window.innerWidth<bp);
    window.addEventListener("resize",fn,{passive:true});
    return()=>window.removeEventListener("resize",fn);
  },[bp]);
  return mobile;
}

// ─── Scroll-to-top button ─────────────────────────────────────────────────────
function ScrollToTop(){
  const y=useScrollY();
  const visible=y>600;
  return(
    <AnimatePresence>
      {visible&&(
        <motion.button
          initial={{opacity:0,scale:.8,y:8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.8,y:8}}
          transition={{duration:.22}}
          onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
          aria-label="Scroll to top"
          className="hidden lg:flex fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full items-center justify-center transition-all hover:scale-110"
          style={{background:T.navy,boxShadow:`0 4px 20px ${T.navy}40`,color:"#fff"}}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M8 4L4 8M8 4l4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Page-progress bar ────────────────────────────────────────────────────────
function ProgressBar(){
  const y=useScrollY();
  const [total,setTotal]=useState(1);
  useEffect(()=>{
    const calc=()=>setTotal(document.documentElement.scrollHeight-window.innerHeight);
    calc();
    window.addEventListener("resize",calc,{passive:true});
    return()=>window.removeEventListener("resize",calc);
  },[]);
  const pct=total>0?Math.min((y/total)*100,100):0;
  return(
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
      <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${T.red},#4361EE)`,transition:"width .1s linear"}}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [page,setPage]=useState<Page>("home");
  const go=(p:Page)=>{ setPage(p); window.scrollTo(0,0); };
  const PAGES:Record<Page,React.ReactNode>={
    home:          <HomePage go={go}/>,
    packages:      <PackagesPage go={go}/>,
    solutions:     <SolutionsPage go={go}/>,
    industries:    <IndustriesPage go={go}/>,
    process:       <ProcessPage go={go}/>,
    "case-studies":<CaseStudiesPage go={go}/>,
    about:         <AboutPage go={go}/>,
    contact:       <ContactPage/>,
  };
  return(
    <div style={{fontFamily:FONT}} className="overflow-x-hidden">
      <style>{GLOBAL_CSS}</style>
      <ProgressBar/>
      <Nav current={page} go={go}/>
      <main role="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{opacity:0,y:10}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-8}}
            transition={{duration:.22,ease:"easeOut"}}>
            {PAGES[page]}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer go={go}/>

      {/* WhatsApp FAB — mobile only */}
      <motion.a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{scale:0,opacity:0}}
        animate={{scale:1,opacity:1}}
        transition={{delay:.8,type:"spring",stiffness:200}}
        whileHover={{scale:1.1}}
        whileTap={{scale:.95}}
        className="fixed bottom-6 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl lg:hidden ax-safe-bottom"
        style={{background:"#25D366",boxShadow:"0 8px 32px rgba(37,211,102,.45)"}}>
        <MessageSquare size={22} className="text-white"/>
      </motion.a>

      {/* Scroll-to-top button — desktop */}
      <ScrollToTop/>
    </div>
  );
}
