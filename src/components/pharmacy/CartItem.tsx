
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    totalPrice: number;
  };
  onRemoveFromCart: (id: string) => void;
}

const CartItem = ({ item, onRemoveFromCart }: CartItemProps) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded bg-white overflow-hidden">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">₹{item.price} × {item.quantity}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">₹{(item.totalPrice || 0).toFixed(2)}</span>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onRemoveFromCart(item.id)}
        >
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
