'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-6 py-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                        O
                    </div>
                    <span className="text-xl font-bold text-gray-900">Odoo IMS</span>
                </div>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button>Sign Up</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-white to-gray-50">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
                    Manage Your Inventory <br />
                    <span className="text-primary">With Precision</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mb-10">
                    Streamline your stock operations, track movements in real-time, and optimize your warehouse efficiency with our modern Inventory Management System.
                </p>
                <div className="flex gap-4">
                    <Link href="/signup">
                        <Button size="lg" className="text-lg px-8">Get Started</Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="text-lg px-8">Live Demo</Button>
                    </Link>
                </div>
            </main>

            <footer className="py-6 text-center text-gray-500 text-sm border-t">
                © 2025 Odoo IMS. All rights reserved.
            </footer>
        </div>
    );
}
