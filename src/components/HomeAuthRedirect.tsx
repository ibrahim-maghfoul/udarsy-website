'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function HomeAuthRedirect() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading || !user) return;
        const dest =
            user.role === 'teacher'
                ? '/teacher/dashboard'
                : user.role === 'instructor'
                    ? '/instructor-dashboard'
                    : '/courses';
        router.replace(dest);
    }, [user, loading, router]);

    return null;
}