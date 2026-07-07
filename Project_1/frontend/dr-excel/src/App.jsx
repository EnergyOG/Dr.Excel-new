import { Routes, Route } from "react-router-dom"
import { AuthenticateWithRedirectCallback, RedirectToSignIn, SignedIn, SignedOut, SignIn, SignUp, useAuth } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import Homepage from "./homepage/Homepage"
import Loginpage from "./login-page/Loginpage"
import SignupPage from "./signup-page/SignupPage"
import AccountSettings from "./account-settings/AccountSettings"
import AdminDashboard from "./admin/AdminDashboard"
import AdminLogin from "./admin/AdminLogin"
import { DashboardSkeleton } from "./components/Skeleton"

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

function AdminRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const token = await window.Clerk?.session?.getToken()
          const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setIsAdmin(data.data?.user?.role === "admin")
          }
        } catch (e) {
          console.error("Admin check failed:", e)
        } finally {
          setChecking(false)
        }
      } else {
        setChecking(false)
      }
    }
    checkAdmin()
  }, [isLoaded, isSignedIn])
  
  if (!isLoaded || !isSignedIn) {
    return <RedirectToSignIn />
  }
  
  if (checking) {
    return <DashboardSkeleton />
  }
  
  if (!isAdmin) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Access Denied - Admin Only</div>
  }
  
  return <>{children}</>
}

function Dashboard() {
  return (
    <DashboardSkeleton />
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* Clerk routes used for OAuth redirect handling - keep them */}
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
      <Route path="/sign-in/*" element={<SignIn path="/sign-in" routing="path" redirectUrl="/dashboard" />} />
      <Route path="/sign-up/*" element={<SignUp path="/sign-up" routing="path" redirectUrl="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<Homepage />} />
    </Routes>
  )
}

export default App
