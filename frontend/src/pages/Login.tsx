import { useState } from "react";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import LoginBg from "@/assets/images/login-bg.webp";
import { loginSchema, type LoginFormValues } from "@/validation/authSchema";

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { persist: false },
  });

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image with Overlay */}
      <div className="relative hidden lg:flex lg:w-1/2">
        <img
          src={LoginBg}
          alt="Login background image"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="bg-background/80 absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="text-primary h-8 w-8" />
            <span className="text-foreground text-2xl font-bold">
              TechFix Pro
            </span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-foreground mb-4 text-4xl font-bold text-balance">
              Employee Portal
            </h1>
            <p className="text-muted-foreground text-lg">
              Access repair tickets, manage inventory, and track customer orders
              all in one place.
            </p>
          </div>

          <p className="text-muted-foreground text-sm">
            Need help? Contact IT support at ext. 101
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="bg-background flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <Wrench className="text-primary h-8 w-8" />
            <span className="text-foreground text-2xl font-bold">
              TechFix Pro
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="text-foreground mb-2 text-2xl font-bold">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in to access your employee dashboard
            </p>
          </div>

          <form className="space-y-6">
            <Field>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@techfixpro.com"
                className="h-12"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-muted-foreground cursor-pointer text-sm"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-primary text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full font-semibold"
            >
              Sign In
            </Button>
          </form>

          <div className="border-border mt-8 border-t pt-8">
            <p className="text-muted-foreground text-center text-sm">
              This portal is for TechFix Pro employees only.
              <br />
              <Link to="/" className="text-primary hover:underline">
                Return to main website
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
