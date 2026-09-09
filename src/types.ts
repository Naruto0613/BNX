export interface AwardItem {
  id: string;
  awardName: string;
  competitionName: string;
  category: 'Academic' | 'Science' | 'Mathematics' | 'Programming' | 'Robotics' | 'Business' | 'Sports' | 'Arts' | 'Language' | 'Other';
  level: 'School' | 'District' | 'City' | 'Province' | 'National' | 'Regional' | 'International' | 'Global';
  awardType: 'Champion' | 'Gold' | 'Silver' | 'Bronze' | 'Finalist' | 'Participant' | 'Honorable Mention' | 'Scholarship' | 'Research Award';
  year: string;
  organizer?: string;
  certificateUrl?: string;
  description?: string;
}

export interface ActivityItem {
  id: string;
  activityType: 'Leadership' | 'Volunteer' | 'Research' | 'Internship' | 'Club' | 'Sports' | 'Music' | 'Art' | 'Business' | 'Startup' | 'Hackathon' | 'Debate' | 'Competition' | 'Community Service' | 'Teaching' | 'Work Experience' | 'Other';
  role: 'Founder' | 'Co-Founder' | 'President' | 'Vice President' | 'Captain' | 'Leader' | 'Coordinator' | 'Member' | 'Volunteer' | 'Research Assistant' | 'Intern' | 'Employee';
  organization: string;
  startDate?: string;
  endDate?: string;
  hoursPerWeek?: number;
  membersLed?: number;
  beneficiaries?: number;
  achievements?: string;
  certificateUrl?: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  published: 'Yes' | 'No';
  conferenceOrJournal?: string;
  researchArea?: string;
  supervisor?: string;
  certificateUrl?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  reading: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
  writing: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
  listening: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
  speaking: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
  overallLevel: 'Basic' | 'Intermediate' | 'Fluent' | 'Native';
}

export interface DocumentItem {
  id: string;
  type: 'Transcript' | 'Passport' | 'CV' | 'Recommendation Letter' | 'Personal Statement' | 'IELTS' | 'SAT' | 'TOEFL' | 'Awards' | 'Certificates';
  status: 'Uploaded' | 'Missing';
  fileName?: string;
  fileUrl?: string;
  updatedAt?: string;
}

export interface UniversityPreferences {
  preferredCountries: string[];
  budgetAnnualUsd?: number;
  needScholarship: 'Yes' | 'No';
  preferredClimate?: 'Warm' | 'Cold' | 'Temperate' | 'Any';
  preferredCampusSize?: 'Small' | 'Medium' | 'Large' | 'Any';
  preferredCitySize?: 'Major Metropolis' | 'Medium City' | 'College Town' | 'Any';
  preferredUniversityType?: 'Public' | 'Private' | 'Research' | 'Liberal Arts' | 'Any';
  careerGoal?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  bioSummary?: string;
  workExperience?: string;
  dob?: string;
  nationality?: string;
  city?: string;
  graduationYear?: number;
  age?: number;
  country?: string;
  school?: string;
  gpa?: number;
  classRank?: string;
  ieltsScore?: number;
  toeflScore?: number;
  detScore?: number;
  satScore?: number;
  actScore?: number;
  apCourses?: string;
  ibCourses?: string;
  awards?: string;
  awardsList?: AwardItem[];
  olympiads?: string;
  competitions?: string;
  volunteerActivities?: string;
  leadershipExperience?: string;
  extracurricularActivities?: string;
  activitiesList?: ActivityItem[];
  researchList?: ResearchItem[];
  languagesList?: LanguageItem[];
  programmingSkills?: string;
  selectedProgrammingSkills?: string[];
  selectedSoftSkills?: string[];
  selectedCertificates?: string[];
  languageSkills?: string;
  careerInterests?: string; // e.g. "Engineering", "IT", "Business", "Medicine", "Arts", "Science", "Other"
  firstName?: string;
  lastName?: string;
  role?: 'student' | 'admin';
  transactionReference?: string;
  paymentStatus?: 'unpaid' | 'pending' | 'paid' | 'declined';
  accessStatus?: 'active' | 'inactive';
  subscriptionStart?: string;
  subscriptionEnd?: string;
  documentsList?: DocumentItem[];
  preferences?: UniversityPreferences;
  createdAt?: any;
  updatedAt?: any;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  studentName: string;
  email: string;
  transactionReference: string;
  amount: number;
  status: 'pending' | 'approved' | 'declined';
  submittedAt: string;
  createdAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  declineReason?: string;
}

export interface AdminStats {
  totalUsers: number;
  pendingRequests: number;
  approvedRequests: number;
  declinedRequests: number;
  activeUsers: number;
}

export interface University {
  id: string;
  name: string;
  country: string;
  imageUrl?: string;
  ranking?: number;
  acceptanceRate?: string;
  website?: string;
  
  // Costs
  tuitionFee?: number;
  dormitoryFee?: number;
  livingCost?: number;
  healthInsurance?: number;
  applicationFee?: number;
  estimatedAnnualCost?: number;

  // Requirements
  minGpa?: number;
  ieltsMin?: number;
  toeflMin?: number;
  satMin?: number;
  requiredSubjects?: string;

  // Documents
  requiredDocuments?: string; // Comma separated or list description

  // Timeline
  openingDate?: string;
  deadline?: string;
  resultDate?: string;

  // Scholarships
  scholarships?: string;

  // Extended Information Links
  admissionsUrl?: string;
  scholarshipsUrl?: string;
  virtualTourUrl?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  universityId?: string;
  universityName?: string;
  amount: string;
  eligibility: string;
  deadline: string;
  major?: string;
  country?: string;
}

export interface ApplicationTrack {
  id: string;
  userId: string;
  universityId: string;
  universityName: string;
  status: 'In Progress' | 'Document Stage' | 'Submitted' | 'Interview Scheduled' | 'Admission Offered' | 'Rejected' | 'Scholarship Awarded';
  submittedDocuments: string[]; // List of documents uploaded/checked
  appliedScholarships: string;
  notes?: string;
  deadline?: string;
  result?: string;
  updatedAt?: any;
}

export interface Essay {
  id: string;
  userId: string;
  title: string;
  content: string;
  scoreEstimate?: string;
  grammarCorrections?: string;
  ieltsFeedback?: string;
  structureAnalysis?: string;
  suggestions?: string;
  createdAt?: any;
}

export interface CountryInfo {
  code: string;
  name: string;
  averageLivingCost: string;
  averageTuitionCost: string;
  studentVisaProcess: string;
  partTimeWorkRules: string;
  safetyInformation: string;
  currency: string;
  language: string;
  flag: string;
  exchangeRateMNT?: number; // rate of 1 foreign unit in MNT
  exchangeRateText?: string; // Text representation, e.g. "1 USD = 3,450 ₮"
}

export interface AIRecommendationMatch {
  universityName: string;
  country: string;
  ranking?: number;
  matchPercentage: number;
  difficulty: 'Reach' | 'Target' | 'Safety';
  gpaFactor?: string;
  testFactor?: string;
  activitiesFactor?: string;
  actionableAdvice?: string;
}

export interface AIScholarshipMatch {
  name: string;
  country: string;
  amount: string;
  eligibility: string;
  deadline: string;
  matchingStrategy: string;
}
