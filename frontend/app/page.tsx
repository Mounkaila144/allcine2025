import { LoginForm } from '@/components/auth/login-form';

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <LoginForm />
        </div>
    );
}
