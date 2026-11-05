import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 text-muted">That page doesn&apos;t exist.</p>
      <p className="mt-6">
        <Link href="/" className="font-medium text-accent hover:underline">
          Back to the home page
        </Link>
      </p>
    </div>
  );
}
