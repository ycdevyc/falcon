"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DriverLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/driver/rides");
  }

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <Card className="p-6 w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold">
            Driver Login
          </h1>

          <p className="text-sm text-muted-foreground">
            Sign in to submit proposals.
          </p>
        </div>

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className="w-full"
          disabled={loading}
          onClick={login}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Card>
    </div>
  );
}