// backend/seedData.js
// Purpose: Seeds MongoDB database with 10 detailed Indian government policies and pre-simplifies them

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Policy = require('./models/Policy');
const simplifyService = require('./services/simplifyService');

dotenv.config();

const POLICIES_DATA = [
  {
    title: 'PM Kisan Samman Nidhi',
    category: 'Agriculture',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    description: 'Direct income support scheme providing Rs.6000 per year to small and marginal farmers in three equal installments of Rs.2000 each.',
    content: `The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector scheme with 100% funding from the Government of India. It became operational from 1.12.2018. Under the scheme, an income support of ₹6,000 per year in three equal installments is provided to all landholding farmer families.\n\nEligibility criteria: All landholding farmers' families, which have cultivable landholding in their names are eligible to get benefit under the scheme. The definition of family for the scheme is husband, wife and minor children.\n\nExclusion categories: Affluent farmers, institutional landholders, farmer families holding constitutional posts, active or retired officers and employees of State/Central government, persons who paid income tax in last assessment year, and professionals like doctors, engineers, and lawyers are excluded from the scheme.\n\nHow to apply: Eligible farmers can apply through the official PM-KISAN portal (pmkisan.gov.in) using their Aadhaar number, or visit the nearest Common Service Centre (CSC) for registration. Bank account details and land ownership records are mandatory for successful registration.`,
    tags: ['farmer', 'agriculture', 'income support', 'rural', 'PM Kisan']
  },
  {
    title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    category: 'Health',
    ministry: 'Ministry of Health and Family Welfare',
    description: 'Health insurance scheme providing coverage up to Rs.5 lakh per family per year for secondary and tertiary care hospitalization.',
    content: `Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY) is a flagship scheme of the Government of India providing health cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization across public and private empanelled hospitals in India.\n\nEligibility: Over 12 crore poor and vulnerable entitled families (approximately 55 crore beneficiaries) are eligible for these benefits based on the Socio-Economic Caste Census (SECC) 2011 database. There is no cap on family size, age or gender to ensure all family members are covered.\n\nBenefits: Cashless and paperless access to quality inpatient healthcare services. It covers up to 3 days of pre-hospitalization and 15 days post-hospitalization expenses such as diagnostics and medicines. Over 1,900 medical procedures are covered under the scheme.\n\nHow to avail: Beneficiaries do not need to register separately. They can visit any empanelled hospital with their Aadhaar card, ration card, or PMJAY e-card to verify their identity and receive treatment cashless.`,
    tags: ['health', 'insurance', 'hospital', 'PMJAY', 'Ayushman']
  },
  {
    title: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    category: 'Employment',
    ministry: 'Ministry of Rural Development',
    description: 'Guarantees 100 days of wage employment per year to rural households whose adult members volunteer to do unskilled manual work.',
    content: `The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is an Indian labour law and social security measure that aims to guarantee the 'right to work'. It provides at least 100 days of guaranteed wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.\n\nKey features: Employment must be provided within 15 days of application, failing which an unemployment allowance must be paid by the government. Minimum wages are fixed by the state governments. At least one-third of the beneficiaries must be women.\n\nRegistration: Rural households can register at their local Gram Panchayat. Upon verification, a Job Card is issued to the household within 15 days containing photographs of adult members.\n\nWork site facilities: Crèche facilities, drinking water, shade, and first-aid must be provided at all work sites. Wages are disbursed directly into the bank or post office accounts of beneficiaries.`,
    tags: ['employment', 'rural', 'MNREGA', 'wages', 'job guarantee']
  },
  {
    title: 'Pradhan Mantri Awas Yojana - Gramin',
    category: 'Housing',
    ministry: 'Ministry of Rural Development',
    description: 'Housing scheme to provide pucca houses to homeless and kutcha house dwellers in rural areas with basic amenities.',
    content: `Pradhan Mantri Awas Yojana - Gramin (PMAY-G) aims to provide a pucca house with basic amenities to all rural families who are homeless or living in kutcha or dilapidated houses. The target is to achieve 'Housing for All' in rural areas.\n\nFinancial Assistance: The unit assistance provided is ₹1,20,000 in plain areas and ₹1,30,000 in hilly states, difficult areas, and IAP districts. The cost of unit assistance is shared between Central and State Governments in the ratio 60:40 in plain areas and 90:10 for North Eastern and hilly states.\n\nBeneficiary Selection: Beneficiaries are identified using housing deprivation parameters in the SECC 2011 data, followed by Gram Sabha verification. This ensures absolute transparency in selection.\n\nAdditional benefits: Beneficiaries receive 90/95 person-days of unskilled wage employment under MGNREGA for house construction. Assistance of ₹12,000 is also provided for toilet construction under Swachh Bharat Mission.`,
    tags: ['housing', 'rural', 'PM Awas', 'home', 'shelter']
  },
  {
    title: 'Sukanya Samriddhi Yojana',
    category: 'Finance',
    ministry: 'Ministry of Finance',
    description: 'Small savings scheme for girl child offering high interest rates with tax benefits to encourage education and marriage expenses.',
    content: `Sukanya Samriddhi Yojana (SSY) is a small deposit scheme of the Government of India launched as part of the 'Beti Bachao Beti Padhao' campaign. It is designed to provide financial security to a girl child for her higher education and marriage expenses.\n\nAccount Opening: An SSY account can be opened by the parent or legal guardian of a girl child below 10 years of age. A maximum of two accounts are allowed per family (one for each girl child). Accounts can be opened at any post office or authorized commercial bank.\n\nDeposits and Interest: Minimum annual deposit is ₹250 and maximum is ₹1.5 lakh in a financial year. Deposits can be made up to 15 years from the date of opening. It currently offers an attractive interest rate compounded annually, fully exempt from tax under Section 80C.\n\nMaturity and Withdrawals: The account matures after 21 years from the date of opening or upon the marriage of the girl child after she turns 18. Partial withdrawal up to 50% of the balance is allowed after the girl turns 18 for her higher education.`,
    tags: ['girl child', 'savings', 'education', 'marriage', 'investment']
  },
  {
    title: 'Pradhan Mantri Mudra Yojana',
    category: 'Finance',
    ministry: 'Ministry of Finance',
    description: 'Provides loans up to Rs.10 lakh to non-corporate, non-farm small and micro enterprises through member lending institutions.',
    content: `Pradhan Mantri Mudra Yojana (PMMY) is a flagship scheme of the Government of India to provide micro-credit up to ₹10 lakhs to income-generating micro-enterprises engaged in manufacturing, trading, and services sectors, including agricultural allied activities.\n\nLoan Categories: PMMY loans are categorized into three tiers based on the growth stage of the business:\n1. Shishu: Loans up to ₹50,000 for entrepreneurs starting a new business.\n2. Kishore: Loans above ₹50,000 and up to ₹5 lakhs for buying equipment or working capital.\n3. Tarun: Loans above ₹5 lakhs and up to ₹10 lakhs for established businesses expanding operations.\n\nKey Features: No collateral security is required to avail Mudra loans. There are no processing fees for Shishu and Kishore loans. Interest rates are determined by the lending banks based on RBI guidelines.\n\nHow to Apply: Borrowers can approach any commercial bank, Regional Rural Bank (RRB), Small Finance Bank, or Micro Finance Institution (MFI) with their business plan, identity proof, and address proof. Online application is also available via the Udyamimitra portal.`,
    tags: ['loan', 'business', 'entrepreneur', 'MUDRA', 'small business']
  },
  {
    title: 'National Scholarship Portal Schemes',
    category: 'Education',
    ministry: 'Ministry of Minority Affairs',
    description: 'Centralized portal providing various scholarships to students from minority communities, SC/ST/OBC, and economically weaker sections.',
    content: `The National Scholarship Portal (NSP) is a one-stop digital platform providing various scholarships to students across India. It encompasses Central Government schemes, State Government schemes, and UGC/AICTE scholarships under a unified portal.\n\nKey Schemes Covered: Pre-Matric Scholarships for minority/SC/ST students, Post-Matric Scholarships for higher secondary and college education, and Merit-cum-Means based scholarships for professional and technical courses.\n\nEligibility & Income Limits: Varies by specific scheme. Generally, family income must be below ₹2.5 lakhs per annum for Pre/Post-Matric schemes, and below ₹2.5 lakhs for Merit-cum-Means. Students must have secured at least 50% marks in their previous final examination.\n\nApplication Process: Applications must be submitted online at scholarships.gov.in. Mandatory documents include Aadhaar card, student bank account details, income certificate, caste certificate (if applicable), and previous year mark sheets. Direct Benefit Transfer (DBT) ensures scholarship amounts are credited directly to student bank accounts.`,
    tags: ['scholarship', 'education', 'student', 'minority', 'financial aid']
  },
  {
    title: 'Atal Pension Yojana',
    category: 'Finance',
    ministry: 'Ministry of Finance',
    description: 'Pension scheme focused on workers in unorganized sector ensuring fixed pension between Rs.1000 to Rs.5000 per month after age 60.',
    content: `Atal Pension Yojana (APY) is a government-backed pension scheme in India primarily focused on citizens in the unorganized sector. It provides a guaranteed minimum monthly pension ranging from ₹1,000 to ₹5,000 after attaining 60 years of age.\n\nEligibility: Any citizen of India between 18 and 40 years of age having a savings bank account or post office savings account can enroll. The applicant should not be an existing income tax payer.\n\nContributions: Monthly contribution amounts depend on the age of joining and the desired pension slab. Joining early at age 18 requires very small monthly contributions (e.g., ₹42 per month for ₹1,000 pension). Contributions are automatically debited from the bank account.\n\nBenefits: Guaranteed monthly pension to the subscriber. After the subscriber's demise, the exact same pension is paid to the spouse for life. Upon the demise of both subscriber and spouse, the entire accumulated corpus is returned to the nominee.`,
    tags: ['pension', 'retirement', 'unorganized sector', 'APY', 'old age']
  },
  {
    title: 'Swachh Bharat Mission - Grameen',
    category: 'Environment',
    ministry: 'Ministry of Jal Shakti',
    description: 'Mission to achieve open defecation free India and improve solid and liquid waste management in rural areas.',
    content: `Swachh Bharat Mission - Grameen (SBM-G) is a national campaign launched to achieve universal sanitation coverage, eliminate open defecation, and promote cleanliness and hygiene in rural India.\n\nFinancial Incentive: The scheme provides an incentive of ₹12,000 for the construction of an Individual Household Latrine (IHHL) to all Below Poverty Line (BPL) households and identified Above Poverty Line (APL) households (such as SC/ST, small/marginal farmers, landless labourers, and women-headed households).\n\nPhase II (ODF Plus): SBM-G Phase II focuses on sustaining Open Defecation Free (ODF) status and implementing Solid and Liquid Waste Management (SLWM) in all rural villages. This includes biodegradable waste management, greywater management, and plastic waste management.\n\nImplementation: Executed through Gram Panchayats and local Swachhagrahi volunteers. Citizens can apply for IHHL incentives through their local Gram Panchayat office or via the SBM online registration portal.`,
    tags: ['sanitation', 'toilet', 'clean India', 'rural', 'hygiene']
  },
  {
    title: 'Digital India Programme',
    category: 'Technology',
    ministry: 'Ministry of Electronics and Information Technology',
    description: 'Flagship programme to transform India into a digitally empowered society and knowledge economy through improved digital infrastructure.',
    content: `The Digital India Programme is a flagship initiative of the Government of India to ensure that government services are made available to citizens electronically by improving online infrastructure and increasing internet connectivity.\n\nNine Growth Pillars: The programme rests on nine pillars: Broadband Highways, Universal Access to Mobile Connectivity, Public Internet Access Programme, e-Governance (reforming government through technology), e-Kranti (electronic delivery of services), Information for All, Electronics Manufacturing, IT for Jobs, and Early Harvest Programmes.\n\nKey Citizen Services: Creation of digital infrastructure such as Aadhaar, DigiLocker (for digital document storage), UPI (for instant cashless payments), UMANG app (single platform for all government services), and MyGov (citizen engagement platform).\n\nImpact: Empowers common citizens with 24/7 digital access to land records, certificates, banking, and welfare disbursements directly on their mobile phones, eliminating middlemen and corruption.`,
    tags: ['digital', 'technology', 'internet', 'e-governance', 'IT']
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/policybot';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB for seeding');

    await Policy.deleteMany({});
    console.log('✓ Cleared existing policies');

    for (const data of POLICIES_DATA) {
      const policy = new Policy(data);
      await policy.save();

      try {
        console.log(`Simplifying policy: ${policy.title}...`);
        await simplifyService.simplifyPolicy(policy._id, 'en');
      } catch (err) {
        console.warn(`⚠️ Could not pre-simplify ${policy.title} (Mock mode active or API busy)`);
      }
    }

    console.log('✓ Seeded 10 policies successfully');
    console.log('✓ Database seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
