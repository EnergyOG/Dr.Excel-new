import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react"

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
          <div className="h-10 w-10 rounded-md bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">DX</div>
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
  const bgUrl = '/hero-bg.png'
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
      style={{ backgroundImage: `linear-gradient(rgba(2,6,23,0.55), rgba(2,6,23,0.75)), url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
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
    ["Custom Excel Spreadsheet Development", "Tailored solutions designed specifically for your business needs and workflows."],
    ["Automated Calculations and Formulas", "Complex formulas and automation to eliminate manual calculations and reduce errors."],
    ["Dashboard and Reports", "Interactive dashboards with real-time data visualization for better decision-making."],
    ["Data Cleaning and Organization", "Transform messy data into organized, actionable information."],
    ["Process Automation", "Automate repetitive tasks to save time and increase productivity."],
    ["Business Templates", "Professional templates for invoices, budgets, cost estimates, and timesheets."],
    ["Excel Training and Support", "Comprehensive training to empower your team with Excel expertise."],
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold">Our Services</h3>
        <p className="mt-2 text-slate-600">Comprehensive Excel solutions tailored to meet your business needs</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(([title, desc], i) => (
            <div key={i} className="p-6 border rounded-xl shadow-sm hover:shadow-lg">
              <div className="h-12 w-12 rounded-md bg-green-100 flex items-center justify-center text-green-700 font-semibold">S</div>
              <h4 className="mt-4 font-semibold">{title}</h4>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const items = [
    "Saves time and reduce manual work",
    "Improve accuracy and decision-making",
    "Custom Solutions tailored to your needs",
    "Affordable Alternative to Expensive Software",
    "Working faster and smarter with fewer errors",
  ]

  return (
    <section id="benefits" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold">Why Choose Us?</h3>
        <p className="mt-2 text-slate-600">WORKING FASTER AND SMARTER WITH FEWER ERRORS!!!!!</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">✓</div>
              <p className="mt-4 text-sm text-slate-700">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Projects() {
  const projects = [
    ["Financial Dashboard", "Automated financial reporting system with real-time KPI tracking and budget analysis."],
    ["Inventory Management System", "Complete inventory tracking with automated reorder alerts and supplier management."],
    ["Employee Timesheet Tracker", "Automated timesheet system with payroll calculations and attendance monitoring."],
    ["Sales Analytics Dashboard", "Comprehensive sales tracking with performance metrics and trend analysis."],
    ["Project Cost Estimator", "Dynamic cost estimation tool with material tracking and labor calculations."],
    ["Invoice & Quote Generator", "Professional invoice system with automated calculations and client database."],
  ]

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold">Featured Projects</h3>
        <p className="mt-2 text-slate-600">Examples of custom Excel solutions we've developed for businesses</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(([title, desc], i) => (
            <div key={i} className="p-6 border rounded-xl flex gap-4">
              <div className="w-32 h-20 bg-slate-100 rounded-md flex items-center justify-center text-slate-700">img</div>
              <div>
                <h4 className="font-semibold">{title}</h4>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
                <div className="mt-3 flex gap-2 text-xs text-slate-500">
                  <span className="px-2 py-1 bg-slate-100 rounded">Automated Reports</span>
                  <span className="px-2 py-1 bg-slate-100 rounded">Data Visualization</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-3xl font-bold">Get In Touch</h3>
          <p className="mt-2 text-slate-600">Ready to automate your business processes? Let's talk!</p>

          <div className="mt-6 space-y-4">
            <a href="https://wa.me/18603871944" className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-green-100 flex items-center justify-center">WA</div>
              <div>
                <h4 className="font-semibold">WhatsApp</h4>
                <p className="text-sm text-slate-600">+1 860 387 1944</p>
              </div>
            </a>

            <a href="mailto:alfredpeprah@hotmail.com" className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-emerald-100 flex items-center justify-center">@</div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-slate-600">alfredpeprah@hotmail.com</p>
              </div>
            </a>
          </div>
        </div>

        <form className="bg-white p-6 rounded-xl shadow-sm">
          <div className="grid gap-4">
            <label className="text-xs text-slate-600">Name</label>
            <input className="border rounded px-3 py-2" placeholder="Your name" />
            <label className="text-xs text-slate-600">Email</label>
            <input className="border rounded px-3 py-2" placeholder="your.email@example.com" />
            <label className="text-xs text-slate-600">Project Details</label>
            <textarea className="border rounded px-3 py-2" placeholder="Tell us about your project..." />
            <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Send Message</button>
          </div>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-8 bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">DX</div>
          <div>
            <div className="font-bold">DR.EXCEL</div>
            <div className="text-sm">© 2025 Dr.Excel. All rights reserved.</div>
          </div>
        </div>
        <div className="text-sm">Excel Spreadsheet Development and Business Automation</div>
      </div>
    </footer>
  )
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Hero />
      <Services />
      <Benefits />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}
