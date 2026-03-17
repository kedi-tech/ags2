import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductCard from "@/components/shared/ProductCard";
import { getProductById, getProducts } from "@/api/products";
import { useCart } from "@/context/CartContext";
import {
  Star,
  Heart,
  ShoppingCart,
  Package,
  Shield,
  Truck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  Plus,
  Minus,
  Check,
} from "lucide-react";

const FALLBACK_THUMBNAILS = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&q=80",
  "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&q=80",
  "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200&q=80",
];

const accordionItems = [
  {
    title: "Détails produit",
    content: "La Zenith Smart Watch Pro est équipée d'un processeur double cœur dernière génération, d'un écran AMOLED Always-On de 1,9 pouces avec une luminosité maximale de 2 000 nits. Résistante à l'eau jusqu'à 50 mètres (5ATM). Autonomie jusqu'à 18 jours en mode économie d'énergie.",
    open: true,
  },
  // {
  //   title: "Spécifications techniques",
  //   content: "Écran : AMOLED 1.9\" 448×368px | Processeur : Dual-core 1.1GHz | Mémoire : 32MB RAM / 4GB stockage | Batterie : 490mAh | Connectivité : Bluetooth 5.3, WiFi 2.4GHz, NFC | GPS intégré | Capteurs : FC, SpO2, température, accéléromètre, gyroscope",
  //   open: false,
  // },
  // {
  //   title: "Livraison & Retours",
  //   content: "Livraison standard gratuite sous 3-5 jours ouvrés. Livraison express disponible dès 15€ (24h). Retours gratuits sous 30 jours. Le produit doit être dans son emballage d'origine non endommagé.",
  //   open: false,
  // },
];

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number[]>([0]);
  const [bundleItems, setBundleItems] = useState<boolean[]>([]);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [frequentlyBought, setFrequentlyBought] = useState<any[]>([]);
  const [alsoLike, setAlsoLike] = useState<any[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!id) return;
      try {
        const [productData, productsData] = await Promise.all([
          getProductById(id),
          getProducts(),
        ]);
        if (!isMounted) return;

        setProduct(productData);

        const all: any[] = Array.isArray(productsData) ? productsData : [];
        const sameCategory = all.filter(
          (p) =>
            p.id !== productData.id &&
            p.categoryId &&
            p.categoryId === productData.categoryId
        );

        const sortedByCreated = all
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

        const makeCard = (p: any) => {
          const firstImageUrl =
            p.images && p.images.length > 0 ? p.images[0].url : undefined;
          return {
            id: p.id,
            name: p.name,
            category: p.category?.name ?? "Produits",
            price: p.price ?? 0,
            image:
              firstImageUrl ||
              p.imageUrl ||
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
          };
        };

        const frequently = (sameCategory.length > 0
          ? sameCategory
          : all.filter((p) => p.id !== productData.id)
        )
          .slice(0, 3)
          .map(makeCard);

        const also = sortedByCreated
          .filter((p) => p.id !== productData.id)
          .slice(0, 8)
          .map(makeCard);

        setFrequentlyBought(frequently);
        setAlsoLike(also);
        setBundleItems(Array(frequently.length).fill(true));
      } catch (error) {
        console.error("Failed to load product detail data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Derive dynamic options from product data
  const colorOptions: string[] =
    typeof product?.color === "string"
      ? product.color.split(",").map((c: string) => c.trim()).filter(Boolean)
      : [];

  const sizeOptions: string[] =
    typeof product?.size === "string"
      ? product.size.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

  // Initialize selected color/size when product (and its options) are loaded
  useEffect(() => {
    if (!selectedColor && colorOptions.length > 0) {
      setSelectedColor(colorOptions[0]);
    }
  }, [colorOptions.join(","), selectedColor]);

  useEffect(() => {
    if (!selectedSize && sizeOptions.length > 0) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [sizeOptions.join(","), selectedSize]);

  const imageUrls: string[] =
    product?.images && product.images.length > 0
      ? product.images.map((img: any) => img.url)
      : FALLBACK_THUMBNAILS;

  const currentImage = imageUrls[selectedThumb] ?? imageUrls[0];

  const categoryName = product?.category?.name ?? "Produits";
  const subCategoryName = (product as any)?.subCategory?.name as string | undefined;
  const productName = product?.name ?? "Produit";
  const sku = product?.sku ?? "SKU-0000";
  const price = product?.price ?? 0;
  const originalPrice = product?.companyPrice ?? null;
  const rating = product?.rating ?? 4.5;
  const reviews = product?.reviews ?? 0;
  const stock = typeof product?.stock === "number" ? product.stock : null;

  const discountAmount =
    originalPrice && originalPrice > price ? originalPrice - price : 0;
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0;

  const toggleAccordion = (idx: number) => {
    setOpenAccordion((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: productName,
      price,
      image: currentImage,
      sku,
      variant: [selectedColor, selectedSize].filter(Boolean).join(" / ") || undefined,
    });
    navigate("/panier");
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb
          items={[
            { name: "Tous les produits", href: "/categorie/all" },
            { name: categoryName, href: `/categorie/${product?.category?.slug ?? "all"}` },
            { name: productName },
          ]}
        />

        {/* Main product section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails - vertical on desktop, horizontal on mobile */}
              <div className="hidden sm:flex flex-col gap-3">
              {imageUrls.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedThumb(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedThumb === idx
                      ? "border-[#137fec] shadow-md shadow-[#137fec]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={thumb} alt={productName} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1">
              <div className="relative bg-white rounded-2xl overflow-hidden group border border-gray-100">
                <img
                  src={currentImage}
                  alt={productName}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Mobile thumbnails */}
              <div className="flex gap-2 mt-3 sm:hidden overflow-x-auto pb-1">
              {imageUrls.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedThumb(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedThumb === idx ? "border-[#137fec]" : "border-gray-200"
                    }`}
                  >
                    <img src={thumb} alt={productName} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-semibold text-[#137fec] bg-[#137fec]/10 px-2.5 py-1 rounded-full">
                  {categoryName}
                </span>
                {subCategoryName && (
                  <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                    {subCategoryName}
                  </span>
                )}
                {stock !== null && stock > 0 && (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
                    En stock · {stock} restant{stock > 1 ? "s" : ""}
                  </span>
                )}
                {stock !== null && stock <= 0 && (
                  <span className="text-xs text-red-600 font-medium bg-red-50 px-2.5 py-1 rounded-full">
                    Rupture de stock
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#101922] leading-tight">
                {productName}
              </h1>
              <p className="text-sm text-gray-400 mt-1">SKU: {sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-amber-200 text-amber-400"
                  }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                {reviews} avis
              </span>
              <a href="#reviews" className="text-sm text-[#137fec] hover:underline">Voir les avis</a>
            </div>

            {/* Price */}
            <div className="bg-[#f6f7f8] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#101922]">
                  {price.toLocaleString("fr-FR")} GNF
                </span>
                {originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {originalPrice.toLocaleString("fr-FR")} GNF
                  </span>
                )}
                </div>
                {discountAmount > 0 && (
                  <span className="text-sm text-green-600 font-semibold mt-1 block">
                    ✓ Vous économisez{" "}
                    {discountAmount.toLocaleString("fr-FR")} GNF ({discountPercent}
                    %)
                  </span>
                )}
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>Prix habituel</div>
                {originalPrice && (
                  <div className="font-semibold text-gray-700">
                    {originalPrice.toLocaleString("fr-FR")} GNF
                  </div>
                )}
              </div>
            </div>

            {/* Color selector (dynamic from API, visual swatches) */}
            {colorOptions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  {/* <span className="text-sm font-bold text-gray-800">
                    Couleur sélectionnée :{" "}
                    <span className="text-[#137fec]">
                      {selectedColor || colorOptions[0]}
                    </span>
                  </span> */}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => {
                    // Try to use the color string directly; if it’s not a valid CSS color, the browser just ignores it visually.
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected
                            ? "border-[#137fec] ring-2 ring-[#137fec]/30 ring-offset-1"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      >
                        {isSelected && (
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selector (dynamic from API) */}
            {sizeOptions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-800">Taille</span>
                  <button className="text-xs text-[#137fec] hover:underline">
                    Guide des tailles
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedSize === size
                          ? "border-[#137fec] bg-[#137fec]/5 text-[#137fec]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-4 py-2.5 text-sm font-bold text-gray-800 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#137fec]/30 text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Ajouter au Panier
              </button>

              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  wishlisted
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-gray-200 hover:border-gray-300 text-gray-400"
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            <button
              onClick={() => navigate("/paiement")}
              className="w-full border-2 border-[#101922] text-[#101922] hover:bg-[#101922] hover:text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Acheter Maintenant
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                  // { icon: Truck, text: "Livraison gratuite", sub: "Dès 50€ d'achat" },
                  // { icon: Shield, text: "Garantie 2 ans", sub: "Satisfaction garantie" },
                { icon: RefreshCw, text: "Retours gratuits", sub: "3 jours pour retourner" },
                { icon: Package, text: "Emballage sécurisé", sub: "Livraison express dispo" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-gray-100">
                  <badge.icon className="w-4 h-4 text-[#137fec] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{badge.text}</div>
                    <div className="text-xs text-gray-400">{badge.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="space-y-2">
              {accordionItems.map((item, idx) => {
                const isDetails = item.title === "Détails produit";
                const content = isDetails
                  ? product?.description || item.content
                  : item.content;

                return (
                  <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      {item.title}
                      {openAccordion.includes(idx) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {openAccordion.includes(idx) && (
                      <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                        <p className="pt-3">{content}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Frequently bought together */}
        {frequentlyBought.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-black text-[#101922] mb-5">
              Fréquemment achetés ensemble
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              {/* Main product */}
              <div className="flex items-center gap-3">
                <img
                  src={imageUrls[0]}
                  alt={productName}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-800 max-w-[120px] line-clamp-2">
                    {productName}
                  </p>
                  <p className="text-sm font-bold text-[#137fec]">
                    {price.toLocaleString("fr-FR")} GNF
                  </p>
                </div>
              </div>

              <span className="text-gray-300 font-bold text-xl">+</span>

              {frequentlyBought.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <input
                      type="checkbox"
                      checked={bundleItems[idx]}
                      onChange={() => {
                        const next = [...bundleItems];
                        next[idx] = !next[idx];
                        setBundleItems(next);
                      }}
                      className="absolute -top-1 -right-1 w-4 h-4 accent-[#137fec]"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 max-w-[100px] line-clamp-2">
                      {p.name}
                    </p>
                    <p className="text-sm font-bold text-[#137fec]">
                      {p.price.toLocaleString("fr-FR")} GNF
                    </p>
                  </div>
                  {idx < frequentlyBought.length - 1 && (
                    <span className="text-gray-300 font-bold text-xl">+</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Prix du bundle</p>
                <p className="text-2xl font-black text-[#101922]">
                  {(
                    price +
                    frequentlyBought.reduce(
                      (sum, p, idx) =>
                        bundleItems[idx] ? sum + p.price : sum,
                      0
                    )
                  ).toLocaleString("fr-FR")}{" "}
                  GNF
                </p>
              </div>
              <button
                className="bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#137fec]/30 flex items-center gap-2"
                onClick={() => {
                  addItem({
                    id: product?.id,
                    name: productName,
                    price,
                    image: currentImage,
                  });
                  frequentlyBought.forEach((p, idx) => {
                    if (!bundleItems[idx]) return;
                    addItem({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      image: p.image,
                    });
                  });
                  navigate("/panier");
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                Ajouter les articles sélectionnés au panier
              </button>
            </div>
          </div>
        )}

        {/* Related products */}
        {alsoLike.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-[#101922] mb-6">
              Vous pourriez aussi aimer
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {alsoLike.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
