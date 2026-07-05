import { Routes, Route } from "react-router-dom"
import { RedirectToSignIn, SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react"
import Homepage from "./homepage/Homepage"
import Loginpage from "./login-page/Loginpage"
import SignupPage from "./signup-page/SignupPage"
import AccountSettings from "./account-settings/AccountSettings"
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
      <Route path="/sign-in/*" element={<SignIn path="/sign-in" routing="path" redirectUrl="/dashboard" />} />
      <Route path="/sign-up/*" element={<SignUp path="/sign-up" routing="path" redirectUrl="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="*" element={<Homepage />} />
    </Routes>
  )
}

export default App