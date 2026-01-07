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

const ITEM_CATALOG = {
  ROCK_BOTTOM: [
    { name: "Stonecliff Hazy IPA", unit: "pint", price: 6.8 },
    { name: "Black Harbor Stout", unit: "pint", price: 6.6 },
    { name: "Harbor Negroni", unit: "cocktail", price: 10.0 },
    { name: "Rock Bottom Old Fashioned", unit: "cocktail", price: 10.5 },
    { name: "Taproom Crew Tee", unit: "item", price: 25.0 },
  ],
  SCOTTISH_DIESEL: [
    { name: "Unleaded 95 RON", unit: "liter", price: 1.56 },
    { name: "Diesel B7", unit: "liter", price: 1.62 },
    { name: "Premium Unleaded 98 RON", unit: "liter", price: 1.68 },
    { name: "Walkers Ready Salted Crisps", unit: "pack", price: 1.2 },
    { name: "Energy Drink Original", unit: "can", price: 1.6 },
  ],
  GET_NAKED: [
    { name: "Studio Logo Tee", unit: "item", price: 34.0 },
    { name: "Mono Stitch Tee", unit: "item", price: 32.0 },
    { name: "Slim Fit Chino", unit: "item", price: 88.0 },
    { name: "Studio Hoodie", unit: "item", price: 82.0 },
    { name: "Slim Leather Wallet", unit: "item", price: 65.0 },
  ],
};

const pickOne = (items) => items[Math.floor(Math.random() * items.length)];

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

    const catalog = ITEM_CATALOG[this.establishment];
    const baseItem = pickOne(catalog);
    const quantity = this.establishment === Establishment.SCOTTISH_DIESEL ? 35 : 1;

    const orderItem = {
      id: `item-${now.getTime()}`,
      name: baseItem.name,
      quantity,
      unit: baseItem.unit,
      fiscalDate,
      grossPrice: baseItem.price,
      totalGrossPrice: Number((baseItem.price * quantity).toFixed(2)),
      created: eventDetail,
    };

    const order = {
      globalId: `order-${now.getTime()}`,
      status: "closed",
      fiscalDate,
      currency: "GBP",
      items: [orderItem],
      payments: [
        {
          method: pickOne(PAYMENT_METHODS[this.establishment]),
          fiscalDate,
          amount: Number((baseItem.price * quantity).toFixed(2)),
          created: eventDetail,
        },
      ],
      created: eventDetail,
      closed: eventDetail,
    };

    return { orders: [order] };
  }
}

export { Establishment, PurchaseGenerator };
