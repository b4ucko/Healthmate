
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Heart, UserCircle, Bell, Droplet, Baby, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import LanguageSwitcher from '../language/LanguageSwitcher';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userInfo, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    toast.success('Successfully signed out!');
    navigate('/');
  };

  const getDashboardPath = () => {
    if (userInfo?.userType === 'doctor') return '/doctor-dashboard';
    if (userInfo?.userType === 'wholesaler') return '/wholesale-dashboard';
    return '/patient-dashboard';
  };

  const mainNavLinks = [
    { name: t('common.home'), path: '/' },
    { name: t('common.doctors'), path: '/doctors' },
    { name: t('common.emergency'), path: '/emergency' },
    { name: t('common.pharmacy'), path: '/pharmacy' },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: getDashboardPath() }] : []),
  ];

  const specializedServices = [
    { 
      name: t('common.bloodBank'), 
      path: '/blood-bank',
      icon: <Droplet className="mr-2 h-4 w-4 text-health-red" />,
      description: t('common.findDoctor')
    },
    { 
      name: t('common.bloodDonation'), 
      path: '/blood-donation',
      icon: <Droplet className="mr-2 h-4 w-4 text-health-red" />,
      description: t('common.bloodDonation')
    },
    { 
      name: t('common.pregnancyCare'), 
      path: '/pregnancy-care',
      icon: <Baby className="mr-2 h-4 w-4 text-health-blue" />,
      description: t('common.pregnancyCare')
    },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 dark:bg-background/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="HealthMate Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold">HealthMate</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {mainNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  isActive
                    ? 'text-health-blue bg-health-light-blue dark:bg-health-blue/20'
                    : 'text-foreground/80 hover:text-health-blue hover:bg-health-light-blue/50 dark:hover:bg-health-blue/10'
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
          
          {/* Specialized Services Dropdown */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2 rounded-full text-sm font-medium transition-all text-foreground/80 hover:text-health-blue hover:bg-health-light-blue/50 dark:hover:bg-health-blue/10">
                  {t('common.specializedServices')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[320px] md:w-[400px]">
                    {specializedServices.map((service) => (
                      <li key={service.path}>
                        <NavigationMenuLink asChild>
                          <NavLink
                            to={service.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center">
                              {service.icon}
                              <div className="text-sm font-medium leading-none">{service.name}</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {service.description}
                            </p>
                          </NavLink>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* User actions */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <LanguageSwitcher variant="ghost" showText={false} />
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <UserCircle className="w-6 h-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{userInfo?.name}</span>
                    <span className="text-xs text-muted-foreground">{userInfo?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/user-profile')}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  {t('common.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <NavLink to="/sign-in">
                <Button variant="outline" className="rounded-full border-health-blue text-health-blue hover:bg-health-light-blue dark:border-health-blue/50 dark:hover:bg-health-blue/20 mr-2">
                  {t('common.signin')}
                </Button>
              </NavLink>
              <NavLink to="/sign-up">
                <Button className="rounded-full bg-health-blue hover:bg-health-blue/90 shadow-md">
                  {t('common.signup')}
                </Button>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher variant="ghost" showText={false} />
          <button
            className="p-2 rounded-full bg-white/80 dark:bg-background/80 shadow-sm"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-white/90 dark:bg-background/90 backdrop-blur-md shadow-md animate-slide-down">
          <nav className="flex flex-col space-y-2">
            {mainNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'text-health-blue bg-health-light-blue dark:bg-health-blue/20'
                      : 'text-foreground/80 hover:text-health-blue hover:bg-health-light-blue/50 dark:hover:bg-health-blue/10'
                  )
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Specialized Services for mobile */}
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase">
                {t('common.specializedServices')}
              </p>
              {specializedServices.map((service) => (
                <NavLink
                  key={service.path}
                  to={service.path}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center',
                      isActive
                        ? 'text-health-blue bg-health-light-blue dark:bg-health-blue/20'
                        : 'text-foreground/80 hover:text-health-blue hover:bg-health-light-blue/50 dark:hover:bg-health-blue/10'
                    )
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {service.icon}
                  {service.name}
                </NavLink>
              ))}
            </div>
            
            <div className="flex flex-col space-y-2 mt-2">
              {isAuthenticated ? (
                <>
                  <NavLink 
                    to="/user-profile" 
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    {t('common.profile')}
                  </NavLink>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start" 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full border-health-blue text-health-blue hover:bg-health-light-blue dark:border-health-blue/50 dark:hover:bg-health-blue/20">
                      {t('common.signin')}
                    </Button>
                  </NavLink>
                  <NavLink to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full rounded-full bg-health-blue hover:bg-health-blue/90 shadow-md">
                      {t('common.signup')}
                    </Button>
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
