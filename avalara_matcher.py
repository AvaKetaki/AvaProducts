import argparse
from typing import List, Dict

# Sample product database
products = [
    {
        "name": "AvaTax",
        "use_cases": ["real-time tax calculation", "sales tax", "VAT", "digital goods", "US", "EU", "garments"]
    },
    {
        "name": "Returns & Reporting",
        "use_cases": ["tax filing", "returns", "US"]
    },
    {
        "name": "VAT Returns & Reporting",
        "use_cases": ["VAT", "EU", "returns", "filing"]
    },
    {
        "name": "VAT Registrations",
        "use_cases": ["VAT", "registration", "EU"]
    },
    {
        "name": "E-Invoicing & Live Reporting",
        "use_cases": ["e-invoicing", "EU"]
    },
    {
        "name": "CertCapture",
        "use_cases": ["exemption certificates", "US", "resellers"]
    },
    {
        "name": "Cross-Border",
        "use_cases": ["customs", "duties", "international", "digital goods", "garments", "India", "US"]
    },
    {
        "name": "Item Classification",
        "use_cases": ["classification", "digital goods", "HS code", "US", "EU", "garments"]
    }
]

def ask_clarifying_questions(requirement: str) -> List[str]:
    questions = []
    if "b2b" not in requirement.lower() and "b2c" not in requirement.lower():
        questions.append("Are your customers primarily businesses (B2B) or consumers (B2C)?")
    if "digital" not in requirement.lower() and "garments" not in requirement.lower():
        questions.append("What type of goods or services do you sell?")
    if "india" not in requirement.lower() and "us" not in requirement.lower():
        questions.append("Where is your business based and where are your customers located?")
    return questions

def match_products(requirement: str) -> List[Dict]:
    tokens = requirement.lower().split()
    matched = []
    for product in products:
        if any(token in use_case.lower() for token in tokens for use_case in product['use_cases']):
            matched.append(product)
    return matched

def main():
    parser = argparse.ArgumentParser(description="Avalara Product Matcher CLI")
    parser.add_argument("requirement", type=str, help="Your business requirement (in quotes)")
    args = parser.parse_args()

    questions = ask_clarifying_questions(args.requirement)
    if questions:
        print("Before matching, please clarify:")
        for q in questions:
            print(f"- {q}")
    else:
        matches = match_products(args.requirement)
        if matches:
            print("Suggested Avalara Products:")
            for product in matches:
                print(f"- {product['name']}")
        else:
            print("No matching products found. Try rephrasing your requirement.")

if __name__ == "__main__":
    main()
