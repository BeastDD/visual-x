import { signIn, useSession, signOut } from 'next-auth/react'

function LoginButton() {
  const { data: session } = useSession()

  return session ? (
    <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-full">
      <img 
        src={session.user?.image || ''} 
        alt={session.user?.name || ''} 
        className="w-8 h-8 rounded-full" 
      />
      <div>
        <p className="text-sm font-medium">@{session.user?.name}</p>
        <p className="text-xs text-zinc-400">Logged in with X</p>
      </div>
      <button 
        onClick={() => signOut()} 
        className="ml-4 text-red-500 hover:text-red-400 text-sm"
      >
        Sign Out
      </button>
    </div>
  ) : (
    <button
      onClick={() => signIn('twitter')}
      className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 transition"
    >
      <span>Sign in with X</span>
    </button>
  )
}
