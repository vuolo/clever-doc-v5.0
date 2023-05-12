import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { type ReactNode, Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { type PageMeta } from "~/types/misc";

import {
  Bars3BottomLeftIcon,
  CogIcon,
  Squares2X2Icon,
  UserGroupIcon,
  XMarkIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/20/solid";
import { LogOut, type LucideIcon, Wand2 } from "lucide-react";

import { useUser } from "~/utils/useUser";

import { classNames } from "~/utils/helpers";

type Navigation = {
  name: string;
  href: string;
  icon: ReactNode | LucideIcon | any;
  current?: boolean;
};

const sidebarNavigation: Navigation[] = [
  { name: "Code", href: "/code", icon: Wand2, current: true },
  // { name: "Clients", href: "/clients", icon: UserGroupIcon, current: false },
  // {
  //   name: "All Files",
  //   href: "/all-files",
  //   icon: Squares2X2Icon,
  //   current: false,
  // },
  // { name: 'Settings', href: '#', icon: CogIcon, current: false }
];

const userNavigation = [
  // { name: 'Your Profile', href: '#', icon: UserIcon },
  // { name: "Settings", href: "/settings", icon: CogIcon },
  { name: "Sign out", href: "/sign-out", icon: LogOut },
];

interface Props {
  children: ReactNode;
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter();
  const user = useUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const meta = {
    title: "Clever Doc",
    description: "Avoid manual data entry",
    cardImage: "/og.png",
    ...pageMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        {/* <link href="/favicon.ico" rel="shortcut icon" /> */}
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://clever-doc-v4-2.vercel.app${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />

        {/* RealFaviconGenerator.net Favicon Package */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6237de" />
        <meta name="msapplication-TileColor" content="#6237de" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      {router.pathname === "/sign-in" ||
      router.pathname === "/_error" ||
      router.pathname === "/404" ? (
        <>{children}</>
      ) : (
        <div className="flex h-screen">
          {/* Narrow sidebar */}
          <div className="hidden w-28 overflow-y-auto border-2 bg-slate-100 md:block">
            <div className="flex w-full flex-col items-center py-6">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/">
                  <Image
                    className="h-8 w-auto"
                    src="/images/branding/logo/Logo.png"
                    width={32}
                    height={32}
                    alt="Clever Doc"
                  />
                </Link>
              </div>
              <div className="mt-6 w-full flex-1 space-y-1 px-2">
                {sidebarNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-white text-black"
                        : "text-black hover:bg-white hover:text-black",
                      "group flex w-full flex-col items-center rounded-md p-3 text-xs font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-black"
                          : "text-black group-hover:text-black",
                        "h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    <span className="mt-2">{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Transition.Root show={mobileMenuOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-20 md:hidden"
              onClose={setMobileMenuOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-100 pb-4 pt-5">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute right-0 top-1 -mr-14 p-1">
                        <button
                          type="button"
                          className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Close sidebar</span>
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex flex-shrink-0 items-center px-4">
                      <Link href="/" className="flex items-center gap-2">
                        <Image
                          className="h-8 w-auto"
                          src="/images/branding/logo/Logo.png"
                          width={32}
                          height={32}
                          alt="Clever Doc"
                        />
                        <h1 className="font-medium">Clever Doc</h1>
                      </Link>
                    </div>
                    <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
                      <nav className="flex h-full flex-col">
                        <div className="space-y-1 pt-1">
                          {sidebarNavigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-white text-black"
                                  : "text-black hover:bg-white hover:text-black",
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-black"
                                    : "text-black group-hover:text-black",
                                  "mr-3 h-6 w-6"
                                )}
                                aria-hidden="true"
                              />
                              <span>{item.name}</span>
                            </a>
                          ))}
                        </div>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
                <div className="w-14 flex-shrink-0" aria-hidden="true">
                  {/* Dummy element to force sidebar to shrink to fit close icon */}
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Content area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <header className="w-full">
              <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm">
                <button
                  type="button"
                  className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-500 md:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex flex-1 justify-between px-4 sm:px-6">
                  {/* Search Bar */}
                  <div className="flex flex-1">
                    {/* <form className="flex w-full md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search all files
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      name="search-field"
                      id="search-field"
                      className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </form> */}
                  </div>

                  {/* Buttons */}
                  <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                    {/* <span className="inline-flex">
                      <a
                        href="#"
                        className="-mx-1 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </a>
                    </span> */}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          {user.userDetails?.avatar_url ? (
                            <Image
                              className="h-8 w-8 rounded-full object-cover"
                              src={user.userDetails?.avatar_url}
                              width={32}
                              height={32}
                              alt=""
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                              <p>{user.user?.email?.charAt(0).toUpperCase()}</p>
                            </div>
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right overflow-hidden rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <p className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700">
                            {/* Green "Active" Circle */}
                            <span className="mx-1 inline-block h-2 w-2 rounded-full bg-green-500"></span>
                            <span>
                              {user.user?.email?.split("@")[0] ??
                                user.user?.email ??
                                "Unknown User"}
                            </span>
                          </p>

                          <div className="h-[0.1em] w-full bg-slate-200"></div>
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <item.icon
                                    className="h-4 w-4 text-black"
                                    aria-hidden="true"
                                  />
                                  <span>{item.name}</span>
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex flex-1 items-stretch overflow-hidden bg-slate-100">
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
