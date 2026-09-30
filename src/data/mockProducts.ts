import { Product } from '../types/vault';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Phantom Velocity 3000',
    brand: 'HORIZON LABS',
    category: 'Sneakers',
    price: 380,
    originalPrice: 450,
    rating: 4.9,
    reviewsCount: 342,
    badge: 'LIMITED DROP ⚡',
    description: 'Engineered with carbon-fiber energy propulsion plates and breathable aerospace ballistic mesh. Features responsive quantum-cushioning for effortless zero-gravity street velocity.',
    inStock: true,
    specs: {
      weight: '290g (Size 10)',
      materials: 'Aerospace Mesh, Carbon-Fiber Plate, TPU Outsole',
      releaseDate: 'Fall 2026',
      cushioning: 'Quantum Air Nitrogen Pods'
    },
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    colorways: [
      {
        id: 'cw-cyber-cyan',
        name: 'Cyberpunk Neon Cyan',
        hex: '#00f0ff',
        accentHex: '#ff0055',
        angleImages: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=80'
        ]
      },
      {
        id: 'cw-triple-black',
        name: 'Obsidian Stealth Black',
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
        id: 'cw-platinum-ice',
        name: 'Platinum Ice & Gold',
        hex: '#e2e8f0',
        accentHex: '#d4af37',
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
    name: 'Neo-Matrix High Top',
    brand: 'CYBERPUNK STUDIO',
    category: 'Sneakers',
    price: 420,
    rating: 4.8,
    reviewsCount: 198,
    badge: 'BESTSELLER 🔥',
    description: 'Futuristic high-top silhouette built with magnetic Fidlock closure buckles and waterproof Gore-Tex membranous shell.',
    inStock: true,
    specs: {
      weight: '340g',
      materials: 'Gore-Tex, Magnetic Fidlock, Vibram Lugged Sole',
      releaseDate: 'Summer 2026',
      cushioning: 'Dual Density EVA React Foam'
    },
    sizes: [8, 9, 10, 11, 12],
    colorways: [
      {
        id: 'cw-red-black',
        name: 'Chicago Cyber Red',
        hex: '#dc2626',
        accentHex: '#000000',
        angleImages: [
          'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512374382149-233c42b661ac?w=1000&auto=format&fit=crop&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Exo-Shell Modular Parka',
    brand: 'ACRONYM TECH',
    category: 'Outerwear',
    price: 650,
    originalPrice: 780,
    rating: 5.0,
    reviewsCount: 86,
    badge: 'WEATHERPROOF 🌧️',
    description: '3-layer modular storm jacket featuring magnetic sling harness, thermal heat-reflective lining, and detachable cargo pouches.',
    inStock: true,
    specs: {
      weight: '620g',
      materials: '3L Schoeller Dryskin, YKK Aquaguard Zips',
      releaseDate: 'Winter 2026',
      cushioning: 'N/A'
    },
    sizes: [38, 40, 42, 44],
    colorways: [
      {
        id: 'cw-matte-olive',
        name: 'Tactical Matte Olive',
        hex: '#3f4c38',
        accentHex: '#000000',
        angleImages: [
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=80'
        ]
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Valkyrie Cargo Techwear Pant',
    brand: 'HORIZON LABS',
    category: 'Techwear',
    price: 240,
    rating: 4.7,
    reviewsCount: 112,
    description: 'Articulated ergonomic streetwear trousers with 8 waterproof zip pockets and adjustable tapered ankle cinch cords.',
    inStock: true,
    specs: {
      weight: '410g',
      materials: 'Stretch Ripstop Cordura, Teflon DWR',
      releaseDate: '2026',
      cushioning: 'N/A'
    },
    sizes: [28, 30, 32, 34, 36],
    colorways: [
      {
        id: 'cw-pitch-black',
        name: 'Pitch Black',
        hex: '#111827',
        accentHex: '#3b82f6',
        angleImages: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80'
        ]
      }
    ]
  }
];
