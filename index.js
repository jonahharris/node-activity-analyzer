(function() {
  if ('undefined' === typeof aa || null === aa) {
    var aa = {};
  }

  aa.timeOfDayNames = [
    'at night',
    'in the morning',
    'in the forenoon',
    'at noon',
    'in the afternoon',
    'in the evening'
  ];

  aa.hourToTimeOfDayNameMapping = [
    0, 0, 0, 0, 0, 1,
    1, 1, 2, 2, 2, 2,
    3, 3, 4, 4, 4, 4,
    5, 5, 5, 5, 5, 0,
  ];

  aa.exports = {};

  aa.exports.getTimeOfDayNameForHour = function (hour) {
    if (!(0 <= hour && 23 >= hour)) {
      return;
    }

    return aa.timeOfDayNames[aa.hourToTimeOfDayNameMapping[hour]];
  };

  aa.exports.getMostActiveTimeOfDayForActivity = function (activity) {
    var activityCountByTimeOfDay = [];
    var mostActiveTimeOfDay = 0;
    var max = 0;

    for (var ii = 0; ii < aa.timeOfDayNames.length; ++ii) {
      activityCountByTimeOfDay.push(0);
    }

    for (var ii in activity) {
      var hour = ii;
      var activityCount = activity[hour];
      if (!(0 <= hour && 23 >= hour)) {
        throw new Error('Hour ' + hour + ' is not valid.');
      }

      var timeOfDay = aa.hourToTimeOfDayNameMapping[hour];
      if (++activityCountByTimeOfDay[timeOfDay] > max) {
        max = activityCountByTimeOfDay[timeOfDay];
        mostActiveTimeOfDay = timeOfDay;
      }
    }

    return aa.timeOfDayNames[mostActiveTimeOfDay];
  };

  aa.exports.getMostActiveHoursForActivity = function (activity) {
    var gm = 1;
    var count = 0;
    var hours = [
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
    ];

    for (var ii in activity) {
      var hour = ii;
      var activityCount = activity[hour];
      if (!(0 <= hour && 23 >= hour)) {
        throw new Error('Hour ' + hour + ' is not valid.');
      }
      gm = (gm * activityCount);
      ++count;
    }

    gm = Math.pow(gm, (1 / count));

    for (var ii in activity) {
      var hour = ii;
      var activityCount = activity[hour];
      hours[hour] = ((gm < activityCount) ? 1 : 0);
    }

    var map = [];
    var old = 0;
    var run = 0;
    var threshold = 2;
    var i = 0;
    var j = (hours.length - 1);

    if (hours[i] === hours[j]) {
      while (i < j) {
        if (hours[0] === hours[i]
            || run >= threshold
            && hours[0] === hours[i + 1]) {
          ++i;
          ++run;
        }

        if (hours[0] === hours[j]
            || run >= threshold
            && hours[0] === hours[j - 1]) {
          --j;
          ++run;
        }

        if (old === run) {
          break;
        }

        old = run;
      }

      if (i < j) {
        map.push([hours[0], j + 1, i - 1]);
        old = run = 0;
      } else {
        map.push([hours[0], 0, hours.length - 1]);
        return map;
      }
    }

    for (k = i; i <= j; ) {
      if (hours[k] === hours[i]
          || run >= threshold
          && hours[k] === hours[i + 1]) {
        ++i;
        ++run;
      } else {
        map.push([hours[k], k, i - 1]);
        k = i;
        run = 0;
      }
    }

    if (k != (i + 1)) {
      map.push([hours[k], k, i - 1]);
    }

    var activityMap = { active: [], inactive: [] };
    for (var ii in map) {
      var activityEntry = map[ii];
      var activityStatus = activityEntry[0];
      var activityArray = null;
      if (0 === activityStatus) {
        activityArray = activityMap.inactive;
      } else {
        activityArray = activityMap.active;
      }
      activityArray.push([activityEntry[1], activityEntry[2]]);
    }

    return activityMap;
  };

  aa.exports.getMostActiveTimesOfDayForActivity = function (activity) {
    var range = aa.exports.getMostActiveHoursForActivity(activity);
    var activeTimesOfDay = [];

    for (var ii = 0; ii < range.active.length; ++ii) {
      for (var jj = range.active[ii][0]; jj <= range.active[ii][1]; ++jj) {
        activeTimesOfDay.push(aa.timeOfDayNames[aa.hourToTimeOfDayNameMapping[jj]]);
      }
    }

    return activeTimesOfDay.filter(function (value, index, self) {
      return (index === self.indexOf(value));
    });
  };

  if ('undefined' !== typeof module && module.exports) {
    module.exports = aa.exports;
  }
})();
