const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const fetch = require('node-fetch');

// Import routes
const authRoutes = require('./routes/auth');
const gamesRoutes = require('./routes/games');
const badgesRoutes = require('./routes/badges');

// Import the official countries list
const officialCountries = [
  "India","China","United States of America","Indonesia","Pakistan","Nigeria","Brazil","Bangladesh","Russia","Ethiopia","Mexico","Japan","Egypt","Kosovo","Philippines","Democratic Republic of the Congo","Vietnam","Iran","Turkey","Germany","Thailand","United Republic of Tanzania","United Kingdom","France","South Africa","Italy","Kenya","Myanmar","Colombia","South Korea","Sudan","Uganda","Spain","Algeria","Iraq","Argentina","Afghanistan","Yemen","Canada","Angola","Ukraine","Morocco","Poland","Uzbekistan","Malaysia","Mozambique","Ghana","Peru","Saudi Arabia","Madagascar","Ivory Coast","Cameroon","Nepal","Venezuela","Niger","Australia","North Korea","Syria","Mali","Burkina Faso","Sri Lanka","Malawi","Zambia","Chad","Kazakhstan","Chile","Somalia","Senegal","Romania","Guatemala","Netherlands","Ecuador","Cambodia","Zimbabwe","Guinea","Benin","Rwanda","Burundi","Bolivia","Tunisia","South Sudan","Haiti","Belgium","Jordan","Dominican Republic","United Arab Emirates","Honduras","Cuba","Tajikistan","Papua New Guinea","Sweden","Czechia","Portugal","Azerbaijan","Greece","Togo","Hungary","Israel","Austria","Belarus","Switzerland","Sierra Leone","Laos","Turkmenistan","Libya","Kyrgyzstan","Paraguay","Nicaragua","Bulgaria","Republic of Serbia","Republic of the Congo","El Salvador","Denmark","Singapore","Lebanon","Liberia","Finland","Norway","Palestine","Central African Republic","Oman","Slovakia","Mauritania","Ireland","New Zealand","Costa Rica","Kuwait","Panama","Croatia","Georgia","Eritrea","Mongolia","Uruguay","Bosnia and Herzegovina","Qatar","Namibia","Moldova","Armenia","Jamaica","Lithuania","Gambia","Albania","Gabon","Botswana","Lesotho","Guinea-Bissau","Slovenia","Equatorial Guinea","Latvia","North Macedonia","Bahrain","Trinidad and Tobago","East Timor","Cyprus","Estonia","Mauritius","eSwatini","Djibouti","Fiji","Comoros","Solomon Islands","Guyana","Bhutan","Luxembourg","Suriname","Montenegro","Malta","Maldives","Cabo Verde","Brunei","Belize","Bahamas, The","Iceland","Vanuatu","Barbados","Sao Tome and Principe","Samoa","St. Lucia","Kiribati","Seychelles","Grenada","Micronesia, Fed. Sts.","Tonga","St. Vincent and the Grenadines","Antigua and Barbuda","Andorra","Dominica","Saint Kitts and Nevis","Liechtenstein","Monaco","Marshall Islands","San Marino","Palau","Nauru","Tuvalu","Vatican City"
];

// Country info for population and capital data
const countryInfo = {
  'United States of America': { capital: 'Washington D.C.', population: 343_477_000 },
  'China': { capital: 'Beijing', population: 1_425_180_000 },
  'India': { capital: 'New Delhi', population: 1_425_423_000 },
  'Indonesia': { capital: 'Jakarta', population: 276_361_000 },
  'Pakistan': { capital: 'Islamabad', population: 241_500_000 },
  'Nigeria': { capital: 'Abuja', population: 236_747_000 },
  'Brazil': { capital: 'Brasilia', population: 203_262_000 },
  'Bangladesh': { capital: 'Dhaka', population: 171_467_000 },
  'Russia': { capital: 'Moscow', population: 145_034_000 },
  'Ethiopia': { capital: 'Addis Ababa', population: 123_379_000 },
  'Mexico': { capital: 'Mexico City', population: 129_740_000 },
  'Japan': { capital: 'Tokyo', population: 125_584_000 },
  'Egypt': { capital: 'Cairo', population: 110_990_000 },
  'Philippines': { capital: 'Manila', population: 113_524_000 },
  'Democratic Republic of the Congo': { capital: 'Kinshasa', population: 108_396_000 },
  'Vietnam': { capital: 'Hanoi', population: 98_858_000 },
  'Iran': { capital: 'Tehran', population: 88_289_000 },
  'Turkey': { capital: 'Ankara', population: 86_277_000 },
  'Germany': { capital: 'Berlin', population: 83_238_000 },
  'Thailand': { capital: 'Bangkok', population: 71_887_000 },
  'United Republic of Tanzania': { capital: 'Dodoma', population: 64_700_000 },
  'United Kingdom': { capital: 'London', population: 67_508_000 },
  'France': { capital: 'Paris', population: 65_707_000 },
  'South Africa': { capital: 'Pretoria', population: 60_415_000 },
  'Italy': { capital: 'Rome', population: 58_983_000 },
  'Kenya': { capital: 'Nairobi', population: 54_027_000 },
  'Myanmar': { capital: 'Naypyidaw', population: 54_797_000 },
  'Colombia': { capital: 'Bogota', population: 51_069_000 },
  'South Korea': { capital: 'Seoul', population: 51_925_000 },
  'Sudan': { capital: 'Khartoum', population: 49_390_000 },
  'Uganda': { capital: 'Kampala', population: 49_123_000 },
  'Spain': { capital: 'Madrid', population: 47_581_000 },
  'Algeria': { capital: 'Algiers', population: 44_178_000 },
  'Iraq': { capital: 'Baghdad', population: 43_533_000 },
  'Argentina': { capital: 'Buenos Aires', population: 46_175_000 },
  'Afghanistan': { capital: 'Kabul', population: 41_315_000 },
  'Yemen': { capital: 'Sanaa', population: 34_449_000 },
  'Canada': { capital: 'Ottawa', population: 39_087_000 },
  'Angola': { capital: 'Luanda', population: 36_698_000 },
  'Ukraine': { capital: 'Kiev', population: 36_159_000 },
  'Morocco': { capital: 'Rabat', population: 38_162_000 },
  'Poland': { capital: 'Warsaw', population: 37_651_000 },
  'Uzbekistan': { capital: 'Tashkent', population: 35_648_000 },
  'Malaysia': { capital: 'Kuala Lumpur', population: 33_871_000 },
  'Mozambique': { capital: 'Maputo', population: 33_899_000 },
  'Ghana': { capital: 'Accra', population: 34_169_000 },
  'Peru': { capital: 'Lima', population: 34_482_000 },
  'Saudi Arabia': { capital: 'Riyadh', population: 36_017_000 },
  'Madagascar': { capital: 'Antananarivo', population: 29_719_000 },
  'Ivory Coast': { capital: 'Yamoussoukro', population: 29_017_000 },
  'Cameroon': { capital: 'Yaounde', population: 28_060_000 },
  'Nepal': { capital: 'Kathmandu', population: 30_035_000 },
  'Venezuela': { capital: 'Caracas', population: 28_436_000 },
  'Niger': { capital: 'Niamey', population: 28_950_000 },
  'Australia': { capital: 'Canberra', population: 27_232_000 },
  'North Korea': { capital: 'Pyongyang', population: 26_043_000 },
  'Syria': { capital: 'Damascus', population: 23_204_000 },
  'Mali': { capital: 'Bamako', population: 20_250_000 },
  'Burkina Faso': { capital: 'Ouagadougou', population: 22_102_000 },
  'Sri Lanka': { capital: 'Colombo', population: 21_456_000 },
  'Malawi': { capital: 'Lilongwe', population: 20_675_000 },
  'Zambia': { capital: 'Lusaka', population: 20_017_000 },
  'Chad': { capital: 'NDjamena', population: 18_264_000 },
  'Kazakhstan': { capital: 'Astana', population: 19_542_000 },
  'Chile': { capital: 'Santiago', population: 19_725_000 },
  'Somalia': { capital: 'Mogadishu', population: 18_476_000 },
  'Senegal': { capital: 'Dakar', population: 18_901_000 },
  'Romania': { capital: 'Bucharest', population: 19_121_000 },
  'Guatemala': { capital: 'Guatemala City', population: 17_633_000 },
  'Netherlands': { capital: 'Amsterdam', population: 17_757_000 },
  'Ecuador': { capital: 'Quito', population: 18_057_000 },
  'Cambodia': { capital: 'Phnom Penh', population: 17_170_000 },
  'Zimbabwe': { capital: 'Harare', population: 16_665_000 },
  'Guinea': { capital: 'Conakry', population: 14_764_000 },
  'Benin': { capital: 'Porto-Novo', population: 13_411_000 },
  'Rwanda': { capital: 'Kigali', population: 13_033_000 },
  'Burundi': { capital: 'Bujumbura', population: 13_398_000 },
  'Bolivia': { capital: 'La Paz', population: 12_055_000 },
  'Tunisia': { capital: 'Tunis', population: 12_103_000 },
  'South Sudan': { capital: 'Juba', population: 11_709_000 },
  'Haiti': { capital: 'Port-au-Prince', population: 11_825_000 },
  'Belgium': { capital: 'Brussels', population: 11_716_000 },
  'Jordan': { capital: 'Amman', population: 11_235_000 },
  'Dominican Republic': { capital: 'Santo Domingo', population: 11_377_000 },
  'United Arab Emirates': { capital: 'Abu Dhabi', population: 9_993_000 },
  'Honduras': { capital: 'Tegucigalpa', population: 10_178_000 },
  'Cuba': { capital: 'Havana', population: 11_234_000 },
  'Tajikistan': { capital: 'Dushanbe', population: 10_678_000 },
  'Papua New Guinea': { capital: 'Port Moresby', population: 9_397_000 },
  'Sweden': { capital: 'Stockholm', population: 10_502_000 },
  'Czechia': { capital: 'Prague', population: 10_594_000 },
  'Portugal': { capital: 'Lisbon', population: 10_298_000 },
  'Azerbaijan': { capital: 'Baku', population: 10_348_000 },
  'Greece': { capital: 'Athens', population: 10_432_000 },
  'Togo': { capital: 'Lome', population: 8_798_000 },
  'Hungary': { capital: 'Budapest', population: 9_605_000 },
  'Israel': { capital: 'Tel Aviv', population: 9_523_000 },
  'Austria': { capital: 'Vienna', population: 9_089_000 },
  'Belarus': { capital: 'Minsk', population: 9_237_000 },
  'Switzerland': { capital: 'Bern', population: 8_822_000 },
  'Sierra Leone': { capital: 'Freetown', population: 8_308_000 },
  'Laos': { capital: 'Vientiane', population: 7_633_000 },
  'Turkmenistan': { capital: 'Ashgabat', population: 7_145_000 },
  'Libya': { capital: 'Tripoli', population: 7_352_000 },
  'Kyrgyzstan': { capital: 'Bishkek', population: 7_059_000 },
  'Paraguay': { capital: 'Asuncion', population: 7_456_000 },
  'Nicaragua': { capital: 'Managua', population: 7_198_000 },
  'Bulgaria': { capital: 'Sofia', population: 6_886_000 },
  'Republic of Serbia': { capital: 'Belgrade', population: 6_642_000 },
  'Republic of the Congo': { capital: 'Brazzaville', population: 5_821_000 },
  'El Salvador': { capital: 'San Salvador', population: 6_519_000 },
  'Denmark': { capital: 'Copenhagen', population: 5_920_000 },
  'Singapore': { capital: 'Singapore', population: 5_703_000 },
  'Lebanon': { capital: 'Beirut', population: 6_089_000 },
  'Liberia': { capital: 'Monrovia', population: 5_343_000 },
  'Finland': { capital: 'Helsinki', population: 5_571_000 },
  'Norway': { capital: 'Oslo', population: 5_499_000 },
  'Palestine': { capital: 'Jerusalem', population: 5_357_000 },
  'Central African Republic': { capital: 'Bangui', population: 5_683_000 },
  'Oman': { capital: 'Muscat', population: 5_628_000 },
  'Slovakia': { capital: 'Bratislava', population: 5_466_000 },
  'Mauritania': { capital: 'Nouakchott', population: 5_428_000 },
  'Ireland': { capital: 'Dublin', population: 5_253_000 },
  'New Zealand': { capital: 'Wellington', population: 5_124_000 },
  'Costa Rica': { capital: 'San Jose', population: 5_274_000 },
  'Kuwait': { capital: 'Kuwait City', population: 4_415_000 },
  'Panama': { capital: 'Panama City', population: 4_385_000 },
  'Croatia': { capital: 'Zagreb', population: 3_865_000 },
  'Georgia': { capital: 'Tbilisi', population: 3_728_000 },
  'Eritrea': { capital: 'Asmara', population: 3_669_000 },
  'Mongolia': { capital: 'Ulaanbaatar', population: 3_442_000 },
  'Uruguay': { capital: 'Montevideo', population: 3_517_000 },
  'Bosnia and Herzegovina': { capital: 'Sarajevo', population: 3_263_000 },
  'Qatar': { capital: 'Doha', population: 2_877_000 },
  'Namibia': { capital: 'Windhoek', population: 2_679_000 },
  'Moldova': { capital: 'Chisinau', population: 2_603_000 },
  'Armenia': { capital: 'Yerevan', population: 2_793_000 },
  'Jamaica': { capital: 'Kingston', population: 2_732_000 },
  'Lithuania': { capital: 'Vilnius', population: 2_801_000 },
  'Gambia': { capital: 'Banjul', population: 2_731_000 },
  'Albania': { capital: 'Tirane', population: 2_793_000 },
  'Gabon': { capital: 'Libreville', population: 2_433_000 },
  'Botswana': { capital: 'Gaborone', population: 2_643_000 },
  'Lesotho': { capital: 'Maseru', population: 2_204_000 },
  'Guinea-Bissau': { capital: 'Bissau', population: 2_047_000 },
  'Slovenia': { capital: 'Ljubljana', population: 2_108_000 },
  'Equatorial Guinea': { capital: 'Malabo', population: 1_632_000 },
  'Latvia': { capital: 'Riga', population: 1_826_000 },
  'North Macedonia': { capital: 'Skopje', population: 2_068_000 },
  'Bahrain': { capital: 'Manama', population: 1_772_000 },
  'Trinidad and Tobago': { capital: 'Port-of-Spain', population: 1_410_000 },
  'East Timor': { capital: 'Dili', population: 1_371_000 },
  'Cyprus': { capital: 'Nicosia', population: 945_000 },
  'Estonia': { capital: 'Tallinn', population: 1_326_000 },
  'Mauritius': { capital: 'Port Louis', population: 1_323_000 },
  'eSwatini': { capital: 'Mbabane', population: 1_187_000 },
  'Djibouti': { capital: 'Djibouti', population: 1_079_000 },
  'Fiji': { capital: 'Suva', population: 923_000 },
  'Comoros': { capital: 'Moroni', population: 931_000 },
  'Solomon Islands': { capital: 'Honiara', population: 768_000 },
  'Guyana': { capital: 'Georgetown', population: 822_000 },
  'Bhutan': { capital: 'Thimphu', population: 773_000 },
  'Luxembourg': { capital: 'Luxembourg', population: 645_000 },
  'Suriname': { capital: 'Paramaribo', population: 609_000 },
  'Montenegro': { capital: 'Podgorica', population: 601_000 },
  'Malta': { capital: 'Valletta', population: 518_000 },
  'Maldives': { capital: 'Male', population: 551_000 },
  'Cabo Verde': { capital: 'Praia', population: 608_000 },
  'Brunei': { capital: 'Bandar Seri Begawan', population: 453_000 },
  'Belize': { capital: 'Belmopan', population: 419_000 },
  'Bahamas, The': { capital: 'Nassau', population: 420_000 },
  'Iceland': { capital: 'Reykjavik', population: 396_000 },
  'Vanuatu': { capital: 'Port Vila', population: 334_000 },
  'Barbados': { capital: 'Bridgetown', population: 293_000 },
  'Sao Tome and Principe': { capital: 'Sao Tome', population: 226_000 },
  'Samoa': { capital: 'Apia', population: 225_000 },
  'St. Lucia': { capital: 'Castries', population: 190_000 },
  'Kiribati': { capital: 'Tarawa', population: 137_000 },
  'Seychelles': { capital: 'Victoria', population: 101_000 },
  'Grenada': { capital: 'Saint Georges', population: 124_000 },
  'Micronesia, Fed. Sts.': { capital: 'Palikir', population: 118_000 },
  'Tonga': { capital: 'Nukualofa', population: 108_000 },
  'St. Vincent and the Grenadines': { capital: 'Kingstown', population: 111_000 },
  'Antigua and Barbuda': { capital: 'Saint Johns', population: 102_000 },
  'Andorra': { capital: 'Andorra la Vella', population: 77_000 },
  'Dominica': { capital: 'Roseau', population: 73_000 },
  'Saint Kitts and Nevis': { capital: 'Basseterre', population: 55_000 },
  'Liechtenstein': { capital: 'Vaduz', population: 38_000 },
  'Monaco': { capital: 'Monaco', population: 39_000 },
  'Marshall Islands': { capital: 'Majuro', population: 61_000 },
  'San Marino': { capital: 'San Marino', population: 34_000 },
  'Palau': { capital: 'Koror', population: 18_000 },
  'Nauru': { capital: 'Yaren District', population: 12_000 },
  'Tuvalu': { capital: 'Funafuti', population: 12_000 },
  'Vatican City': { capital: 'Vatican City', population: 825 }
};

// Helper function to get country center coordinates
const getCountryCenter = (country) => {
  if (!country || !country.geometry) return { lat: 0, lon: 0 };
  
  const coordinates = country.geometry.coordinates;
  if (country.geometry.type === 'Polygon') {
    // Calculate centroid of polygon
    let sumLat = 0, sumLon = 0, count = 0;
    coordinates[0].forEach(coord => {
      sumLon += coord[0];
      sumLat += coord[1];
      count++;
    });
    return { lat: sumLat / count, lon: sumLon / count };
  } else if (country.geometry.type === 'MultiPolygon') {
    // Calculate centroid of first polygon
    let sumLat = 0, sumLon = 0, count = 0;
    coordinates[0][0].forEach(coord => {
      sumLon += coord[0];
      sumLat += coord[1];
      count++;
    });
    return { lat: sumLat / count, lon: sumLon / count };
  }
  return { lat: 0, lon: 0 };
};

// Function to categorize countries by difficulty
const getCountryDifficulty = (countryName) => {
  // Well-known countries (easy)
  const easyCountries = [
    'United States of America', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile',
    'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Portugal',
    'China', 'Japan', 'India', 'Australia', 'South Africa', 'Egypt',
    'Russia', 'Turkey', 'Iran', 'Saudi Arabia', 'Thailand', 'Vietnam'
  ];
  
  // Medium difficulty countries
  const mediumCountries = [
    'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Poland', 'Czechia',
    'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Ukraine', 'Belarus',
    'Pakistan', 'Bangladesh', 'Sri Lanka', 'Myanmar', 'Malaysia', 'Indonesia',
    'Philippines', 'New Zealand', 'Fiji', 'Papua New Guinea',
    'Nigeria', 'Kenya', 'Morocco', 'Algeria', 'Tunisia', 'Libya',
    'Sudan', 'Ethiopia', 'Somalia', 'Madagascar', 'Zimbabwe', 'Botswana',
    'Namibia', 'Mozambique', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi',
    'Colombia', 'Venezuela', 'Ecuador', 'Peru', 'Bolivia', 'Paraguay',
    'Uruguay', 'Guyana', 'Suriname',
    'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua',
    'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic'
  ];
  
  if (easyCountries.includes(countryName)) return 'easy';
  if (mediumCountries.includes(countryName)) return 'medium';
  return 'hard';
};

// Cache for countries data
let countriesData = null;

// Function to load countries data
const loadCountriesData = async () => {
  if (countriesData) return countriesData;
  
  try {
    const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    const data = await response.json();
    countriesData = data.features;
    return countriesData;
  } catch (error) {
    console.error('Error loading countries data:', error);
    return [];
  }
};

// Function to select random country using same logic as frontend
const selectRandomCountry = async () => {
  const countries = await loadCountriesData();
  
  // Filter out countries that are too small, have invalid coordinates, or aren't in the official 195 countries
  const validCountries = countries.filter(country => {
    try {
      const center = getCountryCenter(country);
      const hasValidCoordinates = center.lat !== 0 && center.lon !== 0;
      const isOfficialCountry = officialCountries.includes(country.properties.name);
      return hasValidCoordinates && isOfficialCountry;
    } catch (e) {
      return false;
    }
  });
  
  // Add slight bias toward easier countries (70% chance for easy/medium, 30% for hard)
  const random = Math.random();
  let filteredCountries = validCountries;
  
  if (random < 0.7) {
    // 70% chance: prefer easy and medium countries
    const easyMediumCountries = validCountries.filter(country => {
      const difficulty = getCountryDifficulty(country.properties.name);
      return difficulty === 'easy' || difficulty === 'medium';
    });
    
    if (easyMediumCountries.length > 0) {
      filteredCountries = easyMediumCountries;
      console.log('Using easy/medium bias - filtered to', filteredCountries.length, 'countries');
    }
  } else {
    // 30% chance: include all countries (including hard ones)
    console.log('Using full country pool - no difficulty bias');
  }
  
  // Use a more robust random selection
  const randomIndex = Math.floor(Math.random() * filteredCountries.length);
  const selectedCountry = filteredCountries[randomIndex];
  
  console.log(`Selected country: ${selectedCountry.properties.name}`);
  console.log(`Difficulty: ${getCountryDifficulty(selectedCountry.properties.name)}`);
  
  return selectedCountry;
};

// Simple flag game data - just country codes and names (only using flags that exist)
const flagGameData = {
  'us': 'United States',
  'gb': 'United Kingdom', 
  'fr': 'France',
  'de': 'Germany',
  'it': 'Italy',
  'es': 'Spain',
  'pt': 'Portugal',
  'nl': 'Netherlands',
  'be': 'Belgium',
  'ch': 'Switzerland',
  'at': 'Austria',
  'se': 'Sweden',
  'no': 'Norway',
  'dk': 'Denmark',
  'fi': 'Finland',
  'pl': 'Poland',
  'cz': 'Czech Republic',
  'hu': 'Hungary',
  'ro': 'Romania',
  'bg': 'Bulgaria',
  'gr': 'Greece',
  'tr': 'Turkey',
  'ru': 'Russia',
  'ua': 'Ukraine',
  'by': 'Belarus',
  'lt': 'Lithuania',
  'lv': 'Latvia',
  'ee': 'Estonia',
  'hr': 'Croatia',
  'si': 'Slovenia',
  'sk': 'Slovakia',
  'rs': 'Serbia',
  'ba': 'Bosnia and Herzegovina',
  'me': 'Montenegro',
  'mk': 'North Macedonia',
  'al': 'Albania',
  'cn': 'China',
  'jp': 'Japan',
  'kr': 'South Korea',
  'in': 'India',
  'pk': 'Pakistan',
  'bd': 'Bangladesh',
  'lk': 'Sri Lanka',
  'np': 'Nepal',
  'bt': 'Bhutan',
  'mm': 'Myanmar',
  'th': 'Thailand',
  'vn': 'Vietnam',
  'la': 'Laos',
  'kh': 'Cambodia',
  'my': 'Malaysia',
  'sg': 'Singapore',
  'id': 'Indonesia',
  'ph': 'Philippines',
  'au': 'Australia',
  'nz': 'New Zealand',
  'ca': 'Canada',
  'mx': 'Mexico',
  'br': 'Brazil',
  'ar': 'Argentina',
  'cl': 'Chile',
  'pe': 'Peru',
  'co': 'Colombia',
  've': 'Venezuela',
  'ec': 'Ecuador',
  'bo': 'Bolivia',
  'py': 'Paraguay',
  'uy': 'Uruguay',
  'gy': 'Guyana',
  'sr': 'Suriname',
  'za': 'South Africa',
  'ng': 'Nigeria',
  'ke': 'Kenya',
  'ug': 'Uganda',
  'tz': 'Tanzania',
  'et': 'Ethiopia',
  'so': 'Somalia',
  'sd': 'Sudan',
  'eg': 'Egypt',
  'ly': 'Libya',
  'tn': 'Tunisia',
  'dz': 'Algeria',
  'ma': 'Morocco',
  'sn': 'Senegal',
  'ci': 'Ivory Coast',
  'gh': 'Ghana',
  'cm': 'Cameroon',
  'cg': 'Congo',
  'cd': 'Democratic Republic of the Congo',
  'ao': 'Angola',
  'zm': 'Zambia',
  'zw': 'Zimbabwe',
  'bw': 'Botswana',
  'na': 'Namibia',
  'mw': 'Malawi',
  'mz': 'Mozambique',
  'mg': 'Madagascar',
  'mu': 'Mauritius',
  'sz': 'Eswatini',
  'ls': 'Lesotho',
  'rw': 'Rwanda',
  'bi': 'Burundi',
  'dj': 'Djibouti',
  'er': 'Eritrea',
  'ss': 'South Sudan',
  'cf': 'Central African Republic',
  'td': 'Chad',
  'ne': 'Niger',
  'ml': 'Mali',
  'bf': 'Burkina Faso',
  'gn': 'Guinea',
  'gw': 'Guinea-Bissau',
  'sl': 'Sierra Leone',
  'lr': 'Liberia',
  'tg': 'Togo',
  'bj': 'Benin',
  'ga': 'Gabon',
  'gq': 'Equatorial Guinea',
  'st': 'Sao Tome and Principe',
  'cv': 'Cabo Verde',
  'gm': 'Gambia',
  'mr': 'Mauritania',
  'sa': 'Saudi Arabia',
  'ye': 'Yemen',
  'om': 'Oman',
  'ae': 'United Arab Emirates',
  'qa': 'Qatar',
  'kw': 'Kuwait',
  'bh': 'Bahrain',
  'jo': 'Jordan',
  'lb': 'Lebanon',
  'sy': 'Syria',
  'iq': 'Iraq',
  'ir': 'Iran',
  'af': 'Afghanistan',
  'uz': 'Uzbekistan',
  'kz': 'Kazakhstan',
  'kg': 'Kyrgyzstan',
  'tj': 'Tajikistan',
  'tm': 'Turkmenistan',
  'az': 'Azerbaijan',
  'ge': 'Georgia',
  'am': 'Armenia',
  'il': 'Israel',
  'ps': 'Palestine',
  'cy': 'Cyprus',
  'mt': 'Malta',
  'is': 'Iceland',
  'ie': 'Ireland',
  'lu': 'Luxembourg',
  'mc': 'Monaco',
  'li': 'Liechtenstein',
  'sm': 'San Marino',
  'va': 'Vatican City',
  'ad': 'Andorra'
};

// Available flag codes (only those that actually exist in the flags directory)
const availableFlagCodes = Object.keys(flagGameData);

function generateQuestion(gameType) {
  // For flag guessing games
  if (gameType === 'FlagGuess') {
    // Select a random flag code
    const correctFlagCode = availableFlagCodes[Math.floor(Math.random() * availableFlagCodes.length)];
    const correctCountry = flagGameData[correctFlagCode];
    
    console.log('Generating FlagGuess question - correct flag code:', correctFlagCode, 'country:', correctCountry);
    
    // Generate 3 wrong flag options
    const wrongFlagCodes = [];
    const usedCodes = [correctFlagCode];
    
    while (wrongFlagCodes.length < 3) {
      const randomCode = availableFlagCodes[Math.floor(Math.random() * availableFlagCodes.length)];
      if (!usedCodes.includes(randomCode)) {
        usedCodes.push(randomCode);
        wrongFlagCodes.push(randomCode);
      }
    }
    
    // Create flag options array with correct flag and wrong flags
    const allFlagCodes = [correctFlagCode, ...wrongFlagCodes];
    
    // Shuffle the flag options
    for (let i = allFlagCodes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allFlagCodes[i], allFlagCodes[j]] = [allFlagCodes[j], allFlagCodes[i]];
    }
    
    const questionData = {
      correctAnswer: correctCountry,
      correctFlagCode: correctFlagCode,
      flagCodes: allFlagCodes,
      question: `Which flag belongs to ${correctCountry}?`
    };
    
    console.log('Generated FlagGuess question data:', questionData);
    
    return Promise.resolve({
      question: JSON.stringify(questionData),
      answer: correctCountry,
      type: 'flag',
      flagCode: correctFlagCode
    });
  }
  
  // For other games, use simplified questions for now
  const questions = {
    'Population': {
      question: 'What is the population of this country?',
      answer: '331 million',
      type: 'population'
    },
    'Findle': {
      question: 'What country name starts with "U"?',
      answer: 'United States',
      type: 'name'
    },
    'Flagle': {
      question: 'What country does this flag belong to?',
      answer: 'United States',
      type: 'flag'
    },
    'Worldle': {
      question: 'Where is this country located?',
      answer: 'North America',
      type: 'location'
    },
    'Capitals': {
      question: 'What is the capital of this country?',
      answer: 'Washington D.C.',
      type: 'capital'
    },
    'Hangman': {
      question: 'Guess the word: _ _ _ _ _ _ _ _',
      answer: 'COUNTRY',
      type: 'word'
    },
    'Shaple': {
      question: 'What shape is this country?',
      answer: 'Rectangle',
      type: 'shape'
    },
    'US': {
      question: 'What US state is this?',
      answer: 'California',
      type: 'state'
    },
    'Namle': {
      question: 'What country name contains "A"?',
      answer: 'Canada',
      type: 'name'
    }
  };
  
  return Promise.resolve(questions[gameType] || questions['Globle']);
}

function checkAnswer(gameType, answer) {
  // Simplified answer checking - you can make this more sophisticated
  const correctAnswers = {
    'Globle': ['united states', 'usa', 'america'],
    'Population': ['331 million', '331m', '331'],
    'Findle': ['united states', 'usa'],
    'Flagle': ['united states', 'usa', 'america'],
    'Worldle': ['north america', 'america'],
    'Capitals': ['washington d.c.', 'washington', 'dc'],
    'Hangman': ['country'],
    'Shaple': ['rectangle'],
    'US': ['california', 'ca'],
    'Namle': ['canada']
  };
  
  const answers = correctAnswers[gameType] || [];
  return answers.some(correct => answer.toLowerCase().includes(correct));
}

async function updatePlayerPoints(userId, pointsChange, isWin) {
  try {
    const user = await User.findById(userId);
    if (user) {
      await user.updateOnlinePoints(pointsChange, isWin);
    }
  } catch (error) {
    console.error('Error updating player points:', error);
  }
}

const app = express();
const server = createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins temporarily for debugging
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// CORS
app.use(cors({
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/badges', badgesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Globle Web App Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Game queues and active matches
const gameQueues = {
  'Globle': [],
  'Population': [],
  'Findle': [],
  'Flagle': [],
  'Worldle': [],
  'Capitals': [],
  'Hangman': [],
  'Shaple': [],
  'US': [],
  'Namle': [],
  'FlagGuess': []
};

const activeMatches = new Map();
const userSockets = new Map();

// Track round results for Globle games
const globleRoundResults = new Map(); // matchId -> { player1Wins: 0, player2Wins: 0, currentRound: 1 }

// Socket.IO middleware for authentication
io.use(async (socket, next) => {
  try {
    console.log('Socket auth attempt - token:', socket.handshake.auth.token ? 'present' : 'missing');
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log('No token provided');
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded, userId:', decoded.userId);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('User not found in database');
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.username = user.username;
    console.log('Socket authenticated for user:', user.username);
    next();
  } catch (error) {
    console.log('Socket auth error:', error.message);
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.username} (${socket.userId})`);
  console.log('Total connected users:', userSockets.size + 1);
  console.log('Socket handshake:', {
    headers: socket.handshake.headers,
    query: socket.handshake.query,
    auth: socket.handshake.auth
  });
  
  userSockets.set(socket.userId, socket);

  // Join game queue
  socket.on('joinQueue', async (data) => {
    console.log('joinQueue event received:', data);
    console.log('User joining queue:', socket.username, 'for game:', data.gameType);
    const { gameType } = data;
    
    if (!gameQueues[gameType]) {
      gameQueues[gameType] = [];
    }

    // Check if user is already in queue
    const alreadyInQueue = gameQueues[gameType].find(player => player.userId === socket.userId);
    if (alreadyInQueue) {
      console.log('User already in queue:', socket.username);
      socket.emit('queueError', { message: 'Already in queue for this game' });
      return;
    }

    // Add to queue
    const player = {
      userId: socket.userId,
      username: socket.username,
      socketId: socket.id,
      gameType
    };

    gameQueues[gameType].push(player);
    console.log(`User ${socket.username} joined ${gameType} queue. Queue length: ${gameQueues[gameType].length}`);
    console.log('Current queue:', gameQueues[gameType].map(p => p.username));
    socket.join(`queue_${gameType}`);
    socket.emit('queueJoined', { gameType, position: gameQueues[gameType].length });

    // Try to match players
    await tryMatchPlayers(gameType);
  });

  // Leave queue
  socket.on('leaveQueue', (data) => {
    const { gameType } = data;
    leaveQueue(socket, gameType);
  });

  // Submit answer
  socket.on('submitAnswer', async (data) => {
    const { matchId, answer, timeTaken, isCorrect, distance, clientTimestamp } = data;
    const match = activeMatches.get(matchId);
    
    if (!match) {
      socket.emit('error', { message: 'Match not found' });
      return;
    }

    if (match.winner) {
      socket.emit('error', { message: 'Match already ended' });
      return;
    }

    // Add precise server timestamp for tie-breaking
    const serverTimestamp = Date.now();
    const playerIndex = match.players.findIndex(p => p.userId === socket.userId);
    const isPlayer1 = playerIndex === 0;
    
    // Store answer with precise timing
    const answerData = {
      userId: socket.userId,
      username: socket.username,
      answer,
      isCorrect,
      distance,
      clientTimestamp,
      serverTimestamp,
      isPlayer1
    };

    // Initialize answer tracking if not exists
    if (!match.answers) {
      match.answers = [];
    }

    // Check if this player has already answered this round
    const existingAnswer = match.answers.find(a => a.userId === socket.userId);
    if (existingAnswer) {
      console.log(`Player ${socket.username} already answered this round`);
      return;
    }

    // For FlagGuess games, check if round is already being processed
    if (match.gameType === 'FlagGuess' && match.roundProcessing) {
      console.log(`🎮 FlagGuess - Round already being processed, rejecting submission from ${socket.username}`);
      return;
    }

    // For Globle games, check if round is already being processed
    if (match.gameType === 'Globle' && match.roundProcessing) {
      console.log(`🎮 Globle - Round already being processed, rejecting submission from ${socket.username}`);
      return;
    }

    // Add answer to tracking
    match.answers.push(answerData);
    console.log(`🎮 Answer submitted by ${socket.username}:`, {
      answer,
      isCorrect,
      serverTimestamp,
      clientTimestamp,
      totalAnswers: match.answers.length,
      playerIndex: playerIndex + 1
    });

    // Handle Globle games with 3-round system
    if (match.gameType === 'Globle') {
      const roundResults = globleRoundResults.get(matchId);
      if (!roundResults) {
        socket.emit('error', { message: 'Round tracking not found' });
        return;
      }

      if (isCorrect) {
        // Add protection against double processing when both players submit simultaneously
        if (match.roundProcessing) {
          console.log(`🎮 Globle - Round already being processed, skipping duplicate submission from ${socket.username}`);
          return;
        }
        
        match.roundProcessing = true; // Set flag to prevent double processing
        
        // Determine which player won this round based on timing
        const correctAnswers = match.answers.filter(a => a.isCorrect);
        let roundWinner;
        
        if (correctAnswers.length === 1) {
          // Only one player answered correctly
          roundWinner = correctAnswers[0];
        } else if (correctAnswers.length > 1) {
          // Multiple correct answers - check if they were submitted at the same time
          const timestamps = correctAnswers.map(a => a.serverTimestamp);
          const timeDifference = Math.max(...timestamps) - Math.min(...timestamps);
          
          // If answers are within 100ms of each other, consider it a simultaneous submission
          if (timeDifference <= 100) {
            console.log(`🎮 Globle - Simultaneous correct answers detected (${timeDifference}ms difference), declaring draw and restarting round`);
            roundWinner = null; // No winner - it's a draw
          } else {
            // Answers were not simultaneous, determine fastest
            const sortedAnswers = correctAnswers.sort((a, b) => {
              return a.serverTimestamp - b.serverTimestamp;
            });
            roundWinner = sortedAnswers[0];
            console.log(`🎮 Globle - Non-simultaneous correct answers, fastest wins: ${roundWinner.username}`);
          }
        }

        if (roundWinner) {
          // Update round wins
          if (roundWinner.isPlayer1) {
            roundResults.player1Wins++;
          } else {
            roundResults.player2Wins++;
          }

          console.log(`🎮 Round winner: ${roundWinner.username} (${roundWinner.serverTimestamp}ms)`);

          // Check if someone has won 2 out of 3 rounds
          const hasWinner = roundResults.player1Wins >= 2 || roundResults.player2Wins >= 2;
          
          if (hasWinner) {
            // Game is over - determine final winner
            const finalWinner = roundResults.player1Wins >= 2 ? match.players[0] : match.players[1];
            const finalLoser = roundResults.player1Wins >= 2 ? match.players[1] : match.players[0];
            
            match.winner = finalWinner.userId;
            match.endTime = Date.now();
            
            // Update points
            await updatePlayerPoints(finalWinner.userId, 100, true);
            await updatePlayerPoints(finalLoser.userId, -100, false);
            
            // Notify both players
            io.to(matchId).emit('gameEnd', {
              winner: finalWinner.username,
              finalScore: `${roundResults.player1Wins}-${roundResults.player2Wins}`,
              correctAnswer: match.correctAnswer,
              points: {
                [finalWinner.userId]: 100,
                [finalLoser.userId]: -100
              }
            });
            
            // Clean up
            setTimeout(() => {
              activeMatches.delete(matchId);
              globleRoundResults.delete(matchId);
            }, 5000);
          } else {
            // Continue to next round OR restart current round if it was a draw
            if (roundWinner) {
              // There was a winner - advance to next round
              roundResults.currentRound++;
              
              // Generate new secret country for next round
              const nextRoundQuestion = await generateQuestion('Globle');
              match.correctAnswer = nextRoundQuestion;
              roundResults.secretCountry = nextRoundQuestion.country;
              
              // Clear answers for next round
              match.answers = [];
              match.roundProcessing = false; // Reset flag for next round
              
              // Notify players about round result
              io.to(matchId).emit('roundEnd', {
                roundWinner: roundWinner.username,
                roundNumber: roundResults.currentRound - 1,
                score: `${roundResults.player1Wins}-${roundResults.player2Wins}`,
                nextRound: roundResults.currentRound
              });
              
              // Start next round after 3 seconds
              setTimeout(() => {
                io.to(matchId).emit('gameStart', {
                  matchId,
                  gameType: 'Globle',
                  question: nextRoundQuestion.question,
                  startTime: Date.now(),
                  secretCountry: nextRoundQuestion.country,
                  roundNumber: roundResults.currentRound
                });
              }, 3000);
            } else {
              // It was a draw - restart the same round
              console.log(`🎮 Globle - Restarting round ${roundResults.currentRound} due to draw`);
              
              // Generate new secret country for the same round
              const newRoundQuestion = await generateQuestion('Globle');
              match.correctAnswer = newRoundQuestion;
              roundResults.secretCountry = newRoundQuestion.country;
              
              // Clear answers for restart
              match.answers = [];
              match.roundProcessing = false; // Reset flag for restart
              
              // Notify players about draw and restart
              io.to(matchId).emit('roundEnd', {
                roundWinner: null,
                roundNumber: roundResults.currentRound,
                score: `${roundResults.player1Wins}-${roundResults.player2Wins}`,
                nextRound: roundResults.currentRound,
                isDraw: true
              });
              
              // Restart the same round after 3 seconds
              setTimeout(() => {
                io.to(matchId).emit('gameStart', {
                  matchId,
                  gameType: 'Globle',
                  question: newRoundQuestion.question,
                  startTime: Date.now(),
                  secretCountry: newRoundQuestion.country,
                  roundNumber: roundResults.currentRound
                });
              }, 3000);
            }
          }
        } else {
          // No round winner determined, reset flag
          match.roundProcessing = false;
        }
      } else {
        // Incorrect guess - continue playing
        socket.emit('guessResult', {
          isCorrect: false,
          distance: distance,
          message: 'Keep guessing!'
        });
      }
    } else if (match.gameType === 'FlagGuess') {
      // Handle FlagGuess games - 5-round system
      const questionData = JSON.parse(match.correctAnswer.question);
      const isCorrect = answer === questionData.correctFlagCode;
      
      console.log('🎮 FlagGuess - Answer submitted:', {
        answer,
        correctFlagCode: questionData.correctFlagCode,
        isCorrect,
        currentRound: match.currentRound,
        player1Wins: match.player1Wins,
        player2Wins: match.player2Wins,
        serverTimestamp
      });
      
      // Initialize round tracking if not exists
      if (!match.currentRound) {
        match.currentRound = 1;
        match.player1Wins = 0;
        match.player2Wins = 0;
      }
      
      // Check if both players have answered OR if first player was correct
      const shouldEndRound = match.answers.length === 2 || 
        (match.answers.length === 1 && match.answers[0].isCorrect);
      
      // Add flag to prevent double processing when both players submit simultaneously
      if (shouldEndRound && !match.roundProcessing) {
        match.roundProcessing = true; // Set flag to prevent double processing
        
        // Both players answered OR first player was correct - determine winner
        const correctAnswers = match.answers.filter(a => a.isCorrect);
        let roundWinner = null;
        let isDraw = false;
        
        if (correctAnswers.length === 1) {
          // Only one player answered correctly - they win
          roundWinner = correctAnswers[0];
        } else if (correctAnswers.length > 1) {
          // Multiple correct answers - check if they were submitted at the same time
          const timestamps = correctAnswers.map(a => a.serverTimestamp);
          const timeDifference = Math.max(...timestamps) - Math.min(...timestamps);
          
          // If answers are within 100ms of each other, consider it a simultaneous submission
          if (timeDifference <= 100) {
            console.log(`🎮 FlagGuess - Simultaneous correct answers detected (${timeDifference}ms difference), declaring draw and restarting round`);
            roundWinner = null; // No winner - it's a draw
            isDraw = true;
          } else {
            // Answers were not simultaneous, determine fastest
            const sortedAnswers = correctAnswers.sort((a, b) => {
              return a.serverTimestamp - b.serverTimestamp;
            });
            roundWinner = sortedAnswers[0];
            console.log(`🎮 FlagGuess - Non-simultaneous correct answers, fastest wins: ${roundWinner.username}`);
          }
        } else {
          // No correct answers - it's a draw
          roundWinner = null;
        }
        
        if (roundWinner) {
          // Update round wins
          if (roundWinner.isPlayer1) {
            match.player1Wins++;
          } else {
            match.player2Wins++;
          }
          
          console.log(`🎮 FlagGuess - Round winner: ${roundWinner.username} (answered correctly)`);
        } else {
          console.log(`🎮 FlagGuess - Round draw (both players answered incorrectly or simultaneously)`);
        }
        
        // Send round result to both players with correct information
        const roundResult = {
          roundWinner: roundWinner ? roundWinner.username : null,
          roundNumber: match.currentRound,
          score: `${match.player1Wins}-${match.player2Wins}`,
          correctAnswer: questionData.correctAnswer,
          isCorrect: isCorrect,
          isDraw: isDraw, // Add draw flag
          playerAnswers: match.answers.map(a => ({
            username: a.username,
            isCorrect: a.isCorrect,
            answer: a.answer
          }))
        };
        
        // Send individual results to each player
        match.players.forEach(player => {
          const playerAnswer = match.answers.find(a => a.userId === player.userId);
          const playerSocket = userSockets.get(player.userId);
          
          if (playerSocket) {
            playerSocket.emit('roundResult', {
              ...roundResult,
              userAnswer: playerAnswer ? playerAnswer.answer : null,
              userIsCorrect: playerAnswer ? playerAnswer.isCorrect : false,
              userWonRound: roundWinner && roundWinner.userId === player.userId
            });
          }
        });
        
        // Check if we've reached 5 rounds
        if (match.currentRound >= 5) {
          console.log('🎮 FlagGuess - Game ending after 5 rounds');
          // Game is over - determine final winner and calculate points
          const finalScore = `${match.player1Wins}-${match.player2Wins}`;
          const scoreDifference = Math.abs(match.player1Wins - match.player2Wins);
          
          // Calculate points based on score difference
          let winnerPoints, loserPoints;
          
          if (scoreDifference === 0) {
            // Draw - no points awarded
            winnerPoints = 0;
            loserPoints = 0;
            console.log('🎮 FlagGuess - Game ended in draw, no points awarded');
          } else if (scoreDifference === 5) {
            // Complete victory (5-0) - maximum points
            winnerPoints = 100;
            loserPoints = -100;
            console.log('🎮 FlagGuess - Complete victory, maximum points awarded');
          } else {
            // Partial victory - proportional points
            // Base points: 20 per round difference
            const basePoints = scoreDifference * 20;
            winnerPoints = basePoints;
            loserPoints = -basePoints;
            console.log(`🎮 FlagGuess - Partial victory, ${basePoints} points awarded`);
          }
          
          const finalWinner = match.player1Wins > match.player2Wins ? match.players[0] : match.players[1];
          const finalLoser = match.player1Wins > match.player2Wins ? match.players[1] : match.players[0];
          
          match.winner = finalWinner.userId;
          match.endTime = Date.now();
          
          // Update points based on calculated values
          await updatePlayerPoints(finalWinner.userId, winnerPoints, winnerPoints > 0);
          await updatePlayerPoints(finalLoser.userId, loserPoints, loserPoints > 0);
          
          // Send individual game end to each player
          const winnerSocket = userSockets.get(finalWinner.userId);
          const loserSocket = userSockets.get(finalLoser.userId);
          
          if (winnerSocket) {
            winnerSocket.emit('gameEnd', {
              winner: finalWinner.username,
              finalScore: finalScore,
              correctAnswer: questionData.correctAnswer,
              userPoints: winnerPoints,
              isWinner: winnerPoints > 0,
              scoreDifference: scoreDifference
            });
          }
          
          if (loserSocket) {
            loserSocket.emit('gameEnd', {
              winner: finalWinner.username,
              finalScore: finalScore,
              correctAnswer: questionData.correctAnswer,
              userPoints: loserPoints,
              isWinner: loserPoints > 0,
              scoreDifference: scoreDifference
            });
          }
          
          // Clean up
          setTimeout(() => {
            activeMatches.delete(matchId);
          }, 5000);
        } else {
          // Continue to next round OR restart current round if it was a draw
          if (roundWinner) {
            // There was a winner - advance to next round
            match.currentRound++;
            
            // Generate new question for next round
            const nextQuestion = await generateQuestion('FlagGuess');
            match.correctAnswer = nextQuestion;
            
            // Clear answers for next round
            match.answers = [];
            
            // Notify players about round result and start next round
            io.to(matchId).emit('roundEnd', {
              roundWinner: roundWinner.username,
              roundNumber: match.currentRound - 1,
              score: `${match.player1Wins}-${match.player2Wins}`,
              nextRound: match.currentRound,
              isDraw: false
            });
            
            // Start next round after 3 seconds
            setTimeout(() => {
              io.to(matchId).emit('gameStart', {
                matchId,
                gameType: 'FlagGuess',
                question: nextQuestion.question,
                startTime: Date.now(),
                roundNumber: match.currentRound
              });
            }, 3000);
          } else {
            // It was a draw - restart the same round
            console.log(`🎮 FlagGuess - Restarting round ${match.currentRound} due to draw`);
            
            // Generate new question for the same round
            const newQuestion = await generateQuestion('FlagGuess');
            match.correctAnswer = newQuestion;
            
            // Clear answers for restart
            match.answers = [];
            
            // Notify players about draw and restart
            io.to(matchId).emit('roundEnd', {
              roundWinner: null,
              roundNumber: match.currentRound,
              score: `${match.player1Wins}-${match.player2Wins}`,
              nextRound: match.currentRound,
              isDraw: true
            });
            
            // Restart the same round after 3 seconds
            setTimeout(() => {
              io.to(matchId).emit('gameStart', {
                matchId,
                gameType: 'FlagGuess',
                question: newQuestion.question,
                startTime: Date.now(),
                roundNumber: match.currentRound
              });
            }, 3000);
          }
        }
        
        // Reset round processing flag
        match.roundProcessing = false;
      } else {
        // Only one player has answered and they got it wrong - wait for the other player
        console.log(`🎮 FlagGuess - Waiting for other player. First player answered incorrectly.`);
      }
    }
  });

  // Request new opponent
  socket.on('requestNewOpponent', async (data) => {
    const { gameType } = data;
    await tryMatchPlayers(gameType);
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.username}`);
    console.log('Remaining connected users:', userSockets.size - 1);
    
    // Remove from all queues
    Object.keys(gameQueues).forEach(gameType => {
      leaveQueue(socket, gameType);
    });
    
    // Remove from active matches
    for (const [matchId, match] of activeMatches.entries()) {
      if (match.players.some(p => p.userId === socket.userId)) {
        activeMatches.delete(matchId);
        io.to(matchId).emit('opponentDisconnected');
      }
    }
    
    userSockets.delete(socket.userId);
  });
});

// Helper functions
function leaveQueue(socket, gameType) {
  if (gameQueues[gameType]) {
    gameQueues[gameType] = gameQueues[gameType].filter(player => player.userId !== socket.userId);
    socket.leave(`queue_${gameType}`);
    socket.emit('queueLeft', { gameType });
  }
}

async function tryMatchPlayers(gameType) {
  console.log(`Trying to match players for ${gameType}. Queue length: ${gameQueues[gameType]?.length || 0}`);
  const queue = gameQueues[gameType];
  
  if (queue.length >= 2) {
    console.log(`Found 2+ players in ${gameType} queue, creating match`);
    const player1 = queue.shift();
    const player2 = queue.shift();
    
    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate question asynchronously
    const questionData = await generateQuestion(gameType);
    
    // Create match
    const match = {
      id: matchId,
      gameType,
      players: [player1, player2],
      startTime: Date.now(),
      correctAnswer: questionData,
      winner: null,
      currentRound: 1,
      player1Wins: 0,
      player2Wins: 0,
      answers: [], // Initialize answers array for new matches
      roundProcessing: false // Initialize round processing flag
    };
    
    activeMatches.set(matchId, match);
    
    // Initialize round tracking for Globle games
    if (gameType === 'Globle') {
      globleRoundResults.set(matchId, {
        player1Wins: 0,
        player2Wins: 0,
        currentRound: 1,
        secretCountry: questionData.country // Store the secret country
      });
    }
    
    console.log(`Created match ${matchId} between ${player1.username} and ${player2.username}`);
    console.log('Match data:', match);
    
    // Join match room
    const socket1 = userSockets.get(player1.userId);
    const socket2 = userSockets.get(player2.userId);
    
    console.log('Socket1 found:', !!socket1, 'Socket2 found:', !!socket2);
    
    if (socket1 && socket2) {
      socket1.join(matchId);
      socket2.join(matchId);
      
      // Notify players
      const matchData = {
        matchId,
        gameType,
        players: [
          { username: player1.username },
          { username: player2.username }
        ],
        question: questionData.question,
        startTime: Date.now() + 3000, // 3 second countdown
        secretCountry: gameType === 'Globle' ? questionData.country : null
      };
      
      console.log('Emitting matchFound event to room:', matchId);
      console.log('Match data being sent:', matchData);
      io.to(matchId).emit('matchFound', matchData);
      
      // Start game after countdown
      setTimeout(() => {
        console.log('Starting game for match:', matchId);
        io.to(matchId).emit('gameStart', {
          matchId,
          gameType,
          question: questionData.question,
          startTime: Date.now(),
          secretCountry: gameType === 'Globle' ? questionData.country : null
        });
      }, 3000);
    } else {
      console.log('One or both sockets not found for match');
      console.log('Available sockets:', Array.from(userSockets.keys()));
    }
  } else {
    console.log(`Not enough players in ${gameType} queue (${queue.length})`);
  }
}

const PORT = process.env.PORT || 5051;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('WebSocket server is ready for connections');
  console.log('CORS configuration:', io.engine.opts.cors);
});