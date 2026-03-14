import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFactoryConfig } from "@/lib/factory";
import SignOutButton from "./sign-out-button";

export default async function AppDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const config = getFactoryConfig();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <span className="text-lg font-bold" style={{ color: config.branding.primary_color }}>
          {config.branding.logo_text}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <SignOutButton />
        </div>
      </nav>
      <main className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome to {config.product.name}. This is where the product lives.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          <p className="text-lg">Product UI goes here</p>
          <p className="text-sm mt-2">This area is driven by the factory template — swap it per product.</p>
        </div>
      </main>
    </div>
  );
}
