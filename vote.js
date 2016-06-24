var relativeTime = require('./lib/relative_time.js');
var templateVote = require('./templates/vote.js');
var templateStats = require('./templates/stats.js');
var metaPartial = require('./templates/_meta.js');

function getLang(locale) {
  var lang = {
    de: {
      finalResult: 'Endergebnisse',
      submit: 'Abstimmen',
      votesMany: 'Stimmen',
      votesOne: 'Stimme'
    },
    en: {
      finalResult: 'Final results',
      submit: 'Vote',
      votesMany: 'votes',
      votesOne: 'vote'
    }
  };
  return lang[locale] || lang.en;
}

module.exports = function(options){
  var localStorage = options.externalLocalStorage || window.localStorage;
  var element = options.element;
  var pollId = element.getAttribute('data-poll-id');
  var voteId;
  if (localStorage) {
    voteId = localStorage.getItem('polldozer_' + pollId);
  }
  var langStrings = getLang(options.locale);

  var renderResult = function(poll){
    element.innerHTML = templateStats(poll, langStrings, relativeTime(new Date(poll.valid_until * 1000), options.locale));
  };

  var renderForm = function(poll){
    element.innerHTML = templateVote(poll, langStrings, relativeTime(new Date(poll.valid_until * 1000), options.locale));
    var disabledInputs = element.querySelectorAll('.polldozer-js-submit, .polldozer-js-answer');
    var submitVote = function(e){
      // TODO: remove `submit` event
      e.preventDefault();
      var answerElems = element.querySelectorAll('.polldozer-js-answer');
      var answerId;
      for (var i = 0; i < answerElems.length; i++) {
        if (answerElems[i].checked) {
          answerId = answerElems[i].value;
        }
      }
      if ( ! answerId) { return; }
      for (i = 0; i < disabledInputs.length; i++) {
        disabledInputs[i].disabled = true;
      }
      options.corsRequestFn({
        onSuccess: function(poll){
          localStorage.setItem('polldozer_' + poll._id, poll.vote_id);
          renderResult(poll);
          if (options.onVote) {
            options.onVote(poll);
          }
        },
        onFailure: function(xhrData){
          if (xhrData && xhrData.responseJSON && xhrData.responseJSON.errors && xhrData.responseJSON.errors.length) {
            var errors = xhrData.responseJSON.errors.join(', ');
            element.innerHTML = '<div class="polldozer"><h4 class="polldozer-errors">' + errors + '</h4></div>';
          }
          else {
            for (var i = 0; i < disabledInputs.length; i++) {
              disabledInputs[i].disabled = false;
            }
          }
        }
      }).post(options.apiUrl + 'api/v1/polls/' + pollId + '/vote.json', {
        answer_id: answerId
      });
      return false;
    };
    if (element.addEventListener) {
      element.querySelector('.polldozer-js-form').addEventListener('submit', submitVote, false);
    }
    else {
      element.querySelector('.polldozer-js-form').attachEvent('onsubmit', submitVote);
    }
  };

  var initWithData = function(poll){
    if (poll.ip_has_voted || poll.finished || ! localStorage) {
      renderResult(poll);
    }
    else {
      renderForm(poll);
    }
    setInterval(function(){
      element.querySelector('.polldozer-js-meta').innerHTML = metaPartial(
        poll, langStrings, relativeTime(new Date(poll.valid_until * 1000), options.locale)
      );
    }, 60000);
  };

  if (options.pollData) {
    initWithData(options.pollData);
  }
  else {
    options.corsRequestFn({
      onSuccess: initWithData,
      onFailure: function() {}
    }).get(options.apiUrl + 'api/v1/polls/' + pollId + '.json' + (voteId ? ('?vote_id=' + voteId) : ''));
  }
};
