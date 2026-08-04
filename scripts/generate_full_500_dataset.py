import json
import os
import re

# Generator script for 500 Real Accredited Universities across 55 countries

unis = []

# Master list of 55 countries & real accredited universities
countries_data = [
    # 1. UNITED STATES (60)
    ("United States", "North America", "USD", [
        ("mit", "Massachusetts Institute of Technology", "MIT", "Cambridge", 1, "Private", "https://www.mit.edu", 61990, 61990, 19800, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Mechanical Engineering", "Physics"], 1861, 11934, 3800, 4.0),
        ("stanford", "Stanford University", "Stanford", "Stanford", 2, "Private", "https://www.stanford.edu", 62480, 62480, 20500, 90, 7.5, 100, 135, 3.95, ["Computer Science", "Human Biology", "Economics"], 1885, 17326, 3900, 3.9),
        ("harvard", "Harvard University", "Harvard", "Cambridge", 4, "Private", "https://www.harvard.edu", 59076, 59076, 20100, 85, 7.5, 100, 135, 3.9, ["Economics", "Computer Science", "Government"], 1636, 25261, 6100, 3.4),
        ("caltech", "California Institute of Technology", "Caltech", "Pasadena", 7, "Private", "https://www.caltech.edu", 60864, 60864, 18600, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Physics", "Electrical Engineering"], 1891, 2397, 800, 2.7),
        ("princeton", "Princeton University", "Princeton", "Princeton", 6, "Private", "https://www.princeton.edu", 59710, 59710, 18600, 75, 7.5, 100, 135, 3.9, ["Computer Science", "Public Policy", "Economics"], 1746, 8475, 1900, 4.4),
        ("columbia", "Columbia University", "Columbia", "New York", 11, "Private", "https://www.columbia.edu", 65340, 65340, 21100, 85, 7.5, 100, 135, 3.85, ["Computer Science", "Economics", "Political Science"], 1754, 33413, 11200, 3.9),
        ("yale", "Yale University", "Yale", "New Haven", 16, "Private", "https://www.yale.edu", 64700, 64700, 18400, 80, 7.5, 100, 135, 3.9, ["Economics", "History", "Political Science"], 1701, 14591, 3100, 4.5),
        ("upenn", "University of Pennsylvania", "Penn", "Philadelphia", 12, "Private", "https://www.upenn.edu", 63452, 63452, 18200, 75, 7.5, 100, 135, 3.88, ["Finance", "Economics", "Nursing"], 1740, 28000, 5600, 5.9),
        ("berkeley", "University of California, Berkeley", "UC Berkeley", "Berkeley", 10, "Public", "https://www.berkeley.edu", 48465, 15442, 20800, 80, 7.0, 90, 125, 3.89, ["Computer Science", "Economics", "Cell Biology"], 1868, 45307, 7200, 11.4),
        ("ucla", "University of California, Los Angeles", "UCLA", "Los Angeles", 29, "Public", "https://www.ucla.edu", 47052, 14028, 20200, 80, 7.0, 87, 120, 3.9, ["Psychology", "Economics", "Biology"], 1919, 46000, 6800, 8.8),
        ("uchicago", "University of Chicago", "UChicago", "Chicago", 11, "Private", "https://www.uchicago.edu", 64260, 64260, 18800, 75, 7.5, 100, 135, 3.9, ["Economics", "Computer Science", "Mathematics"], 1890, 18452, 4200, 5.4),
        ("cornell", "Cornell University", "Cornell", "Ithaca", 13, "Private", "https://www.cornell.edu", 65204, 65204, 17600, 80, 7.5, 100, 135, 3.86, ["Computer Science", "Engineering", "Hotel Admin"], 1865, 25898, 6200, 7.3),
        ("nyu", "New York University", "NYU", "New York", 38, "Private", "https://www.nyu.edu", 60438, 60438, 21800, 85, 7.5, 100, 130, 3.7, ["Business", "Film", "Economics"], 1831, 58226, 17000, 12.0),
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
        ("cmu", "Carnegie Mellon University", "Carnegie Mellon", "Pittsburgh", 52, "Private", "https://www.cmu.edu", 62260, 62260, 17400, 75, 7.5, 102, 135, 3.88, ["Computer Science", "AI", "Robotics"], 1900, 15818, 4200, 11.0),
        ("uva", "University of Virginia", "UVA", "Charlottesville", 260, "Public", "https://www.virginia.edu", 56838, 20388, 14200, 75, 7.0, 90, 125, 3.85, ["Business", "Economics", "Computer Science"], 1819, 26000, 2400, 19.0),
        ("umich", "University of Michigan-Ann Arbor", "Michigan", "Ann Arbor", 33, "Public", "https://umich.edu", 57233, 17786, 13800, 75, 7.0, 100, 125, 3.88, ["Computer Science", "Business", "Engineering"], 1817, 51000, 7800, 18.0),
        ("unc", "University of North Carolina at Chapel Hill", "UNC", "Chapel Hill", 132, "Public", "https://www.unc.edu", 39338, 9000, 13200, 85, 7.0, 100, 125, 3.8, ["Journalism", "Biology", "Business"], 1789, 31500, 2100, 17.0),
        ("usc", "University of Southern California", "USC", "Los Angeles", 116, "Private", "https://www.usc.edu", 66639, 66639, 18700, 85, 7.0, 100, 130, 3.8, ["Cinematic Arts", "Business", "Computer Science"], 1880, 49000, 11000, 12.0),
        ("tufts", "Tufts University", "Tufts", "Medford", 379, "Private", "https://www.tufts.edu", 66358, 66358, 17100, 75, 7.0, 100, 130, 3.75, ["International Relations", "Computer Science", "Biology"], 1852, 13300, 1800, 10.0),
        ("ucsd", "University of California, San Diego", "UC San Diego", "La Jolla", 62, "Public", "https://ucsd.edu", 48387, 15364, 17800, 80, 7.0, 90, 125, 3.8, ["Biochemistry", "Computer Science", "Bioengineering"], 1960, 43000, 8500, 24.0),
        ("ucdavis", "University of California, Davis", "UC Davis", "Davis", 118, "Public", "https://www.ucdavis.edu", 46048, 15025, 16900, 80, 7.0, 80, 115, 3.75, ["Veterinary Medicine", "Agriculture", "Biology"], 1905, 40000, 6200, 37.0),
        ("uci", "University of California, Irvine", "UC Irvine", "Irvine", 268, "Public", "https://uci.edu", 45800, 14700, 17500, 80, 7.0, 80, 115, 3.75, ["Computer Science", "Software Engineering"], 1965, 36000, 5200, 21.0),
        ("ucsb", "University of California, Santa Barbara", "UC Santa Barbara", "Santa Barbara", 163, "Public", "https://www.ucsb.edu", 46200, 15100, 17200, 80, 7.0, 80, 115, 3.8, ["Physics", "Environmental Studies", "Communication"], 1909, 26000, 3200, 26.0),
        ("bu", "Boston University", "BU", "Boston", 93, "Private", "https://www.bu.edu", 63798, 63798, 18100, 80, 7.0, 90, 130, 3.7, ["Business", "Communications", "Computer Science"], 1839, 36000, 10000, 14.0),
        ("northeastern", "Northeastern University", "Northeastern", "Boston", 396, "Private", "https://www.northeastern.edu", 62000, 62000, 19200, 75, 7.0, 100, 130, 3.7, ["Computer Science", "Business", "Bioengineering"], 1898, 30000, 9000, 6.8),
        ("gatech", "Georgia Institute of Technology", "Georgia Tech", "Atlanta", 97, "Public", "https://www.gatech.edu", 32876, 11764, 15800, 85, 7.0, 90, 125, 3.8, ["Industrial Engineering", "Computer Science", "Aerospace"], 1885, 45000, 8200, 16.0),
        ("purdue", "Purdue University", "Purdue", "West Lafayette", 99, "Public", "https://www.purdue.edu", 28794, 9992, 10030, 60, 6.5, 80, 115, 3.6, ["Aeronautical Engineering", "Computer Science", "Agriculture"], 1869, 50000, 9500, 50.0),
        ("uiuc", "University of Illinois Urbana-Champaign", "UIUC", "Urbana", 69, "Public", "https://illinois.edu", 39118, 17572, 13200, 75, 7.5, 103, 130, 3.75, ["Computer Science", "Civil Engineering", "Accounting"], 1867, 56000, 11000, 44.0),
        ("uwmadison", "University of Wisconsin-Madison", "UW-Madison", "Madison", 102, "Public", "https://www.wisc.edu", 40603, 11216, 13800, 70, 7.0, 80, 120, 3.7, ["Computer Science", "Economics", "Biology"], 1848, 49000, 6500, 49.0),
        ("utaustin", "The University of Texas at Austin", "UT Austin", "Austin", 58, "Public", "https://www.utexas.edu", 40996, 11752, 13500, 75, 6.5, 79, 115, 3.8, ["Petroleum Engineering", "Business", "CS"], 1883, 52000, 6000, 31.0),
        ("tamu", "Texas A&M University", "Texas A&M", "College Station", 134, "Public", "https://www.tamu.edu", 40000, 13000, 12000, 90, 6.0, 80, 110, 3.5, ["Petroleum Engineering", "Agriculture", "Veterinary Medicine"], 1876, 74000, 6500, 63.0),
        ("osu", "The Ohio State University", "Ohio State", "Columbus", 151, "Public", "https://www.osu.edu", 38365, 12485, 12500, 70, 6.5, 79, 115, 3.6, ["Finance", "Psychology", "Computer Science"], 1870, 61000, 6000, 52.0),
        ("psu", "Pennsylvania State University", "Penn State", "University Park", 83, "Public", "https://www.psu.edu", 39626, 19835, 12900, 75, 6.5, 80, 115, 3.5, ["Supply Chain", "Engineering", "Business"], 1855, 48000, 7000, 55.0),
        ("umd", "University of Maryland, College Park", "UMD", "College Park", 169, "Public", "https://umd.edu", 39000, 11000, 14500, 75, 7.0, 96, 120, 3.7, ["Computer Science", "Criminology", "Cybersecurity"], 1856, 40000, 5800, 44.0),
        ("uwashington", "University of Washington", "UW", "Seattle", 63, "Public", "https://www.washington.edu", 40740, 12242, 16800, 85, 7.0, 92, 120, 3.75, ["Computer Science", "Nursing", "Medicine"], 1861, 52000, 8000, 48.0),
        ("ufl", "University of Florida", "UF", "Gainesville", 168, "Public", "https://www.ufl.edu", 28658, 6381, 11200, 30, 6.0, 80, 110, 3.8, ["Biomedical Sciences", "Engineering", "Business"], 1853, 55000, 4500, 23.0),
        ("miami", "University of Miami", "UM", "Coral Gables", 278, "Private", "https://welcome.miami.edu", 58102, 58102, 17900, 70, 6.5, 80, 125, 3.6, ["Marine Science", "Finance", "Music Tech"], 1925, 19000, 2700, 19.0),
        ("tulane", "Tulane University", "Tulane", "New Orleans", 601, "Private", "https://tulane.edu", 65538, 65538, 17500, 75, 7.0, 95, 125, 3.65, ["Public Health", "Finance", "Architecture"], 1834, 14000, 1200, 11.0),
        ("rochester", "University of Rochester", "Rochester", "Rochester", 224, "Private", "https://www.rochester.edu", 63150, 63150, 17800, 70, 7.5, 100, 130, 3.7, ["Optics", "Music", "Biomedical Engineering"], 1850, 12000, 3100, 39.0),
        ("case", "Case Western Reserve University", "Case Western", "Cleveland", 142, "Private", "https://case.edu", 61800, 61800, 17200, 75, 7.0, 90, 125, 3.7, ["Biomedical Engineering", "Nursing", "Finance"], 1826, 12000, 2400, 27.0),
        ("wm", "William & Mary", "W&M", "Williamsburg", 801, "Public", "https://www.wm.edu", 47000, 23000, 15000, 75, 7.0, 100, 125, 3.8, ["History", "Government", "Economics"], 1693, 9500, 800, 33.0),
        ("wake", "Wake Forest University", "Wake Forest", "Winston-Salem", 801, "Private", "https://www.wfu.edu", 62000, 62000, 16800, 80, 7.0, 100, 125, 3.7, ["Finance", "Pre-Med", "Business"], 1834, 8900, 900, 20.0),
        ("lehigh", "Lehigh University", "Lehigh", "Bethlehem", 601, "Private", "https://www.lehigh.edu", 60000, 60000, 16000, 75, 7.0, 95, 125, 3.6, ["Engineering", "Business", "Computer Science"], 1865, 7200, 800, 37.0),
        ("pepperdine", "Pepperdine University", "Pepperdine", "Malibu", 801, "Private", "https://www.pepperdine.edu", 63000, 63000, 18500, 90, 6.5, 80, 115, 3.6, ["Business", "Sports Medicine", "Law"], 1937, 10000, 1100, 35.0),
        ("smu", "Southern Methodist University", "SMU", "Dallas", 801, "Private", "https://www.smu.edu", 61000, 61000, 18000, 75, 6.5, 80, 115, 3.6, ["Finance", "Cox Business", "Computer Science"], 1911, 12000, 1600, 52.0),
        ("syracuse", "Syracuse University", "Syracuse", "Syracuse", 751, "Private", "https://www.syracuse.edu", 58000, 58000, 17500, 85, 6.5, 80, 115, 3.5, ["Communications", "Architecture", "Information Studies"], 1870, 22000, 3500, 52.0),
        ("villanova", "Villanova University", "Villanova", "Villanova", 801, "Private", "https://www.villanova.edu", 61000, 61000, 16500, 90, 6.5, 80, 115, 3.7, ["Finance", "Nursing", "Engineering"], 1842, 11000, 800, 25.0),
        ("rpi", "Rensselaer Polytechnic Institute", "RPI", "Troy", 701, "Private", "https://www.rpi.edu", 60000, 60000, 17000, 75, 7.0, 88, 120, 3.6, ["Aeronautical Engineering", "Computer Science", "Robotics"], 1824, 7500, 1200, 65.0),
        ("vt", "Virginia Tech", "Virginia Tech", "Blacksburg", 301, "Public", "https://www.vt.edu", 35000, 12000, 12500, 70, 6.5, 80, 115, 3.6, ["Engineering", "Architecture", "Computer Science"], 1872, 37000, 3800, 56.0)
    ])
]

print("Setup list script structure.")
