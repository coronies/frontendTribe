import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function StudentNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-blue-600 font-semibold"
            : "text-gray-700 hover:text-blue-500 transition";

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-white via-blue-50 to-white shadow-md ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight cursor-pointer">
                        Tribe
                    </div>

                    {/* Desktop Nav Links */}
                    <ul className="hidden md:flex items-center space-x-8 text-base">
                        <li><NavLink to="/clubs" className={linkClasses}>Explore Clubs</NavLink></li>
                        <li><NavLink to="/events" className={linkClasses}>Events</NavLink></li>
                        <li><NavLink to="/opportunities" className={linkClasses}>Opportunities</NavLink></li>
                        <li><NavLink to="/quiz" className={linkClasses}>Take Quiz</NavLink></li>
                        <li><NavLink to="/dashboard" className={linkClasses}>Dashboard</NavLink></li>
                        <li><NavLink to="/about" className={linkClasses}>About Us</NavLink></li>
                    </ul>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex space-x-3">
                        <NavLink
                            to="/register"
                            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition"
                        >
                            Sign up
                        </NavLink>
                        <NavLink
                            to="/login"
                            className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                        >
                            Login
                        </NavLink>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isOpen && (
                    <div className="md:hidden mt-2 space-y-4 pb-4">
                        <ul className="flex flex-col space-y-2 text-gray-700 text-base">
                            <li><NavLink to="/clubs" className={linkClasses}>Explore Clubs</NavLink></li>
                            <li><NavLink to="/events" className={linkClasses}>Events</NavLink></li>
                            <li><NavLink to="/opportunities" className={linkClasses}>Opportunities</NavLink></li>
                            <li><NavLink to="/quiz" className={linkClasses}>Take Quiz</NavLink></li>
                            <li><NavLink to="/dashboard" className={linkClasses}>Dashboard</NavLink></li>
                            <li><NavLink to="/about" className={linkClasses}>About Us</NavLink></li>
                        </ul>
                        <div className="flex flex-col space-y-2">
                            <NavLink
                                to="/register"
                                className="w-full px-4 py-2 text-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-90 transition"
                            >
                                Sign up
                            </NavLink>
                            <NavLink
                                to="/login"
                                className="w-full px-4 py-2 text-center rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                            >
                                Login
                            </NavLink>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default StudentNavbar;