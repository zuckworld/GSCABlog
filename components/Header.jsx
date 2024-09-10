import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories } from "../services";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    getCategories().then((newCategories) => {
      setCategories(newCategories);
    });
  }, []);

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="border-b w-full inline-block border-red-700 py-8">
        <div className="md:float-left block">
          <Link href="/">
            <span className="cursor-pointer font-bold text-4xl text-red-700">
              GSCA
            </span>
          </Link>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className="md:hidden grid relative justify-end">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="text-white font-semibold text-sm bg-red-700 px-4 py-2 rounded-md shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Categories
          </button>
          {isDropdownOpen && (
            <div className="postcardtab border mt-2 rounded shadow-lg z-10 w-full">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  passHref
                >
                  <div className="block px-4 py-2 hover:bg-blue-200 cursor-pointer">
                    {category.name}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:float-left md:contents">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              passHref
            >
              <span className="md:float-right mt-2 align-middle text-red-700 ml-4 font-semibold text-sm cursor-pointer">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
