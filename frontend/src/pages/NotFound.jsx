import { Link } from "react-router";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfbfc] px-5 py-12">
            <section className="relative w-full max-w-xl rounded-3xl border border-[#e4e4e7] bg-white p-8 text-center shadow-[0_20px_70px_rgba(24,24,27,0.08)] sm:p-12">
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-primary">Error 404</p>
                <h1 className="text-4xl font-bold tracking-tight text-custom-dark sm:text-5xl">Page not found</h1>
                <p className="mx-auto mt-4 max-w-md text-base leading-7 text-custom-gray">
                    We couldn’t find the page you’re looking for. It may have moved, or the link might be out of date.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link to="/" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                        Back to all tasks
                    </Link>
                    <button type="button" onClick={() => window.history.back()} className="rounded-lg border border-[#d4d4d8] px-5 py-2.5 text-sm font-semibold text-custom-dark transition hover:bg-cstmbg-secondary focus:outline-none focus:ring-2 focus:ring-blue-300">
                        Go back
                    </button>
                </div>
            </section>
        </main>
    );
}