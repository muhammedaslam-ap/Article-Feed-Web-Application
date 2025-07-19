"use client"

import { AxiosError } from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" // Import Checkbox
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { EyeIcon, EyeOffIcon, BookOpen, Users, ArrowRight } from "lucide-react"
import { authAxiosInstance } from "@/api/authAxiosInstance"
import { userAuthService } from "@/services/authServices"
import { setUser } from "@/redux/slice/userSlice"
import { z } from "zod"
import { store } from "@/redux/store"

// Updated Article categories for preferences as per your request
const articleCategories = [
  "Sports",
  "Politics",
  "Space",
  "Technology",
  "Science",
  "Health",
  "Entertainment",
  "Business",
]

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(3, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required").max(50, "First name must be 50 characters or less"),
    lastName: z.string().min(2, "Last name is required").max(50, "Last name must be 50 characters or less"),
    email: z.string().email("Invalid email address").min(3, "Email is required"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be in YYYY-MM-DD format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    preferences: z.array(z.string()).min(1, "Select at least one category"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

interface UserData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  preferences: string[]
}

interface AuthFormProps {
  className?: string
}

export default function AuthForm({ className }: AuthFormProps) {
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Login form setup
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  // Register form setup
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      password: "",
      confirmPassword: "",
      preferences: [],
    },
  })

  // Watch preferences field to update checkbox state
  const watchedPreferences = registerForm.watch("preferences")

  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login Data Sent:", data)
      const response = await authAxiosInstance.post("/auth/login", data)
      console.log("Login Response:", response.data)
      const { user } = response.data // Only extract user, tokens are in cookies
      console.log("im user", user)
      if (!user) {
        throw new Error("Missing user data in response")
      }
      const userData: UserData = {
        _id: user._id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        preferences: user.preferences || [],
      }
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      // Dispatch to Redux
      dispatch(setUser(userData))
      // Log for debugging
      console.log("Stored User Data in localStorage:", userData)
      console.log("localStorage User:", JSON.parse(localStorage.getItem("user") || "{}"))
      console.log("Redux State:", store.getState().user.user)
      toast.success(response.data.message || "Login successful")
      loginForm.reset()
      navigate("/")
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Login Error:", error.response?.data || error.message)
        toast.error(error.response?.data?.message || "Login failed")
      } else {
        console.error("Unexpected Error:", error)
        toast.error("An unexpected error occurred")
      }
    }
  }

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    try {
      const res = await userAuthService.registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        password: data.password,
        preferences: data.preferences,
      })
      toast.success(res.message || "Registration successful")
      registerForm.reset()
      setIsRegistered(true)
      // Switch to login tab
      const tabsElement = document.querySelector('[data-state="inactive"][value="login"]') as HTMLElement
      if (tabsElement) {
        tabsElement.click()
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Registration failed")
      }
    }
  }

  const handlePreferenceChange = (category: string, checked: boolean) => {
    const currentPreferences = registerForm.getValues("preferences")
    if (checked) {
      registerForm.setValue("preferences", [...currentPreferences, category], { shouldValidate: true })
    } else {
      registerForm.setValue(
        "preferences",
        currentPreferences.filter((pref) => pref !== category),
        { shouldValidate: true },
      )
    }
  }

  const roleConfig = {
    icon: <Users className="h-6 w-6 text-white" />,
    title: "User Portal",
    color: "bg-teal-500",
    textColor: "text-teal-500",
    borderColor: "border-teal-500",
    buttonColor: "bg-teal-500 hover:bg-teal-600",
  }

  return (
    <div className={cn("flex min-h-screen items-center justify-center p-4 bg-background", className)}>
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className={cn("inline-flex items-center justify-center p-3 rounded-full", roleConfig.color)}>
            {roleConfig.icon}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">{roleConfig.title}</h1>
          <p className="mt-2 text-muted-foreground">Access your learning platform</p>
        </div>

        {/* Auth tabs */}
        <Tabs defaultValue={isRegistered ? "login" : "register"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card className={cn("border-t-4 shadow-md transition-all", roleConfig.borderColor)}>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </CardHeader>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      {...loginForm.register("email")}
                      type="email"
                      placeholder="your.email@example.com"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-destructive text-sm">{loginForm.formState.errors.email?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        {...loginForm.register("password")}
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-destructive text-sm">{loginForm.formState.errors.password?.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className={cn("w-full", roleConfig.buttonColor)}>
                    Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register">
            <Card className={cn("border-t-4 shadow-md transition-all", roleConfig.borderColor)}>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Start your learning journey today</CardDescription>
              </CardHeader>
              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...registerForm.register("firstName")} placeholder="John" />
                    {registerForm.formState.errors.firstName && (
                      <p className="text-destructive text-sm">{registerForm.formState.errors.firstName?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...registerForm.register("lastName")} placeholder="Doe" />
                    {registerForm.formState.errors.lastName && (
                      <p className="text-destructive text-sm">{registerForm.formState.errors.lastName?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      {...registerForm.register("email")}
                      type="email"
                      placeholder="your.email@example.com"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-destructive text-sm">{registerForm.formState.errors.email?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...registerForm.register("phone")} placeholder="1234567890" />
                    {registerForm.formState.errors.phone && (
                      <p className="text-destructive text-sm">{registerForm.formState.errors.phone?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" {...registerForm.register("dob")} type="date" placeholder="YYYY-MM-DD" />
                    {registerForm.formState.errors.dob && (
                      <p className="text-destructive text-sm">{registerForm.formState.errors.dob?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferences">Article Categories</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {articleCategories.map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox
                            id={`pref-${cat}`}
                            checked={watchedPreferences.includes(cat)}
                            onCheckedChange={(checked) => handlePreferenceChange(cat, checked as boolean)}
                          />
                          <Label htmlFor={`pref-${cat}`}>{cat}</Label>
                        </div>
                      ))}
                    </div>
                    {registerForm.formState.errors.preferences && (
                      <p className="text-destructive text-sm">{registerForm.formState.errors.preferences?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        {...registerForm.register("password")}
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-destructive text-sm">{registerForm.formState.errors.password?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        {...registerForm.register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </Button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-destructive text-sm">
                        {registerForm.formState.errors.confirmPassword?.message}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className={cn("w-full", roleConfig.buttonColor)}>
                    Register <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Article Feeds Platform</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Explore articles tailored to your interests</p>
        </div>
      </div>
    </div>
  )
}
