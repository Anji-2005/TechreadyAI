import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Upload() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");

  const [role, setRole] = useState("");
  const [year, setYear] = useState("");
  const [time, setTime] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Upload your resume</h1>
        <p className="text-gray-600 mb-10">
          Upload your resume and tell us your career goal. Our AI will analyze
          your profile and generate a personalized placement roadmap.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Resume</h2>

            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
              <p className="text-gray-600">
                {fileName ? fileName : "Click to upload PDF or DOCX"}
              </p>
            </label>
          </div>

          {/* Career Context */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Career Goal</h2>

            <div className="space-y-4">
              <select
                className="w-full p-3 border rounded-lg"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Target Role</option>
                <option>SDE</option>
                <option>Data Analyst</option>
                <option>AI / ML</option>
                <option>Consulting</option>
              </select>

              <select
                className="w-full p-3 border rounded-lg"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">Graduation Year</option>
                <option>2026</option>
                <option>2027</option>
                <option>2028</option>
              </select>

              <select
                className="w-full p-3 border rounded-lg"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Weekly Time Commitment</option>
                <option>5–7 hours</option>
                <option>8–12 hours</option>
                <option>12+ hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={() =>
              navigate("/dashboard", {
                state: { role, year, time },
              })
            }
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Analyze Resume
          </button>
        </div>
      </div>
    </div>
  );
}

