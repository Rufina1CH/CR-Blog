import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ email: propEmail }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState(propEmail || localStorage.getItem("email"));
  const navigate = useNavigate();

  useEffect(() => {
    if (propEmail) {
      setEmail(propEmail);
    }
  }, [propEmail]);

  useEffect(() => {
    const onStorageChange = () => {
      setEmail(localStorage.getItem("email"));
    };

    window.addEventListener("storageChange", onStorageChange);

    return () => {
      window.removeEventListener("storageChange", onStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token_type");
    localStorage.removeItem("email");
    setEmail(null);
    setDropdownOpen(false);
    navigate("/login");
    window.dispatchEvent(new Event("storageChange"));
  };

  return (
    <header className="w-full bg-white border-b shadow sticky top-0 z-50" style={{ padding: "0.5rem" }}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-purple-700">
            CR-Blog
          </Link>
        </div>

        <div className="flex items-center gap-6 ml-auto">
          <nav className="flex gap-3">
            <Link
              to="/create"
              className="font-medium px-4 py-2 rounded-md text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition"
              style={{ padding: "0.5rem" }}
            >
              Create
            </Link>
          </nav>

          

          {email ? (
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div
                className="font-medium px-4 py-2 rounded-md text-purple-700 cursor-pointer select-none"
                style={{ padding: "0.5rem" }}
              >
                Hello, {email}
              </div>
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  style={{ minWidth: "6rem" }}
                >
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="font-medium px-4 py-2 rounded-md text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition"
              style={{ padding: "0.5rem" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
