"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function LoginButton() {
    const { toast } = useToast();

    const handleSignIn = async () => {
        try {
            await signIn("google", { 
                callbackUrl: "/dashboard",
                redirect: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to sign in. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Button
            onClick={handleSignIn}
            className="bg-white text-black hover:bg-zinc-200"
        >
            Sign in with Google
        </Button>
    );
}

export function LogoutButton() {
    const { toast } = useToast();

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to sign out. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-900"
        >
            Sign Out
        </Button>
    );
}