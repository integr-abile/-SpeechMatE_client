var langs =
[['Afrikaans',       ['af-ZA']],
 ['Bahasa Indonesia',['id-ID']],
 ['Bahasa Melayu',   ['ms-MY']],
 ['Català',          ['ca-ES']],
 ['Čeština',         ['cs-CZ']],
 ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']],
 ['Español',         ['es-AR', 'Argentina'],
                     ['es-BO', 'Bolivia'],
                     ['es-CL', 'Chile'],
                     ['es-CO', 'Colombia'],
                     ['es-CR', 'Costa Rica'],
                     ['es-EC', 'Ecuador'],
                     ['es-SV', 'El Salvador'],
                     ['es-ES', 'España'],
                     ['es-US', 'Estados Unidos'],
                     ['es-GT', 'Guatemala'],
                     ['es-HN', 'Honduras'],
                     ['es-MX', 'México'],
                     ['es-NI', 'Nicaragua'],
                     ['es-PA', 'Panamá'],
                     ['es-PY', 'Paraguay'],
                     ['es-PE', 'Perú'],
                     ['es-PR', 'Puerto Rico'],
                     ['es-DO', 'República Dominicana'],
                     ['es-UY', 'Uruguay'],
                     ['es-VE', 'Venezuela']],
 ['Euskara',         ['eu-ES']],
 ['Français',        ['fr-FR']],
 ['Galego',          ['gl-ES']],
 ['Hrvatski',        ['hr_HR']],
 ['IsiZulu',         ['zu-ZA']],
 ['Íslenska',        ['is-IS']],
 ['Italiano',        ['it-IT', 'Italia'],
                     ['it-CH', 'Svizzera']],
 ['Magyar',          ['hu-HU']],
 ['Nederlands',      ['nl-NL']],
 ['Norsk bokmål',    ['nb-NO']],
 ['Polski',          ['pl-PL']],
 ['Português',       ['pt-BR', 'Brasil'],
                     ['pt-PT', 'Portugal']],
 ['Română',          ['ro-RO']],
 ['Slovenčina',      ['sk-SK']],
 ['Suomi',           ['fi-FI']],
 ['Svenska',         ['sv-SE']],
 ['Türkçe',          ['tr-TR']],
 ['български',       ['bg-BG']],
 ['Pусский',         ['ru-RU']],
 ['Српски',          ['sr-RS']],
 ['한국어',            ['ko-KR']],
 ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                     ['cmn-Hans-HK', '普通话 (香港)'],
                     ['cmn-Hant-TW', '中文 (台灣)'],
                     ['yue-Hant-HK', '粵語 (香港)']],
 ['日本語',           ['ja-JP']],
 ['Lingua latīna',   ['la']]];

 //errori fonetici comuni che le web speech API commettono su singole lettere o incorporando in singole parole più parole (biword per esempio)
 //phoneme2grapheme shallow mapping
 var problematic_letters = {
     "bi":"b",
     "ci":"c",
     "gi":"g",
     "pi":"p",
     "ti":"t",
     "vi":"v",
     "ics":"x",
     "ha":"a",
     "the":"de", //per integrali
     "dx":" di x", //per esempio: per f(x), cos(x)
     "*":"per"
 };

 var exceptions = [["in","dx"]];

// var grammar = '#JSGF V1.0 UTF-8 it; grammar my-math;'
// grammar += "<roman_letter> = a | b | c | d | e | f | g | h | i | j | k | l | m | n | o | p | q | r | s | t | u | v | w | x | y | z ;";
// grammar += "<greek_letter> = alfa | beta | gamma | delta | epsilon | zeta | eta | teta | iota | cappa | lambda | mu | nu | xi | omicron | pi | ro | sigma | tau | upsilon | fi | chi | psi | omega ;";
// grammar += "<capital-roman> = <roman_letter> maiuscolo;";
// grammar += "<capital-greek> = <greek_letter> maiuscolo;";
// grammar += "<multiple-roman-letters> = <roman_letter>+ | <capital-roman>+;";
// grammar += "<multiple-greek-letters> = <greek_letter>+ | <capital-greek>+;";
// grammar += "<generic-letter> = <roman_letter> | <capital-roman> | <greek_letter> | <capital-greek>;";
// grammar += "<multiple-generic-letter> = <multiple-roman-letters> | <multiple-greek-letters>;";
// grammar += "<più> = più;";
// grammar += "<meno> = meno;";
// grammar += "<per> = per | moltiplicato per;";
// grammar += "<diviso> = diviso;";
// grammar += "<uguale> = uguale;";
// grammar += "<diverso> = diverso;";
// grammar += "<minore> = minore di;";
// grammar += "<maggiore> = maggiore di;";
// grammar += "<minore-uguale> = minore [o] uguale ([a] | [di]);";
// grammar += "<maggiore-uguale> = maggiore [o] uguale ([a] | [di]);";
// grammar += "<segno> = <più> | <meno> | <per> | <diviso> | <uguale> | <diverso> | <maggiore> | <minore> | <minore-uguale> | <maggiore-uguale>;";
// grammar += "<parentesi-tonda-aperta> = aperta tonda | aperta parentesi tonda;";
// grammar += "<parentesi-tonda-chiusa> = chiusa tonda | chiusa parentesi tonda;";
// grammar += "<parentesi-quadra-aperta> = aperta quadra | aperta parentesi quadra;";
// grammar += "<parentesi-quadra-chiusa> = chiusa quadra | chiusa parentesi quadra;";
// grammar += "<parentesi-graffa-aperta> = aperta graffa | aperta parentesi graffa;";
// grammar += "<parentesi-graffa-chiusa> = chiusa graffa | chiusa parentesi graffa;";
// grammar += "<più-meno> = più o meno;";
// grammar += "<funzione-di> = funzione di;";
// grammar += "<pedice> = <generic-letter> pedice;";
// grammar += "<frazione> = frazione;"
// grammar += "<parti-frazione> = numeratore | denominatore | fratto;";
// grammar += "<seno> = seno di | sen;";
// grammar += "<coseno> = coseno di | cos;";
// grammar += "<tangente> = tangente di;";