import { useState } from "react"
import background from "/login-background.png"

function Loginpage({ onCreateAccount }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log({ username, password, remember })
    alert("Login submitted: " + username)
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-slate-950/60"></div>
      <div className="relative max-w-3xl w-full mx-4 p-8 md:p-12 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-green-600 font-semibold">Welcome Back</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-950">Sign in to your account</h1>
              <p className="mt-3 text-slate-600">Use your username and password to access your dashboard, or continue with one of your social accounts.</p>
            </div>

            <div className="space-y-3">
              <button className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                <span className="h-5 w-5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></span>
                Continue with Google
              </button>
              <button className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-[#1877F2] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#166fe5]">
                Continue with Facebook
              </button>
              <button className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                Continue with Twitter
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-px flex-1 bg-slate-300"></span>
              <span>or login with email</span>
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
              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="font-medium">Password</label>
                <button type="button" className="text-green-600 hover:underline">Forgot password?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Remember me
              </label>
              <span className="text-slate-400">Secure login</span>
            </div>

            <button
              type="submit"
              className="w-full rounded-3xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-green-700"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={onCreateAccount}
                className="font-semibold text-sky-600 hover:underline"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Loginpage
