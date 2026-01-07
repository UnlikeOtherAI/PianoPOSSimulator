import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import swaggerUiDist from "swagger-ui-dist";

const app = express();
const port = process.env.PORT ?? 6080;

app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

const openApiPath = path.join(__dirname, "..", "Docs", "piano", "piano.api.json");
const swaggerAssetPath = swaggerUiDist.getAbsoluteFSPath();

const swaggerIndexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Piano SIM Swagger</title>
    <meta name="theme-color" content="#f7f2ea" />
    <meta property="og:title" content="Piano SIM Swagger" />
    <meta property="og:description" content="Swagger UI for the Piano POS Simulator." />
    <meta property="og:image" content="/og-image.png" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Piano SIM Swagger" />
    <meta name="twitter:description" content="Swagger UI for the Piano POS Simulator." />
    <meta name="twitter:image" content="/og-image.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="./swagger-ui.css" />
    <style>
      :root {
        --sim-ink: #1d1b16;
        --sim-cream: #f7f2ea;
        --sim-card: #fffaf0;
        --sim-muted: #4b443b;
        --sim-border: #e2d6c2;
      }
      body {
        margin: 0;
        background: var(--sim-cream);
        color: var(--sim-ink);
        font-family: "Georgia", "Times New Roman", serif;
      }
      .sim-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 28px 32px 12px;
      }
      .sim-header img {
        width: 52px;
        height: 52px;
      }
      .sim-header h1 {
        margin: 0;
        font-size: 20px;
        letter-spacing: 2px;
      }
      .sim-header p {
        margin: 4px 0 0;
        color: var(--sim-muted);
        font-size: 13px;
      }
      .swagger-ui .topbar {
        background: var(--sim-ink);
      }
      .swagger-ui .topbar a span {
        color: #fffaf0;
      }
      .swagger-ui .opblock {
        border-color: var(--sim-border);
        background: var(--sim-card);
      }
      .swagger-ui .opblock .opblock-summary {
        border-color: var(--sim-border);
      }
      .swagger-ui .btn.execute {
        background-color: var(--sim-ink);
        border-color: var(--sim-ink);
      }
      .swagger-ui .btn.authorize {
        background-color: var(--sim-ink);
        border-color: var(--sim-ink);
        color: #fffaf0;
      }
      .swagger-ui .info .title {
        font-family: "Georgia", "Times New Roman", serif;
      }
      .swagger-ui .wrapper {
        padding: 0 24px 40px;
      }
    </style>
  </head>
  <body>
    <header class="sim-header">
      <img src="/assets/wolf.png" alt="Unlike Other AI" />
      <div>
        <h1>Piano SIM</h1>
        <p>by Unlike Other AI agency</p>
      </div>
    </header>
    <div id="swagger-ui"></div>
    <script src="./swagger-ui-bundle.js"></script>
    <script src="./swagger-ui-standalone-preset.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "./openapi.json",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout"
      });
    </script>
  </body>
</html>`;

const rootIndexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Piano SIM</title>
    <meta name="theme-color" content="#f7f2ea" />
    <meta property="og:title" content="Piano SIM" />
    <meta property="og:description" content="Piano POS Simulator for local development and CI." />
    <meta property="og:image" content="/og-image.png" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Piano SIM" />
    <meta name="twitter:description" content="Piano POS Simulator for local development and CI." />
    <meta name="twitter:image" content="/og-image.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" href="/favicon.ico" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      .panel-animate-out {
        animation: panelOut 0.25s ease-in forwards;
      }
      .panel-animate-in {
        animation: panelIn 0.45s cubic-bezier(0.2, 0.9, 0.2, 1) both;
      }
      @keyframes panelOut {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(-40px);
        }
      }
      @keyframes panelIn {
        0% {
          opacity: 0;
          transform: translateX(40px) scale(0.98);
        }
        60% {
          opacity: 1;
          transform: translateX(-6px) scale(1.01);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
    </style>
  </head>
  <body class="min-h-screen bg-[#f7f2ea] flex flex-col items-center px-6">
    <div class="w-full max-w-5xl flex-1 py-12">
      <div class="mx-auto w-full max-w-lg rounded-2xl border border-[#e2d6c2] bg-[#fffaf0] px-10 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        <img class="mx-auto mb-6 h-20 w-20" src="/assets/wolf.png" alt="Unlike Other AI" />
        <h1 class="text-3xl font-semibold tracking-wide text-[#1d1b16]">Piano SIM</h1>
        <p class="mt-3 text-sm text-[#4b443b]">
          Node.js API simulator for the Piano POS integration API. Built for deterministic
          local development and CI workflows.
        </p>
        <div class="mt-8 flex flex-col gap-3">
          <a
            class="w-full rounded-full border border-[#1d1b16] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-[#1d1b16] transition hover:bg-[#1d1b16] hover:text-[#fffaf0]"
            href="https://github.com/UnlikeOtherAI/PianoPOSSimulator/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            class="w-full rounded-full bg-[#1d1b16] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-[#fffaf0] transition hover:opacity-90"
            href="https://www.unlikeotherai.com"
            target="_blank"
            rel="noreferrer"
          >
            Unlike Other AI
          </a>
        </div>
      </div>

      <section class="mt-10">
        <div class="flex flex-wrap gap-4 justify-center">
          <button data-tab="rock-bottom" class="tab-button rounded-full border border-[#1d1b16] bg-[#1d1b16] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#fffaf0]">
            The Rock Bottom
          </button>
          <button data-tab="scottish-diesel" class="tab-button rounded-full border border-[#1d1b16] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#1d1b16]">
            Scottish Diesel
          </button>
          <button data-tab="get-naked" class="tab-button rounded-full border border-[#1d1b16] px-5 py-2 text-xs font-semibold uppercase tracking-widest text-[#1d1b16]">
            Get Naked
          </button>
        </div>
        <div id="shop-panel" class="mt-6 rounded-2xl border border-[#e2d6c2] bg-[#fffaf0] px-8 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 id="shop-title" class="flex items-center gap-3 text-xl font-semibold text-[#1d1b16]">The Rock Bottom</h2>
              <p id="shop-meta" class="mt-1 text-sm text-[#4b443b]">Real pub in Falkirk, fake menu</p>
            </div>
            <div class="flex flex-col items-start gap-2">
              <span id="shop-hours" class="rounded-full border border-[#1d1b16] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#1d1b16]">
                14:00-02:00 GMT
              </span>
              <span id="shop-status" class="text-[11px] uppercase tracking-[0.28em] text-[#4b443b]">
                Open now (London)
              </span>
            </div>
          </div>
          <div id="shop-items" class="mt-6 grid gap-6 md:grid-cols-2"></div>
        </div>
      </section>
      <div class="mt-[75px] flex justify-center">
        <img class="h-[150px] w-auto" src="/assets/thistle.png" alt="Thistle" />
      </div>
    </div>
    <footer class="mt-[44px] h-[75px] w-full bg-[#1d1b16] text-center text-[11px] uppercase tracking-[0.32em] text-[#f7f2ea]/70">
      <div class="mx-auto flex h-full max-w-5xl items-center justify-center px-6">
        <span>
          Made in love in Scotland by
          <a
            class="ml-2 text-[#fffaf0] no-underline"
            href="https://www.unlikeotherai.com"
            target="_blank"
            rel="noreferrer"
          >
            Unlike Other AI
          </a>
        </span>
      </div>
    </footer>
    <script>
      const shops = {
        "rock-bottom": {
          title: "The Rock Bottom",
          meta: "Real pub in Falkirk, fake menu",
          hours: "14:00-02:00 GMT",
          logo: "/businesses/rock_bottom.png",
          schedule: { openHour: 14, openMinute: 0, closeHour: 2, closeMinute: 0, overnight: true },
          sections: [
            {
              title: "Beer Taps",
              items: [
                "Stonecliff Hazy IPA - GBP 6.80 pint / 4.20 half",
                "Black Harbor Stout - GBP 6.60 pint / 4.10 half",
                "Northwind Pilsner - GBP 5.80 pint / 3.60 half",
                "Copper Fox Amber Ale - GBP 6.10 pint / 3.80 half",
                "Citrus Grove Pale Ale - GBP 6.00 pint / 3.70 half",
                "Nightshift Porter - GBP 6.40 pint / 4.00 half",
                "Salted Lime Gose - GBP 6.10 pint / 3.80 half",
                "Maplewood Brown Ale - GBP 6.20 pint / 3.90 half",
                "Low Tide Session IPA - GBP 5.70 pint / 3.50 half",
                "Iron Bridge Red IPA - GBP 6.90 pint / 4.30 half",
                "Frostline Lager - GBP 5.60 pint / 3.40 half",
                "Orchard Dry Cider - GBP 6.20 pint / 3.90 half",
                "Brambleberry Sour - GBP 6.80 pint / 4.20 half",
                "Golden Field Kolsch - GBP 5.90 pint / 3.60 half",
                "Vesper Witbier - GBP 6.00 pint / 3.70 half",
                "Ridgeback West Coast IPA - GBP 7.20 pint / 4.50 half",
                "Hillside ESB - GBP 6.00 pint / 3.70 half",
                "Midnight Mocha Stout - GBP 7.40 pint / 4.70 half",
                "Harbor Lights Helles - GBP 5.70 pint / 3.50 half",
                "Summit Trail NEIPA - GBP 7.50 pint / 4.80 half",
                "Smoked Maple Rauchbier - GBP 6.50 pint / 4.10 half",
                "Crisp Apple Cider - GBP 5.80 pint / 3.60 half",
                "Elderflower Saison - GBP 7.10 pint / 4.40 half",
                "Darkwater Schwarzbier - GBP 6.10 pint / 3.80 half",
                "Seabreeze Wheat - GBP 5.90 pint / 3.60 half",
                "Pinecone DIPA - GBP 7.80 pint / 5.20 half",
                "Velvet Vanilla Milk Stout - GBP 6.70 pint / 4.20 half",
                "Wild Meadow Farmhouse - GBP 6.90 pint / 4.30 half",
                "Ruby Grapefruit Radler - GBP 5.40 pint / 3.30 half",
                "Skylark Blonde Ale - GBP 5.70 pint / 3.50 half",
                "Raven Black IPA - GBP 7.20 pint / 4.60 half",
                "Honeycomb Golden Ale - GBP 6.00 pint / 3.70 half",
                "Cocoa Cherry Stout - GBP 7.60 pint / 4.90 half",
                "Spruce Tip Pale - GBP 6.30 pint / 3.90 half"
              ]
            },
            {
              title: "Spirits",
              items: [
                "North Quay London Dry (Gin) - GBP 4.80",
                "Wild Coast Botanical (Gin) - GBP 5.20",
                "Dockside Navy Strength (Gin) - GBP 6.50",
                "Old Town Old Tom (Gin) - GBP 5.30",
                "Valley Sloe (Gin) - GBP 4.90",
                "Polar Wheat (Vodka) - GBP 4.40",
                "Blackridge Potato (Vodka) - GBP 4.80",
                "Market Vanilla (Vodka) - GBP 4.60",
                "Copper Still Bourbon (Whiskey) - GBP 5.40",
                "Iron Rails Rye (Whiskey) - GBP 5.60",
                "Glen Row 12 (Scotch) - GBP 6.20",
                "Sea Smoke Islay (Scotch) - GBP 6.90",
                "Highland Trail (Scotch) - GBP 5.90",
                "Riverbank Irish (Whiskey) - GBP 5.10",
                "Sunrise Japanese (Whiskey) - GBP 7.20",
                "Old Pier Dark (Rum) - GBP 4.90",
                "Island White (Rum) - GBP 4.60",
                "Harbor Spiced (Rum) - GBP 4.80",
                "Cane Field Agricole (Rum) - GBP 6.00",
                "Overproof 151 (Rum) - GBP 6.20",
                "Blue Agave Blanco (Tequila) - GBP 5.20",
                "Sunset Reposado (Tequila) - GBP 5.80",
                "Canyon Anejo (Tequila) - GBP 6.50",
                "Desert Mezcal (Mezcal) - GBP 6.80",
                "Amber Orchard VS (Brandy) - GBP 5.40",
                "Old House VSOP (Cognac) - GBP 7.20",
                "Sandfield Armagnac (Armagnac) - GBP 7.00",
                "Alpine Apricot (Liqueur) - GBP 4.60",
                "Night Owl Coffee (Liqueur) - GBP 4.60",
                "Sweet Almond Amaretto (Liqueur) - GBP 4.70",
                "Triple Orange Sec (Liqueur) - GBP 4.60",
                "Red Aperitivo (Aperitivo) - GBP 5.20",
                "Bitter Ruby (Aperitivo) - GBP 4.80",
                "House Vermouth Dry (Vermouth) - GBP 4.90",
                "House Vermouth Sweet (Vermouth) - GBP 4.90",
                "Orchard Peach (Liqueur) - GBP 4.50",
                "Dark Cherry (Liqueur) - GBP 4.60",
                "Irish Cream (Liqueur) - GBP 4.80",
                "Spiced Honey (Liqueur) - GBP 4.70",
                "Elderflower (Liqueur) - GBP 4.60"
              ]
            },
            {
              title: "Cocktails",
              items: [
                "Rock Bottom Old Fashioned - GBP 10.50",
                "Harbor Negroni - GBP 10.00",
                "Midnight Espresso Martini - GBP 11.00",
                "Orchard Whisky Sour - GBP 10.50",
                "Dockside Mojito - GBP 10.00",
                "Sunset Margarita - GBP 11.50",
                "Barrel Boulevardier - GBP 11.50",
                "Sea Breeze Collins - GBP 10.50",
                "Highland Penicillin - GBP 12.00",
                "Raven Black Manhattan - GBP 11.00",
                "Bramble Gin Fizz - GBP 10.50",
                "Smoky Paloma - GBP 12.50",
                "Velvet White Russian - GBP 11.00",
                "Ginger Rum Mule - GBP 10.50",
                "Elderflower Spritz - GBP 9.80",
                "Citrus Gimlet - GBP 10.00"
              ]
            },
            {
              title: "Merch",
              items: [
                "Rock Bottom Logo Tee - GBP 22.00",
                "Taproom Crew Tee - GBP 25.00",
                "Limited Gig Ticket (Presale) - GBP 18.00"
              ]
            }
          ]
        },
        "scottish-diesel": {
          title: "Scottish Diesel",
          meta: "No fuel here, just selling air",
          hours: "00:00-24:00 GMT",
          logo: "/businesses/scottish_diesel.png",
          schedule: { open24: true },
          sections: [
            {
              title: "Fuel",
              items: [
                "Unleaded 95 RON - GBP 1.56 per liter",
                "Premium Unleaded 98 RON - GBP 1.68 per liter",
                "Diesel B7 - GBP 1.62 per liter",
                "Premium Diesel B7+ - GBP 1.72 per liter"
              ]
            },
            {
              title: "LPG Bottles",
              items: [
                "6 kg LPG bottle - GBP 26.00",
                "11 kg LPG bottle - GBP 39.00",
                "19 kg LPG bottle - GBP 58.00"
              ]
            },
            {
              title: "Snacks",
              items: [
                "Walkers Ready Salted Crisps 32g - GBP 1.20",
                "Walkers Cheese and Onion Crisps 32g - GBP 1.20",
                "Walkers Salt and Vinegar Crisps 32g - GBP 1.20",
                "Kettle Sea Salt Crisps 40g - GBP 1.60",
                "Kettle Sea Salt and Balsamic 40g - GBP 1.60",
                "Pringles Original 165g - GBP 2.80",
                "Pringles Sour Cream 165g - GBP 2.80",
                "Doritos Nacho Cheese 180g - GBP 2.70",
                "Doritos Chilli Heatwave 180g - GBP 2.70",
                "Sensations Thai Sweet Chilli 40g - GBP 1.70",
                "Cadbury Dairy Milk 110g - GBP 1.50",
                "Cadbury Fruit and Nut 110g - GBP 1.60",
                "Galaxy Smooth Milk 100g - GBP 1.50",
                "Mars Bar 51g - GBP 0.95",
                "Snickers Bar 48g - GBP 0.95",
                "Twix Bar 50g - GBP 0.95",
                "KitKat Chunky 40g - GBP 0.95",
                "Maltesers 37g - GBP 1.10",
                "Haribo Starmix 160g - GBP 1.60",
                "Haribo Tangfastics 160g - GBP 1.60",
                "Percy Pigs 170g - GBP 1.80",
                "McVities Digestives 400g - GBP 2.10",
                "McVities Chocolate Digestives 300g - GBP 2.30",
                "Tuc Original 100g - GBP 1.40",
                "Mini Cheddars Original 90g - GBP 1.30",
                "Mini Cheddars Red Leicester 90g - GBP 1.30",
                "KP Dry Roasted Peanuts 65g - GBP 1.10",
                "KP Salted Peanuts 65g - GBP 1.10",
                "Nature Valley Oats and Honey 2 bars - GBP 1.20",
                "Nature Valley Peanut Butter 2 bars - GBP 1.20",
                "Belvita Soft Bakes 50g - GBP 1.00",
                "Protein Bar Chocolate 60g - GBP 2.40",
                "Chewing Gum Peppermint 10 pcs - GBP 0.99",
                "Chewing Gum Spearmint 10 pcs - GBP 0.99",
                "Bottled Water 500ml - GBP 1.10",
                "Sparkling Water 500ml - GBP 1.20",
                "Energy Drink Original 250ml - GBP 1.60",
                "Energy Drink Sugar Free 250ml - GBP 1.60",
                "Cola Can 330ml - GBP 1.20",
                "Iced Coffee Can 250ml - GBP 1.80"
              ]
            }
          ]
        },
        "get-naked": {
          title: "Get Naked",
          meta: "No need for clothes baby",
          hours: "07:00-20:00 GMT",
          logo: "/businesses/get_naked.png",
          schedule: { openHour: 7, openMinute: 0, closeHour: 20, closeMinute: 0, overnight: false },
          sections: [
            {
              title: "Gents",
              items: [
                "Studio Logo Tee (S-XXL) - GBP 34.00",
                "Mono Stitch Tee (S-XXL) - GBP 32.00",
                "Contour Line Tee (S-XXL) - GBP 36.00",
                "Ribbed Neck Tee (S-XXL) - GBP 34.00",
                "Pocket Minimal Tee (S-XXL) - GBP 33.00",
                "Heavyweight Core Tee (S-XXL) - GBP 38.00",
                "Raw Hem Tee (S-XXL) - GBP 36.00",
                "Drop Shoulder Tee (S-XXL) - GBP 39.00",
                "Graphic Grid Tee (S-XXL) - GBP 35.00",
                "Sunset Wash Tee (S-XXL) - GBP 40.00",
                "Soft Touch Tee (S-XXL) - GBP 34.00",
                "Tape Logo Tee (S-XXL) - GBP 36.00",
                "Studio Number Tee (S-XXL) - GBP 34.00",
                "Micro Print Tee (S-XXL) - GBP 33.00",
                "Seamless Tee (S-XXL) - GBP 42.00",
                "Boxy Tee (S-XXL) - GBP 38.00",
                "Contrast Stitch Tee (S-XXL) - GBP 35.00",
                "Air Knit Tee (S-XXL) - GBP 41.00",
                "Vintage Wash Tee (S-XXL) - GBP 39.00",
                "Minimal Wordmark Tee (S-XXL) - GBP 32.00",
                "Raglan Tee (S-XXL) - GBP 35.00",
                "Scallop Hem Tee (S-XXL) - GBP 37.00",
                "Ringer Tee (S-XXL) - GBP 33.00",
                "Henley Tee (S-XXL) - GBP 40.00",
                "Longline Tee (S-XXL) - GBP 38.00",
                "Slim Fit Chino (W28-38 L30/32) - GBP 88.00",
                "Tapered Chino (W28-38 L30/32) - GBP 92.00",
                "Straight Denim (W28-38 L30/32) - GBP 110.00",
                "Stretch Denim (W28-38 L30/32) - GBP 115.00",
                "Tailored Jogger (W28-38 L30/32) - GBP 95.00",
                "Utility Cargo Pant (W28-38 L30/32) - GBP 120.00",
                "Studio Hoodie (S-XXL) - GBP 82.00",
                "Minimal Zip Hoodie (S-XXL) - GBP 88.00",
                "Oversized Hoodie (S-XXL) - GBP 92.00",
                "Loopback Hoodie (S-XXL) - GBP 79.00",
                "Lightweight Bomber (S-XXL) - GBP 160.00",
                "Denim Jacket (S-XXL) - GBP 150.00",
                "Wool Blend Overshirt (S-XXL) - GBP 190.00",
                "Slim Leather Wallet (One size) - GBP 65.00",
                "Zip Card Wallet (One size) - GBP 75.00"
              ]
            },
            {
              title: "Ladies",
              items: [
                "Studio Logo Tee (XS-XL) - GBP 32.00",
                "Soft Rib Tee (XS-XL) - GBP 34.00",
                "Cropped Box Tee (XS-XL) - GBP 33.00",
                "Drape Tee (XS-XL) - GBP 36.00",
                "Scoop Neck Tee (XS-XL) - GBP 32.00",
                "V-Neck Tee (XS-XL) - GBP 31.00",
                "Pocket Tee (XS-XL) - GBP 33.00",
                "Contrast Trim Tee (XS-XL) - GBP 34.00",
                "Slub Knit Tee (XS-XL) - GBP 35.00",
                "Cap Sleeve Tee (XS-XL) - GBP 32.00",
                "Longline Tee (XS-XL) - GBP 36.00",
                "Tie Hem Tee (XS-XL) - GBP 35.00",
                "Minimal Wordmark Tee (XS-XL) - GBP 31.00",
                "Ringer Tee (XS-XL) - GBP 33.00",
                "Double Stitch Tee (XS-XL) - GBP 34.00",
                "Oversized Tee (XS-XL) - GBP 38.00",
                "Split Hem Tee (XS-XL) - GBP 36.00",
                "Raglan Tee (XS-XL) - GBP 34.00",
                "Relaxed Tee (XS-XL) - GBP 32.00",
                "Air Knit Tee (XS-XL) - GBP 39.00",
                "Vintage Wash Tee (XS-XL) - GBP 37.00",
                "Satin Touch Tee (XS-XL) - GBP 40.00",
                "Mock Neck Tee (XS-XL) - GBP 36.00",
                "Modal Blend Tee (XS-XL) - GBP 34.00",
                "High Rise Skinny (UK 6-16) - GBP 98.00",
                "Wide Leg Trouser (UK 6-16) - GBP 120.00",
                "Tailored Cigarette Pant (UK 6-16) - GBP 110.00",
                "Midi Slip Skirt (UK 6-16) - GBP 95.00",
                "Pleated Skirt (UK 6-16) - GBP 105.00",
                "Utility Cargo Pant (UK 6-16) - GBP 115.00",
                "Studio Hoodie (XS-XL) - GBP 82.00",
                "Minimal Zip Hoodie (XS-XL) - GBP 88.00",
                "Cropped Hoodie (XS-XL) - GBP 79.00",
                "Loopback Hoodie (XS-XL) - GBP 84.00",
                "Studio Mini Tote (28x20x10 cm) - GBP 150.00",
                "Soft Edge Satchel (32x24x12 cm) - GBP 190.00",
                "Sculpted Crossbody (24x18x8 cm) - GBP 170.00",
                "Slim Leather Wallet (One size) - GBP 60.00",
                "Zip Card Wallet (One size) - GBP 70.00",
                "Cropped Leather Jacket (XS-XL) - GBP 220.00"
              ]
            }
          ]
        }
      };

      const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
      const titleEl = document.getElementById("shop-title");
      const metaEl = document.getElementById("shop-meta");
      const hoursEl = document.getElementById("shop-hours");
      const itemsEl = document.getElementById("shop-items");
      const statusEl = document.getElementById("shop-status");
      const panelEl = document.getElementById("shop-panel");
      let currentShopKey = "rock-bottom";
      let animationTimer = null;

      const getLondonMinutes = () => {
        const parts = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/Edinburgh",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).formatToParts(new Date());
        const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
        const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
        return hour * 60 + minute;
      };

      const isOpenNow = (schedule) => {
        if (!schedule) return false;
        if (schedule.open24) return true;
        const openMinutes = schedule.openHour * 60 + schedule.openMinute;
        const closeMinutes = schedule.closeHour * 60 + schedule.closeMinute;
        const nowMinutes = getLondonMinutes();
        if (schedule.overnight || closeMinutes <= openMinutes) {
          return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
        }
        return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
      };

      const updateStatus = (key) => {
        const data = shops[key];
        if (!data || !statusEl) return;
        const openNow = isOpenNow(data.schedule);
        statusEl.textContent = (openNow ? "Open now" : "Closed now") + " (Edinburgh)";
      };

      const updateTabs = (key) => {
        tabButtons.forEach((button) => {
          const isActive = button.dataset.tab === key;
          button.classList.toggle("bg-[#1d1b16]", isActive);
          button.classList.toggle("text-[#fffaf0]", isActive);
          button.classList.toggle("text-[#1d1b16]", !isActive);
          button.classList.toggle("hover:bg-[#1d1b16]", !isActive);
          button.classList.toggle("hover:text-[#fffaf0]", !isActive);
          button.style.backgroundColor = isActive ? "#1d1b16" : "transparent";
          button.style.color = isActive ? "#fffaf0" : "#1d1b16";
        });
      };

      const renderShop = (key) => {
        const data = shops[key];
        if (!data) return;
        currentShopKey = key;
        titleEl.textContent = data.title;
        metaEl.textContent = data.meta;
        hoursEl.textContent = data.hours;
        const logoMarkup = data.logo
          ? '<img class="h-[192px] w-[192px] object-contain" src="' +
            data.logo +
            '" alt="' +
            data.title +
            ' logo" />'
          : "";
        titleEl.innerHTML = logoMarkup + "<span>" + data.title + "</span>";
        const sectionMarkup = data.sections
          .map((section) => {
            const items = section.items
              .map((item) => '<li class="text-sm text-[#4b443b]">' + item + "</li>")
              .join("");
            return (
              '<div class="rounded-xl border border-[#e2d6c2] bg-white px-4 py-4">' +
              '<h3 class="text-sm font-semibold uppercase tracking-widest text-[#1d1b16]">' +
              section.title +
              "</h3>" +
              '<ul class="mt-3 flex flex-col gap-2">' +
              items +
              "</ul>" +
              "</div>"
            );
          })
          .join("");
        itemsEl.innerHTML = sectionMarkup;
        updateStatus(key);
        updateTabs(key);
      };

      const animateSwitch = (key) => {
        if (!panelEl) {
          renderShop(key);
          return;
        }
        if (key === currentShopKey) return;
        updateTabs(key);
        if (animationTimer) {
          clearTimeout(animationTimer);
        }
        panelEl.classList.remove("panel-animate-in");
        panelEl.classList.add("panel-animate-out");
        animationTimer = setTimeout(() => {
          renderShop(key);
          panelEl.classList.remove("panel-animate-out");
          void panelEl.offsetWidth;
          panelEl.classList.add("panel-animate-in");
        }, 240);
      };

      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          animateSwitch(button.dataset.tab);
        });
      });

      renderShop("rock-bottom");
      if (panelEl) {
        panelEl.classList.add("panel-animate-in");
      }
      setInterval(() => updateStatus(currentShopKey), 60000);
    </script>
  </body>
</html>`;

const SIM_ACCESS_TOKEN = "sim_access_token";
const SIM_REFRESH_TOKEN = "sim_refresh_token";
const SIM_AUTH_CODE = "sim_auth_code";
const SIM_CLIENT_ID = "sim_client_id";
const SIM_CLIENT_SECRET = "sim_client_secret";

const buildRedirectUrl = (redirectUri, params) => {
  try {
    const url = new URL(redirectUri);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
    return url.toString();
  } catch {
    return null;
  }
};

const buildAuthorizeHtml = (redirectUri, state) => {
  const redirectUrl = redirectUri
    ? buildRedirectUrl(redirectUri, { code: SIM_AUTH_CODE, state })
    : null;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Piano SIM</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="min-h-screen bg-[#f7f2ea] flex items-center justify-center px-6">
    <div class="w-full max-w-md rounded-2xl border border-[#e2d6c2] bg-[#fffaf0] px-8 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <img class="mx-auto mb-6 h-20 w-20" src="/assets/wolf.png" alt="Unlike Other AI" />
      <h1 class="text-3xl font-semibold tracking-wide text-[#1d1b16]">Piano SIM</h1>
      <p class="mt-2 text-sm text-[#4b443b]">by Unlike Other AI agency</p>
      <button
        id="continue-button"
        class="mt-8 w-full rounded-full bg-[#1d1b16] px-6 py-3 text-sm font-semibold uppercase tracking-widest text-[#fffaf0] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        ${redirectUrl ? "" : "disabled"}
      >
        Continue
      </button>
      ${
        redirectUrl
          ? ""
          : "<p class=\"mt-6 text-xs text-[#6a5f52]\">Missing or invalid redirect_uri.</p>"
      }
    </div>
    <script>
      const redirectUrl = ${JSON.stringify(redirectUrl ?? "")};
      const button = document.getElementById("continue-button");
      if (button && redirectUrl) {
        button.addEventListener("click", () => {
          window.location.href = redirectUrl;
        });
      }
    </script>
  </body>
</html>`;
};

const authorizeHandler = (req, res) => {
  const { redirect_uri: redirectUri, state } = req.query;
  res.status(200).type("html").send(buildAuthorizeHtml(redirectUri, state));
};

const tokenHandler = (req, res) => {
  res.status(200).json({
    access_token: SIM_ACCESS_TOKEN,
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: SIM_REFRESH_TOKEN,
    scope: "orders documents inventory",
  });
};

const revokeHandler = (req, res) => {
  res.status(200).json({ revoked: true });
};

const introspectHandler = (req, res) => {
  res.status(200).json({
    active: true,
    token: SIM_ACCESS_TOKEN,
    token_type: "Bearer",
    exp: Math.floor(Date.now() / 1000) + 3600,
    scope: "orders documents inventory",
  });
};

const registerHandler = (req, res) => {
  res.status(201).json({
    client_id: SIM_CLIENT_ID,
    client_secret: SIM_CLIENT_SECRET,
    client_name: "Piano SIM Client",
    redirect_uris: ["http://localhost:5173/callback"],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "client_secret_post",
  });
};

const userInfoHandler = (req, res) => {
  res.status(200).json({
    sub: "sim-user",
    email: "sim.user@example.com",
    name: "Piano Sim User",
  });
};

const authorizationServerMetadataHandler = (req, res) => {
  res.status(200).json({
    issuer: "http://localhost:6080",
    authorization_endpoint: "http://localhost:6080/oauth/authorize",
    token_endpoint: "http://localhost:6080/oauth/token",
    jwks_uri: "http://localhost:6080/.well-known/jwks.json",
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
  });
};

const protectedResourceMetadataHandler = (req, res) => {
  res.status(200).json({
    resource: "http://localhost:6080",
    authorization_servers: ["http://localhost:6080"],
  });
};

const loginHandler = (req, res) => {
  res.status(200).json({ access_token: SIM_ACCESS_TOKEN });
};

const whoAmIHandler = (req, res) => {
  res.status(200).json({
    accountId: "urn:account:sim-001",
    type: "APPLICATION",
    email: "sim.user@example.com",
    tenantPermissions: { "urn:tenant:sim": ["READ", "WRITE"] },
    establishmentPermissions: { "urn:establishment:sim": ["READ", "WRITE"] },
  });
};

const pairHandler = (req, res) => {
  const establishments = Array.isArray(req.body?.establishments)
    ? req.body.establishments
    : [];
  const credentials =
    establishments.length > 0
      ? establishments.map((establishment) => ({
          sourceId: establishment?.sourceId ?? "SIM-EST-001",
          clientId: SIM_CLIENT_ID,
          clientSecret: SIM_CLIENT_SECRET,
        }))
      : [
          {
            sourceId: "SIM-EST-001",
            clientId: SIM_CLIENT_ID,
            clientSecret: SIM_CLIENT_SECRET,
          },
        ];

  res.status(200).json({ credentials });
};

const triggerHandler = (req, res) => {
  res.status(200).json({ ok: ":)" });
};

app.post("/sim/trigger", triggerHandler);
app.get("/sim/trigger", triggerHandler);

app.get("/oauth/authorize", authorizeHandler);
app.post("/oauth/token", tokenHandler);
app.post("/oauth/revoke", revokeHandler);
app.post("/oauth/introspect", introspectHandler);
app.post("/oauth/register", registerHandler);
app.get("/oauth/userinfo", userInfoHandler);
app.get("/.well-known/oauth-authorization-server", authorizationServerMetadataHandler);
app.get("/.well-known/oauth-protected-resource/mcp", protectedResourceMetadataHandler);
app.post("/api/v1/auth/login", loginHandler);
app.get("/api/v1/auth/whoami", whoAmIHandler);
app.post("/api/v1/auth/pair", pairHandler);

app.get("/", (req, res) => {
  res.status(200).type("html").send(rootIndexHtml);
});
app.use("/swagger", express.static(swaggerAssetPath, { index: false }));
app.get("/swagger", (req, res) => {
  res.status(200).type("html").send(swaggerIndexHtml);
});
app.get("/swagger/openapi.json", (req, res) => {
  try {
    const spec = fs.readFileSync(openApiPath, "utf8");
    res.status(200).type("json").send(spec);
  } catch {
    res.status(500).json({ error: "OpenAPI spec not available." });
  }
});

app.listen(port, () => {
  console.log(`API simulator listening on port ${port}`);
});
