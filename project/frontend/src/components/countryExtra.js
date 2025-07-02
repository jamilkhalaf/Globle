const countryExtra = {
  "Aruba": {
    famousCities: ["Oranjestad", "Palm Beach", "Santa Cruz"],
    famousPlaces: [
        "Alto Vista Chapel",
        "California Lighthouse",
        "Natural Pool (Conchi)",
        "Bushiribana Gold Mine Ruins",
        "Fort Zoutman"
    ],
    bordering: [], 
    landlocked: false,
    island: true,
    hemisphere: "northern"
 },
 "Afghanistan": {
  famousCities: ["Kabul", "Mazar‑i‑Sharif", "Herat"],
  famousPlaces: [
    "Gardens of Babur",
    "Blue Mosque (Mazar‑i‑Sharif)",
    "Herat Citadel",
    "Bamyan Valley (UNESCO/Buddha niches)",
    "Wakhan Corridor"
  ],
  bordering: ["Pakistan", "Iran", "Turkmenistan", "Uzbekistan", "Tajikistan", "China"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Angola": {
  famousCities: ["Luanda", "Lubango", "M'banza‑Kongo"],
  famousPlaces: [
    "Miradouro da Lua",
    "Mausoleum of Agostinho Neto",
    "Palácio de Ferro",
    "Fortress of São Miguel",
    "Christ the King statue (Lubango)",
    "Fortress of Kambambe",
    "4 de Abril Bridge"
  ],
  bordering: ["Namibia", "Zambia", "Democratic Republic of the Congo", "Republic of the Congo"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Albania": {
  famousCities: ["Tirana", "Berat", "Gjirokastër", "Durrës", "Shkodër"],
  famousPlaces: [
    "Berat Castle",
    "Gjirokastër Fortress",
    "Butrint National Park",
    "Ksamil Beaches",
    "Mesi Bridge",
    "Blue Eye Spring"
  ],
  bordering: ["Montenegro", "Kosovo", "North Macedonia", "Greece"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Andorra": {
  famousCities: ["Andorra la Vella", "Escaldes-Engordany", "Encamp"],
  famousPlaces: [
    "Vallnord Ski Resort",
    "Grandvalira Ski Area",
    "Sant Joan de Caselles Church",
    "Madriu-Perafita-Claror Valley (UNESCO)",
    "Casa de la Vall"
  ],
  bordering: ["France", "Spain"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"United Arab Emirates": {
  famousCities: ["Dubai", "Abu Dhabi", "Sharjah"],
  famousPlaces: [
    "Burj Khalifa",
    "Sheikh Zayed Grand Mosque",
    "Palm Jumeirah",
    "Dubai Mall",
    "Louvre Abu Dhabi"
  ],
  bordering: ["Saudi Arabia", "Oman"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Argentina": {
  famousCities: ["Buenos Aires", "Córdoba", "Rosario"],
  famousPlaces: [
    "Iguazu Falls",
    "Perito Moreno Glacier",
    "Aconcagua",
    "La Boca",
    "Teatro Colón"
  ],
  bordering: ["Bolivia", "Brazil", "Chile", "Paraguay", "Uruguay"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Armenia": {
  famousCities: ["Yerevan", "Gyumri", "Vanadzor"],
  famousPlaces: [
    "Geghard Monastery",
    "Garni Temple",
    "Lake Sevan",
    "Republic Square",
    "Khor Virap"
  ],
  bordering: ["Georgia", "Azerbaijan", "Iran", "Turkey"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"American Samoa": {
  famousCities: ["Pago Pago", "Tafuna", "Leone"],
  famousPlaces: [
    "National Park of American Samoa",
    "Mount Alava",
    "Fagatele Bay",
    "Two Dollar Beach",
    "Blunts Point Trail"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Australia": {
  famousCities: ["Sydney", "Melbourne", "Brisbane"],
  famousPlaces: ["Sydney Opera House", "Great Barrier Reef", "Uluru"],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},


  "France": {
    famousCities: ["Paris", "Lyon", "Marseille"],
    famousPlaces: ["Eiffel Tower", "Louvre Museum", "Mont Saint-Michel"],
    bordering: ["Belgium", "Luxembourg", "Germany", "Switzerland", "Italy", "Spain", "Andorra", "Monaco"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Brazil": {
    famousCities: ["Rio de Janeiro", "São Paulo", "Brasília"],
    famousPlaces: ["Christ the Redeemer", "Sugarloaf Mountain", "Amazon Rainforest"],
    bordering: ["Argentina", "Bolivia", "Colombia", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela", "French Guiana"],
    landlocked: false,
    island: false,
    hemisphere: "southern"
  },

  "Switzerland": {
    famousCities: ["Zurich", "Geneva", "Bern"],
    famousPlaces: ["Matterhorn", "Lake Geneva", "Jungfrau"],
    bordering: ["Austria", "France", "Germany", "Italy", "Liechtenstein"],
    landlocked: true,
    island: false,
    hemisphere: "northern"
  },
  "Egypt": {
    famousCities: ["Cairo", "Alexandria", "Giza"],
    famousPlaces: ["Pyramids of Giza", "Sphinx", "Valley of the Kings"],
    bordering: ["Libya", "Sudan", "Israel"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Canada": {
    famousCities: ["Toronto", "Vancouver", "Montreal"],
    famousPlaces: ["Niagara Falls", "Banff National Park", "CN Tower"],
    bordering: ["United States"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Japan": {
    famousCities: ["Tokyo", "Osaka", "Kyoto"],
    famousPlaces: ["Mount Fuji", "Fushimi Inari Shrine", "Himeji Castle"],
    bordering: [],
    landlocked: false,
    island: true,
    hemisphere: "northern"
  },
  "South Africa": {
    famousCities: ["Cape Town", "Johannesburg", "Durban"],
    famousPlaces: ["Table Mountain", "Kruger National Park", "Robben Island"],
    bordering: ["Botswana", "Lesotho", "Mozambique", "Namibia", "Eswatini", "Zimbabwe"],
    landlocked: false,
    island: false,
    hemisphere: "southern"
  },
  "United Kingdom": {
    famousCities: ["London", "Manchester", "Edinburgh"],
    famousPlaces: ["Big Ben", "Stonehenge", "Buckingham Palace"],
    bordering: ["Ireland"],
    landlocked: false,
    island: true,
    hemisphere: "northern"
  },
  "India": {
    famousCities: ["Mumbai", "Delhi", "Bangalore"],
    famousPlaces: ["Taj Mahal", "Red Fort", "Gateway of India"],
    bordering: ["Bangladesh", "Bhutan", "China", "Myanmar", "Nepal", "Pakistan"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "United States": {
    famousCities: ["New York", "Los Angeles", "Chicago"],
    famousPlaces: ["Statue of Liberty", "Grand Canyon", "Yellowstone"],
    bordering: ["Canada", "Mexico"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Russia": {
    famousCities: ["Moscow", "Saint Petersburg", "Novosibirsk"],
    famousPlaces: ["Red Square", "Lake Baikal", "Kremlin"],
    bordering: ["Azerbaijan", "Belarus", "China", "Estonia", "Finland", "Georgia", "Kazakhstan", "North Korea", "Latvia", "Lithuania", "Mongolia", "Norway", "Poland", "Ukraine"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Argentina": {
    famousCities: ["Buenos Aires", "Córdoba", "Rosario"],
    famousPlaces: ["Iguazu Falls", "Perito Moreno Glacier", "Aconcagua"],
    bordering: ["Bolivia", "Brazil", "Chile", "Paraguay", "Uruguay"],
    landlocked: false,
    island: false,
    hemisphere: "southern"
  },
  "Indonesia": {
    famousCities: ["Jakarta", "Surabaya", "Bali"],
    famousPlaces: ["Borobudur", "Komodo National Park", "Bali Beaches"],
    bordering: ["East Timor", "Malaysia", "Papua New Guinea"],
    landlocked: false,
    island: true,
    hemisphere: "southern"
  },
  "Nigeria": {
    famousCities: ["Lagos", "Abuja", "Kano"],
    famousPlaces: ["Zuma Rock", "Olumo Rock", "Yankari National Park"],
    bordering: ["Benin", "Cameroon", "Chad", "Niger"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Turkey": {
    famousCities: ["Istanbul", "Ankara", "Izmir"],
    famousPlaces: ["Hagia Sophia", "Cappadocia", "Pamukkale"],
    bordering: ["Armenia", "Azerbaijan", "Bulgaria", "Georgia", "Greece", "Iran", "Iraq", "Syria"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Mexico": {
    famousCities: ["Mexico City", "Guadalajara", "Monterrey"],
    famousPlaces: ["Chichen Itza", "Teotihuacan", "Cancun Beaches"],
    bordering: ["Belize", "Guatemala", "United States"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Saudi Arabia": {
    famousCities: ["Riyadh", "Jeddah", "Mecca"],
    famousPlaces: ["Masjid al-Haram", "Al-Masjid an-Nabawi", "Edge of the World"],
    bordering: ["Iraq", "Jordan", "Kuwait", "Oman", "Qatar", "United Arab Emirates", "Yemen", "Bahrain (bridge)"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Italy": {
    famousCities: ["Rome", "Milan", "Venice"],
    famousPlaces: ["Colosseum", "Leaning Tower of Pisa", "Venice Canals"],
    bordering: ["Austria", "France", "San Marino", "Slovenia", "Switzerland", "Vatican City"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Spain": {
    famousCities: ["Madrid", "Barcelona", "Seville"],
    famousPlaces: ["Sagrada Familia", "Alhambra", "Park Güell"],
    bordering: ["Andorra", "France", "Gibraltar", "Portugal", "Morocco (Ceuta/Melilla)"],
    landlocked: false,
    island: false,
    hemisphere: "northern"
  },
  "Antigua and Barbuda": {
  famousCities: ["Saint John's", "All Saints", "Liberta"],
  famousPlaces: [
    "Nelson's Dockyard",
    "Devil's Bridge",
    "Dickenson Bay",
    "Shirley Heights",
    "Half Moon Bay"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Azerbaijan": {
  famousCities: ["Baku", "Sumqayit", "Ganja"],
  famousPlaces: ["Baku Old City", "Goygol Lake", "Gobustan Rock Art"],
  bordering: ["Armenia", "Georgia", "Iran", "Russia", "Turkey"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Austria": {
  famousCities: ["Vienna", "Salzburg", "Innsbruck", "Graz", "Linz"],
  famousPlaces: [
    "Schönbrunn Palace",
    "Hofburg",
    "Salzburg Fortress",
    "Grossglockner",
    "Belvedere Palace"
  ],
  bordering: ["Germany", "Czechia", "Slovakia", "Hungary", "Slovenia", "Italy", "Switzerland", "Liechtenstein"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Burundi": {
  famousCities: ["Bujumbura", "Gitega", "Ngozi"],
  famousPlaces: [
    "Lake Tanganyika",
    "Kibira National Park",
    "Rusizi National Park",
    "Karera Waterfalls",
    "Livingstone–Stanley Monument"
  ],
  bordering: ["Rwanda", "Tanzania", "Democratic Republic of the Congo"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"Belgium": {
  famousCities: ["Brussels", "Bruges", "Antwerp", "Ghent", "Leuven"],
  famousPlaces: [
    "Grand Place (Brussels)",
    "Atomium",
    "Manneken Pis",
    "Belfry of Bruges",
    "Cathedral of Our Lady (Antwerp)"
  ],
  bordering: ["France", "Germany", "Luxembourg", "Netherlands"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Benin": {
  famousCities: ["Porto-Novo", "Cotonou", "Abomey"],
  famousPlaces: [
    "Royal Palaces of Abomey",
    "Pendjari National Park",
    "Ouidah Route of Slaves",
    "Lake Nokoué",
    "Python Temple"
  ],
  bordering: ["Togo", "Nigeria", "Burkina Faso", "Niger"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Burkina Faso": {
  famousCities: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou"],
  famousPlaces: [
    "Ouagadougou Cathedral",
    "Laongo Sculpture Symposium",
    "Ruins of Loropéni",
    "Moro-Naba Palace",
    "Sindou Peaks"
  ],
  bordering: ["Mali", "Niger", "Benin", "Togo", "Ghana", "Côte d'Ivoire"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Bangladesh": {
  famousCities: ["Dhaka", "Chittagong", "Khulna", "Rajshahi"],
  famousPlaces: [
    "Sundarbans",
    "Sixty Dome Mosque",
    "Ahsan Manzil",
    "Lalbagh Fort",
    "Cox’s Bazar Beach"
  ],
  bordering: ["India", "Myanmar"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Bulgaria": {
  famousCities: ["Sofia", "Plovdiv", "Varna", "Burgas", "Veliko Tarnovo"],
  famousPlaces: [
    "Alexander Nevsky Cathedral",
    "Rila Monastery",
    "Old Town of Plovdiv",
    "Boyana Church",
    "Sunny Beach"
  ],
  bordering: ["Romania", "Serbia", "North Macedonia", "Greece", "Turkey"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Bahrain": {
  famousCities: ["Manama", "Riffa", "Muharraq"],
  famousPlaces: [
    "Bahrain Fort (Qal'at al-Bahrain)",
    "Al Fateh Grand Mosque",
    "Bab Al Bahrain",
    "Tree of Life",
    "Amwaj Islands"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Bahamas, The": {
  famousCities: ["Nassau", "Freeport", "Marsh Harbour"],
  famousPlaces: [
    "Atlantis Paradise Island",
    "Blue Hole",
    "Exuma Cays",
    "Pink Sands Beach",
    "Dean’s Blue Hole"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Bosnia and Herzegovina": {
  famousCities: ["Sarajevo", "Mostar", "Banja Luka"],
  famousPlaces: [
    "Stari Most (Old Bridge)",
    "Sarajevo Baščaršija",
    "Kravice Waterfalls",
    "Vrelo Bosne",
    "Mehmed Paša Sokolović Bridge"
  ],
  bordering: ["Croatia", "Serbia", "Montenegro"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Belarus": {
  famousCities: ["Minsk", "Gomel", "Vitebsk"],
  famousPlaces: [
    "Mir Castle",
    "Nesvizh Castle",
    "Brest Hero-Fortress",
    "Belovezhskaya Pushcha",
    "National Library of Belarus"
  ],
  bordering: ["Latvia", "Lithuania", "Poland", "Russia", "Ukraine"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Belize": {
  famousCities: ["Belmopan", "Belize City", "San Ignacio"],
  famousPlaces: [
    "Great Blue Hole",
    "Caracol Mayan Ruins",
    "Hol Chan Marine Reserve",
    "Caye Caulker",
    "Altun Ha"
  ],
  bordering: ["Mexico", "Guatemala"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Bermuda": {
  famousCities: ["Hamilton", "St. George's"],
  famousPlaces: [
    "Horseshoe Bay Beach",
    "Royal Naval Dockyard",
    "Crystal and Fantasy Caves",
    "Gibb's Hill Lighthouse",
    "St. Peter's Church"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Bolivia": {
  famousCities: ["La Paz", "Santa Cruz", "Cochabamba"],
  famousPlaces: [
    "Salar de Uyuni",
    "Lake Titicaca",
    "Madidi National Park",
    "Death Road",
    "Tiwanaku Ruins"
  ],
  bordering: ["Argentina", "Brazil", "Chile", "Paraguay", "Peru"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"Barbados": {
  famousCities: ["Bridgetown", "Speightstown", "Oistins"],
  famousPlaces: [
    "Harrison's Cave",
    "Bathsheba Beach",
    "St. Nicholas Abbey",
    "Kensington Oval",
    "Animal Flower Cave"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Brunei Darussalam": {
  famousCities: ["Bandar Seri Begawan", "Kuala Belait", "Seria"],
  famousPlaces: [
    "Sultan Omar Ali Saifuddien Mosque",
    "Kampong Ayer Water Village",
    "Ulu Temburong National Park",
    "Royal Regalia Museum",
    "Jerudong Park"
  ],
  bordering: ["Malaysia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Bhutan": {
  famousCities: ["Thimphu", "Paro", "Punakha"],
  famousPlaces: [
    "Tiger's Nest Monastery",
    "Punakha Dzong",
    "Dochula Pass",
    "Buddha Dordenma Statue",
    "Phobjikha Valley"
  ],
  bordering: ["China", "India"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Botswana": {
  famousCities: ["Gaborone", "Francistown", "Maun"],
  famousPlaces: [
    "Okavango Delta",
    "Chobe National Park",
    "Moremi Game Reserve",
    "Makgadikgadi Pans",
    "Tsodilo Hills"
  ],
  bordering: ["Namibia", "South Africa", "Zimbabwe", "Zambia"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"Central African Republic": {
  famousCities: ["Bangui", "Bimbo", "Berbérati"],
  famousPlaces: [
    "Dzanga-Sangha Reserve",
    "Boali Waterfalls",
    "Notre-Dame of Bangui Cathedral",
    "Manovo-Gounda St Floris National Park",
    "Kembé Falls"
  ],
  bordering: ["Cameroon", "Chad", "Congo", "Democratic Republic of the Congo", "South Sudan", "Sudan"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Chile": {
  famousCities: ["Santiago", "Valparaíso", "Concepción"],
  famousPlaces: [
    "Easter Island Moai",
    "Torres del Paine",
    "Atacama Desert",
    "Valle de la Luna",
    "La Moneda Palace"
  ],
  bordering: ["Argentina", "Bolivia", "Peru"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"China": {
  famousCities: ["Beijing", "Shanghai", "Guangzhou"],
  famousPlaces: [
    "Great Wall of China",
    "Forbidden City",
    "Terracotta Army",
    "Potala Palace",
    "Li River"
  ],
  bordering: ["Afghanistan", "Bhutan", "India", "Kazakhstan", "Kyrgyzstan", "Laos", "Mongolia", "Myanmar", "Nepal", "North Korea", "Pakistan", "Russia", "Tajikistan", "Vietnam"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Cote dIvoire": {
  famousCities: ["Abidjan", "Yamoussoukro", "Bouaké"],
  famousPlaces: [
    "Basilica of Our Lady of Peace",
    "Banco National Park",
    "Tai National Park",
    "St. Paul's Cathedral Abidjan",
    "Assinie Beach"
  ],
  bordering: ["Burkina Faso", "Ghana", "Guinea", "Liberia", "Mali"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Cameroon": {
  famousCities: ["Yaoundé", "Douala", "Garoua"],
  famousPlaces: [
    "Waza National Park",
    "Mount Cameroon",
    "Limbe Botanical Garden",
    "Foumban Royal Palace",
    "Kribi Beach"
  ],
  bordering: ["Central African Republic", "Chad", "Congo", "Equatorial Guinea", "Gabon", "Nigeria"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Congo, Dem. Rep.": {
  famousCities: ["Kinshasa", "Lubumbashi", "Mbuji-Mayi"],
  famousPlaces: [
    "Virunga National Park",
    "Boyoma Falls",
    "Mount Nyiragongo",
    "Lola ya Bonobo Sanctuary",
    "Zongo Falls"
  ],
  bordering: ["Angola", "Burundi", "Central African Republic", "Congo", "Rwanda", "South Sudan", "Tanzania", "Uganda", "Zambia"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Congo, Rep.": {
  famousCities: ["Brazzaville", "Pointe-Noire", "Dolisie"],
  famousPlaces: [
    "Basilique Sainte-Anne",
    "Odzala-Kokoua National Park",
    "Loufoulakari Falls",
    "Marché Total",
    "Les Rapides"
  ],
  bordering: ["Angola", "Cameroon", "Central African Republic", "Democratic Republic of the Congo", "Gabon"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Colombia": {
  famousCities: ["Bogotá", "Medellín", "Cali"],
  famousPlaces: [
    "Cartagena Old Town",
    "Tayrona National Park",
    "Gold Museum",
    "Caño Cristales",
    "Salt Cathedral of Zipaquirá"
  ],
  bordering: ["Brazil", "Ecuador", "Panama", "Peru", "Venezuela"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Comoros": {
  famousCities: ["Moroni", "Mutsamudu", "Fomboni"],
  famousPlaces: [
    "Mount Karthala",
    "Chomoni Beach",
    "Itsandra Beach",
    "Badjanani Mosque",
    "Lac Sale"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Cabo Verde": {
  famousCities: ["Praia", "Mindelo", "Santa Maria"],
  famousPlaces: [
    "Fogo Volcano",
    "Santa Maria Beach",
    "Cidade Velha",
    "Monte Verde",
    "Tarrafal Beach"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Costa Rica": {
  famousCities: ["San José", "Alajuela", "Cartago"],
  famousPlaces: [
    "Arenal Volcano",
    "Manuel Antonio National Park",
    "Monteverde Cloud Forest",
    "Poás Volcano",
    "Tamarindo Beach"
  ],
  bordering: ["Nicaragua", "Panama"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Cuba": {
  famousCities: ["Havana", "Santiago de Cuba", "Camagüey"],
  famousPlaces: [
    "Malecón Havana",
    "Varadero Beach",
    "Old Havana",
    "Viñales Valley",
    "Castillo del Morro"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Cayman Islands": {
  famousCities: ["George Town", "West Bay", "Bodden Town"],
  famousPlaces: [
    "Seven Mile Beach",
    "Stingray City",
    "Queen Elizabeth II Botanic Park",
    "Pedro St. James",
    "Cayman Turtle Centre"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Cyprus": {
  famousCities: ["Nicosia", "Limassol", "Larnaca"],
  famousPlaces: [
    "Kyrenia Castle",
    "Tombs of the Kings",
    "Kolossi Castle",
    "Petra tou Romiou",
    "Ancient Kourion"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Czechia": {
  famousCities: ["Prague", "Brno", "Ostrava"],
  famousPlaces: [
    "Prague Castle",
    "Charles Bridge",
    "Old Town Square",
    "Kutná Hora",
    "Karlštejn Castle"
  ],
  bordering: ["Austria", "Germany", "Poland", "Slovakia"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Germany": {
  famousCities: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne"],
  famousPlaces: [
    "Brandenburg Gate",
    "Neuschwanstein Castle",
    "Berlin Wall",
    "Cologne Cathedral",
    "Black Forest"
  ],
  bordering: ["Austria", "Belgium", "Czechia", "Denmark", "France", "Luxembourg", "Netherlands", "Poland", "Switzerland"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Djibouti": {
  famousCities: ["Djibouti City", "Ali Sabieh", "Tadjoura"],
  famousPlaces: [
    "Lake Assal",
    "Day Forest National Park",
    "Lake Abbe",
    "Khor Ambado Beach",
    "Grand Bara Desert"
  ],
  bordering: ["Eritrea", "Ethiopia", "Somalia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Dominica": {
  famousCities: ["Roseau", "Portsmouth", "Marigot"],
  famousPlaces: [
    "Boiling Lake",
    "Trafalgar Falls",
    "Emerald Pool",
    "Morne Trois Pitons National Park",
    "Champagne Reef"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Denmark": {
  famousCities: ["Copenhagen", "Aarhus", "Odense"],
  famousPlaces: [
    "Tivoli Gardens",
    "Nyhavn",
    "The Little Mermaid",
    "Legoland Billund",
    "Kronborg Castle"
  ],
  bordering: ["Germany"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Dominican Republic": {
  famousCities: ["Santo Domingo", "Santiago de los Caballeros", "La Romana"],
  famousPlaces: [
    "Pico Duarte",
    "Zona Colonial",
    "Punta Cana",
    "Saona Island",
    "Bahía de las Águilas"
  ],
  bordering: ["Haiti"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Algeria": {
  famousCities: ["Algiers", "Oran", "Constantine"],
  famousPlaces: [
    "Notre Dame d'Afrique",
    "Kasbah of Algiers",
    "Tassili n'Ajjer",
    "Monument of the Martyrs",
    "Ghardaïa"
  ],
  bordering: ["Libya", "Mali", "Mauritania", "Morocco", "Niger", "Tunisia", "Western Sahara"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Ecuador": {
  famousCities: ["Quito", "Guayaquil", "Cuenca"],
  famousPlaces: [
    "Galápagos Islands",
    "Mitad del Mundo",
    "Cotopaxi Volcano",
    "Basilica del Voto Nacional",
    "Cajas National Park"
  ],
  bordering: ["Colombia", "Peru"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Egypt, Arab Rep.": {
  famousCities: ["Cairo", "Alexandria", "Giza"],
  famousPlaces: [
    "Pyramids of Giza",
    "Sphinx",
    "Valley of the Kings",
    "Karnak Temple",
    "Abu Simbel"
  ],
  bordering: ["Libya", "Sudan", "Israel"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Eritrea": {
  famousCities: ["Asmara", "Keren", "Massawa"],
  famousPlaces: [
    "Dahlak Archipelago",
    "Asmara Opera House",
    "Tank Graveyard",
    "Debre Bizen Monastery",
    "Fiat Tagliero Building"
  ],
  bordering: ["Djibouti", "Ethiopia", "Sudan"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Spain": {
  famousCities: ["Madrid", "Barcelona", "Seville"],
  famousPlaces: [
    "Sagrada Familia",
    "Alhambra",
    "Park Güell",
    "Prado Museum",
    "La Rambla"
  ],
  bordering: ["Andorra", "France", "Gibraltar", "Portugal", "Morocco (Ceuta/Melilla)"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Estonia": {
  famousCities: ["Tallinn", "Tartu", "Narva"],
  famousPlaces: [
    "Tallinn Old Town",
    "Alexander Nevsky Cathedral",
    "Kadriorg Palace",
    "Pärnu Beach",
    "Saaremaa Island"
  ],
  bordering: ["Latvia", "Russia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Ethiopia": {
  famousCities: ["Addis Ababa", "Gondar", "Mekelle"],
  famousPlaces: [
    "Lalibela Rock-Hewn Churches",
    "Simien Mountains",
    "Lake Tana & Blue Nile Falls",
    "Harar Jugol",
    "Erta Ale Volcano"
  ],
  bordering: ["Djibouti", "Eritrea", "Kenya", "Somalia", "South Sudan", "Sudan"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Finland": {
  famousCities: ["Helsinki", "Tampere", "Turku"],
  famousPlaces: [
    "Suomenlinna Fortress",
    "Santa Claus Village",
    "Lake Saimaa",
    "Temppeliaukio Church",
    "Aurora Borealis"
  ],
  bordering: ["Norway", "Russia", "Sweden"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Fiji": {
  famousCities: ["Suva", "Nadi", "Lautoka"],
  famousPlaces: [
    "Mamanuca Islands",
    "Denarau Island",
    "Garden of the Sleeping Giant",
    "Navala Village",
    "Sabeto Hot Springs"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"France": {
  famousCities: ["Paris", "Lyon", "Marseille"],
  famousPlaces: [
    "Eiffel Tower",
    "Louvre Museum",
    "Mont Saint-Michel",
    "Palace of Versailles",
    "Notre-Dame Cathedral"
  ],
  bordering: ["Belgium", "Luxembourg", "Germany", "Switzerland", "Italy", "Spain", "Andorra", "Monaco"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Faroe Islands": {
  famousCities: ["Torshavn", "Klaksvík", "Runavík"],
  famousPlaces: [
    "Mulafossur Waterfall",
    "Saksun Village",
    "Kallur Lighthouse",
    "Vestmanna Sea Cliffs",
    "Gjógv"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Micronesia, Fed. Sts.": {
  famousCities: ["Palikir", "Kolonia", "Weno"],
  famousPlaces: [
    "Nan Madol Ruins",
    "Kepirohi Waterfall",
    "Sokehs Rock",
    "Lelu Ruins",
    "Pohnpei Lagoon"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Gabon": {
  famousCities: ["Libreville", "Port-Gentil", "Franceville"],
  famousPlaces: [
    "Loango National Park",
    "Akanda National Park",
    "Pongara National Park",
    "Lékédi Park",
    "St. Michael Cathedral"
  ],
  bordering: ["Cameroon", "Equatorial Guinea", "Republic of the Congo"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Georgia": {
  famousCities: ["Tbilisi", "Batumi", "Kutaisi"],
  famousPlaces: [
    "Narikala Fortress",
    "Svetitskhoveli Cathedral",
    "Gergeti Trinity Church",
    "Batumi Boulevard",
    "Uplistsikhe"
  ],
  bordering: ["Armenia", "Azerbaijan", "Russia", "Turkey"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Ghana": {
  famousCities: ["Accra", "Kumasi", "Tamale"],
  famousPlaces: [
    "Cape Coast Castle",
    "Kakum National Park",
    "Elmina Castle",
    "Mole National Park",
    "Independence Arch"
  ],
  bordering: ["Burkina Faso", "Côte d'Ivoire", "Togo"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Guinea": {
  famousCities: ["Conakry", "Nzérékoré", "Kankan"],
  famousPlaces: [
    "Mount Nimba",
    "Conakry Grand Mosque",
    "Iles de Los",
    "Fouta Djallon Highlands",
    "Soumba Waterfalls"
  ],
  bordering: ["Côte d'Ivoire", "Guinea-Bissau", "Liberia", "Mali", "Senegal", "Sierra Leone"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Gambia, The": {
  famousCities: ["Banjul", "Serrekunda", "Brikama"],
  famousPlaces: [
    "Kachikally Crocodile Pool",
    "Abuko Nature Reserve",
    "Kunta Kinteh Island",
    "Bijilo Forest Park",
    "Albert Market"
  ],
  bordering: ["Senegal"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Guinea-Bissau": {
  famousCities: ["Bissau", "Bafatá", "Gabú"],
  famousPlaces: [
    "Bissagos Islands",
    "Bolama",
    "Orango Island National Park",
    "Fortaleza d'Amura",
    "Cacheu"
  ],
  bordering: ["Guinea", "Senegal"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Equatorial Guinea": {
  famousCities: ["Malabo", "Bata", "Ebebiyin"],
  famousPlaces: [
    "Pico Basile",
    "Bioko Island beaches",
    "Bata Cathedral",
    "Monte Alen National Park",
    "Equatorial Guinea Cultural Centre"
  ],
  bordering: ["Cameroon", "Gabon"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Greece": {
  famousCities: ["Athens", "Thessaloniki", "Patras"],
  famousPlaces: [
    "Acropolis of Athens",
    "Santorini",
    "Delphi Ruins",
    "Meteora Monasteries",
    "Parthenon"
  ],
  bordering: ["Albania", "Bulgaria", "North Macedonia", "Turkey"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Grenada": {
  famousCities: ["Saint George's", "Gouyave", "Grenville"],
  famousPlaces: [
    "Grand Anse Beach",
    "Fort George",
    "Annandale Falls",
    "Underwater Sculpture Park",
    "Belmont Estate"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Greenland": {
  famousCities: ["Nuuk", "Sisimiut", "Ilulissat"],
  famousPlaces: [
    "Ilulissat Icefjord",
    "Greenland National Museum",
    "Disko Bay",
    "Qaqortoq",
    "Kangerlussuaq"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Guatemala": {
  famousCities: ["Guatemala City", "Quetzaltenango", "Escuintla"],
  famousPlaces: [
    "Tikal",
    "Lake Atitlán",
    "Pacaya Volcano",
    "Antigua Guatemala",
    "Semuc Champey"
  ],
  bordering: ["Belize", "El Salvador", "Honduras", "Mexico"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Guam": {
  famousCities: ["Hagåtña", "Dededo", "Tamuning"],
  famousPlaces: [
    "Two Lovers Point",
    "Tumon Beach",
    "War in the Pacific National Park",
    "Latte Stone Park",
    "Cetti Bay Overlook"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Guyana": {
  famousCities: ["Georgetown", "Linden", "New Amsterdam"],
  famousPlaces: [
    "Kaieteur Falls",
    "St. George's Cathedral",
    "Shell Beach",
    "Iwokrama Forest",
    "Orinduik Falls"
  ],
  bordering: ["Brazil", "Suriname", "Venezuela"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Honduras": {
  famousCities: ["Tegucigalpa", "San Pedro Sula", "La Ceiba"],
  famousPlaces: [
    "Copán Ruins",
    "Roatán Island",
    "Cusuco National Park",
    "La Tigra National Park",
    "Lake Yojoa"
  ],
  bordering: ["El Salvador", "Guatemala", "Nicaragua"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Croatia": {
  famousCities: ["Zagreb", "Split", "Dubrovnik"],
  famousPlaces: [
    "Plitvice Lakes",
    "Dubrovnik Old Town",
    "Diocletian's Palace",
    "Krka National Park",
    "Hvar Island"
  ],
  bordering: ["Bosnia and Herzegovina", "Hungary", "Montenegro", "Serbia", "Slovenia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Haiti": {
  famousCities: ["Port-au-Prince", "Cap-Haïtien", "Les Cayes"],
  famousPlaces: [
    "Citadelle Laferrière",
    "Sans-Souci Palace",
    "Labadee",
    "Bassin Bleu",
    "Iron Market"
  ],
  bordering: ["Dominican Republic"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Hungary": {
  famousCities: ["Budapest", "Debrecen", "Szeged"],
  famousPlaces: [
    "Buda Castle",
    "Parliament Building",
    "Lake Balaton",
    "Fisherman's Bastion",
    "Heroes' Square"
  ],
  bordering: ["Austria", "Croatia", "Romania", "Serbia", "Slovakia", "Slovenia", "Ukraine"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Indonesia": {
  famousCities: ["Jakarta", "Surabaya", "Bandung"],
  famousPlaces: [
    "Borobudur",
    "Komodo National Park",
    "Mount Bromo",
    "Tanah Lot",
    "Lake Toba"
  ],
  bordering: ["East Timor", "Malaysia", "Papua New Guinea"],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Isle of Man": {
  famousCities: ["Douglas", "Ramsey", "Peel"],
  famousPlaces: [
    "Laxey Wheel",
    "Castle Rushen",
    "Peel Castle",
    "TT Mountain Course",
    "Gaiety Theatre"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Ireland": {
  famousCities: ["Dublin", "Cork", "Galway"],
  famousPlaces: [
    "Cliffs of Moher",
    "Guinness Storehouse",
    "Ring of Kerry",
    "Trinity College",
    "Blarney Castle"
  ],
  bordering: ["United Kingdom"],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Iran, Islamic Rep.": {
  famousCities: ["Tehran", "Isfahan", "Shiraz"],
  famousPlaces: [
    "Persepolis",
    "Nasir al-Mulk Mosque",
    "Azadi Tower",
    "Golestan Palace",
    "Naqsh-e Jahan Square"
  ],
  bordering: ["Afghanistan", "Armenia", "Azerbaijan", "Iraq", "Pakistan", "Turkey", "Turkmenistan"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Iraq": {
  famousCities: ["Baghdad", "Basra", "Mosul"],
  famousPlaces: [
    "Ziggurat of Ur",
    "Al-Mutanabbi Street",
    "Imam Husayn Shrine",
    "Erbil Citadel",
    "Al-Shaheed Monument"
  ],
  bordering: ["Iran", "Jordan", "Kuwait", "Saudi Arabia", "Syria", "Turkey"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Iceland": {
  famousCities: ["Reykjavik", "Akureyri", "Selfoss"],
  famousPlaces: [
    "Blue Lagoon",
    "Golden Circle",
    "Jökulsárlón Glacier Lagoon",
    "Hallgrímskirkja",
    "Thingvellir National Park"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Israel": {
  famousCities: ["Tel Aviv", "Jerusalem", "Haifa"],
  famousPlaces: [
    "Western Wall",
    "Dome of the Rock",
    "Dead Sea",
    "Baháʼí Gardens",
    "Masada"
  ],
  bordering: ["Egypt", "Jordan", "Lebanon", "Syria"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Italy": {
  famousCities: ["Rome", "Milan", "Venice"],
  famousPlaces: [
    "Colosseum",
    "Leaning Tower of Pisa",
    "Venice Canals",
    "Florence Cathedral",
    "Pompeii"
  ],
  bordering: ["Austria", "France", "San Marino", "Slovenia", "Switzerland", "Vatican City"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Jamaica": {
  famousCities: ["Kingston", "Montego Bay", "Ocho Rios"],
  famousPlaces: [
    "Dunn's River Falls",
    "Blue Mountains",
    "Bob Marley Museum",
    "Seven Mile Beach",
    "Port Royal"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Jordan": {
  famousCities: ["Amman", "Zarqa", "Irbid"],
  famousPlaces: [
    "Petra",
    "Wadi Rum",
    "Dead Sea",
    "Jerash Ruins",
    "Amman Citadel"
  ],
  bordering: ["Iraq", "Israel", "Saudi Arabia", "Syria"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Japan": {
  famousCities: ["Tokyo", "Osaka", "Kyoto"],
  famousPlaces: [
    "Mount Fuji",
    "Fushimi Inari Shrine",
    "Himeji Castle",
    "Tokyo Skytree",
    "Itsukushima Shrine"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Kazakhstan": {
  famousCities: ["Astana (Nur-Sultan)", "Almaty", "Shymkent"],
  famousPlaces: [
    "Bayterek Tower",
    "Charyn Canyon",
    "Kok Tobe",
    "Hazrat Sultan Mosque",
    "Medeu Ice Rink"
  ],
  bordering: ["China", "Kyrgyzstan", "Russia", "Turkmenistan", "Uzbekistan"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Kenya": {
  famousCities: ["Nairobi", "Mombasa", "Kisumu"],
  famousPlaces: [
    "Maasai Mara",
    "Mount Kenya",
    "Diani Beach",
    "Nairobi National Park",
    "Lake Nakuru"
  ],
  bordering: ["Ethiopia", "Somalia", "South Sudan", "Tanzania", "Uganda"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Kyrgyz Republic": {
  famousCities: ["Bishkek", "Osh", "Jalal-Abad"],
  famousPlaces: [
    "Issyk-Kul Lake",
    "Ala Archa National Park",
    "Burana Tower",
    "Osh Bazaar",
    "Tash Rabat"
  ],
  bordering: ["China", "Kazakhstan", "Tajikistan", "Uzbekistan"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Cambodia": {
  famousCities: ["Phnom Penh", "Siem Reap", "Battambang"],
  famousPlaces: [
    "Angkor Wat",
    "Royal Palace",
    "Tonle Sap",
    "Ta Prohm",
    "Bayon Temple"
  ],
  bordering: ["Laos", "Thailand", "Vietnam"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Kiribati": {
  famousCities: ["Tarawa", "Betio", "Bairiki"],
  famousPlaces: [
    "Ambo Island",
    "Kiribati Parliament",
    "Red Beach WWII Sites",
    "Bikeman Island",
    "Lagoon Viewpoints"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"St. Kitts and Nevis": {
  famousCities: ["Basseterre", "Charlestown"],
  famousPlaces: [
    "Brimstone Hill Fortress",
    "Pinney's Beach",
    "Black Rocks",
    "Nevis Peak",
    "Romney Manor"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Korea, Rep.": {
  famousCities: ["Seoul", "Busan", "Incheon"],
  famousPlaces: [
    "Gyeongbokgung Palace",
    "N Seoul Tower",
    "Bukchon Hanok Village",
    "Jeju Island",
    "Changdeokgung"
  ],
  bordering: ["North Korea"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Kuwait": {
  famousCities: ["Kuwait City", "Al Ahmadi", "Hawalli"],
  famousPlaces: [
    "Kuwait Towers",
    "Grand Mosque",
    "Souk Al-Mubarakiya",
    "Failaka Island",
    "Al Shaheed Park"
  ],
  bordering: ["Iraq", "Saudi Arabia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Lebanon": {
  famousCities: ["Beirut", "Tripoli", "Sidon"],
  famousPlaces: [
    "Jeita Grotto",
    "Byblos",
    "Baalbek Ruins",
    "Pigeon Rocks",
    "National Museum of Beirut"
  ],
  bordering: ["Israel", "Syria"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Liberia": {
  famousCities: ["Monrovia", "Gbarnga", "Buchanan"],
  famousPlaces: [
    "Sapo National Park",
    "Providence Island",
    "Mount Nimba",
    "Centennial Pavilion",
    "Ce Ce Beach"
  ],
  bordering: ["Côte d'Ivoire", "Guinea", "Sierra Leone"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Libya": {
  famousCities: ["Tripoli", "Benghazi", "Misrata"],
  famousPlaces: [
    "Leptis Magna",
    "Cyrene",
    "Red Castle Museum",
    "Ghadames",
    "Jebel Akhdar"
  ],
  bordering: ["Algeria", "Chad", "Egypt", "Niger", "Sudan", "Tunisia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"St. Lucia": {
  famousCities: ["Castries", "Soufrière", "Vieux Fort"],
  famousPlaces: [
    "Pitons",
    "Sulphur Springs",
    "Marigot Bay",
    "Pigeon Island",
    "Anse Chastanet Beach"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Liechtenstein": {
  famousCities: ["Vaduz", "Schaan", "Balzers"],
  famousPlaces: [
    "Vaduz Castle",
    "Gutenberg Castle",
    "Kunstmuseum Liechtenstein",
    "Malbun Ski Resort",
    "Red House"
  ],
  bordering: ["Austria", "Switzerland"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Sri Lanka": {
  famousCities: ["Colombo", "Kandy", "Galle"],
  famousPlaces: [
    "Sigiriya Rock Fortress",
    "Temple of the Tooth",
    "Yala National Park",
    "Galle Fort",
    "Adam's Peak"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Lesotho": {
  famousCities: ["Maseru", "Teyateyaneng", "Mafeteng"],
  famousPlaces: [
    "Maletsunyane Falls",
    "Thaba Bosiu",
    "Katse Dam",
    "Sani Pass",
    "Kome Cave Dwellings"
  ],
  bordering: ["South Africa"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"Lithuania": {
  famousCities: ["Vilnius", "Kaunas", "Klaipėda"],
  famousPlaces: [
    "Gediminas Tower",
    "Trakai Island Castle",
    "Hill of Crosses",
    "Vilnius Old Town",
    "Curonian Spit"
  ],
  bordering: ["Belarus", "Latvia", "Poland", "Russia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Luxembourg": {
  famousCities: ["Luxembourg City", "Esch-sur-Alzette", "Differdange"],
  famousPlaces: [
    "Vianden Castle",
    "Bock Casemates",
    "Grand Ducal Palace",
    "Mullerthal Trail",
    "Notre-Dame Cathedral"
  ],
  bordering: ["Belgium", "France", "Germany"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Latvia": {
  famousCities: ["Riga", "Daugavpils", "Liepāja"],
  famousPlaces: [
    "Riga Old Town",
    "Jurmala Beach",
    "Gauja National Park",
    "Turaida Castle",
    "Freedom Monument"
  ],
  bordering: ["Belarus", "Estonia", "Lithuania", "Russia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"St. Martin (French part)": {
  famousCities: ["Marigot", "Grand Case"],
  famousPlaces: [
    "Fort Louis",
    "Orient Bay",
    "Marigot Market",
    "Pinel Island",
    "Loterie Farm"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Morocco": {
  famousCities: ["Rabat", "Casablanca", "Marrakech"],
  famousPlaces: [
    "Jemaa el-Fnaa",
    "Hassan II Mosque",
    "Chefchaouen",
    "Ait Benhaddou",
    "Atlas Mountains"
  ],
  bordering: ["Algeria", "Spain (Ceuta/Melilla)"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Monaco": {
  famousCities: ["Monaco"],
  famousPlaces: [
    "Monte Carlo Casino",
    "Prince's Palace",
    "Oceanographic Museum",
    "Monaco Grand Prix",
    "Larvotto Beach"
  ],
  bordering: ["France"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Moldova": {
  famousCities: ["Chisinau", "Tiraspol", "Bălți"],
  famousPlaces: [
    "Orheiul Vechi",
    "Stephen the Great Park",
    "Cricova Winery",
    "Capriana Monastery",
    "National Museum of History"
  ],
  bordering: ["Romania", "Ukraine"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Madagascar": {
  famousCities: ["Antananarivo", "Toamasina", "Antsirabe"],
  famousPlaces: [
    "Avenue of the Baobabs",
    "Isalo National Park",
    "Andasibe-Mantadia",
    "Nosy Be Island",
    "Royal Hill of Ambohimanga"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Maldives": {
  famousCities: ["Male", "Hithadhoo", "Kulhudhuffushi"],
  famousPlaces: [
    "Malé Friday Mosque",
    "Banana Reef",
    "Maafushi Island",
    "Sun Island",
    "Veligandu Island Beach"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Mexico": {
  famousCities: ["Mexico City", "Guadalajara", "Monterrey"],
  famousPlaces: [
    "Chichen Itza",
    "Teotihuacan",
    "Cancun Beaches",
    "Copper Canyon",
    "Frida Kahlo Museum"
  ],
  bordering: ["Belize", "Guatemala", "United States"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Marshall Islands": {
  famousCities: ["Majuro", "Ebeye", "Jaluit"],
  famousPlaces: [
    "Bikini Atoll",
    "Majuro Lagoon",
    "Arno Atoll",
    "Alele Museum",
    "Laura Beach"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"North Macedonia": {
  famousCities: ["Skopje", "Bitola", "Ohrid"],
  famousPlaces: [
    "Lake Ohrid",
    "Kaneo Church",
    "Stone Bridge",
    "Millennium Cross",
    "Matka Canyon"
  ],
  bordering: ["Albania", "Bulgaria", "Greece", "Kosovo", "Serbia"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Mali": {
  famousCities: ["Bamako", "Sikasso", "Mopti"],
  famousPlaces: [
    "Djenné Mosque",
    "Timbuktu",
    "Dogon Country",
    "Bandiagara Escarpment",
    "National Museum of Mali"
  ],
  bordering: ["Algeria", "Burkina Faso", "Côte d'Ivoire", "Guinea", "Mauritania", "Niger", "Senegal"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Malta": {
  famousCities: ["Valletta", "Sliema", "Birkirkara"],
  famousPlaces: [
    "St. John's Co-Cathedral",
    "Mdina",
    "Blue Lagoon",
    "Hagar Qim",
    "Grand Harbour"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Myanmar": {
  famousCities: ["Naypyidaw", "Yangon", "Mandalay"],
  famousPlaces: [
    "Shwedagon Pagoda",
    "Bagan Temples",
    "Inle Lake",
    "U Bein Bridge",
    "Ngapali Beach"
  ],
  bordering: ["Bangladesh", "China", "India", "Laos", "Thailand"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Montenegro": {
  famousCities: ["Podgorica", "Nikšić", "Herceg Novi"],
  famousPlaces: [
    "Kotor Bay",
    "Sveti Stefan",
    "Durmitor National Park",
    "Ostrog Monastery",
    "Biogradska Gora"
  ],
  bordering: ["Albania", "Bosnia and Herzegovina", "Croatia", "Kosovo", "Serbia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Mongolia": {
  famousCities: ["Ulaanbaatar", "Erdenet", "Darkhan"],
  famousPlaces: [
    "Gobi Desert",
    "Genghis Khan Statue",
    "Khuvsgul Lake",
    "Orkhon Valley",
    "Erdene Zuu Monastery"
  ],
  bordering: ["China", "Russia"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Northern Mariana Islands": {
  famousCities: ["Saipan", "Tinian", "Rota"],
  famousPlaces: [
    "Managaha Island",
    "Bird Island",
    "American Memorial Park",
    "Grotto Dive Site",
    "Suicide Cliff"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Mozambique": {
  famousCities: ["Maputo", "Beira", "Nampula"],
  famousPlaces: [
    "Bazaruto Archipelago",
    "Gorongosa National Park",
    "Tofo Beach",
    "Ilha de Mozambique",
    "Maputo Railway Station"
  ],
  bordering: ["Eswatini", "Malawi", "South Africa", "Tanzania", "Zambia", "Zimbabwe"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Mauritania": {
  famousCities: ["Nouakchott", "Nouadhibou", "Rosso"],
  famousPlaces: [
    "Chinguetti",
    "Banc d'Arguin National Park",
    "Terjit Oasis",
    "Atar Market",
    "Richat Structure (Eye of the Sahara)"
  ],
  bordering: ["Algeria", "Mali", "Senegal", "Western Sahara"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Mauritius": {
  famousCities: ["Port Louis", "Curepipe", "Quatre Bornes"],
  famousPlaces: [
    "Le Morne Brabant",
    "Chamarel Waterfall",
    "Île aux Cerfs",
    "Black River Gorges",
    "Grand Bassin"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Malawi": {
  famousCities: ["Lilongwe", "Blantyre", "Mzuzu"],
  famousPlaces: [
    "Lake Malawi",
    "Liwonde National Park",
    "Mount Mulanje",
    "Cape Maclear",
    "Nyika Plateau"
  ],
  bordering: ["Mozambique", "Tanzania", "Zambia"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"Malaysia": {
  famousCities: ["Kuala Lumpur", "George Town", "Johor Bahru"],
  famousPlaces: [
    "Petronas Towers",
    "Langkawi",
    "Mount Kinabalu",
    "Cameron Highlands",
    "Penang Street Art"
  ],
  bordering: ["Brunei", "Indonesia", "Thailand"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Namibia": {
  famousCities: ["Windhoek", "Walvis Bay", "Swakopmund"],
  famousPlaces: [
    "Etosha National Park",
    "Sossusvlei Dunes",
    "Skeleton Coast",
    "Fish River Canyon",
    "Cape Cross"
  ],
  bordering: ["Angola", "Botswana", "South Africa", "Zambia"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Niger": {
  famousCities: ["Niamey", "Zinder", "Maradi"],
  famousPlaces: [
    "Air Mountains",
    "W National Park",
    "Agadez Grand Mosque",
    "Tenere Desert",
    "Zinder Sultan's Palace"
  ],
  bordering: ["Algeria", "Benin", "Burkina Faso", "Chad", "Libya", "Mali", "Nigeria"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Nigeria": {
  famousCities: ["Lagos", "Abuja", "Kano"],
  famousPlaces: [
    "Zuma Rock",
    "Olumo Rock",
    "Yankari National Park",
    "Nike Art Gallery",
    "Erin Ijesha Waterfall"
  ],
  bordering: ["Benin", "Cameroon", "Chad", "Niger"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Nicaragua": {
  famousCities: ["Managua", "León", "Granada"],
  famousPlaces: [
    "Ometepe Island",
    "Masaya Volcano",
    "Cerro Negro",
    "Granada Cathedral",
    "Corn Islands"
  ],
  bordering: ["Costa Rica", "Honduras"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Netherlands": {
  famousCities: ["Amsterdam", "Rotterdam", "The Hague"],
  famousPlaces: [
    "Rijksmuseum",
    "Keukenhof Gardens",
    "Kinderdijk Windmills",
    "Anne Frank House",
    "Van Gogh Museum"
  ],
  bordering: ["Belgium", "Germany"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Norway": {
  famousCities: ["Oslo", "Bergen", "Trondheim"],
  famousPlaces: [
    "Geirangerfjord",
    "Lofoten Islands",
    "Vigeland Park",
    "Bryggen Wharf",
    "Preikestolen (Pulpit Rock)"
  ],
  bordering: ["Finland", "Russia", "Sweden"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Nepal": {
  famousCities: ["Kathmandu", "Pokhara", "Lalitpur"],
  famousPlaces: [
    "Mount Everest",
    "Pashupatinath Temple",
    "Chitwan National Park",
    "Boudhanath Stupa",
    "Bhaktapur Durbar Square"
  ],
  bordering: ["China", "India"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Nauru": {
  famousCities: ["Yaren District"],
  famousPlaces: [
    "Buada Lagoon",
    "Command Ridge",
    "Anibare Bay",
    "Moqua Caves",
    "Nauru Civic Center"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"New Zealand": {
  famousCities: ["Auckland", "Wellington", "Christchurch"],
  famousPlaces: [
    "Milford Sound",
    "Hobbiton",
    "Tongariro National Park",
    "Bay of Islands",
    "Franz Josef Glacier"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Oman": {
  famousCities: ["Muscat", "Salalah", "Sohar"],
  famousPlaces: [
    "Sultan Qaboos Grand Mosque",
    "Wahiba Sands",
    "Mutrah Souq",
    "Nizwa Fort",
    "Jebel Shams"
  ],
  bordering: ["Saudi Arabia", "United Arab Emirates", "Yemen"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Pakistan": {
  famousCities: ["Islamabad", "Karachi", "Lahore"],
  famousPlaces: [
    "Badshahi Mosque",
    "Faisal Mosque",
    "K2",
    "Lahore Fort",
    "Hunza Valley"
  ],
  bordering: ["Afghanistan", "China", "India", "Iran"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Palestine": {
  famousCities: ["Jerusalem", "Gaza City", "Hebron"],
  famousPlaces: [
    "Al-Aqsa Mosque",
    "Church of the Nativity",
    "Dome of the Rock",
    "Hisham's Palace",
    "Wadi Qelt"
  ],
  bordering: ["Egypt", "Israel", "Jordan"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Panama": {
  famousCities: ["Panama City", "Colón", "David"],
  famousPlaces: [
    "Panama Canal",
    "San Blas Islands",
    "Casco Viejo",
    "Biomuseo",
    "Bocas del Toro"
  ],
  bordering: ["Colombia", "Costa Rica"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Peru": {
  famousCities: ["Lima", "Cusco", "Arequipa"],
  famousPlaces: [
    "Machu Picchu",
    "Sacred Valley",
    "Nazca Lines",
    "Lake Titicaca",
    "Colca Canyon"
  ],
  bordering: ["Bolivia", "Brazil", "Chile", "Colombia", "Ecuador"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Philippines": {
  famousCities: ["Manila", "Cebu", "Davao"],
  famousPlaces: [
    "Chocolate Hills",
    "Banaue Rice Terraces",
    "Boracay Island",
    "Mayon Volcano",
    "Taal Volcano"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Palau": {
  famousCities: ["Koror", "Ngerulmud"],
  famousPlaces: [
    "Rock Islands",
    "Jellyfish Lake",
    "Ngardmau Waterfall",
    "Belau National Museum",
    "Bai of Aimeliik"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Papua New Guinea": {
  famousCities: ["Port Moresby", "Lae", "Mount Hagen"],
  famousPlaces: [
    "Kokoda Track",
    "Tufi Fjords",
    "Varirata National Park",
    "National Museum Port Moresby",
    "Rabaul Volcano"
  ],
  bordering: ["Indonesia"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Poland": {
  famousCities: ["Warsaw", "Krakow", "Gdansk"],
  famousPlaces: [
    "Wawel Castle",
    "Auschwitz-Birkenau",
    "Old Town Warsaw",
    "Białowieża Forest",
    "Malbork Castle"
  ],
  bordering: ["Belarus", "Czechia", "Germany", "Lithuania", "Russia", "Slovakia", "Ukraine"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Puerto Rico": {
  famousCities: ["San Juan", "Ponce", "Mayagüez"],
  famousPlaces: [
    "El Yunque National Forest",
    "Old San Juan",
    "Castillo San Felipe del Morro",
    "Culebra Island",
    "Camuy Caves"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Korea, Dem. Peoples Rep.": {
  famousCities: ["Pyongyang", "Hamhung", "Chongjin"],
  famousPlaces: [
    "Juche Tower",
    "Arch of Triumph",
    "Kumsusan Palace",
    "Mount Paektu",
    "Victorious Fatherland War Museum"
  ],
  bordering: ["China", "Russia", "South Korea"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Portugal": {
  famousCities: ["Lisbon", "Porto", "Coimbra"],
  famousPlaces: [
    "Belém Tower",
    "Douro Valley",
    "Sintra",
    "Jerónimos Monastery",
    "Madeira"
  ],
  bordering: ["Spain"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Paraguay": {
  famousCities: ["Asunción", "Ciudad del Este", "Encarnación"],
  famousPlaces: [
    "Itaipu Dam",
    "Jesuit Missions",
    "Cerro Cora National Park",
    "Palacio de los López",
    "Ñacunday Falls"
  ],
  bordering: ["Argentina", "Bolivia", "Brazil"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"French Polynesia": {
  famousCities: ["Papeete", "Faaa", "Punaauia"],
  famousPlaces: [
    "Bora Bora",
    "Moorea",
    "Tahiti Island",
    "Matira Beach",
    "Fautaua Waterfall"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Qatar": {
  famousCities: ["Doha", "Al Rayyan", "Al Wakrah"],
  famousPlaces: [
    "Museum of Islamic Art",
    "Souq Waqif",
    "The Pearl-Qatar",
    "Katara Cultural Village",
    "Aspire Park"
  ],
  bordering: ["Saudi Arabia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Romania": {
  famousCities: ["Bucharest", "Cluj-Napoca", "Timișoara"],
  famousPlaces: [
    "Bran Castle",
    "Palace of the Parliament",
    "Transfagarasan Highway",
    "Painted Monasteries of Bucovina",
    "Sighisoara"
  ],
  bordering: ["Bulgaria", "Hungary", "Moldova", "Serbia", "Ukraine"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Russia": {
  famousCities: ["Moscow", "Saint Petersburg", "Novosibirsk"],
  famousPlaces: [
    "Red Square",
    "Lake Baikal",
    "Kremlin",
    "Hermitage Museum",
    "St. Basil's Cathedral"
  ],
  bordering: ["Azerbaijan", "Belarus", "China", "Estonia", "Finland", "Georgia", "Kazakhstan", "North Korea", "Latvia", "Lithuania", "Mongolia", "Norway", "Poland", "Ukraine"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Rwanda": {
  famousCities: ["Kigali", "Butare", "Gisenyi"],
  famousPlaces: [
    "Volcanoes National Park",
    "Kigali Genocide Memorial",
    "Lake Kivu",
    "Nyungwe Forest",
    "Akagera National Park"
  ],
  bordering: ["Burundi", "Congo, Dem. Rep.", "Tanzania", "Uganda"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"Saudi Arabia": {
  famousCities: ["Riyadh", "Jeddah", "Mecca"],
  famousPlaces: [
    "Masjid al-Haram",
    "Al-Masjid an-Nabawi",
    "Edge of the World",
    "Diriyah",
    "Al-Ula"
  ],
  bordering: ["Iraq", "Jordan", "Kuwait", "Oman", "Qatar", "UAE", "Yemen"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Sudan": {
  famousCities: ["Khartoum", "Omdurman", "Port Sudan"],
  famousPlaces: [
    "Meroe Pyramids",
    "National Museum",
    "Tuti Island",
    "Jebel Barkal",
    "Suakin"
  ],
  bordering: ["Central African Republic", "Chad", "Egypt", "Eritrea", "Ethiopia", "Libya", "South Sudan"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Senegal": {
  famousCities: ["Dakar", "Touba", "Thiès"],
  famousPlaces: [
    "Gorée Island",
    "Lake Retba",
    "African Renaissance Monument",
    "Niokolo-Koba Park",
    "Djoudj Bird Sanctuary"
  ],
  bordering: ["Gambia", "Guinea", "Guinea-Bissau", "Mali", "Mauritania"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Singapore": {
  famousCities: ["Singapore"],
  famousPlaces: [
    "Marina Bay Sands",
    "Gardens by the Bay",
    "Sentosa Island",
    "Merlion Park",
    "Singapore Zoo"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Solomon Islands": {
  famousCities: ["Honiara", "Gizo", "Auki"],
  famousPlaces: [
    "Bonegi Beach",
    "Tulagi Island",
    "Mataniko Falls",
    "Skull Island",
    "Tenaru Falls"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Sierra Leone": {
  famousCities: ["Freetown", "Bo", "Kenema"],
  famousPlaces: [
    "Tacugama Chimpanzee Sanctuary",
    "Banana Islands",
    "River Number Two Beach",
    "National Museum",
    "Outamba-Kilimi Park"
  ],
  bordering: ["Guinea", "Liberia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"El Salvador": {
  famousCities: ["San Salvador", "Santa Ana", "Soyapango"],
  famousPlaces: [
    "Santa Ana Volcano",
    "Ruta de las Flores",
    "Joya de Cerén",
    "El Tunco Beach",
    "San Salvador Cathedral"
  ],
  bordering: ["Guatemala", "Honduras"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"San Marino": {
  famousCities: ["San Marino"],
  famousPlaces: [
    "Guaita Tower",
    "Cesta Tower",
    "Basilica di San Marino",
    "Piazza della Libertà",
    "Monte Titano"
  ],
  bordering: ["Italy"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Somalia": {
  famousCities: ["Mogadishu", "Hargeisa", "Kismayo"],
  famousPlaces: [
    "Lido Beach",
    "Laas Geel Cave Paintings",
    "Shanghai Old City",
    "Mogadishu Cathedral",
    "Bakaara Market"
  ],
  bordering: ["Djibouti", "Ethiopia", "Kenya"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Serbia": {
  famousCities: ["Belgrade", "Novi Sad", "Niš"],
  famousPlaces: [
    "Kalemegdan Fortress",
    "St. Sava Temple",
    "Đerdap National Park",
    "Petrovaradin Fortress",
    "Studenica Monastery"
  ],
  bordering: ["Bosnia and Herzegovina", "Bulgaria", "Croatia", "Hungary", "Kosovo", "Montenegro", "North Macedonia", "Romania"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"South Sudan": {
  famousCities: ["Juba", "Wau", "Malakal"],
  famousPlaces: [
    "Boma National Park",
    "Nimule National Park",
    "All Saints Cathedral Juba",
    "Sudd Wetlands",
    "Mount Kinyeti"
  ],
  bordering: ["Central African Republic", "Democratic Republic of the Congo", "Ethiopia", "Kenya", "Sudan", "Uganda"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Sao Tome and Principe": {
  famousCities: ["São Tomé", "Santo António"],
  famousPlaces: [
    "Pico Cão Grande",
    "Obô National Park",
    "Roça Agostinho Neto",
    "Praia Jale",
    "São Sebastião Museum"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Suriname": {
  famousCities: ["Paramaribo", "Lelydorp", "Nieuw Nickerie"],
  famousPlaces: [
    "Central Suriname Nature Reserve",
    "Saint Peter and Paul Cathedral",
    "Brownsberg",
    "Commewijne Plantations",
    "Fort Zeelandia"
  ],
  bordering: ["Brazil", "French Guiana", "Guyana"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Slovak Republic": {
  famousCities: ["Bratislava", "Košice", "Prešov"],
  famousPlaces: [
    "Bratislava Castle",
    "High Tatras",
    "Spiš Castle",
    "Bojnice Castle",
    "Demänovská Cave of Liberty"
  ],
  bordering: ["Austria", "Czechia", "Hungary", "Poland", "Ukraine"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Slovenia": {
  famousCities: ["Ljubljana", "Maribor", "Celje"],
  famousPlaces: [
    "Lake Bled",
    "Predjama Castle",
    "Postojna Cave",
    "Triglav National Park",
    "Ljubljana Castle"
  ],
  bordering: ["Austria", "Croatia", "Hungary", "Italy"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Sweden": {
  famousCities: ["Stockholm", "Gothenburg", "Malmö"],
  famousPlaces: [
    "Vasa Museum",
    "Gamla Stan",
    "Drottningholm Palace",
    "Abisko National Park",
    "Icehotel Jukkasjärvi"
  ],
  bordering: ["Finland", "Norway"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Eswatini": {
  famousCities: ["Mbabane", "Manzini", "Lobamba"],
  famousPlaces: [
    "Mlilwane Wildlife Sanctuary",
    "Mantenga Cultural Village",
    "Hlane Royal National Park",
    "Sibebe Rock",
    "Swazi Market"
  ],
  bordering: ["Mozambique", "South Africa"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"Sint Maarten (Dutch part)": {
  famousCities: ["Philipsburg", "Simpson Bay"],
  famousPlaces: [
    "Maho Beach",
    "Fort Amsterdam",
    "Great Bay Beach",
    "Guana Bay",
    "Yoda Guy Movie Exhibit"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Seychelles": {
  famousCities: ["Victoria", "Beau Vallon"],
  famousPlaces: [
    "Anse Source d'Argent",
    "Vallée de Mai",
    "Curieuse Island",
    "Morne Seychellois",
    "Anse Lazio"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Syria": {
  famousCities: ["Damascus", "Aleppo", "Homs"],
  famousPlaces: [
    "Umayyad Mosque",
    "Krak des Chevaliers",
    "Ancient City of Palmyra",
    "Aleppo Citadel",
    "Bosra Roman Theatre"
  ],
  bordering: ["Iraq", "Israel", "Jordan", "Lebanon", "Turkey"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Turks and Caicos Islands": {
  famousCities: ["Grand Turk", "Providenciales"],
  famousPlaces: [
    "Grace Bay Beach",
    "Chalk Sound",
    "Grand Turk Lighthouse",
    "Salt Cay",
    "Conch Bar Caves"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Chad": {
  famousCities: ["N'Djamena", "Moundou", "Sarh"],
  famousPlaces: [
    "Zacouma National Park",
    "Lake Chad",
    "Ennedi Plateau",
    "Gaoui Village",
    "Chari River"
  ],
  bordering: ["Cameroon", "Central African Republic", "Libya", "Niger", "Nigeria", "Sudan"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Togo": {
  famousCities: ["Lomé", "Sokodé", "Kara"],
  famousPlaces: [
    "Koutammakou",
    "Lomé Grand Market",
    "Togo National Museum",
    "Cascade de Womé",
    "Tamberma Valley"
  ],
  bordering: ["Benin", "Burkina Faso", "Ghana"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Thailand": {
  famousCities: ["Bangkok", "Chiang Mai", "Phuket"],
  famousPlaces: [
    "Grand Palace",
    "Phi Phi Islands",
    "Ayutthaya",
    "Chiang Mai Temples",
    "Railay Beach"
  ],
  bordering: ["Cambodia", "Laos", "Malaysia", "Myanmar"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Tajikistan": {
  famousCities: ["Dushanbe", "Khujand", "Kulob"],
  famousPlaces: [
    "Iskanderkul Lake",
    "Fann Mountains",
    "Hisor Fortress",
    "Pamir Highway",
    "Dushanbe Flagpole"
  ],
  bordering: ["Afghanistan", "China", "Kyrgyzstan", "Uzbekistan"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Turkmenistan": {
  famousCities: ["Ashgabat", "Turkmenabat", "Dashoguz"],
  famousPlaces: [
    "Darvaza Gas Crater",
    "Ancient Merv",
    "Kow Ata Cave Lake",
    "Independence Monument",
    "Erbent Desert"
  ],
  bordering: ["Afghanistan", "Iran", "Kazakhstan", "Uzbekistan"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Timor-Leste": {
  famousCities: ["Dili", "Baucau", "Maliana"],
  famousPlaces: [
    "Atauro Island",
    "Cristo Rei",
    "Jaco Island",
    "Tatamailau",
    "Dili Cathedral"
  ],
  bordering: ["Indonesia"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Tonga": {
  famousCities: ["Nukuʻalofa", "Neiafu", "Haveluloto"],
  famousPlaces: [
    "Mapu'a 'a Vaea Blowholes",
    "Ha'amonga 'a Maui Trilithon",
    "Royal Palace",
    "Anahulu Cave",
    "Fafa Island"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Trinidad and Tobago": {
  famousCities: ["Port of Spain", "San Fernando", "Chaguanas"],
  famousPlaces: [
    "Maracas Beach",
    "Pitch Lake",
    "Caroni Bird Sanctuary",
    "Fort George",
    "Nylon Pool"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Tunisia": {
  famousCities: ["Tunis", "Sfax", "Sousse"],
  famousPlaces: [
    "Amphitheatre of El Jem",
    "Medina of Tunis",
    "Carthage Ruins",
    "Sidi Bou Said",
    "Bardo Museum"
  ],
  bordering: ["Algeria", "Libya"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Turkiye": {
  famousCities: ["Istanbul", "Ankara", "Izmir"],
  famousPlaces: [
    "Hagia Sophia",
    "Cappadocia",
    "Pamukkale",
    "Topkapi Palace",
    "Ephesus"
  ],
  bordering: ["Armenia", "Azerbaijan", "Bulgaria", "Georgia", "Greece", "Iran", "Iraq", "Syria"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Tuvalu": {
  famousCities: ["Funafuti", "Vaiaku"],
  famousPlaces: [
    "Funafuti Conservation Area",
    "Teone Church",
    "Nanumea Atoll",
    "Lagoon Views",
    "Fongafale Island"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Tanzania": {
  famousCities: ["Dodoma", "Dar es Salaam", "Arusha"],
  famousPlaces: [
    "Mount Kilimanjaro",
    "Serengeti National Park",
    "Zanzibar",
    "Ngorongoro Crater",
    "Lake Victoria"
  ],
  bordering: ["Burundi", "Congo, Dem. Rep.", "Kenya", "Malawi", "Mozambique", "Rwanda", "Uganda", "Zambia"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Uganda": {
  famousCities: ["Kampala", "Gulu", "Mbarara"],
  famousPlaces: [
    "Bwindi Impenetrable Forest",
    "Murchison Falls",
    "Lake Victoria",
    "Queen Elizabeth National Park",
    "Source of the Nile"
  ],
  bordering: ["Congo, Dem. Rep.", "Kenya", "Rwanda", "South Sudan", "Tanzania"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Ukraine": {
  famousCities: ["Kyiv", "Kharkiv", "Odesa"],
  famousPlaces: [
    "Kyiv Pechersk Lavra",
    "Lviv Old Town",
    "Odessa Opera House",
    "Carpathian Mountains",
    "St. Sophia's Cathedral"
  ],
  bordering: ["Belarus", "Hungary", "Moldova", "Poland", "Romania", "Russia", "Slovakia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Uruguay": {
  famousCities: ["Montevideo", "Salto", "Punta del Este"],
  famousPlaces: [
    "Punta del Este Beach",
    "Ciudad Vieja Montevideo",
    "Colonia del Sacramento",
    "Mercado del Puerto",
    "Palacio Salvo"
  ],
  bordering: ["Argentina", "Brazil"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"United States of America": {
  famousCities: ["New York", "Los Angeles", "Chicago"],
  famousPlaces: [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone",
    "Mount Rushmore",
    "Golden Gate Bridge"
  ],
  bordering: ["Canada", "Mexico"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Uzbekistan": {
  famousCities: ["Tashkent", "Samarkand", "Bukhara"],
  famousPlaces: [
    "Registan",
    "Ark Fortress",
    "Chorsu Bazaar",
    "Khiva Old Town",
    "Amir Timur Museum"
  ],
  bordering: ["Afghanistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"St. Vincent and the Grenadines": {
  famousCities: ["Kingstown"],
  famousPlaces: [
    "Bequia Island",
    "Botanic Gardens",
    "La Soufrière Volcano",
    "Tobago Cays",
    "Dark View Falls"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Venezuela": {
  famousCities: ["Caracas", "Maracaibo", "Valencia"],
  famousPlaces: [
    "Angel Falls",
    "Morrocoy National Park",
    "Mérida Cable Car",
    "Los Roques",
    "Roraima Tepui"
  ],
  bordering: ["Brazil", "Colombia", "Guyana"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"British Virgin Islands": {
  famousCities: ["Road Town"],
  famousPlaces: [
    "The Baths",
    "White Bay Beach",
    "Sage Mountain",
    "Anegada Island",
    "Willy T Ship"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Virgin Islands (U.S.)": {
  famousCities: ["Charlotte Amalie"],
  famousPlaces: [
    "Magens Bay",
    "Trunk Bay",
    "Coral World",
    "Blackbeard’s Castle",
    "Buck Island"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "northern"
},
"Viet Nam": {
  famousCities: ["Hanoi", "Ho Chi Minh City", "Da Nang"],
  famousPlaces: [
    "Ha Long Bay",
    "Hoi An Ancient Town",
    "Phong Nha Caves",
    "My Son Sanctuary",
    "Cu Chi Tunnels"
  ],
  bordering: ["Cambodia", "China", "Laos"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"Vanuatu": {
  famousCities: ["Port Vila", "Luganville"],
  famousPlaces: [
    "Mount Yasur Volcano",
    "Champagne Beach",
    "Blue Holes",
    "Million Dollar Point",
    "Mele Cascades"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Samoa": {
  famousCities: ["Apia"],
  famousPlaces: [
    "To Sua Ocean Trench",
    "Lalomanu Beach",
    "Papaseea Sliding Rocks",
    "Robert Louis Stevenson Museum",
    "Piula Cave Pool"
  ],
  bordering: [],
  landlocked: false,
  island: true,
  hemisphere: "southern"
},
"Kosovo": {
  famousCities: ["Pristina", "Prizren"],
  famousPlaces: [
    "Newborn Monument",
    "Gračanica Monastery",
    "Rugova Canyon",
    "Ethnological Museum",
    "Sharr Mountains"
  ],
  bordering: ["Albania", "Montenegro", "North Macedonia", "Serbia"],
  landlocked: true,
  island: false,
  hemisphere: "northern"
},
"Yemen, Rep.": {
  famousCities: ["Sanaa", "Aden", "Taiz"],
  famousPlaces: [
    "Old City of Sana'a",
    "Socotra Island",
    "Shibam Mud Skyscrapers",
    "Al Saleh Mosque",
    "Dar al-Hajar"
  ],
  bordering: ["Oman", "Saudi Arabia"],
  landlocked: false,
  island: false,
  hemisphere: "northern"
},
"South Africa": {
  famousCities: ["Pretoria", "Cape Town", "Johannesburg"],
  famousPlaces: [
    "Table Mountain",
    "Kruger National Park",
    "Robben Island",
    "Garden Route",
    "Blyde River Canyon"
  ],
  bordering: ["Botswana", "Lesotho", "Mozambique", "Namibia", "Eswatini", "Zimbabwe"],
  landlocked: false,
  island: false,
  hemisphere: "southern"
},
"Zambia": {
  famousCities: ["Lusaka", "Kitwe", "Ndola"],
  famousPlaces: [
    "Victoria Falls",
    "South Luangwa Park",
    "Lower Zambezi Park",
    "Kafue National Park",
    "Lake Kariba"
  ],
  bordering: ["Angola", "Botswana", "Congo, Dem. Rep.", "Malawi", "Mozambique", "Namibia", "Tanzania", "Zimbabwe"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"Zimbabwe": {
  famousCities: ["Harare", "Bulawayo", "Mutare"],
  famousPlaces: [
    "Victoria Falls",
    "Great Zimbabwe Ruins",
    "Hwange National Park",
    "Lake Kariba",
    "Matobo Hills"
  ],
  bordering: ["Botswana", "Mozambique", "South Africa", "Zambia"],
  landlocked: true,
  island: false,
  hemisphere: "southern"
},
"United States": {
  "famousCities": [
    "New York",
    "Los Angeles",
    "Chicago"
  ],
  "famousPlaces": [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone"
  ],
  "bordering": [
    "Canada",
    "Mexico"
  ],
  "landlocked": false,
  "island": false,
  "hemisphere": "northern"
},
  "United States of America": {
  "famousCities": [
    "New York",
    "Los Angeles",
    "Chicago"
  ],
  "famousPlaces": [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone"
  ],
  "bordering": [
    "Canada",
    "Mexico"
  ],
  "landlocked": false,
  "island": false,
  "hemisphere": "northern"
},
  "USA": {
  "famousCities": [
    "New York",
    "Los Angeles",
    "Chicago"
  ],
  "famousPlaces": [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone"
  ],
  "bordering": [
    "Canada",
    "Mexico"
  ],
  "landlocked": false,
  "island": false,
  "hemisphere": "northern"
},
  "Turkiye": {
  "famousCities": [
    "Istanbul",
    "Ankara",
    "Izmir"
  ],
  "famousPlaces": [
    "Hagia Sophia",
    "Cappadocia",
    "Pamukkale"
  ],
  "bordering": [
    "Armenia",
    "Azerbaijan",
    "Bulgaria",
    "Georgia",
    "Greece",
    "Iran",
    "Iraq",
    "Syria"
  ],
  "landlocked": false,
  "island": false,
  "hemisphere": "northern"
},
  "Turkey": {
  "famousCities": [
    "Istanbul",
    "Ankara",
    "Izmir"
  ],
  "famousPlaces": [
    "Hagia Sophia",
    "Cappadocia",
    "Pamukkale"
  ],
  "bordering": [
    "Armenia",
    "Azerbaijan",
    "Bulgaria",
    "Georgia",
    "Greece",
    "Iran",
    "Iraq",
    "Syria"
  ],
  "landlocked": false,
  "island": false,
  "hemisphere": "northern"
}

};

export default countryExtra; 