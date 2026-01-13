import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">The page you are looking for doesn’t exist.</p>
      <Link
        href="/login"
        className="text-primary underline underline-offset-4 hover:opacity-80"
      >
        Go to login
      </Link>
    </div>
  )
}
