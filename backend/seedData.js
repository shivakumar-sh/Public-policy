const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Policy = require('./models/Policy');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const policies = [
  {
    title: "PM Kisan Samman Nidhi",
    category: "Agriculture",
    description: "A central sector scheme to provide income support to all landholding farmers' families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities.",
    content: "The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme with 100% funding from the Government of India. Under the scheme, income support of 6,000/- per year in three equal installments will be provided to all landholding farmer families. The definition of family for the scheme is husband, wife and minor children. State Government and UT administration will identify the farmer families which are eligible for support as per scheme guidelines. The fund will be directly transferred to the bank accounts of the beneficiaries.",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    tags: ["Farmers", "Agriculture", "Direct Benefit Transfer"],
    isActive: true
  },
  {
    title: "Ayushman Bharat (PM-JAY)",
    category: "Health",
    description: "Ayushman Bharat PM-JAY is the largest health assurance scheme in the world which aims at providing a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.",
    content: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) is a flagship scheme of Government of India to provide cashless secondary and tertiary care treatment from the empanelled public and private hospitals. It covers up to 3 days of pre-hospitalization and 15 days post-hospitalization expenses such as diagnostics and medicines. There is no restriction on family size, age or gender. All pre-existing conditions are covered from day one.",
    ministry: "Ministry of Health and Family Welfare",
    tags: ["Health", "Insurance", "Hospitals"],
    isActive: true
  },
  {
    title: "MGNREGA",
    category: "Employment",
    description: "The Mahatma Gandhi National Rural Employment Guarantee Act aims to enhance livelihood security in rural areas by providing at least 100 days of guaranteed wage employment in a financial year.",
    content: "MGNREGA provides a legal guarantee for one hundred days of employment in every financial year to adult members of any rural household willing to do public work-related unskilled manual work at the statutory minimum wage. If work is not provided within 15 days of applying, applicants are entitled to an unemployment allowance. The act also focuses on the creation of durable assets like roads, canals, ponds, and wells.",
    ministry: "Ministry of Rural Development",
    tags: ["Employment", "Rural", "Wages"],
    isActive: true
  },
  {
    title: "PM Awas Yojana (Urban)",
    category: "Housing",
    description: "Pradhan Mantri Awas Yojana – Urban (PMAY-U), a flagship Mission of Government of India, addresses urban housing shortage among the EWS/LIG and MIG categories.",
    content: "The mission aims to provide all-weather pucca houses to all eligible beneficiaries in the urban areas by 2022. It covers the entire urban area consisting of Statutory Towns, Registration Areas, Special Development Authorities, and Industrial Development Authorities. The scheme provides interest subsidy on home loans and financial assistance for house construction.",
    ministry: "Ministry of Housing and Urban Affairs",
    tags: ["Housing", "Urban", "Home Loans"],
    isActive: true
  },
  {
    title: "Sukanya Samriddhi Yojana",
    category: "Finance",
    description: "A small deposit scheme of the Government of India meant exclusively for the girl child as part of its 'Beti Bachao Beti Padhao' campaign.",
    content: "The scheme is meant to meet the education and marriage expenses of a girl child. It currently provides a higher rate of interest than other small savings schemes. A natural or legal guardian can open an account in the name of a girl child from the birth of the girl child till she attains the age of 10 years. A minimum of Rs. 250 and a maximum of Rs. 1,50,000 can be deposited in a financial year.",
    ministry: "Ministry of Finance",
    tags: ["Savings", "Girl Child", "Education"],
    isActive: true
  }
];

const seedData = async () => {
  try {
    await Policy.deleteMany();
    await Policy.insertMany(policies);
    console.log('✅ Data Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error Seeding Data:', error);
    process.exit(1);
  }
};

seedData();
