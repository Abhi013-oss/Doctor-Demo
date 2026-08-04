import {
  ClinicSettings,
  Appointment,
  Patient,
  MessageThread,
  Specialization,
  Treatment,
  TechItem,
  Testimonial,
  GalleryItem,
  FAQItem,
  AdminUser,
} from "../types";

export const DEMO_ADMIN_USER: AdminUser = {
  id: "usr-admin-01",
  email: "admin@doctorclinic.com",
  name: "Dr. Evelyn Reed",
  role: "Medical Director",
  avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
  department: "Cardiology & Operations",
};

export const CLINIC_INFO = {
  name: "AuraHealth Medical & Surgical Center",
  tagline: "Advanced Medical Care with Human Touch",
  phone: "+1 (800) 555-0199",
  emergencyPhone: "+1 (800) 911-AURA",
  email: "care@aurahealthclinic.com",
  whatsappNumber: "+18005550199",
  address: "742 Evergreen Medical Blvd, Suite 400, New York, NY 10021",
  hours: [
    { days: "Monday - Friday", time: "8:00 AM - 8:00 PM" },
    { days: "Saturday", time: "9:00 AM - 5:00 PM" },
    { days: "Sunday", time: "Emergency & Priority Appointments Only" },
  ],
  doctor: {
    name: "Dr. Evelyn Reed, M.D., FACC",
    title: "Chief Medical Officer & Senior Consultant Physician",
    qualifications: "MD (Harvard Medical School), FACC, Board Certified in Internal Medicine & Cardiovascular Disease",
    experienceYears: 22,
    surgeriesCount: 4500,
    patientsTreated: "25,000+",
    bio: "Dr. Evelyn Reed is a world-renowned physician with over two decades of clinical leadership in preventive medicine, interventional cardiology, and complex chronic care management. Having completed her residency at Massachusetts General Hospital and fellowship at Johns Hopkins Medical Institute, Dr. Reed combines cutting-edge diagnostic precision with a deeply empathetic, patient-first approach.",
    philosophy: "We believe medicine is not just about managing symptoms—it is about restoring vitality, empowering patients with knowledge, and utilizing state-of-the-art non-invasive technology for lasting longevity.",
    degrees: [
      { title: "Doctor of Medicine (M.D.)", institution: "Harvard Medical School", year: "2004" },
      { title: "Residency & Chief Fellowship in Cardiology", institution: "Johns Hopkins Hospital", year: "2008" },
      { title: "Fellow of American College of Cardiology (FACC)", institution: "American College of Cardiology", year: "2010" },
    ],
    awards: [
      "Top Physician in New York (2020 - 2025)",
      "Excellence in Clinical Innovation Award - AMA",
      "Pioneer in Non-Invasive Vascular Diagnostics",
      "Author of 40+ Peer-Reviewed Medical Publications",
    ],
  },
};

export const INITIAL_CLINIC_SETTINGS: ClinicSettings = {
  clinicName: "AuraHealth Medical & Surgical Center",
  doctorName: "Dr. Evelyn Reed, M.D., FACC",
  qualification: "MD (Harvard Medical School), Board Certified FACC",
  specialization: "Cardiology & Internal Medicine",
  experienceYears: 22,
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
  coverImageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&auto=format&fit=crop&q=80",
  logoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",

  address: "742 Evergreen Medical Blvd, Suite 400, New York, NY 10021",
  googleMapsUrl: "https://maps.google.com/?q=New+York+NY",
  phone: "+1 (800) 555-0199",
  emergencyPhone: "+1 (800) 911-AURA",
  email: "care@aurahealthclinic.com",
  website: "https://admin.doctorclinic.com",
  whatsappNumber: "+18005550199",

  consultationFee: 150,
  slotDurationMinutes: 30,
  bufferTimeMinutes: 10,
  maxBookingsPerDay: 30,
  workingHours: [
    { day: "Monday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM" },
    { day: "Tuesday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM" },
    { day: "Wednesday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM" },
    { day: "Thursday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM" },
    { day: "Friday", isOpen: true, openTime: "08:00 AM", closeTime: "08:00 PM" },
    { day: "Saturday", isOpen: true, openTime: "09:00 AM", closeTime: "05:00 PM" },
    { day: "Sunday", isOpen: false, openTime: "Closed", closeTime: "Closed" },
  ],
  lunchBreak: { start: "01:00 PM", end: "02:00 PM" },
  slotIntervalMinutes: 30,
  autoApproval: false,

  weeklyOff: "Sunday",
  publicHolidays: [
    { id: "h-1", name: "Labor Day", date: "2026-09-07" },
    { id: "h-2", name: "Thanksgiving Day", date: "2026-11-26" },
    { id: "h-3", name: "Christmas Day", date: "2026-12-25" },
  ],
  vacationStart: "",
  vacationEnd: "",
  emergencyClosure: false,
  emergencyMessage: "The clinic is temporarily closed for emergency maintenance. For urgent medical emergencies, call 911.",

  emailNotifications: true,
  whatsappNotifications: true,
  reminder24h: true,
  reminder2h: true,

  primaryColor: "#14b8a6",
  secondaryColor: "#0f172a",
  faviconUrl: "/favicon.ico",

  twoFactorEnabled: false,
  activeSessions: [],
};

// Start from ZERO (0) - No static fake appointments, patients, or messages
export const INITIAL_APPOINTMENTS: Appointment[] = [];
export const INITIAL_PATIENTS: Patient[] = [];
export const INITIAL_MESSAGES: MessageThread[] = [];

export const SPECIALIZATIONS: Specialization[] = [
  {
    id: "cardiology",
    title: "Cardiology & Vascular Medicine",
    iconName: "HeartPulse",
    shortDesc: "Comprehensive cardiac screening, ECG interpretation, arrhythmia management, and hypertension control.",
    fullDesc: "Our cardiovascular suite provides early screening, 3D echocardiography, lipid management, and non-invasive vascular doppler. We focus on halting disease progression before events occur.",
    conditions: ["Hypertension", "Coronary Artery Disease", "Arrhythmias", "High Cholesterol", "Heart Failure"],
    features: ["Same-Day ECG & Echo", "24/7 Ambulatory Monitoring", "Preventive Longevity Assessment"],
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    id: "internal-medicine",
    title: "Internal Medicine & Metabolic Care",
    iconName: "Stethoscope",
    shortDesc: "Adult primary care, diabetes management, metabolic syndrome reversal, and multi-system diagnostics.",
    fullDesc: "Holistic internal medicine addressing complex chronic conditions through targeted pharmacology, metabolic optimization, and precision lab analysis.",
    conditions: ["Type 2 Diabetes", "Metabolic Syndrome", "Thyroid Disorders", "Fatty Liver", "Autoimmune Markers"],
    features: ["Continuous Glucose Monitoring", "Personalized Reversal Plans", "Multi-system Diagnostic Audits"],
    gradient: "from-sky-500 to-blue-600",
  },
  {
    id: "preventive-wellness",
    title: "Preventive Care & Executive Health",
    iconName: "ShieldCheck",
    shortDesc: "Tailored executive health screening packages designed for early disease detection and longevity.",
    fullDesc: "Proactive healthcare is key to longevity. Our executive health screenings utilize advanced bio-marker panels and AI-assisted imaging to catch micro-abnormalities before symptoms arise.",
    conditions: ["Early Organ Stress", "Nutritional Deficiencies", "Cardiovascular Risk Factors", "Hormonal Imbalance"],
    features: ["Full-body High-resolution Scan", "Biomarker Longevity Panel", "Same-Day Comprehensive Report"],
    gradient: "from-emerald-500 to-teal-600",
  },
];

export const TREATMENTS: Treatment[] = [
  {
    id: "tr-1",
    name: "Advanced 3D Echocardiography & Doppler Scan",
    category: "Cardiology",
    description: "High-resolution ultrasound imaging providing live 3D visualization of heart valves, wall motion, and strain velocity.",
    duration: "45 Minutes",
    recoveryTime: "Immediate (Non-Invasive)",
    keyBenefits: ["Zero Radiation", "Instant Live Results", "Detects Early Valve Strain"],
    isPopular: true,
  },
  {
    id: "tr-2",
    name: "Comprehensive Executive Longevity & Health Audit",
    category: "Preventive Health",
    description: "Full-body metabolic, cardiovascular, genetic, and imaging evaluation designed to pinpoint early health risks.",
    duration: "2 - 3 Hours",
    recoveryTime: "Immediate",
    keyBenefits: ["120+ Biomarkers Analyzed", "Personalized Longevity Roadmap", "Physician One-on-One Review"],
    isPopular: true,
  },
  {
    id: "tr-3",
    name: "24-Hour Ambulatory Blood Pressure & Holter ECG",
    category: "Cardiology",
    description: "Continuous 24 to 72 hour monitoring of cardiac rhythm and blood pressure dynamics during daily activity.",
    duration: "Fitting: 15 Mins",
    recoveryTime: "Immediate",
    keyBenefits: ["Silent Arrhythmia Detection", "Masked Hypertension Assessment", "Comfortable Wearable Tech"],
  },
];

export const TECHNOLOGIES: TechItem[] = [
  {
    id: "tech-1",
    name: "Philips Epiq 7G 3D Echocardiography System",
    category: "Cardiac Imaging",
    description: "Ultra-premium cardiac ultrasound featuring xMATRIX transducers for real-time 3D volumetric heart imaging.",
    highlight: "3D Volumetric",
    specs: ["xMATRIX Transducer", "Strain Rate Velocity", "Zero Ionizing Radiation"],
    icon: "Activity",
  },
  {
    id: "tech-2",
    name: "GE Healthcare SEER 12 Holter Monitors",
    category: "Wearable Diagnostics",
    description: "Lightweight 12-lead digital Holter recorders delivering continuous arrhythmia analysis with AI wave detection.",
    highlight: "AI Wave Analysis",
    specs: ["12-Lead ECG", "72-Hour Battery", "AI Rhythm Classification"],
    icon: "Cpu",
  },
  {
    id: "tech-3",
    name: "Siemens Somatom 128-Slice Cardiac CT",
    category: "Advanced Angiography",
    description: "Ultra-low-dose radiation CT angiography visualizing coronary arteries and calcium scoring in under 5 seconds.",
    highlight: "Low Radiation",
    specs: ["128-Slice Resolution", "Sub-second Scan Time", "Calcium Score Analysis"],
    icon: "Zap",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    patientName: "Michael Thorne",
    age: 52,
    location: "New York, NY",
    treatment: "Executive Cardiac Audit",
    rating: 5,
    date: "July 2026",
    quote: "Dr. Evelyn Reed's preventive cardiac audit literally saved my life. Her team caught a hidden 85% arterial blockage during a routine 3D scan.",
    story: "After experiencing slight exertion fatigue, Michael scheduled an executive health audit. A 3D echo revealed early valve strain, prompting proactive preventive intervention.",
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "test-2",
    patientName: "Sophia Martinez",
    age: 44,
    location: "Brooklyn, NY",
    treatment: "Hypertension & Vascular Care",
    rating: 5,
    date: "June 2026",
    quote: "The most professional and caring medical experience I have ever had. The clinic technology is futuristic and Dr. Reed explains everything thoroughly.",
    story: "Sophia struggled with resistant hypertension for over three years. Through continuous ambulatory BP monitoring, her medication protocol was optimized.",
    verified: true,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Appointments",
    question: "How do I schedule an appointment with Dr. Evelyn Reed?",
    answer: "You can book directly using our online Appointment Booking tool on this website, call our desk at +1 (800) 555-0199, or send us a message via WhatsApp. Our clinic coordinator will confirm your preferred time slot within 2 hours.",
  },
  {
    id: "faq-2",
    category: "Appointments",
    question: "What should I bring to my first consultation?",
    answer: "Please bring a valid photo ID, your active insurance card, a list of current medications or supplements, and any recent lab reports or medical records from the past 12 months.",
  },
];
