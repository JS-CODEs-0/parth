import { Product, ActivePreferences } from '../types';
import { products } from '../data/products';

export interface ExtractedFilters {
  category?: string;
  maxBudget?: number;
  minBudget?: number;
  ram?: string;
  storage?: string;
  brands: string[];
  keywords: string[];
  isComparison: boolean;
  isAlternativeRequest: boolean;
  isExplanationRequest: boolean;
  comparedProductIds: string[];
}

/**
 * Extracts and merges query filters, preserving conversation session memory.
 */
export function extractQueryFilters(
  query: string,
  previousPreferences?: ActivePreferences
): ExtractedFilters {
  const q = query.toLowerCase();

  // 1. Detect Category
  let category: string | undefined;
  if (/\b(laptop|notebook|ultrabook|macbook|thinkpad|zenbook|rog|gaming laptop)\b/i.test(q)) {
    category = 'laptops';
  } else if (/\b(phone|smartphone|iphone|galaxy|pixel|oneplus|android|ios|mobile)\b/i.test(q)) {
    category = 'smartphones';
  } else if (/\b(headphone|headphones|earphones|earbuds|anc|audio|sound|airpods|over-ear)\b/i.test(q)) {
    category = 'headphones';
  } else if (/\b(monitor|monitors|display|displays|screen|screens|ultrasharp|ultrafine|curved monitor)\b/i.test(q)) {
    category = 'monitors';
  } else if (/\b(keyboard|mouse|dock|charger|power bank|accessory|accessories|keychron|mx master)\b/i.test(q)) {
    category = 'accessories';
  } else if (previousPreferences?.category) {
    // Retain from session memory
    category = previousPreferences.category;
  }

  // 2. Detect Budget in INR
  let maxBudget: number | undefined;

  // Patterns: under 80000, under ₹80,000, under 80k, below 1 lakh, budget of 50000, have ₹70,000
  const budgetMatch = q.match(/(?:under|below|less than|within|max|budget of|budget|have|spend|around)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lac)?/i);
  if (budgetMatch) {
    let num = parseFloat(budgetMatch[1].replace(/,/g, ''));
    const unit = budgetMatch[2]?.toLowerCase();
    if (unit === 'k') num *= 1000;
    else if (unit === 'lakh' || unit === 'lac') num *= 100000;
    maxBudget = num;
  } else {
    const kMatch = q.match(/\b(\d+)\s*k\b/i);
    if (kMatch) {
      maxBudget = parseInt(kMatch[1], 10) * 1000;
    }
    const lakhMatch = q.match(/\b(\d+)\s*(?:lakh|lac)\b/i);
    if (lakhMatch) {
      maxBudget = parseInt(lakhMatch[1], 10) * 100000;
    }
  }

  // Fallback to previous budget memory if user didn't change it
  if (!maxBudget && previousPreferences?.maxBudget) {
    maxBudget = previousPreferences.maxBudget;
  }

  // 3. Detect RAM & Storage requirements
  let ram: string | undefined;
  const ramMatch = q.match(/\b(8gb|16gb|18gb|32gb|64gb)\s*(?:ram|memory)?\b/i);
  if (ramMatch) {
    ram = ramMatch[1].toUpperCase();
  } else if (previousPreferences?.ram && !q.includes('ram')) {
    ram = previousPreferences.ram;
  }

  let storage: string | undefined;
  const storageMatch = q.match(/\b(128gb|256gb|512gb|1tb|2tb)\s*(?:storage|ssd|rom)?\b/i);
  if (storageMatch) {
    storage = storageMatch[1].toUpperCase();
  } else if (previousPreferences?.storage && !q.includes('storage')) {
    storage = previousPreferences.storage;
  }

  // 4. Detect Brands
  const availableBrands = [
    'apple', 'samsung', 'google', 'sony', 'bose', 'dell', 'asus',
    'lenovo', 'hp', 'oneplus', 'nothing', 'sennheiser', 'marshall',
    'lg', 'benq', 'keychron', 'logitech', 'caldigit', 'anker'
  ];
  const matchedBrands = availableBrands.filter((b) => q.includes(b));
  if (matchedBrands.length === 0 && previousPreferences?.brands?.length) {
    matchedBrands.push(...previousPreferences.brands);
  }

  // 5. Detect Intent Types
  const isComparison = /\b(vs|compare|comparison|versus|better between|difference between|compare these)\b/i.test(q);
  const isAlternativeRequest = /\b(alternative|alternatives|other option|other options|cheaper|exceeds|stretch)\b/i.test(q);
  const isExplanationRequest = /\b(explain|what is|what does|meaning of|simple language|plain terms|tell me about)\b/i.test(q);

  // 6. Common Product Aliases
  const aliases: Record<string, string> = {
    'xm5': 'sony-wh-1000xm5',
    'wh-1000xm5': 'sony-wh-1000xm5',
    'bose qc': 'bose-quietcomfort-ultra',
    'qc ultra': 'bose-quietcomfort-ultra',
    'bose ultra': 'bose-quietcomfort-ultra',
    'quietcomfort': 'bose-quietcomfort-ultra',
    'airpods max': 'apple-airpods-max',
    'momentum 4': 'sennheiser-momentum-4',
    'major iv': 'marshall-major-iv',
    'macbook': 'macbook-pro-14-m3',
    'macbook pro': 'macbook-pro-14-m3',
    'xps 15': 'dell-xps-15-oled',
    'xps': 'dell-xps-15-oled',
    'zephyrus': 'asus-rog-zephyrus-g14',
    'g14': 'asus-rog-zephyrus-g14',
    'x1 carbon': 'lenovo-thinkpad-x1-carbon-gen11',
    'thinkpad': 'lenovo-thinkpad-x1-carbon-gen11',
    'envy x360': 'hp-envy-x360-14',
    'envy': 'hp-envy-x360-14',
    'iphone 16': 'iphone-16-pro-max',
    'iphone': 'iphone-16-pro-max',
    's24 ultra': 'samsung-galaxy-s24-ultra',
    'galaxy s24': 'samsung-galaxy-s24-ultra',
    'pixel 9': 'google-pixel-9-pro',
    'pixel 9 pro': 'google-pixel-9-pro',
    'pixel': 'google-pixel-9-pro',
    'oneplus 12': 'oneplus-12-5g',
    'nothing phone': 'nothing-phone-2',
    'ultrafine': 'lg-ultrafine-27-4k',
    'ultrasharp': 'dell-ultrasharp-32-4k-hub',
    'odyssey g7': 'samsung-odyssey-g7-32',
    'odyssey': 'samsung-odyssey-g7-32',
    'pd2705u': 'benq-pd2705u-27-4k',
    'proart': 'asus-proart-pa278qv',
    'keychron': 'keychron-q1-pro-wireless',
    'q1 pro': 'keychron-q1-pro-wireless',
    'mx master': 'logitech-mx-master-3s',
    'caldigit': 'caldigit-ts4-thunderbolt-4',
    'ts4': 'caldigit-ts4-thunderbolt-4',
    'anker prime': 'anker-prime-20000-200w',
  };

  const comparedProductIds: string[] = [];

  Object.entries(aliases).forEach(([alias, id]) => {
    if (q.includes(alias) && !comparedProductIds.includes(id)) {
      comparedProductIds.push(id);
    }
  });

  products.forEach((p) => {
    const pName = p.name.toLowerCase();
    const pId = p.id.toLowerCase();
    if ((q.includes(pId) || q.includes(pName)) && !comparedProductIds.includes(p.id)) {
      comparedProductIds.push(p.id);
    }
  });

  // 7. Extract Keywords & Combine with Previous Memory
  const keywordsToCheck = [
    'coding', 'programming', 'developer', 'battery', 'gaming', 'lightweight',
    'oled', '4k', 'anc', 'noise cancelling', 'camera', 'zoom', 'usb-c',
    'ergonomic', 'travel', 'wireless', 'bluetooth', 'thocky', 'mechanical',
    'college', 'editing', 'video', 'display', 'touch', 'refresh rate'
  ];
  const newKeywords = keywordsToCheck.filter((kw) => q.includes(kw));

  // Merge with previous memory keywords
  const combinedKeywords = Array.from(
    new Set([...(previousPreferences?.keyRequirements || []), ...newKeywords])
  );

  return {
    category,
    maxBudget,
    ram,
    storage,
    brands: matchedBrands,
    keywords: combinedKeywords,
    isComparison,
    isAlternativeRequest,
    isExplanationRequest,
    comparedProductIds,
  };
}

/**
 * Deterministic catalog filtering based on query filters and accumulated memory.
 */
export function searchCatalogDeterministic(
  query: string,
  previousPreferences?: ActivePreferences,
  maxResults = 8
): {
  matchedProducts: Product[];
  filters: ExtractedFilters;
} {
  const filters = extractQueryFilters(query, previousPreferences);

  // A. If specific comparison products were detected (2 or more)
  if (filters.comparedProductIds.length >= 2) {
    const specificMatches = products.filter((p) => filters.comparedProductIds.includes(p.id));
    return {
      matchedProducts: specificMatches,
      filters,
    };
  }

  // B. If user asks "compare these three laptops" or similar generic multi-comparison
  if (filters.isComparison && filters.category) {
    const categoryProducts = products.filter((p) => p.category === filters.category);
    // Return top 3-4 models from that category
    return {
      matchedProducts: categoryProducts.slice(0, 4),
      filters,
    };
  }

  // C. Scoring matching algorithm
  const scored = products.map((product) => {
    let score = 0;

    // 1. Category match (+60)
    if (filters.category && product.category === filters.category) {
      score += 60;
    }

    // 2. Brand match (+40)
    if (filters.brands.some((b) => product.brand.toLowerCase() === b)) {
      score += 40;
    }

    // 3. RAM match (+30)
    if (filters.ram) {
      const productRam = product.specs.ram?.toUpperCase() || '';
      if (productRam.includes(filters.ram)) {
        score += 30;
      }
    }

    // 4. Storage match (+25)
    if (filters.storage) {
      const productStorage = product.specs.storage?.toUpperCase() || '';
      if (productStorage.includes(filters.storage)) {
        score += 25;
      }
    }

    // 5. Budget evaluation
    if (filters.maxBudget) {
      if (product.price <= filters.maxBudget) {
        score += 40; // fully within budget
      } else if (product.price <= filters.maxBudget * 1.25) {
        score += 15; // stretch alternative (+25%)
      } else {
        score -= 25; // significantly exceeds budget
      }
    }

    // 6. Keywords match in specs/features (+15 each)
    const productText = `${product.name} ${product.shortDescription} ${product.fullDescription} ${JSON.stringify(product.specs)} ${product.keyFeatures.join(' ')}`.toLowerCase();
    filters.keywords.forEach((kw) => {
      if (productText.includes(kw)) {
        score += 15;
      }
    });

    // 7. General query token matching (+5)
    const queryTokens = query.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
    queryTokens.forEach((token) => {
      if (productText.includes(token)) {
        score += 5;
      }
    });

    if (product.featured) score += 5;

    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // If user asked for laptops or specific category, prioritize products of that category
  let candidateList = scored;
  if (filters.category) {
    const categoryOnly = scored.filter((s) => s.product.category === filters.category);
    if (categoryOnly.length > 0) {
      candidateList = categoryOnly;
    }
  }

  let results = candidateList.map((s) => s.product);

  // If budget was strictly exceeded, ensure the closest budget alternative is included!
  if (filters.maxBudget && filters.category) {
    const categoryProducts = products.filter((p) => p.category === filters.category);
    categoryProducts.sort((a, b) => a.price - b.price);
    const lowestPriced = categoryProducts[0];
    if (lowestPriced && !results.some((r) => r.id === lowestPriced.id)) {
      results.unshift(lowestPriced);
    }
  }

  return {
    matchedProducts: results.slice(0, maxResults),
    filters,
  };
}
