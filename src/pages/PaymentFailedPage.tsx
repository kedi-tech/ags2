import { Link, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { XCircle, RefreshCw } from "lucide-react";

export default function PaymentFailedPage() {
  const location = useLocation();
  const state = (location.state || {}) as {
    paymentId?: string;
    orderNumber?: string;
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-5">
            <XCircle className="w-11 h-11 text-red-500" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#101922] mb-2">
            Paiement échoué
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Le paiement n&apos;a pas pu être validé. Vous pouvez réessayer depuis la
            page de paiement.
          </p>

          <div className="mt-6 bg-[#f6f7f8] rounded-xl p-4 text-left text-sm">
            {state.orderNumber && (
              <p className="text-gray-700">
                <span className="font-semibold">Commande:</span> #{state.orderNumber}
              </p>
            )}
            {state.paymentId && (
              <p className="text-gray-700 mt-1 break-all">
                <span className="font-semibold">Paiement ID:</span> {state.paymentId}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/paiement"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold text-sm transition-colors w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer le paiement
            </Link>
            <Link
              to="/panier"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-200 hover:border-[#137fec] hover:text-[#137fec] text-gray-700 font-semibold text-sm transition-colors w-full sm:w-auto"
            >
              Retour au panier
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

