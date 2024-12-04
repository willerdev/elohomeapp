export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  location: string;
  date: string;
  category: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max',
    price: 3999,
    description: 'Perfect condition, 1 year old. Comes with original charger and box. 256GB storage, Pacific Blue color.',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5',
    location: 'Dubai Marina',
    date: '2d ago',
    category: 'smartphone'
  },
  {
    id: '2',
    title: 'MacBook Pro 16"',
    price: 6999,
    description: 'M1 Pro, 16GB RAM, 512GB SSD. Like new condition with AppleCare+',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4',
    location: 'Downtown Dubai',
    date: '5d ago',
    category: 'electronics'
  },
  {
    id: '3',
    title: 'PlayStation 5',
    price: 1999,
    description: 'Digital Edition, includes 2 controllers and 3 games',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db',
    location: 'JLT',
    date: '1w ago',
    category: 'gaming'
  }
];