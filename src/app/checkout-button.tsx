"use client";

import { useState } from "react";

export default function CheckoutButton({
  priceId,
  label,
  highlighted,
  primaryColor,
  ctaLink,
}: {
  priceId: string;
  label: string;
  highlighted: boolean;
  primaryColor: string;
  ctaLink: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    // Free tier — just go to signup
    if (!priceId) {
      window.location.href = ctaLink;
      return;
    }

    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else if (res.status === 401) {
      // Not logged in — send to signup first
      window.location.href = "/signup";
    } else {
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`block w-full text-center rounded-full py-2.5 font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50 ${
        highlighted
          ? "text-white"
          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
      style={highlighted ? { backgroundColor: primaryColor } : undefined}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}
