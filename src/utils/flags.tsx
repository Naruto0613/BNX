import React from "react";

const COUNTRY_ISO_MAP: Record<string, string> = {
  // English names
  "usa": "US",
  "united states": "US",
  "united states of america": "US",
  "uk": "GB",
  "united kingdom": "GB",
  "great britain": "GB",
  "canada": "CA",
  "south korea": "KR",
  "korea": "KR",
  "japan": "JP",
  "china": "CN",
  "germany": "DE",
  "australia": "AU",
  "singapore": "SG",
  "mongolia": "MN",
  "france": "FR",
  "italy": "IT",
  "spain": "ES",
  "switzerland": "CH",
  "netherlands": "NL",
  "sweden": "SE",
  "norway": "NO",
  "finland": "FI",
  "denmark": "DK",
  "russia": "RU",
  "india": "IN",
  "turkey": "TR",
  "new zealand": "NZ",
  "ireland": "IE",
  "belgium": "BE",
  "austria": "AT",
  "vietnam": "VN",
  "thailand": "TH",
  "malaysia": "MY",
  "philippines": "PH",
  "indonesia": "ID",
  "brazil": "BR",
  "mexico": "MX",
  "south africa": "ZA",
  "egypt": "EG",
  "poland": "PL",
  "ukraine": "UA",
  "portugal": "PT",
  "greece": "GR",
  "hungary": "HU",
  "czechia": "CZ",
  "czech republic": "CZ",

  // Mongolian names
  "ану": "US",
  "америк": "US",
  "америкийн нэгдсэн улс": "US",
  "их британи": "GB",
  "англи": "GB",
  "канад": "CA",
  "солонгос": "KR",
  "өмнөд солонгос": "KR",
  "бнсоу": "KR",
  "япон": "JP",
  "хятад": "CN",
  "бнхау": "CN",
  "герман": "DE",
  "австрали": "AU",
  "сингапур": "SG",
  "монгол": "MN",
  "монгол улс": "MN",
  "франц": "FR",
  "итали": "IT",
  "испани": "ES",
  "швейцарь": "CH",
  "нидерланд": "NL",
  "швед": "SE",
  "норвеги": "NO",
  "финланд": "FI",
  "дани": "DK",
  "орос": "RU",
  "энхэтхэг": "IN",
  "энхэдхэг": "IN",
  "турк": "TR",
  "шинэ зеланд": "NZ",
  "ирланд": "IE",
  "бельги": "BE",
  "австри": "AT",
  "вьетнам": "VN",
  "тайланд": "TH",
  "малайз": "MY",
  "филиппин": "PH",
  "индонези": "ID",
  "бразил": "BR",
  "мексик": "MX",
  "өмнөд африк": "ZA",
  "египет": "EG",
  "польш": "PL",
  "украин": "UA",
  "португал": "PT",
  "грек": "GR",
  "унгар": "HU",
  "чех": "CZ",
};

export function getCountryIsoCode(countryNameOrCode: string | undefined): string | null {
  if (!countryNameOrCode) return null;
  const normalized = countryNameOrCode.toLowerCase().trim();
  
  if (COUNTRY_ISO_MAP[normalized]) {
    return COUNTRY_ISO_MAP[normalized];
  }
  
  for (const [key, value] of Object.entries(COUNTRY_ISO_MAP)) {
    if (normalized === key || normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  if (normalized.length === 2) {
    return normalized.toUpperCase();
  }
  
  return null;
}

interface CountryFlagProps {
  countryNameOrCode: string | undefined;
  className?: string;
  fallbackSize?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  countryNameOrCode,
  className = "w-5 h-3.5 object-cover rounded-sm shadow-sm inline-block align-middle select-none border border-neutral-800/10",
  fallbackSize = "text-base"
}) => {
  const iso = getCountryIsoCode(countryNameOrCode);
  if (!iso) {
    return <span className={`${fallbackSize} inline-block align-middle select-none`}>🌐</span>;
  }
  
  const flagUrl = `https://purecatamphetamine.github.io/country-flag-icons/3x2/${iso.toUpperCase()}.svg`;
  
  return (
    <img
      src={flagUrl}
      alt={countryNameOrCode || "Flag"}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};

export function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase().trim();
  if (code.length !== 2) return "";
  const codePoints = code
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "";
  }
}

export function getCountryFlag(countryNameOrCode: string | undefined): string {
  if (!countryNameOrCode) return "🌐";
  const normalized = countryNameOrCode.toLowerCase().trim();
  
  // Try direct lookup of ISO code to emoji
  const iso = getCountryIsoCode(normalized);
  if (iso) {
    const emoji = getFlagEmoji(iso);
    if (emoji) return emoji;
  }
  
  return "🌐";
}

