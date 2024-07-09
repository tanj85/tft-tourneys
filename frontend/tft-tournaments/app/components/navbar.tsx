"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinks = [
    { name: "Tournaments", href: "/tournaments" },
    { name: "About", href: "/about" },
  ];

  // const Navbar = () => {
  const pathname = usePathname();
  return (
    <>
      {/* desktop navbar */}
      <div className="font-greycliff backdrop-blur bg-darkest-blue bg-opacity-80 sticky top-0 hidden md:flex flex-row justify-between overflow-hidden  z-20">
        <Link href="/">
          <div className="relative h-20 w-[240px]">
            <Image
              src="/new_full_logo.png"
              fill={true}
              alt="logo"
              className="p-3 ml-2"
            />
          </div>
        </Link>

        <div className="items-center flex gap-[1.5rem] mr-[10rem] tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname && pathname.startsWith(link.href);
            return (
              <>
                <Link
                  href={link.href}
                  key={link.name}
                  className={
                    isActive
                      ? "h-7 mx-5 py-4 items-center flex gradient-text animate-gradient text-transparent items-center"
                      : "bg-opacity-0 transition-all ease-in-out duration:300 delay-100 h-7 mx-5 py-4 items-center flex gradient-text animate-gradient hover:text-transparent"
                  }
                >
                  {link.name}
                </Link>
              </>
            );
          })}
        </div>
        <Link href="/profile"></Link>
      </div>

      {/* mobile version menu */}
      <div
        className={
          menuOpen
            ? "z-30 fixed bg-darkest-blue left-0 top-0 w-full h-screen flex flex-col justify-start"
            : "hidden"
        }
      >
        <div className="flex justify-end mr-6 p-3">
          <AiOutlineClose
            onClick={handleMenu}
            className="z-30 h-20 w-[25px] cursor-pointer"
          />
        </div>
        <ul className="flex flex-col justify-center items-center mt-28 uppercase font-bold tracking-wide">
          <li onClick={handleMenu} className="py-3">
            <Link href="/tournaments">Tournaments</Link>
          </li>
          <li onClick={handleMenu} className="py-3">
            <Link href="/about">About</Link>
          </li>
        </ul>
      </div>

      {/* mobile navbar */}
      <div className="sticky top-0 md:hidden backdrop-blur bg-darkest-blue bg-opacity-80 flex justify-between overflow-hidden z-30">
        <Link href="/">
          <div className="relative h-20 w-[79px]">
            <Image
              src="/new_small_logo.png"
              fill={true}
              alt="logo"
              className="p-3 ml-2"
            />
          </div>
        </Link>

        <AiOutlineMenu
          onClick={handleMenu}
          className="h-20 w-[25px] mr-6 cursor-pointer"
        />
      </div>
    </>
  );
};

export default Navbar;
