
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CartItem, Medicine } from './PharmacyData';
import { cn } from '@/lib/utils';

interface CartSidebarProps {
  cart: CartItem[];
  medicines: Medicine[];
  isOpen: boolean;
  onToggle: () => void;
  onAddToCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
}

const CartSidebar = ({
  cart,
  medicines,
  isOpen,
  onToggle,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
}: CartSidebarProps) => {
  const cartItems = cart.map(item => {
    const medicine = medicines.find(m => m.id === item.id);
    return medicine ? { ...item, medicine } : null;
  }).filter(Boolean) as (CartItem & { medicine: Medicine })[];

  const subtotal = cartItems.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const totalSavings = cartItems.reduce((sum, item) => sum + (item.medicine.marketPrice - item.medicine.price) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Floating cart button (visible when sidebar closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-4 bottom-20 z-40 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:opacity-90 transition-all"
        >
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-background border-l shadow-2xl z-50 flex flex-col transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Cart ({cartCount})</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart items */}
        <ScrollArea className="flex-1 p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add medicines to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 p-2 rounded-lg bg-muted/50">
                  <img
                    src={item.medicine.imageUrl}
                    alt={item.medicine.name}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.medicine.name}</p>
                    <p className="text-xs text-muted-foreground line-through">₹{item.medicine.marketPrice}</p>
                    <p className="text-sm font-semibold text-primary">₹{item.medicine.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onRemoveFromCart(item.id)}
                      >
                        {item.quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onAddToCart(item.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <span className="ml-auto text-sm font-semibold">
                        ₹{(item.medicine.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer with totals */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Total Savings</span>
                <span>-₹{totalSavings.toFixed(0)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={onCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onToggle} />
      )}
    </>
  );
};

export default CartSidebar;
