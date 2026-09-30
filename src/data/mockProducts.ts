import { Product } from '../types/vault';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Monolith 01 Low-Top Runner',
    styleCode: 'HZ-M01-FW26',
    brand: 'HORIZON ARCHIVE',
    category: 'Footwear',
    price: 395,
    originalPrice: 460,
    rating: 4.9,
    reviewsCount: 148,
    badge: 'COLLECTION FW26',
    description: 'Handcrafted in Civitanova Marche, Italy. Constructed from full-grain Tuscan calfskin with a padded collar, tonal cotton laces, and a custom dual-density Vibram® rubber cupsole engineered for all-day comfort.',
    details: [
      'Full-grain Italian calfskin upper and lining',
      'Custom Vibram® Megagrip lugged rubber outsole',
      'Removable molded OrthoLite® ergonomic footbed',
      'Blind embossed gold-foil style code on lateral heel',
      'Includes custom dust bag and spare tonal waxed laces',
      'Made in Italy'
    ],
    inStock: true,
    specs: {
      weight: '385g (EU 42 / US 9)',
      materials: '100% Full-Grain Calfskin, Vibram® Rubber',
      provenance: 'Civitanova Marche, Italy',
      cushioning: 'Dual-Density Molded OrthoLite®'
    },
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    colorways: [
      {
        id: 'cw-bone-white',
        name: 'Bone / Chalk White',
        hex: '#f4f1ea',
        accentHex: '#18181b',
        angleImages: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'cw-stealth-obsidian',
        name: 'Obsidian Black / Charcoal',
        hex: '#18181b',
        accentHex: '#71717a',
        angleImages: [
          'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1000&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'cw-sage-olive',
        name: 'Sage / Muted Olive Gum',
        hex: '#4a5548',
        accentHex: '#d4a373',
        angleImages: [
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Aerostructure High-Top Trail',
    styleCode: 'HZ-AT02-FW26',
    brand: 'HORIZON TECHNICAL',
    category: 'Footwear',
    price: 440,
    rating: 4.8,
    reviewsCount: 92,
    badge: 'NEW ARRIVAL',
    description: 'Technical weather-resistant high-top silhouette built with a 3-layer waterproof GORE-TEX® lining, Fidlock® magnetic mechanical closure, and aggressive deep-lug Vibram® traction sole.',
    details: [
      'GORE-TEX® waterproof & breathable membrane',
      'Magnetic Fidlock® buckle fastening system',
      'Reflective 3M Scotchlite™ lateral piping',
      'Vibram® Arctic Grip cold-weather compound',
      'Reinforced TPU mudguard and toe cap',
      'Engineered in Munich, Germany'
    ],
    inStock: true,
    specs: {
      weight: '440g (EU 42)',
      materials: 'GORE-TEX®, Schoeller Cordura, Vibram® Outsole',
      provenance: 'Munich, Germany',
      cushioning: 'High-Rebound EVA React Cushioning'
    },
    sizes: [8, 9, 10, 11, 12],
    colorways: [
      {
        id: 'cw-charcoal-crimson',
        name: 'Charcoal / Crimson Accent',
        hex: '#27272a',
        accentHex: '#dc2626',
        angleImages: [
          'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512374382149-233c42b661ac?w=1000&auto=format&fit=crop&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Double-Faced Wool Melton Coat',
    styleCode: 'HZ-OC03-W26',
    brand: 'HORIZON ATELIER',
    category: 'Outerwear',
    price: 780,
    originalPrice: 920,
    rating: 5.0,
    reviewsCount: 47,
    badge: 'LIMITED EDITION',
    description: 'Minimalist double-breasted overcoat tailored from heavy double-faced Italian virgin wool. Features natural horn buttons, structured drop shoulders, and cupro satin sleeve lining.',
    details: [
      '100% Virgin Melton Wool (680 GSM)',
      'Natural polished horn buttons',
      '100% Bemberg Cupro sleeve lining',
      'Interior welt pockets with button closure',
      'Deep back vent with button tab',
      'Hand-finished in Biella, Italy'
    ],
    inStock: true,
    specs: {
      weight: '1,250g (Size 50)',
      materials: '100% Italian Virgin Wool, Cupro Lining',
      provenance: 'Biella, Italy',
      cushioning: 'N/A'
    },
    sizes: [38, 40, 42, 44],
    colorways: [
      {
        id: 'cw-dark-olive',
        name: 'Deep Forest Olive',
        hex: '#2b3327',
        accentHex: '#18181b',
        angleImages: [
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Pleated Japanese Twill Trouser',
    styleCode: 'HZ-TR04-FW26',
    brand: 'HORIZON STUDIO',
    category: 'Tailoring',
    price: 290,
    rating: 4.8,
    reviewsCount: 68,
    description: 'Relaxed wide-leg trousers woven in Okayama, Japan from high-density organic cotton twill. Features double forward pleats, extended tab waistband, and Corozo nut buttons.',
    details: [
      '100% Organic Japanese Cotton Twill (340 GSM)',
      'Double forward pleats with wide tapered silhouette',
      'Extended waistband with concealed hook-and-bar closure',
      'Natural Corozo nut buttons',
      'Woven in Okayama, Japan'
    ],
    inStock: true,
    specs: {
      weight: '490g (Size 32)',
      materials: '100% Japanese Organic Cotton Twill',
      provenance: 'Okayama, Japan',
      cushioning: 'N/A'
    },
    sizes: [28, 30, 32, 34, 36],
    colorways: [
      {
        id: 'cw-midnight-navy',
        name: 'Midnight Navy',
        hex: '#0f172a',
        accentHex: '#3b82f6',
        angleImages: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80'
        ]
      }
    ]
  }
];
