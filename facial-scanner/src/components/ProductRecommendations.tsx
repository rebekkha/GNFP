import { motion } from 'motion/react';
import { ShoppingBag, Star, Info, Sparkles } from 'lucide-react';
import { SkinType, Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Royal Glow Elixir',
    description: 'A deeply hydrating serum infused with 24k gold flakes and rose essence.',
    benefit: 'Restores natural radiance and elasticity.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    suitableFor: ['Dry', 'Normal'],
  },
  {
    id: '2',
    name: 'Emerald Detox Mask',
    description: 'Bentonite clay and matcha tea extract for deep pore cleansing.',
    benefit: 'Eliminates excess oil and prevents breakouts.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400',
    suitableFor: ['Oily', 'Combination'],
  },
  {
    id: '3',
    name: 'HydraBoost Pearl Mist',
    description: 'Cooling mist with pearl extracts and botanical hyaluronic acid.',
    benefit: 'Instant hydration and soothing for sensitive areas.',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400',
    suitableFor: ['Dry', 'Normal', 'Combination'],
  },
];

interface ProductRecommendationsProps {
  skinType: SkinType;
}

export default function ProductRecommendations({ skinType }: ProductRecommendationsProps) {
  const recommendations = MOCK_PRODUCTS.filter(p => p.suitableFor.includes(skinType));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto mt-12 pb-24 px-4"
    >
      <div className="glass p-12 rounded-[3rem] mb-16 relative overflow-hidden border border-white/10">
        <h2 className="text-5xl font-display font-medium text-white italic mb-4">
          Skin Classification: <span className="text-[#E5A9B4]">{skinType}</span>
        </h2>
        <p className="max-w-2xl text-white/70 font-light">
          Your diagnostic signature indicates custom curation parameters are needed. Explore the matched formulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recommendations.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-[#E5A9B4]/50 transition-all duration-500"
          >
            <div className="relative h-72 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-white/60 text-sm mb-4">{product.description}</p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-3 text-xs text-white/90">
                <Info className="w-4 h-4 text-[#E5A9B4] shrink-0 mt-0.5" />
                <span>{product.benefit}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}