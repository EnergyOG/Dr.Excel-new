import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSignIn } from "@clerk/clerk-react"
import background from "/actual-bg.png"

function SocialButtons() {
  const { signIn } = useSignIn()

  const signInWith = (strategy) => {
    return signIn?.authenticateWithRedirect({
      strategy: strategy,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/dashboard',
    })
  }

  return (
    <>
      <button className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => signInWith('oauth_google')}>
        <span className="h-5 w-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></span>
        Continue with Google
      </button>
      <button className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-[#1877F2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#166fe5]" onClick={() => signInWith('oauth_facebook')}>
        Continue with Facebook
      </button>
      <button className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800" onClick={() => signInWith('oauth_twitter')}>
        Continue with Twitter
      </button>
    </>
  )
}

function SignupPage({ onBackToLogin }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // TODO: Replace with your backend base URL or define VITE_API_URL in .env
  const API_BASE = import.meta.env.VITE_API_URL || ""

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Signup failed" }))
        setError(errorData.message || "Signup failed")
        return
      }

      const data = await response.json()
      console.log("Signup success", data)
      // TODO: Update this to match your login flow after signup (redirect, show message, auto-login)
      handleBackToLogin()
    } catch (fetchError) {
      setError(fetchError.message || "Network error during signup")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin()
      return
    }

    navigate("/login")
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-slate-950/60"></div>
      <div className="relative max-w-3xl w-full mx-4 p-8 md:p-12 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-green-600 font-semibold">Create account</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-950">Join our community</h1>
              <p className="mt-3 text-slate-600">Sign up and get instant access to your personalized dashboard and powerful tools.</p>
            </div>

            <div className="space-y-3">
              <SocialButtons />
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-px flex-1 bg-slate-300"></span>
              <span>or sign up with email</span>
              <span className="h-px flex-1 bg-slate-300"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4">
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="jane.doe"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <div className="grid gap-4">
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <div className="grid gap-4">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <div className="grid gap-4">
              <label className="block text-sm font-medium text-slate-700">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <label className="inline-flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                required
              />
              I agree to the privacy policy and terms of service.
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="font-semibold text-sky-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
