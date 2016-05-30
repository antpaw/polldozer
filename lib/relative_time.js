function getLang(locale) {
  var lang = {
    en: {
      soon: 'ends very soon',
      oneMinute: '1 minute left',
      minutes: function(minutes) {
        return minutes + ' minutes left';
      },
      oneHour: '1 hour left',
      hours: function(hours) {
        return hours + ' hours left';
      },
      oneDay: '1 day left',
      days: function(days) {
        return days + ' days left';
      },
      oneWeek: '1 week left',
      weeks: function(weeks) {
        return weeks + ' weeks left';
      }
    },
    de: {
      soon: 'endet sehr bald',
      oneMinute: 'noch 1 Minute',
      minutes: function(minutes) {
        return 'noch ' + minutes + ' Minuten';
      },
      oneHour: 'noch 1 Stunde',
      hours: function(hours) {
        return 'noch ' + hours + ' Stunden';
      },
      oneDay: 'noch 1 Tag',
      days: function(days) {
        return 'noch ' + days + ' Tage';
      },
      oneWeek: 'noch 1 Woche',
      weeks: function(weeks) {
        return 'noch' + weeks + ' Wochen';
      }
    }
  };
  return lang[locale] || lang.en;
}

module.exports = function (date, locale) {
  var lang = getLang(locale);
  var nowTime = (new Date()).getTime();
  var dateTime = date.getTime();
	var diff = (dateTime - nowTime) / 1000;
	var dayDiff = Math.floor(diff / 86400);

  if (nowTime > dateTime || dayDiff < 0 || dayDiff >= 31) {
		return '';
  }

	return dayDiff === 0 && (
			diff < 60 && lang.soon ||
			diff < 120 && lang.oneMinute ||
			diff < 3600 && lang.minutes(Math.floor( diff / 60 )) ||
			diff < 7200 && lang.oneHour ||
			diff < 86400 && lang.hours(Math.floor( diff / 3600 ))
    ) ||
		dayDiff == 1 && lang.oneDay ||
		dayDiff < 7 && lang.days(dayDiff) ||
		dayDiff < 31 && lang.weeks(Math.ceil( dayDiff / 7 ))
  ;
};
