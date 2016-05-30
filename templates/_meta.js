module.exports = function(poll, langStrings, timeLeft) {
  var html = '';
  if (poll.total_votes_count) {
    if (poll.total_votes_count === 1) {
      html += poll.total_votes_count + ' ' + langStrings.votesOne;
    }
    else {
      // TODO: format count
      html += poll.total_votes_count + ' ' + langStrings.votesMany;
    }
    html += ' • ';
  }
  if (poll.finished) {
    html += langStrings.finalResult;
  }
  else {
    html += timeLeft;
  }
  return html;
};
