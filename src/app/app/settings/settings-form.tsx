"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/toast";

export default function SettingsForm({
  email,
  displayName,
}: {
  email: string;
  displayName: string;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(displayName);
  const [profileLoading, setProfileLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    setProfileLoading(false);
    if (error) {
      toast(error.message, "error");
    } else {
      toast("Profile updated successfully.");
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordLoading(true);

    if (newPassword.length < 8) {
      toast("Password must be at least 8 characters.", "error");
      setPasswordLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match.", "error");
      setPasswordLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      toast(error.message, "error");
    } else {
      toast("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  const inputClasses =
    "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-glass-border text-sm text-text-primary placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all";

  return (
    <div className="space-y-8">
      {/* Profile */}
      <form
        onSubmit={handleProfileSubmit}
        className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl p-8 space-y-5"
      >
        <h2 className="text-lg font-semibold text-text-primary">Profile</h2>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Email</label>
          <input type="email" value={email} disabled className={`${inputClasses} opacity-60 cursor-not-allowed`} />
          <p className="text-xs text-text-muted mt-1">Email cannot be changed here.</p>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Display name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          disabled={profileLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
        >
          {profileLoading ? "Saving..." : "Save changes"}
        </button>
      </form>

      {/* Password */}
      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-2xl border border-glass-border bg-glass-surface backdrop-blur-xl p-8 space-y-5"
      >
        <h2 className="text-lg font-semibold text-text-primary">Change password</h2>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          disabled={passwordLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
        >
          {passwordLoading ? "Updating..." : "Update password"}
        </button>
      </form>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
        <h2 className="text-lg font-semibold text-red-400">Danger zone</h2>
        <p className="text-sm text-text-secondary mt-1 mb-4">
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
