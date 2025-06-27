import csv
import re

# Read population data
pop = {}
with open('world_population_2024.csv') as f:
    r = csv.reader(f)
    next(r)
    for row in r:
        if row[2] == '2023':
            pop[row[0].strip('"')] = int(row[3])

# Read GDP data
# Skip metadata and header rows
with open('worldbank_gdp_data/API_NY.GDP.MKTP.CD_DS2_en_csv_v2_75934.csv') as f:
    r = csv.reader(f)
    for _ in range(5):
        next(r)
    header = next(r)
    idx = header.index('2023')
    gdp = {}
    for row in r:
        try:
            gdp[row[0].strip('"')] = float(row[idx]) if row[idx] else 0
        except Exception:
            gdp[row[0].strip('"')] = 0

# Update JS file
with open('countryInfo.js') as f:
    js = f.read()

def repl(m):
    name = m.group(1)
    p = pop.get(name, 0)
    g = gdp.get(name, 0)
    return f"'{name}': {{\n    capital: '{m.group(2)}',\n    population: {p},\n    gdp: {g},"

newjs = re.sub(r"'([^']+)': \{\s+capital: '([^']+)',\s+population: 0,\s+gdp: 0,", repl, js)

with open('countryInfo.js', 'w') as f:
    f.write(newjs) 