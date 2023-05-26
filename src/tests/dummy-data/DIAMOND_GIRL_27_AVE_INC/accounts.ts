import type { Account } from "~/types/account";

const accounts: Account[] = [
  {
    name: "Undistributed",
    number: "999",
    entries: [],
  },
  {
    name: "CASH ON HAND",
    number: "1110",
    entries: [
      {
        description: "TO RECORD DEPOSITS #3841",
        quantity: 7,
      },
      {
        description: "SALES",
        quantity: 49,
      },
      {
        description: "DEPOSITS #3841",
        quantity: 40,
      },
      {
        description: "PAYROLL REC",
        quantity: 11,
      },
      {
        description: "TO RECORD PER CLIENT",
        quantity: 3,
      },
      {
        description: "DEPOSIT #3841",
        quantity: 3,
      },
      {
        description: "TO REC PER CLIENT",
        quantity: 3,
      },
      {
        description: "TO REC ACCOUNTS PER CLIENT",
        quantity: 2,
      },
    ],
  },
  {
    name: "CASH - BOA #8272",
    number: "1130",
    entries: [
      {
        description: "TO RECORD DEBITS #8272",
        quantity: 7,
      },
      {
        description: "RECORD CLOSED ACCOUNT PER CLIENT",
        quantity: 1,
      },
    ],
  },
  {
    name: "BOA #3841",
    number: "1131",
    entries: [
      {
        description: "TO RECORD DEBITS #3841",
        quantity: 7,
      },
      {
        description: "TO RECORD DEPOSITS #3841",
        quantity: 7,
      },
      {
        description: "PAYROLL CHECKS",
        quantity: 7,
      },
      {
        description: "CLEAR CHECKS",
        quantity: 2,
      },
      {
        description: "CLEARED CHECKS",
        quantity: 2,
      },
      {
        description: "PURCHASE",
        quantity: 9,
      },
      {
        description: "JINNY",
        quantity: 4,
      },
      {
        description: "PROTECTION ONE",
        quantity: 6,
      },
      {
        description: "CITY OF FT LAUDERDALE",
        quantity: 8,
      },
      {
        description: "FPL",
        quantity: 13,
      },
      {
        description: "MANE CONCEPT",
        quantity: 12,
      },
      {
        description: "XUCHANG",
        quantity: 5,
      },
      {
        description: "ROYAL IMEX",
        quantity: 4,
      },
      {
        description: "BEAUTY ELEMENTS",
        quantity: 1,
      },
      {
        description: "MIDWAY",
        quantity: 8,
      },
      {
        description: "CHOIS",
        quantity: 3,
      },
      {
        description: "MINK HAIR",
        quantity: 9,
      },
      {
        description: "HAIR ZONE",
        quantity: 6,
      },
      {
        description: "DEPOSITS #3841",
        quantity: 40,
      },
      {
        description: "DEBITS #3841",
        quantity: 45,
      },
      {
        description: "NEED PAYEE",
        quantity: 19,
      },
      {
        description: "PRIME TRADING INTERNATIONAL",
        quantity: 1,
      },
      {
        description: "PAYROLL-NEED PAYEE",
        quantity: 12,
      },
      {
        description: "BEAUTY PLUS TRADING",
        quantity: 7,
      },
      {
        description: "COMCAST",
        quantity: 2,
      },
      {
        description: "NEW JIGU TRADING CORP",
        quantity: 3,
      },
      {
        description: "DEPOSIT #3841",
        quantity: 3,
      },
      {
        description: "CHADE FASHIONS",
        quantity: 2,
      },
      {
        description: "IVY",
        quantity: 7,
      },
      {
        description: "HARTFORD INSURANCE",
        quantity: 1,
      },
      {
        description: "INSURANCE MEDICS",
        quantity: 1,
      },
      {
        description: "MARPEX INC.",
        quantity: 6,
      },
      {
        description: "R&B COLLECTION",
        quantity: 1,
      },
      {
        description: "ROCKEY TRADING",
        quantity: 2,
      },
      {
        description: "C AND L",
        quantity: 1,
      },
      {
        description: "BLACK CALA",
        quantity: 2,
      },
      {
        description: "BROWARD SHERIFF",
        quantity: 1,
      },
      {
        description: "CLEARED CHECKS #3841",
        quantity: 30,
      },
    ],
  },
  {
    name: "L/R - EMPLOYEES",
    number: "1145",
    entries: [],
  },
  {
    name: "L/R - STOCKHOLDER",
    number: "1150",
    entries: [],
  },
  {
    name: "INVENTORY",
    number: "1170",
    entries: [
      {
        description: "TO RECORD PER CLIENT",
        quantity: 2,
      },
      {
        description: "TO REC PER CLIENT",
        quantity: 1,
      },
      {
        description: "DEPOSITS #3841",
        quantity: 1,
      },
    ],
  },
  {
    name: "LEASEHOLD IMPROVEMENTS",
    number: "1235",
    entries: [],
  },
  {
    name: "FIXTURES & EQUIPMENT",
    number: "1245",
    entries: [],
  },
  {
    name: "ACCUMULATED DEPRECIATION",
    number: "1270",
    entries: [],
  },
  {
    name: "DEPOSITS",
    number: "1810",
    entries: [],
  },
  {
    name: "PAYROLL CLEARING",
    number: "1850",
    entries: [],
  },
  {
    name: "ACCOUNTS PAYABLE - TRADE",
    number: "2110",
    entries: [],
  },
  {
    name: "FUTA PAYABLE",
    number: "2130",
    entries: [],
  },
  {
    name: "SUTA PAYABLE",
    number: "2131",
    entries: [],
  },
  {
    name: "PAYROLL TAXES PAYABLE",
    number: "2150",
    entries: [
      {
        description: "ADP TAX",
        quantity: 16,
      },
      {
        description: "PAYROLL REC",
        quantity: 3,
      },
    ],
  },
  {
    name: "SALES TAX PAYABLE",
    number: "2160",
    entries: [
      {
        description: "FDOR",
        quantity: 50,
      },
      {
        description: "SALES",
        quantity: 49,
      },
    ],
  },
  {
    name: "MTGE PAYABLE",
    number: "2245",
    entries: [],
  },
  {
    name: "L/P - STOCKHOLDER",
    number: "2255",
    entries: [
      {
        description: "RECLASS DISTRIBUTIONS TO SH LOAN",
        quantity: 1,
      },
      {
        description: "REPAYMENT SHAREHOLDER LOAN",
        quantity: 1,
      },
    ],
  },
  {
    name: "PPP PAYROLL PROTECTION LOAN/SBA",
    number: "2256",
    entries: [
      {
        description: "CARES ACT PAYCHECK PROTECTION PROGRAM DEPOSIT",
        quantity: 1,
      },
      {
        description: "TO RECLASS PPP TAX EXEMPT OTHER INCOME",
        quantity: 1,
      },
    ],
  },
  {
    name: "LANDLORD INSURANCE CREDIT",
    number: "2257",
    entries: [
      {
        description: "DEPOSITS #3841",
        quantity: 3,
      },
      {
        description: "BKOFAMERICA BC 07/03",
        quantity: 1,
      },
    ],
  },
  {
    name: "COMMON STOCK",
    number: "3110",
    entries: [],
  },
  {
    name: "ADDITIONAL PAID IN CAPITAL",
    number: "3115",
    entries: [],
  },
  {
    name: "ACCUMULATED ADJUSTMENTS ACCT",
    number: "3120",
    entries: [],
  },
  {
    name: "S/H DISTRIBUTION",
    number: "3126",
    entries: [
      {
        description: "FDOR",
        quantity: 32,
      },
      {
        description: "RECORD CLOSED ACCOUNT PER CLIENT",
        quantity: 1,
      },
      {
        description: "TO RECORD PER CLIENT",
        quantity: 1,
      },
      {
        description: "RECLASS DISTRIBUTIONS TO SH LOAN",
        quantity: 1,
      },
      {
        description: "FDOR - SALES TAX FOR RENTAL",
        quantity: 5,
      },
      {
        description: "FDOR - RENTAL",
        quantity: 6,
      },
      {
        description: "TO REC PER CLIENT",
        quantity: 1,
      },
      {
        description: "TO REC ACCOUNTS PER CLIENT",
        quantity: 1,
      },
      {
        description: "REPAYMENT SHAREHOLDER LOAN",
        quantity: 1,
      },
    ],
  },
  {
    name: "SUSPENSE",
    number: "3130",
    entries: [
      {
        description: "NEED PAYEE",
        quantity: 1,
      },
      {
        description: "RECLASS ACCTS",
        quantity: 1,
      },
    ],
  },
  {
    name: "SALES",
    number: "4101",
    entries: [
      {
        description: "SALES",
        quantity: 48,
      },
    ],
  },
  {
    name: "INSURANCE SETTLEMENT",
    number: "4102",
    entries: [],
  },
  {
    name: "OTHER INCOME - PPP - TAX EXEMPT INCOME",
    number: "4110",
    entries: [
      {
        description: "TO RECLASS PPP TAX EXEMPT OTHER INCOME",
        quantity: 1,
      },
    ],
  },
  {
    name: "COMMISSIONS",
    number: "4121",
    entries: [],
  },
  {
    name: "REFUNDS & ALLOWANCES",
    number: "4170",
    entries: [],
  },
  {
    name: "NON TAXABLE SALES",
    number: "4191",
    entries: [],
  },
  {
    name: "SALES TAX DISCOUNT",
    number: "4192",
    entries: [
      {
        description: "SALES",
        quantity: 48,
      },
    ],
  },
  {
    name: "PURCHASES",
    number: "4201",
    entries: [
      {
        description: "CLEAR CHECKS",
        quantity: 2,
      },
      {
        description: "SENSATIONNEL",
        quantity: 2,
      },
      {
        description: "CLEARED CHECKS",
        quantity: 1,
      },
      {
        description: "PURCHASE",
        quantity: 9,
      },
      {
        description: "JINNY",
        quantity: 4,
      },
      {
        description: "MANE CONCEPT",
        quantity: 12,
      },
      {
        description: "XUCHANG",
        quantity: 5,
      },
      {
        description: "ROYAL IMEX",
        quantity: 4,
      },
      {
        description: "BEAUTY ELEMENTS",
        quantity: 1,
      },
      {
        description: "MIDWAY",
        quantity: 8,
      },
      {
        description: "CHOIS",
        quantity: 3,
      },
      {
        description: "MINK HAIR",
        quantity: 9,
      },
      {
        description: "HAIR ZONE",
        quantity: 6,
      },
      {
        description: "NEED PAYEE",
        quantity: 18,
      },
      {
        description: "PRIME TRADING INTERNATIONAL",
        quantity: 1,
      },
      {
        description: "BEAUTY PLUS TRADING",
        quantity: 7,
      },
      {
        description: "NEW JIGU TRADING CORP",
        quantity: 3,
      },
      {
        description: "RECLASS ACCTS",
        quantity: 1,
      },
      {
        description: "TO RECORD PER CLIENT",
        quantity: 2,
      },
      {
        description: "CHADE FASHIONS",
        quantity: 2,
      },
      {
        description: "IVY",
        quantity: 7,
      },
      {
        description: "CARD #1187",
        quantity: 5,
      },
      {
        description: "MARPEX INC.",
        quantity: 6,
      },
      {
        description: "R&B COLLECTION",
        quantity: 1,
      },
      {
        description: "ROCKEY TRADING",
        quantity: 2,
      },
      {
        description: "C AND L",
        quantity: 1,
      },
      {
        description: "BLACK CALA",
        quantity: 2,
      },
      {
        description: "CLEARED CHECKS #3841",
        quantity: 30,
      },
      {
        description: "TO REC PER CLIENT",
        quantity: 1,
      },
      {
        description: "R & B COLLECTION",
        quantity: 1,
      },
      {
        description: "MODEL MODEL",
        quantity: 1,
      },
      {
        description: "TO REC ACCOUNTS PER CLIENT",
        quantity: 2,
      },
      {
        description: "XUCHANG HAIR LLC",
        quantity: 1,
      },
      {
        description: "XUCHANG HAIR",
        quantity: 6,
      },
      {
        description: "JK TRADING",
        quantity: 1,
      },
      {
        description: "IVY ENTERPRISES",
        quantity: 3,
      },
    ],
  },
  {
    name: "ADVERTISING",
    number: "4311",
    entries: [
      {
        description: "SPOTON",
        quantity: 7,
      },
      {
        description: "TO RECORD PER CLIENT",
        quantity: 2,
      },
      {
        description: "TO REC PER CLIENT",
        quantity: 1,
      },
      {
        description: "TO REC ACCOUNTS PER CLIENT",
        quantity: 1,
      },
    ],
  },
  {
    name: "AMORTIZATION",
    number: "4321",
    entries: [],
  },
  {
    name: "BAD DEBTS",
    number: "4331",
    entries: [],
  },
  {
    name: "BANK CHARGES",
    number: "4341",
    entries: [
      {
        description: "SERVICE FEE",
        quantity: 3,
      },
      {
        description: "TO RECORD DEBITS #8272",
        quantity: 4,
      },
      {
        description: "TO RECORD DEBITS #3841",
        quantity: 1,
      },
      {
        description: "SERVICE FEES",
        quantity: 1,
      },
    ],
  },
  {
    name: "AUTOMOBILE EXPENSE",
    number: "4351",
    entries: [],
  },
  {
    name: "DUES & PUBLICATIONS",
    number: "4411",
    entries: [],
  },
  {
    name: "INSURANCE",
    number: "4441",
    entries: [
      {
        description: "ADP PAY-BY-PAY",
        quantity: 35,
      },
      {
        description: "ADP PAY-BYPAY",
        quantity: 1,
      },
      {
        description: "ADP PAY BY PAY",
        quantity: 69,
      },
      {
        description: "TO RECORD PER CLIENT",
        quantity: 1,
      },
      {
        description: "HARTFORD INSURANCE",
        quantity: 1,
      },
      {
        description: "INSURANCE MEDICS",
        quantity: 2,
      },
      {
        description: "TO RECLASS WORKER'S COMP",
        quantity: 1,
      },
      {
        description: "THE HARTFORD",
        quantity: 2,
      },
    ],
  },
  {
    name: "INSURANCE - WORKER'S COMP",
    number: "4442",
    entries: [
      {
        description: "ADP PAY BY PAY",
        quantity: 118,
      },
      {
        description: "TO RECLASS WORKER'S COMP",
        quantity: 1,
      },
      {
        description: "ADL PAY BY PAY",
        quantity: 1,
      },
      {
        description: "ASP PAY BY PAY",
        quantity: 1,
      },
      {
        description: "ADP PAY BYPAY",
        quantity: 1,
      },
      {
        description: "AD PAY BY PAY",
        quantity: 1,
      },
      {
        description: "PAY BY PAY",
        quantity: 20,
      },
    ],
  },
  {
    name: "ALARM/PATROL",
    number: "4447",
    entries: [
      {
        description: "PROTECTION ONE",
        quantity: 6,
      },
      {
        description: "BROWARD SHERIFF",
        quantity: 1,
      },
    ],
  },
  {
    name: "INTEREST",
    number: "4451",
    entries: [],
  },
  {
    name: "LEGAL & PROF. FEES",
    number: "4471",
    entries: [
      {
        description: "WOLFSON",
        quantity: 53,
      },
      {
        description: "WOLFSON CPA",
        quantity: 5,
      },
      {
        description: "TO RECORD PER CLIENT",
        quantity: 1,
      },
    ],
  },
  {
    name: "OFFICE EXPENSE",
    number: "4511",
    entries: [
      {
        description: "CHECK ORDER",
        quantity: 1,
      },
      {
        description: "CHECK ORDER FEE",
        quantity: 1,
      },
    ],
  },
  {
    name: "PAYROLL PROCESSING FEES",
    number: "4530",
    entries: [
      {
        description: "ADP FEE",
        quantity: 133,
      },
      {
        description: "ADP FEES",
        quantity: 45,
      },
      {
        description: "ADP PAYROLL FEES",
        quantity: 44,
      },
    ],
  },
  {
    name: "POSTAGE",
    number: "4531",
    entries: [],
  },
  {
    name: "RENT - BUILDING",
    number: "4541",
    entries: [
      {
        description: "BROWARD COUNTY TAX COLLECTOR",
        quantity: 1,
      },
      {
        description: "TO RECORD PER CLIENT",
        quantity: 2,
      },
      {
        description: "TO REC PER CLIENT",
        quantity: 1,
      },
      {
        description: "TO REC ACCOUNTS PER CLIENT",
        quantity: 1,
      },
      {
        description: "RENT - OTHER",
        quantity: 1,
      },
    ],
  },
  {
    name: "RENT - EQUIPMENT",
    number: "4542",
    entries: [
      {
        description: "RENT - OTHER",
        quantity: 1,
      },
    ],
  },
  {
    name: "MAINTENANCE - BUILDING",
    number: "4551",
    entries: [],
  },
  {
    name: "MAINTENANCE - EQUIPMENT",
    number: "4552",
    entries: [],
  },
  {
    name: "TAXES - GENERAL",
    number: "4571",
    entries: [],
  },
  {
    name: "LICENSE & FEES",
    number: "4572",
    entries: [],
  },
  {
    name: "TAXES - PERSONAL PROPERTY",
    number: "4573",
    entries: [
      {
        description: "BROWARD COUNTY TAX",
        quantity: 1,
      },
    ],
  },
  {
    name: "TAXES- REAL ESTATE",
    number: "4574",
    entries: [],
  },
  {
    name: "TAXES - PAYROLL",
    number: "4610",
    entries: [],
  },
  {
    name: "FICA",
    number: "4611",
    entries: [
      {
        description: "PAYROLL REC",
        quantity: 11,
      },
    ],
  },
  {
    name: "FUTA",
    number: "4612",
    entries: [
      {
        description: "PAYROLL REC",
        quantity: 11,
      },
    ],
  },
  {
    name: "SUTA",
    number: "4613",
    entries: [
      {
        description: "PAYROLL REC",
        quantity: 11,
      },
    ],
  },
  {
    name: "TELEPHONE",
    number: "4641",
    entries: [
      {
        description: "TO RECORD PER CLIENT",
        quantity: 1,
      },
    ],
  },
  {
    name: "TRAVEL",
    number: "4651",
    entries: [],
  },
  {
    name: "MEALS & ENTERTAINMENT",
    number: "4653",
    entries: [],
  },
  {
    name: "ELECTRIC",
    number: "4661",
    entries: [
      {
        description: "FPL",
        quantity: 25,
      },
      {
        description: "TO RECORD PER CLIENT",
        quantity: 1,
      },
    ],
  },
  {
    name: "GAS",
    number: "4662",
    entries: [],
  },
  {
    name: "WATER",
    number: "4663",
    entries: [
      {
        description: "CITY OF FT LAUDERDALE",
        quantity: 8,
      },
    ],
  },
  {
    name: "CABLE",
    number: "4665",
    entries: [
      {
        description: "COMCAST",
        quantity: 46,
      },
      {
        description: "COMAST",
        quantity: 1,
      },
    ],
  },
  {
    name: "SALARIES & WAGES",
    number: "4671",
    entries: [
      {
        description: "ADP WAGE",
        quantity: 172,
      },
      {
        description: "ADP TAX",
        quantity: 252,
      },
      {
        description: "ADP WGAE",
        quantity: 1,
      },
      {
        description: "PAYROLL CHECKS",
        quantity: 7,
      },
      {
        description: "PAYROLL-NEED PAYEE",
        quantity: 12,
      },
      {
        description: "CLEARED CHECKS",
        quantity: 1,
      },
      {
        description: "PAYROLL REC",
        quantity: 11,
      },
      {
        description: "ADP WAGE PAY",
        quantity: 43,
      },
      {
        description: "ADP PAY BY PAY",
        quantity: 1,
      },
      {
        description: "ADP WAG",
        quantity: 1,
      },
      {
        description: "APD TAX",
        quantity: 1,
      },
    ],
  },
  {
    name: "SALARIES & WAGES - OFFICERS",
    number: "4672",
    entries: [
      {
        description: "PAYROLL REC",
        quantity: 11,
      },
    ],
  },
  {
    name: "INTEREST INCOME",
    number: "4701",
    entries: [],
  },
  {
    name: "DEPRECIATION - SEC 179",
    number: "4770",
    entries: [],
  },
  {
    name: "DEPRECIATION - REG",
    number: "4771",
    entries: [],
  },
  {
    name: "CREDIT CARD COSTS",
    number: "4791",
    entries: [
      {
        description: "BANKCARD",
        quantity: 31,
      },
      {
        description: "BANKCARD FEES",
        quantity: 10,
      },
      {
        description: "BANK CARD",
        quantity: 4,
      },
    ],
  },
  {
    name: "PENALTIES",
    number: "4792",
    entries: [],
  },
  {
    name: "DONATIONS",
    number: "4793",
    entries: [],
  },
];

export default accounts;
