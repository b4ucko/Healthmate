
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail, User, Calendar, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import IconField from './IconField';
import PasswordInput from './PasswordInput';
import { signUpSchema, type FormValues } from '@/lib/auth/validation';
import { useAuth } from '@/contexts/AuthContext';

import * as mysqlService from '@/lib/database/mysql/queries';
import * as mongoService from '@/lib/database/mongodb/services';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'patient',
      termsAccepted: false,
      age: '',
      gender: '',
      phone: '',
      address: '',
    },
  });

  const userType = 'patient';

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      const success = await signup({
        name: values.name,
        email: values.email,
        password: values.password,
        userType: 'patient',
        age: values.age,
        gender: values.gender,
        phone: values.phone,
        address: values.address
      });

      if (success) {
        try {
          await mysqlService.createUser({
            name: values.name,
            email: values.email,
            password: values.password,
            userType: 'patient'
          });

          await mongoService.createUser({
            name: values.name,
            email: values.email,
            password: values.password,
            userType: 'patient'
          });

          console.log('User data saved to both databases');
        } catch (dbError) {
          console.error('Database save error:', dbError);
        }

        toast.success('Account created successfully!');
        navigate('/patient-dashboard');
      } else {
        toast.error('This email is already registered. Please try another one.');
      }
    } catch (error) {
      toast.error('Failed to create account. Please try again later.');
      console.error('Sign-up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">


        <IconField
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          icon={User}
          autoComplete="name"
          disabled={isLoading}
        />

        <IconField
          control={form.control}
          name="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          icon={Mail}
          autoComplete="email"
          disabled={isLoading}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter age (1-100)"
                    min={1}
                    max={100}
                    step={1}
                    className="pl-10"
                    disabled={isLoading}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "") {
                        field.onChange("");
                        return;
                      }

                      const num = Number(value);

                      if (num >= 1 && num <= 100) {
                        field.onChange(num);
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="flex items-center">
                    <UserRound className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter 10 digit phone number"
                  type="tel"
                  maxLength={10}
                  disabled={isLoading}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // remove non-numbers

                    if (value.length <= 10) {
                      field.onChange(value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Address"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        <PasswordInput
          control={form.control}
          name="password"
          label="Password"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <PasswordInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm cursor-pointer">
                  I agree to the <Link to="/terms" className="text-health-blue hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-health-blue hover:underline">Privacy Policy</Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
