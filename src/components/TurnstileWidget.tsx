"use client";

import { forwardRef } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
    ({ onSuccess, onError, onExpire }, ref) => {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;

        return (
            <Turnstile
                ref={ref}
                siteKey={siteKey}
                onSuccess={onSuccess}
                onError={onError}
                onExpire={onExpire}
                options={{ theme: 'light', size: 'normal' }}
            />
        );
    }
);

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;

export async function verifyTurnstileToken(token: string): Promise<boolean> {
    try {
        const res = await fetch('/api/verify-turnstile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();
        return data.success === true;
    } catch {
        return false;
    }
}
