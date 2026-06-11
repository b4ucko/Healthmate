
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUp = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center py-16 px-4 md:px-6 min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
            <p className="text-muted-foreground">Sign up to get started with HealthMate</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-border">
            <SignUpForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/sign-in" className="font-medium text-health-blue hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
