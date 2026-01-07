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

const ROCK_BOTTOM_CATALOG = {
  beer: [
    { name: "Stonecliff Hazy IPA", unit: "pint", price: 6.8 },
    { name: "Black Harbor Stout", unit: "pint", price: 6.6 },
    { name: "Northwind Pilsner", unit: "pint", price: 5.8 },
    { name: "Citrus Grove Pale Ale", unit: "pint", price: 6.0 },
  ],
  cocktails: [
    { name: "Harbor Negroni", unit: "cocktail", price: 10.0 },
    { name: "Rock Bottom Old Fashioned", unit: "cocktail", price: 10.5 },
    { name: "Midnight Espresso Martini", unit: "cocktail", price: 11.0 },
  ],
  spirits: [
    { name: "North Quay London Dry", unit: "25ml", price: 4.8 },
    { name: "Glen Row 12", unit: "25ml", price: 6.2 },
  ],
  merch: [{ name: "Taproom Crew Tee", unit: "item", price: 25.0 }],
};

const SCOTTISH_DIESEL_CATALOG = {
  fuel: [
    { name: "Unleaded 95 RON", unit: "liter", price: 1.56 },
    { name: "Premium Unleaded 98 RON", unit: "liter", price: 1.68 },
    { name: "Diesel B7", unit: "liter", price: 1.62 },
    { name: "Premium Diesel B7+", unit: "liter", price: 1.72 },
  ],
  snacks: [
    { name: "Walkers Ready Salted Crisps", unit: "pack", price: 1.2 },
    { name: "Energy Drink Original", unit: "can", price: 1.6 },
    { name: "Bottled Water", unit: "bottle", price: 1.1 },
    { name: "Mars Bar", unit: "item", price: 0.95 },
  ],
  lpg: [
    { name: "LPG Bottle 6 kg", unit: "bottle", price: 26.0 },
    { name: "LPG Bottle 11 kg", unit: "bottle", price: 39.0 },
  ],
};

const GET_NAKED_CATALOG = {
  tees: [
    { name: "Studio Logo Tee", unit: "item", price: 34.0 },
    { name: "Mono Stitch Tee", unit: "item", price: 32.0 },
    { name: "Contour Line Tee", unit: "item", price: 36.0 },
  ],
  bottoms: [
    { name: "Slim Fit Chino", unit: "item", price: 88.0 },
    { name: "Straight Denim", unit: "item", price: 110.0 },
  ],
  outerwear: [
    { name: "Studio Hoodie", unit: "item", price: 82.0 },
    { name: "Lightweight Bomber", unit: "item", price: 160.0 },
  ],
  accessories: [
    { name: "Slim Leather Wallet", unit: "item", price: 65.0 },
    { name: "Zip Card Wallet", unit: "item", price: 75.0 },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
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
    if (!ITEM_CATALOG[establishment]) {
      throw new Error(`Unsupported establishment: ${establishment}`);
    }
    this.establishment = establishment;
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
    if (this.establishment === Establishment.ROCK_BOTTOM) {
      return this.#buildPubItems({ now, fiscalDate, eventDetail });
    }
    if (this.establishment === Establishment.SCOTTISH_DIESEL) {
      return this.#buildPetrolItems({ now, fiscalDate, eventDetail });
    }
    return this.#buildRetailItems({ now, fiscalDate, eventDetail });
  }

  #buildPubItems({ now, fiscalDate, eventDetail }) {
    const items = [];
    const basketSize = pickWeighted([
      { value: 1, weight: 40 },
      { value: 2, weight: 35 },
      { value: 3, weight: 18 },
      { value: 4, weight: 7 },
    ]);
    for (let i = 0; i < basketSize; i += 1) {
      const category = pickWeighted([
        { value: "beer", weight: 55 },
        { value: "cocktails", weight: 25 },
        { value: "spirits", weight: 15 },
        { value: "merch", weight: 5 },
      ]);
      const item = pickOne(ROCK_BOTTOM_CATALOG[category]);
      const quantity = 1;
      items.push(
        this.#buildOrderItem({ now, item, quantity, fiscalDate, eventDetail })
      );
    }
    return items;
  }

  #buildPetrolItems({ now, fiscalDate, eventDetail }) {
    const items = [];
    const snackOnly = Math.random() < 0.1;
    if (!snackOnly) {
      const fuel = pickOne(SCOTTISH_DIESEL_CATALOG.fuel);
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
      const snack = pickOne(SCOTTISH_DIESEL_CATALOG.snacks);
      items.push(
        this.#buildOrderItem({ now, item: snack, quantity: 1, fiscalDate, eventDetail })
      );
    }
    if (Math.random() < 0.04) {
      const lpg = pickOne(SCOTTISH_DIESEL_CATALOG.lpg);
      items.push(
        this.#buildOrderItem({ now, item: lpg, quantity: 1, fiscalDate, eventDetail })
      );
    }
    return items;
  }

  #buildRetailItems({ now, fiscalDate, eventDetail }) {
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
      const item = pickOne(GET_NAKED_CATALOG[category]);
      const sizedItem = {
        ...item,
        name: `${item.name} (${pickOne(GET_NAKED_CATALOG.sizes)})`,
      };
      items.push(
        this.#buildOrderItem({ now, item: sizedItem, quantity: 1, fiscalDate, eventDetail })
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
}

export { Establishment, PurchaseGenerator };
