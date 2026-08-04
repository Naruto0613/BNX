const fs = require('fs');
const path = require('path');

// We will construct an accurate dataset of 500 real universities across 50+ countries.
// Helper to construct a university record matching the schema strictly.

function createUni({
  id,
  name,
  shortName,
  country,
  city,
  continent,
  worldRanking = null,
  qsRanking = null,
  theRanking = null,
  type = "Public",
  website,
  logo = "",
  heroImage = "",
  acceptanceRate = null,
  studentPopulation = null,
  internationalStudents = null,
  founded = null,
  tuitionIntl = null,
  tuitionDom = null,
  currency = "USD",
  livingCost = null,
  livingCurrency = "USD",
  appFee = null,
  appFeeCurrency = "USD",
  earlyDeadline = null,
  regularDeadline = null,
  springDeadline = null,
  ielts = null,
  toefl = null,
  duolingo = null,
  minimumGPA = null,
  popularMajors = [],
  availableDegrees = ["Bachelor", "Master", "PhD"],
  scholarshipsAvailable = true,
  description = "",
  campusType = "Urban",
  climate = "Temperate",
  employmentRate = null,
  facebook = "",
  instagram = "",
  linkedin = "",
  youtube = ""
}) {
  return {
    id: id || name.toLowerCase().replace(/[^a-z0-0]+/g, '-').replace(/(^-|-$)/g, ''),
    name,
    shortName: shortName || name,
    country,
    city,
    continent,
    worldRanking,
    qsRanking: qsRanking || worldRanking,
    theRanking,
    type,
    website,
    logo: logo || `https://logo.clearbit.com/${website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}`,
    heroImage: heroImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    acceptanceRate,
    studentPopulation,
    internationalStudents,
    founded,
    tuition: {
      international: tuitionIntl,
      domestic: tuitionDom,
      currency
    },
    livingCostPerYear: {
      amount: livingCost,
      currency: livingCurrency
    },
    applicationFee: {
      amount: appFee,
      currency: appFeeCurrency
    },
    applicationDeadlines: {
      earlyAction: earlyDeadline,
      regularDecision: regularDeadline,
      spring: springDeadline
    },
    languageRequirements: {
      ielts,
      toefl,
      duolingo
    },
    minimumGPA,
    popularMajors,
    availableDegrees,
    scholarshipsAvailable,
    description,
    campusType,
    climate,
    employmentRate,
    officialSocials: {
      facebook,
      instagram,
      linkedin,
      youtube
    }
  };
}

console.log("Script template ready.");
