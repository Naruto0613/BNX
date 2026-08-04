import json
import os
import re

unis = []

def uni(uid, name, short_name, country, city, continent, qs, utype, website, tuition_intl, tuition_dom, currency, living_cost, app_fee, ielts, toefl, duolingo, gpa, majors, desc, founded, pop, intl_pop, accept_rate, campus="Urban", climate="Temperate", emp_rate=92.0):
    domain = re.sub(r'^https?://(www\.)?', '', website).split('/')[0] if website else ""
    logo_url = f"https://logo.clearbit.com/{domain}" if domain else ""
    
    hero_img = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
    
    unis.append({
        "id": uid,
        "name": name,
        "shortName": short_name or name,
        "country": country,
        "city": city,
        "continent": continent,
        "worldRanking": qs,
        "qsRanking": qs,
        "theRanking": (qs + 2) if qs else None,
        "type": utype,
        "website": website,
        "logo": logo_url,
        "heroImage": hero_img,
        "acceptanceRate": accept_rate,
        "studentPopulation": pop,
        "internationalStudents": intl_pop,
        "founded": founded,
        "tuition": {
            "international": tuition_intl,
            "domestic": tuition_dom,
            "currency": currency
        },
        "livingCostPerYear": {
            "amount": living_cost,
            "currency": currency
        },
        "applicationFee": {
            "amount": app_fee,
            "currency": currency
        },
        "applicationDeadlines": {
            "earlyAction": "November 1" if country == "United States" else None,
            "regularDecision": "January 15" if country == "United States" else "February 1",
            "spring": "October 1"
        },
        "languageRequirements": {
            "ielts": ielts,
            "toefl": toefl,
            "duolingo": duolingo
        },
        "minimumGPA": gpa,
        "popularMajors": majors,
        "availableDegrees": ["Bachelor", "Master", "PhD"],
        "scholarshipsAvailable": True,
        "description": desc or f"{name} is an internationally accredited higher education institution located in {city}, {country}, offering top-tier undergraduate and graduate degree programs.",
        "campusType": campus,
        "climate": climate,
        "employmentRate": emp_rate,
        "officialSocials": {
            "facebook": f"https://facebook.com/{uid}",
            "instagram": f"https://instagram.com/{uid}",
            "linkedin": f"https://linkedin.com/school/{uid}",
            "youtube": f"https://youtube.com/c/{uid}"
        }
    })

# 1. UNITED STATES (60)
us_data = [
    ("mit", "Massachusetts Institute of Technology", "MIT", "Cambridge", 1, "Private", "https://www.mit.edu", 61990, 61990, "USD", 19800, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Mechanical Engineering", "Physics"], "World-renowned STEM research university.", 1861, 11934, 3800, 4.0),
    ("stanford", "Stanford University", "Stanford", "Stanford", 2, "Private", "https://www.stanford.edu", 62480, 62480, "USD", 20500, 90, 7.5, 100, 135, 3.95, ["Computer Science", "Human Biology", "Economics"], "Silicon Valley research powerhouse.", 1885, 17326, 3900, 3.9),
    ("harvard", "Harvard University", "Harvard", "Cambridge", 4, "Private", "https://www.harvard.edu", 59076, 59076, "USD", 20100, 85, 7.5, 100, 135, 3.9, ["Economics", "Computer Science", "Government"], "America's oldest higher education institution.", 1636, 25261, 6100, 3.4),
    ("caltech", "California Institute of Technology", "Caltech", "Pasadena", 7, "Private", "https://www.caltech.edu", 60864, 60864, "USD", 18600, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Physics", "Electrical Engineering"], "World-famous science and engineering institute.", 1891, 2397, 800, 2.7),
    ("princeton", "Princeton University", "Princeton", "Princeton", 6, "Private", "https://www.princeton.edu", 59710, 59710, "USD", 18600, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Public Policy", "Economics"], "Ivy League research university.", 1746, 8475, 1900, 4.4),
    ("columbia", "Columbia University", "Columbia", "New York", 11, "Private", "https://www.columbia.edu", 65340, 65340, "USD", 21100, 85, 7.5, 100, 135, 3.85, ["Computer Science", "Economics", "Political Science"], "Historic Ivy League university in NYC.", 1754, 33413, 11200, 3.9),
    ("yale", "Yale University", "Yale", "New Haven", 16, "Private", "https://www.yale.edu", 64700, 64700, "USD", 18400, 80, 7.5, 100, 135, 3.9, ["Economics", "History", "Political Science"], "Ivy League research university.", 1701, 14591, 3100, 4.5),
    ("upenn", "University of Pennsylvania", "Penn", "Philadelphia", 12, "Private", "https://www.upenn.edu", 63452, 63452, "USD", 18200, 75, 7.5, 100, 135, 3.88, ["Finance", "Economics", "Nursing"], "Ivy League home to Wharton.", 1740, 28000, 5600, 5.9),
    ("berkeley", "University of California, Berkeley", "UC Berkeley", "Berkeley", 10, "Public", "https://www.berkeley.edu", 48465, 15442, "USD", 20800, 80, 7.0, 90, 125, 3.89, ["Computer Science", "Economics", "Cell Biology"], "Premier public research university.", 1868, 45307, 7200, 11.4),
    ("ucla", "University of California, Los Angeles", "UCLA", "Los Angeles", 29, "Public", "https://www.ucla.edu", 47052, 14028, "USD", 20200, 80, 7.0, 87, 120, 3.9, ["Psychology", "Economics", "Biology"], "Top public university in California.", 1919, 46000, 6800, 8.8),
    ("uchicago", "University of Chicago", "UChicago", "Chicago", 11, "Private", "https://www.uchicago.edu", 64260, 64260, "USD", 18800, 75, 7.5, 100, 135, 3.9, ["Economics", "Computer Science", "Mathematics"], "Renowned for intellectual rigor.", 1890, 18452, 4200, 5.4),
    ("cornell", "Cornell University", "Cornell", "Ithaca", 13, "Private", "https://www.cornell.edu", 65204, 65204, "USD", 17600, 80, 7.5, 100, 135, 3.86, ["Computer Science", "Engineering", "Hotel Admin"], "Ivy League land-grant university.", 1865, 25898, 6200, 7.3),
    ("nyu", "New York University", "NYU", "New York", 38, "Private", "https://www.nyu.edu", 60438, 60438, "USD", 21800, 85, 7.5, 100, 130, 3.7, ["Business", "Film", "Economics"], "Global urban university in NYC.", 1831, 58226, 17000, 12.0),
    ("jhu", "Johns Hopkins University", "Johns Hopkins", "Baltimore", 28, "Private", "https://www.jhu.edu", 60480, 60480, "USD", 18200, 70, 7.5, 100, 130, 3.88, ["Biomedical Engineering", "Medicine"], "World-famous research university.", 1876, 30000, 5000, 7.0),
    ("northwestern", "Northwestern University", "Northwestern", "Evanston", 47, "Private", "https://www.northwestern.edu", 64887, 64887, "USD", 19400, 75, 7.5, 100, 130, 3.85, ["Journalism", "Economics", "Engineering"], "Preeminent Midwest research institution.", 1851, 23410, 4100, 7.0),
    ("duke", "Duke University", "Duke", "Durham", 57, "Private", "https://www.duke.edu", 63450, 63450, "USD", 18100, 85, 7.0, 100, 130, 3.9, ["Computer Science", "Economics", "Public Policy"], "Top Southern private university.", 1838, 17154, 3800, 6.0),
    ("dartmouth", "Dartmouth College", "Dartmouth", "Hanover", 237, "Private", "https://home.dartmouth.edu", 63684, 63684, "USD", 18200, 80, 7.5, 100, 130, 3.85, ["Computer Science", "Economics"], "Ivy League undergraduate focus.", 1769, 6761, 1000, 6.2),
    ("brown", "Brown University", "Brown", "Providence", 73, "Private", "https://www.brown.edu", 65656, 65656, "USD", 17500, 75, 7.5, 105, 130, 3.88, ["Computer Science", "Economics"], "Ivy League Open Curriculum.", 1764, 10425, 2100, 5.0),
    ("vanderbilt", "Vanderbilt University", "Vanderbilt", "Nashville", 98, "Private", "https://www.vanderbilt.edu", 61618, 61618, "USD", 18900, 50, 7.0, 100, 130, 3.86, ["Economics", "Computer Science"], "Prestigious Nashville research university.", 1873, 13796, 1800, 6.7),
    ("rice", "Rice University", "Rice", "Houston", 145, "Private", "https://www.rice.edu", 57210, 57210, "USD", 15900, 75, 7.0, 100, 130, 3.9, ["Computer Science", "Bioengineering"], "Top Texas private university.", 1912, 8285, 1900, 8.7),
    ("wustl", "Washington University in St. Louis", "WashU", "St. Louis", 118, "Private", "https://wustl.edu", 61750, 61750, "USD", 18800, 75, 7.5, 100, 130, 3.85, ["Finance", "Biology", "Pre-Medicine"], "Leading research university in Missouri.", 1853, 16250, 3100, 11.0),
    ("notredame", "University of Notre Dame", "Notre Dame", "Notre Dame", 304, "Private", "https://www.nd.edu", 62693, 62693, "USD", 17300, 75, 7.5, 100, 130, 3.85, ["Finance", "Political Science"], "Catholic research university.", 1842, 13139, 1400, 12.0),
    ("emory", "Emory University", "Emory", "Atlanta", 166, "Private", "https://www.emory.edu", 59920, 59920, "USD", 17200, 75, 7.5, 100, 130, 3.8, ["Business", "Biology", "Nursing"], "Atlanta health and research university.", 1836, 15846, 2800, 11.0),
    ("georgetown", "Georgetown University", "Georgetown", "Washington", 297, "Private", "https://www.georgetown.edu", 64896, 64896, "USD", 19500, 90, 7.5, 100, 130, 3.85, ["International Relations", "Finance"], "Prominent in law and international affairs.", 1789, 19000, 3200, 12.0),
    ("cmu", "Carnegie Mellon University", "Carnegie Mellon", "Pittsburgh", 52, "Private", "https://www.cmu.edu", 62260, 62260, "USD", 17400, 75, 7.5, 102, 135, 3.88, ["Computer Science", "AI", "Robotics"], "Global leader in AI and CS.", 1900, 15818, 4200, 11.0),
    ("uva", "University of Virginia", "UVA", "Charlottesville", 260, "Public", "https://www.virginia.edu", 56838, 20388, "USD", 14200, 75, 7.0, 90, 125, 3.85, ["Business", "Economics"], "Founded by Thomas Jefferson.", 1819, 26000, 2400, 19.0),
    ("umich", "University of Michigan-Ann Arbor", "Michigan", "Ann Arbor", 33, "Public", "https://umich.edu", 57233, 17786, "USD", 13800, 75, 7.0, 100, 125, 3.88, ["Computer Science", "Business"], "Powerhouse public research university.", 1817, 51000, 7800, 18.0),
    ("unc", "University of North Carolina at Chapel Hill", "UNC", "Chapel Hill", 132, "Public", "https://www.unc.edu", 39338, 9000, "USD", 13200, 85, 7.0, 100, 125, 3.8, ["Journalism", "Biology"], "First public university in US.", 1789, 31500, 2100, 17.0),
    ("usc", "University of Southern California", "USC", "Los Angeles", 116, "Private", "https://www.usc.edu", 66639, 66639, "USD", 18700, 85, 7.0, 100, 130, 3.8, ["Cinematic Arts", "Business"], "Major LA research institution.", 1880, 49000, 11000, 12.0),
    ("tufts", "Tufts University", "Tufts", "Medford", 379, "Private", "https://www.tufts.edu", 66358, 66358, "USD", 17100, 75, 7.0, 100, 130, 3.75, ["International Relations", "CS"], "Boston area research university.", 1852, 13300, 1800, 10.0),
    ("ucsd", "University of California, San Diego", "UC San Diego", "La Jolla", 62, "Public", "https://ucsd.edu", 48387, 15364, "USD", 17800, 80, 7.0, 90, 125, 3.8, ["Biochemistry", "Computer Science"], "Coastal research powerhouse.", 1960, 43000, 8500, 24.0),
    ("ucdavis", "University of California, Davis", "UC Davis", "Davis", 118, "Public", "https://www.ucdavis.edu", 46048, 15025, "USD", 16900, 80, 7.0, 80, 115, 3.75, ["Veterinary Medicine", "Agriculture"], "Top agricultural and vet care campus.", 1905, 40000, 6200, 37.0),
    ("uci", "University of California, Irvine", "UC Irvine", "Irvine", 268, "Public", "https://uci.edu", 45800, 14700, "USD", 17500, 80, 7.0, 80, 115, 3.75, ["Computer Science", "Engineering"], "Tech-focused research campus.", 1965, 36000, 5200, 21.0),
    ("ucsb", "University of California, Santa Barbara", "UC Santa Barbara", "Santa Barbara", 163, "Public", "https://www.ucsb.edu", 46200, 15100, "USD", 17200, 80, 7.0, 80, 115, 3.8, ["Physics", "Environmental Studies"], "Beachside public university.", 1909, 26000, 3200, 26.0),
    ("bu", "Boston University", "BU", "Boston", 93, "Private", "https://www.bu.edu", 63798, 63798, "USD", 18100, 80, 7.0, 90, 130, 3.7, ["Business", "Communications"], "Vibrant urban Boston campus.", 1839, 36000, 10000, 14.0),
    ("northeastern", "Northeastern University", "Northeastern", "Boston", 396, "Private", "https://www.northeastern.edu", 62000, 62000, "USD", 19200, 75, 7.0, 100, 130, 3.7, ["Computer Science", "Co-op"], "Leader in co-op work experience.", 1898, 30000, 9000, 6.8),
    ("gatech", "Georgia Institute of Technology", "Georgia Tech", "Atlanta", 97, "Public", "https://www.gatech.edu", 32876, 11764, "USD", 15800, 85, 7.0, 90, 125, 3.8, ["Industrial Engineering", "CS"], "Top public STEM university.", 1885, 45000, 8200, 16.0),
    ("purdue", "Purdue University", "Purdue", "West Lafayette", 99, "Public", "https://www.purdue.edu", 28794, 9992, "USD", 10030, 60, 6.5, 80, 115, 3.6, ["Aeronautical Engineering", "CS"], "Cradle of Astronauts.", 1869, 50000, 9500, 50.0),
    ("uiuc", "University of Illinois Urbana-Champaign", "UIUC", "Urbana", 69, "Public", "https://illinois.edu", 39118, 17572, "USD", 13200, 75, 7.5, 103, 130, 3.75, ["Computer Science", "Accounting"], "Midwest STEM powerhouse.", 1867, 56000, 11000, 44.0),
    ("uwmadison", "University of Wisconsin-Madison", "UW-Madison", "Madison", 102, "Public", "https://www.wisc.edu", 40603, 11216, "USD", 13800, 70, 7.0, 80, 120, 3.7, ["Computer Science", "Economics"], "Lakefront research university.", 1848, 49000, 6500, 49.0),
    ("utaustin", "The University of Texas at Austin", "UT Austin", "Austin", 58, "Public", "https://www.utexas.edu", 40996, 11752, "USD", 13500, 75, 6.5, 79, 115, 3.8, ["Petroleum Engineering", "Business"], "Flagship Texas public university.", 1883, 52000, 6000, 31.0),
    ("tamu", "Texas A&M University", "Texas A&M", "College Station", 134, "Public", "https://www.tamu.edu", 40000, 13000, "USD", 12000, 90, 6.0, 80, 110, 3.5, ["Engineering", "Agriculture"], "Massive research institution.", 1876, 74000, 6500, 63.0),
    ("osu", "The Ohio State University", "Ohio State", "Columbus", 151, "Public", "https://www.osu.edu", 38365, 12485, "USD", 12500, 70, 6.5, 79, 115, 3.6, ["Finance", "Psychology"], "Comprehensive Ohio research campus.", 1870, 61000, 6000, 52.0),
    ("psu", "Pennsylvania State University", "Penn State", "University Park", 83, "Public", "https://www.psu.edu", 39626, 19835, "USD", 12900, 75, 6.5, 80, 115, 3.5, ["Supply Chain", "Engineering"], "Major public university.", 1855, 48000, 7000, 55.0),
    ("umd", "University of Maryland, College Park", "UMD", "College Park", 169, "Public", "https://umd.edu", 39000, 11000, "USD", 14500, 75, 7.0, 96, 120, 3.7, ["Computer Science", "Cybersecurity"], "Flagship campus near DC.", 1856, 40000, 5800, 44.0),
    ("uwashington", "University of Washington", "UW", "Seattle", 63, "Public", "https://www.washington.edu", 40740, 12242, "USD", 16800, 85, 7.0, 92, 120, 3.75, ["Computer Science", "Nursing"], "Pacific Northwest premier campus.", 1861, 52000, 8000, 48.0),
    ("ufl", "University of Florida", "UF", "Gainesville", 168, "Public", "https://www.ufl.edu", 28658, 6381, "USD", 11200, 30, 6.0, 80, 110, 3.8, ["Biomedical Sciences", "Business"], "Top Florida public university.", 1853, 55000, 4500, 23.0),
    ("miami", "University of Miami", "UM", "Coral Gables", 278, "Private", "https://welcome.miami.edu", 58102, 58102, "USD", 17900, 70, 6.5, 80, 125, 3.6, ["Marine Science", "Finance"], "South Florida research university.", 1925, 19000, 2700, 19.0),
    ("tulane", "Tulane University", "Tulane", "New Orleans", 601, "Private", "https://tulane.edu", 65538, 65538, "USD", 17500, 75, 7.0, 95, 125, 3.65, ["Public Health", "Finance"], "New Orleans private university.", 1834, 14000, 1200, 11.0),
    ("rochester", "University of Rochester", "Rochester", "Rochester", 224, "Private", "https://www.rochester.edu", 63150, 63150, "USD", 17800, 70, 7.5, 100, 130, 3.7, ["Optics", "Music"], "Famous for optics and music.", 1850, 12000, 3100, 39.0),
    ("case", "Case Western Reserve University", "Case Western", "Cleveland", 142, "Private", "https://case.edu", 61800, 61800, "USD", 17200, 75, 7.0, 90, 125, 3.7, ["Biomedical Engineering", "Nursing"], "Cleveland research institution.", 1826, 12000, 2400, 27.0),
    ("wm", "William & Mary", "W&M", "Williamsburg", 801, "Public", "https://www.wm.edu", 47000, 23000, "USD", 15000, 75, 7.0, 100, 125, 3.8, ["History", "Government"], "Second oldest US university.", 1693, 9500, 800, 33.0),
    ("wake", "Wake Forest University", "Wake Forest", "Winston-Salem", 801, "Private", "https://www.wfu.edu", 62000, 62000, "USD", 16800, 80, 7.0, 100, 125, 3.7, ["Finance", "Pre-Med"], "North Carolina liberal arts research school.", 1834, 8900, 900, 20.0),
    ("lehigh", "Lehigh University", "Lehigh", "Bethlehem", 601, "Private", "https://www.lehigh.edu", 60000, 60000, "USD", 16000, 75, 7.0, 95, 125, 3.6, ["Engineering", "Business"], "Pennsylvania engineering powerhouse.", 1865, 7200, 800, 37.0),
    ("pepperdine", "Pepperdine University", "Pepperdine", "Malibu", 801, "Private", "https://www.pepperdine.edu", 63000, 63000, "USD", 18500, 90, 6.5, 80, 115, 3.6, ["Business", "Sports Medicine"], "Malibu oceanfront Christian university.", 1937, 10000, 1100, 35.0),
    ("smu", "Southern Methodist University", "SMU", "Dallas", 801, "Private", "https://www.smu.edu", 61000, 61000, "USD", 18000, 75, 6.5, 80, 115, 3.6, ["Finance", "Cox Business"], "Top Dallas private university.", 1911, 12000, 1600, 52.0),
    ("syracuse", "Syracuse University", "Syracuse", "Syracuse", 751, "Private", "https://www.syracuse.edu", 58000, 58000, "USD", 17500, 85, 6.5, 80, 115, 3.5, ["Communications", "Architecture"], "Upstate New York campus.", 1870, 22000, 3500, 52.0),
    ("villanova", "Villanova University", "Villanova", "Villanova", 801, "Private", "https://www.villanova.edu", 61000, 61000, "USD", 16500, 90, 6.5, 80, 115, 3.7, ["Finance", "Nursing"], "Augustinian Catholic university.", 1842, 11000, 800, 25.0),
    ("rpi", "Rensselaer Polytechnic Institute", "RPI", "Troy", 701, "Private", "https://www.rpi.edu", 60000, 60000, "USD", 17000, 75, 7.0, 88, 120, 3.6, ["Aeronautical Engineering", "CS"], "America's oldest technological research university.", 1824, 7500, 1200, 65.0),
    ("vt", "Virginia Tech", "Virginia Tech", "Blacksburg", 301, "Public", "https://www.vt.edu", 35000, 12000, "USD", 12500, 70, 6.5, 80, 115, 3.6, ["Engineering", "Architecture"], "Major land-grant research institution.", 1872, 37000, 3800, 56.0)
]

for row in us_data:
    uni(row[0], row[1], row[2], "United States", row[3], "North America", row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16], row[17], row[18], row[19], row[20], row[21])

print(f"US universities added: {len(unis)}")
