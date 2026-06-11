
import { ShoppingCart, MinusCircle, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Medicine } from './PharmacyData';
import { cn } from '@/lib/utils';

interface MedicineCardProps {
  medicine: Medicine;
  isInCart: boolean;
  itemQuantity?: number;
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
}

const MedicineCard = ({
  medicine,
  isInCart,
  itemQuantity = 0,
  onAddToCart,
  onRemoveFromCart
}: MedicineCardProps) => {
  const { isAuthenticated, userInfo } = useAuth();
  const isWholesaleDealer = userInfo?.userType === 'wholesaler';
  
  // Only show wholesale-only products to wholesale dealers
  if (medicine.wholesaleOnly && !isWholesaleDealer) {
    return null;
  }

  return (
    <div className={cn(
      "bg-card text-card-foreground rounded-xl border shadow-sm transition-all hover:shadow-md overflow-hidden h-full flex flex-col",
      !medicine.inStock && "opacity-60"
    )}>
      <div className="relative h-48">
        <img 
          src={medicine.imageUrl} 
          alt={medicine.name}
          className="w-full h-full object-cover"
        />
        
        {!medicine.inStock && (
          <div className="absolute inset-0 bg-white/80 dark:bg-black/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
          </div>
        )}
        
        {medicine.ayurvedic && (
          <Badge className="absolute top-2 left-2 bg-green-600">Ayurvedic</Badge>
        )}

        {medicine.discountPercentage > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-600">{medicine.discountPercentage}% OFF</Badge>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1">{medicine.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{medicine.description}</p>
        
        <div className="mt-auto flex justify-between items-end">
          <div>
            {isWholesaleDealer && medicine.wholesalePrice ? (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-health-blue">₹{medicine.wholesalePrice}</span>
                <span className="text-xs line-through text-muted-foreground">MRP: ₹{medicine.marketPrice}</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-lg font-bold text-health-blue">₹{medicine.price}</span>
                <span className="text-xs line-through text-muted-foreground">MRP: ₹{medicine.marketPrice}</span>
                <span className="text-xs text-green-600">Save ₹{medicine.marketPrice - medicine.price}</span>
              </div>
            )}
          </div>
          
          {medicine.inStock ? (
            isInCart ? (
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onRemoveFromCart(medicine.id)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="mx-3">{itemQuantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onAddToCart(medicine.id)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => onAddToCart(medicine.id)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add
              </Button>
            )
          ) : (
            <Button disabled variant="outline">
              Out of Stock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
