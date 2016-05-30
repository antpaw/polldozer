var _ = require('./_escape.js');
var metaPartial = require('./_meta.js');

module.exports = function(poll, langStrings, validUntil) {
  var html = '<form>';
  html += '<h3>' + _(poll.title) + '</h3>';
  html += '<ul>';
  for (var i = 0; i < poll.answers.length; i++) {
    html += '<li>';
    html += '<h5>' + _(poll.answers[i].title) + '</h5>';
    html += '<p>' + langStrings.count + ': ' + poll.answers[i].vote_count + '</p>';
    html += '<p>' + langStrings.total + ': ' + poll.answers[i].percent_total + '%</p>';
    html += '</li>';
  }
  html += '</ul>';
  html += '<p class="polldozer-js-meta">' + metaPartial(poll, langStrings, validUntil) + '</p>';
  html += '</form>';
  return html;
};
