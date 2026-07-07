import { APP_NAME } from "@/utils/constants";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500 sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
