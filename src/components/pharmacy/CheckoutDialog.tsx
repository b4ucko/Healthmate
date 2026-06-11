
import React, { useState } from 'react';
import { X, CreditCard, Truck, CalendarClock, Store, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CartItem, medicines } from './PharmacyData';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createOrder } from '@/lib/database/mongodb/services';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  medicines: any[];
  onRemoveFromCart: (id: string) => void;
  onCompleteOrder: () => void;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
  cart,
  medicines,
  onRemoveFromCart,
  onCompleteOrder,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [deliveryMethod, setDeliveryMethod] = useState('home-delivery');
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated, userInfo } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return null;
  }

  const cartItems = cart.map(cartItem => {
    const medicine = medicines.find(med => med.id === cartItem.id);
    return {
      ...medicine,
      quantity: cartItem.quantity,
      totalPrice: (medicine?.price || 0) * cartItem.quantity,
    };
  });

  const subtotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const shipping = 49;
  const grandTotal = subtotal + shipping;

  const isWholesaleOrder = userInfo?.userType === 'wholesaler';
  
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your purchase");
      navigate('/sign-in');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderData = {
        userId: userInfo?.id,
        userName: userInfo?.name,
        userType: userInfo?.userType,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.totalPrice
        })),
        totalAmount: grandTotal,
        shippingAddress: "Default Address", // In a real app, this would be from the user's profile
        paymentMethod,
        deliveryMethod,
        isWholesale: isWholesaleOrder,
      };
      
      // Create the order
      await createOrder(orderData);
      
      toast.success(
        isWholesaleOrder 
          ? "Wholesale order placed successfully!" 
          : "Your order has been placed successfully!"
      );
      
      // Close dialog and clear cart
      onCompleteOrder();
      
      // Redirect to the appropriate dashboard
      setTimeout(() => {
        if (isWholesaleOrder) {
          navigate('/wholesale-dashboard');
        } else if (userInfo?.userType === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      }, 1500);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("There was a problem placing your order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-3 max-h-[200px] overflow-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>₹{item.price} × {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">₹{item.totalPrice}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onRemoveFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div>
            <h3 className="font-medium mb-3">Payment Method</h3>
            <RadioGroup defaultValue="cash" value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="cash" id="payment-cash" />
                <Label htmlFor="payment-cash" className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Cash on Delivery
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="card" id="payment-card" />
                <Label htmlFor="payment-card" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upi" id="payment-upi" />
                <Label htmlFor="payment-upi" className="flex items-center">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 9L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 13H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  UPI
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Delivery Method */}
          <div>
            <h3 className="font-medium mb-3">Delivery Method</h3>
            <RadioGroup defaultValue="home-delivery" value={deliveryMethod} onValueChange={setDeliveryMethod}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="home-delivery" id="delivery-home" />
                <Label htmlFor="delivery-home" className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Home Delivery
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="express" id="delivery-express" />
                <Label htmlFor="delivery-express" className="flex items-center">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Express Delivery (+ ₹50)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="store-pickup" id="delivery-store" />
                <Label htmlFor="delivery-store" className="flex items-center">
                  <Store className="h-4 w-4 mr-2" />
                  Store Pickup
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <Button 
            className="w-full" 
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
