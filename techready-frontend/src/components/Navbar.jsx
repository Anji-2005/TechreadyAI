import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          TechReady AI
        </Link>

        <div className="space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/upload" className="text-gray-600 hover:text-blue-600">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
