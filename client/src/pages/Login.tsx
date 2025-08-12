import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { LogIn, UserCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return apiRequest("/api/auth/login", "POST", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome Back!",
        description: `Successfully signed in. Welcome to CornexConnect.`,
      });
      
      // Invalidate auth query to refresh user state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Log successful login
      apiRequest("/api/auth/audit", "POST", {
        action: "login",
        details: "Successful login to CornexConnect platform",
      });

      // Redirect to dashboard
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      
      // Log failed login attempt
      apiRequest("/api/auth/audit", "POST", {
        action: "login_failed",
        details: `Failed login attempt for email: ${form.getValues("email")}`,
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/90 border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your CornexConnect account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email address" 
                          {...field} 
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <UserCheck className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-emerald-800">Secure Authentication</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    All login activities are monitored and logged for security purposes.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500"
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setLocation("/register")} 
                    className="text-emerald-600 hover:underline font-medium"
                  >
                    Register here
                  </button>
                </p>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setLocation("/")} 
                  className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}