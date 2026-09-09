import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar (Placeholder) */}
      <header className="p-6 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold tracking-tight">EventRegistration</h1>
        <nav>
          <Link href="/admin/login" className="text-sm font-medium hover:underline underline-offset-4">
            Admin Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/50">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Event Terbaru
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Tech Conference 2026
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Bergabunglah dengan ribuan developer dan penggiat teknologi dalam konferensi terbesar tahun ini. Dapatkan insight terbaru dan klaim merchandise eksklusif Anda!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2"
            >
              Daftar Sekarang
            </Link>
            <Link 
              href="#rundown" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-11 px-8 py-2"
            >
              Lihat Rundown
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
