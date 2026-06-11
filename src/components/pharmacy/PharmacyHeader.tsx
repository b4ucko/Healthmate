
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PackageCheck, BadgePercent, ShoppingBag, ShieldCheck, LogIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

type WholesaleLoginFormValues = z.infer<typeof loginSchema>;

const PharmacyHeader = () => {
  const { isAuthenticated, userInfo, login } = useAuth();
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WholesaleLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onWholesaleLogin = async (data: WholesaleLoginFormValues) => {
    setIsLoading(true);

    try {
      const success = await login(data.email, data.password);

      if (success) {
        if (userInfo?.userType === 'wholesaler') {
          toast.success('Successfully signed in as wholesaler');
          setIsDialogOpen(false);
        } else {
          toast.error('This account is not registered as a wholesaler');
        }
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <div className="bg-gradient-to-r from-health-light-blue to-blue-100 dark:from-health-blue/20 dark:to-blue-900/30 p-6 rounded-2xl mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">{t('pharmacy.title')}</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">Quality medicines at affordable prices</p>
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="bg-white dark:bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-health-blue flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free Delivery
              </span>
              <span className="bg-white dark:bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-health-blue flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1" />
                Genuine Products
              </span>
              <span className="bg-white dark:bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-health-blue flex items-center">
                <BadgePercent className="h-4 w-4 mr-1" />
                Up to 20% Lower than Market Price
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {!isAuthenticated && (
              <Button
                variant="secondary"
                className="flex gap-2 items-center"
                onClick={() => setIsDialogOpen(true)}
              >
                <LogIn className="h-4 w-4" />
                {t('Pharmacy Sign In')}
              </Button>
            )}

            {isAuthenticated && userInfo?.userType === 'wholesaler' && (
              <Link to="/wholesale-dashboard">
                <Button variant="secondary" className="flex gap-2 items-center">
                  <ShoppingBag className="h-4 w-4" />
                  Wholesale Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Wholesaler Login Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>{t('Pharmacy Sign In')}</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Sign in to access wholesale prices and bulk ordering
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onWholesaleLogin)} className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">{t('Email')}</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="dark:bg-gray-700 dark:text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">{t('Password')}</Label>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        className="dark:bg-gray-700 dark:text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex sm:justify-between gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : t('Sign In')}
                </Button>
              </DialogFooter>
            </form>
          </Form>


        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PharmacyHeader;
