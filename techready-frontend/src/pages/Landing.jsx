import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Landing() {
  const navigate = useNavigate();

  const roles = [
    { title: "SDE", desc: "Software Development & DSA focused roles" },
    { title: "Data Analyst", desc: "Analytics, SQL, Excel & BI tools" },
    { title: "AI / ML", desc: "Machine learning & AI roles" },
    { title: "Consulting", desc: "Business & analytics consulting roles" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Get placement-ready with an{" "}
          <span className="text-blue-600">India-first AI coach</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          TechReady AI helps Indian college students analyze resumes, identify
          skill gaps, and follow personalized preparation roadmaps aligned with
          Indian hiring and campus placements.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/upload")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Start Now
          </button>

          <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100">
            View Demo
          </button>
        </div>
      </section>

      {/* Role Selection */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Choose your target role
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.title}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
              <p className="text-gray-600 mb-4">{role.desc}</p>

              <button
                onClick={() => navigate("/upload")}
                className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

