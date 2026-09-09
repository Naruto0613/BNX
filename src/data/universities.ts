import { University } from "../types";

// Raw hand-designed premium universities
const manualUniversities: University[] = [
  {
    id: "mit-usa",
    name: "Massachusetts Institute of Technology (MIT)",
    country: "USA",
    ranking: 1,
    acceptanceRate: "4.0%",
    website: "https://www.mit.edu",
    tuitionFee: 61990,
    dormitoryFee: 12380,
    livingCost: 11000,
    healthInsurance: 3400,
    applicationFee: 75,
    estimatedAnnualCost: 88770,
    minGpa: 3.9,
    ieltsMin: 7.5,
    toeflMin: 100,
    satMin: 1530,
    requiredSubjects: "Гүнзгийрүүлсэн математик, Математик анализ, Физик, Хими",
    requiredDocuments: "Элсэлтийн ерөнхий эссэ, MIT Maker бүтээлийн сан (портфолио), 2 тодорхойлох захидал (1 ТАКТ чиглэл, 1 Хүмүүнлэгийн ухаан), Дунд сургуулийн дүнгийн хуулбар, Олон улсын оюутны санхүүгийн тусламжийн маягт",
    openingDate: "9-р сарын 1",
    deadline: "1-р сарын 1",
    resultDate: "3-р сарын 14",
    scholarships: "MIT Хэрэгцээнд суурилсан тэтгэлэг (Санхүүгийн хэрэгцээг 100% хүртэл шийдэх бөгөөд тэнцсэн Монгол оюутнуудын дундаж тэтгэлэг жилд $53,000 байна)"
  },
  {
    id: "stanford-usa",
    name: "Stanford University",
    country: "USA",
    ranking: 2,
    acceptanceRate: "3.9%",
    website: "https://www.stanford.edu",
    tuitionFee: 62480,
    dormitoryFee: 19900,
    livingCost: 9500,
    healthInsurance: 3300,
    applicationFee: 90,
    estimatedAnnualCost: 95180,
    minGpa: 3.95,
    ieltsMin: 7.5,
    toeflMin: 100,
    satMin: 1520,
    requiredSubjects: "Англи хэлний уран зохиол, Математик анализ, Байгалийн ухааны үндэс, Түүх",
    requiredDocuments: "Нийтийн өргөдлийн маягт (Common App), Стэнфордын нэмэлт асуултууд, Ахлах сургуулийн албан ёсны дүнгийн хуулбар, Сургуулийн зөвлөх болон багшийн үнэлгээний 2 захидал",
    openingDate: "8-р сарын 1",
    deadline: "1-р сарын 5",
    resultDate: "4-р сарын 1",
    scholarships: "Стэнфордын сурлагын тэтгэлэг, Найт-Хеннесси (Knight-Hennessy) тэтгэлэгт хөтөлбөр (Сургалтын төлбөр, амьжиргааны тэтгэмж, аяллын зардлыг бүрэн даана)"
  },
  {
    id: "kaist-korea",
    name: "Korea Advanced Institute of Science & Technology (KAIST)",
    country: "South Korea",
    ranking: 53,
    acceptanceRate: "15.0%",
    website: "https://www.kaist.ac.kr",
    tuitionFee: 6800,
    dormitoryFee: 1200,
    livingCost: 4000,
    healthInsurance: 500,
    applicationFee: 80,
    estimatedAnnualCost: 12580,
    minGpa: 3.5,
    ieltsMin: 6.5,
    toeflMin: 83,
    satMin: 1420,
    requiredSubjects: "Математик, Физик, Компьютер програмчлалын анхан шат",
    requiredDocuments: "KAIST өргөдлийн маягт, Багшийн тодорхойлох захидал, Ахлах сургуулийн танилцуулга болон дүнгийн хуулбар, Гадаад паспортын хуулбар, Санхүүгийн эх үүсвэрийн мэдүүлэг",
    openingDate: "9-р сарын 5",
    deadline: "11-р сарын 18",
    resultDate: "1-р сарын 20",
    scholarships: "KAIST-ийн олон улсын оюутны тэтгэлэг (Сургалтын төлбөрөөс 100% чөлөөлөх, сар бүр 350,000 воны тэтгэмж олгож, эрүүл мэндийн даатгалын зардлыг бүрэн хариуцна)"
  },
  {
    id: "snu-korea",
    name: "Seoul National University (SNU)",
    country: "South Korea",
    ranking: 41,
    acceptanceRate: "12.0%",
    website: "https://en.snu.ac.kr",
    tuitionFee: 6000,
    dormitoryFee: 1500,
    livingCost: 4500,
    healthInsurance: 600,
    applicationFee: 70,
    estimatedAnnualCost: 12600,
    minGpa: 3.6,
    ieltsMin: 6.5,
    toeflMin: 85,
    satMin: 1380,
    requiredSubjects: "Солонгос хэлний суурь мэдлэг (Англи хэл дээрх хөтөлбөрүүдэд заавал шаардахгүй боловч давуу тал болно), Коллежийн математик",
    requiredDocuments: "Өргөдлийн маягт, Хувийн танилцуулга болон суралцах төлөвлөгөө, Тодорхойлох захидлууд, Ахлах сургууль төгссөн гэрчилгээ, Гэр бүлийн гишүүдийн паспортын хуулбарууд",
    openingDate: "3-р сарын 2",
    deadline: "7-р сарын 12",
    resultDate: "11-р сарын 24",
    scholarships: "SNU Глобал тэтгэлэг (Сургалтын төлбөрийн дэмжлэг, нислэгийн тийз, орон сууцны тэтгэмж, солонгос хэлний бэлтгэлийн зардал)"
  },
  {
    id: "todai-japan",
    name: "The University of Tokyo",
    country: "Japan",
    ranking: 28,
    acceptanceRate: "22.0%",
    website: "https://www.u-tokyo.ac.jp",
    tuitionFee: 4500,
    dormitoryFee: 3000,
    livingCost: 8000,
    healthInsurance: 400,
    applicationFee: 110,
    estimatedAnnualCost: 16010,
    minGpa: 3.7,
    ieltsMin: 7.0,
    toeflMin: 95,
    satMin: 1450,
    requiredSubjects: "Физик, Математик, Ерөнхий хими",
    requiredDocuments: "UTokyo PEAK онлайн өргөдөл, Гурав хүртэлх эссэ, Стандарт шалгалтуудын онооны хуудас, Багшийн үнэлгээнүүд, Хэлний мэдлэгийг батлах баримт бичиг",
    openingDate: "11-р сарын 1",
    deadline: "1-р сарын 6",
    resultDate: "3-р сарын 30",
    scholarships: "Токиогийн их сургуулийн тэтгэлэгт хөтөлбөр (Сар бүр 150,000 иений тэтгэмж, сургалтын төлбөрөөс 100% чөлөөлнө), Японы Засгийн газрын MEXT Элчингийн тэтгэлэгт санал болгох эрх"
  },
  {
    id: "num-mongolia",
    name: "National University of Mongolia (NUM)",
    country: "Mongolia",
    ranking: 1500,
    acceptanceRate: "85.0%",
    website: "https://www.num.edu.mn",
    tuitionFee: 1800,
    dormitoryFee: 300,
    livingCost: 1500,
    healthInsurance: 100,
    applicationFee: 10,
    estimatedAnnualCost: 3710,
    minGpa: 2.5,
    ieltsMin: 5.0,
    toeflMin: 50,
    satMin: 1000,
    requiredSubjects: "Бүрэн дунд боловсролын гэрчилгээ, Элсэлтийн Ерөнхий Шалгалт (ЭЕШ) - Суурь хичээлүүд",
    requiredDocuments: "ЭЕШ онооны хуудас, Ахлах сургуулийн диплом (Аттестат), Иргэний үнэмлэх, 3х4 хэмжээтэй цээж зураг, бүртгэлийн хураамжийн баримт",
    openingDate: "6-р сарын 15",
    deadline: "7-р сарын 1",
    resultDate: "7-р сарын 5",
    scholarships: "МУИС-ийн Шилдэг элсэгч тэтгэлэг (ЭЕШ-д 750-иас дээш оноо авсан суралцагчдад сургалтын төлбөрийн хөнгөлөлт үзүүлнэ)"
  },
  {
    id: "oxford-uk",
    name: "University of Oxford",
    country: "United Kingdom",
    ranking: 3,
    acceptanceRate: "14.0%",
    website: "https://www.ox.ac.uk",
    tuitionFee: 43200,
    dormitoryFee: 11500,
    livingCost: 9000,
    healthInsurance: 1200,
    applicationFee: 95,
    estimatedAnnualCost: 64995,
    minGpa: 3.85,
    ieltsMin: 7.5,
    toeflMin: 100,
    satMin: 1480,
    requiredSubjects: "Сонгосон мэргэжлээс хамаарсан Хүмүүнлэгийн ухаан эсвэл ТАКТ (STEM) суурь чиглэлүүд",
    requiredDocuments: "UCAS өргөдлийн цахим хуудас, Оксфордын хувийн тодорхойлолт эссэ, Бичгийн ажлын дээжүүд, Нарийвчилсан сэдвийн шалгалтууд (жишээлбэл, MAT, PAT, LNAT), Багшийн тодорхойлолт",
    openingDate: "9-р сарын 1",
    deadline: "10-р сарын 15",
    resultDate: "1-р сарын 12",
    scholarships: "Reach Oxford тэтгэлэгт хөтөлбөр (Сургалтын төлбөр, хичээлийн жилүүд дэх амьжиргааны зардлыг бүрэн хариуцдаг, Монгол Улсаас өргөдөл гаргагчдад тусгайлан олгодог)"
  }
];

// Target 50 school names for each of the 10 countries
const rawSchoolNames: Record<string, string[]> = {
  "USA": [
    "Massachusetts Institute of Technology (MIT)", "Stanford University",
    "Harvard University", "California Institute of Technology (Caltech)",
    "Princeton University", "Yale University", "Columbia University", "University of Pennsylvania",
    "University of Chicago", "Duke University", "Johns Hopkins University", "Northwestern University",
    "Dartmouth College", "Brown University", "Vanderbilt University", "Cornell University",
    "University of California, Berkeley", "University of California, Los Angeles (UCLA)", "University of Southern California (USC)", "Georgetown University",
    "New York University (NYU)", "Carnegie Mellon University", "Emory University", "Rice University",
    "Washington University in St. Louis", "Tufts University", "University of Michigan", "Boston University",
    "Northeastern University", "University of Texas at Austin", "Georgia Institute of Technology", "University of North Carolina at Chapel Hill",
    "University of Rochester", "University of Notre Dame", "Case Western Reserve University", "University of Illinois Urbana-Champaign",
    "University of Wisconsin-Madison", "University of Washington", "University of Maryland", "Purdue University",
    "Ohio State University", "Pennsylvania State University", "University of Florida", "Rutgers University",
    "Boston College", "Texas A&M University", "University of Virginia", "University of California, San Diego",
    "University of California, Irvine", "University of California, Davis"
  ],
  "Canada": [
    "University of Toronto", "University of British Columbia (UBC)", "McGill University", "McMaster University",
    "University of Alberta", "Université de Montréal", "University of Calgary", "University of Ottawa",
    "University of Waterloo", "Western University", "Queen's University", "Dalhousie University",
    "University of Manitoba", "University of Saskatchewan", "Simon Fraser University", "University of Victoria",
    "York University", "Carleton University", "Concordia University", "Memorial University of Newfoundland",
    "University of Guelph", "University of Windsor", "University of New Brunswick", "Wilfrid Laurier University",
    "Brock University", "Toronto Metropolitan University", "Trent University", "Ontario Tech University",
    "University of Regina", "University of Winnipeg", "University of Lethbridge", "Lakehead University",
    "University of Prince Edward Island", "Saint Mary's University", "Acadia University", "Bishop's University",
    "Mount Allison University", "St. Francis Xavier University", "Royal Roads University", "University of Northern British Columbia",
    "Capilano University", "Thompson Rivers University", "University of the Fraser Valley", "Vancouver Island University",
    "Kwantlen Polytechnic University", "MacEwan University", "Mount Royal University", "Athabasca University",
    "Nipissing University", "Brandon University"
  ],
  "United Kingdom": [
    "University of Oxford", "University of Cambridge", "Imperial College London", "University College London (UCL)",
    "University of Edinburgh", "King's College London", "University of Manchester", "London School of Economics (LSE)",
    "University of Bristol", "University of Warwick", "University of Glasgow", "University of Birmingham",
    "University of Southampton", "University of Leeds", "University of Sheffield", "University of St Andrews",
    "University of Nottingham", "Queen Mary University of London", "Lancaster University", "Newcastle University",
    "University of York", "Cardiff University", "University of Exeter", "University of Bath",
    "University of Liverpool", "University of Aberdeen", "University of Sussex", "Durham University",
    "University of East Anglia", "University of Leicester", "Heriot-Watt University", "Brunel University London",
    "University of Dundee", "Swansea University", "University of Surrey", "University of Strathclyde",
    "University of Reading", "University of Essex", "Queen's University Belfast", "Oxford Brookes University",
    "Goldsmiths, University of London", "Aston University", "City, University of London", "University of Kent",
    "Keele University", "Bangor University", "Aberystwyth University", "University of Stirling",
    "University of Plymouth", "University of Portsmouth"
  ],
  "South Korea": [
    "Korea Advanced Institute of Science & Technology (KAIST)", "Seoul National University (SNU)",
    "Yonsei University", "Korea University", "Sungkyunkwan University (SKKU)", "Hanyang University",
    "Pohang University of Science and Technology (POSTECH)", "Ulsan National Institute of Science and Technology (UNIST)",
    "Gwangju Institute of Science and Technology (GIST)", "Daegu Gyeongbuk Institute of Science and Technology (DGIST)",
    "Kyung Hee University", "Sejong University", "Ewha Womans University", "Sogang University",
    "Chung-Ang University", "Pusan National University", "Kyungpook National University", "Ajou University",
    "Inha University", "University of Seoul", "Konkuk University", "Dongguk University",
    "Dankook University", "Kookmin University", "Soongsil University", "Hongik University",
    "Chonnam National University", "Chungnam National University", "Jeonbuk National University", "Kangwon National University",
    "Gyeongsang National University", "Jeju National University", "Yeungnam University", "Dong-A University",
    "Chosun University", "Kyonggi University", "Myongji University", "Kyungsung University",
    "Sun Moon University", "Woosong University", "SolBridge International School of Business", "Gachon University",
    "Hallym University", "Inje University", "Soonchunhyang University", "Catholic University of Korea",
    "Sangmyung University", "Sookmyung Women's University", "Korea National University of Arts", "Korea National University of Education"
  ],
  "Japan": [
    "The University of Tokyo", "Kyoto University", "Osaka University", "Tokyo Institute of Technology (Tokyo Tech)",
    "Tohoku University", "Nagoya University", "Kyushu University", "Hokkaido University",
    "Waseda University", "Keio University", "University of Tsukuba", "Hiroshima University",
    "Kobe University", "Tokyo Medical and Dental University", "Tokyo University of Science", "Ritsumeikan University",
    "Sophia University", "Meiji University", "Chuo University", "Doshisha University",
    "Kansai University", "Niigata University", "Chiba University", "Yokohama National University",
    "Kanazawa University", "Okayama University", "Nagasaki University", "Kumamoto University",
    "Shinshu University", "Gifu University", "Mie University", "Toyohashi University of Technology",
    "Nagaoka University of Technology", "Saitama University", "Tokyo Metropolitan University", "Osaka Metropolitan University",
    "Kyoto Institute of Technology", "Nagoya Institute of Technology", "Tokyo University of Agriculture", "Shibaura Institute of Technology",
    "Kyushu Institute of Technology", "International Christian University", "Ritsumeikan Asia Pacific University (APU)", "Kitasato University",
    "Nihon University", "Toyo University", "Komazawa University", "Senshu University",
    "Tokai University", "Ryukoku University"
  ],
  "China": [
    "Tsinghua University", "Peking University", "Fudan University", "Zhejiang University",
    "Shanghai Jiao Tong University", "University of Science and Technology of China (USTC)", "Nanjing University", "Wuhan University",
    "Xi'an Jiaotong University", "Harbin Institute of Technology", "Sun Yat-sen University", "Tongji University",
    "Beijing Normal University", "Sichuan University", "Shandong University", "Nankai University",
    "Tianjin University", "Jilin University", "Southeast University", "Beihang University",
    "South China University of Technology", "Xiamen University", "Dalian University of Technology", "Hunan University",
    "Central South University", "East China Normal University", "Northwestern Polytechnical University", "Lanzhou University",
    "China Agricultural University", "Beijing Institute of Technology", "Chongqing University", "University of Science and Technology Beijing",
    "Beijing University of Chemical Technology", "Beijing University of Posts and Telecommunications", "East China University of Science and Technology", "Soochow University",
    "Shanghai University", "Jinan University", "Nanjing University of Science and Technology", "Nanjing University of Aeronautics and Astronautics",
    "Wuhan University of Technology", "China University of Geosciences", "Southwest University", "Ocean University of China",
    "Yunnan University", "Xinjiang University", "Ningxia University", "Shihezi University",
    "Qinghai University", "Tibet University"
  ],
  "Germany": [
    "LMU Munich", "Technical University of Munich (TUM)", "Heidelberg University", "Humboldt University of Berlin",
    "Free University of Berlin", "RWTH Aachen University", "University of Freiburg", "University of Tübingen",
    "University of Bonn", "University of Göttingen", "University of Hamburg", "University of Cologne",
    "Goethe University Frankfurt", "University of Erlangen-Nuremberg", "University of Münster", "University of Duisburg-Essen",
    "TU Dresden", "Karlsruhe Institute of Technology (KIT)", "University of Stuttgart", "University of Leipzig",
    "University of Würzburg", "University of Jena", "University of Konstanz", "University of Ulm",
    "University of Bayreuth", "University of Bremen", "University of Giessen", "University of Halle-Wittenberg",
    "Leibniz University Hannover", "University of Kiel", "Johannes Gutenberg University Mainz", "University of Marburg",
    "University of Potsdam", "University of Regensburg", "University of Rostock", "Saarland University",
    "University of Siegen", "University of Trier", "University of Greifswald", "University of Hohenheim",
    "TU Berlin", "TU Darmstadt", "TU Braunschweig", "TU Dortmund", "TU Kaiserslautern",
    "TU Ilmenau", "TU Hamburg", "HafenCity University Hamburg", "Frankfurt School of Finance & Management",
    "WHU - Otto Beisheim School of Management"
  ],
  "Australia": [
    "University of Melbourne", "University of Sydney", "University of New South Wales (UNSW)", "Australian National University (ANU)",
    "University of Queensland (UQ)", "Monash University", "University of Western Australia (UWA)", "University of Adelaide",
    "University of Technology Sydney (UTS)", "Macquarie University", "RMIT University", "Queensland University of Technology (QUT)",
    "Curtin University", "University of Wollongong", "University of Newcastle", "Deakin University",
    "Griffith University", "University of Tasmania", "University of South Australia (UniSA)", "Flinders University",
    "James Cook University", "La Trobe University", "Swinburne University of Technology", "Western Sydney University",
    "Murdoch University", "Southern Cross University", "University of Canberra", "CQUniversity",
    "University of Southern Queensland (USQ)", "University of New England (UNE)", "Charles Sturt University", "Victoria University",
    "University of the Sunshine Coast (USC)", "Charles Darwin University", "Federation University Australia", "University of Notre Dame Australia",
    "Bond University", "Torrens University Australia", "University of Divinity", "Batchelor Institute",
    "Blue Mountains International Hotel Management School", "International College of Management, Sydney (ICMS)", "Kaplan Business School", "Holmes Institute",
    "SAE Institute Australia", "Le Cordon Bleu Australia", "JMC Academy", "Academy of Information Technology (AIT)",
    "Box Hill Institute", "Chisholm Institute"
  ],
  "Singapore": [
    "National University of Singapore (NUS)", "Nanyang Technological University (NTU)", "Singapore Management University (SMU)", "Singapore University of Technology and Design (SUTD)",
    "Singapore Institute of Technology (SIT)", "Singapore University of Social Sciences (SUSS)", "Singapore Polytechnic", "Ngee Ann Polytechnic",
    "Temasek Polytechnic", "Nanyang Polytechnic", "Republic Polytechnic", "LASALLE College of the Arts",
    "Nanyang Academy of Fine Arts (NAFA)", "ESSEC Business School (Singapore)", "INSEAD Asia Campus", "James Cook University Singapore",
    "Curtin University Singapore", "Management Development Institute of Singapore (MDIS)", "Kaplan Higher Education Academy (Singapore)", "PSB Academy",
    "Amity Global Institute", "Dimensions International College", "Beacon International College", "East Asia Institute of Management (EASB)",
    "SHRM College", "SDH Institute", "TCA College", "BMC Academy",
    "ERC Institute", "TMC Academy", "Auston Institute of Management", "Parkway College of Nursing and Allied Health",
    "Raffles College of Higher Education", "Singapore Institute of Management (SIM)", "S P Jain School of Global Management", "DigiPen Institute of Technology Singapore",
    "Newcastle University Singapore", "TUM Asia (Technical University of Munich)", "Munich Business School Singapore", "German Institute of Science and Technology",
    "National Junior College", "Victoria Junior College", "Temasek Junior College", "Raffles Junior College",
    "Anglo-Chinese Junior College", "Hwa Chong Institution", "Anglo-Chinese School (Independent)", "Saint Andrew's Junior College",
    "Anderson Serangoon Junior College", "Nanyang Junior College"
  ],
  "Mongolia": [
    "National University of Mongolia (NUM)", "Mongolian University of Science and Technology (MUST)", "Mongolian State University of Education (MSUE)", "Mongolian University of Life Sciences (MULS)",
    "Mongolian National University of Medical Sciences (MNUMS)", "Otgontenger University", "University of the Humanities", "Mongolia International University (MIU)",
    "Mandakh University", "City University Mongolia", "Ikh Zasag International University", "Shikhikhutug Law University",
    "Orkhon University", "Ulaanbaatar University", "Mongolia-Japan Joint College", "Mongolian National University",
    "Soyombo University", "Movie Art Institute of Mongolia", "Mongolian University of Arts and Culture", "Mon-Altius Physical Education Institute",
    "Mongolian Academy of Sciences Graduate School", "Khan-Uul University", "New Mongol Institute of Technology", "Mongolian-German Institute of Technology (GMIT)",
    "Mongolia-Korea Joint School", "Mongolian Royal Academy", "Khovd University", "Bayan-Ulgii Branch of NUM",
    "Dornod University", "Erdenet Institute of MUST", "Darkhan School of MUST", "University of Finance and Economics (UFE)",
    "Global Leadership University", "Huree University of ICT", "Shin-Mongol Academy", "Tsetsee Gung Institute",
    "Ulaanbaatar State University", "Shine Mongol Technic College", "Mongolian National Institute of Physical Education", "Mongolian Institute of CPA College",
    "Mongoliin Gazar Shoroo Institute", "Darkhan Humanities Institute", "Orkhon branch school", "Choibalsan College",
    "Selenge Institute", "Gobi-Altai Medical College", "Zavkhan Branch of NUM", "Uvs Branch of MUST",
    "Sukhbaatar College", "Bulgan Vocational College"
  ]
};

// Generate realistic parameters safely based on country
function generateSchoolForCountry(name: string, countryName: string, index: number): University {
  const code = countryName.toLowerCase().replace(/[^a-z]/g, "");
  const id = `${code}-uni-gen-${index}`;
  const website = `https://www.${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.edu`;

  let ranking = index + 150;
  let acceptanceRate = "45%";
  let tuitionFee = 15000;
  let dormitoryFee = 5000;
  let livingCost = 6000;
  let healthInsurance = 1000;
  let applicationFee = 50;
  let minGpa = 3.0;
  let ieltsMin = 6.0;
  let toeflMin = 80;
  let satMin: number | undefined = undefined;
  let requiredSubjects = "Математик, Байгалийн ухаан, Уран зохиол";
  let requiredDocuments = "Ахлах сургуулийн гэрчилгээ, дүнгийн хуулбар, суралцах төлөвлөгөө, гадаад паспортын хуулбар, 1 тодорхойлох захидал";
  let openingDate = "9-р сарын 15";
  let deadline = "2-р сарын 15";
  let resultDate = "5-р сарын 20";
  let scholarships = "Олон улсын оюутны ерөнхийлөгчийн тэтгэлэг (Сургалтын төлбөрийн хөнгөлөлт болон тэтгэлгүүд)";

  if (countryName === "USA") {
    ranking = index + 3;
    acceptanceRate = `${Math.floor(Math.random() * 20) + 5}%`;
    tuitionFee = 35000 + (index * 550);
    dormitoryFee = 10000 + (index * 150);
    livingCost = 9000 + (index * 100);
    healthInsurance = 2500 + (index * 25);
    applicationFee = 75;
    minGpa = parseFloat((3.65 - (index * 0.015)).toFixed(2));
    if (minGpa < 2.8) minGpa = 2.8;
    ieltsMin = index < 15 ? 7.0 : 6.5;
    toeflMin = index < 15 ? 95 : 80;
    satMin = 1350 + (30 - index) * 5;
    if (satMin < 1100) satMin = 1100;
    if (satMin > 1580) satMin = 1580;
    requiredSubjects = "Математик анализ, Хими, Физик, Түүх болон Академик бичиг";
    requiredDocuments = "Нийтийн өргөдлийн маягт (Common App), 2 тодорхойлох захидал, албан ёсны дүнгийн хуулбар, SAT/ACT оноо, хувийн эссэ, гэр бүлийн орлогын мэдүүлэг";
    openingDate = "8-р сарын 1";
    deadline = "1-р сарын 1";
    resultDate = "4-р сарын 1";
    scholarships = `${name} Сурлагын амжилтын тэтгэлэг (Голч дүн болон SAT/ACT оноонд тулгуурлан жил бүр $15,000 - $35,000 олгоно)`;
  } else if (countryName === "Canada") {
    ranking = index + 15;
    acceptanceRate = `${Math.floor(Math.random() * 30) + 12}%`;
    tuitionFee = 22000 + (index * 420);
    dormitoryFee = 8000 + (index * 100);
    livingCost = 8000 + (index * 80);
    healthInsurance = 800;
    applicationFee = 100;
    minGpa = parseFloat((3.5 - (index * 0.015)).toFixed(2));
    if (minGpa < 2.5) minGpa = 2.5;
    ieltsMin = index < 15 ? 7.0 : 6.5;
    toeflMin = index < 15 ? 90 : 80;
    requiredDocuments = "Онлайн өргөдөл, албан ёсны дүнгийн хуулбар, санхүүгийн баталгаа, сурах зөвшөөрлийн бичиг баримт (Study Permit), Англи/Франц хэлний онооны баталгаа";
    openingDate = "9-р сарын 1";
    deadline = "1-р сарын 15";
    resultDate = "5-р сарын 1";
    scholarships = `Канадын элсэгчийн тэтгэлэг (Ахлах сургуулийн дүн нь 3.5-аас дээш бүх олон улсын оюутнууд автоматаар 10,000 CAD хүртэл тэтгэлэгт хамрагдах нөхцөл)`;
  } else if (countryName === "United Kingdom") {
    ranking = index + 10;
    acceptanceRate = `${Math.floor(Math.random() * 25) + 10}%`;
    tuitionFee = 18000 + (index * 480);
    dormitoryFee = 6000 + (index * 120);
    livingCost = 9000 + (index * 90);
    healthInsurance = 1200;
    applicationFee = 30;
    minGpa = parseFloat((3.55 - (index * 0.015)).toFixed(2));
    if (minGpa < 2.6) minGpa = 2.6;
    ieltsMin = index < 15 ? 7.0 : 6.5;
    toeflMin = index < 15 ? 92 : 82;
    requiredSubjects = "Сонгосон чиглэлийн холбогдох ахисан түвшний хичээлүүд, эсвэл дунд сургуулийн өндөр дүнгийн хуулбар";
    requiredDocuments = "UCAS портал бүртгэл, Хувийн тодорхойлолт эссэ, 1 академик тодорхойлох баримт, Хэлний шалгалтын оноо";
    openingDate = "9-р сарын 5";
    deadline = "1-р сарын 26";
    resultDate = "5-р сарын 15";
    scholarships = "Их Британийн Хамтын нөхөрлөлийн тэтгэлэгт дэмжлэг, Британийн Зөвлөлийн Great тэтгэлэг хуудас, Сургуулийн нэрэмжит тэтгэлгүүд";
  } else if (countryName === "South Korea") {
    ranking = index + 60;
    acceptanceRate = `${Math.floor(Math.random() * 40) + 15}%`;
    tuitionFee = 4500 + (index * 120);
    dormitoryFee = 1500;
    livingCost = 4000;
    healthInsurance = 600;
    applicationFee = 80;
    minGpa = parseFloat((3.3 - (index * 0.012)).toFixed(2));
    if (minGpa < 2.4) minGpa = 2.4;
    ieltsMin = index < 15 ? 6.5 : 5.5;
    toeflMin = index < 15 ? 80 : 70;
    requiredSubjects = "Англи хэлний суурь, Математик, Компьютерийн суурь мэдлэг";
    requiredDocuments = "Элсэлтийн өргөдлийн маягт, Хувийн танилцуулга болон Суралцах төлөвлөгөө, Ахлах сургуулийн гэрчилгээ, Дүнгийн хуулбар, Багшийн тодорхойлох захидал, $18,000-аас дээш банкны баталгаа";
    openingDate = "3-р сарын 1";
    deadline = "6-р сарын 15";
    resultDate = "10-р сарын 10";
    scholarships = `Солонгосын Глобал түншлэлийн тэтгэлэг: Солонгос хэлний TOPIK 3+ эсвэл IELTS 6.5+ оноотой олон улсын оюутнуудад сургалтын төлбөрийг 50% - 100% хүртэл хөнгөлнө`;
  } else if (countryName === "Japan") {
    ranking = index + 50;
    acceptanceRate = `${Math.floor(Math.random() * 35) + 20}%`;
    tuitionFee = 5350 + (index * 140);
    dormitoryFee = 2500;
    livingCost = 7000;
    healthInsurance = 400;
    applicationFee = 150;
    minGpa = parseFloat((3.4 - (index * 0.015)).toFixed(2));
    if (minGpa < 2.4) minGpa = 2.4;
    ieltsMin = 6.0;
    toeflMin = 80;
    requiredSubjects = "Гүнзгийрүүлсэн шинжлэх ухаан, Нийгмийн ухааны суурь, Япон хэлний суурь мэдлэг";
    requiredDocuments = "Японы их дээд сургуулиудын элсэлтийн шалгалт (EJU) эсвэл олон улсын стандарт шалгалт, төгсөлтийн гэрчилгээ, COE дэмжлэгийн баримтууд";
    openingDate = "10-р сарын 1";
    deadline = "12-р сарны 20";
    resultDate = "3-р сарын 15";
    scholarships = "Японы Засгийн газрын MEXT тэтгэлэгт хөтөлбөр: Сургалтын төлбөр, хоёр талын нислэгийн тийз, сар бүр 145,000 иений амьжиргааны тэтгэмж олгоно";
  } else if (countryName === "China") {
    ranking = index + 40;
    acceptanceRate = `${Math.floor(Math.random() * 40) + 25}%`;
    tuitionFee = 2500 + (index * 80);
    dormitoryFee = 1200;
    livingCost = 3500;
    healthInsurance = 150;
    applicationFee = 80;
    minGpa = parseFloat((3.2 - (index * 0.015)).toFixed(2));
    if (minGpa < 2.0) minGpa = 2.0;
    ieltsMin = 5.5;
    toeflMin = 75;
    requiredDocuments = "Хятадын Засгийн газрын тэтгэлгийн маягт, Боловсролын хамгийн өндөр зэргийн диплом, Академик дүнгийн хуулбарууд, 2 тодорхойлох захидал, Суралцах төлөвлөгөө (хамгийн багадаа 800 үгтэй)";
    openingDate = "1-р сарын 1";
    deadline = "4-р сарын 30";
    resultDate = "7-р сарын 10";
    scholarships = `${name} Хятадын Засгийн газрын (CSC) тэтгэлэг: Сургалтын төлбөр, дотуур байр, эрүүл мэндийн даатгал 100% үнэгүй, сар бүр 2,500 - 3,000 юаний тэтгэмж дагалдана`;
  } else if (countryName === "Germany") {
    ranking = index + 45;
    acceptanceRate = `${Math.floor(Math.random() * 30) + 15}%`;
    tuitionFee = 350; // Semester fee
    dormitoryFee = 4000;
    livingCost = 8000;
    healthInsurance = 1300;
    applicationFee = 75;
    minGpa = parseFloat((3.3 - (index * 0.015)).toFixed(2));
    if (minGpa < 2.0) minGpa = 2.0;
    ieltsMin = 6.5;
    toeflMin = 85;
    requiredSubjects = "Математик, Байгалийн ухааны суурь хичээлүүд, Герман/Англи хэлний дүрэм, ярианы чадвар";
    requiredDocuments = "Uni-Assist-ийн VPD үнэлгээ, Германы банкны хаалттай дансны хуулбар (€11,900 байршуулсан), эрүүл мэндийн даатгал, ахлах сургуулийн гэрчилгээ";
    openingDate = "12-р сарын 1";
    deadline = "1-р сарын 15";
    resultDate = "3-р сарын 30";
    scholarships = "Германы Үндэсний тэтгэлэг (Deutschlandstipendium): Сурлагаараа тэргүүлэгч олон улсын шилдэг оюутнуудад сар бүр 300 евро олгоно";
  } else if (countryName === "Australia") {
    ranking = index + 25;
    acceptanceRate = `${Math.floor(Math.random() * 30) + 20}%`;
    tuitionFee = 22000 + (index * 380);
    dormitoryFee = 10000;
    livingCost = 14000;
    healthInsurance = 900;
    applicationFee = 110;
    minGpa = parseFloat((3.4 - (index * 0.015)).toFixed(2));
    if (minGpa < 2.4) minGpa = 2.4;
    ieltsMin = index < 15 ? 7.0 : 6.5;
    toeflMin = index < 15 ? 90 : 80;
    requiredSubjects = "Холбогдох суурь шинжлэх ухаан, хэлний бэлтгэл зааварчилгаа";
    requiredDocuments = "Академик дүнгийн хуулбар, Англи хэлний шалгалтын оноо, Элсэлтийн баталгааны хуудас (CoE), Олон улсын оюутны даатгалын баримт (OSHC)";
    openingDate = "9-р сарын 1";
    deadline = "4-р сарын 30";
    resultDate = "7-р сарын 20";
    scholarships = `${name} Олон улсын шилдэг элсэгчийн тэтгэлэг: Сурлагын явцаас хамааран жил бүр сургалтын төлбөрөөс 25% хүртэл хөнгөлөх хөтөлбөр`;
  } else if (countryName === "Singapore") {
    ranking = index + 20;
    acceptanceRate = `${Math.floor(Math.random() * 25) + 8}%`;
    tuitionFee = 16000 + (index * 450);
    dormitoryFee = 6000;
    livingCost = 9000;
    healthInsurance = 400;
    applicationFee = 40;
    minGpa = parseFloat((3.6 - (index * 0.015)).toFixed(2));
    if (minGpa < 2.6) minGpa = 2.6;
    ieltsMin = index < 15 ? 7.0 : 6.5;
    toeflMin = index < 15 ? 92 : 82;
    requiredSubjects = "Ахисан түвшний математик, Физик, Ерөнхий логик сэтгэлгээний чадамж";
    requiredDocuments = "SOLAR дансны визний бүртгэл, Ахлах сургуулийн дүнгийн хуулбар, тодорхойлох захидал, паспортын хуулбар";
    openingDate = "10-р сарын 1";
    deadline = "1-р сарын 31";
    resultDate = "3-р сарын 31";
    scholarships = "Сингапурын Эдийн засгийн яамны (MOE) тэтгэлэгт хөнгөлөлт (Сургалтын төлбөрийн 50% орчмыг чөлөөлөх бөгөөд сургуулиа төгсөөд Сингапурт бүртгэлтэй компанид 3 жил ажиллах үүрэгтэй)";
  } else {
    // Mongolia
    ranking = index + 1000;
    acceptanceRate = `${Math.floor(Math.random() * 15) + 75}%`;
    tuitionFee = 1500 + (index * 40);
    dormitoryFee = 300;
    livingCost = 1200;
    healthInsurance = 50;
    applicationFee = 5;
    minGpa = parseFloat((2.8 - (index * 0.015)).toFixed(2));
    if (minGpa < 1.8) minGpa = 1.8;
    ieltsMin = 5.0;
    toeflMin = 50;
    requiredSubjects = "Элсэлтийн Ерөнхий Шалгалт (ЭЕШ) - Математик, Англи хэл, Нийгмийн ухаан";
    requiredDocuments = "ЭЕШ онооны хуудас, Төгсөлтийн Аттестат гэрчилгээ, Иргэний үнэмлэх хуулбар, 3х4 цээж зураг, бүртгэлийн хураамж төлсөн баримт";
    openingDate = "June 1";
    deadline = "July 5";
    resultDate = "July 8";
    scholarships = "Монгол Улсын Засгийн Газрын шилдэг оюутан тэтгэлэг, Сургуулийн нэрэмжит ЭЕШ-800 оноотны 100% чөлөөлөх хөнгөлөлт";
  }

  const estimatedAnnualCost = tuitionFee + dormitoryFee + livingCost + healthInsurance + applicationFee;

  return {
    id,
    name,
    country: countryName,
    ranking,
    acceptanceRate,
    website,
    tuitionFee,
    dormitoryFee,
    livingCost,
    healthInsurance,
    applicationFee,
    estimatedAnnualCost,
    minGpa,
    ieltsMin,
    toeflMin,
    satMin,
    requiredSubjects,
    requiredDocuments,
    openingDate,
    deadline,
    resultDate,
    scholarships,
    admissionsUrl: `${website}/admissions`,
    scholarshipsUrl: `${website}/scholarships`,
    virtualTourUrl: `${website}/virtual-tour`
  };
}

// Generate the complete unified database of universities
const buildInitialUniversities = (): University[] => {
  const result: University[] = [];

  // 1. Add all premium (custom-crafted manual) universities first to keep their exact specific data
  const manualMap = new Map<string, University>();
  manualUniversities.forEach((uni) => {
    // Populate informative URL links
    const baseWeb = uni.website || "https://www.google.com";
    uni.admissionsUrl = uni.admissionsUrl || `${baseWeb}/admissions`;
    uni.scholarshipsUrl = uni.scholarshipsUrl || `${baseWeb}/scholarships`;
    uni.virtualTourUrl = uni.virtualTourUrl || `${baseWeb}/virtual-tour`;

    result.push(uni);
    manualMap.set(`${uni.country.toLowerCase()}:${uni.name.toLowerCase()}`, uni);
  });

  // 2. Loop through all 10 countries and generate up to 50 distinct universities for each
  Object.entries(rawSchoolNames).forEach(([country, names]) => {
    // Keep track of how many schools we have registered for this country
    let registeredCount = result.filter(u => u.country === country).length;
    
    names.forEach((name, idx) => {
      const key = `${country.toLowerCase()}:${name.toLowerCase()}`;
      
      // If the school is already successfully added as part of the manual premium list, skip to avoid duplicates
      if (manualMap.has(key)) {
        return;
      }
      
      // Generate a realistic school catalog entry
      const generatedUni = generateSchoolForCountry(name, country, idx);
      
      // To be strictly certain we have at least 50 schools, append it!
      result.push(generatedUni);
      registeredCount++;
    });
    
    // Safety check: if for some reason we have fewer than 50, pad with numbered backups
    while (registeredCount < 50) {
      const padName = `${country} State Academy College #${registeredCount + 1}`;
      const generatedUni = generateSchoolForCountry(padName, country, registeredCount);
      result.push(generatedUni);
      registeredCount++;
    }
  });

  return result;
};

export const initialUniversities: University[] = buildInitialUniversities();
