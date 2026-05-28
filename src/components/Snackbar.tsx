"use client";

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useLocale } from 'next-intl';

interface SnackbarProps {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, isVisible, onClose }) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // mounted lifecycle to allow exit animation
    const [mounted, setMounted] = useState(false);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setMounted(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
            const timer = setTimeout(onClose, 6000);
            return () => clearTimeout(timer);
        } else if (mounted) {
            setShown(false);
            const unmountTimer = setTimeout(() => setMounted(false), 280);
            return () => clearTimeout(unmountTimer);
        }
    }, [isVisible, onClose, mounted]);

    if (!mounted) return null;

    const icons = {
        success: <CheckCircle className="text-white" size={20} />,
        error: <XCircle className="text-white" size={20} />,
        info: <Info className="text-white" size={20} />,
    };

    const colors = {
        success: 'bg-[#22C55E]',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div
            className="snackbar fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[300px] max-w-[90vw]"
            data-visible={shown ? 'true' : 'false'}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className={`${colors[type]} backdrop-blur-md bg-opacity-90 shadow-2xl rounded-[24px] p-4 ${isRTL ? 'pl-12 pr-4' : 'pr-12 pl-4'} flex items-center gap-3 border border-white/20`}>
                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full">
                    {icons[type]}
                </div>
                <p className={`text-white font-bold text-sm tracking-tight ${isRTL ? 'text-right' : 'text-left'}`}>{message}</p>
                <button
                    onClick={onClose}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors`}
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default Snackbar;
