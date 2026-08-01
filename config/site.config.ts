export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "AuraHealth Medical & Surgical Center",
  shortName: process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "AuraHealth",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Advanced Medical Care with Human Touch",
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "doctorclinic.com",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "care@aurahealthclinic.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+1 (800) 555-0199",
  agency: {
    name: "Antigravity Agency",
    templateVersion: "2.0.0-enterprise",
    copyrightYear: new Date().getFullYear(),
  },
};
