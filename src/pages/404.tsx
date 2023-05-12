import Link from "next/link";

export default function Error404() {
  return (
    <>
      <div className="min-h-screen w-screen bg-slate-100 px-4 py-16 sm:px-6 sm:py-20 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-bold tracking-tight text-stone-600 sm:text-5xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Page not found
                </h1>
                <p className="mt-1 text-base text-gray-500">
                  Please check the URL in the address bar and try again.
                </p>
              </div>
              <div className="mt-5 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md border border-transparent bg-stone-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                >
                  Go back home
                </Link>
                {/* <Link
                  href="/support"
                  className="inline-flex items-center rounded-md border border-transparent bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                >
                  Contact support
                </Link> */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
