export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  badge?: string;
  inStock: boolean;
  status?: "pending" | "approved" | "rejected";
  description?: string;
  specs?: Record<string, string>;
  listingType?: "sale" | "rent";
  rentPeriod?: string;
}

export interface Category {
  id: string;
  name: string;
  nameAmharic: string;
  image: string;
  productCount: number;
  icon?: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  productCount: number;
  verified: boolean;
  totalSales?: number;
  joinedDate?: string;
  status?: "active" | "pending" | "blocked";
}

export interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "buyer";
  status: "active" | "blocked" | "pending";
  joinedDate: string;
  totalOrders?: number;
}

export const categories: Category[] = [
  { id: "1", name: "Coffee", nameAmharic: "ቡና", image: "/category-coffee.jpg", productCount: 245 },
  { id: "2", name: "Textiles", nameAmharic: "ጨርቃ ጨርቅ", image: "/category-textiles.jpg", productCount: 189 },
  { id: "3", name: "Spices", nameAmharic: "ቅመማ ቅመም", image: "/category-spices.jpg", productCount: 312 },
  { id: "4", name: "Fashion", nameAmharic: "ፋሽን", image: "/category-fashion.jpg", productCount: 478 },
  { id: "5", name: "Jewelry", nameAmharic: "ጌጣጌጥ", image: "/category-jewelry.jpg", productCount: 156 },
  { id: "6", name: "Home & Living", nameAmharic: "ቤት እና ኑሮ", image: "/category-textiles.jpg", productCount: 234 },
  { id: "7", name: "Electronics", nameAmharic: "ኤሌክትሮኒክስ", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80", productCount: 521 },
  { id: "8", name: "Accessories", nameAmharic: "መለዋወጫ", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", productCount: 389 },
  { id: "9", name: "Bags", nameAmharic: "ቦርሳ", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", productCount: 267 },
  { id: "10", name: "Shoes", nameAmharic: "ጫማ", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", productCount: 334 },
  { id: "11", name: "Cars", nameAmharic: "መኪና", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80", productCount: 148 },
  { id: "12", name: "Home Rent", nameAmharic: "ቤት ኪራይ", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80", productCount: 203 },
  { id: "13", name: "Home Sale", nameAmharic: "ቤት ሽያጭ", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", productCount: 176 },
  { id: "14", name: "Gifts", nameAmharic: "ስጦታ", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80", productCount: 298 },
];

export const products: Product[] = [
  // Coffee
  { id: "1", name: "Premium Yirgacheffe Coffee Beans", price: 850, originalPrice: 1200, image: "/category-coffee.jpg", images: ["/category-coffee.jpg", "/category-coffee.jpg", "/category-coffee.jpg"], category: "Coffee", rating: 4.8, reviews: 234, seller: "Abyssinia Coffee", location: "Addis Ababa", badge: "Best Seller", inStock: true, status: "approved", description: "Experience Ethiopia's finest single-origin Yirgacheffe coffee, hand-picked from high altitude farms in the Gedeo Zone.", specs: { "Weight": "500g", "Origin": "Yirgacheffe", "Process": "Washed", "Roast": "Light-Medium" } },
  { id: "6", name: "Sidamo Coffee Bundle", price: 1450, originalPrice: 1800, image: "/category-coffee.jpg", category: "Coffee", rating: 4.9, reviews: 567, seller: "Green Gold Ethiopia", location: "Sidamo", badge: "Top Rated", inStock: true, status: "approved" },
  // Fashion
  { id: "2", name: "Handwoven Habesha Kemis", price: 3500, originalPrice: 4200, image: "/category-fashion.jpg", images: ["/category-fashion.jpg", "/category-textiles.jpg", "/category-jewelry.jpg"], category: "Fashion", rating: 4.9, reviews: 189, seller: "Ethio Fashion", location: "Addis Ababa", badge: "Trending", inStock: true, status: "approved", description: "Authentic handwoven Habesha Kemis made with traditional Ethiopian cotton. Perfect for cultural ceremonies and special occasions.", specs: { "Material": "100% Cotton", "Size": "S/M/L/XL", "Color": "White with Gold Borders", "Care": "Hand wash" } },
  { id: "12", name: "Modern Ethiopian Dress", price: 2800, originalPrice: 3500, image: "/category-fashion.jpg", category: "Fashion", rating: 4.6, reviews: 234, seller: "Selam Designs", location: "Addis Ababa", inStock: true, status: "approved" },
  // Spices
  { id: "3", name: "Authentic Berbere Spice Mix", price: 320, image: "/category-spices.jpg", category: "Spices", rating: 4.7, reviews: 456, seller: "Spice Kingdom", location: "Hawassa", inStock: true, status: "approved" },
  { id: "8", name: "Organic Turmeric Powder", price: 180, originalPrice: 250, image: "/category-spices.jpg", category: "Spices", rating: 4.3, reviews: 201, seller: "Natural Ethiopia", location: "Jimma", badge: "20% Off", inStock: true, status: "approved" },
  { id: "11", name: "Wildflower Honey (1kg)", price: 650, image: "/category-spices.jpg", category: "Spices", rating: 4.9, reviews: 890, seller: "Tigray Honey", location: "Mekelle", badge: "Best Seller", inStock: true, status: "approved" },
  // Jewelry
  { id: "4", name: "Ethiopian Gold Necklace Set", price: 12500, originalPrice: 15000, image: "/category-jewelry.jpg", images: ["/category-jewelry.jpg", "/category-jewelry.jpg", "/category-jewelry.jpg"], category: "Jewelry", rating: 4.6, reviews: 78, seller: "Axum Jewelers", location: "Axum", badge: "Flash Deal", inStock: true, status: "approved", description: "Exquisite 22-karat gold necklace set inspired by ancient Aksumite designs.", specs: { "Material": "22K Gold", "Weight": "18g", "Style": "Traditional", "Certificate": "GIA Certified" } },
  { id: "10", name: "Silver Engagement Ring", price: 8900, originalPrice: 11000, image: "/category-jewelry.jpg", category: "Jewelry", rating: 4.8, reviews: 67, seller: "Lalibela Gems", location: "Lalibela", badge: "Premium", inStock: true, status: "approved" },
  // Textiles
  { id: "5", name: "Traditional Mesob Basket", price: 2800, image: "/category-textiles.jpg", category: "Home & Living", rating: 4.5, reviews: 123, seller: "Ethio Crafts", location: "Bahir Dar", inStock: true, status: "approved" },
  { id: "7", name: "Hand-Embroidered Scarf", price: 1200, image: "/category-textiles.jpg", category: "Textiles", rating: 4.4, reviews: 89, seller: "Habesha Threads", location: "Gondar", inStock: true, status: "approved" },
  // Fashion
  { id: "9", name: "Leather Messenger Bag", price: 4500, image: "/category-fashion.jpg", category: "Fashion", rating: 4.7, reviews: 145, seller: "Addis Leather", location: "Addis Ababa", inStock: true, status: "approved" },
  // Electronics
  { id: "13", name: "Samsung Galaxy A54 5G", price: 45000, originalPrice: 52000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80", "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80"], category: "Electronics", rating: 4.7, reviews: 312, seller: "TechZone Ethiopia", location: "Addis Ababa", badge: "Hot", inStock: true, status: "approved", description: "Latest Samsung Galaxy A54 with 5G connectivity, 256GB storage, and a stunning 120Hz AMOLED display.", specs: { "Display": "6.4\" AMOLED 120Hz", "Processor": "Exynos 1380", "RAM": "8GB", "Storage": "256GB", "Battery": "5000mAh", "Camera": "50MP Triple" } },
  { id: "14", name: "HP Pavilion Laptop 15.6\"", price: 85000, originalPrice: 98000, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80", category: "Electronics", rating: 4.5, reviews: 178, seller: "Computer Palace", location: "Addis Ababa", badge: "Sale", inStock: true, status: "approved", description: "High performance HP Pavilion laptop with Intel Core i7 processor, ideal for work and entertainment.", specs: { "Processor": "Intel Core i7-1255U", "RAM": "16GB DDR4", "Storage": "512GB SSD", "Display": "15.6\" FHD IPS", "Battery": "10 hours", "OS": "Windows 11" } },
  { id: "15", name: "Sony WH-1000XM5 Headphones", price: 28000, originalPrice: 35000, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", category: "Electronics", rating: 4.9, reviews: 445, seller: "Audio World ET", location: "Addis Ababa", badge: "Best Seller", inStock: true, status: "approved", specs: { "Type": "Over-ear wireless", "ANC": "Yes - Industry leading", "Battery": "30 hours", "Connectivity": "Bluetooth 5.2", "Weight": "250g" } },
  { id: "16", name: "iPad Air 5th Generation", price: 72000, originalPrice: 85000, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", category: "Electronics", rating: 4.8, reviews: 267, seller: "Apple Center Addis", location: "Addis Ababa", badge: "Trending", inStock: true, status: "approved", specs: { "Display": "10.9\" Liquid Retina", "Chip": "Apple M1", "Storage": "256GB", "Camera": "12MP Wide", "5G": "Supported" } },
  { id: "17", name: "Canon EOS R50 Mirrorless Camera", price: 95000, originalPrice: 115000, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80", category: "Electronics", rating: 4.6, reviews: 89, seller: "Photo Pro Ethiopia", location: "Addis Ababa", inStock: true, status: "pending", specs: { "Sensor": "24.2MP APS-C", "ISO": "100-32000", "Video": "4K UHD", "AF Points": "651", "Weight": "375g" } },
  // Accessories
  { id: "18", name: "iPhone 15 Leather Case", price: 1800, originalPrice: 2500, image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80", category: "Accessories", rating: 4.5, reviews: 156, seller: "Case Studio ET", location: "Addis Ababa", badge: "Popular", inStock: true, status: "approved", specs: { "Compatible": "iPhone 15 / 15 Pro", "Material": "Genuine Leather", "Protection": "MagSafe Compatible", "Colors": "Black, Brown, Tan" } },
  { id: "19", name: "Laptop Sleeve 15\" Neoprene", price: 1200, originalPrice: 1800, image: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=400&q=80", category: "Accessories", rating: 4.3, reviews: 98, seller: "TechAccessories ET", location: "Hawassa", inStock: true, status: "approved" },
  { id: "20", name: "Wireless Charging Pad 15W", price: 2200, originalPrice: 3000, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80", category: "Accessories", rating: 4.6, reviews: 234, seller: "PowerTech Ethiopia", location: "Addis Ababa", badge: "Flash Deal", inStock: true, status: "approved", specs: { "Output": "15W Max", "Compatibility": "Qi Standard", "Cable": "USB-C included", "Size": "10cm diameter" } },
  { id: "21", name: "Smart Watch Band Replacement", price: 650, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", category: "Accessories", rating: 4.2, reviews: 67, seller: "WatchWorld ET", location: "Addis Ababa", inStock: true, status: "approved" },
  // Bags
  { id: "22", name: "Leather Backpack 30L", price: 5500, originalPrice: 7200, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80"], category: "Bags", rating: 4.7, reviews: 189, seller: "Addis Leather", location: "Addis Ababa", badge: "Best Seller", inStock: true, status: "approved", description: "Premium full-grain leather backpack, handcrafted by Ethiopian artisans. Features 30L capacity with laptop compartment.", specs: { "Material": "Full-grain leather", "Capacity": "30 Liters", "Laptop Fit": "Up to 15.6\"", "Dimensions": "45x32x15cm", "Colors": "Brown, Black, Tan" } },
  { id: "23", name: "Samsonite Spinner 68cm Luggage", price: 18500, originalPrice: 24000, image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&q=80", category: "Bags", rating: 4.8, reviews: 156, seller: "Travel Gear ET", location: "Addis Ababa", badge: "Premium", inStock: true, status: "approved", specs: { "Size": "68cm Medium", "Material": "Polycarbonate", "Lock": "TSA approved", "Weight": "3.4kg", "Wheels": "4 spinner wheels" } },
  { id: "24", name: "Ethiopian Handwoven Shoulder Bag", price: 3200, image: "/category-textiles.jpg", category: "Bags", rating: 4.5, reviews: 78, seller: "Habesha Crafts", location: "Axum", inStock: true, status: "approved" },
  { id: "25", name: "Minimalist Leather Wallet", price: 1800, originalPrice: 2400, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80", category: "Bags", rating: 4.6, reviews: 234, seller: "Addis Leather", location: "Addis Ababa", badge: "Trending", inStock: true, status: "approved", specs: { "Material": "Genuine Leather", "Card Slots": "8 slots", "Bill Compartments": "2", "RFID": "Protected", "Dimensions": "11x9x1.5cm" } },
  // Shoes
  { id: "26", name: "Nike Air Max 270 React", price: 15000, originalPrice: 18500, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80"], category: "Shoes", rating: 4.7, reviews: 312, seller: "SneakerHub Ethiopia", location: "Addis Ababa", badge: "Hot", inStock: true, status: "approved", description: "The Nike Air Max 270 React combines two of Nike's most innovative cushioning technologies for superior comfort.", specs: { "Upper": "Knit & Mesh", "Cushioning": "Air Max 270 + React foam", "Outsole": "Rubber", "Sizes": "US 6-13", "Colors": "Multiple options" } },
  { id: "27", name: "Formal Oxford Leather Shoes", price: 8500, originalPrice: 11000, image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400&q=80", category: "Shoes", rating: 4.8, reviews: 145, seller: "Classic Footwear ET", location: "Addis Ababa", badge: "Premium", inStock: true, status: "approved", specs: { "Material": "Genuine leather upper", "Sole": "Leather & rubber", "Style": "Oxford", "Care": "Polish with cream" } },
  { id: "28", name: "Adidas Ultraboost 22 Running", price: 12000, originalPrice: 16000, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80", category: "Shoes", rating: 4.6, reviews: 267, seller: "SportMax Ethiopia", location: "Addis Ababa", badge: "Sale", inStock: true, status: "approved", specs: { "Technology": "Boost midsole + Primeknit", "Drop": "10mm", "Weight": "310g (UK 8.5)", "Use": "Road running" } },
  { id: "29", name: "Ethiopian Leather Sandals", price: 2200, image: "/category-fashion.jpg", category: "Shoes", rating: 4.4, reviews: 189, seller: "Ethio Footwear", location: "Bahir Dar", inStock: true, status: "approved" },
  // Cars
  { id: "30", name: "Toyota Corolla Cross 2023", price: 4200000, originalPrice: 4800000, image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80", images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80", "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80"], category: "Cars", rating: 4.8, reviews: 45, seller: "Toyota Ethiopia", location: "Addis Ababa", badge: "New", inStock: true, status: "approved", description: "Brand new 2023 Toyota Corolla Cross with hybrid engine technology. Fuel efficient and spacious SUV.", specs: { "Engine": "1.8L Hybrid", "Power": "122hp", "Fuel Economy": "4.5L/100km", "Transmission": "CVT", "Warranty": "3 years / 100,000km", "Color": "Pearl White" } },
  { id: "31", name: "Toyota Land Cruiser 200 Used 2018", price: 8500000, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80", category: "Cars", rating: 4.9, reviews: 23, seller: "Premium Cars ET", location: "Addis Ababa", badge: "Premium", inStock: true, status: "approved", specs: { "Engine": "4.6L V8", "Mileage": "87,000 km", "Year": "2018", "Condition": "Excellent", "Import": "Duty Paid" } },
  { id: "32", name: "Hyundai Elantra 2022", price: 2800000, originalPrice: 3200000, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80", category: "Cars", rating: 4.5, reviews: 67, seller: "AutoMall Ethiopia", location: "Addis Ababa", badge: "Sale", inStock: true, status: "approved", specs: { "Engine": "2.0L MPI", "Transmission": "6-speed auto", "Mileage": "Used - 34,000km", "Year": "2022", "Color": "Phantom Black" } },
  { id: "33", name: "Mercedes-Benz C200 2021", price: 6500000, image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80", category: "Cars", rating: 5.0, reviews: 12, seller: "Luxury Autos ET", location: "Addis Ababa", badge: "Luxury", inStock: true, status: "approved" },
  // Home Rent
  { id: "34", name: "Modern 3BR Apartment - Bole", price: 35000, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80"], category: "Home Rent", rating: 4.6, reviews: 34, seller: "Bole Real Estate", location: "Addis Ababa", badge: "Featured", inStock: true, status: "approved", listingType: "rent", rentPeriod: "per month", description: "Fully furnished modern 3-bedroom apartment in the heart of Bole district. 24/7 security, parking, and backup generator.", specs: { "Bedrooms": "3", "Bathrooms": "2", "Area": "185 sqm", "Floor": "7th", "Furnished": "Fully Furnished", "Parking": "2 spots included" } },
  { id: "35", name: "Studio Apartment - Kazanchis", price: 12000, image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&q=80", category: "Home Rent", rating: 4.3, reviews: 56, seller: "City Rentals ET", location: "Addis Ababa", badge: "Affordable", inStock: true, status: "approved", listingType: "rent", rentPeriod: "per month" },
  { id: "36", name: "Villa with Garden - CMC", price: 85000, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", category: "Home Rent", rating: 4.9, reviews: 18, seller: "Elite Properties ET", location: "Addis Ababa", badge: "Luxury", inStock: true, status: "approved", listingType: "rent", rentPeriod: "per month", specs: { "Bedrooms": "5", "Bathrooms": "4", "Area": "450 sqm", "Garden": "500 sqm", "Pool": "Private pool" } },
  { id: "37", name: "Vacation Rental - Bahir Dar", price: 8500, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", category: "Home Rent", rating: 4.7, reviews: 89, seller: "Lake View Properties", location: "Bahir Dar", badge: "Vacation", inStock: true, status: "approved", listingType: "rent", rentPeriod: "per night" },
  // Home Sale
  { id: "38", name: "G+2 House with Compound - Gerji", price: 8500000, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80"], category: "Home Sale", rating: 4.8, reviews: 12, seller: "Gerji Real Estate", location: "Addis Ababa", badge: "Hot Deal", inStock: true, status: "approved", listingType: "sale", description: "Beautifully designed G+2 residential house with large compound. Premium location in Gerji with all utilities.", specs: { "Bedrooms": "6", "Bathrooms": "4", "Land Area": "400 sqm", "Built Area": "280 sqm", "Age": "3 years", "Title Deed": "Clear title" } },
  { id: "39", name: "2BR Condominium - Addis Ketema", price: 2800000, originalPrice: 3200000, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80", category: "Home Sale", rating: 4.5, reviews: 28, seller: "Condo Sales ET", location: "Addis Ababa", badge: "Sale", inStock: true, status: "approved", listingType: "sale", specs: { "Bedrooms": "2", "Bathrooms": "1", "Area": "95 sqm", "Floor": "3rd", "Type": "IHDP Condominium" } },
  { id: "40", name: "Commercial Land 500sqm - Megenagna", price: 15000000, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80", category: "Home Sale", rating: 4.7, reviews: 8, seller: "Land Broker ET", location: "Addis Ababa", badge: "Investment", inStock: true, status: "pending", listingType: "sale", specs: { "Area": "500 sqm", "Zone": "Commercial", "Access": "Main road frontage", "Title": "Certificate of Title", "Utilities": "All connected" } },
  // Gifts
  { id: "41", name: "Personalized Ethiopian Coffee Gift Set", price: 2800, originalPrice: 3500, image: "/category-coffee.jpg", images: ["/category-coffee.jpg", "/category-spices.jpg", "/category-textiles.jpg"], category: "Gifts", rating: 4.9, reviews: 234, seller: "Gojo Gifts", location: "Addis Ababa", badge: "Best Seller", inStock: true, status: "approved", description: "Premium coffee gift set featuring Yirgacheffe, Sidamo, and Harrar beans with personalized wooden box engraving.", specs: { "Contents": "3 x 200g premium coffees", "Box": "Personalized wooden box", "Extras": "Traditional jebena & mugs", "Delivery": "Gift wrapped" } },
  { id: "42", name: "Luxury Ethiopian Hamper", price: 8500, originalPrice: 10000, image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&q=80", category: "Gifts", rating: 4.8, reviews: 145, seller: "Luxury Gifts ET", location: "Addis Ababa", badge: "Premium", inStock: true, status: "approved", specs: { "Contents": "Coffee, Honey, Spices, Handicrafts", "Basket": "Handwoven Ethiopian", "Presentation": "Luxury gift wrapping" } },
  { id: "43", name: "Corporate Gift Box - 10 Pack", price: 45000, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80", category: "Gifts", rating: 4.7, reviews: 67, seller: "Corporate Gifts ET", location: "Addis Ababa", badge: "Bulk Deal", inStock: true, status: "approved" },
  { id: "44", name: "Birthday Occasion Gift Basket", price: 3200, originalPrice: 4000, image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80", category: "Gifts", rating: 4.5, reviews: 189, seller: "Gojo Gifts", location: "Addis Ababa", badge: "Trending", inStock: true, status: "approved" },
];

export const sellers: Seller[] = [
  { id: "1", name: "Abyssinia Coffee", avatar: "AC", location: "Addis Ababa", rating: 4.8, productCount: 45, verified: true, totalSales: 2340, joinedDate: "2023-01-15", status: "active" },
  { id: "2", name: "Ethio Fashion House", avatar: "EF", location: "Addis Ababa", rating: 4.9, productCount: 120, verified: true, totalSales: 8900, joinedDate: "2022-11-08", status: "active" },
  { id: "3", name: "Spice Kingdom", avatar: "SK", location: "Hawassa", rating: 4.7, productCount: 67, verified: true, totalSales: 5670, joinedDate: "2023-03-20", status: "active" },
  { id: "4", name: "Axum Jewelers", avatar: "AJ", location: "Axum", rating: 4.6, productCount: 34, verified: true, totalSales: 1890, joinedDate: "2023-06-12", status: "active" },
  { id: "5", name: "Green Gold Ethiopia", avatar: "GG", location: "Sidamo", rating: 4.9, productCount: 28, verified: true, totalSales: 4560, joinedDate: "2022-09-30", status: "active" },
  { id: "6", name: "Habesha Threads", avatar: "HT", location: "Gondar", rating: 4.5, productCount: 89, verified: false, totalSales: 2100, joinedDate: "2024-01-05", status: "active" },
  { id: "7", name: "TechZone Ethiopia", avatar: "TZ", location: "Addis Ababa", rating: 4.6, productCount: 156, verified: true, totalSales: 12300, joinedDate: "2023-05-18", status: "active" },
  { id: "8", name: "Bole Real Estate", avatar: "BR", location: "Addis Ababa", rating: 4.7, productCount: 23, verified: true, totalSales: 45, joinedDate: "2023-08-22", status: "active" },
  { id: "9", name: "Ethiopian Crafts Co.", avatar: "EC", location: "Dire Dawa", rating: 4.2, productCount: 0, verified: false, totalSales: 0, joinedDate: "2026-03-11", status: "pending" },
  { id: "10", name: "Awash Textiles", avatar: "AT", location: "Awash", rating: 0, productCount: 0, verified: false, totalSales: 0, joinedDate: "2026-03-10", status: "pending" },
];

export const reviews: Review[] = [
  { id: "1", userName: "Hanna T.", avatar: "HT", rating: 5, comment: "Amazing quality coffee! The aroma is incredible and it arrived so quickly. Gojo makes shopping local so easy.", date: "2026-03-01", location: "Addis Ababa" },
  { id: "2", userName: "Dawit M.", avatar: "DM", rating: 5, comment: "The habesha kemis I ordered is absolutely beautiful. The craftsmanship is outstanding. My wife loved it!", date: "2026-02-28", location: "Hawassa" },
  { id: "3", userName: "Sara A.", avatar: "SA", rating: 4, comment: "Great selection of spices. Delivery was fast and everything was well-packaged. Will definitely order again.", date: "2026-02-25", location: "Bahir Dar" },
  { id: "4", userName: "Yonas K.", avatar: "YK", rating: 5, comment: "Found unique handmade jewelry that I couldn't find anywhere else. Gojo is changing Ethiopian e-commerce!", date: "2026-02-20", location: "Mekelle" },
];

export const adminUsers: AdminUser[] = [
  { id: "1", name: "Abebe Girma", email: "abebe@gojo.et", role: "admin", status: "active", joinedDate: "2023-01-01", totalOrders: 0 },
  { id: "2", name: "Hanna Bekele", email: "hanna.b@gmail.com", role: "buyer", status: "active", joinedDate: "2024-02-15", totalOrders: 23 },
  { id: "3", name: "Dawit Tesfaye", email: "dawit.t@yahoo.com", role: "buyer", status: "active", joinedDate: "2024-03-20", totalOrders: 45 },
  { id: "4", name: "Selam Woldemariam", email: "selam@ethiofashion.com", role: "seller", status: "active", joinedDate: "2023-06-12", totalOrders: 0 },
  { id: "5", name: "Meron Alemu", email: "meron.a@gmail.com", role: "buyer", status: "blocked", joinedDate: "2024-01-08", totalOrders: 3 },
  { id: "6", name: "Tigist Haile", email: "tigist.h@outlook.com", role: "buyer", status: "active", joinedDate: "2025-11-30", totalOrders: 12 },
  { id: "7", name: "Kebede Lemma", email: "kebede@spicekingdom.com", role: "seller", status: "active", joinedDate: "2023-03-20", totalOrders: 0 },
  { id: "8", name: "Feven Tadesse", email: "feven.t@gmail.com", role: "buyer", status: "active", joinedDate: "2025-09-14", totalOrders: 7 },
];

export const flashDeals = products.filter(p => p.originalPrice).slice(0, 4);
export const bestSellers = products.filter(p => p.badge === "Best Seller" || p.badge === "Top Rated");
export const trendingProducts = products.filter(p => p.badge === "Trending" || p.rating >= 4.7).slice(0, 6);

export const ethiopianCities = [
  "Addis Ababa", "Hawassa", "Bahir Dar", "Mekelle", "Gondar",
  "Dire Dawa", "Jimma", "Axum", "Lalibela", "Harar", "Sidamo",
];

export const popularSearches = [
  "Coffee beans", "Habesha dress", "Gold jewelry", "Laptop", "iPhone", "Nike shoes",
  "Apartment Bole", "Traditional basket", "Berbere spice", "Leather bag",
];
