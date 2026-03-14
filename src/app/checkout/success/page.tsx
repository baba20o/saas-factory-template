import { getFactoryConfig } from "@/lib/factory";

export default function CheckoutSuccess() {
  const config = getFactoryConfig();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">You&apos;re all set!</h1>
        <p className="text-gray-600 mb-6">
          Welcome to {config.product.name} Pro. Your subscription is active.
        </p>
        <a
          href="/app"
          className="inline-block rounded-full px-6 py-2.5 text-white font-medium"
          style={{ backgroundColor: config.branding.primary_color }}
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
