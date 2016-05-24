var templateVote = require('./templates/vote.js');
var templateStats = require('./templates/stats.js');

var lang = {
  de: {
    title: 'Stelle eine Frage…',
    finalResult: 'Final result',
    submit: 'Absenden'
  },
  en: {
    finalResult: 'Final result',
    submit: 'Vote',
    votes_many: 'Votes',
    votes_one: 'Vote'
  }
};

function getLang(locale) {
  return lang[locale] || lang.en;
}

module.exports = function(options){
  var element = options.element;
  var pollId = element.getAttribute('data-poll-id');
  var langStrings = getLang(options.locale);

  var renderForm = function(poll){
    element.innerHTML = templateVote(poll, langStrings);
    var submitVote = function(e){
      // TODO: remove `submit` event
      e.preventDefault();
      var answerElems = element.querySelectorAll('.poll-js-answer');
      var answerId;
      for (var i = 0; i < answerElems.length; i++) {
        if (answerElems[i].checked) {
          answerId = answerElems[i].value;
        }
      }
      if ( ! answerId) { return; }
      options.corsRequestFn({
        onSuccess: renderResult,
        onFailure: function(xhrData){
          if (xhrData && xhrData.responseJSON && xhrData.responseJSON.errors && xhrData.responseJSON.errors.length) {
            element.innerHTML = '<h4 class="poll-errors">' + xhrData.responseJSON.errors.join(', ') + '</h4>';
          }
        }
      }).post(options.apiUrl + 'api/v1/polls/' + pollId + '/vote.json', {
        answer_id: answerId
      });
      return false;
    };
    if (element.addEventListener) {
      element.querySelector('form').addEventListener('submit', submitVote, false);
    }
    else {
      element.querySelector('form').attachEvent('onsubmit', submitVote);
    }
  };

  var renderResult = function(poll){
    element.innerHTML = templateStats(poll, langStrings);
  };

  var initWithData = function(poll){
    if (poll.ip_has_voted || poll.finished) {
      renderResult(poll);
    }
    else {
      renderForm(poll);
    }
  };

  if (options.pollData) {
    initWithData(options.pollData);
  }
  else {
    options.corsRequestFn({
      onSuccess: initWithData,
      onFailure: function() {}
    }).get(options.apiUrl + 'api/v1/polls/' + pollId + '.json');
  }
};
