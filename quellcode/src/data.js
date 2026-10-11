/* ===================== Daten =====================
   Quelle aller Zahlen: Wissensbasis „Klimafolgen und Kipppunkte für Terra Vergo“ (Stand Oktober 2026).
   Kartenprojektion: Natural Earth 1, eingepasst in 1000 × 520 (Koordinaten siehe Begleitheft). */
const MAPPTS={"GR":[423,39],"WA":[293,494],"AS":[576,28],"GL":[722,170],"PF":[781,53],"BD":[495,142],"KT":[549,263],"GP":[243,144],"AM":[380,82],"MS":[699,247],"NI":[120,260],"SO":[411,482],"WM":[495,254],"HW":[552,113],"IM":[737,219],"TS":[319,194],"AZ":[332,273],"KR":[894,317],"BW":[258,88],"NW":[271,228],"HI":[634,178],"ER":[503,210],"SA":[680,177],"NK":[517,92],"ATM":[71,166]};
const SPH=[
 {k:'kryo',name:'Kryosphäre',sub:'Eis und Schnee',color:'var(--kryo)',tint:'#E3F5FD',light:true},
 {k:'pedo',name:'Pedosphäre',sub:'Böden',color:'var(--pedo)',tint:'#F3E6DA'},
 {k:'hydro',name:'Hydrosphäre',sub:'Wasser und Meere',color:'var(--hydro)',tint:'#DDEBFB'},
 {k:'atmo',name:'Atmosphäre',sub:'Luft, Wetter und Extreme',color:'var(--atmo)',tint:'#F9E3F0'},
 {k:'bio',name:'Biosphäre',sub:'Leben',color:'var(--bio)',tint:'#DDF6E3',light:true},
 {k:'mensch',name:'Mensch',sub:'Resilienz und Anpassung',color:'var(--mensch)',tint:'#FFE2D7',light:true},
];
const SK=Object.fromEntries(SPH.map(s=>[s.k,s]));
/* Typen: tip = Kipppunkt bzw. Spiel-Schwelle mit Kipp-Druck; arctic/enso/level/extreme = Anzeigen ohne Kipppunkt; human = Risiko für Menschen */
const EL=[
 // Kryosphäre
 {k:'GR',sph:'kryo',type:'tip',name:'Grönländischer Eisschild',short:'Grönland',place:'Grönland, 73° N',Tc:1.5,range:'0,8–3,4 °C',time:'Jahrtausende',tol:28,lab:'left',src:'Armstrong McKay u. a. 2022; GTPR 2025',
  why:'Speichert Eis für rund 7 m Meeresspiegelanstieg. Je mehr er schmilzt, desto tiefer und wärmer liegt seine Oberfläche, und er taut noch schneller. Überraschend: An Grönlands Küste sinkt der Meeresspiegel dabei, und an der Nordsee kommt nur etwa ein Fünftel seines Schmelzwassers an.'},
 {k:'WA',sph:'kryo',type:'tip',name:'Westantarktischer Eisschild',short:'Westantarktis',place:'Westantarktis, 78° S',Tc:1.5,range:'1,0–3,0 °C',time:'Jahrhunderte bis Jahrtausende',tol:32,lab:'up',src:'Armstrong McKay u. a. 2022; GTPR 2025',
  why:'Liegt auf Felsgrund unter dem Meeresspiegel. Warmes Meerwasser frisst sich von unten heran. Sein Eis würde den Meeresspiegel langfristig um 3–5 m heben. Manche Forschende halten eine noch niedrigere Schwelle für möglich.'},
 {k:'AS',sph:'kryo',type:'arctic',name:'Arktisches Sommermeereis',short:'Meereis',place:'Arktischer Ozean, 77° N',range:'kein Kipppunkt (GTPR 2025)',lab:'down',src:'IPCC AR6 WGI; IPCC SR1.5; Rantanen u. a. 2022',
  why:'Weißes Eis wirft Sonnenlicht zurück, dunkles Meer schluckt die Wärme. Seit 1979 hat sich die Arktis fast viermal so schnell erwärmt wie der globale Durchschnitt. Das Sommermeereis schwindet Schritt für Schritt, gilt aber nicht als Kipppunkt. Weil es schon im Wasser schwimmt, hebt sein Schmelzen den Meeresspiegel kaum.'},
 {k:'GL',sph:'kryo',type:'tip',name:'Gebirgsgletscher (Himalaya)',short:'Gletscher',place:'Himalaya, Nepal, 28° N',Tc:2.0,range:'1,5–3,0 °C, regional',time:'Jahrzehnte bis Jahrhunderte',tol:12,lab:'up',src:'Armstrong McKay u. a. 2022; ICIMOD 2023; IPCC SROCC',
  why:'Die Gletscher des Hindukusch-Himalaya sind Wassertürme für fast 2 Mrd. Menschen. Erst fließt mehr Schmelzwasser, dann immer weniger („Peak Water“, etwa um 2050). Auch die Alpen könnten bei hohem Ausstoß bis 2100 über 80 % ihres Eises verlieren.'},
 // Pedosphäre
 {k:'PF',sph:'pedo',type:'tip',name:'Permafrostböden (Sibirien)',short:'Permafrost',place:'Jakutien, 68° N',Tc:1.5,range:'1,0–2,3 °C, regional (abruptes Tauen)',time:'Jahrhunderte',tol:12,lab:'down',src:'IPCC SROCC; Armstrong McKay u. a. 2022',
  why:'Dauerfrostböden speichern 1.460–1.600 Mrd. t Kohlenstoff, fast doppelt so viel wie die Atmosphäre. Taut der Boden, entweichen CO₂ und Methan, und die Erwärmung heizt sich selbst an. Bei sehr hohem Ausstoß schrumpft die oberflächennahe Permafrostfläche bis 2100 um etwa 70 %.'},
 {k:'BD',sph:'pedo',type:'tip',game:true,name:'Böden im Mittelmeerraum',short:'Mittelmeer-Böden',place:'Südostspanien, 38° N',Tc:2.0,range:'kein Kipppunkt; ab 2 °C mehr Dürren (IPCC)',time:'Jahrzehnte',tol:12,lab:'left',src:'IPCC AR6 WGI C.2.3; WGII CCP4',
  why:'Hitze und weniger Regen trocknen die Böden aus. Humus geht verloren, Ernten sinken, Waldbrände nehmen zu: Bei 3 °C könnte die verbrannte Fläche am Mittelmeer um 96–187 % wachsen. Und das mitten in Europa.'},
 {k:'KT',sph:'pedo',type:'tip',game:true,name:'Torfmoore im Kongobecken',short:'Kongo-Torf',place:'Zentralafrika, 1° S',Tc:2.0,range:'kein bekannter Kipppunkt; Spiel-Schwelle',time:'Jahrhunderte',tol:15,lab:'right',src:'Crezee u. a. 2022; GTPR 2025',
  why:'Unter dem Regenwald liegt das größte tropische Torfmoor der Erde mit rund 29 Mrd. t Kohlenstoff. Trocknet es aus, zersetzt sich der Torf und gibt CO₂ ab. Nur etwa 8 % davon liegen in Schutzgebieten.'},
 {k:'GP',sph:'pedo',type:'tip',game:true,name:'Ackerböden der Great Plains',short:'Great Plains',place:'Mittlerer Westen der USA, 37° N',Tc:2.0,range:'kein Kipppunkt; Spiel-Schwelle',time:'Jahrzehnte',tol:12,lab:'down',src:'Borrelli u. a. 2020',
  why:'Eine der Kornkammern der Welt. In den 1930er-Jahren wehte der Wind ausgetrocknete Böden davon („Dust Bowl“). Mehr Hitze und Dürre machen Bodenverlust wieder wahrscheinlicher: Bis 2070 könnte die Erosion durch Wasser weltweit um 30–66 % zunehmen.'},
 // Hydrosphäre
 {k:'AM',sph:'hydro',type:'tip',name:'Atlantische Umwälzströmung (AMOC)',short:'Golfstrom-System',place:'Labradorsee, Nordatlantik, 57° N',Tc:1.8,range:'1,1–3,8 °C (Labradorsee); Kollaps 1,4–8 °C, Forschung uneinig',time:'ca. 10 Jahre bis Jahrzehnte',tol:8,lab:'down',src:'Armstrong McKay u. a. 2022; IPCC AR6 WGI C.3.4; GTPR 2025',
  why:'Die Umwälzströmung bringt warmes Wasser nach Norden und heizt Europa. Süßes Schmelzwasser aus Grönland bremst das Absinken in der Labradorsee. Wird sie schwächer, rückt der Regengürtel nach Süden, und an Europas Küsten steigt das Meer zusätzlich. Ob sie noch in diesem Jahrhundert kippen kann, ist umstritten.'},
 {k:'MS',sph:'hydro',type:'level',name:'Meeresspiegel (Malediven)',short:'Meeresspiegel',place:'Malediven, 4° N',range:'kein Kipppunkt, aber kaum aufzuhalten',time:'Jahrhunderte',lab:'down',src:'IPCC AR6 SYR; CIA World Factbook',
  why:'80 % der Landfläche der Malediven liegen höchstens 1 m über dem Meer, der höchste Punkt bei 2,4 m. Wärmeres Wasser dehnt sich aus, Landeis schmilzt. Der Anstieg geht auch mit Klimaschutz weiter, nur langsamer. Über 1,5 °C drohen kleinen Inseln harte Grenzen beim Süßwasser.'},
 {k:'NI',sph:'hydro',type:'enso',name:'El Niño (Äquatorialer Pazifik)',short:'El Niño',place:'Äquatorialer Pazifik, 0°, 140° W',range:'kein Kipppunkt, natürlicher Verstärker',lab:'down',src:'Armstrong McKay u. a. 2022; NOAA',
  why:'Alle paar Jahre schwächen sich die Passatwinde ab, und warmes Wasser schwappt in den östlichen Pazifik. Dann gibt es Dürren in Australien, Indonesien und am Amazonas. Jeder starke El Niño seit 1998 fiel mit einer weltweiten Korallenbleiche zusammen. El Niño ist kein Kipppunkt, aber er verstärkt die Folgen der Erwärmung.'},
 {k:'SO',sph:'hydro',type:'tip',game:true,name:'Umwälzung im Südpolarmeer',short:'Südpolarmeer',place:'Weddellmeer, 73° S',Tc:1.8,range:'ca. 1,75–3 °C, geringe Sicherheit; Spiel-Schwelle',time:'Abschwächung in Jahrzehnten, Kollaps kaum vor 2300',tol:16,lab:'up',src:'Li u. a. 2023',
  why:'Rund um die Antarktis sinkt kaltes, salziges Wasser in die Tiefe und versorgt die Tiefsee mit Sauerstoff. Schmelzwasser aus der Antarktis bremst diese Pumpe: In einem Modell bildet sich bei hohem Ausstoß bis 2050 etwa 40 % weniger Bodenwasser. Dann nimmt das Meer weniger CO₂ und Wärme auf.'},
 // Atmosphäre
 {k:'WM',sph:'atmo',type:'tip',name:'Westafrikanischer Monsun',short:'Westafr. Monsun',place:'Golf von Guinea, 2° N',Tc:2.8,range:'2,0–3,5 °C, regional, geringes Vertrauen',time:'ca. 50 Jahre',tol:18,lab:'left',src:'Armstrong McKay u. a. 2022; IPCC AR6 WGI',
  why:'Im Sommer trägt der Monsun feuchte Luft vom Golf von Guinea bis in den Sahel. Er ist der einzige bekannte Kipppunkt-Kandidat der Atmosphäre. Ob er bei starker Erwärmung in einen trockeneren oder eher feuchteren Zustand springt, ist sehr unsicher. Für die Landwirtschaft im Sahel wäre schon diese Unsicherheit ein Problem.'},
 {k:'HW',sph:'atmo',type:'extreme',name:'Hitzewellen in Europa',short:'Hitzewellen',place:'Ungarn, Mitteleuropa, 47° N',range:'kein Kipppunkt; Spiel-Schwelle 2 °C',lab:'right',src:'IPCC AR6 WGI Abb. SPM.6; Rousi u. a. 2022; Ballester u. a. 2023',
  why:'In Europa nehmen Hitzewellen drei- bis viermal so schnell zu wie in den übrigen mittleren Breiten. Im Sommer 2022 starben in Europa über 61.000 Menschen an der Hitze, davon über 8.000 in Deutschland. Einen Kipppunkt gibt es hier nicht: Mit jedem Zehntelgrad werden Hitzewellen häufiger und heißer.'},
 {k:'IM',sph:'atmo',type:'extreme',name:'Indischer Monsun und Starkregen',short:'Monsun-Regen',place:'Golf von Bengalen, 13° N',range:'kein Kipppunkt belegt; Spiel-Schwelle 2 °C',lab:'right',src:'IPCC AR6 WGI B.2.4 und Abb. SPM.6; Armstrong McKay u. a. 2022',
  why:'Der Sommermonsun bringt Südasien den größten Teil seines Regens. Wärmere Luft kann mehr Wasserdampf halten: Pro Grad Erwärmung bringt ein Tag Starkregen etwa 7 % mehr Wasser. Der Monsun wird dadurch insgesamt kräftiger und unberechenbarer.'},
 {k:'TS',sph:'atmo',type:'extreme',name:'Tropische Wirbelstürme (Karibik)',short:'Wirbelstürme',place:'Nordatlantik bei den Antillen, 21° N',range:'kein Kipppunkt; Spiel-Schwelle 2 °C',lab:'right',src:'IPCC AR6 WGI Kap. 11; World Weather Attribution 2025',
  why:'Wärmeres Meer liefert mehr Energie. Der Anteil der stärksten Wirbelstürme (Kategorie 4–5) steigt, und sie bringen mehr Regen. Hurrikan Melissa traf 2025 Jamaika mit etwa 7 % stärkerem Wind und 16 % mehr Regen, als es ohne Klimawandel gewesen wäre.'},
 // Biosphäre
 {k:'AZ',sph:'bio',type:'tip',name:'Amazonas-Regenwald',short:'Amazonas',place:'Zentralamazonien, 4° S',Tc:3.5,range:'2,0–6,0 °C; mit Abholzung schon ab ca. 1,5–1,9 °C',time:'Jahrzehnte bis 100 Jahre',tol:10,lab:'down',src:'Armstrong McKay u. a. 2022; GTPR 2025; Flores u. a. 2024',
  why:'Der Regenwald macht einen Teil seines Regens selbst. Früher galten 20–25 % Abholzung als kritisch, neuere Studien empfehlen höchstens 10 %. Wird er zur Savanne, setzt er riesige Mengen CO₂ frei. Seine CO₂-Aufnahme ist seit den 1990er-Jahren schon um 30 % gesunken.'},
 {k:'KR',sph:'bio',type:'tip',name:'Korallenriffe (Great Barrier Reef)',short:'Korallen',place:'Australien, 18° S',Tc:1.2,range:'1,0–1,5 °C',time:'ca. 10 Jahre',tol:5,lab:'down',src:'GTPR 2025; NOAA Coral Reef Watch; IPCC SR1.5',
  why:'Zu warmes Wasser lässt Korallen ausbleichen und sterben. Von 2023 bis 2025 standen 84 % der Riffflächen der Welt unter Hitzestress. Der Global Tipping Points Report 2025 sieht hier den ersten überschrittenen Kipppunkt der Erde. Riffe sind Lebensraum für schätzungsweise rund ein Viertel aller bekannten Meeresarten.'},
 {k:'BW',sph:'bio',type:'tip',name:'Boreale Wälder (Kanada)',short:'Nordwälder',place:'Kanada, 55° N',Tc:4.0,range:'1,4–5,0 °C (Südrand)',time:'etwa 100 Jahre',tol:15,lab:'up',src:'Armstrong McKay u. a. 2022; GTPR 2025',
  why:'Die Nadelwälder des Nordens speichern riesige Mengen Kohlenstoff. Hitze, Dürre, Borkenkäfer und Waldbrände setzen ihnen zu. Brennen sie, wird CO₂ frei. Wo am Südrand Grasland entsteht, wirft der hellere Boden aber mehr Sonnenlicht zurück. Unterm Strich wirkt das langfristig sogar leicht kühlend.'},
 {k:'NW',sph:'bio',type:'tip',game:true,name:'Nebelwälder (Costa Rica)',short:'Nebelwald',place:'Monteverde, 10° N',Tc:2.0,range:'kein Kipppunkt; Spiel-Schwelle',time:'Jahrzehnte',tol:10,lab:'down',src:'IPCC AR6 WGII; AmphibiaWeb',
  why:'Bergwälder, die ihr Wasser aus Wolken holen, sind Heimat vieler seltener Frösche und Orchideen. Steigt die Wolkengrenze, trocknen sie aus. Die Goldkröte von Monteverde verschwand 1989 nach extremen Dürren. Wie stark der Klimawandel daran beteiligt war, ist umstritten.'},
 // Mensch
 {k:'HI',sph:'mensch',type:'human',name:'Hitze & Gesundheit (Persischer Golf)',short:'Hitze',place:'Persischer Golf, 26° N',lab:'up',res0:10,src:'Vecellio u. a. 2022; Raymond u. a. 2020',
  why:'Bei feuchter Hitze kann der Körper sich nicht mehr durch Schwitzen kühlen. Messungen zeigen: Schon ab etwa 31 °C Feuchtkugeltemperatur wird es selbst für junge, gesunde Menschen gefährlich. Früher ging man von 35 °C aus. Am Golf werden solche Werte häufiger, und Arbeiten im Freien wird zeitweise lebensgefährlich.'},
 {k:'ER',sph:'mensch',type:'human',name:'Ernährung & Dürre (Sahel)',short:'Sahel',place:'Sahel, Niger und Mali, 16° N',lab:'up',res0:10,src:'IPCC AR6 WGII C.3.4',
  why:'Im Sahel leben viele Menschen direkt von ihren Feldern. Dürren, Starkregen und Hitze lassen Ernten ausfallen. Ab 2 °C erwartet der IPCC in den Tropen weiche Grenzen der Anpassung für mehrere Grundnahrungsmittel. Hunger und Flucht nehmen zu, wobei Armut und Konflikte oft stärker wirken als das Klima.'},
 {k:'SA',sph:'mensch',type:'human',name:'Wasser & Ernährung (Indus-Tal)',short:'Indus-Tal',place:'Sindh, Pakistan, 27° N',lab:'down',res0:10,src:'ICIMOD; UNOSAT 2022; IPCC AR6 WGII B.4.2',
  why:'Rund 268 Mio. Menschen leben im Einzugsgebiet des Indus. Er bewässert über 80 % der Ackerfläche Pakistans, und ein großer Teil seines Wassers stammt aus Schnee und Gletschern. 2022 stand nach extremem Monsunregen rund ein Zehntel Pakistans unter Wasser, 33 Mio. Menschen waren betroffen.'},
 {k:'NK',sph:'mensch',type:'human',name:'Küstenschutz an der Nordsee',short:'Nordseeküste',place:'Ostfriesland, Niedersachsen, 54° N',lab:'left',res0:60,src:'Generalplan Küstenschutz Niedersachsen/Bremen; Hereon 2025',
  why:'Rund 600 km Hauptdeich schützen in Niedersachsen etwa 1,1 Mio. Menschen. Seit 2021 bekommen neue Deiche 1 m Zuschlag für den steigenden Meeresspiegel und können später um einen weiteren Meter erhöht werden („Klimadeich“). Gleiche Gefahr, andere Verwundbarkeit: In Jakarta, das jedes Jahr um etwa 3,5 cm absinkt, fehlt vielen Menschen solcher Schutz.'},
];
const EK=Object.fromEntries(EL.map(e=>[e.k,e]));
EK.ATM={k:'ATM',sph:'atmo',name:'Atmosphäre (global)',short:'Atmosphäre'};
const TIPK=EL.filter(e=>e.type==='tip').map(e=>e.k);
const HUMK=EL.filter(e=>e.type==='human').map(e=>e.k);
// Dominoeffekte: [von, nach, Erklärung]
/* Wechselwirkungen: [von, nach, Erklärung, Vorzeichen (1 verstärkt, -1 bremst, 0 unklar/beides), Vertrauen, Quelle, im Spielmodell gerechnet (1/0)]
   „verstärkt“ heißt: erhöht den Kipp-Druck bzw. das Risiko beim Ziel. ATM = Atmosphäre (globale Erwärmung). */
const LINKS=[
 ['AS','GR','Ohne Meereis heizt sich die Arktis stärker auf. Über Grönland wird es regional etwa 0,3–0,5 °C wärmer, das Eis schmilzt schneller.',1,'mittel','Wunderling u. a. 2024; Rantanen u. a. 2022',1],
 ['AS','PF','Ohne Meereis wird es auch an Land wärmer. Der Permafrost taut schneller, und höhere Wellen tragen Steilküsten 2- bis 4-mal schneller ab.',1,'mittel','Wunderling u. a. 2024',1],
 ['AS','AM','Warmes, süßes Schmelzwasser aus der Arktis kann nach Süden treiben und das Absinken im Nordatlantik schwächen.',1,'gering','Wunderling u. a. 2024 (Modellstudien)',0],
 ['GR','AM','Süßes Schmelzwasser ist leichter als Salzwasser und bremst das Absinken im Nordatlantik.',1,'mittel','Wunderling u. a. 2021, 2024; IPCC AR6 WGI',1],
 ['GR','MS','Grönland-Eis lässt den Meeresspiegel steigen, an der Nordsee aber nur zu etwa einem Fünftel.',1,'hoch','IPCC AR6 WGI; Slangen 2023',1],
 ['GR','WA','Grönlands Schmelzwasser hebt den Meeresspiegel auch vor der Westantarktis. Ihr Eis liegt auf Felsen unter dem Meer und verliert Halt.',1,'mittel','Wunderling u. a. 2021, 2024',1],
 ['WA','MS','Antarktis-Eis lässt den Meeresspiegel steigen, auch an der Nordsee.',1,'hoch','IPCC AR6 WGI',1],
 ['WA','SO','Schmelzwasser der Antarktis bremst die Umwälzung im Südpolarmeer.',1,'mittel','Li u. a. 2023',1],
 ['WA','AM','Schmelzwasser aus der Antarktis kann die Umwälzung im Atlantik stärken oder schwächen. Die Forschung ist sich hier noch nicht einig.',0,'gering','Wunderling u. a. 2021, 2024; GTPR 2025',0],
 ['SO','WA','Ist die Umwälzung schwach, erreicht warmes Wasser die Eisschelfe der Westantarktis.',1,'mittel','Li u. a. 2023',1],
 ['SO','ATM','Eine schwache Umwälzung im Südpolarmeer nimmt weniger CO₂ und Wärme auf.',1,'mittel','Li u. a. 2023; IPCC AR6 WGI',1],
 ['GL','SA','Schrumpfende Gletscher liefern im Sommer weniger Wasser für den Indus.',1,'hoch','IPCC AR6 WGII',1],
 ['GL','MS','Gebirgsgletscher lieferten 2000–2019 rund ein Fünftel des weltweiten Meeresspiegelanstiegs (0,74 mm pro Jahr).',1,'hoch','Hugonnet u. a. 2021',0],
 ['PF','ATM','Tauender Permafrost setzt CO₂ und Methan frei.',1,'hoch','IPCC SROCC; Armstrong McKay u. a. 2022',1],
 ['PF','AS','Tauender Permafrost heizt die Arktis über zusätzliche Treibhausgase weiter auf. Das Meereis schwindet, der Boden taut weiter: ein Teufelskreis.',1,'gering','GTPR 2025',0],
 ['PF','BW','Tauender Boden sackt ab, vernässt oder trocknet aus. Das schwächt die Nordwälder und macht Brände wahrscheinlicher.',1,'gering','GTPR 2025',0],
 ['KT','ATM','Austrocknender Torf zersetzt sich und gibt CO₂ ab.',1,'mittel','Crezee u. a. 2022',1],
 ['BD','HW','Trockene Böden kühlen nicht mehr durch Verdunstung. Die Sonne heizt die Luft direkt auf, Hitzewellen werden heißer.',1,'mittel','IPCC AR6 WGI Kap. 11',0],
 ['GP','ER','Missernten in großen Kornkammern wie den Great Plains treiben die Weltmarktpreise für Getreide. Im Sahel wird Essen teurer.',1,'mittel','IPCC AR6 WGII SPM B.5.1 und B.5.3',1],
 ['AM','WM','Eine schwächere Umwälzströmung verschiebt den tropischen Regengürtel nach Süden und stört den Westafrikanischen Monsun.',1,'mittel','IPCC AR6 WGI SPM C.3.4',1],
 ['AM','IM','Bricht die Umwälzströmung ein, wandert der Regengürtel nach Süden. Der Monsun in Asien würde schwächer und unzuverlässiger.',1,'mittel','IPCC AR6 WGI SPM C.3.4',0],
 ['AM','NK','Eine stark geschwächte Umwälzströmung würde das Meer an Europas Küsten zusätzlich anheben.',1,'mittel','van Westen u. a. 2026',1],
 ['AM','GR','Bremst die Umwälzströmung, kommt weniger Wärme in den Norden. Rund um Grönland wird es kühler, das Schmelzen verlangsamt sich.',-1,'mittel','Wunderling u. a. 2021, 2024',1],
 ['AM','WA','Wärme, die nicht mehr nach Norden fließt, staut sich im Süden. Das Südpolarmeer wird wärmer und greift das Eis der Westantarktis an.',1,'mittel','Wunderling u. a. 2021, 2024',1],
 ['AM','AZ','Der Regengürtel verschiebt sich nach Süden: Im Norden des Amazonas wird es trockener, im Süden eher feuchter.',0,'gering','Wunderling u. a. 2021; GTPR 2025',0],
 ['AM','ATM','Ein Kollaps kühlt die Nordhalbkugel. Weltweit dämpft das die Erwärmung etwas (rund −0,5 °C), für Europa wäre er trotzdem dramatisch.',-1,'mittel','Armstrong McKay u. a. 2022',0],
 ['MS','NK','Steigt das Meer, startet jede Sturmflut von einem höheren Wasserstand. Der Deich muss mitwachsen.',1,'hoch','IPCC AR6 WGI; Generalplan Küstenschutz 2020',1],
 ['NI','AZ','In El-Niño-Jahren bleibt im Amazonas der Regen aus. Dürre und Brände schwächen den Regenwald.',1,'hoch','IPCC AR6; Flores u. a. 2024',1],
 ['NI','KR','Jeder starke El Niño seit 1998 fiel mit einer weltweiten Korallenbleiche zusammen.',1,'hoch','NOAA 2025',0],
 ['NI','NW','In El-Niño-Jahren wird es in Costa Rica wärmer und trockener. Die Wolken steigen höher, der Nebelwald bekommt weniger Nebel.',1,'mittel','Pounds u. a. 1999',1],
 ['NI','IM','El-Niño-Jahre bringen in Indien und Pakistan oft einen schwachen Monsun mit Dürre. Der Regen wird unberechenbarer.',1,'mittel','IPCC AR6 WGI Annex IV',0],
 ['ATM','KR','Wärmere Luft heizt die Meere auf. Korallen bleichen aus.',1,'hoch','IPCC AR6 WGII; GTPR 2025',1],
 ['ATM','HW','Wärmere Luft bringt häufigere und heißere Hitzewellen.',1,'hoch','IPCC AR6 WGI SPM',1],
 ['ATM','HI','Wärmere Luft bringt mehr gefährlich feuchte Hitze.',1,'hoch','IPCC AR6 WGI; Vecellio u. a. 2022',1],
 ['ATM','NW','Wärmere Luft hebt die Wolkengrenze an. Nebelwälder trocknen aus.',1,'mittel','Pounds u. a. 1999; IPCC AR6 WGII',1],
 ['ATM','TS','Wärmeres Meer und wärmere Luft liefern Energie für stärkere Wirbelstürme.',1,'hoch','IPCC AR6 WGI Kap. 11',1],
 ['ATM','IM','Wärmere Luft hält mehr Wasserdampf: etwa 7 % mehr Starkregen pro Grad.',1,'hoch','IPCC AR6 WGI SPM',1],
 ['ATM','GP','Wärmere Luft verdunstet mehr Wasser. Dürren trocknen die Ackerböden aus, der Wind trägt sie ab.',1,'mittel','IPCC AR6 WGI SPM A.3.2',1],
 ['HW','BD','Hitzewellen trocknen die Böden aus. Hitze und Dürre treten immer öfter gleichzeitig auf.',1,'hoch','IPCC AR6 WGI Kap. 11',0],
 ['IM','SA','Extremer Monsunregen lässt Flüsse über die Ufer treten, wie 2022 in Pakistan.',1,'mittel','World Weather Attribution 2022',0],
 ['TS','KR','Wirbelstürme zerschlagen Riffe. In der Karibik ging die Korallenbedeckung im Jahr nach einem Hurrikan um bis zu 17 % zurück.',1,'hoch','Gardner u. a. 2005',0],
 ['WM','ER','Bleibt der Monsunregen aus oder verschiebt er sich, fallen im Sahel Ernten aus.',1,'mittel','IPCC AR6 WGII',1],
 ['AZ','ATM','Ein sterbender Amazonas gibt CO₂ ab, statt es zu speichern.',1,'mittel','Armstrong McKay u. a. 2022; IPCC AR6 WGII',1],
 ['BW','PF','Waldbrände verbrennen die isolierende Moos- und Torfschicht. Der Boden taut danach rund 30 Jahre lang schneller; in Nordwestkanada geht etwa ein Viertel der neuen Tauflächen auf Brände zurück.',1,'mittel','Gibson u. a. 2018',1],
 ['BW','ATM','Brände setzen CO₂ frei (wärmt). Ohne Wald wirft die helle, oft verschneite Landschaft mehr Sonnenlicht zurück (kühlt). Unterm Strich leicht kühlend.',0,'mittel','Armstrong McKay u. a. 2022',0],
 ['KR','MS','Gesunde Riffe brechen im Mittel 97 % der Wellenenergie. Sterben sie, treffen Fluten und Erosion die Malediven bei steigendem Meer härter.',1,'hoch','Ferrario u. a. 2014',0],
];
const LEVERS=[
 {k:'VE',grp:'Klimaschutz',col:'var(--hydro)',icon:'i-VE',name:'Verkehr & Industrie',hint:'Bahn, Busse, E-Autos und grüner Stahl. Verkehr und Industrie verursachen zusammen rund 39 % der direkten Emissionen. Jede Münze senkt den Ausstoß dauerhaft um etwa 2,5 %.',fx:[['co2','▼',1]]},
 {k:'WA',grp:'Klimaschutz',col:'var(--hydro)',icon:'i-WD',name:'Wälder & Moore schützen',hint:'Abholzung stoppen, Moore wieder vernässen. Trockengelegte Moore verursachen rund 4 % der Emissionen. −1 % Ausstoß, weniger Abholzung im Amazonas, nassere Torfmoore.',fx:[['co2','▼',1],['AZ','▲',1],['KT','▲',1]]},
 {k:'FO',grp:'Klimaschutz',col:'var(--hydro)',icon:'i-FO',name:'CO₂ aus der Luft holen',hint:'Technik, die CO₂ zurückholt und speichert. Teuer und bisher winzig: 2023 holten neue Verfahren nur rund 0,001 Gt aus der Luft. Je Münze −0,5 Gt pro Jahr, baut sich langsam auf, höchstens 5 Gt.',fx:[['co2','▼',1]]},
 {k:'ME',grp:'Naturschutz',col:'var(--bio)',icon:'i-ME',name:'Meeres- & Naturschutz',hint:'Schutzgebiete auf 30–50 % der Flächen machen Wälder und Arten widerstandsfähiger (IPCC). Gegen zu viel Hitze helfen sie nur begrenzt.',fx:[['AZ','▲',1],['NW','▲',1],['species','▼',1]]},
 {k:'HS',grp:'Anpassung',col:'var(--mensch)',icon:'i-HS',name:'Hitzeschutz & Gesundheit',hint:'Hitzewarnungen, Schatten, Stadtgrün, Kühlräume, Kliniken.',fx:[['HI','▲',1],['dead','▼',1]]},
 {k:'LW',grp:'Anpassung',col:'var(--mensch)',icon:'i-LW',name:'Klimafeste Landwirtschaft & Wasser',hint:'Dürrefeste Sorten, Agroforst, Wasserspeicher, Hochwasserschutz an Flüssen. Vorsicht: Zu viel Bewässerung kann Grundwasser erschöpfen.',fx:[['ER','▲',1],['SA','▲',1],['dead','▼',1]]},
 {k:'KS',grp:'Anpassung',col:'var(--mensch)',icon:'i-KS',name:'Küstenschutz',hint:'Mitwachsende Klimadeiche, Salzwiesen und Mangroven, notfalls geordneter Rückzug. Deiche ohne langfristige Planung können später zur Falle werden.',fx:[['NK','▲',1]]},
 {k:'FW',grp:'Anpassung',col:'var(--mensch)',icon:'i-FW',name:'Frühwarnung für alle',hint:'Warnsysteme für Hitze, Sturm und Flut. In Ländern mit guten Systemen ist die Katastrophensterblichkeit fast sechsmal niedriger. Schützt Leben, aber kaum Häuser und Felder.',fx:[['dead','▼',1],['HU','▲',1]]},
];
const LK=Object.fromEntries(LEVERS.map(l=>[l.k,l]));
/* Stresstest SSP5-8.5: AR6-konsistente Temperatur (Interpolation der Wissensbasis), CO₂-Emissionen (RCMIP, Gt CO₂/Jahr) */
const TREF=[1.41,1.58,1.75,1.95,2.16,2.38,2.60,2.83,3.07,3.32,3.57];
const TPOL=[1.41,1.52,1.64,1.76,1.88,2.00,2.10,2.20,2.30,2.40,2.50]; // heutige Politik, Interpolation nach SSP2-4.5
const BASE=[49.5,55.3,62.0,68.8,76.0,83.3,91.8,100.3,108.6,116.8,123.2];
const ENSO=[1,0,0,1,0,0,1,0,1,0]; // Runden mit starkem El Niño (Spielannahme; 2026/27 entwickelt sich ein El Niño)
const TCRE=0.5/1000, YEAR0=2025, ROUNDS=10, DT=5, GDP0=110;
const NOINV={VE:0,WA:0,FO:0,ME:0,HS:0,LW:0,KS:0,FW:0,co2:0,kg:false,fs:0,gb:0,ee:0,bau:0};
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
const pos=x=>Math.max(0,x);
const fmt=(x,d=1)=>x.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
const fint=x=>Math.round(x).toLocaleString('de-DE');
const lerpTab=(T,P)=>{if(T<=P[0][0])return P[0][1]*Math.max(0,T)/P[0][0];for(let i=1;i<P.length;i++)if(T<=P[i][0]){const [a,x]=P[i-1],[b,y]=P[i];return x+(y-x)*(T-a)/(b-a);}const n=P.length,[a,x]=P[n-2],[b,y]=P[n-1];return y+(y-x)*(T-b)/(b-a);};
/* Extreme nach IPCC AR6 WGI Abb. SPM.6 bzw. Kap. 11 (Bezug 1850–1900) */
const HEAT50=[[1,4.8],[1.5,8.6],[2,13.9],[4,39.2]], HEAT50I=[[1,1.2],[1.5,2.0],[2,2.7],[4,5.3]];
const RAIN10=[[1,1.3],[1.5,1.5],[2,1.7],[4,2.7]], RAIN10I=[[1,6.7],[1.5,10.5],[2,14],[4,30.2]];
const CAT45=[[1,0.001],[1.5,10],[2,13],[4,20]];
const SPEC=[[1,9],[1.5,14],[2,18],[3,29],[4,39],[5,48]]; // Obergrenzen der IPCC-Spannen (AR6 WGII B.4.1)
const SPECM=[[1,6],[1.5,9],[2,10],[3,12],[4,13],[5,15]]; // Mediane
function extremeVal(k,T){
  if(k==='HW')return {v:lerpTab(T,HEAT50),i:lerpTab(T,HEAT50I),txt:`${fmt(lerpTab(T,HEAT50),1)}-mal so oft`,lbl:'50-jährliche Hitzewelle',inl:`dabei ${fmt(lerpTab(T,HEAT50I),1)} °C heißer`};
  if(k==='IM')return {v:lerpTab(T,RAIN10),i:lerpTab(T,RAIN10I),txt:`${fmt(lerpTab(T,RAIN10),1)}-mal so oft`,lbl:'10-jährlicher Starkregen',inl:`dabei ${fint(lerpTab(T,RAIN10I))} % mehr Regen`};
  const c=pos(lerpTab(T,CAT45));return {v:c,txt:`+${fint(c)} % starke Stürme`,lbl:'Anteil Kategorie 4–5',inl:'mehr Regen und Sturmflut'};
}

/* ===================== Modell ===================== */
function initState(){
  const S={};for(const k of TIPK)S[k]=0;
  const res={};for(const k of HUMK)res[k]=EK[k].res0;
  const st={r:0,T:TREF[0],E:BASE[0],cut:0,removal:0,dE:0,D:17,SL:0,S,tipped:{KR:2025},res,forest:0,prot:0,fw:0,debt:0,wet:0,humanCrossed:{},costCum:0,deathsCum:0,arctic2:null,
    hist:[],invHist:[],prev:null,inv:{...NOINV},last:null,over:null};
  const o=outcomes(st);st.hist.push({year:2025,T:st.T,E:st.E,SL:0,cost:o.dmgAbs,lo:o.gdp*o.dmgLo/100,hi:o.gdp*o.dmgHi/100});
  return st;
}
function effTc(k,st){
  let t=EK[k].Tc;const nino=ENSO[st.r]===1;
  if(k==='AZ'){t=Math.max(1.5,t-0.225*(st.D-17))+st.forest;if(nino)t-=0.2;}
  if(k==='KT')t+=Math.min(0.3,0.04*st.wet);
  if(k==='AM')t-=0.004*st.S.GR;                         // Grönland-Schmelzwasser schwächt die AMOC
  if(k==='GR')t+=0.002*st.S.AM;                         // schwächere AMOC kühlt Grönland (bremst)
  if(k==='SO')t-=0.004*st.S.WA;
  if(k==='WA')t-=0.002*st.S.SO+0.0015*st.S.GR+0.0015*st.S.AM; // Südpolarmeer, Meeresspiegel aus Grönland, Wärmestau bei schwacher AMOC
  if(k==='WM')t-=0.006*st.S.AM;
  if(k==='PF')t-=0.002*st.S.BW;                         // Waldbrände legen den Permafrost frei
  if(k==='NW'){t+=st.forest;if(nino)t-=0.1;}            // El Niño trocknet den Nebelwald aus
  return t;
}
function protMult(T){return Math.max(0.55,1-0.12*pos(T-1.5));} // Anpassung wirkt schwächer, je wärmer es wird (IPCC SYR B.4.1)
function hazards(st){
  return {HI:35+40*(st.T-1.2),
    ER:30+30*(st.T-1.2)+0.08*st.S.AM+(st.tipped.WM?15:0.12*st.S.WM)+(st.tipped.GP?8:0.06*st.S.GP),
    SA:28+30*(st.T-1.2)+(st.tipped.GL?12:0.18*st.S.GL),
    NK:22+1.3*st.SL+(st.tipped.AM?10:0)};
}
function humanRisk(st){const hz=hazards(st),m=protMult(st.T),o={};for(const k of HUMK)o[k]=clamp(hz[k]*(1-0.5*m*st.res[k]/100),0,140);return o;}
function dmgFactor(st){const resAvg=HUMK.reduce((a,k)=>a+st.res[k],0)/(100*HUMK.length);return (1-0.3*resAvg)*(1-0.1*st.fw);}
function outcomes(st){
  const year=YEAR0+DT*st.r, gdp=GDP0*Math.pow(1.025,year-2025), f=dmgFactor(st), T=st.T;
  const mid=(1.2*Math.pow(pos(T-1),2)+0.6*pos(T-1))*f, lo=0.345*T*T*f, hi=1.0*T*T*f;
  const species=lerpTab(T,SPEC)*(1-st.prot), speciesM=lerpTab(T,SPECM)*(1-st.prot);
  const r=st.res;
  const deaths=250000*Math.pow(pos(T-1)/0.9,1.6)*(1-0.22*r.HI/100-0.14*r.ER/100-0.1*r.SA/100-0.02*r.NK/100)*(1-0.5*st.fw);
  return {year,gdp,dmgPct:mid,dmgLo:Math.min(lo,mid),dmgHi:Math.max(hi,mid),dmgAbs:gdp*mid/100,species,speciesM,deaths};
}
function repayment(st){return st.debt>0?Math.min(st.debt,Math.ceil(st.debt/3)):0;}
function budgetParts(st){
  const inv=st.inv;
  const base=7,dmg=Math.floor(pos(st.T-1.5)/0.5);
  const hr=humanRisk(st);const crisis=Object.values(hr).some(v=>v>=75)?1:0;
  const co2=st.prev&&!st.prev.kg?st.prev.co2:0;
  const fs=inv.fs,gb=2*inv.gb,rep=repayment(st);
  const income=Math.max(1,base-dmg-crisis+co2+fs+gb-rep);
  const programs=inv.ee+inv.bau;
  return {base,dmg,crisis,co2,fs,gb,rep,income,programs};
}
function simulate(st,inv){
  const before={T:st.T,E:st.E,SL:st.SL,S:{...st.S},hr:humanRisk(st),out:outcomes(st),D:st.D};
  const r=st.r;
  st.debt=Math.max(0,st.debt-repayment(st))+2.5*inv.gb;
  const add=0.025*inv.VE+0.012*inv.WA+0.02*inv.co2+0.01*inv.fs+0.03*inv.ee+0.015*inv.bau;
  const prevCut=st.cut;st.cut=Math.min(1,st.cut+add*(1-0.4*st.cut)); // die letzten Prozente sind am schwersten
  const lagCut=(prevCut+st.cut)/2;
  const prevRemoval=st.removal;st.removal=Math.min(5,st.removal+0.5*inv.FO);
  st.D=clamp(st.D+2-1.5*inv.WA,5,60);
  st.wet=(st.wet||0)+inv.WA;
  st.forest=Math.min(0.25,st.forest+0.05*inv.ME);
  st.prot=Math.min(0.15,st.prot+0.02*inv.ME);
  st.fw=Math.min(0.4,st.fw+0.08*inv.FW);
  let fb=0;
  fb+=st.tipped.PF?3:0.02*st.S.PF;
  fb+=st.tipped.AZ?3:0.015*st.S.AZ;
  fb+=st.tipped.KT?1:0.005*st.S.KT;
  fb+=st.tipped.SO?1.5:0.008*st.S.SO;
  const base=(BASE[r]+BASE[r+1])/2;
  st.E=Math.max(-20,base*(1-lagCut)+fb-(prevRemoval+st.removal)/2);
  st.dE+=(st.E-base)*DT;
  st.T=Math.max(1.0,TREF[r+1]+TCRE*st.dE);
  const Tavg=(before.T+st.T)/2;
  const amp=st.T>=2?1.25:1;const newly=[];
  st.r++;
  for(const k of TIPK){
    if(st.tipped[k])continue;
    const ex=st.T-effTc(k,{...st,r});
    const mult=(k==='PF'||k==='GR')?amp:1;
    if(ex>0)st.S[k]+=100*ex*DT/EK[k].tol*mult;else st.S[k]=Math.max(0,st.S[k]-(k==='GR'||k==='WA'?1:6));
    if(st.S[k]>=100){st.S[k]=100;st.tipped[k]=YEAR0+DT*st.r;newly.push(k);}
  }
  st.SL+=(0.08+0.28*Tavg+0.0005*(st.S.GR+st.S.WA))*DT;
  const kgBonus=inv.kg?3*inv.co2:0;
  for(const k of HUMK)st.res[k]=clamp(st.res[k]-2+kgBonus+3*inv.FW);
  st.res.HI=clamp(st.res.HI+9*inv.HS+3*inv.bau);
  st.res.ER=clamp(st.res.ER+7*inv.LW-2*inv.fs);
  st.res.SA=clamp(st.res.SA+7*inv.LW-2*inv.fs);
  st.res.NK=clamp(st.res.NK+9*inv.KS);
  const hr=humanRisk(st);const newHuman=[];
  for(const k of HUMK)if(hr[k]>=100&&!st.humanCrossed[k]){st.humanCrossed[k]=YEAR0+DT*st.r;newHuman.push(k);}
  let arcticNow=false;if(st.T>=2&&!st.arctic2){st.arctic2=YEAR0+DT*st.r;arcticNow=true;}
  const out=outcomes(st);
  const avgDeaths=(before.out.deaths+out.deaths)/2, avgCost=(before.out.dmgAbs+out.dmgAbs)/2;
  st.deathsCum+=avgDeaths*DT;st.costCum+=avgCost*DT;
  st.hist.push({year:YEAR0+DT*st.r,T:st.T,E:st.E,SL:st.SL,cost:out.dmgAbs,lo:out.gdp*out.dmgLo/100,hi:out.gdp*out.dmgHi/100});
  return {before,newly,newHuman,hr,out,avgDeaths,avgCost,nino:ENSO[r]===1,arcticNow};
}
// Stresstest ohne Klimaschutz (SSP5-8.5)
const REF=(()=>{const st=initState();const arr=[st.hist[0]];
  for(let r=0;r<ROUNDS;r++){simulate(st,{...NOINV});const h=st.hist[st.hist.length-1];arr.push(h);}
  return {path:arr,tipped:{...st.tipped},humanCrossed:{...st.humanCrossed},SL:st.SL,out:outcomes(st),deathsCum:st.deathsCum,costCum:st.costCum};})();
const nTip=st=>Object.keys(st.tipped).filter(k=>!(k==='KR'&&st.tipped[k]===2025)).length;
