import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import AccountPage from "./pages/AccountPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import WishlistPage from "./pages/WishlistPage";
import CategoryPage from "./pages/CategoryPage";
import AllCategoriesPage from "./pages/AllCategoriesPage";

function App() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#137fec]/20 border-t-[#137fec] rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Chargement...</p>
        </div>
      </div>
    }>
      <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produit/:id" element={<ProductDetailPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/paiement" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<OrderConfirmationPage />} />
          <Route path="/paiement-echoue" element={<PaymentFailedPage />} />
          <Route path="/compte" element={<AccountPage />} />
          <Route path="/aide" element={<HelpCenterPage />} />
          <Route path="/souhaits" element={<WishlistPage />} />
          <Route path="/categorie/:slug" element={<CategoryPage />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
