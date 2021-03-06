var _ = require('./_escape.js');
var metaPartial = require('./_meta.js');

module.exports = function(poll, langStrings, validUntil) {
  var voteId;
  var answer;
  var html = '<div class="polldozer">';
  html += '<form class="polldozer-js-form">';
  html += '<h3 class="polldozer-title">' + _(poll.title) + '</h3>';
  html += '<ul class="polldozer-answers">';
  if (poll.answers) {
    for (var i = 0; i < poll.answers.length; i++) {
      answer = poll.answers[i];
      voteId = 'polldozer_vote_' + poll._id + '_' + poll.answers[i]._id;
      html += '<li><label class="polldozer-answer polldozer-answer-label" for="' + voteId + '">';
      html += '<span class="polldozer-answer-left-box"><input id="' + voteId + '" value="' + answer._id + '" required';
      html += ' class="polldozer-js-answer polldozer-checkbox" type="radio" name="answer_id" /></span> ';
      html += '<span class="polldozer-answer-title">' + _(answer.title) + '</span>';
      html += '</label></li>';
    }
  }
  html += '</ul>';
  html += '<p class="polldozer-footer">';
  html += '<button class="polldozer-submit polldozer-js-submit">' + langStrings.submit + '</button> ';
  html += '<span class="polldozer-js-meta polldozer-meta">' + metaPartial(poll, langStrings, validUntil) + '</span>';
  html += '</p>';
  html += '</form>';
  html += '</div>';
  return html;
};
