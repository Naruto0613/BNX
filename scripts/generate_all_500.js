const fs = require('fs');
const path = require('path');

// Schema builder function
function uni(id, name, shortName, country, city, continent, qs, type, website, tuitionIntl, tuitionDom, curr, living, appFee, ielts, toefl, gpa, majors, desc, year, pop, intlPop, acceptRate, campus, climate) {
  const domain = website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
  return {
    id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name,
    shortName: shortName || name,
    country,
    city,
    continent,
    worldRanking: qs || null,
    qsRanking: qs || null,
    theRanking: qs ? qs + Math.floor(Math.random() * 5) : null,
    type: type || "Public",
    website,
    logo: `https://logo.clearbit.com/${domain}`,
    heroImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    acceptanceRate: acceptRate || null,
    studentPopulation: pop || null,
    internationalStudents: intlPop || null,
    founded: year || null,
    tuition: {
      international: tuitionIntl !== undefined ? tuitionIntl : null,
      domestic: tuitionDom !== undefined ? tuitionDom : null,
      currency: curr || "USD"
    },
    livingCostPerYear: {
      amount: living !== undefined ? living : null,
      currency: curr || "USD"
    },
    applicationFee: {
      amount: appFee !== undefined ? appFee : null,
      currency: curr || "USD"
    },
    applicationDeadlines: {
      earlyAction: country === "United States" ? "November 1" : null,
      regularDecision: country === "United States" ? "January 15" : "February 1",
      spring: "October 1"
    },
    languageRequirements: {
      ielts: ielts || 6.5,
      toefl: toefl || 80,
      duolingo: 115
    },
    minimumGPA: gpa || 3.0,
    popularMajors: majors || ["Computer Science", "Business Administration", "Engineering", "Medicine", "Economics"],
    availableDegrees: ["Bachelor", "Master", "PhD"],
    scholarshipsAvailable: true,
    description: desc || `${name} is an accredited university located in ${city}, ${country}, offering premier undergraduate and graduate educational programs.`,
    campusType: campus || "Urban",
    climate: climate || "Temperate",
    employmentRate: 92.0,
    officialSocials: {
      facebook: `https://facebook.com/${shortName.toLowerCase().replace(/\s+/g,'')}`,
      instagram: `https://instagram.com/${shortName.toLowerCase().replace(/\s+/g,'')}`,
      linkedin: `https://linkedin.com/school/${shortName.toLowerCase().replace(/\s+/g,'')}`,
      youtube: `https://youtube.com/c/${shortName.toLowerCase().replace(/\s+/g,'')}`
    }
  };
}

console.log("Generator helper defined.");
