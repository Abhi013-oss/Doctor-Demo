import Link from "next/link";
import {
  HeartPulse,
  ShieldCheck,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  Phone,
  Calendar,
  Activity,
  Zap,
  Star,
  ChevronRight
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import AppointmentForm from "@/components/AppointmentForm";
import AnimatedCounter from "@/components/AnimatedCounter";
import ScrollAnimation, { StaggerContainer, StaggerItem } from "@/components/ScrollAnimation";
import {
  CLINIC_INFO,
  SPECIALIZATIONS,
  TECHNOLOGIES,
  TESTIMONIALS,
  FAQS
} from "@/lib/data";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: CLINIC_INFO.name,
    description: CLINIC_INFO.tagline,
    telephone: CLINIC_INFO.phone,
    email: CLINIC_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC_INFO.address,
    },
    medicalSpecialty: "Cardiovascular",
  };

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* HERO SECTION WITH ENHANCED FADE & SLIDE ANIMATIONS */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 gradient-hero-bg border-b border-slate-200/60 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <ScrollAnimation direction="up" className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100/80 border border-sky-200 text-sky-900 text-xs font-extrabold uppercase tracking-wider shadow-xs hover:scale-105 transition-transform cursor-pointer">
                <Sparkles className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Harvard & Johns Hopkins Fellowship Lead Physician</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                World-Class Medical Care,{" "}
                <span className="gradient-text">Centered Around You.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience unhurried 60-minute physician consultations, non-invasive 3D Echocardiography diagnostics, and personalized longevity protocols under <strong className="text-slate-900 font-bold">{CLINIC_INFO.doctor.name}</strong>.
              </p>

              {/* Action Buttons with Interactive Hover Lift */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-base text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                >
                  <Phone className="w-5 h-5 text-sky-600" />
                  <span>Call {CLINIC_INFO.phone}</span>
                </a>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="flex items-center gap-2.5 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Board Certified</span>
                    <span className="block text-[11px] text-slate-500">FACC & Internal Med</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">25,000+</span>
                    <span className="block text-[11px] text-slate-500">Patients Treated</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">3D Ultrasound</span>
                    <span className="block text-[11px] text-slate-500">In-house Diagnostics</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 group-hover:fill-white group-hover:text-white" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">4.9 / 5 Stars</span>
                    <span className="block text-[11px] text-slate-500">500+ Patient Reviews</span>
                  </div>
                </div>
              </div>

            </ScrollAnimation>

            {/* Right Interactive Form Box with Entrance Animation */}
            <ScrollAnimation direction="left" delay={0.2} className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-400/20 rounded-full blur-xl"></div>
                <AppointmentForm compact defaultSpecialization="General Cardiovascular Audit" />
              </div>
            </ScrollAnimation>

          </div>
        </div>
      </section>

      {/* STATS RIBBON WITH DYNAMIC ANIMATED INCREMENTING NUMBERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation scale direction="up">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              
              {/* Stat 1: 22+ */}
              <div className="text-center pt-4 lg:pt-0 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
                  <AnimatedCounter to={22} suffix="+" duration={2.2} />
                </div>
                <span className="block text-sm font-bold text-slate-200 mt-2">Years Clinical Mastery</span>
                <span className="block text-xs text-slate-400">Harvard & MGH Alumni</span>
              </div>

              {/* Stat 2: 4,500+ */}
              <div className="text-center pt-4 lg:pt-0 lg:pl-8 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400">
                  <AnimatedCounter to={4500} suffix="+" duration={2.5} />
                </div>
                <span className="block text-sm font-bold text-slate-200 mt-2">Successful Procedures</span>
                <span className="block text-xs text-slate-400">Cardiac & Non-Invasive Care</span>
              </div>

              {/* Stat 3: 99.4% */}
              <div className="text-center pt-4 lg:pt-0 lg:pl-8 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                  <AnimatedCounter to={99.4} decimals={1} suffix="%" duration={2.2} />
                </div>
                <span className="block text-sm font-bold text-slate-200 mt-2">Diagnostic Accuracy</span>
                <span className="block text-xs text-slate-400">Epiq 3D Ultrasound Platform</span>
              </div>

              {/* Stat 4: 0 Min */}
              <div className="text-center pt-4 lg:pt-0 lg:pl-8 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
                  <AnimatedCounter to={0} suffix=" Min" duration={1.5} />
                </div>
                <span className="block text-sm font-bold text-slate-200 mt-2">Average Wait Time</span>
                <span className="block text-xs text-slate-400">Punctual Reserved Appointments</span>
              </div>

            </div>
          </div>
        </ScrollAnimation>
      </section>

      {/* SPECIALIZATIONS SHOWCASE WITH STAGGERED SCROLL ANIMATION & RICH HOVER CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up">
          <SectionHeader
            badge="Clinical Expertise"
            title="Our Medical Specializations"
            subtitle="From preventive cardiac strain monitoring to comprehensive metabolic management, we deliver precision care targeted to your specific health profile."
          />
        </ScrollAnimation>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {SPECIALIZATIONS.map((spec) => (
            <StaggerItem key={spec.id}>
              <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl hover:border-sky-300 transition-all duration-300 h-full border border-slate-200 cursor-pointer">
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${spec.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 mb-6`}>
                    <HeartPulse className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition">
                    {spec.title}
                  </h3>

                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {spec.shortDesc}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Key Conditions Treated:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.conditions.slice(0, 3).map((cond, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold group-hover:bg-sky-50 group-hover:text-sky-800 transition"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link
                    href={`/specializations#${spec.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-800 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Specialization</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-10">
          <Link
            href="/specializations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-sky-700 bg-sky-50 hover:bg-sky-100 transition transform hover:scale-105"
          >
            <span>View All Specializations & Clinical Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* DOCTOR SPOTLIGHT SECTION WITH SCROLL ANIMATION */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Doctor Image Card */}
            <ScrollAnimation direction="right" className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 aspect-[4/5] bg-slate-800 group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
                  alt={CLINIC_INFO.doctor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 group-hover:border-sky-500 transition">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">
                    Chief Medical Officer
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{CLINIC_INFO.doctor.name}</h4>
                  <p className="text-xs text-slate-300">{CLINIC_INFO.doctor.qualifications.split(",")[0]}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Doctor Bio & Credentials */}
            <ScrollAnimation direction="left" delay={0.2} className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-xs font-extrabold uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Meet Lead Physician</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Dedicated to Precision Medical Diagnostics & Patient-First Care
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                {CLINIC_INFO.doctor.bio}
              </p>

              {/* Philosophy Quote */}
              <div className="p-5 rounded-2xl bg-slate-800/80 border-l-4 border-sky-400 text-slate-200 text-sm italic leading-relaxed hover:bg-slate-800 transition">
                "{CLINIC_INFO.doctor.philosophy}"
              </div>

              {/* Qualifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {CLINIC_INFO.doctor.degrees.slice(0, 4).map((deg, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-sky-500/60 transition cursor-pointer">
                    <span className="text-xs font-bold text-sky-400 block">{deg.year}</span>
                    <h5 className="text-xs font-bold text-white mt-0.5">{deg.title}</h5>
                    <p className="text-[11px] text-slate-400">{deg.institution}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-sky-400 hover:bg-sky-300 transition transform hover:scale-105"
                >
                  <span>Read Full Bio & Academic Work</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </ScrollAnimation>

          </div>
        </div>
      </section>

      {/* ADVANCED TECHNOLOGY TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up">
          <SectionHeader
            badge="State-of-the-Art Facilities"
            title="Driven by Advanced Diagnostic Technology"
            subtitle="We invest in sub-millimeter precision medical hardware to catch micro-abnormalities early, eliminating guesswork."
          />
        </ScrollAnimation>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {TECHNOLOGIES.slice(0, 4).map((tech) => (
            <StaggerItem key={tech.id}>
              <div className="glass-card rounded-3xl p-8 border border-slate-200 flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl hover:border-sky-300 transition-all duration-300 h-full cursor-pointer group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                      {tech.category}
                    </span>
                    <Zap className="w-5 h-5 text-teal-600 group-hover:scale-125 transition-transform" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition">{tech.name}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{tech.description}</p>

                  <div className="mt-4 p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs font-semibold text-teal-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{tech.highlight}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{tech.specs[0]}</span>
                  <Link href="/technology" className="text-xs font-bold text-sky-700 group-hover:underline">
                    Tech Specs &rarr;
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* PATIENT TESTIMONIALS TEASER */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation direction="up">
            <SectionHeader
              badge="Verified Patient Stories"
              title="Real Experiences, Real Outcomes"
              subtitle="Read how our proactive diagnostic care and patient-first approach transformed health journeys."
            />
          </ScrollAnimation>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {TESTIMONIALS.slice(0, 3).map((test) => (
              <StaggerItem key={test.id}>
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 h-full cursor-pointer">
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-slate-800 text-sm font-semibold italic leading-relaxed mb-4">
                      "{test.quote}"
                    </p>

                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-4">
                      {test.story}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                    <img
                      src={test.avatarUrl}
                      alt={test.patientName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{test.patientName} ({test.age} yrs)</h5>
                      <span className="text-[11px] text-sky-700 font-medium block">{test.treatment}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="text-center mt-10">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 shadow transition transform hover:scale-105"
            >
              <span>Read All Verified Patient Reviews</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation direction="up">
          <SectionHeader
            badge="Got Questions?"
            title="Frequently Asked Questions"
            subtitle="Quick answers regarding appointment booking, insurance coverage, and consultation expectations."
          />
        </ScrollAnimation>

        <div className="mt-10 space-y-4">
          {FAQS.slice(0, 4).map((faq) => (
            <ScrollAnimation key={faq.id} direction="up" delay={0.1}>
              <details
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-xs cursor-pointer hover:border-sky-300 transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between font-bold text-slate-900 text-base sm:text-lg">
                  <span>{faq.question}</span>
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-open:rotate-180 transition-transform">
                    &darr;
                  </span>
                </summary>
                <p className="mt-4 text-slate-600 text-sm leading-relaxed pt-2 border-t border-slate-100">
                  {faq.answer}
                </p>
              </details>
            </ScrollAnimation>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/faqs" className="text-sm font-bold text-sky-700 hover:underline">
            Have more questions? Browse full FAQ Knowledge Base &rarr;
          </Link>
        </div>
      </section>

      {/* FINAL BOOKING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation scale direction="up">
          <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl text-center relative overflow-hidden border border-slate-800">
            <div className="max-w-3xl mx-auto space-y-6 relative z-10">
              <span className="px-4 py-1.5 rounded-full bg-sky-700/50 border border-sky-400/30 text-sky-200 text-xs font-bold uppercase tracking-wider inline-block">
                Priority Patient Care
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Ready to Prioritize Your Cardiovascular & General Health?
              </h2>

              <p className="text-sky-100 text-base sm:text-lg leading-relaxed">
                Book your consultation with Dr. Evelyn Reed online in less than 2 minutes. Receive instant confirmation and reference tracking.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/booking"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-extrabold text-base text-slate-900 bg-white hover:bg-sky-50 shadow-xl transition transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5 text-sky-700" />
                  <span>Book Appointment Online</span>
                </Link>

                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-base text-white border border-sky-400/50 hover:bg-sky-800/50 transition transform hover:scale-105"
                >
                  <Phone className="w-5 h-5 text-sky-300" />
                  <span>Call Desk: {CLINIC_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </section>

    </div>
  );
}
