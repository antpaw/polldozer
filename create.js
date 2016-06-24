var template = require('./templates/create.js');

function getLang(locale) {
  var lang = {
    de: {
      title: 'Stelle eine Frage…',
      answerTitles: [
        'Auswahl 1', 'Auswahl 2', 'Auswahl 3 (optional)', 'Auswahl 4 (optional)',
        'Auswahl 5 (optional)', 'Auswahl 6 (optional)', 'Auswahl 7 (optional)', 'Auswahl 8 (optional)'
      ],
      addChoice: '+ Auswahl hinzufügen',
      lengthTitle: 'Dauer der Umfrage',
      defaultLength: '1 Tag',
      lengthDays: 'Tage',
      lengthHours: 'Stunden',
      lengthMinutes: 'Min',
      success: 'Umfrage wurde erstellt!',
      submit: 'Umfrage hinzufügen'
    },
    en: {
      title: 'Ask a question…',
      answerTitles: [
        'Choice 1', 'Choice 2', 'Choice 3 (optional)', 'Choice 4 (optional)',
        'Choice 5 (optional)', 'Choice 6 (optional)', 'Choice 7 (optional)', 'Choice 8 (optional)'
      ],
      addChoice: '+ Add a choice',
      lengthTitle: 'Poll length',
      defaultLength: '1 day',
      lengthDays: 'Days',
      lengthHours: 'Hours',
      lengthMinutes: 'Min',
      success: 'Poll created!',
      submit: 'Add Poll'
    }
  };
  return lang[locale] || lang.en;
}

function removeClass(elem, className) {
  elem.setAttribute('class', elem.getAttribute('class').replace(new RegExp(className, 'g'), ''));
}

function addClass(elem, className) {
  elem.setAttribute('class', elem.getAttribute('class') + ' ' + className);
}

module.exports = function(options){
  var element = options.element;
  var langStrings = getLang(options.locale);
  element.innerHTML = template(langStrings);
  var errorsElem = element.querySelector('.polldozer-js-errors');
  var titleInputElem = element.querySelector('.polldozer-js-title-input');
  var selectDaysElem = element.querySelector('.polldozer-js-select-days');
  var selectHoursElem = element.querySelector('.polldozer-js-select-hours');
  var selectMinutesElem = element.querySelector('.polldozer-js-select-minutes');
  var changeLengthButton = element.querySelector('.polldozer-js-change-length');
  var addChoiceButton = element.querySelector('.polldozer-js-add-choice');
  var inputSelector = '.polldozer-js-submit, .polldozer-js-title-input, .polldozer-js-answer-input, .polldozer-js-remove-choice';
  var disabledInputs = element.querySelectorAll(inputSelector);

  var showAdditionalChoiceFiled = function(e){
    e.preventDefault();
    var choiceElements = element.querySelectorAll('.polldozer-js-choice.polldozer-is-hide');
    var choiceElem = choiceElements[0];
    if (choiceElem) {
      if (choiceElements.length === 1) {
        addClass(addChoiceButton, 'polldozer-is-hide');
      }
      removeClass(choiceElem, 'polldozer-is-hide');

      var removeChoiceButton = choiceElem.querySelector('.polldozer-js-remove-choice');
      var removeChoiceFiled = function(e){
        e.preventDefault();
        addClass(choiceElem, 'polldozer-is-hide');
        removeClass(addChoiceButton, 'polldozer-is-hide');

        if (element.addEventListener) {
          removeChoiceButton.removeEventListener('click', removeChoiceFiled);
        }
        else {
          removeChoiceButton.detachEvent('onclick', removeChoiceFiled);
        }
      };
      if (element.addEventListener) {
        removeChoiceButton.addEventListener('click', removeChoiceFiled);
      }
      else {
        removeChoiceButton.attachEvent('onclick', removeChoiceFiled);
      }
    }
  };

  var showLengthInputs = function(e){
    e.preventDefault();
    addClass(changeLengthButton, 'polldozer-is-hide');
    removeClass(element.querySelector('.polldozer-js-lenght-inputs'), 'polldozer-is-hide');
  };


  var minutesTooLowIndex = 5;
  var toggleDeactivtedMinutes = function(disable){
    for (var i = 0; i < minutesTooLowIndex; i++) {
      selectMinutesElem.children[i].disabled = disable;
    }
  };

  var isMinutesValueTooLow = function() {
    for (var i = 0; i < minutesTooLowIndex; i++) {
      if (selectMinutesElem.value === i + '') {
        return true;
      }
    }
    return false;
  };

  var selectDaysChange = function(){
    if (selectDaysElem.value === '0' && selectHoursElem.value === '0' && isMinutesValueTooLow()) {
      selectHoursElem.selectedIndex = 1;
    }
    toggleDeactivtedMinutes(selectHoursElem.value === '0' && selectDaysElem.value === '0');
  };
  var selectHoursChange = function(){
    if (selectHoursElem.value === '0' && selectDaysElem.value === '0' && isMinutesValueTooLow()) {
      selectMinutesElem.selectedIndex = minutesTooLowIndex;
    }
    toggleDeactivtedMinutes(selectHoursElem.value === '0' && selectDaysElem.value === '0');
  };

  var submitPoll = function(e){
    e.preventDefault();
    var answerTitles = [];
    var answerInputs = element.querySelectorAll('.polldozer-js-answer-input');
    for (var i = 0; i < answerInputs.length; i++) {
      if (answerInputs[i].value) {
        answerTitles.push(answerInputs[i].value);
      }
    }
    for (i = 0; i < disabledInputs.length; i++) {
      disabledInputs[i].disabled = true;
    }
    options.corsRequestFn({
      onSuccess: function(poll){
        element.innerHTML = '<div class="polldozer"><h3>' + langStrings.success + '</h3></div>';
        options.onCreate(poll);
      },
      onFailure: function(xhrData){
        if (xhrData && xhrData.responseJSON && xhrData.responseJSON.errors && xhrData.responseJSON.errors.length) {
          removeClass(errorsElem, 'polldozer-is-hide');
          errorsElem.innerHTML = '<h4 class="polldozer-errors">' + xhrData.responseJSON.errors.join(', ') + '</h4>';
        }
        for (i = 0; i < disabledInputs.length; i++) {
          disabledInputs[i].disabled = false;
        }
      }
    }).post(options.apiUrl + 'api/v1/polls.json', {
      poll_title: titleInputElem.value,
      date_offset: {
        days: selectDaysElem.value,
        hours: selectHoursElem.value,
        minutes: selectMinutesElem.value
      },
      answer_titles: answerTitles
    });
    return false;
  };

  if (element.addEventListener) {
    element.querySelector('.polldozer-js-form').addEventListener('submit', submitPoll, false);
    selectDaysElem.addEventListener('change', selectDaysChange);
    selectHoursElem.addEventListener('change', selectHoursChange);
    changeLengthButton.addEventListener('click', showLengthInputs);
    addChoiceButton.addEventListener('click', showAdditionalChoiceFiled);
  }
  else {
    element.querySelector('. ').attachEvent('onsubmit', submitPoll);
    selectDaysElem.attachEvent('onchange', selectDaysChange);
    selectHoursElem.attachEvent('onchange', selectHoursChange);
    changeLengthButton.attachEvent('onclick', showLengthInputs);
    addChoiceButton.attachEvent('onclick', showAdditionalChoiceFiled);
  }
};
