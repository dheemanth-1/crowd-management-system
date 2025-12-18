// app/login/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useRouter } from 'next/navigation';
import {useLogin} from "@/lib/hooks/userAuth";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const loginMutation = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };


    return (
        <div className="min-h-screen w-full relative flex items-center justify-between px-12">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/background.jpg')",
                    filter: 'brightness(0.7)',
                }}
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 z-0 bg-black/30" />

            {/* Left Side - Welcome Text */}
            <div className="relative z-10 flex-1 text-white ml-28">
                <h3 className="text-4xl font-bold mb-4">Welcome to the </h3>
                <h3 className="text-4xl font-bold mb-4">Crowd Management System </h3>
            </div>

            {/* Right Side - Login Card */}
            <div className="relative z-10 w-full max-w-md mr-28">
                <Card className="border-emerald-600/20 shadow-2xl bg-white/95 backdrop-blur">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl font-bold text-center">kloudspot</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Log in<span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password<span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            {loginMutation.isError && (
                                <div className="text-sm text-red-500 text-center">
                                    {loginMutation.error?.message || 'Login failed. Please try again.'}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

