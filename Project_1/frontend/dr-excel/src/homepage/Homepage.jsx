import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react"

const PUBLIC_IMAGES = {
  heroBg: '/hero-bg.png',
  landing: '/landing-img.png',
  smHero: '/sm-hero-img.png',
  custom_spreed_sheet_img: '/cus-spreed.jpg',
  automated_img: '/at-calc.jpg',
  financialDashboard: '/financial-management-system.jpg',
  process_automation: '/ps-at.jpg',
  timesheet: '/employee-timesheet-tracker.jpg',
  salesAnalytics: '/sales-analytics-dashboard.jpg',
  costEstimator: '/project-cost-estimator.jpg',
  business_template: '/bs-temp.jpg',
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}

function SectionHeader({ badge, title, subtitle, dark = false }) {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      className={`max-w-2xl ${visible ? 'section-reveal' : 'opacity-0'}`}
    >
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${dark ? 'bg-white/10 text-green-300' : 'bg-green-100 text-green-700'}`}>
        {badge}
      </span>
      <h2 className={`mt-4 text-3xl md:text-4xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
      <p className={`mt-3 text-base md:text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{subtitle}</p>
    </div>
  )
}

function RevealCard({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal()

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'section-reveal' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function UserProfileIcon({ className = "w-8 h-8" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
      <circle cx="12" cy="8" r="3.5" strokeWidth="1.5" />
      <path d="M5.5 20c0-3.5 2.5-5.5 6.5-5.5s6.5 2 6.5 5.5" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 18.5c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <nav className="w-full py-4 bg-white/5 backdrop-blur-sm absolute inset-x-0 top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/dr-excel-logo.png" alt="DR.EXCEL logo" className="h-10 w-10 object-contain" />
          <span className="text-white font-bold tracking-wider">DR.EXCEL</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-white">
          <a href="#home" className="px-3 py-1 rounded hover:bg-white/10 transition">Home</a>
          <a href="#services" className="px-3 py-1 rounded hover:bg-white/10 transition">Services</a>
          <a href="#benefits" className="px-3 py-1 rounded hover:bg-white/10 transition">Benefits</a>
          <a href="#projects" className="px-3 py-1 rounded hover:bg-white/10 transition">Projects</a>
          {/* Contact now matches other link styles */}
          <a href="#contact" className="px-3 py-1 rounded hover:bg-white/10 transition">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          {/* Profile avatar + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/20 focus:outline-none flex items-center justify-center bg-slate-700"
              aria-label="Profile"
            >
              <UserProfileIcon className="w-6 h-6 text-slate-300" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-slate-900 rounded-md shadow-lg ring-1 ring-black/10">
                <div className="py-1">
                  <SignedOut>
                    <Link to="/login" className="block px-4 py-2 text-sm hover:bg-slate-100">Sign in</Link>
                    <Link to="/signup" className="block px-4 py-2 text-sm hover:bg-slate-100">Sign up</Link>
                  </SignedOut>
                  <SignedIn>
                    <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-slate-100">Settings</Link>
                    <SignOutButton>
                      <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100">Sign out</button>
                    </SignOutButton>
                  </SignedIn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

const HERO_WORDS = ['Automate', 'Streamline', 'Optimize', 'Scale']

function Hero() {
  const bgUrl = PUBLIC_IMAGES.heroBg
  const highlights = [
    { label: 'Custom Dashboards', href: '#services' },
    { label: 'Process Automation', href: '#services' },
    { label: 'Business Templates', href: '#projects' },
    { label: 'Excel Training', href: '#contact' },
  ]

  const [wordIndex, setWordIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % HERO_WORDS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <header
      id="home"
      className="relative text-white min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundImage: `linear-gradient(rgba(2,6,23,0.28), rgba(2,6,23,0.48)), url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-green-400/10 blur-3xl" />

      <Nav />

      <div className="relative flex-1 flex items-center justify-center px-6 pt-28 pb-20">
        <div className="max-w-4xl w-full text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-green-300 backdrop-blur-sm ${mounted ? 'hero-animate' : 'opacity-0'}`}
            style={{ animationDelay: '0.1s' }}
          >
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            DR.EXCEL
          </div>

          <h1
            className={`mt-8 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight ${mounted ? 'hero-animate' : 'opacity-0'}`}
            style={{ animationDelay: '0.2s' }}
          >
            Excel Solutions That{' '}
            <span className="relative inline-flex h-[1.08em] min-w-[10.5ch] items-center justify-center overflow-hidden align-bottom">
              <span key={wordIndex} className="hero-word bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {HERO_WORDS[wordIndex]}
              </span>
            </span>
            <br className="hidden sm:block" />
            {' '}Your Business
          </h1>

          <p
            className={`mt-6 text-base md:text-lg lg:text-xl text-slate-200/90 max-w-2xl mx-auto leading-relaxed ${mounted ? 'hero-animate' : 'opacity-0'}`}
            style={{ animationDelay: '0.35s' }}
          >
            Professional Excel development to streamline workflows, eliminate manual work, and turn your data into clear, actionable insights.
          </p>

          <div
            className={`mt-10 flex flex-wrap items-center justify-center gap-4 ${mounted ? 'hero-animate' : 'opacity-0'}`}
            style={{ animationDelay: '0.5s' }}
          >
            <a
              href="#services"
              className="group relative overflow-hidden rounded-full bg-green-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition hover:-translate-y-0.5 hover:bg-green-400 hover:shadow-green-400/30"
            >
              <span className="relative z-10">View Services</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full duration-700" />
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
            >
              Get Started
            </a>
          </div>

          <div
            className={`mt-12 flex flex-wrap items-center justify-center gap-3 ${mounted ? 'hero-animate' : 'opacity-0'}`}
            style={{ animationDelay: '0.65s' }}
          >
            {highlights.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-green-400/10 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#services"
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-300/80 transition hover:text-green-300 ${mounted ? 'hero-scroll' : 'opacity-0'}`}
        aria-label="Scroll to services"
      >
        <span>Scroll</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
          <path d="M12 5v14M5 12l7 7 7-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </header>
  )
}

function Services() {
  const items = [
    {
      title: 'Custom Spreadsheet Development',
      desc: 'Tailored solutions designed specifically for your business needs and workflows.',
      tag: 'Most Popular',
      image: PUBLIC_IMAGES.custom_spreed_sheet_img,
    },
    {
      title: 'Automated Calculations',
      desc: 'Complex formulas and automation to eliminate manual calculations and reduce errors.',
      tag: 'Automation',
      image: PUBLIC_IMAGES.automated_img,
    },
    {
      title: 'Dashboards & Reports',
      desc: 'Interactive dashboards with real-time data visualization for better decision-making.',
      tag: 'Analytics',
      image: PUBLIC_IMAGES.financialDashboard,
    },
    {
      title: 'Data Cleaning',
      desc: 'Transform messy data into organized, actionable information your team can trust.',
      tag: 'Data Ops',
      image: PUBLIC_IMAGES.salesAnalytics,
    },
    {
      title: 'Process Automation',
      desc: 'Automate repetitive tasks to save time and increase productivity across teams.',
      tag: 'Workflow',
      image: PUBLIC_IMAGES.process_automation,
    },
    {
      title: 'Business Templates',
      desc: 'Professional templates for invoices, budgets, cost estimates, and timesheets.',
      tag: 'Templates',
      image: PUBLIC_IMAGES.business_template,
    },
    {
      title: 'Excel Training & Support',
      desc: 'Comprehensive training to empower your team with practical Excel expertise.',
      tag: 'Support',
      image: PUBLIC_IMAGES.timesheet,
    },
  ]

  return (
    <section id="services" className="py-24 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          badge="Services"
          title="Everything you need to run smarter in Excel"
          subtitle="From one-off spreadsheets to full business systems, we build tools that feel polished, fast, and ready for daily use."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <RevealCard
              key={item.title}
              delay={i * 70}
              className="group card-shine rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-100/60"
            >
              <div className="relative h-44 overflow-hidden rounded-t-2xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-700">
                  {item.tag}
                </span>
                <h3 className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white">{item.title}</h3>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition group-hover:gap-3"
                >
                  Request this service
                  <span aria-hidden>→</span>
                </a>
              </div>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const items = [
    {
      title: 'Save Hours Every Week',
      desc: 'Cut repetitive manual work with automation built around how your team already operates.',
      stat: '3x faster',
    },
    {
      title: 'Fewer Costly Errors',
      desc: 'Validated formulas and structured workflows improve accuracy across reporting and operations.',
      stat: '99% accuracy',
    },
    {
      title: 'Built For Your Process',
      desc: 'No generic templates — every solution is shaped to match your business rules and goals.',
      stat: '100% custom',
    },
    {
      title: 'Lower Software Spend',
      desc: 'Get enterprise-level functionality inside Excel without expensive platform subscriptions.',
      stat: 'Cost smart',
    },
    {
      title: 'Team-Ready Delivery',
      desc: 'Clean layouts, documentation, and training so adoption is smooth from day one.',
      stat: 'Easy rollout',
    },
  ]

  return (
    <section id="benefits" className="relative py-24 bg-slate-950 text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <RevealCard className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <img
                src={PUBLIC_IMAGES.landing}
                alt="Excel dashboard preview"
                className="h-[28rem] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.25em] text-green-300">Live Preview</p>
                <p className="mt-2 text-lg font-semibold">Dashboards that update as your data changes</p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-green-400/20 blur-2xl" />
          </RevealCard>

          <div>
            <SectionHeader
              badge="Why Dr.Excel"
              title="Work faster, decide smarter, scale with confidence"
              subtitle="We combine spreadsheet expertise with product-level UX so your tools feel as refined as the apps your team uses every day."
              dark
            />

            <div className="mt-10 space-y-4">
              {items.map((item, i) => (
                <RevealCard
                  key={item.title}
                  delay={i * 80}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:border-green-400/30 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.desc}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-green-400/15 px-3 py-1 text-xs font-semibold text-green-300">
                      {item.stat}
                    </span>
                  </div>
                </RevealCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const projects = [
    {
      title: 'Financial Dashboard',
      desc: 'Automated financial reporting with real-time KPI tracking and budget analysis.',
      tags: ['KPI Tracking', 'Budgeting'],
      image: '/landing-img.png',
    },
    {
      title: 'Inventory Management',
      desc: 'Complete inventory tracking with automated reorder alerts and supplier management.',
      tags: ['Inventory', 'Alerts'],
      image: '/hero-bg.png',
    },
    {
      title: 'Timesheet Tracker',
      desc: 'Automated timesheet system with payroll calculations and attendance monitoring.',
      tags: ['Payroll', 'HR'],
      image: '/actual-bg.png',
    },
    {
      title: 'Sales Analytics',
      desc: 'Comprehensive sales tracking with performance metrics and trend analysis.',
      tags: ['Sales', 'Trends'],
      image: '/small-bg.png',
    },
    {
      title: 'Cost Estimator',
      desc: 'Dynamic cost estimation tool with material tracking and labor calculations.',
      tags: ['Estimation', 'Projects'],
      image: '/sm-hero-img.png',
    },
    {
      title: 'Invoice Generator',
      desc: 'Professional invoice system with automated calculations and client database.',
      tags: ['Billing', 'Clients'],
      image: '/landing-img.png',
    },
  ]

  const [active, setActive] = useState(0)

  return (
    <section id="projects" className="py-24 bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          badge="Portfolio"
          title="Featured projects built for real businesses"
          subtitle="Explore sample builds that show how we turn complex workflows into clean, interactive Excel experiences."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <RevealCard className="lg:col-span-3">
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
              <img
                src={projects[active].image}
                alt={projects[active].title}
                className="h-72 md:h-[26rem] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.25em] text-green-300">Case Study</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-bold text-white">{projects[active].title}</h3>
                <p className="mt-3 max-w-xl text-sm md:text-base text-slate-200">{projects[active].desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {projects[active].tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </RevealCard>

          <div className="lg:col-span-2 space-y-3">
            {projects.map((project, i) => (
              <RevealCard key={project.title} delay={i * 60}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active === i
                      ? 'border-green-300 bg-white shadow-md shadow-green-100'
                      : 'border-slate-200 bg-white hover:border-green-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-16 w-20 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">{project.desc}</p>
                    </div>
                  </div>
                </button>
              </RevealCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [focused, setFocused] = useState('')

  return (
    <section id="contact" className="py-24 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          badge="Contact"
          title="Let's build your next Excel solution"
          subtitle="Tell us about your workflow, and we'll reply with a clear plan, timeline, and next steps."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <RevealCard className="lg:col-span-2 space-y-5">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200">
              <img src="/actual-bg.png" alt="Contact Dr.Excel" className="h-56 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-sm font-semibold text-white">Available for new projects</p>
                <p className="mt-1 text-xs text-slate-200">Typical response within 24 hours</p>
              </div>
            </div>

            <a
              href="https://wa.me/18603871944"
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 font-bold">WA</div>
              <div>
                <h4 className="font-semibold">WhatsApp</h4>
                <p className="text-sm text-slate-600">+1 860 387 1944</p>
              </div>
              <span className="ml-auto text-green-600 opacity-0 transition group-hover:opacity-100">→</span>
            </a>

            <a
              href="mailto:alfredpeprah@hotmail.com"
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">@</div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-slate-600">alfredpeprah@hotmail.com</p>
              </div>
              <span className="ml-auto text-green-600 opacity-0 transition group-hover:opacity-100">→</span>
            </a>
          </RevealCard>

          <RevealCard delay={120} className="lg:col-span-3">
            <form className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold">Start your project brief</h3>
              <p className="mt-2 text-sm text-slate-600">Share a few details and we'll get back to you with recommendations.</p>

              <div className="mt-6 grid gap-5">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</span>
                  <input
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition ${focused === 'name' ? 'border-green-400 ring-2 ring-green-100' : 'border-slate-200'}`}
                    placeholder="Your name"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</span>
                  <input
                    type="email"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition ${focused === 'email' ? 'border-green-400 ring-2 ring-green-100' : 'border-slate-200'}`}
                    placeholder="your.email@example.com"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project Details</span>
                  <textarea
                    rows={5}
                    onFocus={() => setFocused('details')}
                    onBlur={() => setFocused('')}
                    className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none transition ${focused === 'details' ? 'border-green-400 ring-2 ring-green-100' : 'border-slate-200'}`}
                    placeholder="Tell us about your workflow, goals, and timeline..."
                  />
                </label>

                <button
                  type="submit"
                  className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-green-500"
                >
                  Send Message
                </button>
              </div>
            </form>
          </RevealCard>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 py-12 text-slate-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <img src="/dr-excel-logo.png" alt="DR.EXCEL logo" className="h-10 w-10 object-contain" />
              <div className="font-bold text-white">DR.EXCEL</div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Excel spreadsheet development and business automation for teams that want polished, production-ready tools.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h4>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a href="#services" className="transition hover:text-green-300">Services</a>
              <a href="#benefits" className="transition hover:text-green-300">Benefits</a>
              <a href="#projects" className="transition hover:text-green-300">Projects</a>
              <a href="#contact" className="transition hover:text-green-300">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Get Started</h4>
            <p className="mt-4 text-sm text-slate-400">Ready to automate your next workflow?</p>
            <a
              href="#contact"
              className="mt-4 inline-flex rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-400"
            >
              Book a Consultation
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
          © 2025 Dr.Excel. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Hero />
      <Services />
      <Benefits />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}
