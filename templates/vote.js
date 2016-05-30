var _ = require('./_escape.js');
var metaPartial = require('./_meta.js');

module.exports = function(poll, langStrings, validUntil) {
  var html = '<form>';
  var voteId;
  html += '<h3>' + _(poll.title) + '</h3>';
  html += '<ul>';
  for (var i = 0; i < poll.answers.length; i++) {
    voteId = 'polldozer_vote_' + poll._id + '_' + poll.answers[i]._id;
    html += '<li>';
    html += '<label for="' + voteId + '"><h5>' + _(poll.answers[i].title) + '</h5></label>';
    html += '<input id="' + voteId + '" class="polldozer-js-answer"';
    html += ' type="radio" name="answer_id" value="' + poll.answers[i]._id + '" />';
    html += '</li>';
  }
  html += '</ul>';
  html += '<p class="polldozer-js-meta">' + metaPartial(poll, langStrings, validUntil) + '</p>';
  html += '<input class="polldozer-js-submit" type="submit" value="' + langStrings.submit + '"></form>';
  return html;
};
