# Speech Recognition Client

## Cos'è

Questo progetto serve per riconoscere un flusso continuo di parlato e comunicare ad un servizio esterno cosa è stato riconosciuto man mano. **è un prototipo**.

Il motore di riconoscimento vocale è quello gratuito **online** di Google e per questo motivo il progetto è scritto in HTML+JS ed è pensato per funzionare via web **esclusivamente** attraverso il **Browser Chrome** che implementa il supporto alle **[WebSpeechAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**. 

Il funzionamento è semplice: basta premere il microfono per iniziare la registrazione. Le parole chiave "matematica" e "modifica" servono per entrare in modalità dettatura matematica o editing matematica. Ciò che cambia tra una modalità e l'altra è la grammatica che vincola il riconoscimento (scritta in [JSGF](https://www.w3.org/TR/2000/NOTE-jsgf-20000605/)) e l'endpoint chiamato quando il riconoscitore di Google ritiene di aver riconosciuto un "testo definitivo" con sufficiente affidabilità dove le modalità con questo avviene non sono accessibili e sono tutte a carico di Google: infatti il servizio funziona solo con una connessione Internet attiva e utilizza l'engine di STT integrato in Google Chrome. **Gli endpoint** citati sono definiti in formato stringa e sono modificabili dal progetto, mentre l'host sul quale quegli endpoint sono definiti è specificato da un file di configurazione `env.js` ed è **da adattare** a seconda dell'IP o del nome host del server verso il quale devono essere redirette le chiamate di questo client. Le path attualmente cablate nel codice sono `http://<HOST>:5000/mathText` e `http://<HOST>:5000/editText`. La porta 5000, anch'essa comunque cambiabile, è quella di default del **web server python  Flask** utilizzato come back-end del progetto di SpeechToMat del quale questo progetto (SpeechRecognitionClient) è il client.

## Uso

### Grammatiche

nella cartella `js/res` sono contenute le grammatiche in formato JSGF per **aiutare** il riconoscitore di Google a riconoscere un lessico specifico: nel nostro contesto quello matematico. **Queste grammatiche vengono lette ed assegnate all'istanza del riconoscitore vocale all'interno del progetto**. Notare che **aiutano** e non escludono i termini non presenti nella grammatica. In altri riconoscitori non è così: le uniche parole riconosciute sono quelle contenute nella grammatica

### Guida

- aprire un terminale 

- eseguire lo script `start_client.sh`. Il programma verrà eseguito in un container Docker (sotto server apache) accessibile da browser via `localhost:8080`

  





