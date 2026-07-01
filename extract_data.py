import re
import json
import os
from html.parser import HTMLParser

class KhataHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h2 = False
        self.in_tbody = False
        self.in_tr = False
        self.in_td = False
        
        self.current_name = None
        self.current_row = []
        self.current_cell = ""
        
        self.ledgers = {}

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'h2' and attrs_dict.get('class') == 'khata-title':
            self.in_h2 = True
            self.current_name = ""
        elif tag == 'tbody':
            self.in_tbody = True
        elif tag == 'tr' and self.in_tbody:
            self.in_tr = True
            self.current_row = []
        elif tag == 'td' and self.in_tr:
            self.in_td = True
            self.current_cell = ""
        elif tag == 'span' and self.in_td:
            pass # ignore, just keep reading text

    def handle_endtag(self, tag):
        if tag == 'h2' and self.in_h2:
            self.in_h2 = False
            name_clean = self.current_name.replace('کا کھاتہ', '').strip()
            self.current_name = name_clean
            if self.current_name not in self.ledgers:
                self.ledgers[self.current_name] = []
        elif tag == 'td' and self.in_tr:
            self.in_td = False
            self.current_row.append(self.current_cell.strip())
        elif tag == 'tr' and self.in_tbody:
            self.in_tr = False
            if self.current_row and self.current_name:
                self.ledgers[self.current_name].append(self.current_row)
        elif tag == 'tbody':
            self.in_tbody = False

    def handle_data(self, data):
        if self.in_h2:
            self.current_name += data
        elif self.in_td:
            self.current_cell += data

def main():
    with open('HafizKhata.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    parser = KhataHTMLParser()
    parser.feed(html)
    
    # Map urdu names to IDs
    name_map = {
        "غلام اصغر": "ghulam_asghar",
        "غلام اکبر": "ghulam_akbar",
        "عابد حسین": "abid_hussain",
        "خادم حسین": "khadim_hussain",
        "غلام فاروق": "ghulam_farooq",
        "عبدالقیوم": "abdul_qayyum",
        "صفدر علی": "safdar_ali",
        "امجد علی": "amjad_ali",
        "شاہد علی": "shahid_ali",
        "سکینہ بی بی فیملی": "sakina",
        "سکینہ بی بی": "sakina",
        "کلثوم بی بی": "kalsoom",
        "والدہ محترمہ": "mother",
        "حاجی غلام سرور": "father",
        "منیر احمد کزن": "cousin"
    }

    os.makedirs('data/ledgers', exist_ok=True)

    for urdu_name, rows in parser.ledgers.items():
        matched_id = None
        for k, v in name_map.items():
            if k in urdu_name:
                matched_id = v
                break
        
        if not matched_id:
            print(f"Unmapped name: {urdu_name}")
            continue
            
        entries = []
        for row in rows:
            # Skip divider rows (like --- صفحہ نمبر ---)
            if len(row) == 1 and 'صفحہ' in row[0]:
                continue
            # If the row has data columns
            if len(row) >= 5:
                # Row format usually: Date, Desc, Page, Debit(Rent/Given), Credit(Received), ...
                # Let's map it based on standard columns from HTML
                # 0: Date, 1: Desc, 2: Page, 3: Rent Due/Given, 4: Received, 5: Nam, 6: Balance, 7: Expected
                # We want standard format
                entry = {
                    "date": row[0],
                    "description": row[1],
                    "page": row[2] if len(row) > 2 else "",
                    "debit": row[3] if len(row) > 3 else "",
                    "credit": row[4] if len(row) > 4 else "",
                    "balance": row[6] if len(row) > 6 else ""
                }
                entries.append(entry)

        filepath = f"data/ledgers/{matched_id}.json"
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(entries, f, ensure_ascii=False, indent=2)
        print(f"Exported {len(entries)} rows for {matched_id}")

if __name__ == '__main__':
    main()
