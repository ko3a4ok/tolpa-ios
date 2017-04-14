'use strict';
import moment from 'moment';

export const PRIMARY_COLOR = '#25a67d';
export const DARK_COLOR = '#16805e';

export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
      return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
      return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
      return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
      return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
      return interval + " minutes ago";
  }
  return "just now";
}

export const KYIV = {
  latitude: 50.45,
  longitude: 30.5234,
}


export function nextDate(days) {
  let ddays = {};
  Object.entries(days).forEach(
    ([key, value]) => {
      if (value.start) ddays[key] = value.start
    }
  );
  days = ddays;
  if (Object.keys(days).length == 0) return;
  let m = moment();
  let tnow = m.hour()*60+ m.minute();

  for (var i = 0; i < 10; i++) {
    if (m.day() in days) {
      if (tnow == 0) return m;
      let t = moment(days[m.day()], 'h:mm');
      let tt = t.hour()*60 + t.minute();
      if (tnow <= tt) return m;
    }
    m.add(1, 'day');
    tnow = 0;
  }
}