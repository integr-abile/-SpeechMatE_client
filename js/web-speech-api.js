var messages = {
  "start": {
    msg: 'Click on the microphone icon and begin speaking.',
    class: 'alert-success'},
  "speak_now": {
    msg: 'Speak now.',
    class: 'alert-success'},
  "no_speech": {
    msg: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a>.',
    class: 'alert-danger'},
  "no_microphone": {
    msg: 'No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a> are configured correctly.',
    class: 'alert-danger'},
  "allow": {
    msg: 'Click the "Allow" button above to enable your microphone.',
    class: 'alert-warning'},
  "denied": {
    msg: 'Permission to use microphone was denied.',
    class: 'alert-danger'},
  "blocked": {
    msg: 'Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone',
    class: 'alert-danger'},
  "upgrade": {
    msg: 'Web Speech API is not supported by this browser. It is only supported by <a href="//www.google.com/chrome">Chrome</a> version 25 or later on desktop and Android mobile.',
    class: 'alert-danger'},
  "stop": {
      msg: 'Stop listening, click on the microphone icon to restart',
      class: 'alert-success'},
  "copy": {
    msg: 'Contenet copy to clipboard successfully.',
    class: 'alert-success'},
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var recognition;

$( document ).ready(function() {
  for (var i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
  }
  select_language.selectedIndex = 14; //italiano di default
  updateCountry();
  select_dialect.selectedIndex = 0;
  
  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  } else {
    showInfo('start');  
    start_button.style.display = 'inline-block';
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // recognition.maxAlternatives = 2;

    $.get('../res/math_grammar.txt',function(data){ //carico il mio file di grammatica
      
      var speechRecognitionList = new webkitSpeechGrammarList();
      speechRecognitionList.addFromString(data, 1);
      recognition.grammars = speechRecognitionList;
    })
    // var speechRecognitionList = new webkitSpeechGrammarList();
    // speechRecognitionList.addFromString(grammar, 1);
    // recognition.grammars = speechRecognitionList;
    
    recognition.onstart = function() {
      recognizing = true;
      showInfo('speak_now');
      start_img.src = 'images/mic-animation.gif';
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        start_img.src = 'images/mic.gif';
        showInfo('no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        start_img.src = 'images/mic.gif';
        showInfo('no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo('blocked');
        } else {
          showInfo('denied');
        }
        ignore_onend = true;
      }
    };

    recognition.onend = function() {
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      start_img.src = 'images/mic.gif';
      if (!final_transcript) {
        showInfo('start');
        return;
      }
      showInfo('stop');
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
      }
    };

    recognition.onresult = function(event) {
      
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          console.log("final");
  
          final_transcript += spellingCorrection(event.results[i][0].transcript.toLowerCase()); //0 indica l'alternativa più probabile. Decreasing confidence order
          // debugger
          postMathText(final_transcript);
        
          final_transcript = '';
          final_span.innerHTML = '';
          interim_span.innerHTML = '';
        } else {
          console.log("interim");
          interim_transcript += event.results[i][0].transcript;
        }
      }
      // final_transcript = capitalize(final_transcript);
      final_span.innerHTML = linebreak(final_transcript);
      interim_span.innerHTML = linebreak(interim_transcript);
    };
  }
});


function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}


function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

//abilito l'inizio della dettatura
$("#start_button").click(function () {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'images/mic-slash.gif';
  showInfo('allow');
  start_timestamp = event.timeStamp;
});

$("#select_language").change(function () {
  updateCountry();
});

function showInfo(s) {
  if (s) {
    var message = messages[s];
    $("#info").html(message.msg);
    $("#info").removeClass();
    $("#info").addClass('alert');
    $("#info").addClass(message.class);
  } else {
    $("#info").removeClass();
    $("#info").addClass('d-none');
  }
}

//WS
function postMathText(txt){
  var xhttp = new XMLHttpRequest();
  var addr = "http://"+env.HOST_IP+":5000/mathtext";
  xhttp.open("POST",addr,true);
  xhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({"text":txt}));
}

function spellingCorrection(text){
  if(text!==""){
    var split = text.split(" ");
    for(var i=0;i<split.length;i++)
      if(split[i] !== "" && problematic_letters[split[i]] !== undefined)
        split[i] = problematic_letters[split[i]];
    return split.join(' ');
  }
  return "";
}