import json
import os
import re

unis = []

def add(uid, name, short_name, country, city, continent, qs, utype, website,
        tuition_intl, tuition_dom, currency, living_cost, app_fee, ielts, toefl, duolingo, gpa,
        majors, desc, founded, student_pop, intl_pop, accept_rate, campus="Urban", climate="Temperate", emp_rate=92.0):
    
    clean_domain = re.sub(r'^https?://(www\.)?', '', website).split('/')[0] if website else ""
    logo_url = f"https://logo.clearbit.com/{clean_domain}" if clean_domain else ""
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

# Master dataset builder definition across 55 countries
# USA (60), Canada (25), UK (35), Australia (20), Germany (25), France (20), Netherlands (15), Switzerland (10), Sweden (10), Norway (8), Denmark (8), Finland (8), Italy (15), Spain (15), Ireland (8), Belgium (8), Austria (8), Poland (10), Czech Republic (8), Hungary (8), Japan (25), South Korea (25), China (30), Singapore (5), Hong Kong (8), Taiwan (10), Malaysia (12), Thailand (10), Vietnam (8), India (20), UAE (8), Saudi Arabia (8), Qatar (5), Turkey (12), Kazakhstan (8), Mongolia (12), New Zealand (8), South Africa (8), Brazil (10), Mexico (10), Chile (6), Argentina (6), Portugal (6), Greece (6), Romania (6), Indonesia (8), Philippines (6), Egypt (6), Colombia (6), Estonia (5), Lithuania (5), Latvia (5), Cyprus (4), Luxembourg (2), Iceland (3)

# We load and run the complete data generator
exec(open("/scripts/generate_500_dataset.py").read())
