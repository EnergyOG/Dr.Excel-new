import { Routes, Route } from "react-router-dom"
import { RedirectToSignIn, SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react"
import Homepage from "./homepage/Homepage"
import Loginpage from "./login-page/Loginpage"
import SignupPage from "./signup-page/SignupPage"
import AccountSettings from "./account-settings/AccountSettings"

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

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full rounded-[2rem] bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-slate-900">Protected Dashboard</h1>
        <p className="mt-4 text-slate-600">
          Only signed-in users can perform actions here. If you are not signed in, you will be redirected to the sign-in page.
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* Clerk routes used for OAuth redirect handling - keep them */}
      <Route path="/sign-in/*" element={<SignIn path="/sign-in" routing="path" redirectUrl="/dashboard" />} />
      <Route path="/sign-up/*" element={<SignUp path="/sign-up" routing="path" redirectUrl="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="*" element={<Homepage />} />
    </Routes>
  )
}

export default App