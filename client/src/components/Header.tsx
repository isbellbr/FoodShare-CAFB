import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onSearch?: () => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/auth");
    }
  };

  const Navbar = () => {
    const [location] = useLocation();
    return (
      <nav className="ml-6">
        <div className="flex items-center space-x-6 text-sm font-medium text-neutral-700">
          <Link href="/"><a className={`hover:underline ${location === "/" ? "text-primary" : ""}`}>Home</a></Link>
          <Link href="/search"><a className={`hover:underline ${location === "/search" ? "text-primary" : ""}`}>Search</a></Link>
          <Link href="/profile"><a className={`hover:underline ${location === "/profile" ? "text-primary" : ""}`}>Profile</a></Link>
          <Link href="/saved"><a className={`hover:underline ${location === "/saved" ? "text-primary" : ""}`}>Saved</a></Link>
          <Link href="/admin"><a className={`hover:underline ${location === "/admin" ? "text-primary" : ""}`}>Admin</a></Link>
        </div>
      </nav>
    );
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-xl font-heading font-semibold text-primary cursor-pointer">
              <span className="hidden md:inline">FoodShare</span>
              <span className="md:hidden">FS</span>
            </h1>
          </Link>
          <Navbar />
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="md:hidden focus:outline-none text-neutral-dark"
            aria-label="Search"
            onClick={onSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button
            className="focus:outline-none text-neutral-dark"
            aria-label="User profile"
            onClick={handleProfileClick}
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
