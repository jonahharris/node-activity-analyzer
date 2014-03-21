node-activity-analyzer
======================

This is a simple, time-of-day-based activity analyzer useful when determining when an activity is most-often performed. This can be anything from a global activity to a user-specific one, such as being online, sending messages, etc.

Install
-------

    npm install activity-analyzer

Usage
-----

An example of using the tree:

```javascript
// Activity Analyzer Example
// Jonah H. Harris <jonah.harris@gmail.com>
var aa = require('activity-analyzer');

// A map with hour:activity_count
// NOTE: For behavioral analysis, all hours *should* reflect the user's local time.
var userSentMessageCountPerHour = {
  5: 2,
  6: 3,
  7: 3,
  8: 5,
  9: 4,
  10: 2,
  11: 9,
  12: 5,
  13: 14,
  14: 3,
  15: 9,
  16: 10,
  17: 7,
  18: 13,
  19: 9,
  20: 18,
  21: 27,
  22: 22,
  23: 8
};

console.log('This user sends most messages ' + aa.getMostActiveTimeOfDayForActivity(userSentMessageCountPerHour));
// This user sends most messages in the evening

console.log(aa.getMostActiveHoursForActivity(userSentMessageCountPerHour));
// { active: [ [ 15, 23 ] ], inactive: [ [ 0, 14 ] ] }

console.log(aa.getMostActiveTimesOfDayForActivity(userSentMessageCountPerHour));
// [ 'in the afternoon', 'in the evening', 'at night' ]
```

