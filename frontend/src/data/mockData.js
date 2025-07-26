// Mock data for animal toy store

export const categories = [
  { id: 1, name: 'Dog Toys', icon: '🐕', count: 24 },
  { id: 2, name: 'Cat Toys', icon: '🐱', count: 18 },
  { id: 3, name: 'Bird Toys', icon: '🦜', count: 12 },
  { id: 4, name: 'Small Animal', icon: '🐹', count: 15 },
  { id: 5, name: 'Aquatic Toys', icon: '🐠', count: 9 },
  { id: 6, name: 'Reptile Toys', icon: '🦎', count: 6 }
];

export const products = [
  {
    id: 1,
    name: 'Interactive Puzzle Feeder',
    category: 'Dog Toys',
    categoryId: 1,
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 124,
    description: 'Slow feeding puzzle toy that challenges your dog mentally while eating. Made from durable, food-safe materials.',
    features: ['Mental stimulation', 'Slow feeding', 'Durable plastic', 'Easy to clean'],
    healthBenefits: 'Promotes healthy eating habits and prevents bloating',
    inStock: true,
    bestSeller: true
  },
  {
    id: 2,
    name: 'Laser Pointer Pro',
    category: 'Cat Toys',
    categoryId: 2,
    price: 19.99,
    originalPrice: 24.99,
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 89,
    description: 'Automatic laser pointer with multiple patterns and timer settings. Safe LED technology.',
    features: ['Auto mode', '5 patterns', 'Timer function', 'USB rechargeable'],
    healthBenefits: 'Encourages exercise and hunting instincts',
    inStock: true,
    bestSeller: false
  },
  {
    id: 3,
    name: 'Rope Swing Perch',
    category: 'Bird Toys',
    categoryId: 3,
    price: 15.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 56,
    description: 'Natural rope swing perch for birds. Helps maintain beak and nail health.',
    features: ['Natural materials', 'Swing motion', 'Multiple sizes', 'Easy installation'],
    healthBenefits: 'Promotes foot health and natural perching behavior',
    inStock: true,
    bestSeller: false
  },
  {
    id: 4,
    name: 'Hamster Adventure Wheel',
    category: 'Small Animal',
    categoryId: 4,
    price: 34.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 143,
    description: 'Silent spinning wheel with adjustable height. Safe running surface prevents injuries.',
    features: ['Silent operation', 'Adjustable height', 'Easy cleaning', 'Safety design'],
    healthBenefits: 'Essential for exercise and prevents obesity',
    inStock: true,
    bestSeller: true
  },
  {
    id: 5,
    name: 'Floating Fish Cave',
    category: 'Aquatic Toys',
    categoryId: 5,
    price: 22.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 67,
    description: 'Decorative cave that provides hiding spots for fish. Made from aquarium-safe materials.',
    features: ['Aquarium safe', 'Natural design', 'Multiple entrances', 'Easy to clean'],
    healthBenefits: 'Reduces stress and provides natural hiding behavior',
    inStock: false,
    bestSeller: false
  },
  {
    id: 6,
    name: 'Climbing Branch Set',
    category: 'Reptile Toys',
    categoryId: 6,
    price: 27.99,
    originalPrice: 32.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
    rating: 4.4,
    reviews: 34,
    description: 'Natural wood climbing branches for reptiles. Promotes natural climbing behavior.',
    features: ['Natural wood', 'Multiple branches', 'Easy mounting', 'Various sizes'],
    healthBenefits: 'Encourages natural climbing and exploration',
    inStock: true,
    bestSeller: false
  },
  {
    id: 7,
    name: 'Squeaky Duck Collection',
    category: 'Dog Toys',
    categoryId: 1,
    price: 16.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=500&fit=crop',
    rating: 4.3,
    reviews: 91,
    description: 'Set of 3 squeaky rubber ducks in different sizes. Perfect for water play.',
    features: ['Set of 3', 'Water safe', 'Squeaky sound', 'Durable rubber'],
    healthBenefits: 'Encourages play and exercise',
    inStock: true,
    bestSeller: false
  },
  {
    id: 8,
    name: 'Feather Wand Deluxe',
    category: 'Cat Toys',
    categoryId: 2,
    price: 12.99,
    originalPrice: 18.99,
    image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 156,
    description: 'Interactive feather wand with replaceable feathers. Extends up to 3 feet.',
    features: ['Extendable wand', 'Replaceable feathers', 'Natural materials', 'Interactive play'],
    healthBenefits: 'Promotes hunting instincts and exercise',
    inStock: true,
    bestSeller: true
  }
];

export const healthArticles = [
  {
    id: 1,
    title: 'The Importance of Mental Stimulation for Dogs',
    excerpt: 'Learn why puzzle toys and interactive feeders are essential for your dog\'s mental health and how they prevent behavioral issues.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop',
    readTime: '5 min read',
    category: 'Dog Health',
    publishDate: '2025-01-15'
  },
  {
    id: 2,
    title: 'Safe Toys for Small Animals: A Complete Guide',
    excerpt: 'Discover which toys are safe for hamsters, guinea pigs, and rabbits, and learn about materials to avoid.',
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=250&fit=crop',
    readTime: '7 min read',
    category: 'Small Animal Health',
    publishDate: '2025-01-12'
  },
  {
    id: 3,
    title: 'Creating an Enriching Environment for Indoor Cats',
    excerpt: 'Tips on selecting the right toys and activities to keep your indoor cat happy, healthy, and mentally stimulated.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=250&fit=crop',
    readTime: '6 min read',
    category: 'Cat Health',
    publishDate: '2025-01-10'
  },
  {
    id: 4,
    title: 'Bird Toy Safety: What Every Owner Should Know',
    excerpt: 'Essential safety guidelines for choosing bird toys and creating a safe, engaging environment for your feathered friends.',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=250&fit=crop',
    readTime: '4 min read',
    category: 'Bird Health',
    publishDate: '2025-01-08'
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The puzzle feeder has been amazing for my dog Max! He loves the challenge and it\'s helped with his eating speed.',
    petName: 'Max (Golden Retriever)',
    verified: true
  },
  {
    id: 2,
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Excellent quality toys and fast shipping. My cats absolutely love the feather wand - it\'s their new favorite!',
    petName: 'Luna & Shadow (Maine Coons)',
    verified: true
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The hamster wheel is so quiet! My little Peanut runs on it all night without disturbing anyone.',
    petName: 'Peanut (Syrian Hamster)',
    verified: true
  }
];

export const benefits = [
  {
    icon: '🧠',
    title: 'Mental Stimulation',
    description: 'Our toys are designed to challenge your pets mentally, preventing boredom and destructive behavior.'
  },
  {
    icon: '💪',
    title: 'Physical Exercise',
    description: 'Promote healthy activity levels with toys that encourage movement and play.'
  },
  {
    icon: '❤️',
    title: 'Emotional Wellbeing',
    description: 'Reduce stress and anxiety through engaging, species-appropriate enrichment activities.'
  },
  {
    icon: '🏥',
    title: 'Health Benefits',
    description: 'Many of our toys support dental health, weight management, and natural behaviors.'
  }
];