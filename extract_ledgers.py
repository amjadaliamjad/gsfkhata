import json
import re
from html.parser import HTMLParser

class KhataParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_tbody = False
        self.in_tr = False
        self.in_td = False
        self.current_table_id = None
        self.current_row = []
        self.current_cell = ""
        self.tables = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "table" and "id" in attrs:
            self.current_table_id = attrs["id"]
            self.tables[self.current_table_id] = []
        elif tag == "tbody" and self.current_table_id:
            self.in_tbody = True
        elif tag == "tr" and self.in_tbody:
            self.in_tr = True
            self.current_row = []
        elif tag == "td" and self.in_tr:
            self.in_td = True
            self.current_cell = ""

    def handle_endtag(self, tag):
        if tag == "td" and self.in_tr:
            self.in_td = False
            self.current_row.append(self.current_cell.strip())
        elif tag == "tr" and self.in_tbody:
            self.in_tr = False
            if self.current_row:
                self.tables[self.current_table_id].append(self.current_row)
        elif tag == "tbody":
            self.in_tbody = False
        elif tag == "table":
            self.current_table_id = None

    def handle_data(self, data):
        if self.in_td:
            self.current_cell += data

def main():
    with open('HafizKhata.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    parser = KhataParser()
    parser.feed(html)
    
    import os
    os.makedirs('data/ledgers', exist_ok=True)
    
    for table_id, rows in parser.tables.items():
        if table_id.startswith('khata-'):
            entries = []
            for row in rows:
                if len(row) >= 7:
                    entries.append({
                        "date": row[0],
                        "description": row[1],
                        "rentDue": row[2],
                        "debit": row[3],
                        "credit": row[4],
                        "page": row[5],
                        "balance": row[6],
                        "calculatedBalance": row[7] if len(row) > 7 else row[6],
                        "note": row[8] if len(row) > 8 else ""
                    })
            
            # Map the IDs to our config IDs if needed, but for now just save as table_id.json
            if entries:
                filename = table_id.replace('-', '_') + ".json"
                with open(f"data/ledgers/{filename}", "w", encoding='utf-8') as f:
                    json.dump(entries, f, ensure_ascii=False, indent=2)
                print(f"Exported {filename}")

if __name__ == '__main__':
    main()
