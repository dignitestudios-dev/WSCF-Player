import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import PendingRatingBanner from "@/features/dashboard/components/pending-rating-banner";
import BottomNav from "@/features/dashboard/components/bottom-nav";
import AuthGuard from "@/components/shared/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div
        className="min-h-dvh"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #F7F6FF",
        }}
      >
        <DashboardHeader />
        <PendingRatingBanner />
        {/* On a phone the bottom bar floats over the page, so the page leaves
            exactly its height (plus the home-bar inset) free at the bottom. */}
        <main className="pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
