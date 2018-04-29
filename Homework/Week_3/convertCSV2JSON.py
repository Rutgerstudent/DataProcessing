# Rutger van Heijningen
# 10272224
# Data Processing, Week 3
# convertCSV2JSON.py

import csv
import json

# File locations
csv_file = open('/Users/Rutger/Desktop/DataProcessing/Homework/Week_3/huurverhoging.csv', 'r')
json_file = open('/Users/Rutger/Desktop/DataProcessing/Homework/Week_3/huurverhoging.json', 'w')

# Write JSON file
for row in csv.DictReader(csv_file):
    json.dump(row, json_file)
    json_file.write('\n')
