import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id?: string | number;
  image: string;
  name: string;
  category?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  badgeColor?: string;
}

export default function ProductCard({
  id = "1",
  image,
  name,
  category,
  price,
  originalPrice,
  rating = 4.5,
  reviews,
  badge,
  badgeColor = "bg-[#137fec]",
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <Link to={`/produit/${id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative overflow-hidden bg-[#f6f7f8] aspect-square">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          {badge && (
            <span className={`absolute top-3 left-3 ${badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
              {badge}
            </span>
          )}
          {discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}

          {/* Wishlist btn */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 bg-[#137fec] hover:bg-[#0a6fd4] text-white text-xs font-semibold py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5"
          >
            {addedToCart ? (
              "✓ Ajouté !"
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Ajouter au panier
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {category && (
            <p className="text-xs text-[#137fec] font-medium uppercase tracking-wide mb-1">
              {category}
            </p>
          )}
          <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 mb-2 group-hover:text-[#137fec] transition-colors">
            {name}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.floor(rating)
                      ? "fill-amber-400 text-amber-400"
                      : star - 0.5 <= rating
                      ? "fill-amber-200 text-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            {reviews && <span className="text-xs text-gray-400">({reviews})</span>}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900">
              {price.toLocaleString("fr-FR")} GNF
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {originalPrice.toLocaleString("fr-FR")} GNF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
