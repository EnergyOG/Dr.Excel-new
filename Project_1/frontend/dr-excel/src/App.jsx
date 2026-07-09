import { Navigate, Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth, AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
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

    checkLocalSession()
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

      // Check Clerk session first
      if (isSignedIn) {
        try {
          const token = await window.Clerk?.session?.getToken()
          if (token) {
            const res = await fetch(`${API_BASE_URL}/admin/stats`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
              setIsAdmin(true)
            }
          }
        } catch (e) {
          console.error("Admin check failed:", e)
        }
        setChecking(false)
        return
      }

      // Check local session
      const localToken = getLocalAccessToken()
      const token = localToken

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

    checkAdmin()
  }, [isLoaded, isSignedIn])

  if (!isLoaded || checking) {
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
      {/* OAuth callback for Clerk social sign-in */}
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
      {/* Clerk routes for social sign-in - redirect to custom pages */}
      <Route path="/sign-in/*" element={<Navigate to="/login" replace />} />
      <Route path="/sign-up/*" element={<Navigate to="/signup" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<Homepage />} />
    </Routes>
  )
}

export default App