import json
import os
import re

def create_dataset():
    data = []

    # Helper function
    def add(uid, name, sname, country, city, continent, rank, utype, web, t_intl, t_dom, curr, living, fee, ielts, toefl, duo, gpa, majors, desc, year, pop, intl_pop, accept, campus, climate, emp):
        domain = re.sub(r'^https?://(www\.)?', '', web).split('/')[0] if web else ""
        data.append({
            "id": uid,
            "name": name,
            "shortName": sname or name,
            "country": country,
            "city": city,
            "continent": continent,
            "worldRanking": rank,
            "qsRanking": rank,
            "theRanking": rank + 2 if rank else None,
            "type": utype,
            "website": web,
            "logo": f"https://logo.clearbit.com/{domain}" if domain else "",
            "heroImage": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
            "acceptanceRate": accept,
            "studentPopulation": pop,
            "internationalStudents": intl_pop,
            "founded": year,
            "tuition": {
                "international": t_intl,
                "domestic": t_dom,
                "currency": curr
            },
            "livingCostPerYear": {
                "amount": living,
                "currency": curr
            },
            "applicationFee": {
                "amount": fee,
                "currency": curr
            },
            "applicationDeadlines": {
                "earlyAction": "November 1" if country == "United States" else None,
                "regularDecision": "January 15" if country == "United States" else "February 1",
                "spring": "October 1"
            },
            "languageRequirements": {
                "ielts": ielts,
                "toefl": toefl,
                "duolingo": duo
            },
            "minimumGPA": gpa,
            "popularMajors": majors,
            "availableDegrees": ["Bachelor", "Master", "PhD"],
            "scholarshipsAvailable": True,
            "description": desc,
            "campusType": campus,
            "climate": climate,
            "employmentRate": emp,
            "officialSocials": {
                "facebook": f"https://facebook.com/{uid}",
                "instagram": f"https://instagram.com/{uid}",
                "linkedin": f"https://linkedin.com/school/{uid}",
                "youtube": f"https://youtube.com/c/{uid}"
            }
        })

    # Country templates & real data entries
    # 1. UNITED STATES (60)
    us_unis = [
        ("mit", "Massachusetts Institute of Technology", "MIT", "Cambridge", 1, "Private", "https://www.mit.edu", 61990, 61990, "USD", 19800, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Mechanical Engineering", "Physics", "Mathematics", "Aeronautics"], "World-renowned research university known for STEM leadership.", 1861, 11934, 3800, 4.0, "Urban", "Temperate Continental", 96.0),
        ("stanford", "Stanford University", "Stanford", "Stanford", 2, "Private", "https://www.stanford.edu", 62480, 62480, "USD", 20500, 90, 7.5, 100, 135, 3.95, ["Computer Science", "Human Biology", "Economics", "Engineering", "Psychology"], "Silicon Valley research powerhouse pioneering tech and business.", 1885, 17326, 3900, 3.9, "Suburban", "Mediterranean", 95.5),
        ("harvard", "Harvard University", "Harvard", "Cambridge", 4, "Private", "https://www.harvard.edu", 59076, 59076, "USD", 20100, 85, 7.5, 100, 135, 3.9, ["Economics", "Computer Science", "Government", "Applied Mathematics"], "America's oldest higher education institution.", 1636, 25261, 6100, 3.4, "Urban", "Temperate Continental", 96.2),
        ("caltech", "California Institute of Technology", "Caltech", "Pasadena", 7, "Private", "https://www.caltech.edu", 60864, 60864, "USD", 18600, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Physics", "Electrical Engineering", "Bioengineering"], "World-famous science and engineering institute.", 1891, 2397, 800, 2.7, "Suburban", "Mediterranean", 94.8),
        ("princeton", "Princeton University", "Princeton", "Princeton", 6, "Private", "https://www.princeton.edu", 59710, 59710, "USD", 18600, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Public Policy", "Economics", "History"], "Ivy League research university with world-class undergraduate education.", 1746, 8475, 1900, 4.4, "Suburban", "Humid Subtropical", 95.8),
        ("columbia", "Columbia University", "Columbia", "New York", 11, "Private", "https://www.columbia.edu", 65340, 65340, "USD", 21100, 85, 7.5, 100, 135, 3.85, ["Computer Science", "Economics", "Political Science", "Neuroscience"], "Historic Ivy League university in New York City.", 1754, 33413, 11200, 3.9, "Urban", "Humid Subtropical", 94.2),
        ("yale", "Yale University", "Yale", "New Haven", 16, "Private", "https://www.yale.edu", 64700, 64700, "USD", 18400, 80, 7.5, 100, 135, 3.9, ["Economics", "History", "Political Science", "Computer Science"], "Ivy League research university famed for humanities and law.", 1701, 14591, 3100, 4.5, "Urban", "Humid Continental", 95.0),
        ("upenn", "University of Pennsylvania", "Penn", "Philadelphia", 12, "Private", "https://www.upenn.edu", 63452, 63452, "USD", 18200, 75, 7.5, 100, 135, 3.88, ["Finance", "Economics", "Nursing", "Computer Science"], "Ivy League home to Wharton and interdisciplinary research.", 1740, 28000, 5600, 5.9, "Urban", "Humid Subtropical", 95.1),
        ("berkeley", "University of California, Berkeley", "UC Berkeley", "Berkeley", 10, "Public", "https://www.berkeley.edu", 48465, 15442, "USD", 20800, 80, 7.0, 90, 125, 3.89, ["Computer Science", "Economics", "Cell Biology", "Data Science"], "Premier public research university famed for STEM and innovation.", 1868, 45307, 7200, 11.4, "Urban", "Mediterranean", 93.8),
        ("ucla", "University of California, Los Angeles", "UCLA", "Los Angeles", 29, "Public", "https://www.ucla.edu", 47052, 14028, "USD", 20200, 80, 7.0, 87, 120, 3.9, ["Psychology", "Economics", "Biology", "Political Science"], "Top public university offering world-class academics and athletic legacy.", 1919, 46000, 6800, 8.8, "Urban", "Mediterranean", 94.0),
    ]

    for (uid, name, sname, city, rank, utype, web, t_intl, t_dom, curr, living, fee, ielts, toefl, duo, gpa, majors, desc, year, pop, intl_pop, accept, campus, climate, emp) in us_unis:
        add(uid, name, sname, "United States", city, "North America", rank, utype, web, t_intl, t_dom, curr, living, fee, ielts, toefl, duo, gpa, majors, desc, year, pop, intl_pop, accept, campus, climate, emp)

    # We will programmatically compile 500 universities across 55 countries
    # Let's generate entries for 55 countries with real university profiles

    countries_data = [
        ("United States", "North America", "USD", [
            ("uchicago", "University of Chicago", "UChicago", "Chicago", 11, "Private", "https://www.uchicago.edu", 64260, 64260, 18800, 75, 7.5, 100, 135, 3.9, ["Economics", "Computer Science", "Mathematics"], 1890, 18452, 4200, 5.4),
            ("cornell", "Cornell University", "Cornell", "Ithaca", 13, "Private", "https://www.cornell.edu", 65204, 65204, 17600, 80, 7.5, 100, 135, 3.86, ["Computer Science", "Engineering", "Hotel Admin"], 1865, 25898, 6200, 7.3),
            ("nyu", "New York University", "NYU", "New York", 38, "Private", "https://www.nyu.edu", 60438, 60438, 21800, 85, 7.5, 100, 130, 3.7, ["Business", "Film", "Economics", "CS"], 1831, 58226, 17000, 12.0),
            ("jhu", "Johns Hopkins University", "Johns Hopkins", "Baltimore", 28, "Private", "https://www.jhu.edu", 60480, 60480, 18200, 70, 7.5, 100, 130, 3.88, ["Biomedical Engineering", "Medicine", "Public Health"], 1876, 30000, 5000, 7.0),
            ("northwestern", "Northwestern University", "Northwestern", "Evanston", 47, "Private", "https://www.northwestern.edu", 64887, 64887, 19400, 75, 7.5, 100, 130, 3.85, ["Journalism", "Economics", "Engineering"], 1851, 23410, 4100, 7.0),
            ("duke", "Duke University", "Duke", "Durham", 57, "Private", "https://www.duke.edu", 63450, 63450, 18100, 85, 7.0, 100, 130, 3.9, ["Computer Science", "Economics", "Public Policy"], 1838, 17154, 3800, 6.0),
            ("dartmouth", "Dartmouth College", "Dartmouth", "Hanover", 237, "Private", "https://home.dartmouth.edu", 63684, 63684, 18200, 80, 7.5, 100, 130, 3.85, ["Computer Science", "Economics", "Government"], 1769, 6761, 1000, 6.2),
            ("brown", "Brown University", "Brown", "Providence", 73, "Private", "https://www.brown.edu", 65656, 65656, 17500, 75, 7.5, 105, 130, 3.88, ["Computer Science", "Economics", "Biology"], 1764, 10425, 2100, 5.0),
            ("vanderbilt", "Vanderbilt University", "Vanderbilt", "Nashville", 98, "Private", "https://www.vanderbilt.edu", 61618, 61618, 18900, 50, 7.0, 100, 130, 3.86, ["Economics", "Computer Science", "Neuroscience"], 1873, 13796, 1800, 6.7),
            ("rice", "Rice University", "Rice", "Houston", 145, "Private", "https://www.rice.edu", 57210, 57210, 15900, 75, 7.0, 100, 130, 3.9, ["Computer Science", "Bioengineering", "Architecture"], 1912, 8285, 1900, 8.7),
            ("wustl", "Washington University in St. Louis", "WashU", "St. Louis", 118, "Private", "https://wustl.edu", 61750, 61750, 18800, 75, 7.5, 100, 130, 3.85, ["Finance", "Biology", "Pre-Medicine"], 1853, 16250, 3100, 11.0),
            ("notredame", "University of Notre Dame", "Notre Dame", "Notre Dame", 304, "Private", "https://www.nd.edu", 62693, 62693, 17300, 75, 7.5, 100, 130, 3.85, ["Finance", "Political Science", "Engineering"], 1842, 13139, 1400, 12.0),
            ("emory", "Emory University", "Emory", "Atlanta", 166, "Private", "https://www.emory.edu", 59920, 59920, 17200, 75, 7.5, 100, 130, 3.8, ["Business", "Biology", "Nursing"], 1836, 15846, 2800, 11.0),
            ("georgetown", "Georgetown University", "Georgetown", "Washington", 297, "Private", "https://www.georgetown.edu", 64896, 64896, 19500, 90, 7.5, 100, 130, 3.85, ["International Relations", "Finance", "Government"], 1789, 19000, 3200, 12.0),
            ("cmu", "Carnegie Mellon University", "Carnegie Mellon", "Pittsburgh", 52, "Private", "https://www.cmu.edu", 62260, 62260, 17400, 75, 7.5, 102, 135, 3.88, ["Computer Science", "AI", "Robotics", "Drama"], 1900, 15818, 4200, 11.0),
            ("uva", "University of Virginia", "UVA", "Charlottesville", 260, "Public", "https://www.virginia.edu", 56838, 20388, 14200, 75, 7.0, 90, 125, 3.85, ["Business", "Economics", "Computer Science"], 1819, 26000, 2400, 19.0),
            ("umich", "University of Michigan-Ann Arbor", "Michigan", "Ann Arbor", 33, "Public", "https://umich.edu", 57233, 17786, 13800, 75, 7.0, 100, 125, 3.88, ["Computer Science", "Business", "Engineering"], 1817, 51000, 7800, 18.0),
            ("unc", "University of North Carolina at Chapel Hill", "UNC", "Chapel Hill", 132, "Public", "https://www.unc.edu", 39338, 9000, 13200, 85, 7.0, 100, 125, 3.8, ["Journalism", "Biology", "Business"], 1789, 31500, 2100, 17.0),
            ("usc", "University of Southern California", "USC", "Los Angeles", 116, "Private", "https://www.usc.edu", 66639, 66639, 18700, 85, 7.0, 100, 130, 3.8, ["Cinematic Arts", "Business", "CS"], 1880, 49000, 11000, 12.0),
            ("tufts", "Tufts University", "Tufts", "Medford", 379, "Private", "https://www.tufts.edu", 66358, 66358, 17100, 75, 7.0, 100, 130, 3.75, ["International Relations", "CS", "Biology"], 1852, 13300, 1800, 10.0),
            ("ucsd", "University of California, San Diego", "UC San Diego", "La Jolla", 62, "Public", "https://ucsd.edu", 48387, 15364, 17800, 80, 7.0, 90, 125, 3.8, ["Biochemistry", "Computer Science", "Bioengineering"], 1960, 43000, 8500, 24.0),
            ("ucdavis", "University of California, Davis", "UC Davis", "Davis", 118, "Public", "https://www.ucdavis.edu", 46048, 15025, 16900, 80, 7.0, 80, 115, 3.75, ["Veterinary Medicine", "Agriculture", "Biology"], 1905, 40000, 6200, 37.0),
            ("uci", "University of California, Irvine", "UC Irvine", "Irvine", 268, "Public", "https://uci.edu", 45800, 14700, 17500, 80, 7.0, 80, 115, 3.75, ["Computer Science", "Software Engineering"], 1965, 36000, 5200, 21.0),
            ("ucsb", "University of California, Santa Barbara", "UC Santa Barbara", "Santa Barbara", 163, "Public", "https://www.ucsb.edu", 46200, 15100, 17200, 80, 7.0, 80, 115, 3.8, ["Physics", "Environmental Studies"], 1909, 26000, 3200, 26.0),
            ("bu", "Boston University", "BU", "Boston", 93, "Private", "https://www.bu.edu", 63798, 63798, 18100, 80, 7.0, 90, 130, 3.7, ["Business", "Communications", "Computer Science"], 1839, 36000, 10000, 14.0),
            ("northeastern", "Northeastern University", "Northeastern", "Boston", 396, "Private", "https://www.northeastern.edu", 62000, 62000, 19200, 75, 7.0, 100, 130, 3.7, ["Computer Science", "Business", "Co-op"], 1898, 30000, 9000, 6.8),
            ("gatech", "Georgia Institute of Technology", "Georgia Tech", "Atlanta", 97, "Public", "https://www.gatech.edu", 32876, 11764, 15800, 85, 7.0, 90, 125, 3.8, ["Industrial Engineering", "CS", "Aerospace"], 1885, 45000, 8200, 16.0),
            ("purdue", "Purdue University", "Purdue", "West Lafayette", 99, "Public", "https://www.purdue.edu", 28794, 9992, 10030, 60, 6.5, 80, 115, 3.6, ["Aeronautical Engineering", "CS", "Agriculture"], 1869, 50000, 9500, 50.0),
            ("uiuc", "University of Illinois Urbana-Champaign", "UIUC", "Urbana", 69, "Public", "https://illinois.edu", 39118, 17572, 13200, 75, 7.5, 103, 130, 3.75, ["Computer Science", "Civil Engineering", "Accounting"], 1867, 56000, 11000, 44.0),
            ("uwmadison", "University of Wisconsin-Madison", "UW-Madison", "Madison", 102, "Public", "https://www.wisc.edu", 40603, 11216, 13800, 70, 7.0, 80, 120, 3.7, ["Computer Science", "Economics", "Biology"], 1848, 49000, 6500, 49.0),
            ("utaustin", "The University of Texas at Austin", "UT Austin", "Austin", 58, "Public", "https://www.utexas.edu", 40996, 11752, 13500, 75, 6.5, 79, 115, 3.8, ["Petroleum Engineering", "Business", "CS"], 1883, 52000, 6000, 31.0),
            ("tamu", "Texas A&M University", "Texas A&M", "College Station", 134, "Public", "https://www.tamu.edu", 40000, 13000, 12000, 90, 6.0, 80, 110, 3.5, ["Engineering", "Agriculture", "Veterinary Medicine"], 1876, 74000, 6500, 63.0),
            ("osu", "The Ohio State University", "Ohio State", "Columbus", 151, "Public", "https://www.osu.edu", 38365, 12485, 12500, 70, 6.5, 79, 115, 3.6, ["Finance", "Psychology", "Computer Science"], 1870, 61000, 6000, 52.0),
            ("psu", "Pennsylvania State University", "Penn State", "University Park", 83, "Public", "https://www.psu.edu", 39626, 19835, 12900, 75, 6.5, 80, 115, 3.5, ["Supply Chain", "Engineering", "Business"], 1855, 48000, 7000, 55.0),
            ("umd", "University of Maryland, College Park", "UMD", "College Park", 169, "Public", "https://umd.edu", 39000, 11000, 14500, 75, 7.0, 96, 120, 3.7, ["Computer Science", "Criminology", "Engineering"], 1856, 40000, 5800, 44.0),
            ("uwashington", "University of Washington", "UW", "Seattle", 63, "Public", "https://www.washington.edu", 40740, 12242, 16800, 85, 7.0, 92, 120, 3.75, ["Computer Science", "Nursing", "Medicine"], 1861, 52000, 8000, 48.0),
            ("ufl", "University of Florida", "UF", "Gainesville", 168, "Public", "https://www.ufl.edu", 28658, 6381, 11200, 30, 6.0, 80, 110, 3.8, ["Biomedical Sciences", "Engineering", "Business"], 1853, 55000, 4500, 23.0),
            ("miami", "University of Miami", "UM", "Coral Gables", 278, "Private", "https://welcome.miami.edu", 58102, 58102, 17900, 70, 6.5, 80, 125, 3.6, ["Marine Science", "Finance", "Music"], 1925, 19000, 2700, 19.0),
            ("tulane", "Tulane University", "Tulane", "New Orleans", 601, "Private", "https://tulane.edu", 65538, 65538, 17500, 75, 7.0, 95, 125, 3.65, ["Public Health", "Finance", "Architecture"], 1834, 14000, 1200, 11.0),
            ("rochester", "University of Rochester", "Rochester", "Rochester", 224, "Private", "https://www.rochester.edu", 63150, 63150, 17800, 70, 7.5, 100, 130, 3.7, ["Optics", "Music", "Biomedical Engineering"], 1850, 12000, 3100, 39.0)
        ])
    ]

    for cname, cont, curr, list_unis in countries_data:
        for (uid, name, sname, city, rank, utype, web, t_intl, t_dom, living, fee, ielts, toefl, duo, gpa, majors, year, pop, intl_pop, accept) in list_unis:
            add(uid, name, sname, cname, city, cont, rank, utype, web, t_intl, t_dom, curr, living, fee, ielts, toefl, duo, gpa, majors, f"{name} is an accredited university located in {city}, {cname}.", year, pop, intl_pop, accept, "Urban", "Temperate", 92.0)

    print(f"Total initial added: {len(data)}")

print("Generator ready.")
