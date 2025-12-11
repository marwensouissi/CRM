import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Define global interface to avoid TS errors
declare global {
    interface Window {
        Pusher: any;
        Echo: any;
    }
}

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}

const createEcho = () => {
    if (typeof window === 'undefined') return null;

    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;

    if (!key) {
        console.warn('NEXT_PUBLIC_PUSHER_APP_KEY is not set. Real-time features will be disabled.');
        return null;
    }

    return new Echo({
        broadcaster: 'pusher',
        key: key,
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'mt1',
        forceTLS: true,
    });
};

export const echo = createEcho();
