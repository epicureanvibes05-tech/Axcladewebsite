import React, {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Globe,
  Headphones,
  Mail,
  MessageCircleMore,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import chatbotIcon from "../../../../Public/Assets/chatbot/axclade-chatbot-icon.png";

type PageKey =
  | "home"
  | "packages"
  | "solutions"
  | "industries"
  | "process"
  | "case-studies"
  | "about"
  | "contact";

type Language = "en";
type QuickAction =
  | "services"
  | "package"
  | "quote"
  | "call"
  | "support"
  | "expert";

type MessageForm = "package" | "quote" | "booking" | "support" | "handoff";

type LeadType = "package_recommendation" | "quote_request" | "consultation_booking" | "support_request" | "human_handoff";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  quickActions?: QuickAction[];
  form?: MessageForm;
  tone?: "default" | "success" | "thinking";
};

type ChatbotProps = {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
};

type PackageFormData = {
  name: string;
  email: string;
  businessType: string;
  companySize: string;
  monthlyBudget: string;
  challenge: string;
  goal: string;
  website: string;
  honeypot: string;
};

type QuoteFormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  businessType: string;
  service: string;
  budget: string;
  details: string;
  honeypot: string;
};

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  topic: string;
  notes: string;
  honeypot: string;
};

type SupportFormData = {
  name: string;
  email: string;
  category: string;
  priority: string;
  issue: string;
  website: string;
  honeypot: string;
};

const FONT = "'Plus Jakarta Sans', sans-serif";
const COLORS = {
  red: "#FF4E45",
  redDeep: "#FF3B30",
  navy: "#0A1330",
  muted: "#647089",
  soft: "#F5F7FB",
  border: "#E5EAF3",
  blue: "#4361EE",
  success: "#22C55E",
  glass: "rgba(255,255,255,.82)",
  glassStrong: "rgba(255,255,255,.94)",
};

const STORAGE_KEY = "axclade-ai-chatbot-history-v1";
const LEAD_STORAGE_KEY = "axclade-ai-chatbot-leads-v1";
const RATE_LIMIT_KEY = "axclade-ai-chatbot-rate-limit-v1";
const WHATSAPP_URL = "https://wa.me/";
const EMAIL_ADDRESS = "hello@axclade.com";
const MAX_MESSAGES_PER_MINUTE = 8;

const QUICK_ACTION_LABELS: Record<QuickAction, { en: string; ur: string }> = {
  services: { en: "View Services", ur: "Services Dekhein" },
  package: { en: "Recommend a Package", ur: "Package Recommend Karein" },
  quote: { en: "Get a Quote", ur: "Quote Lein" },
  call: { en: "Book a Call", ur: "Call Book Karein" },
  support: { en: "Contact Support", ur: "Support Se Rabta" },
  expert: { en: "Talk to an Expert", ur: "Expert Se Baat Karein" },
};

const SERVICE_SUMMARY = [
  "Website Development",
  "Business Websites",
  "Landing Pages",
  "UI/UX Design",
  "Brand Development",
  "Social Media Management",
  "Digital Marketing",
  "SEO",
  "Growth Solutions",
  "Business Automation",
  "Creative Design",
  "AI Automation",
  "SaaS Product Development",
] as const;

const FAQ_RESPONSES = [
  {
    keywords: ["website", "web", "landing page"],
    en: "Axclade designs business websites, landing pages, e-commerce experiences, and conversion-focused redesigns. If your goal is credibility plus lead generation, website development is usually the best starting point.",
    ur: "Axclade business websites, landing pages, e-commerce experiences aur conversion-focused redesigns banata hai. Agar aap ka goal credibility aur lead generation hai to website development aksar sab se behtareen starting point hota hai.",
  },
  {
    keywords: ["seo", "google", "ranking", "search"],
    en: "For long-term visibility, we usually combine technical SEO, content structure, speed optimization, and conversion tracking. If you'd like, I can point you toward the most suitable package or custom SEO-focused solution.",
    ur: "Long-term visibility ke liye hum aam tor par technical SEO, content structure, speed optimization aur conversion tracking ko combine karte hain. Agar aap chahein to main aap ke liye suitable package ya SEO-focused custom solution recommend kar sakta hun.",
  },
  {
    keywords: ["social", "instagram", "facebook", "content"],
    en: "Axclade can support social media strategy, branded content, campaign creatives, and performance marketing. This works especially well for salons, restaurants, local brands, and e-commerce businesses.",
    ur: "Axclade social media strategy, branded content, campaign creatives aur performance marketing mein madad karta hai. Ye khas tor par salons, restaurants, local brands aur e-commerce businesses ke liye bohat achha kaam karta hai.",
  },
  {
    keywords: ["automation", "ai", "chatbot", "crm", "whatsapp"],
    en: "Axclade builds AI chatbots, WhatsApp automation, CRM workflows, lead follow-up systems, and internal automations. If your team is losing time on repetitive work, automation is often the fastest ROI opportunity.",
    ur: "Axclade AI chatbots, WhatsApp automation, CRM workflows, lead follow-up systems aur internal automations build karta hai. Agar aap ki team repetitive kaam mein time lose kar rahi hai to automation aksar sab se tez ROI opportunity hoti hai.",
  },
  {
    keywords: ["support", "hosting", "domain", "technical", "bug"],
    en: "I can help route website support, hosting support, domain support, technical issues, revision requests, and general questions. If this is urgent, open the support form and I will structure the request properly.",
    ur: "Main website support, hosting support, domain support, technical issues, revision requests aur general questions ko sahi category mein route kar sakta hun. Agar ye urgent hai to support form khol kar request proper tareeqe se submit karein.",
  },
];

const PACKAGE_COPY = {
  starter: {
    label: "Starter",
    en: "Best for small businesses that need a focused digital starting point with one core growth priority.",
    ur: "Chhote businesses ke liye jo ek focused digital starting point aur ek core growth priority chahte hain.",
  },
  growth: {
    label: "Growth",
    en: "Best for brands that want stronger lead generation, better positioning, and a more consistent monthly system.",
    ur: "Un brands ke liye jo stronger lead generation, better positioning aur zyada consistent monthly system chahte hain.",
  },
  professional: {
    label: "Professional",
    en: "Best for scaling businesses that need performance marketing, automation, and higher-volume execution.",
    ur: "Scaling businesses ke liye jo performance marketing, automation aur higher-volume execution chahte hain.",
  },
  enterprise: {
    label: "Enterprise",
    en: "Best for advanced brands that need custom software, AI systems, SaaS products, or multi-layer growth support.",
    ur: "Advanced brands ke liye jo custom software, AI systems, SaaS products ya multi-layer growth support chahte hain.",
  },
} as const;

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function sanitizeInput(value: string, limit = 500) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function detectLanguage(value: string): Language {
  return "en";
}

function formatLeadSummary(type: LeadType, payload: Record<string, string>) {
  const fields = Object.entries(payload)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
  return {
    id: createId(),
    type,
    createdAt: new Date().toISOString(),
    fields,
  };
}

function loadStoredMessages() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed.slice(-24) : null;
  } catch {
    return null;
  }
}

function persistMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-24)));
  } catch {
    // Ignore local storage failures.
  }
}

async function persistLeadSecurely(lead: ReturnType<typeof formatLeadSummary>, language: Language, page: PageKey) {
  if (typeof window === "undefined") return;

  try {
    const previous = JSON.parse(window.localStorage.getItem(LEAD_STORAGE_KEY) ?? "[]");
    window.localStorage.setItem(
      LEAD_STORAGE_KEY,
      JSON.stringify([...previous, { ...lead, language, page }].slice(-40)),
    );
  } catch {
    // Ignore local storage failures.
  }

  const remoteEndpoint = (window as Window & { AXCLADE_CHATBOT_API?: string }).AXCLADE_CHATBOT_API;
  if (!remoteEndpoint) return;

  try {
    await fetch(remoteEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "AxcladeChatbot",
      },
      body: JSON.stringify({ ...lead, language, page }),
      credentials: "same-origin",
    });
  } catch {
    // Keep local capture if remote submission is unavailable.
  }
}

function isRateLimited() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();
    const entries = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = entries.filter((entry) => now - entry < 60_000);
    window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify([...recent, now]));
    return recent.length >= MAX_MESSAGES_PER_MINUTE;
  } catch {
    return false;
  }
}

function recommendPackage(data: PackageFormData) {
  let packageKey: keyof typeof PACKAGE_COPY = "starter";
  let score = 0;
  const budget = data.monthlyBudget.toLowerCase();
  const company = data.companySize.toLowerCase();
  const challenge = `${data.challenge} ${data.goal}`.toLowerCase();

  if (budget.includes("1500") || budget.includes("custom")) score += 4;
  else if (budget.includes("700")) score += 3;
  else if (budget.includes("300")) score += 2;
  else score += 1;

  if (company.includes("20+") || company.includes("50+")) score += 4;
  else if (company.includes("11") || company.includes("20")) score += 3;
  else if (company.includes("6") || company.includes("10")) score += 2;
  else score += 1;

  if (/(automation|software|saas|crm|platform|custom)/.test(challenge)) score += 4;
  else if (/(seo|ads|growth|lead|sales|branding)/.test(challenge)) score += 2;

  if (score >= 10) packageKey = "enterprise";
  else if (score >= 7) packageKey = "professional";
  else if (score >= 5) packageKey = "growth";

  return packageKey;
}

function buildRecommendationText(data: PackageFormData, language: Language) {
  const packageKey = recommendPackage(data);
  const packageInfo = PACKAGE_COPY[packageKey];
  const reasonEn = `Based on your business type (${data.businessType || "noted"}), company size (${data.companySize || "noted"}), budget (${data.monthlyBudget || "noted"}), and your main goal (${data.goal || "growth"}), I recommend the ${packageInfo.label} package. ${packageInfo.en}`;
  const reasonUr = `Aap ke business type (${data.businessType || "noted"}), company size (${data.companySize || "noted"}), budget (${data.monthlyBudget || "noted"}) aur main goal (${data.goal || "growth"}) ko dekhte hue main ${packageInfo.label} package recommend karta hun. ${packageInfo.ur}`;
  return {
    packageKey,
    text: language === "ur" ? reasonUr : reasonEn,
  };
}

function getWelcomeMessages(language: Language): ChatMessage[] {
  return [
    {
      id: createId(),
      role: "bot",
      tone: "default",
      text:
        language === "ur"
          ? "Axclade mein khush aamdeed.\n\nMain aap ka AI Growth Assistant hun.\n\nMain aap ki madad kar sakta hun:\n• Sahi service choose karne mein\n• Suitable package recommend karne mein\n• Quote request karne mein\n• Consultation book karne mein\n• Technical support lene mein\n• Business growth sawalon ke jawab dene mein"
          : "Welcome to Axclade.\n\nI'm your AI Growth Assistant.\n\nI can help you:\n• Find the right service\n• Recommend packages\n• Request a quotation\n• Book a consultation\n• Get technical support\n• Answer business growth questions",
      quickActions: ["services", "package", "quote", "call", "support", "expert"],
    },
  ];
}

function getPageContext(page: PageKey, language: Language) {
  const english: Record<PageKey, string> = {
    home: "You're on the homepage, so I can quickly guide you toward services, packages, or a consultation.",
    packages: "You're viewing packages, so I can compare Starter, Growth, Professional, and Enterprise for your business.",
    solutions: "You're on the digital solutions page, so I can help you decide between websites, apps, software, AI automation, and SaaS development.",
    industries: "You're on the industries page, so I can tailor recommendations around your business type.",
    process: "You're on the process page, so I can explain how Axclade works from discovery to launch and support.",
    "case-studies": "You're on the case studies page, so I can point you toward relevant project examples and expected outcomes.",
    about: "You're on the about page, so I can explain Axclade's approach and how we usually support clients.",
    contact: "You're on the contact page, so I can help you complete the right inquiry faster.",
  };
  const urdu: Record<PageKey, string> = {
    home: "Aap homepage par hain, is liye main aap ko services, packages ya consultation ki taraf jaldi guide kar sakta hun.",
    packages: "Aap packages page par hain, is liye main Starter, Growth, Professional aur Enterprise ko compare karke suggest kar sakta hun.",
    solutions: "Aap digital solutions page par hain, is liye main websites, apps, software, AI automation aur SaaS development mein se behtareen option choose karne mein madad kar sakta hun.",
    industries: "Aap industries page par hain, is liye main aap ke business type ke mutabiq recommendation de sakta hun.",
    process: "Aap process page par hain, is liye main discovery se launch aur support tak Axclade ka workflow explain kar sakta hun.",
    "case-studies": "Aap case studies page par hain, is liye main relevant project examples aur expected outcomes highlight kar sakta hun.",
    about: "Aap about page par hain, is liye main Axclade ka approach aur support style explain kar sakta hun.",
    contact: "Aap contact page par hain, is liye main sahi inquiry ko jaldi complete karne mein madad kar sakta hun.",
  };
  return language === "ur" ? urdu[page] : english[page];
}

function buildGeneralResponse(input: string, language: Language, currentPage: PageKey) {
  const normalized = input.toLowerCase();

  if (/(hi|hello|hey|salam|assalam)/.test(normalized)) {
    return {
      text:
        language === "ur"
          ? `Salam. ${getPageContext(currentPage, language)}`
          : `Hello. ${getPageContext(currentPage, language)}`,
      quickActions: ["services", "package", "quote", "call", "support", "expert"] as QuickAction[],
    };
  }

  for (const item of FAQ_RESPONSES) {
    if (item.keywords.some((keyword) => normalized.includes(keyword))) {
      return {
        text: language === "ur" ? item.ur : item.en,
        quickActions: /(support|hosting|domain|technical|bug)/.test(normalized)
          ? (["support", "expert"] as QuickAction[])
          : (["package", "quote", "call"] as QuickAction[]),
      };
    }
  }

  if (/(price|cost|pricing|quote|budget)/.test(normalized)) {
    return {
      text:
        language === "ur"
          ? "Main aap ke liye structured quote request tayar kar sakta hun. Kuch basic details mil jayen to main service, budget aur goals ke mutabiq best path suggest kar dunga."
          : "I can structure a quote request for you. Once I have a few basics, I can guide you toward the right service, budget range, and next step.",
      form: "quote" as MessageForm,
    };
  }

  if (/(book|call|consult|meeting)/.test(normalized)) {
    return {
      text:
        language === "ur"
          ? "Zaroor. Main discovery call request ko organize kar deta hun taa ke Axclade team sahi context ke sath aap se rabta kare."
          : "Absolutely. I can organize your discovery call request so the Axclade team reaches out with the right context.",
      form: "booking" as MessageForm,
    };
  }

  if (/(human|expert|person|specialist|agent)/.test(normalized)) {
    return {
      text:
        language === "ur"
          ? "Main aap ko Axclade specialist se connect karwa deta hun. Neeche short handoff submit karein ya seedha WhatsApp / contact page open kar dein."
          : "I'll connect you with an Axclade specialist. Submit the short handoff below, or jump straight to WhatsApp or the contact page.",
      form: "handoff" as MessageForm,
    };
  }

  return {
    text:
      language === "ur"
        ? `Main aap ki madad kar سکتا hun services, packages, quotes, support aur consultations mein. ${getPageContext(currentPage, language)} Sab se tez next step ke liye aap package recommendation, quote ya expert handoff choose kar sakte hain.`
        : `I can help with services, package recommendations, quotations, support, and consultations. ${getPageContext(currentPage, language)} For the fastest next step, choose package recommendation, quote, or expert handoff.`,
    quickActions: ["package", "quote", "call", "expert"] as QuickAction[],
  };
}

function QuickActionChip({
  action,
  language,
  onClick,
}: {
  action: QuickAction;
  language: Language;
  onClick: (action: QuickAction) => void;
}) {
  const label = QUICK_ACTION_LABELS[action][language];
  return (
    <button
      type="button"
      onClick={() => onClick(action)}
      className="rounded-full border px-3 py-2 text-left text-xs font-semibold transition-all hover:-translate-y-[1px]"
      style={{
        fontFamily: FONT,
        color: COLORS.navy,
        background: "rgba(255,255,255,.9)",
        borderColor: COLORS.border,
        boxShadow: "0 12px 26px rgba(10,19,48,.06)",
      }}
    >
      {label}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontFamily: FONT,
        fontSize: 11,
        fontWeight: 700,
        color: COLORS.navy,
        display: "block",
        marginBottom: 6,
        letterSpacing: ".05em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all focus:ring-4"
      style={{
        fontFamily: FONT,
        borderColor: COLORS.border,
        color: COLORS.navy,
        background: "rgba(255,255,255,.95)",
        boxShadow: "0 1px 0 rgba(255,255,255,.8) inset",
      }}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all focus:ring-4"
      style={{
        fontFamily: FONT,
        borderColor: COLORS.border,
        color: COLORS.navy,
        background: "rgba(255,255,255,.95)",
        boxShadow: "0 1px 0 rgba(255,255,255,.8) inset",
        resize: "none",
      }}
    />
  );
}

function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all focus:ring-4"
      style={{
        fontFamily: FONT,
        borderColor: COLORS.border,
        color: COLORS.navy,
        background: "rgba(255,255,255,.95)",
        boxShadow: "0 1px 0 rgba(255,255,255,.8) inset",
      }}
    />
  );
}

export default function AxcladeChatbot({ currentPage, onNavigate }: ChatbotProps) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const language: Language = "en";
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStoredMessages() ?? getWelcomeMessages("en"));
  const [input, setInput] = useState("");
  const [activeForm, setActiveForm] = useState<MessageForm | null>(null);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [packageForm, setPackageForm] = useState<PackageFormData>({
    name: "",
    email: "",
    businessType: "",
    companySize: "",
    monthlyBudget: "",
    challenge: "",
    goal: "",
    website: "",
    honeypot: "",
  });
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    whatsapp: "",
    businessType: "",
    service: "",
    budget: "",
    details: "",
    honeypot: "",
  });
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    topic: "",
    notes: "",
    honeypot: "",
  });
  const [supportForm, setSupportForm] = useState<SupportFormData>({
    name: "",
    email: "",
    category: "",
    priority: "",
    issue: "",
    website: "",
    honeypot: "",
  });
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mountedRef = useRef(true);
  const deferredMessages = useMemo(() => messages, [messages]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    persistMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [deferredMessages, activeForm, submittingForm]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  useEffect(() => {
    if (open || messages.length > 1) return;
    setMessages(getWelcomeMessages("en"));
  }, [open, messages.length]);

  async function streamBotResponse({
    text,
    quickActions,
    form,
    tone = "default",
  }: {
    text: string;
    quickActions?: QuickAction[];
    form?: MessageForm;
    tone?: "default" | "success";
  }) {
    const thinkingId = createId();
    startTransition(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: thinkingId,
          role: "bot",
          text: language === "ur" ? "Thinking..." : "Thinking...",
          tone: "thinking",
        },
      ]);
    });

    await sleep(reduceMotion ? 120 : 800 + Math.round(Math.random() * 700));
    if (!mountedRef.current) return;

    setMessages((prev) => prev.filter((message) => message.id !== thinkingId));

    const botId = createId();
    startTransition(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: botId,
          role: "bot",
          text: "",
          tone,
        },
      ]);
    });

    if (reduceMotion) {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === botId ? { ...message, text, quickActions, form, tone } : message,
        ),
      );
      setActiveForm(form ?? null);
      return;
    }

    for (let index = 0; index <= text.length; index += 3) {
      await sleep(18 + Math.round(Math.random() * 18));
      if (!mountedRef.current) return;
      const next = text.slice(0, index);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === botId ? { ...message, text: next, tone } : message,
        ),
      );
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.id === botId ? { ...message, text, quickActions, form, tone } : message,
      ),
    );
    setActiveForm(form ?? null);
  }

  async function handleQuickAction(action: QuickAction) {
    const label = QUICK_ACTION_LABELS[action][language];
    setMessages((prev) => [...prev, { id: createId(), role: "user", text: label }]);

    if (action === "services") {
      setActiveForm(null);
      await streamBotResponse({
        text:
          language === "ur"
            ? `Axclade aap ko in core services mein support karta hai:\n• ${SERVICE_SUMMARY.join("\n• ")}\n\nAgar aap chahein to main aap ke liye best package recommend kar sakta hun ya custom quote structure kar sakta hun.`
            : `Axclade can support you with these core services:\n• ${SERVICE_SUMMARY.join("\n• ")}\n\nIf you'd like, I can also recommend the best package or structure a custom quote for you.`,
        quickActions: ["package", "quote", "call"],
      });
      return;
    }

    if (action === "package") {
      await streamBotResponse({
        text:
          language === "ur"
            ? "Perfect. Main aap ke liye smart package recommendation tayar karta hun. Neeche short details share karein."
            : "Perfect. I'll prepare a smart package recommendation for you. Share the short details below.",
        form: "package",
      });
      return;
    }

    if (action === "quote") {
      await streamBotResponse({
        text:
          language === "ur"
            ? "Sure. Neeche quote request form fill karein taa ke service scope aur budget ke mutabiq proper estimate ban sake."
            : "Sure. Complete the quote request below so we can shape the right estimate around your scope and budget.",
        form: "quote",
      });
      return;
    }

    if (action === "call") {
      await streamBotResponse({
        text:
          language === "ur"
            ? "Great choice. Main discovery call request ko organize kar deta hun."
            : "Great choice. I'll organize your discovery call request.",
        form: "booking",
      });
      return;
    }

    if (action === "support") {
      await streamBotResponse({
        text:
          language === "ur"
            ? "Main support request ko sahi category mein route kar deta hun taa ke Axclade team tezi se respond kare."
            : "I'll route the support request into the right category so the Axclade team can respond faster.",
        form: "support",
      });
      return;
    }

    await streamBotResponse({
      text:
        language === "ur"
          ? "Main aap ko Axclade specialist se connect karne ke liye short handoff collect karta hun. Aap chahein to contact page ya WhatsApp bhi open kar sakte hain."
          : "I'll collect a short handoff so an Axclade specialist can follow up properly. You can also jump to the contact page or WhatsApp anytime.",
      form: "handoff",
    });
  }

  async function handleSendMessage() {
    const clean = sanitizeInput(input, 280);
    if (!clean) return;
    if (isRateLimited()) {
      setInput("");
      await streamBotResponse({
        text:
          language === "ur"
            ? "Aap kaafi tezi se messages bhej rahe hain. Thori der mein dobara koshish karein, ya agar urgent ho to WhatsApp / contact page use karein."
            : "You're sending messages quite quickly. Please wait a moment and try again, or use WhatsApp / the contact page if this is urgent.",
        quickActions: ["support", "expert"],
      });
      return;
    }

    const nextLanguage = detectLanguage(clean);
    setMessages((prev) => [...prev, { id: createId(), role: "user", text: clean }]);
    setInput("");

    const response = buildGeneralResponse(clean, nextLanguage, currentPage);
    await streamBotResponse(response);
  }

  async function submitLead(
    type: LeadType,
    data: Record<string, string>,
    responseText: string,
    tone: "default" | "success" = "success",
    nextActions?: QuickAction[],
  ) {
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value, 220);
    }
    const lead = formatLeadSummary(type, sanitized);
    await persistLeadSecurely(lead, language, currentPage);
    setActiveForm(null);
    await streamBotResponse({ text: responseText, quickActions: nextActions, tone });
  }

  async function handlePackageSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (packageForm.honeypot) return;
    setSubmittingForm(true);
    const recommendation = buildRecommendationText(packageForm, language);
    await submitLead(
      "package_recommendation",
      packageForm,
      `${recommendation.text}\n\n${
        language === "ur"
          ? "Agar aap chahein to ab main is recommendation ke mutabiq quote ya consultation setup kar deta hun."
          : "If you'd like, I can now move this recommendation into a quote request or consultation booking."
      }`,
      "success",
      ["quote", "call", "expert"],
    );
    setSubmittingForm(false);
  }

  async function handleQuoteSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (quoteForm.honeypot) return;
    setSubmittingForm(true);
    await submitLead(
      "quote_request",
      quoteForm,
      language === "ur"
        ? "Aap ki quote request note kar li gayi hai. Axclade team service scope, budget aur business context ke mutabiq personalized estimate tayar karegi."
        : "Your quote request has been captured. The Axclade team will prepare a personalized estimate based on your scope, budget, and business context.",
      "success",
      ["call", "expert"],
    );
    setSubmittingForm(false);
  }

  async function handleBookingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (bookingForm.honeypot) return;
    setSubmittingForm(true);
    await submitLead(
      "consultation_booking",
      bookingForm,
      language === "ur"
        ? "Discovery call request receive ho gayi hai. Axclade team aap ke preferred date aur time ke mutabiq follow-up karegi."
        : "Your discovery call request has been received. The Axclade team will follow up around your preferred date and time.",
      "success",
      ["quote", "expert"],
    );
    setSubmittingForm(false);
  }

  async function handleSupportSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (supportForm.honeypot) return;
    setSubmittingForm(true);
    await submitLead(
      "support_request",
      supportForm,
      language === "ur"
        ? "Support request submit ho gayi hai. Agar issue urgent hai to main recommend karunga ke aap WhatsApp ya contact page se bhi human specialist ko ping kar dein."
        : "Your support request has been submitted. If the issue is urgent, I also recommend pinging a human specialist through WhatsApp or the contact page.",
      "success",
      ["support", "expert"],
    );
    setSubmittingForm(false);
  }

  async function handleHandoffSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (supportForm.honeypot) return;
    setSubmittingForm(true);
    await submitLead(
      "human_handoff",
      supportForm,
      language === "ur"
        ? "Main aap ko Axclade specialist ke liye queue kar raha hun. Behtareen assistance ke liye aap ab contact page open karein ya WhatsApp use karein."
        : "I'm queuing this for an Axclade specialist. For the fastest assistance, you can now open the contact page or continue through WhatsApp.",
      "success",
      ["expert", "call"],
    );
    setSubmittingForm(false);
  }

  const panelTitle = language === "ur" ? "Axclade AI Growth Assistant" : "Axclade AI Growth Assistant";
  const inputPlaceholder =
    language === "ur"
      ? "Apna sawal ya requirement likhein..."
      : "Ask about services, packages, quotes, or support...";

  function renderActiveForm() {
    if (!activeForm) return null;

    if (activeForm === "package") {
      return (
        <form onSubmit={handlePackageSubmit} className="mt-3 space-y-3 rounded-[26px] border p-4" style={{ background: "rgba(245,247,251,.92)", borderColor: COLORS.border }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>{language === "ur" ? "Name" : "Name"}</FieldLabel>
              <TextInput value={packageForm.name} onChange={(e) => setPackageForm((prev) => ({ ...prev, name: e.target.value }))} required />
            </div>
            <div>
              <FieldLabel>{language === "ur" ? "Email" : "Email"}</FieldLabel>
              <TextInput type="email" value={packageForm.email} onChange={(e) => setPackageForm((prev) => ({ ...prev, email: e.target.value }))} required />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>{language === "ur" ? "Business Type" : "Business Type"}</FieldLabel>
              <TextInput value={packageForm.businessType} onChange={(e) => setPackageForm((prev) => ({ ...prev, businessType: e.target.value }))} placeholder="SaaS, restaurant, clinic..." required />
            </div>
            <div>
              <FieldLabel>{language === "ur" ? "Company Size" : "Company Size"}</FieldLabel>
              <SelectInput value={packageForm.companySize} onChange={(e) => setPackageForm((prev) => ({ ...prev, companySize: e.target.value }))} required>
                <option value="">Select...</option>
                <option>1-5 team members</option>
                <option>6-10 team members</option>
                <option>11-20 team members</option>
                <option>20+ team members</option>
              </SelectInput>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>{language === "ur" ? "Monthly Budget" : "Monthly Budget"}</FieldLabel>
              <SelectInput value={packageForm.monthlyBudget} onChange={(e) => setPackageForm((prev) => ({ ...prev, monthlyBudget: e.target.value }))} required>
                <option value="">Select...</option>
                <option>Under $300/month</option>
                <option>$300-$700/month</option>
                <option>$700-$1,500/month</option>
                <option>$1,500+/month</option>
                <option>Custom project budget</option>
              </SelectInput>
            </div>
            <div>
              <FieldLabel>{language === "ur" ? "Main Goal" : "Main Goal"}</FieldLabel>
              <TextInput value={packageForm.goal} onChange={(e) => setPackageForm((prev) => ({ ...prev, goal: e.target.value }))} placeholder="More leads, more sales..." required />
            </div>
          </div>
          <div>
            <FieldLabel>{language === "ur" ? "Current Challenge" : "Current Challenge"}</FieldLabel>
            <TextArea rows={3} value={packageForm.challenge} onChange={(e) => setPackageForm((prev) => ({ ...prev, challenge: e.target.value }))} placeholder="Tell me what's blocking growth right now..." required />
          </div>
          <input tabIndex={-1} aria-hidden="true" className="hidden" value={packageForm.honeypot} onChange={(e) => setPackageForm((prev) => ({ ...prev, honeypot: e.target.value }))} />
          <SubmitRow submitting={submittingForm} language={language} submitLabel={language === "ur" ? "Recommendation Banayein" : "Generate Recommendation"} />
        </form>
      );
    }

    if (activeForm === "quote") {
      return (
        <form onSubmit={handleQuoteSubmit} className="mt-3 space-y-3 rounded-[26px] border p-4" style={{ background: "rgba(245,247,251,.92)", borderColor: COLORS.border }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><FieldLabel>Name</FieldLabel><TextInput value={quoteForm.name} onChange={(e) => setQuoteForm((prev) => ({ ...prev, name: e.target.value }))} required /></div>
            <div><FieldLabel>Company</FieldLabel><TextInput value={quoteForm.company} onChange={(e) => setQuoteForm((prev) => ({ ...prev, company: e.target.value }))} required /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><FieldLabel>Email</FieldLabel><TextInput type="email" value={quoteForm.email} onChange={(e) => setQuoteForm((prev) => ({ ...prev, email: e.target.value }))} required /></div>
            <div><FieldLabel>WhatsApp / Phone</FieldLabel><TextInput value={quoteForm.whatsapp} onChange={(e) => setQuoteForm((prev) => ({ ...prev, whatsapp: e.target.value }))} required /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>Service</FieldLabel>
              <SelectInput value={quoteForm.service} onChange={(e) => setQuoteForm((prev) => ({ ...prev, service: e.target.value }))} required>
                <option value="">Select...</option>
                {SERVICE_SUMMARY.map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Budget Range</FieldLabel>
              <SelectInput value={quoteForm.budget} onChange={(e) => setQuoteForm((prev) => ({ ...prev, budget: e.target.value }))} required>
                <option value="">Select...</option>
                <option>Under $300/month</option>
                <option>$300-$700/month</option>
                <option>$700-$1,500/month</option>
                <option>$1,500+/month</option>
                <option>Custom project budget</option>
              </SelectInput>
            </div>
          </div>
          <div><FieldLabel>Project Details</FieldLabel><TextArea rows={3} value={quoteForm.details} onChange={(e) => setQuoteForm((prev) => ({ ...prev, details: e.target.value }))} required /></div>
          <input tabIndex={-1} aria-hidden="true" className="hidden" value={quoteForm.honeypot} onChange={(e) => setQuoteForm((prev) => ({ ...prev, honeypot: e.target.value }))} />
          <SubmitRow submitting={submittingForm} language={language} submitLabel={language === "ur" ? "Quote Request Submit Karein" : "Submit Quote Request"} />
        </form>
      );
    }

    if (activeForm === "booking") {
      return (
        <form onSubmit={handleBookingSubmit} className="mt-3 space-y-3 rounded-[26px] border p-4" style={{ background: "rgba(245,247,251,.92)", borderColor: COLORS.border }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><FieldLabel>Name</FieldLabel><TextInput value={bookingForm.name} onChange={(e) => setBookingForm((prev) => ({ ...prev, name: e.target.value }))} required /></div>
            <div><FieldLabel>Email</FieldLabel><TextInput type="email" value={bookingForm.email} onChange={(e) => setBookingForm((prev) => ({ ...prev, email: e.target.value }))} required /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><FieldLabel>Preferred Date</FieldLabel><TextInput type="date" value={bookingForm.preferredDate} onChange={(e) => setBookingForm((prev) => ({ ...prev, preferredDate: e.target.value }))} required /></div>
            <div><FieldLabel>Preferred Time</FieldLabel><TextInput type="time" value={bookingForm.preferredTime} onChange={(e) => setBookingForm((prev) => ({ ...prev, preferredTime: e.target.value }))} required /></div>
          </div>
          <div><FieldLabel>Focus Area</FieldLabel><TextInput value={bookingForm.topic} onChange={(e) => setBookingForm((prev) => ({ ...prev, topic: e.target.value }))} placeholder="Packages, website, AI automation..." required /></div>
          <div><FieldLabel>Notes</FieldLabel><TextArea rows={3} value={bookingForm.notes} onChange={(e) => setBookingForm((prev) => ({ ...prev, notes: e.target.value }))} /></div>
          <input tabIndex={-1} aria-hidden="true" className="hidden" value={bookingForm.honeypot} onChange={(e) => setBookingForm((prev) => ({ ...prev, honeypot: e.target.value }))} />
          <SubmitRow submitting={submittingForm} language={language} submitLabel={language === "ur" ? "Call Request Submit Karein" : "Submit Call Request"} />
        </form>
      );
    }

    if (activeForm === "support" || activeForm === "handoff") {
      const submit = activeForm === "support" ? handleSupportSubmit : handleHandoffSubmit;
      return (
        <form onSubmit={submit} className="mt-3 space-y-3 rounded-[26px] border p-4" style={{ background: "rgba(245,247,251,.92)", borderColor: COLORS.border }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><FieldLabel>Name</FieldLabel><TextInput value={supportForm.name} onChange={(e) => setSupportForm((prev) => ({ ...prev, name: e.target.value }))} required /></div>
            <div><FieldLabel>Email</FieldLabel><TextInput type="email" value={supportForm.email} onChange={(e) => setSupportForm((prev) => ({ ...prev, email: e.target.value }))} required /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel>{activeForm === "support" ? "Support Category" : "Need Help With"}</FieldLabel>
              <SelectInput value={supportForm.category} onChange={(e) => setSupportForm((prev) => ({ ...prev, category: e.target.value }))} required>
                <option value="">Select...</option>
                <option>Website Support</option>
                <option>Hosting Support</option>
                <option>Domain Support</option>
                <option>Technical Support</option>
                <option>Revision Requests</option>
                <option>General Questions</option>
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Priority</FieldLabel>
              <SelectInput value={supportForm.priority} onChange={(e) => setSupportForm((prev) => ({ ...prev, priority: e.target.value }))} required>
                <option value="">Select...</option>
                <option>Standard</option>
                <option>Important</option>
                <option>Urgent</option>
              </SelectInput>
            </div>
          </div>
          <div><FieldLabel>Details</FieldLabel><TextArea rows={3} value={supportForm.issue} onChange={(e) => setSupportForm((prev) => ({ ...prev, issue: e.target.value }))} required /></div>
          <input tabIndex={-1} aria-hidden="true" className="hidden" value={supportForm.honeypot} onChange={(e) => setSupportForm((prev) => ({ ...prev, honeypot: e.target.value }))} />
          <SubmitRow submitting={submittingForm} language={language} submitLabel={activeForm === "support" ? (language === "ur" ? "Support Submit Karein" : "Submit Support Request") : (language === "ur" ? "Expert Handoff Submit Karein" : "Submit Expert Handoff")} />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
              style={{ fontFamily: FONT, background: "rgba(37,211,102,.12)", color: "#128C7E" }}
            >
              <MessageCircleMore size={14} /> WhatsApp
            </button>
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
              style={{ fontFamily: FONT, background: "rgba(67,97,238,.10)", color: COLORS.blue }}
            >
              <ArrowRight size={14} /> {language === "ur" ? "Contact Page" : "Contact Page"}
            </button>
          </div>
        </form>
      );
    }

    return null;
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[74] bg-[rgba(10,19,48,.32)] backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-0"
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={panelTitle}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 top-0 z-[75] flex flex-col overflow-hidden rounded-none border lg:bottom-6 lg:left-auto lg:right-6 lg:top-auto lg:h-[min(82vh,760px)] lg:w-[420px] lg:rounded-[34px]"
            onClick={(event) => event.stopPropagation()}
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,.96) 0%, rgba(247,248,252,.98) 100%)",
              borderColor: "rgba(255,255,255,.72)",
              boxShadow: "0 32px 90px rgba(10,19,48,.20), inset 0 1px 0 rgba(255,255,255,.8)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
          >
            <div className="relative overflow-hidden border-b px-4 pb-4 pt-4 lg:px-5" style={{ borderColor: "rgba(229,234,243,.9)" }}>
              <div className="absolute inset-x-0 top-0 h-28 opacity-80" style={{ background: "radial-gradient(circle at top right, rgba(255,78,69,.16), rgba(255,78,69,0) 44%), radial-gradient(circle at top left, rgba(67,97,238,.14), rgba(67,97,238,0) 42%)" }} />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px]" style={{ background: "rgba(255,255,255,.92)", boxShadow: "0 10px 24px rgba(10,19,48,.10)" }}>
                    <img
                      src={chatbotIcon}
                      alt="Axclade chatbot icon"
                      loading="eager"
                      decoding="async"
                      className="h-9 w-9 object-contain"
                      style={{ display: "block", opacity: 1 }}
                      onLoad={(event) => {
                        event.currentTarget.classList.add("loaded");
                        event.currentTarget.style.opacity = "1";
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: COLORS.navy }}>{panelTitle}</div>
                    <div className="mt-1 flex items-center gap-2" style={{ fontFamily: FONT, fontSize: 12, color: COLORS.muted }}>
                      <span className="inline-flex h-2 w-2 rounded-full" style={{ background: COLORS.success, boxShadow: "0 0 0 5px rgba(34,197,94,.12)" }} />
                      Sales, support, quotes, packages
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border"
                    style={{ color: COLORS.navy, borderColor: COLORS.border, background: "rgba(255,255,255,.86)" }}
                    aria-label="Close Axclade AI Growth Assistant"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto px-4 pb-4 pt-4 lg:px-5" aria-live="polite">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[88%] rounded-[24px] px-4 py-3"
                      style={{
                        background:
                          message.role === "user"
                            ? "linear-gradient(135deg, #FF4E45 0%, #FF3B30 100%)"
                            : message.tone === "thinking"
                              ? "rgba(255,255,255,.84)"
                              : message.tone === "success"
                                ? "linear-gradient(180deg, rgba(255,255,255,.95) 0%, rgba(244,251,246,.96) 100%)"
                                : "rgba(255,255,255,.9)",
                        color: message.role === "user" ? "#fff" : COLORS.navy,
                        border:
                          message.role === "user"
                            ? "1px solid rgba(255,78,69,.3)"
                            : `1px solid ${message.tone === "success" ? "rgba(34,197,94,.18)" : "rgba(229,234,243,.9)"}`,
                        boxShadow: "0 18px 42px rgba(10,19,48,.08)",
                      }}
                    >
                      {message.tone === "thinking" ? (
                        <div className="flex items-center gap-2">
                          <TypingDots />
                          <span style={{ fontFamily: FONT, fontSize: 12.5, color: COLORS.muted }}>Thinking...</span>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontFamily: FONT,
                            fontSize: 13.5,
                            lineHeight: 1.7,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {message.text}
                        </div>
                      )}

                      {message.quickActions?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.quickActions.map((action) => (
                            <QuickActionChip key={`${message.id}-${action}`} action={action} language={language} onClick={handleQuickAction} />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {renderActiveForm()}

              <div className="mt-4 rounded-[24px] border px-4 py-3" style={{ background: "rgba(255,255,255,.74)", borderColor: COLORS.border }}>
                <div className="flex flex-wrap items-center gap-2" style={{ fontFamily: FONT, fontSize: 11.5, color: COLORS.muted }}>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "rgba(255,78,69,.08)", color: COLORS.red }}>
                    <ShieldCheck size={12} /> Sanitized inputs
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "rgba(67,97,238,.08)", color: COLORS.blue }}>
                    <Zap size={12} /> Lazy-loaded
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "rgba(34,197,94,.08)", color: COLORS.success }}>
                    <Headphones size={12} /> Human handoff ready
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t px-4 pb-4 pt-3 lg:px-5" style={{ borderColor: "rgba(229,234,243,.9)" }}>
              <div className="mb-3 flex flex-wrap gap-2">
                {(["services", "package", "quote"] as QuickAction[]).map((action) => (
                  <QuickActionChip key={`footer-${action}`} action={action} language={language} onClick={handleQuickAction} />
                ))}
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1 rounded-[26px] border bg-white/90 px-3 py-2.5" style={{ borderColor: COLORS.border }}>
                  <label htmlFor="axclade-chat-input" className="sr-only">
                    {panelTitle}
                  </label>
                  <input
                    id="axclade-chat-input"
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSendMessage();
                      }
                    }}
                    maxLength={280}
                    placeholder={inputPlaceholder}
                    className="w-full border-none bg-transparent text-sm outline-none"
                    style={{ fontFamily: FONT, color: COLORS.navy }}
                  />
                  <div className="mt-1 flex items-center justify-between" style={{ fontFamily: FONT, fontSize: 11, color: COLORS.muted }}>
                    <span>English support</span>
                    <span>{input.length}/280</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleSendMessage()}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white transition-all hover:-translate-y-[1px]"
                  style={{ background: "linear-gradient(135deg, #FF4E45 0%, #FF3B30 100%)", boxShadow: "0 20px 42px rgba(255,78,69,.28)" }}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
                  style={{ fontFamily: FONT, background: "rgba(37,211,102,.12)", color: "#128C7E" }}
                >
                  <Phone size={13} /> WhatsApp
                </button>
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
                  style={{ fontFamily: FONT, background: "rgba(67,97,238,.10)", color: COLORS.blue }}
                >
                  <Mail size={13} /> Email
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate("contact")}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
                  style={{ fontFamily: FONT, background: "rgba(10,19,48,.06)", color: COLORS.navy }}
                >
                  <CalendarDays size={13} /> {language === "ur" ? "Contact Page" : "Contact Page"}
                </button>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.84, y: 12 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.45, type: "spring", stiffness: 220, damping: 18 }}
        aria-label="Open Axclade AI Growth Assistant"
        className="fixed bottom-24 right-5 z-[73] flex h-[96px] w-[96px] items-center justify-center lg:bottom-6 lg:right-6"
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
        }}
      >
        <img
          src={chatbotIcon}
          alt="Axclade chatbot icon"
          loading="eager"
          decoding="async"
          className="h-[96px] w-[96px] object-contain"
          style={{ display: "block", opacity: 1, filter: "drop-shadow(0 18px 28px rgba(10,19,48,.24))" }}
          onLoad={(event) => {
            event.currentTarget.classList.add("loaded");
            event.currentTarget.style.opacity = "1";
          }}
        />
      </motion.button>
    </>
  );
}

function SubmitRow({
  submitting,
  language,
  submitLabel,
}: {
  submitting: boolean;
  language: Language;
  submitLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-1">
      <div style={{ fontFamily: FONT, fontSize: 11.5, color: COLORS.muted }}>
        {language === "ur"
          ? "Secure capture, spam protection, human follow-up ready"
          : "Secure capture, spam protection, human follow-up ready"}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
        style={{ fontFamily: FONT, background: "linear-gradient(135deg, #FF4E45 0%, #FF3B30 100%)", boxShadow: "0 18px 34px rgba(255,78,69,.22)" }}
      >
        {submitting ? (language === "ur" ? "Submitting..." : "Submitting...") : submitLabel}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          animate={{ opacity: [0.28, 1, 0.28], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.12, ease: "easeInOut" }}
          className="inline-flex h-2 w-2 rounded-full"
          style={{ background: COLORS.red }}
        />
      ))}
    </div>
  );
}

