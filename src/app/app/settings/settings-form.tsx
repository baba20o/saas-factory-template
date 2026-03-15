"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsForm({
  email,
  displayName,
}: {
  email: string;
  displayName: string;
}) {
  const [name, setName] = useState(displayName);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    setProfileLoading(false);
    if (error) {
      setProfileMsg({ type: "error", text: error.message });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password must be at least 8 characters." });
      setPasswordLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      setPasswordLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
    } else {
      setPasswordMsg({ type: "success", text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all";

  return (
    <div className="space-y-8">
      {/* Profile */}
      <form
        onSubmit={handleProfileSubmit}
        className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 space-y-5"
      >
        <h2 className="text-lg font-semibold text-white">Profile</h2>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Email</label>
          <input type="email" value={email} disabled className={`${inputClasses} opacity-60 cursor-not-allowed`} />
          <p className="text-xs text-slate-600 mt-1">Email cannot be changed here.</p>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Display name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClasses}
          />
        </div>

        {profileMsg && (
          <p className={`text-sm ${profileMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {profileMsg.text}
          </p>
        )}

        <button
          type="submit"
          disabled={profileLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
        >
          {profileLoading ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Password */}
      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 space-y-5"
      >
        <h2 className="text-lg font-semibold text-white">Change password</h2>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={inputClasses}
          />
        </div>

        {passwordMsg && (
          <p className={`text-sm ${passwordMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {passwordMsg.text}
          </p>
        )}

        <button
          type="submit"
          disabled={passwordLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
        >
          {passwordLoading ? "Updating..." : "Update password"}
        </button>
      </form>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
        <h2 className="text-lg font-semibold text-red-400">Danger zone</h2>
        <p className="text-sm text-slate-400 mt-1 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => alert("Account deletion is not yet implemented. Contact support.")}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          Delete account
        </button>
      </div>
    </div>
  );
}
