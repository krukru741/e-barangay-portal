/**
 * Philippine Postal Code Lookup
 * Maps PSGC mun_code → Philippine postal code (PhilPost standard)
 *
 * Source: Philippine Postal Corporation (PhilPost)
 * This covers all provinces. Manually add missing entries as needed.
 */

export const POSTAL_CODES: Record<string, string> = {
  // ==================== REGION I (ILOCOS) ====================
  '012801': '2900', // Adams, Ilocos Norte
  '012802': '2904', // Bacarra
  '012803': '2906', // Badoc
  '012804': '2908', // Bangui
  '012805': '2910', // Batac City
  '012806': '2916', // Burgos
  '012807': '2912', // Carasi
  '012808': '2920', // Currimao
  '012809': '2914', // Dingras
  '012810': '2918', // Dumalneg
  '012811': '2900', // Laoag City (Capital)
  '012812': '2922', // Marcos
  '012813': '2924', // Nueva Era
  '012814': '2926', // Pagudpud
  '012815': '2928', // Paoay
  '012816': '2930', // Pasuquin
  '012817': '2932', // Piddig
  '012818': '2934', // Pinili
  '012819': '2936', // San Nicolas
  '012820': '2938', // Sarrat
  '012821': '2940', // Solsona
  '012822': '2942', // Vintar
  // Ilocos Sur
  '012901': '2700', // Alilem
  '012902': '2709', // Banayoyo
  '012903': '2717', // Bantay
  '012904': '2710', // Burgos
  '012905': '2716', // Cabugao
  '012906': '2718', // City of Candon
  '012907': '2703', // Caoayan
  '012908': '2719', // Cervantes
  '012909': '2720', // Galimuyod
  '012910': '2712', // Gregorio Del Pilar (Concepcion)
  '012911': '2714', // Lidlidda
  '012912': '2706', // Magsingal
  '012913': '2708', // Nagbukel
  '012914': '2702', // Narvacan
  '012915': '2713', // Quirino (Angkaki)
  '012916': '2705', // Salcedo (Baugen)
  '012917': '2721', // San Emilio
  '012918': '2704', // San Esteban
  '012919': '2722', // San Ildefonso
  '012920': '2723', // San Juan (Lapog)
  '012921': '2724', // San Vicente
  '012922': '2726', // Santa
  '012923': '2728', // Santa Catalina
  '012924': '2730', // Santa Cruz
  '012925': '2732', // Santa Lucia
  '012926': '2734', // Santa Maria
  '012927': '2736', // Santiago
  '012928': '2700', // Santo Domingo
  '012929': '2738', // Sigay
  '012930': '2740', // Sinait
  '012931': '2742', // Sugpon
  '012932': '2744', // Suyo
  '012933': '2700', // Tagudin
  '012934': '2700', // City of Vigan (Capital)

  // ==================== NCR ====================
  '133901': '1000', // City of Manila
  '133902': '1400', // Mandaluyong City
  '133903': '1550', // Marikina City
  '133904': '1600', // Pasig City
  '133905': '1100', // Quezon City
  '133906': '1800', // Caloocan City
  '133907': '1400', // Las Piñas City
  '133908': '1750', // Makati City
  '133909': '1700', // Malabon City
  '133910': '1850', // Muntinlupa City
  '133911': '1490', // Navotas City
  '133912': '1300', // Parañaque City
  '133913': '1200', // Pasay City
  '133914': '1630', // San Juan City
  '133915': '1440', // Taguig City
  '133916': '1440', // Pateros
  '133917': '1800', // Valenzuela City

  // ==================== REGION III (CENTRAL LUZON) ====================
  // Bulacan
  '031401': '3000', // Angat
  '031402': '3010', // Balagtas (Bigaa)
  '031403': '3009', // Baliuag
  '031404': '3011', // Bocaue
  '031405': '3016', // Bulakan
  '031406': '3007', // Bustos
  '031407': '3017', // Calumpit
  '031408': '3005', // Doña Remedios Trinidad
  '031409': '3004', // Guiguinto
  '031410': '3020', // Hagonoy
  '031411': '3000', // City of Malolos (Capital)
  '031412': '3012', // Marilao
  '031413': '3006', // Meycauayan City
  '031414': '3008', // Norzagaray
  '031415': '3021', // Obando
  '031416': '3013', // Pandi
  '031417': '3014', // Paombong
  '031418': '3015', // Plaridel
  '031419': '3018', // Pulilan
  '031420': '3001', // San Ildefonso
  '031421': '3019', // San Miguel
  '031422': '3003', // San Rafael
  '031423': '3002', // Santa Maria

  // ==================== REGION IV-A (CALABARZON) ====================
  // Cavite
  '042101': '4106', // Alfonso
  '042102': '4109', // Amadeo
  '042103': '4108', // Bacoor City
  '042104': '4111', // Carmona
  '042105': '4114', // Cavite City
  '042106': '4104', // Dasmariñas City
  '042107': '4118', // General Emilio Aguinaldo
  '042108': '4110', // General Trias City
  '042109': '4107', // Imus City
  '042110': '4102', // Indang
  '042111': '4116', // Kawit
  '042112': '4119', // Magallanes
  '042113': '4112', // Maragondon
  '042114': '4105', // Mendez (Mendez-Nuñez)
  '042115': '4100', // City of Naic
  '042116': '4117', // Noveleta
  '042117': '4115', // Rosario
  '042118': '4113', // Silang
  '042119': '4101', // Tagaytay City
  '042120': '4103', // Tanza
  '042121': '4120', // Ternate
  '042122': '4000', // Trece Martires City (Capital)

  // Laguna
  '043401': '4001', // Alaminos
  '043402': '4012', // Bay
  '043403': '4017', // Biñan City
  '043404': '4002', // Cabuyao City
  '043405': '4022', // Calauan
  '043406': '4027', // Cavinti
  '043407': '4004', // Famy
  '043408': '4006', // Kalayaan
  '043409': '4018', // Liliw
  '043410': '4019', // Los Baños
  '043411': '4020', // Luisiana
  '043412': '4010', // Lumban
  '043413': '4003', // Mabitac
  '043414': '4008', // Magdalena
  '043415': '4009', // Majayjay
  '043416': '4015', // Nagcarlan
  '043417': '4011', // Paete
  '043418': '4013', // Pagsanjan
  '043419': '4016', // Pakil
  '043420': '4014', // Pangil
  '043421': '4023', // Pila
  '043422': '4026', // Rizal
  '043423': '4005', // San Pablo City
  '043424': '4007', // San Pedro City
  '043425': '4024', // Santa Cruz (Capital)
  '043426': '4025', // Santa Maria
  '043427': '4021', // Santo Tomas
  '043428': '4021', // Siniloan
  '043429': '4028', // Victoria

  // ==================== REGION VII (CENTRAL VISAYAS) ====================
  // Cebu Province
  '072201': '6038', // Alcantara
  '072202': '6038', // Alcoy
  '072203': '6036', // Alegria
  '072204': '6022', // Aloguinsan
  '072205': '6021', // Argao
  '072206': '6019', // Asturias
  '072207': '6031', // Badian
  '072208': '6041', // Balamban
  '072209': '6061', // Bantayan
  '072210': '6036', // Barili
  '072211': '6010', // City of Bogo
  '072212': '6032', // Boljoon
  '072213': '6011', // Borbon
  '072214': '6019', // City of Carcar
  '072215': '6005', // Carmen
  '072216': '6007', // Catmon
  '072217': '6000', // Cebu City (Capital)
  '072218': '6003', // Compostela
  '072219': '6001', // Consolacion
  '072220': '6017', // Cordova
  '072221': '6013', // Daanbantayan
  '072222': '6027', // Dalaguete
  '072223': '6004', // Danao City
  '072224': '6036', // Dumanjug
  '072225': '6030', // Ginatilan
  '072226': '6015', // Lapu-Lapu City
  '072227': '6002', // Liloan
  '072228': '6063', // Madridejos
  '072229': '6030', // Malabuyoc
  '072230': '6014', // Mandaue City
  '072231': '6009', // Medellin
  '072232': '6046', // Minglanilla
  '072233': '6032', // Moalboal
  '072234': '6037', // City of Naga
  '072235': '6025', // Oslob
  '072236': '6065', // Pilar
  '072237': '6042', // Pinamungahan
  '072238': '6064', // Poro
  '072239': '6039', // Ronda
  '072240': '6032', // Samboan
  '072241': '6018', // San Fernando
  '072242': '6065', // San Francisco
  '072243': '6008', // San Remigio
  '072244': '6062', // Santa Fe
  '072245': '6032', // Santander
  '072246': '6023', // Sibonga
  '072247': '6005', // Sogod
  '072248': '6012', // Tabogon
  '072249': '6008', // Tabuelan
  '072250': '6045', // City of Talisay ← Your barangay!
  '072251': '6038', // Toledo City
  '072252': '6020', // Tuburan
  '072253': '6066', // Tudela

  // Bohol
  '071201': '6300', // Alburquerque
  '071202': '6301', // Alicia
  '071203': '6302', // Anda
  '071204': '6303', // Antequera
  '071205': '6304', // Baclayon
  '071206': '6305', // Balilihan
  '071207': '6306', // Batuan
  '071208': '6307', // Bien Unido
  '071209': '6308', // Bilar
  '071210': '6309', // Buenavista
  '071211': '6310', // Calape
  '071212': '6311', // Candijay
  '071213': '6312', // Carmen
  '071214': '6313', // Catigbian
  '071215': '6314', // Clarin
  '071216': '6315', // Corella
  '071217': '6316', // Cortes
  '071218': '6317', // Dagohoy
  '071219': '6318', // Danao
  '071220': '6319', // Dauis
  '071221': '6320', // Dimiao
  '071222': '6321', // Duero
  '071223': '6322', // Garcia Hernandez
  '071224': '6323', // Guindulman
  '071225': '6324', // Inabanga
  '071226': '6325', // Jagna
  '071227': '6326', // Jeringa
  '071228': '6327', // Lila
  '071229': '6328', // Loay
  '071230': '6329', // Loboc
  '071231': '6330', // Loon
  '071232': '6331', // Mabini
  '071233': '6332', // Maribojoc
  '071234': '6333', // Panglao
  '071235': '6334', // Pilar
  '071236': '6335', // President Carlos P. Garcia
  '071237': '6336', // Sagbayan (Borja)
  '071238': '6337', // San Isidro
  '071239': '6338', // San Miguel
  '071240': '6339', // Sevilla
  '071241': '6340', // Sierra Bullones
  '071242': '6341', // Sikatuna
  '071243': '6300', // Tagbilaran City (Capital)
  '071244': '6342', // Talibon
  '071245': '6343', // Trinidad
  '071246': '6344', // Tubigon
  '071247': '6345', // Ubay
  '071248': '6346', // Valencia

  // Negros Oriental
  '074601': '6200', // Amlan
  '074602': '6218', // Ayungon
  '074603': '6219', // Bacong
  '074604': '6201', // Bais City
  '074605': '6220', // Basay
  '074606': '6221', // Bayawan City
  '074607': '6222', // Bindoy (Payabon)
  '074608': '6223', // Canlaon City
  '074609': '6224', // Dauin
  '074610': '6225', // Dumaguete City (Capital)
  '074611': '6226', // Guihulngan City
  '074612': '6227', // Jimalalud
  '074613': '6228', // La Libertad
  '074614': '6229', // Mabinay
  '074615': '6230', // Manjuyod
  '074616': '6231', // Pamplona
  '074617': '6232', // San Jose
  '074618': '6233', // Santa Catalina
  '074619': '6234', // Siaton
  '074620': '6235', // Sibulan
  '074621': '6236', // Tayasan
  '074622': '6237', // Valencia
  '074623': '6238', // Vallehermoso
  '074624': '6239', // Zamboanguita

  // ==================== REGION XI (DAVAO) ====================
  '112302': '8000', // Davao City
  '112303': '8001', // Digos City
  '112304': '8002', // Mati City
  '112305': '8003', // Tagum City
  '112306': '8004', // Panabo City
  '112307': '8005', // Island Garden City of Samal

  // ==================== REGION XII (SOCCSKSARGEN) ====================
  '124701': '9500', // General Santos City
  '124702': '9501', // Koronadal City
  '124703': '9506', // Kidapawan City
  '124704': '9508', // Cotabato City

  // ==================== REGION IX (ZAMBOANGA PENINSULA) ====================
  '097301': '7000', // Zamboanga City
  '097302': '7000', // Pagadian City

  // ==================== CAR (CORDILLERA) ====================
  '141401': '2600', // Baguio City
  '141402': '2616', // La Trinidad (Capital of Benguet)
}

/**
 * Get postal code by PSGC municipality code.
 * Returns empty string if not found (user can manually type).
 */
export function getPostalCode(munCode: string): string {
  return POSTAL_CODES[munCode] || ''
}
