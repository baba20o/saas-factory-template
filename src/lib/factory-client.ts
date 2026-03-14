// Client-safe factory config (reads from build-time env or hardcoded values)
// For client components that can't use fs/yaml directly
export function getFactoryConfig() {
  return {
    product: { name: "PlanForge" },
    branding: { primary_color: "#6366f1" },
  };
}
