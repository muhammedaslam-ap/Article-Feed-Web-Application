import type React from "react"
import { useState, useEffect, useTransition } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible" 
import { ARTICLE_CATEGORIES } from "@/types/article"
import { userService } from "@/services/userService"
import type {
  TUserProfile,
  TUpdateUserProfileInput,
  TUpdateUserPreferencesInput,
  TChangePasswordInput,
} from "@/types/user"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { ChevronDown } from "lucide-react" // For the collapsible icon

const Settings: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user?._id)
  const navigate = useNavigate()
  const [profile, setProfile] = useState<TUserProfile | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [dob, setDob] = useState("")
  const [preferences, setPreferences] = useState<string[]>([])
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileSubmitting, startProfileTransition] = useTransition()
  const [isPasswordSubmitting, startPasswordTransition] = useTransition()
  const [isPreferencesSubmitting, startPreferencesTransition] = useTransition()
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false) // State for collapsible

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        const userProfile = await userService.getUserProfile(user!)
        setProfile(userProfile)
        setFirstName(userProfile.firstName)
        setLastName(userProfile.lastName)
        setPhone(userProfile.phone)
        setDob(userProfile.dob)
        setPreferences(userProfile.preferences || [])
      } catch (error: any) {
        toast.error(error.message || "Error fetching profile")
        setProfile({
          _id: "mock-user-id",
          firstName: "",
          lastName: "",
          email: "error@example.com",
          phone: "",
          dob: "",
          preferences: [],
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    startProfileTransition(async () => {
      try {
        const data: TUpdateUserProfileInput = { firstName, lastName, phone, dob }
        const updatedProfile = await userService.updateUserProfile(user!, data)
        setProfile(updatedProfile)
        toast.success("Profile updated successfully!")
      } catch (error: any) {
        toast.error(error.message || "Error updating profile")
      }
    })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match")
      return
    }
    startPasswordTransition(async () => {
      try {
        const data: TChangePasswordInput = { currentPassword, newPassword, confirmNewPassword, user }
        const response = await userService.changePassword(data)
        toast.success(response.message)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
        setIsPasswordSectionOpen(false) // Close section on success
      } catch (error: any) {
        toast.error(error.message || "Error changing password")
      }
    })
  }

  const handlePreferenceChange = (category: string, checked: boolean) => {
    setPreferences((prev) => (checked ? [...prev, category] : prev.filter((pref) => pref !== category)))
  }

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startPreferencesTransition(async () => {
      try {
        const data: TUpdateUserPreferencesInput = { preferences }
        const updatedProfile = await userService.updateUserPreferences(user!, data)
        setProfile(updatedProfile)
        toast.success("Preferences updated successfully!")
      } catch (error: any) {
        toast.error(error.message || "Error updating preferences")
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading settings...</div>
    )
  }

  if (!profile) {
    return <div className="flex min-h-screen items-center justify-center text-destructive">Failed to load profile.</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ChevronDown className="h-5 w-5 rotate-90" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Account Settings</h1>
          <div className="w-10" /> {/* Placeholder for alignment */}
        </div>
      </header>
      <main className="container mx-auto flex-1 py-8 px-4 md:px-6 max-w-3xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} disabled />
                <p className="text-sm text-muted-foreground">Email cannot be changed here.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
                </div>
                <div className="space-y-2">
                  {/* <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" value={dob} onChange={(e) => setDob(e.target.value)} type="date" /> */}
                </div>
              </div>
              <Button type="submit" disabled={isProfileSubmitting}>
                {isProfileSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <Collapsible open={isPasswordSectionOpen} onOpenChange={setIsPasswordSectionOpen} className="space-y-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-transparent">
                  <span>{isPasswordSectionOpen ? "Hide Password Fields" : "Change Password"}</span>
                  <ChevronDown
                    className={isPasswordSectionOpen ? "rotate-180 transition-transform" : "transition-transform"}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isPasswordSubmitting}>
                    {isPasswordSubmitting ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Article Preferences</CardTitle>
            <CardDescription>Select categories you are interested in.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePreferencesSubmit} className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ARTICLE_CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pref-${cat}`}
                      checked={preferences.includes(cat)}
                      onCheckedChange={(checked) => handlePreferenceChange(cat, checked as boolean)}
                    />
                    <Label htmlFor={`pref-${cat}`}>{cat}</Label>
                  </div>
                ))}
              </div>
              <Button type="submit" disabled={isPreferencesSubmitting}>
                {isPreferencesSubmitting ? "Saving..." : "Save Preferences"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Settings
