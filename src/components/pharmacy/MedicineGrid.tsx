
import { useState } from 'react';
import { Medicine, CartItem } from './PharmacyData';
import MedicineCard from './MedicineCard';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface MedicineGridProps {
  medicines: Medicine[];
  cart: CartItem[];
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
  cartItemCount: number;
}

// Group medicines by category to display in sections
const groupMedicinesByCategory = (medicines: Medicine[]) => {
  const categories = {
    "Featured Products": medicines.filter(m => m.discountPercentage > 10 || m.wholesaleOnly),
    "Skincare": medicines.filter(m => m.category === 'Skincare'),
    "OTC Medicines": medicines.filter(m => m.category === 'OTC Medicines'),
    "Ayurvedic": medicines.filter(m => m.category === 'Ayurvedic'),
    "Baby Care": medicines.filter(m => m.category === 'Baby Care'),
    "Health Devices": medicines.filter(m => m.category === 'Health Devices'),
    "All Products": medicines
  };
  return categories;
};

const MedicineGrid = ({ 
  medicines, 
  cart, 
  onAddToCart, 
  onRemoveFromCart,
  onCheckout,
  cartItemCount
}: MedicineGridProps) => {
  const categories = groupMedicinesByCategory(medicines);
  
  const getItemQuantity = (id: string): number => {
    const item = cart.find(item => item.id === id);
    return item ? item.quantity : 0;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Shop by Category</h2>
        <Button 
          variant="outline" 
          className="rounded-full flex items-center"
          onClick={onCheckout}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart ({cartItemCount})
        </Button>
      </div>
      
      <Tabs defaultValue="featured" className="w-full">
      <TabsList className="mb-8 w-full flex flex-wrap h-auto gap-2 bg-transparent justify-start">
          <TabsTrigger value="featured" className="data-[state=active]:bg-health-blue data-[state=active]:text-white">
            Featured Products
          </TabsTrigger>
          <TabsTrigger value="skincare" className="data-[state=active]:bg-health-blue data-[state=active]:text-white">
            Skincare
          </TabsTrigger>
          <TabsTrigger value="otc" className="data-[state=active]:bg-health-blue data-[state=active]:text-white">
            OTC Medicines
          </TabsTrigger>
          <TabsTrigger value="ayurvedic" className="data-[state=active]:bg-health-blue data-[state=active]:text-white">
            Ayurvedic
          </TabsTrigger>
          <TabsTrigger value="baby" className="data-[state=active]:bg-health-blue data-[state=active]:text-white">
            Baby Care
          </TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-health-blue data-[state=active]:text-white">
            Health Devices
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-health-blue data-[state=active]:text-white">
            All Products
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {categories["Featured Products"].map((medicine) => (
              <MedicineCard 
                key={medicine.id}
                medicine={medicine}
                isInCart={cart.some(item => item.id === medicine.id)}
                itemQuantity={getItemQuantity(medicine.id)}
                onAddToCart={() => onAddToCart(medicine.id)}
                onRemoveFromCart={() => onRemoveFromCart(medicine.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skincare" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {categories["Skincare"].map((medicine) => (
              <MedicineCard 
                key={medicine.id}
                medicine={medicine}
                isInCart={cart.some(item => item.id === medicine.id)}
                itemQuantity={getItemQuantity(medicine.id)}
                onAddToCart={() => onAddToCart(medicine.id)}
                onRemoveFromCart={() => onRemoveFromCart(medicine.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="otc" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {categories["OTC Medicines"].map((medicine) => (
              <MedicineCard 
                key={medicine.id}
                medicine={medicine}
                isInCart={cart.some(item => item.id === medicine.id)}
                itemQuantity={getItemQuantity(medicine.id)}
                onAddToCart={() => onAddToCart(medicine.id)}
                onRemoveFromCart={() => onRemoveFromCart(medicine.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ayurvedic" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {categories["Ayurvedic"].map((medicine) => (
              <MedicineCard 
                key={medicine.id}
                medicine={medicine}
                isInCart={cart.some(item => item.id === medicine.id)}
                itemQuantity={getItemQuantity(medicine.id)}
                onAddToCart={() => onAddToCart(medicine.id)}
                onRemoveFromCart={() => onRemoveFromCart(medicine.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="baby" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {categories["Baby Care"].map((medicine) => (
              <MedicineCard 
                key={medicine.id}
                medicine={medicine}
                isInCart={cart.some(item => item.id === medicine.id)}
                itemQuantity={getItemQuantity(medicine.id)}
                onAddToCart={() => onAddToCart(medicine.id)}
                onRemoveFromCart={() => onRemoveFromCart(medicine.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {categories["Health Devices"].map((medicine) => (
              <MedicineCard 
                key={medicine.id}
                medicine={medicine}
                isInCart={cart.some(item => item.id === medicine.id)}
                itemQuantity={getItemQuantity(medicine.id)}
                onAddToCart={() => onAddToCart(medicine.id)}
                onRemoveFromCart={() => onRemoveFromCart(medicine.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {medicines.map((medicine) => (
              <MedicineCard 
                key={medicine.id}
                medicine={medicine}
                isInCart={cart.some(item => item.id === medicine.id)}
                itemQuantity={getItemQuantity(medicine.id)}
                onAddToCart={() => onAddToCart(medicine.id)}
                onRemoveFromCart={() => onRemoveFromCart(medicine.id)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicineGrid;
