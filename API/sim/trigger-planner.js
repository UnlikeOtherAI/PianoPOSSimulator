import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Establishment } from "./purchase-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROFILE_PATHS = [
  path.join(
    __dirname,
    "..",
    "public",
    "data",
    "busyness-weekly-rock-bottom.json"
  ),
  path.join(
    __dirname,
    "..",
    "public",
    "data",
    "busyness-weekly-scottish-diesel.json"
  ),
  path.join(
    __dirname,
    "..",
    "public",
    "data",
    "busyness-weekly-get-naked.json"
  ),
  path.join(
    __dirname,
    "..",
    "public",
    "data",
    "busyness-weekly-la-mordida.json"
  ),
];

const loadProfiles = () =>
  PROFILE_PATHS.map((profilePath) =>
    JSON.parse(fs.readFileSync(profilePath, "utf8"))
  );

const PROFILES = loadProfiles();
const PROFILE_BY_ID = PROFILES.reduce((acc, profile) => {
  acc[profile.id] = profile;
  return acc;
}, {});

const ESTABLISHMENT_IDS = {
  [Establishment.ROCK_BOTTOM]: "urn:establishment:sim-pub-001",
  [Establishment.SCOTTISH_DIESEL]: "urn:establishment:sim-petrol-001",
  [Establishment.GET_NAKED]: "urn:establishment:sim-shop-001",
  [Establishment.LA_MORDIDA]: "urn:establishment:sim-truck-001",
};

const getLocalTime = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "long",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0
  );
  const day = parts.find((part) => part.type === "weekday")?.value ?? "Monday";
  return { day, hour, minute, minutes: hour * 60 + minute };
};

const poisson = (lambda) => {
  if (lambda <= 0) return 0;
  let count = 0;
  let p = 1;
  const limit = Math.exp(-lambda);
  while (p > limit) {
    count += 1;
    p *= Math.random();
  }
  return Math.max(0, count - 1);
};

const getHourlyRange = (profile, day, hour) => {
  const dayEntries = profile?.days?.[day] || [];
  const entry = dayEntries.find((item) => item.hour === hour);
  if (!entry) return { min: 0, max: 0 };
  return { min: entry.min, max: entry.max };
};

const sampleCountForSlot = (profile, day, hour) => {
  const { min, max } = getHourlyRange(profile, day, hour);
  if (max <= 0) return 0;
  const hourly = min + Math.random() * (max - min);
  const expected = hourly / 12;
  return poisson(expected);
};

class TriggerPlanner {
  getPlan(now = new Date()) {
    const { day, hour } = getLocalTime(now);
    return {
      [Establishment.ROCK_BOTTOM]: this.#countFor(
        Establishment.ROCK_BOTTOM,
        day,
        hour
      ),
      [Establishment.SCOTTISH_DIESEL]: this.#countFor(
        Establishment.SCOTTISH_DIESEL,
        day,
        hour
      ),
      [Establishment.GET_NAKED]: this.#countFor(Establishment.GET_NAKED, day, hour),
      [Establishment.LA_MORDIDA]: this.#countFor(
        Establishment.LA_MORDIDA,
        day,
        hour
      ),
    };
  }

  #countFor(establishment, day, hour) {
    const id = ESTABLISHMENT_IDS[establishment];
    const profile = PROFILE_BY_ID[id];
    return sampleCountForSlot(profile, day, hour);
  }
}

export { TriggerPlanner };
