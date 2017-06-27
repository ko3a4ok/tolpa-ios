/**
 * Created by ko3a4ok on 6/25/17.
 */

import I18n from 'react-native-i18n';
import moment from 'moment';

export function localDay(i) {
  var date = new Date();
  var currentDay = date.getDay();
  var distance = (i + 7 - currentDay) % 7;
  date.setDate(date.getDate() + distance);
  return date.toLocaleDateString([], {weekday: "long"});
}

I18n.fallbacks = true;

I18n.translations = {
  en: {
    Popular: "Popular",
    Free: "Free",
    Party: "Party",
    Spiritual: "Spiritual",
    "Food and Drinks": "Food and Drinks",
    Play: "Play",
    Art: "Art",
    Business: "Business",
    Movie: "Movie",
    "Education and Development": "Education and Development",
    "Family and kids": "Family and kids",
    Sport:"Sport",
    Hobby: "Hobby",
    Other: "Other",

    Events: "Events",
    News: "News",
    "Create Event": "Create Event",
    Categories: "Categories",
    Profile: "Profile",
    Explore: "Explore",
    Settings: "Settings",

    "years ago": "years ago",
    "months ago": "months ago",
    "days ago": "days ago",
    "hours ago": "hours ago",
    "minutes ago": "minutes ago",
    "just now": "just now",

    Search: "Search",

    "Sort by Cost": "Sort by Cost",
    "Sort by Time": "Sort by Time",
    "Sort by Distance": "Sort by Distance",

    Users: "Users",

    From: "From",
    to: "to",
    "Periodic Event": "Periodic Event",
    Every: "Every",
    "Invite friends": "Invite friends",
    "Organized by: ": "Organized by: ",
    Edit: "Edit",
    Leave: "Leave",
    Join: "Join",
    Comments: "Comments",
    "Leave a Comment": "Leave a Comment",
    OK: "OK",
    Cancel: "Cancel",
    "Delete your comment?": "Delete your comment?",
    Start: "Start",
    End: "End",
    Confirm: "Confirm",
    None: "None",
    Address: "Address",
    "Update event": "Update Event",
    Title: "Title",
    Description: "Description",
    "Next event: ": "Next event: ",
    "Start Date": "Start Date",
    "End Date": "End Date",
    Days: "Days",
    "Please set ": "Please set ",
    Price: "Price",
    "Multi Event: ": "Multi Event: ",
},
  uk: {
    Popular: "Популярне",
    Free: "Безкоштовно",
    Party: "Розваги",
    Spiritual: "Духовність",
    "Food and Drinks": "Поїсти та попити",
    Play: "Ігри",
    Art: "Мистецтво",
    Business: "Бізнес",
    Movie: "Кіно",
    "Education and Development": "Навчання та розвиток",
    "Family and kids": "Сім'я та діти",
    Sport:"Спорт",
    Hobby: "Дозвілля",
    Other: "Інше",

    Events: "Події",
    News: "Новини",
    "Create Event": "Створити Подію",
    Categories: "Категорії",
    Profile: "Профіль",
    Explore: "Навколо",
    Settings: "Налаштування",

    "years ago": "років тому",
    "months ago": "місяців тому",
    "days ago": "днів тому",
    "hours ago": "годин тому",
    "minutes ago": "хвилин тому",
    "just now": "щойно",

    Search: "Пошук",

    "Sort by Cost": "Впорядкування за вартістю",
    "Sort by Time": "Впорядкування за часом",
    "Sort by Distance": "Впорядкування за відстанню",

    "Users": "Користувачі",

    "From": "Від",
    "to": "до",
    "Periodic Event": "Періодична подія",
    "Every": "Кожний(а)",
    "Invite friends": "Запросити друзів",
    "Organized by: ": "Організовав(ла)  ",
    Edit: "Редагувати",
    Leave: "Лишити",
    Join: "Приєднатись",
    Comments: "Коментарі",
    "Leave a Comment": "Лишити коментар",
    OK: "Так",
    Cancel: "Відміна",
    "Delete your comment?": "Видалити коментар?",
    Start: "Початок",
    End: "Кінець",
    Confirm: "Підтвердити",
    None: "Нема",
    Address: "Адреса",
    "Update event": "Оновити Подію",
    Title: "Назва",
    Description: "Опис",
    "Next event: ": "Наступна подія: ",
    "Start Date": "Дата початку",
    "End Date": "Дата кінця",
    Days: "Days",
    "Please set ": "Будь-ласка вкажіть ",
    Price: "Ціна",
    "Multi Event: ": "Багаторазова Подія: ",
  },
};