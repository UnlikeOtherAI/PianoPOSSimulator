import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const Establishment = Object.freeze({
  ROCK_BOTTOM: "ROCK_BOTTOM",
  SCOTTISH_DIESEL: "SCOTTISH_DIESEL",
  GET_NAKED: "GET_NAKED",
});

const PAYMENT_METHODS = {
  ROCK_BOTTOM: ["card", "cash"],
  SCOTTISH_DIESEL: ["card", "cash", "invoice"],
  GET_NAKED: ["card", "cash"],
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ITEMS_PATH = path.join(__dirname, "..", "public", "data", "items.json");

const ITEMS_CACHE = JSON.parse(fs.readFileSync(ITEMS_PATH, "utf8"));
const ESTABLISHMENT_INDEX = ITEMS_CACHE.establishments.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
const ESTABLISHMENT_IDS = {
  ROCK_BOTTOM: "urn:establishment:sim-pub-001",
  SCOTTISH_DIESEL: "urn:establishment:sim-petrol-001",
  GET_NAKED: "urn:establishment:sim-shop-001",
};

const pickOne = (items) => items[Math.floor(Math.random() * items.length)];
const pickInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pickWeighted = (choices) => {
  const total = choices.reduce((sum, choice) => sum + choice.weight, 0);
  let roll = Math.random() * total;
  for (const choice of choices) {
    roll -= choice.weight;
    if (roll <= 0) return choice.value;
  }
  return choices[choices.length - 1].value;
};

const getDateParts = (now = new Date()) => {
  const iso = now.toISOString();
  return {
    timestamp: iso,
    fiscalDate: iso.slice(0, 10),
  };
};

class PurchaseGenerator {
  constructor(establishment) {
    if (!ESTABLISHMENT_IDS[establishment]) {
      throw new Error(`Unsupported establishment: ${establishment}`);
    }
    this.establishment = establishment;
    this.establishmentId = ESTABLISHMENT_IDS[establishment];
  }

  generateOrders() {
    const now = new Date();
    const { timestamp, fiscalDate } = getDateParts(now);
    const eventDetail = {
      timestamp,
      username: "sim-bot",
      fullName: "Simulator Bot",
      stationKey: "sim-01",
      stationName: "Simulator",
    };

    const items = this.#buildItems({ now, fiscalDate, eventDetail });
    const totalAmount = items.reduce(
      (sum, item) => sum + item.totalGrossPrice,
      0
    );

    const order = {
      globalId: `order-${now.getTime()}`,
      status: "closed",
      fiscalDate,
      currency: "GBP",
      items,
      payments: [
        {
          method: pickOne(PAYMENT_METHODS[this.establishment]),
          fiscalDate,
          amount: Number(totalAmount.toFixed(2)),
          created: eventDetail,
        },
      ],
      created: eventDetail,
      closed: eventDetail,
    };

    return { orders: [order] };
  }

  #buildItems({ now, fiscalDate, eventDetail }) {
    const establishment = ESTABLISHMENT_INDEX[this.establishmentId];
    const sections = establishment?.sections ?? [];

    if (this.establishment === Establishment.ROCK_BOTTOM) {
      return this.#buildPubItems({ now, fiscalDate, eventDetail, sections });
    }
    if (this.establishment === Establishment.SCOTTISH_DIESEL) {
      return this.#buildPetrolItems({ now, fiscalDate, eventDetail, sections });
    }
    return this.#buildRetailItems({ now, fiscalDate, eventDetail, sections });
  }

  #buildPubItems({ now, fiscalDate, eventDetail, sections }) {
    const beerPool = this.#sectionRows(sections, [
      "Beer Taps",
      "Bottled Beer",
      "Canned Beer",
      "Cider",
    ]);
    const cocktailPool = this.#sectionRows(sections, ["Cocktails"]);
    const spiritPool = this.#sectionRows(sections, ["Spirits"]);
    const merchPool = this.#sectionRows(sections, ["Merch"]);
    const snackPool = this.#sectionRows(sections, ["Bar Snacks", "Soft Drinks"]);
    const winePool = this.#sectionRows(sections, ["Wine"]);

    const items = [];
    const basketSize = pickWeighted([
      { value: 1, weight: 40 },
      { value: 2, weight: 35 },
      { value: 3, weight: 18 },
      { value: 4, weight: 7 },
    ]);

    for (let i = 0; i < basketSize; i += 1) {
      const category = pickWeighted([
        { value: "beer", weight: 50 },
        { value: "cocktails", weight: 20 },
        { value: "spirits", weight: 15 },
        { value: "snacks", weight: 7 },
        { value: "wine", weight: 5 },
        { value: "merch", weight: 3 },
      ]);
      const pool =
        category === "beer"
          ? beerPool
          : category === "cocktails"
          ? cocktailPool
          : category === "spirits"
          ? spiritPool
          : category === "snacks"
          ? snackPool
          : category === "wine"
          ? winePool
          : merchPool;

      const item = pickOne(pool);
      items.push(
        this.#buildOrderItem({ now, item, quantity: 1, fiscalDate, eventDetail })
      );
    }
    return items;
  }

  #buildPetrolItems({ now, fiscalDate, eventDetail, sections }) {
    const fuelPool = this.#sectionRows(sections, ["Fuel"]);
    const snackPool = this.#sectionRows(sections, [
      "Snacks",
      "Drinks",
      "Confectionery",
      "Savory Snacks",
      "Quick Meals",
      "Travel Essentials",
      "Seasonal",
      "Hot Drinks",
    ]);
    const lpgPool = this.#sectionRows(sections, ["LPG", "LPG Gas Bottles"]);

    const items = [];
    const snackOnly = Math.random() < 0.1;
    if (!snackOnly) {
      const fuel = pickOne(fuelPool);
      const fuelLiters = pickWeighted([
        { value: pickInt(20, 60), weight: 60 },
        { value: pickInt(60, 90), weight: 25 },
        { value: pickInt(200, 400), weight: 15 },
      ]);
      items.push(
        this.#buildOrderItem({
          now,
          item: fuel,
          quantity: fuelLiters,
          fiscalDate,
          eventDetail,
        })
      );
    }

    const snacksCount = pickWeighted([
      { value: 0, weight: 50 },
      { value: 1, weight: 35 },
      { value: 2, weight: 15 },
    ]);
    for (let i = 0; i < snacksCount; i += 1) {
      const snack = pickOne(snackPool);
      items.push(
        this.#buildOrderItem({
          now,
          item: snack,
          quantity: 1,
          fiscalDate,
          eventDetail,
        })
      );
    }

    if (Math.random() < 0.04) {
      const lpg = pickOne(lpgPool);
      items.push(
        this.#buildOrderItem({
          now,
          item: lpg,
          quantity: 1,
          fiscalDate,
          eventDetail,
        })
      );
    }

    return items;
  }

  #buildRetailItems({ now, fiscalDate, eventDetail, sections }) {
    const allRows = this.#sectionRows(sections, [
      "Gents Collection",
      "Ladies Collection",
      "Gents Colorways",
      "Ladies Colorways",
      "Gents Accessories",
      "Ladies Accessories",
    ]);

    const teesPool = allRows.filter((item) =>
      this.#matchesCategory(item, ["t-shirt", "tee"])
    );
    const bottomsPool = allRows.filter((item) =>
      this.#matchesCategory(item, ["pants", "trouser", "skirt", "denim", "chino"])
    );
    const outerwearPool = allRows.filter((item) =>
      this.#matchesCategory(item, ["hoodie", "jacket", "overshirt", "bomber"])
    );
    const accessoriesPool = allRows.filter((item) =>
      this.#matchesCategory(item, ["wallet", "handbag", "accessory", "belt", "tote", "pouch"])
    );

    const items = [];
    const basketSize = pickWeighted([
      { value: 1, weight: 55 },
      { value: 2, weight: 30 },
      { value: 3, weight: 15 },
    ]);
    const categoryChoices = [
      { value: "tees", weight: 70 },
      { value: "bottoms", weight: 20 },
      { value: "outerwear", weight: 5 },
      { value: "accessories", weight: 5 },
    ];

    for (let i = 0; i < basketSize; i += 1) {
      const category = pickWeighted(categoryChoices);
      const pool =
        category === "tees"
          ? teesPool
          : category === "bottoms"
          ? bottomsPool
          : category === "outerwear"
          ? outerwearPool
          : accessoriesPool;
      const item = pickOne(pool.length ? pool : allRows);
      const sizedItem = item.size
        ? { ...item, name: `${item.name} (${item.size})` }
        : item;
      items.push(
        this.#buildOrderItem({
          now,
          item: sizedItem,
          quantity: 1,
          fiscalDate,
          eventDetail,
        })
      );
    }
    return items;
  }

  #buildOrderItem({ now, item, quantity, fiscalDate, eventDetail }) {
    const totalGrossPrice = Number((item.price * quantity).toFixed(2));
    return {
      id: `item-${now.getTime()}-${Math.floor(Math.random() * 1000)}`,
      name: item.name,
      quantity,
      unit: item.unit,
      fiscalDate,
      grossPrice: item.price,
      totalGrossPrice,
      created: eventDetail,
    };
  }

  #sectionRows(sections, prefixes) {
    const rows = [];
    const matchers = prefixes.map((prefix) => prefix.toLowerCase());
    for (const section of sections) {
      if (!section?.title || !section?.rows) continue;
      const title = section.title.toLowerCase();
      if (!matchers.some((prefix) => title.startsWith(prefix))) {
        continue;
      }
      for (const row of section.rows) {
        const mapped = this.#mapRowToItem(section.headers, row);
        if (mapped) rows.push(mapped);
      }
    }
    return rows.length > 0
      ? rows
      : [{ name: "Unknown Item", unit: "item", price: 1.0 }];
  }

  #mapRowToItem(headers, row) {
    if (!headers || !row) return null;
    const headerMap = headers.map((header) => header.toLowerCase());
    const pick = (name) => {
      const idx = headerMap.indexOf(name);
      return idx >= 0 ? row[idx] : null;
    };

    const name =
      pick("name") ||
      pick("item") ||
      pick("fuel") ||
      pick("id") ||
      row[1];
    const unit =
      pick("unit") ||
      pick("size") ||
      pick("serve") ||
      pick("pack size") ||
      "item";
    const size = pick("sizes") || pick("size") || null;
    const priceRaw =
      pick("price") || pick("price (per liter)") || pick("price (pint)") || "0";
    const price = Number(String(priceRaw).replace(/[^0-9.]/g, "")) || 0;
    const category = pick("category") || "";

    if (!name) return null;
    return { name, unit, price, category, size };
  }

  #matchesCategory(item, keywords) {
    const haystack = `${item.category ?? ""} ${item.name ?? ""}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  }
}

export { Establishment, PurchaseGenerator };
