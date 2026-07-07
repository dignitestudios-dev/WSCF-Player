import ReduxProvider from "@/providers/redux-provider";
import QueryProvider from "@/providers/query-provider";
import AuthRehydrator from "@/providers/auth-rehydrator";
import SocketProvider from "@/providers/socket-provider";
import ToastProvider from "@/providers/toast-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ToastProvider>
          <AuthRehydrator>
            <SocketProvider>{children}</SocketProvider>
          </AuthRehydrator>
        </ToastProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
