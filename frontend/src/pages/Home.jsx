import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const search = async (pageNumber = 1) => {
    if (!query.trim()) {
      toast.error("Please enter a skill");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/search?q=${query}&page=${pageNumber}&limit=6`,
      );

      setResults(res.data.data || []);
      setPage(res.data.pagination.page);
      setTotalPages(res.data.pagination.totalPages);
    } catch {
      toast.error("Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-indigo-600 hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          SkillConnect
        </h1>

        <div className="flex gap-4 items-center">
          <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => navigate("/profile")}
          >
            My Profile
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center text-center py-16 px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Find Developers by Skills
        </h2>

        <div className="w-full max-w-3xl flex gap-3">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="React, Java, MERN"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700"
            onClick={() => search(1)}
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="mt-6 text-indigo-600 font-semibold">
            Searching profiles...
          </p>
        )}
      </div>

      <div className="px-10 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {u.name}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  <b>Skills:</b> {u.skills?.join(", ") || "—"}
                </p>

                <p className="text-sm text-gray-600">
                  <b>Projects:</b>{" "}
                  {u.projects?.length
                    ? u.projects.map((p) => p.title).join(", ")
                    : "—"}
                </p>
              </div>

              <button
                className="mt-6 bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
                onClick={() => navigate(`/user/${u._id}`)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-10">
            <button
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => search(page - 1)}
            >
              Prev
            </button>

            <span className="font-semibold">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => search(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
