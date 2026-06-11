
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/providers/ThemeProvider';

interface SearchAndFilterProps {
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const SearchAndFilter = ({ 
  searchQuery, 
  selectedCategory, 
  categories, 
  onSearchChange, 
  onCategoryChange 
}: SearchAndFilterProps) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <div className="glass-card mb-8 animate-scale-in">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('pharmacy.searchMedication')}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue outline-none dark:bg-muted dark:text-foreground"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        </div>

        <div className="relative md:w-60">
          <select
            className="w-full appearance-none px-4 py-3 rounded-lg border border-border focus:border-health-blue focus:ring-1 focus:ring-health-blue outline-none dark:bg-muted dark:text-foreground"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">{t('pharmacy.selectCategory')}</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
