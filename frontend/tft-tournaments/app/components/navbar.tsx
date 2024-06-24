"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
// import { IoPerson } from "react-icons/io5";
// import { FaSearch } from "react-icons/fa";

//"use client";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const currentScrollPos = window.scrollY;
        setIsScrolled(currentScrollPos === 0);
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const navLinks = [
    { name: "Tournaments", href: "/tournaments" },
    { name: "About", href: "/about" },
  ];

  // const Navbar = () => {
  const pathname = usePathname();
  return (
    <>
      {/* desktop navbar */}
      <div className="sticky hidden md:flex flex-row justify-between overflow-hidden bg-slate-500">
        <Link href="/">
          <div className="relative h-20 w-20">
            <Image
              src="/tft-logo.png"
              fill={true}
              alt="logo"
              className=" p-1"
            />
          </div>
        </Link>

        <div className="items-center px-[8rem] grid grid-flow-col gap-[2.5rem] text-center uppercase font-gamay font-bold tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname && pathname.startsWith(link.href);
            return (
              <>
                <Link
                  href={link.href}
                  key={link.name}
                  className={
                    isActive
                      ? "font-bold bg-slate-400 rounded-md h-7 p-5 items-center flex"
                      : "bg-opacity-0 transition-all ease-in-out duration:300 delay-100 hover:bg-slate-400 rounded-md h-7 p-5 items-center flex"
                  }
                >
                  {link.name}
                </Link>
              </>
            );
          })}
        </div>
        {/* <FaSearch className="h-20 w-7 ml-20 mr-10" /> */}
        <Link href="/profile">
          {/* <IoPerson className="h-20 w-8 mr-14" /> */}
        </Link>
      </div>

      {/* mobile version menu */}
      <div
        className={
          menuOpen
            ? "fixed left-0 top-0 w-full h-screen bg-slate-500 flex flex-col justify-start z-10"
            : "hidden"
        }
      >
        <div className="flex justify-end mr-6 p-3">
          <AiOutlineClose
            onClick={handleMenu}
            className="h-20 w-[25px] cursor-pointer"
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
      <div className="sticky md:hidden flex justify-between overflow-hidden bg-slate-500">
        <Link href="/">
          <div className="relative h-20 w-20">
            <Image
              src="/tft-logo.png"
              fill={true}
              alt="logo"
              className=" p-1"
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
