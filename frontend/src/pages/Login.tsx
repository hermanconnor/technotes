import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Wrench, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useLogin } from "@/hooks/useLogin";
import { loginSchema, type LoginFormValues } from "@/validation/authSchema";
import LoginBg from "@/assets/images/login-bg.webp";

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      persist: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: () => {
        toast.success("Welcome back!", { description: "Logging you in..." });
        navigate(from, { replace: true });
      },

      onError: (error) => {
        const message = error.response?.data?.message || "Invalid credentials";
        toast.error("Authentication Failed", { description: message });
      },
    });
  };

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

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-6">
              {/* Username Field */}
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      placeholder="e.g. jdoe123"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password Field */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isPending}
                        className="pr-12"
                        aria-invalid={fieldState.invalid}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex items-center justify-between">
                <Controller
                  name="persist"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="persist"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                      <label
                        htmlFor="persist"
                        className="text-muted-foreground cursor-pointer text-sm"
                      >
                        Trust this device
                      </label>
                    </div>
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </FieldGroup>
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
