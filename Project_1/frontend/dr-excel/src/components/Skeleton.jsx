import { useState } from "react"

export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />
}

export function SkeletonText({ className = "" }) {
  return <div className={`h-3 animate-pulse rounded-full bg-slate-200/80 ${className}`} />
}

export function ImageSkeleton({ src, alt, className = "" }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200/80" />}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-14 w-14 rounded-full" />
            <SkeletonBlock className="h-5 w-28" />
          </div>
          <div className="hidden gap-3 md:flex">
            <SkeletonBlock className="h-9 w-20" />
            <SkeletonBlock className="h-9 w-20" />
            <SkeletonBlock className="h-9 w-20" />
          </div>
        </div>

        <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-2 py-16 text-center">
          <SkeletonBlock className="h-8 w-40 rounded-full" />
          <SkeletonBlock className="mt-6 h-16 w-full max-w-3xl" />
          <SkeletonBlock className="mt-4 h-6 w-full max-w-2xl" />
          <SkeletonBlock className="mt-4 h-6 w-3/4 max-w-xl" />
          <div className="mt-8 flex gap-4">
            <SkeletonBlock className="h-12 w-36" />
            <SkeletonBlock className="h-12 w-36" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-36 w-full" />
              <SkeletonText className="mt-4 w-2/3" />
              <SkeletonText className="mt-3 w-full" />
              <SkeletonText className="mt-2 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AuthPageSkeleton({ message = "Preparing your experience..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl md:p-12">
        <SkeletonBlock className="h-4 w-32 rounded-full" />
        <SkeletonBlock className="mt-4 h-10 w-3/4" />
        <SkeletonText className="mt-4 w-full" />
        <SkeletonText className="mt-2 w-2/3" />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>

        <div className="mt-8 space-y-4">
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">{message}</div>
      </div>
    </div>
  )
}

export function AccountSettingsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="w-full">
            <SkeletonBlock className="h-4 w-24 rounded-full" />
            <SkeletonBlock className="mt-3 h-8 w-2/3" />
            <SkeletonText className="mt-3 w-full" />
            <SkeletonText className="mt-2 w-2/3" />
          </div>
          <SkeletonBlock className="h-10 w-28 rounded-full" />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <SkeletonBlock className="h-6 w-28" />
            <div className="mt-4 space-y-3">
              <SkeletonText className="w-full" />
              <SkeletonText className="w-5/6" />
              <SkeletonText className="w-2/3" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <SkeletonBlock className="h-6 w-36" />
            <div className="mt-4 space-y-3">
              <SkeletonBlock className="h-12 w-full rounded-2xl" />
              <SkeletonBlock className="h-12 w-full rounded-2xl" />
              <SkeletonBlock className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-3xl rounded-[2rem] bg-white p-10 shadow-2xl">
        <SkeletonBlock className="h-8 w-2/3" />
        <SkeletonText className="mt-4 w-full" />
        <SkeletonText className="mt-2 w-5/6" />
        <SkeletonText className="mt-2 w-2/3" />
        <div className="mt-8 space-y-4">
          <SkeletonBlock className="h-24 w-full rounded-2xl" />
          <SkeletonBlock className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
