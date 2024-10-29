import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-zinc-900 to-black text-white">
            <div className="max-w-md text-center">
                <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
                <p className="text-zinc-400 mb-8">
                    There was an error during the authentication process. Please try again.
                </p>
                <Button asChild>
                    <Link href="/">
                        Return Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}