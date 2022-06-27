import { Link } from "react-router-dom";

export default function About() {
    return (
        <nav className="flex min-h-screen w-16 bg-[#292929] p-4 mr-2 justify-center items-center">
            <ul>
                <li>
                    <Link to="/">
                        <img src="#" alt="logo" />
                    </Link>
                </li>
                <hr className="m-1" />
                <li>
                    <Link to="/receive">
                        <img src="#" alt="receive" />
                    </Link>
                </li>
                <hr className="m-1" />
                <li>
                    <Link to="/about">
                        <img src="#" alt="about" />
                    </Link>
                </li>
            </ul>
        </nav>
    )
}