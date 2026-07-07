import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import background from "/actual-bg.png"
import { AuthPageSkeleton } from "../components/Skeleton"

function AdminLogin() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const navigate = useNavigate()

  const API_BASE = import.meta.env.VITE_API_URL || ""

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          identifier,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }))
        setError(errorData.message || "Login failed")
        return
      }

      const data = await response.json()
      console.log("Admin login success", data)
      
      // Check if user is admin and redirect accordingly
      if (data.data?.user?.role === "admin") {
        window.location.href = "/admin"
      } else {
        setError("Access denied. Admin privileges required.")
      }
    } catch (fetchError) {
      setError(fetchError.message || "Network error during login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setPageReady(true), 250)
    return () => window.clearTimeout(timer)
  }, [])

  if (!pageReady) {
    return <AuthPageSkeleton message="Preparing admin sign-in..." />
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-slate-950/60"></div>
      <div className="relative max-w-3xl w-full mx-4 p-8 md:p-12 bg-white/95 backdrop-blur-xl rounded-4xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-green-600 font-semibold">Admin Access</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-950">Admin Sign In</h1>
              <p className="mt-3 text-slate-600">Sign in with your admin credentials to manage users and requests.</p>
            </div>
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-px flex-1 bg-slate-300"></span>
              <span>Admin login only</span>
              <span className="h-px flex-1 bg-slate-300"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4">
              <label className="block text-sm font-medium text-slate-700">Email or Username</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="font-medium">Password</label>
                <button type="button" className="text-sky-600 hover:underline">Forgot password?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Signing in..." : "Sign in to Admin"}
            </button>

            <p className="text-center text-sm text-slate-500">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="font-semibold text-sky-600 hover:underline"
              >
                Back to main site
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
