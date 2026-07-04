export interface UserProfile {
  uid: string;
  name: string;
  age?: number;
  country?: string;
  school?: string;
  gpa?: number;
  classRank?: string;
  ieltsScore?: number;
  toeflScore?: number;
  satScore?: number;
  actScore?: number;
  apCourses?: string;
  ibCourses?: string;
  awards?: string;
  olympiads?: string;
  competitions?: string;
  volunteerActivities?: string;
  leadershipExperience?: string;
  extracurricularActivities?: string;
  programmingSkills?: string;
  languageSkills?: string;
  careerInterests?: string; // e.g. "Engineering", "IT", "Business", "Medicine", "Arts", "Science", "Other"
  createdAt?: any;
  updatedAt?: any;
}

export interface University {
  id: string;
  name: string;
  country: string;
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
