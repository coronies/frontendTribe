import { NavLink } from 'react-router-dom';

function StudentNavbar() {
    return (
        <nav className="w-full bg-white border-b border-gray-200 shadow-sm font-mono">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                {/* Left: Logo/Title */}
                <div className="flex-shrink-0 text-xl font-bold text-blue-700 tracking-tight">Tribe</div>
                {/* Center: Navigation Links */}
                <ul className="hidden md:flex space-x-8 text-base text-gray-700">
                    <li>
                        <NavLink
                            to="/clubs"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 transition"
                                    : "hover:text-blue-600 transition"
                            }
                        >
                            Explore Clubs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/events"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 transition"
                                    : "hover:text-blue-600 transition"
                            }
                        >
                            Events
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/opportunities"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 transition"
                                    : "hover:text-blue-600 transition"
                            }
                        >
                            Opportunities
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/quiz"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 transition"
                                    : "hover:text-blue-600 transition"
                            }
                        >
                            Take quiz
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 transition"
                                    : "hover:text-blue-600 transition"
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 transition"
                                    : "hover:text-blue-600 transition"
                            }
                        >
                            About us
                        </NavLink>
                    </li>
                </ul>
                {/* Right: Auth Buttons */}
                <div className="flex space-x-2">
                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            isActive
                                ? "px-4 py-1 rounded border border-blue-600 bg-blue-50 text-blue-600 font-semibold transition"
                                : "px-4 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold transition"
                        }
                    >
                        Sign up
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive
                                ? "px-4 py-1 rounded border border-gray-400 bg-gray-100 text-gray-700 font-semibold transition"
                                : "px-4 py-1 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 font-semibold transition"
                        }
                    >
                        Login
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default StudentNavbar;
