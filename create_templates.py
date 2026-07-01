import json
import os

brothers = [
    "ghulam_asghar",
    "ghulam_akbar",
    "abid_hussain",
    "khadim_hussain",
    "ghulam_farooq",
    "abdul_qayyum",
    "safdar_ali",
    "amjad_ali",
    "shahid_ali",
    "sakina",
    "kalsoom",
    "mother"
]

template = [
  {
    "date": "01/01/2017",
    "description": "Example Entry / مثال",
    "rentDue": "",
    "debit": "0",
    "credit": "0",
    "page": "1",
    "balance": "0",
    "calculatedBalance": "0",
    "note": ""
  }
]

os.makedirs('data/ledgers', exist_ok=True)

for b in brothers:
    filepath = f'data/ledgers/{b}.json'
    if not os.path.exists(filepath):
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(template, f, ensure_ascii=False, indent=2)
    print(f"Created {filepath}")
