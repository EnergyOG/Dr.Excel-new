/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { AdminDashboardSkeleton } from "../components/Skeleton";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to get auth token
const getAuthToken = async () => {
  const token = await window.Clerk?.session?.getToken();
  return token;
};

// Stats Card Component
function StatsCard({ title, value, icon, color = "green" }) {
  const colorClasses = {
    green: "bg-green-500/10 text-green-400",
    blue: "bg-blue-500/10 text-blue-400",
    amber: "bg-amber-500/10 text-amber-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Users Management Tab
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const params = new URLSearchParams({ page, search, status: statusFilter, role: roleFilter });
      const res = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, roleFilter]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    setActionLoading(userId);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(userId);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/auth/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-green-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-white/5">
                <td className="px-4 py-3 text-white">{user.username}</td>
                <td className="px-4 py-3 text-slate-300">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    user.role === "admin" ? "bg-green-500/20 text-green-300" : "bg-slate-500/20 text-slate-300"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    user.status === "active" ? "bg-green-500/20 text-green-300" :
                    user.status === "suspended" ? "bg-red-500/20 text-red-300" :
                    "bg-amber-500/20 text-amber-300"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={actionLoading === user._id}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      disabled={actionLoading === user._id}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={actionLoading === user._id}
                      className="rounded-lg bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Requests Management Tab
function RequestsTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const params = new URLSearchParams({ page, search, status: statusFilter });
      const res = await fetch(`${API_BASE_URL}/admin/requests?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const handleStatusChange = async (requestId, newStatus) => {
    setActionLoading(requestId);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error("Failed to update request status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    setActionLoading(requestId);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/admin/requests/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error("Failed to delete request:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-400 outline-none focus:border-green-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none"
        >
          <option value="">All Statuses</option>
          <option value="backlog">Backlog</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Details</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Created</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-b border-white/5">
                <td className="px-4 py-3 text-white">{request.requestName}</td>
                <td className="px-4 py-3 text-slate-300">{request.requestEmail}</td>
                <td className="px-4 py-3 max-w-xs truncate text-slate-400">{request.requestDetails}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    request.requestStatus === "done" ? "bg-green-500/20 text-green-300" :
                    request.requestStatus === "pending" ? "bg-amber-500/20 text-amber-300" :
                    "bg-slate-500/20 text-slate-300"
                  }`}>
                    {request.requestStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={request.requestStatus}
                      onChange={(e) => handleStatusChange(request._id, e.target.value)}
                      disabled={actionLoading === request._id}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                    </select>
                    <button
                      onClick={() => handleDeleteRequest(request._id)}
                      disabled={actionLoading === request._id}
                      className="rounded-lg bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const fetchStats = useCallback(async () => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void fetchStats();
    }
  }, [isLoaded, isSignedIn, fetchStats]);

  if (!isLoaded || !isSignedIn) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">Manage users and requests</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">
                {user?.firstName || user?.email}
              </span>
              <button
                onClick={() => navigate("/")}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
              >
                Back to Site
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-6">
            {["overview", "users", "requests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? "border-green-400 text-green-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {activeTab === "overview" && (
          <div>
            <h2 className="mb-6 text-xl font-semibold">Overview</h2>
            {loading ? (
              <AdminDashboardSkeleton />
            ) : stats ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  title="Total Users"
                  value={stats.users.total}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3h-4a3 3 0 00-3 3v2h5zM9 20h5v-2a3 3 0 00-3-3H6a3 3 0 00-3 3v2h3zM12 4a4 4 0 110 8 4 4 0 010-8z" />
                    </svg>
                  }
                  color="blue"
                />
                <StatsCard
                  title="Admin Users"
                  value={stats.users.admins}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A7.5 7.5 0 1112 21.5a7.5 7.5 0 01-10-9.5 7.5 7.5 0 0110-9.5z" />
                    </svg>
                  }
                  color="green"
                />
                <StatsCard
                  title="Suspended Users"
                  value={stats.users.suspended}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  }
                  color="red"
                />
                <StatsCard
                  title="Total Requests"
                  value={stats.requests.total}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6M9 9h6m-7 4h8m-4 4h4M5 5a2 2 0 012-2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                    </svg>
                  }
                  color="amber"
                />
              </div>
            ) : (
              <p className="text-slate-400">Failed to load statistics</p>
            )}

            {stats && (
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-4 text-lg font-semibold">Request Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Backlog</span>
                      <span className="font-semibold text-white">{stats.requests.backlog}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Pending</span>
                      <span className="font-semibold text-white">{stats.requests.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Done</span>
                      <span className="font-semibold text-white">{stats.requests.done}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full rounded-lg bg-green-500/20 px-4 py-2 text-left font-medium text-green-300 transition hover:bg-green-500/30"
                    >
                      Manage Users
                    </button>
                    <button
                      onClick={() => setActiveTab("requests")}
                      className="w-full rounded-lg bg-amber-500/20 px-4 py-2 text-left font-medium text-amber-300 transition hover:bg-amber-500/30"
                    >
                      Manage Requests
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && <UsersTab />}
        {activeTab === "requests" && <RequestsTab />}
      </main>
    </div>
  );
}