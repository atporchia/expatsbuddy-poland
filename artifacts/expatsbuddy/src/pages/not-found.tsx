import { Link } from "wouter";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
      <Link href={routes.home()} className="mt-6 inline-block text-sm font-medium text-blue-700 hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
