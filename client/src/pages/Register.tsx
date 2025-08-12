import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { UserPlus, Shield, CheckCircle } from "lucide-react";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyRegistration: z.string().optional(),
  phone: z.string().min(10, "Please enter a valid phone number"),
  role: z.enum(["admin", "manager", "user"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [step, setStep] = useState(1);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      companyName: "",
      companyRegistration: "",
      phone: "",
      role: "admin",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      return apiRequest("/api/auth/register", "POST", data);
    },
    onSuccess: () => {
      setRegistrationComplete(true);
      toast({
        title: "Registration Successful",
        description: "Your account has been created and is pending approval. You'll receive an email once approved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate personal info fields
      form.trigger(["email", "firstName", "lastName"]).then(isValid => {
        if (isValid) setStep(2);
      });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (registrationComplete) {
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
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Registration Complete
              </CardTitle>
              <CardDescription>
                Your account has been submitted for approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your registration has been successfully submitted. Our team will review your application and send you an email confirmation once approved.
                </p>
                <p className="text-sm font-medium text-emerald-600">
                  This usually takes 1-2 business days.
                </p>
              </div>
              <div className="pt-4">
                <Button 
                  onClick={() => setLocation("/")} 
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="backdrop-blur-sm bg-white/90 border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Create CornexConnect Account
            </CardTitle>
            <CardDescription>
              Join our manufacturing platform to access advanced analytics and automation
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${step >= 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1 ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Personal Info</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                <div className={`flex items-center ${step >= 2 ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2 ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Company Details</span>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4">
                      <Button type="button" onClick={nextStep} className="w-full bg-gradient-to-r from-emerald-500 to-blue-500">
                        Continue to Company Details
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Registration Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2022/854581/07" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide your official company registration number if available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role in the company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Company Administrator</SelectItem>
                              <SelectItem value="manager">Operations Manager</SelectItem>
                              <SelectItem value="user">Team Member</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Shield className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">Security Notice</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Your registration will be reviewed by our team before activation. This ensures platform security and prevents unauthorized access.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={registerMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500"
                      >
                        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button 
                  onClick={() => setLocation("/login")} 
                  className="text-emerald-600 hover:underline font-medium"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}