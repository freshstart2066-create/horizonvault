import React from 'react';
import { VaultProvider } from './context/VaultContext';
import { Navbar } from './components/layout/Navbar';
import { Product3DViewer } from './components/showcase/Product3DViewer';
import { ProductGrid } from './components/catalog/ProductGrid';
import { CartDrawer } from './components/cart/CartDrawer';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { ToastContainer } from './components/ui/ToastContainer';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0c0d10] text-zinc-100 flex flex-col justify-between font-sans select-none overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* 3D Interactive Product Showcase */}
        <Product3DViewer />

        {/* Catalog Grid */}
        <ProductGrid />
      </main>

      {/* Luxury Editorial Footer */}
      <footer className="bg-[#0c0d10] border-t border-[#232530] py-14 px-6 sm:px-12 text-xs text-zinc-500 font-mono space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#showcase" className="hover:text-white transition-colors">Studio 3D</a>
            <a href="#catalog" className="hover:text-white transition-colors">Footwear</a>
            <a href="#catalog" className="hover:text-white transition-colors">Outerwear</a>
            <a href="#catalog" className="hover:text-white transition-colors">Tailoring</a>
            <a href="https://github.com/freshstart2066-create/horizonvault" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>

          <p className="text-zinc-500 text-[11px]">
            © 2026 HORIZON ARCHIVE. Handcrafted in Civitanova Marche, Italy. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Order Confirmation */}
      <OrderSuccessModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <VaultProvider>
      <AppContent />
    </VaultProvider>
  );
};
