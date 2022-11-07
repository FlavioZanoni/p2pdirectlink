import React from "react"
import { Link } from "react-router-dom"

export const Navbar = () => {
  return (
    <aside className="flex min-h-screen w-14 bg-[#292929] p-4 mr-2 justify-center items-center">
      <ul>
        <li className="w-10">
          <Link to="/">
            <img src="/logo.svg" alt="logo" />
          </Link>
        </li>
        <hr className="m-1" />
        {/* <li>
                    <Link to="/receive">
                        <img src="#" alt="receive" />
                    </Link>
                </li>
                <hr className="m-1" /> */}
        <li className="w-10">
          <Link to="/about">
            <img src="/about.png" alt="about" />
          </Link>
        </li>
      </ul>
    </aside>
  )
}
