import { Link } from "react-router-dom"
import { useUser, SignOutButton } from "@clerk/clerk-react"

function AccountSettings() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <p className="text-slate-600">Loading account settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-600">Account</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Settings</h1>
            <p className="mt-3 text-slate-600">
              Manage your profile information and account preferences here.
            </p>
          </div>
          <Link
            to="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back home
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div>
                <span className="font-medium text-slate-700">Name:</span> {user?.fullName || user?.firstName || "Not provided"}
              </div>
              <div>
                <span className="font-medium text-slate-700">Email:</span> {user?.primaryEmailAddress?.emailAddress || "Not provided"}
              </div>
              <div>
                <span className="font-medium text-slate-700">Username:</span> {user?.username || "Not provided"}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Account actions</h2>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Update profile picture
              </button>
              <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Change email address
              </button>
              <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Change password
              </button>
              <SignOutButton>
                <button className="w-full rounded-2xl bg-red-500 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-red-600">
                  Sign out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
