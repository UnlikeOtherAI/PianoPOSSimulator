import { Establishment } from "./purchase-generator.js";

const ESTABLISHMENT_SCHEDULES = {
  [Establishment.ROCK_BOTTOM]: {
    open: 14 * 60,
    close: 2 * 60,
    overnight: true,
  },
  [Establishment.SCOTTISH_DIESEL]: {
    open: 0,
    close: 24 * 60,
    overnight: false,
  },
  [Establishment.GET_NAKED]: {
    open: 7 * 60,
    close: 20 * 60,
    overnight: false,
  },
};

const getEdinburghMinutes = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
};

const isOpenNow = (schedule, nowMinutes) => {
  if (!schedule) return false;
  if (schedule.open === 0 && schedule.close === 24 * 60) return true;
  if (schedule.overnight || schedule.close <= schedule.open) {
    return nowMinutes >= schedule.open || nowMinutes < schedule.close;
  }
  return nowMinutes >= schedule.open && nowMinutes < schedule.close;
};

const pickWeighted = (choices) => {
  const total = choices.reduce((sum, choice) => sum + choice.weight, 0);
  let roll = Math.random() * total;
  for (const choice of choices) {
    roll -= choice.weight;
    if (roll <= 0) return choice.value;
  }
  return choices[choices.length - 1].value;
};

class TriggerPlanner {
  getPlan(now = new Date()) {
    const nowMinutes = getEdinburghMinutes(now);
    const plan = {
      [Establishment.ROCK_BOTTOM]: 0,
      [Establishment.SCOTTISH_DIESEL]: 0,
      [Establishment.GET_NAKED]: 0,
    };

    plan[Establishment.ROCK_BOTTOM] = this.#pubCount(nowMinutes);
    plan[Establishment.SCOTTISH_DIESEL] = this.#petrolCount(nowMinutes);
    plan[Establishment.GET_NAKED] = this.#retailCount(nowMinutes);

    return plan;
  }

  #pubCount(nowMinutes) {
    const schedule = ESTABLISHMENT_SCHEDULES[Establishment.ROCK_BOTTOM];
    if (!isOpenNow(schedule, nowMinutes)) return 0;

    const happyHour = nowMinutes >= 18 * 60 && nowMinutes <= 21 * 60;
    if (happyHour) {
      return pickWeighted([
        { value: 1, weight: 20 },
        { value: 2, weight: 40 },
        { value: 3, weight: 30 },
        { value: 4, weight: 10 },
      ]);
    }

    return pickWeighted([
      { value: 0, weight: 15 },
      { value: 1, weight: 50 },
      { value: 2, weight: 25 },
      { value: 3, weight: 10 },
    ]);
  }

  #petrolCount(nowMinutes) {
    const schedule = ESTABLISHMENT_SCHEDULES[Establishment.SCOTTISH_DIESEL];
    if (!isOpenNow(schedule, nowMinutes)) return 0;

    const daytime = nowMinutes >= 6 * 60 && nowMinutes <= 22 * 60;
    if (daytime) {
      return pickWeighted([
        { value: 0, weight: 10 },
        { value: 1, weight: 45 },
        { value: 2, weight: 30 },
        { value: 3, weight: 15 },
      ]);
    }

    return pickWeighted([
      { value: 0, weight: 35 },
      { value: 1, weight: 55 },
      { value: 2, weight: 10 },
    ]);
  }

  #retailCount(nowMinutes) {
    const schedule = ESTABLISHMENT_SCHEDULES[Establishment.GET_NAKED];
    if (!isOpenNow(schedule, nowMinutes)) return 0;

    const lunchtime = nowMinutes >= 11 * 60 && nowMinutes <= 13 * 60;
    const afterWork = nowMinutes >= 16 * 60 && nowMinutes <= 19 * 60;
    if (lunchtime || afterWork) {
      return pickWeighted([
        { value: 0, weight: 20 },
        { value: 1, weight: 55 },
        { value: 2, weight: 20 },
        { value: 3, weight: 5 },
      ]);
    }

    return pickWeighted([
      { value: 0, weight: 40 },
      { value: 1, weight: 50 },
      { value: 2, weight: 10 },
    ]);
  }
}

export { TriggerPlanner };
