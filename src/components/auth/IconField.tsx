
import { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Control } from 'react-hook-form';

interface IconFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  icon: LucideIcon;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
}

const IconField = ({
  control,
  name,
  label,
  placeholder,
  icon: Icon,
  type = 'text',
  autoComplete,
  disabled = false,
}: IconFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                {...field} 
                placeholder={placeholder} 
                type={type}
                className="pl-10"
                autoComplete={autoComplete}
                disabled={disabled}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IconField;
