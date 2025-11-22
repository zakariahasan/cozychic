'use client';

import React from 'react'
import { useUIStore } from '@/app/store/useUiStore/useUiStore';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/offers", label: "Offers" },
  // { href: "/about", label: "About" },
  // { href: "/contact", label: "Contact" },
];

const test = {
    open: "fixed top-[0px] left-[0px] z-40 transition-all duration-300 ease-in transform translate-x-[0%] w-full h-full p-[20px] flex flex-col justify-start align-start bg-white sm:hidden",
    close: "fixed top-[0px] left-[0px] z-40 transition-all duration-300 ease-in transform translate-x-[-100%] w-full h-full p-[20px] flex flex-col justify-start align-start bg-white sm:hidden"
}

const MobileMenu = () => {

    const { isMenu, closeMobileMenu } = useUIStore();
    
    const pathname = usePathname();
    
    return (
        <nav className={`${isMenu ? test['open'] : test['close']}`}>
            <div className='w-[120px] h-[130px] flex justify-start align-center'>
                <Image src={'/images/logo/logo.png'}
                        alt='cozy chic'
                        width={100}
                        height={100}
                        className='w-full h-full object-cover' />
            </div>

            <X size={30} color='gray' className='absolute top-[25px] right-[15px]'
                onClick={closeMobileMenu}/>

            <div className='w-full p-[20px] mt-12 flex flex-col justify-center align-start gap-5'>
                {navLinks.map((link) => {
                    const isActive =
                    pathname === link.href || pathname.startsWith(`${link.href}/`);
                    return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
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
                
            </div>
          <Link
            href="/cart"
            onClick={closeMobileMenu}
            className="rounded-full mt-12 p-[20px] text-lg hover:bg-slate-100"
          >
            <ShoppingCart size={30} color="gray" />
          </Link>
        </nav>
    )
}

export default MobileMenu
