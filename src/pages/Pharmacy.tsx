import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PharmacyHeader from '@/components/pharmacy/PharmacyHeader';
import SearchAndFilter from '@/components/pharmacy/SearchAndFilter';
import MedicineGrid from '@/components/pharmacy/MedicineGrid';
import CheckoutDialog from '@/components/pharmacy/CheckoutDialog';
import { categories, medicines, CartItem } from '@/components/pharmacy/PharmacyData';
import CartSidebar from '@/components/pharmacy/CartSidebar';
import PrescriptionScanner from '@/components/pharmacy/PrescriptionScanner';

const Pharmacy = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated, userInfo } = useAuth();
  const { t } = useLanguage();

  const isWholesaleDealer = userInfo?.userType === 'wholesaler';

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' ||
      medicine.category === selectedCategory;
    const isVisibleToUser = !medicine.wholesaleOnly || (medicine.wholesaleOnly && isWholesaleDealer);
    return matchesSearch && matchesCategory && isVisibleToUser;
  });

  const addToCart = (id: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        toast.success("Item added to cart");
        return [...prevCart, { id, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        toast.info("Item removed from cart");
        return prevCart.filter(item => item.id !== id);
      }
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setCheckoutOpen(true);
  };

  const completeOrder = () => {
    toast.success("Your order has been placed successfully!");
    setCheckoutOpen(false);
    setCart([]);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout>
      <main>
        <section className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <PharmacyHeader />

            {/* Prescription Scanner */}
            <div className="mb-6 flex gap-3 items-center">
              <PrescriptionScanner onAddMedicationToCart={addToCart} />
              <span className="text-sm text-muted-foreground">Upload a prescription to scan and add medicines directly to your cart</span>
            </div>

            <div className="mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {isWholesaleDealer
                    ? t('pharmacy.medicationsWholesale')
                    : t('pharmacy.medications')}
                </h2>
                {!isWholesaleDealer && (
                  <p className="text-muted-foreground mt-1">
                    {t('pharmacy.saveUpTo')}
                  </p>
                )}
              </div>
            </div>

            <SearchAndFilter
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              categories={categories}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
            />

            <MedicineGrid
              medicines={filteredMedicines}
              cart={cart}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onCheckout={handleCheckout}
              cartItemCount={cartItemCount}
            />
          </div>
        </section>

        <CheckoutDialog
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          cart={cart}
          medicines={medicines}
          onRemoveFromCart={removeFromCart}
          onCompleteOrder={completeOrder}
        />

        <CartSidebar
          cart={cart}
          medicines={medicines}
          isOpen={cartOpen}
          onToggle={() => setCartOpen(!cartOpen)}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onCheckout={handleCheckout}
        />
      </main>
    </Layout>
  );
};

export default Pharmacy;
