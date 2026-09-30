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
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 flex flex-col justify-between font-sans select-none overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* 3D Interactive Product Showcase */}
        <Product3DViewer />

        {/* Catalog Grid */}
        <ProductGrid />
      </main>

      {/* Footer */}
      <footer className="bg-[#111216] border-t border-[#262833] py-12 px-6 sm:px-12 text-center text-xs text-zinc-500 font-mono space-y-3">
        <div className="flex items-center justify-center gap-6 text-zinc-400">
          <a href="#showcase" className="hover:text-white">3D Studio</a>
          <a href="#catalog" className="hover:text-white">Limited Vault Drops</a>
          <a href="https://github.com/freshstart2066-create/horizonvault" target="_blank" rel="noreferrer" className="hover:text-white">
            GitHub Repository
          </a>
        </div>
        <p>© 2026 HorizonVault Inc. All rights reserved. 3D Luxury Streetwear & Verified Provenance.</p>
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
