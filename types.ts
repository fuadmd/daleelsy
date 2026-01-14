
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  LIMITED_ADMIN = 'LIMITED_ADMIN',
  EMPLOYER = 'EMPLOYER',
  CANDIDATE = 'CANDIDATE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  resumeUrl?: string;
  organization?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string; // New field
  region: string;
  subRegion?: string;
  specialty: string;
  postedAt: string;
  expiresAt: string;
  description: string;
  employerId: string;
  status: 'active' | 'expired' | 'pending';
  externalApplyUrl?: string;
  attachments?: string[];
}

export interface CVExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface CVEducation {
  school: string;
  degree: string;
  year: string;
}

export interface CVCourse {
  title: string;
  institution: string;
  year: string;
}

export interface CVData {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  summary: string;
  experiences: CVExperience[];
  educations: CVEducation[];
  courses: CVCourse[];
  skills: string[];
  languages: { name: string; level: number }[]; // Level changed to number (1-5)
  design: {
    accentColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    direction: 'rtl' | 'ltr';
    showPhoto: boolean;
  };
}

export interface EmployeeProfile {
  id: string;
  name: string;
  specialty: string;
  skills: string[];
  jobHistory: string[];
  joinedDate: string;
}

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface AppSettings {
  lightPrimaryColor: string;
  lightSecondaryColor: string;
  darkPrimaryColor: string;
  darkSecondaryColor: string;
  language: Language;
  bannerImages: string[];
  bgPatternUrl?: string;
  bgPatternScale: number;
  bgPatternOpacity: number;
  theme: Theme;
  footerTextAr: string;
  footerTextEn: string;
  adSliderTitleAr: string;
  adSliderTitleEn: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  heroBgColor: string;
  heroImage?: string;
  adminNotificationEmails: string;
}
