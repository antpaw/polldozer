module.exports = function(langStrings) {
  var _selectTag = function(name, maxLength, selectedIndex) {
    var selectHtml = '<select class="poll-js-select-' + name + '" name="' + name + '">';
    for (var i = 0; i < maxLength; i++) {
      selectHtml += '<option value="' + i + '"';
      if (i === selectedIndex) {
        selectHtml += ' selected="true"';
      }
      selectHtml += '>' + i + '</option>';
    }
    return selectHtml + '</select>';
  };

  var hideAnswer = false;
  var html = '<form>';
  html += '<div class="poll-js-errors poll-is-hide"></div>';
  html += '<input class="poll-js-title-input" placeholder="' + langStrings.title + '" name="poll_title" required />';
  html += '<ul>';
  for (var i = 0; i < 8; i++) {
    html += '<li class="poll-js-choice';
    hideAnswer = i > 1;
    if (hideAnswer) {
      html += ' poll-is-hide';
    }
    html += '">';
    html += '<input class="poll-js-answer-input" name="answer_titles[' + i + ']" placeholder="' + langStrings.answerTitles[i] + '"';
    if ( ! hideAnswer) {
      html += ' required';
    }
    html += ' />';
    if (hideAnswer) {
      html += '<a class="poll-js-remove-choice">&times;</a>';
    }
    html += '</li>';
  }
  html += '</ul>';
  html += '<p><a href="#" class="poll-button poll-js-add-choice">' + langStrings.addChoice + '</a></p>';
  html += '<p>' + langStrings.lengthTitle + ': <a class="poll-js-change-length" href="#">' + langStrings.defaultLength + '</a>';
  html += '<span class="poll-js-lenght-inputs poll-is-hide">';
  html += ' ' + langStrings.lengthDays + ': ' + _selectTag('days', 8, 1);
  html += ' ' + langStrings.lengthHours + ': ' + _selectTag('hours', 24);
  html += ' ' + langStrings.lengthMinutes + ': ' + _selectTag('minutes', 60);
  html += '</span></p></ul><input class="poll-js-submit poll-button" type="submit" value=' + langStrings.submit + '></form>';
  return html;
};
