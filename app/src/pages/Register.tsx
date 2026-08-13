import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const registerMutation = trpc.auth.register.useMutation();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({ name, email, password });
      toast.success("Account created successfully!");
      await refresh();
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to register account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join AMENTA Farm today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
              type="submit"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
