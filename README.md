# 👟 HorizonVault — 3D Interactive Luxury Sneaker & Apparel Marketplace

**HorizonVault** is an interactive luxury streetwear and sneaker marketplace built with **React 18, TypeScript, Tailwind CSS, and Vite**. It features a 360-degree interactive 3D product showcase with angle scrubbers and auto-spin rotation, real-time colorway customizer with dynamic ambient lighting, and an animated slide-out shopping cart with coupon discounts and simulated Apple Pay checkout.

---

## ⚡ Key Engineering Features

- **360° Interactive Product Viewport**: Multi-angle image scrubber allowing smooth drag/click rotation and automated continuous 3D spin mode.
- **Dynamic Ambient Glow Lighting & Colorway Engine**: Real-time reactive background glow shaders synchronized to selected colorway hex palettes (*Cyberpunk Neon Cyan, Obsidian Stealth Black, Platinum Ice Gold*).
- **Curated Vault Catalog**: Filterable luxury product grid by category (*Sneakers, Outerwear, Techwear*), rating metrics, and 1-click 3D viewport inspection.
- **Interactive Shopping Bag Drawer**: Slide-out cart drawer with item quantity modifiers, persistent `localStorage` synchronization, dynamic promo code validation engine (`APEX2026` for 20% off), and free insured shipping calculation.
- **Instant Checkout Flow**: Complete checkout simulation with Apple Pay / Card processing, animated receipt generation, and verified tracking numbers.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Design & Typography**: Space Grotesk, Inter, Lucide Icons
- **Bundler & Build**: Vite 6, PostCSS, Autoprefixer
- **State Management**: React Context with persistent cart serialization
- **Deployment**: Vercel ready (`vercel.json` SPA routing)

---

## 💼 Resume Bullet Points

```markdown
• Developed HorizonVault, an interactive e-commerce web application featuring a 360° product rotation viewport, dynamic colorway lighting shaders, and modular techwear catalog using React 18, TypeScript, and Tailwind CSS.
• Built an animated slide-out shopping cart with live quantity manipulation, dynamic promotional coupon engines, and verified checkout flow simulation.
• Engineered a performant client-side state machine with localStorage persistence and zero-overhead image preloading for seamless 3D angle transitions.
```

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/freshstart2066-create/horizonvault.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📜 License

MIT License © 2026 HorizonVault Inc.
