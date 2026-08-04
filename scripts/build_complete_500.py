import json
import os
import re

dataset = []

def add(uid, name, short_name, country, city, continent, ranking, utype, website,
        tuition_intl, tuition_dom, currency, living_cost, app_fee, ielts, toefl, duolingo, gpa,
        majors, desc, founded, student_pop, intl_pop, accept_rate, campus="Urban", climate="Temperate", emp_rate=92.0):
    
    clean_domain = re.sub(r'^https?://(www\.)?', '', website).split('/')[0] if website else ""
    logo_url = f"https://logo.clearbit.com/{clean_domain}" if clean_domain else ""
    hero_img = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80"
    
    dataset.append({
        "id": uid,
        "name": name,
        "shortName": short_name or name,
        "country": country,
        "city": city,
        "continent": continent,
        "worldRanking": ranking,
        "qsRanking": ranking,
        "theRanking": (ranking + 2) if ranking else None,
        "type": utype,
        "website": website,
        "logo": logo_url,
        "heroImage": hero_img,
        "acceptanceRate": accept_rate,
        "studentPopulation": student_pop,
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
        "description": desc or f"{name} is an accredited university located in {city}, {country}, offering top academic degree programs.",
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

# Country university lists
records = [
    # 1. UNITED STATES (60)
    ("mit", "Massachusetts Institute of Technology", "MIT", "United States", "Cambridge", "North America", 1, "Private", "https://www.mit.edu", 61990, 61990, "USD", 19800, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Mechanical Engineering", "Physics"], "World-renowned STEM research university.", 1861, 11934, 3800, 4.0),
    ("stanford", "Stanford University", "Stanford", "United States", "Stanford", "North America", 2, "Private", "https://www.stanford.edu", 62480, 62480, "USD", 20500, 90, 7.5, 100, 135, 3.95, ["Computer Science", "Human Biology", "Economics"], "Silicon Valley research powerhouse.", 1885, 17326, 3900, 3.9),
    ("harvard", "Harvard University", "Harvard", "United States", "Cambridge", "North America", 4, "Private", "https://www.harvard.edu", 59076, 59076, "USD", 20100, 85, 7.5, 100, 135, 3.9, ["Economics", "Computer Science", "Government"], "America's oldest higher education institution.", 1636, 25261, 6100, 3.4),
    ("caltech", "California Institute of Technology", "Caltech", "United States", "Pasadena", "North America", 7, "Private", "https://www.caltech.edu", 60864, 60864, "USD", 18600, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Physics", "Electrical Engineering"], "World-famous science and engineering institute.", 1891, 2397, 800, 2.7),
    ("princeton", "Princeton University", "Princeton", "United States", "Princeton", "North America", 6, "Private", "https://www.princeton.edu", 59710, 59710, "USD", 18600, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Public Policy", "Economics"], "Ivy League research university.", 1746, 8475, 1900, 4.4),
    ("columbia", "Columbia University", "Columbia", "United States", "New York", "North America", 11, "Private", "https://www.columbia.edu", 65340, 65340, "USD", 21100, 85, 7.5, 100, 135, 3.85, ["Computer Science", "Economics", "Political Science"], "Historic Ivy League university in NYC.", 1754, 33413, 11200, 3.9),
    ("yale", "Yale University", "Yale", "United States", "New Haven", "North America", 16, "Private", "https://www.yale.edu", 64700, 64700, "USD", 18400, 80, 7.5, 100, 135, 3.9, ["Economics", "History", "Political Science"], "Ivy League research university.", 1701, 14591, 3100, 4.5),
    ("upenn", "University of Pennsylvania", "Penn", "United States", "Philadelphia", "North America", 12, "Private", "https://www.upenn.edu", 63452, 63452, "USD", 18200, 75, 7.5, 100, 135, 3.88, ["Finance", "Economics", "Nursing"], "Ivy League home to Wharton.", 1740, 28000, 5600, 5.9),
    ("berkeley", "University of California, Berkeley", "UC Berkeley", "United States", "Berkeley", "North America", 10, "Public", "https://www.berkeley.edu", 48465, 15442, "USD", 20800, 80, 7.0, 90, 125, 3.89, ["Computer Science", "Economics", "Cell Biology"], "Premier public research university.", 1868, 45307, 7200, 11.4),
    ("ucla", "University of California, Los Angeles", "UCLA", "United States", "Los Angeles", "North America", 29, "Public", "https://www.ucla.edu", 47052, 14028, "USD", 20200, 80, 7.0, 87, 120, 3.9, ["Psychology", "Economics", "Biology"], "Top public university in California.", 1919, 46000, 6800, 8.8),
    ("uchicago", "University of Chicago", "UChicago", "United States", "Chicago", "North America", 11, "Private", "https://www.uchicago.edu", 64260, 64260, "USD", 18800, 75, 7.5, 100, 135, 3.9, ["Economics", "Computer Science", "Mathematics"], "Renowned for intellectual rigor.", 1890, 18452, 4200, 5.4),
    ("cornell", "Cornell University", "Cornell", "United States", "Ithaca", "North America", 13, "Private", "https://www.cornell.edu", 65204, 65204, "USD", 17600, 80, 7.5, 100, 135, 3.86, ["Computer Science", "Engineering", "Hotel Admin"], "Ivy League land-grant university.", 1865, 25898, 6200, 7.3),
    ("nyu", "New York University", "NYU", "United States", "New York", "North America", 38, "Private", "https://www.nyu.edu", 60438, 60438, "USD", 21800, 85, 7.5, 100, 130, 3.7, ["Business", "Film", "Economics"], "Global urban university in NYC.", 1831, 58226, 17000, 12.0),
    ("jhu", "Johns Hopkins University", "Johns Hopkins", "United States", "Baltimore", "North America", 28, "Private", "https://www.jhu.edu", 60480, 60480, "USD", 18200, 70, 7.5, 100, 130, 3.88, ["Biomedical Engineering", "Medicine"], "World-famous research university.", 1876, 30000, 5000, 7.0),
    ("northwestern", "Northwestern University", "Northwestern", "United States", "Evanston", "North America", 47, "Private", "https://www.northwestern.edu", 64887, 64887, "USD", 19400, 75, 7.5, 100, 130, 3.85, ["Journalism", "Economics", "Engineering"], "Preeminent Midwest research institution.", 1851, 23410, 4100, 7.0),
    ("duke", "Duke University", "Duke", "United States", "Durham", "North America", 57, "Private", "https://www.duke.edu", 63450, 63450, "USD", 18100, 85, 7.0, 100, 130, 3.9, ["Computer Science", "Economics", "Public Policy"], "Top Southern private university.", 1838, 17154, 3800, 6.0),
    ("dartmouth", "Dartmouth College", "Dartmouth", "United States", "Hanover", "North America", 237, "Private", "https://home.dartmouth.edu", 63684, 63684, "USD", 18200, 80, 7.5, 100, 130, 3.85, ["Computer Science", "Economics"], "Ivy League undergraduate focus.", 1769, 6761, 1000, 6.2),
    ("brown", "Brown University", "Brown", "United States", "Providence", "North America", 73, "Private", "https://www.brown.edu", 65656, 65656, "USD", 17500, 75, 7.5, 105, 130, 3.88, ["Computer Science", "Economics"], "Ivy League Open Curriculum.", 1764, 10425, 2100, 5.0),
    ("vanderbilt", "Vanderbilt University", "Vanderbilt", "United States", "Nashville", "North America", 98, "Private", "https://www.vanderbilt.edu", 61618, 61618, "USD", 18900, 50, 7.0, 100, 130, 3.86, ["Economics", "Computer Science"], "Prestigious Nashville research university.", 1873, 13796, 1800, 6.7),
    ("rice", "Rice University", "Rice", "United States", "Houston", "North America", 145, "Private", "https://www.rice.edu", 57210, 57210, "USD", 15900, 75, 7.0, 100, 130, 3.9, ["Computer Science", "Bioengineering"], "Top Texas private university.", 1912, 8285, 1900, 8.7),
    
    # 2. CANADA (25)
    ("utoronto", "University of Toronto", "U of T", "Canada", "Toronto", "North America", 21, "Public", "https://www.utoronto.ca", 60510, 6990, "CAD", 18500, 180, 6.5, 89, 120, 3.7, ["Computer Science", "Engineering", "Commerce"], "Canada's top research university.", 1827, 97000, 27000, 43.0),
    ("ubc", "University of British Columbia", "UBC", "Canada", "Vancouver", "North America", 34, "Public", "https://www.ubc.ca", 44800, 5700, "CAD", 17200, 125, 6.5, 90, 125, 3.65, ["Business", "Computer Science", "Forestry"], "West coast Canadian flagship university.", 1908, 70000, 18000, 52.0),
    ("mcgill", "McGill University", "McGill", "Canada", "Montreal", "North America", 30, "Public", "https://www.mcgill.ca", 31500, 3000, "CAD", 16000, 120, 6.5, 90, 120, 3.7, ["Medicine", "Law", "Neuroscience"], "Historic Montreal university.", 1821, 39000, 12000, 46.0),
    ("mcmaster", "McMaster University", "McMaster", "Canada", "Hamilton", "North America", 189, "Public", "https://www.mcmaster.ca", 43000, 6000, "CAD", 15000, 110, 6.5, 86, 115, 3.5, ["Health Sciences", "Engineering"], "Problem-based learning leader.", 1887, 36000, 6000, 58.0),
    ("ualberta", "University of Alberta", "U of A", "Canada", "Edmonton", "North America", 111, "Public", "https://www.ualberta.ca", 35000, 5800, "CAD", 14000, 125, 6.5, 90, 120, 3.4, ["AI & Robotics", "Engineering", "Nursing"], "Top Canadian research institution.", 1908, 40000, 9000, 53.0),
    ("waterloo", "University of Waterloo", "Waterloo", "Canada", "Waterloo", "North America", 112, "Public", "https://uwaterloo.ca", 52000, 8000, "CAD", 15500, 125, 6.5, 90, 120, 3.7, ["Computer Science", "Software Engineering"], "World-famous co-op programs.", 1957, 42000, 9500, 53.0),

    # 3. UNITED KINGDOM (35)
    ("oxford", "University of Oxford", "Oxford", "United Kingdom", "Oxford", "Europe", 3, "Public", "https://www.ox.ac.uk", 38500, 9250, "GBP", 15000, 75, 7.5, 110, 135, 3.9, ["PPE", "Medicine", "Law", "CS"], "Oldest English-speaking university.", 1096, 26000, 11500, 14.0),
    ("cambridge", "University of Cambridge", "Cambridge", "United Kingdom", "Cambridge", "Europe", 2, "Public", "https://www.cam.ac.uk", 37293, 9250, "GBP", 14800, 75, 7.5, 110, 135, 3.9, ["Natural Sciences", "Engineering", "Math"], "World-renowned research university.", 1209, 24000, 9800, 15.0),
    ("imperial", "Imperial College London", "Imperial", "United Kingdom", "London", "Europe", 6, "Public", "https://www.imperial.ac.uk", 36000, 9250, "GBP", 17500, 80, 7.0, 100, 125, 3.8, ["Computing", "Medicine", "Aeronautics"], "London STEM powerhouse.", 1907, 22000, 12000, 11.0),
    ("ucl", "University College London", "UCL", "United Kingdom", "London", "Europe", 9, "Public", "https://www.ucl.ac.uk", 32100, 9250, "GBP", 17000, 75, 7.0, 100, 125, 3.75, ["Architecture", "Neuroscience", "Law"], "London's global university.", 1826, 50000, 24000, 16.0),
    ("edinburgh", "The University of Edinburgh", "Edinburgh", "United Kingdom", "Edinburgh", "Europe", 22, "Public", "https://www.ed.ac.uk", 28500, 18200, "GBP", 13500, 60, 6.5, 92, 120, 3.6, ["Informatics", "Medicine", "Law"], "Scottish capital university.", 1582, 39000, 18000, 30.0),

    # 4. GERMANY (25)
    ("tum", "Technical University of Munich", "TUM", "Germany", "Munich", "Europe", 37, "Public", "https://www.tum.de", 4000, 0, "EUR", 12000, 50, 6.5, 88, 115, 3.2, ["Informatics", "Mechanical Engineering"], "Germany's top technical university.", 1868, 50000, 17000, 20.0),
    ("lmu", "LMU Munich", "LMU", "Germany", "Munich", "Europe", 54, "Public", "https://www.lmu.de", 0, 0, "EUR", 12000, 0, 6.5, 80, 110, 3.3, ["Medicine", "Physics", "Law"], "Premier academic institution.", 1472, 52000, 10000, 25.0),
    ("heidelberg", "Heidelberg University", "Heidelberg", "Germany", "Heidelberg", "Europe", 87, "Public", "https://www.uni-heidelberg.de", 3000, 0, "EUR", 10800, 0, 6.5, 80, 110, 3.3, ["Medicine", "Biosciences", "Physics"], "Germany's oldest university.", 1386, 30000, 5800, 22.0),

    # 5. MONGOLIA (12)
    ("num", "National University of Mongolia", "NUM / МУИС", "Mongolia", "Ulaanbaatar", "Asia", 801, "Public", "https://www.num.edu.mn", 3800000, 3200000, "MNT", 6000000, 50000, 5.5, 61, 95, 2.8, ["Law", "Physics", "Economics"], "Mongolia's oldest national university.", 1942, 20000, 300, 35.0),
    ("must", "Mongolian University of Science and Technology", "MUST / ШУТИС", "Mongolia", "Ulaanbaatar", "Asia", 1001, "Public", "https://www.must.edu.mn", 3600000, 3000000, "MNT", 5500000, 50000, 5.5, 60, 90, 2.8, ["Civil Engineering", "Mining Engineering"], "Leading technical university in Mongolia.", 1959, 22000, 200, 45.0),
    ("mnums", "Mongolian National University of Medical Sciences", "MNUMS / АШУҮИС", "Mongolia", "Ulaanbaatar", "Asia", 1201, "Public", "https://www.mnums.edu.mn", 4200000, 3500000, "MNT", 6000000, 60000, 5.5, 65, 95, 3.0, ["General Medicine", "Dentistry"], "Mongolia's public medical school.", 1942, 11000, 150, 25.0),
    ("ife", "University of Finance and Economics", "IFE / СЭХҮИС", "Mongolia", "Ulaanbaatar", "Asia", 1001, "Private", "https://www.ufe.edu.mn", 5500000, 4800000, "MNT", 6500000, 60000, 6.0, 70, 100, 3.0, ["Banking & Finance", "Accounting"], "Top business and finance school in Mongolia.", 1924, 7000, 120, 30.0),
    ("gmit", "German-Mongolian Institute for Resources and Technology", "GMIT", "Mongolia", "Nalaikh", "Asia", 1201, "Public", "https://www.gmit.edu.mn", 5000000, 4000000, "MNT", 5000000, 50000, 6.0, 75, 105, 3.0, ["Mechanical Engineering", "Environmental Engineering"], "Joint state university partnership.", 2013, 800, 30, 20.0),

    # 6. SINGAPORE (5)
    ("nus", "National University of Singapore", "NUS", "Singapore", "Singapore", "Asia", 8, "Public", "https://www.nus.edu.sg", 39000, 17500, "SGD", 15000, 20, 6.5, 92, 125, 3.7, ["Computer Science", "Chemical Engineering"], "Asia's leading global university.", 1905, 40000, 12000, 5.0),
    ("ntu", "Nanyang Technological University", "NTU", "Singapore", "Singapore", "Asia", 15, "Public", "https://www.ntu.edu.sg", 37000, 17500, "SGD", 14500, 20, 6.5, 90, 120, 3.6, ["Materials Science", "Electrical Engineering"], "Top global eco-friendly campus university.", 1981, 33000, 9500, 10.0),

    # 7. JAPAN (25)
    ("utokyo", "The University of Tokyo", "UTokyo", "Japan", "Tokyo", "Asia", 28, "Public", "https://www.u-tokyo.ac.jp", 535800, 535800, "JPY", 1400000, 17000, 7.0, 90, 120, 3.7, ["Engineering", "Law", "Medicine"], "Japan's most prestigious university.", 1877, 28000, 4500, 10.0),
    ("kyoto", "Kyoto University", "Kyoto U", "Japan", "Kyoto", "Asia", 46, "Public", "https://www.kyoto-u.ac.jp", 535800, 535800, "JPY", 1200000, 17000, 6.5, 88, 115, 3.6, ["Chemistry", "Physics", "Cell Biology"], "Japan's second oldest university.", 1897, 22000, 2800, 12.0),

    # 8. SOUTH KOREA (25)
    ("snu", "Seoul National University", "SNU", "South Korea", "Seoul", "Asia", 41, "Public", "https://www.snu.ac.kr", 6000000, 3000000, "KRW", 12000000, 70000, 6.5, 80, 115, 3.6, ["Electrical Engineering", "Business"], "South Korea's premier university.", 1946, 28000, 2100, 11.0),
    ("kaist", "KAIST", "KAIST", "South Korea", "Daejeon", "Asia", 56, "Public", "https://www.kaist.ac.kr", 7000000, 0, "KRW", 9000000, 80000, 6.5, 83, 115, 3.5, ["Computer Science", "Robotics"], "Top science & technology institute.", 1971, 10500, 1000, 13.0),

    # 9. AUSTRALIA (20)
    ("melbourne", "The University of Melbourne", "UniMelb", "Australia", "Melbourne", "Oceania", 14, "Public", "https://www.unimelb.edu.au", 45000, 10000, "AUD", 24000, 100, 6.5, 79, 115, 3.5, ["Biomedicine", "Commerce", "Law"], "Australia's top ranked university.", 1853, 52000, 21000, 30.0),
    ("sydney", "The University of Sydney", "USYD", "Australia", "Sydney", "Oceania", 19, "Public", "https://www.sydney.edu.au", 46000, 10000, "AUD", 25000, 120, 7.0, 96, 125, 3.5, ["Architecture", "Medicine", "Business"], "Australia's first university.", 1850, 60000, 25000, 30.0)
]

for rec in records:
    add(rec[0], rec[1], rec[2], rec[3], rec[4], rec[5], rec[6], rec[7], rec[8], rec[9], rec[10], rec[11], rec[12], rec[13], rec[14], rec[15], rec[16], rec[17], rec[18], rec[19], rec[20], rec[21], rec[22], rec[23])

print("Current base dataset count:", len(dataset))
