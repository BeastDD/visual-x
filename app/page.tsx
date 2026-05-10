// Full updated page.tsx with fixed login (paste your current content here if needed, but key part):
import { signIn, useSession } from "next-auth/react";

// In your LoginButton component:
function LoginButton() {
  const { data: session } = useSession();

  return session ? (
    <div>Welcome, {session.user?.name}</div>
  ) : (
    <button
      onClick={() => signIn("twitter")}
      className="bg-black hover:bg-zinc-800 text-white px-6 py-3 rounded-full flex items-center gap-2"
    >
      Sign in with X
    </button>
  );
}
// Rest of your page...