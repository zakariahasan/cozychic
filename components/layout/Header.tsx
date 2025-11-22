"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Menu } from 'lucide-react';
import { useUIStore } from "@/app/store/useUiStore/useUiStore";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/offers", label: "Offers" },
  // { href: "/about", label: "About" },
  // { href: "/contact", label: "Contact" },
];

export function Header() {
  const { openMobileMenu } = useUIStore();
  const pathname = usePathname();

  return (
    <header className="bg-white/80 backdrop-blur">
      <div className="w-full mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="w-[130px] h-[120px] flex justify-center align-center">
          <Image src={'/images/logo/logo.png'}
                 alt="cozy chic"
                 width={100}
                 height={100}
                 className="w-full h-full object-cover" />
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg ${
                  isActive
                    ? "font-semibold text-amber-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            className="rounded-full p-[10px] text-lg hover:bg-slate-100"
          >
            <ShoppingCart size={20} color="gray" />
          </Link>
        </nav>

        <Menu size={20} color="gray" className="block sm:hidden" onClick={openMobileMenu}/>
      </div>
    </header>
  );
}
