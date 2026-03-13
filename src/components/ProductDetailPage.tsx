import { useState, useRef } from 'react';
import { Heart, Share2, ShoppingCart, Check, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProductImage {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
}

interface ProductDetailPageProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    seller: {
      name: string;
      rating: number;
      verified: boolean;
    };
    images: ProductImage[];
    description: string;
    specifications: Record<string, string>;
    inStock: boolean;
    quantity?: number;
  };
  onAddToCart?: (quantity: number) => void;
  onBuyNow?: (quantity: number) => void;
  onAddToWishlist?: () => void;
  recommendedProducts?: any[];
}

export const ProductDetailPage = ({
  product,
  onAddToCart,
  onBuyNow,
  onAddToWishlist,
  recommendedProducts = [],
}: ProductDetailPageProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 100;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden aspect-square cursor-zoom-in"
            >
              <img
                src={product.images[selectedImageIndex]?.url}
                alt={product.images[selectedImageIndex]?.alt}
                className="w-full h-full object-cover"
              />

              {/* Zoom Effect */}
              {showZoom && (
                <div
                  className="absolute inset-0 bg-cover pointer-events-none"
                  style={{
                    backgroundImage: `url(${product.images[selectedImageIndex]?.url})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: '200%',
                  }}
                />
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg px-3 py-1">
                  -{discount}%
                </Badge>
              )}

              {/* Stock Status */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex gap-2 overflow-x-auto pb-2 scroll-smooth"
              >
                {product.images.map((image, idx) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImageIndex === idx
                        ? 'border-blue-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    )}
                  >
                    <img
                      src={image.thumbnail}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Carousel Controls */}
              {product.images.length > 5 && (
                <>
                  <button
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-slate-500 dark:text-slate-400 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  Save ₦{(product.originalPrice! - product.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Seller Info */}
            <Card className="p-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sold by</p>
                  <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {product.seller.name}
                    {product.seller.verified && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Seller Rating</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {product.seller.rating} ★
                  </p>
                </div>
              </div>
            </Card>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Specifications
              </h3>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">{key}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 border border-slate-300 dark:border-slate-600 rounded-lg text-center dark:bg-slate-800 dark:text-white"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => onAddToCart?.(quantity)}
                disabled={!product.inStock}
                variant="outline"
                className="h-12 text-base font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={() => onBuyNow?.(quantity)}
                disabled={!product.inStock}
                className="h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>

            {/* Wishlist and Share */}
            <div className="flex gap-3">
              <Button
                onClick={handleWishlist}
                variant="outline"
                className="flex-1"
              >
                <Heart
                  className={cn(
                    'w-5 h-5 mr-2',
                    isWishlisted && 'fill-red-500 text-red-500'
                  )}
                />
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>

            {/* Delivery Info */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  ✓ Free Shipping on orders over ₦5,000
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  Estimated delivery: 2-5 business days
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Product Description
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Recommended for You
              </h2>
              <Button variant="outline">View All</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-slate-900 dark:text-white line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
