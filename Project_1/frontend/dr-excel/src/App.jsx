import { Navigate, Routes, Route } from "react-router-dom"
import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/clerk-react"
import { useState, useEffect } from "react"
import Homepage from "./homepage/Homepage"
import Loginpage from "./login-page/Loginpage"
import SignupPage from "./signup-page/SignupPage"
import AccountSettings from "./account-settings/AccountSettings"
import AdminDashboard from "./admin/AdminDashboard"
import AdminLogin from "./admin/AdminLogin"
import { DashboardSkeleton } from "./components/Skeleton"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
const LOCAL_ACCESS_TOKEN_KEY = "drExcelAccessToken"

const getLocalAccessToken = () => localStorage.getItem(LOCAL_ACCESS_TOKEN_KEY)

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const [hasLocalSession, setHasLocalSession] = useState(false)
  const [checkingLocalSession, setCheckingLocalSession] = useState(true)

  useEffect(() => {
    const checkLocalSession = async () => {
      const token = getLocalAccessToken()
      if (!token) {
        setCheckingLocalSession(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          setHasLocalSession(true)
        } else {
          localStorage.removeItem(LOCAL_ACCESS_TOKEN_KEY)
        }
      } catch (error) {
        console.error("Local session check failed:", error)
      } finally {
        setCheckingLocalSession(false)
      }
    }

    void checkLocalSession()
  }, [])

  if (!isLoaded || checkingLocalSession) {
    return <DashboardSkeleton />
  }

  if (isSignedIn || hasLocalSession) {
    return <>{children}</>
  }

  return <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (!isLoaded) return

      const clerkToken = isSignedIn ? await window.Clerk?.session?.getToken() : null
      const localToken = getLocalAccessToken()
      const token = clerkToken || localToken

      if (!token) {
        setChecking(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.ok) {
          setIsAdmin(true)
        } else if (res.status === 401) {
          localStorage.removeItem(LOCAL_ACCESS_TOKEN_KEY)
        }
      } catch (e) {
        console.error("Admin check failed:", e)
      } finally {
        setChecking(false)
      }
    }

    void checkAdmin()
  }, [isLoaded, isSignedIn])
  
  if (!isLoaded) {
    return <DashboardSkeleton />
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

function ClerkUserSync() {
  const { isLoaded, isSignedIn, userId } = useAuth()

  useEffect(() => {
    const syncUser = async () => {
      const token = await window.Clerk?.session?.getToken()
      if (!token) return

      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          console.error("Clerk user sync failed:", res.status)
        }
      } catch (error) {
        console.error("Clerk user sync failed:", error)
      }
    }

    if (isLoaded && isSignedIn && userId) {
      void syncUser()
    }
  }, [isLoaded, isSignedIn, userId])

  return null
}

function App() {
  return (
    <>
      <ClerkUserSync />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* OAuth callback only; users should never see Clerk-hosted UI routes. */}
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route path="/sign-in/*" element={<Navigate to="/login" replace />} />
        <Route path="/sign-up/*" element={<Navigate to="/signup" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<Homepage />} />
      </Routes>
    </>
  )
}

export default App
