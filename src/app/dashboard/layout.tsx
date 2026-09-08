import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import PendingRatingBanner from "@/features/dashboard/components/pending-rating-banner";
import AuthGuard from "@/components/shared/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #F7F6FF",
        }}
      >
        <DashboardHeader />
        <PendingRatingBanner />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
