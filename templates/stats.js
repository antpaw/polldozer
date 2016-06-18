var _ = require('./_escape.js');
var metaPartial = require('./_meta.js');

module.exports = function(poll, langStrings, validUntil) {
  var answer;
  var html = '<div class="polldozer-holder">';
  html += '<h3 class="polldozer-title">' + _(poll.title) + '</h3>';
  html += '<ul class="polldozer-answers">';
  if (poll.answers) {
    for (var i = 0; i < poll.answers.length; i++) {
      answer = poll.answers[i];
      html += '<li class="polldozer-answer">';
      html += '<div class="polldozer-answer-bar';
      html += (answer.winner ? ' polldozer-answer-winner' : '') + (answer.users_vote ? ' polldozer-answer-users-vote' : '') + '"';
      html += ' style="width: ' + answer.percent + '%"></div>';
      html += '<div class="polldozer-stats-holder">';
      html += '<span class="polldozer-answer-percent polldozer-answer-left-box"><strong>' + answer.percent + '</strong>%</span> ';
      html += '<span class="polldozer-answer-title">' + _(answer.title) + '</span>';
      html += '</div>';
      html += '</li>';
    }
  }
  html += '</ul>';
  html += '<p class="polldozer-footer"><span class="polldozer-js-meta polldozer-meta">';
  html += metaPartial(poll, langStrings, validUntil) + '</span></p>';
  html += '</div>';
  return html;
};
