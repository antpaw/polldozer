var _ = require('./_escape.js');

module.exports = function(poll, langStrings) {
  var html = '<form>';
  html += '<h3>' + _(poll.title) + '</h3>';
  html += '<ul>';
  for (var i = 0; i < poll.answers.length; i++) {
    html += '<li>';
    html += '<h5>' + _(poll.answers[i].title) + '</h5>';
    html += '<input class="poll-js-answer" type="radio" name="answer_id" value="' + poll.answers[i]._id + '" />';
    html += '</li>';
  }
  html += '</ul><input class="poll-js-submit" type="submit" value="' + langStrings.submit + '"></form>';
  return html;
};
