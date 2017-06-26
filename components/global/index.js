'use strict';
import moment from 'moment';

export const PRIMARY_COLOR = '#25a67d';
export const DARK_COLOR = '#16805e';
import I18n from 'react-native-i18n';

export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
      return interval + " " + I18n.t("years ago");
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
      return interval + " " + I18n.t("months ago");
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
      return interval + " " + I18n.t("days ago");
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
      return interval + " " + I18n.t("hours ago");
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
      return interval + " " + I18n.t("minutes ago");
  }
  return I18n.t("just now");
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
      let tt = days[m.day()];
      if (tnow <= tt) {
        m.hours(Math.floor(tt/60));
        m.minutes(tt%60);
        m.seconds(0);
        m.milliseconds(0);
        return m;
      }
    }
    m.add(1, 'day');
    tnow = 0;
  }
}

export function intToTimeFormat(d) {
  if (d == null) return;
  let hh = '00' + Math.floor(d/60);
  let mm = '00' + d%60;
  return hh.slice(hh.length-2) + ':' + mm.slice(mm.length-2);

}
