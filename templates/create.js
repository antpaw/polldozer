module.exports = function(langStrings) {
  var _selectTag = function(name, maxLength, selectedIndex) {
    var selectHtml = '<select class="polldozer-js-select-' + name + '" name="' + name + '">';
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
  var html = '<div class="polldozer-holder">';
  html += '<form>';
  html += '<div class="polldozer-js-errors polldozer-is-hide"></div>';
  html += '<input class="polldozer-js-title-input polldozer-title-input"';
  html += ' placeholder="' + langStrings.title + '" name="poll_title" autocomplete="off" required />';
  html += '<ul class="polldozer-answers">';
  for (var i = 0; i < 8; i++) {
    html += '<li class="polldozer-js-choice';
    hideAnswer = i > 1;
    if (hideAnswer) {
      html += ' polldozer-is-hide';
    }
    html += '">';
    html += '<input class="polldozer-js-answer-input polldozer-answer-input" autocomplete="off" ';
    html += 'name="answer_titles[' + i + ']" placeholder="' + langStrings.answerTitles[i] + '"';
    if ( ! hideAnswer) {
      html += ' required';
    }
    html += ' />';
    if (hideAnswer) {
      html += ' <a href="#" class="polldozer-js-remove-choice polldozer-remove-choice">&times;</a>';
    }
    html += '</li>';
  }
  html += '</ul>';
  html += '<p class="polldozer-button-line polldozer-add-choice-line">';
  html += '<a href="#" class="polldozer-button polldozer-js-add-choice">' + langStrings.addChoice + '</a></p>';
  html += '<p class="polldozer-button-line">' + langStrings.lengthTitle + ': ';
  html += '<a class="polldozer-js-change-length" href="#">' + langStrings.defaultLength + '</a>';
  html += '<span class="polldozer-js-lenght-inputs polldozer-lenght-inputs polldozer-is-hide">';
  html += ' ' + langStrings.lengthDays + ': ' + _selectTag('days', 8, 1);
  html += ' ' + langStrings.lengthHours + ': ' + _selectTag('hours', 24);
  html += ' ' + langStrings.lengthMinutes + ': ' + _selectTag('minutes', 60);
  html += '</span></p></ul>';
  html += '<button class="polldozer-submit polldozer-js-submit">' + langStrings.submit + '</button> ';
  html += '</form></div>';
  return html;
};
