import { NavLink, useNavigate } from "react-router-dom";
import React from "react";

const ClubNavbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // stores in cooki
        navigate("/login");
    };

    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "text-blue-600 font-semibold border-b-2 border-blue-600 transition-all"
            : "text-gray-600 hover:text-blue-500 transition-all";

    return (
        <nav className="w-full px-8 py-5 flex justify-between items-center shadow-sm bg-white font-sans">
            {/* Logo */}
            <div
                className="text-2xl font-bold text-blue-600 cursor-pointer tracking-tight"
                onClick={() => navigate("/")}
            >
                Tribe
            </div>

            {/* Navigation Links */}
            <div className="flex gap-8 items-center text-base">
                <NavLink to="/" className={getLinkClass}>
                    Homepage
                </NavLink>
                <NavLink to="/explore" className={getLinkClass}>
                    Explore Clubs
                </NavLink>
                <NavLink to="/dashboard" className={getLinkClass}>
                    Dashboard
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Log out
                </button>
            </div>
        </nav>
    );
};

export default ClubNavbar;