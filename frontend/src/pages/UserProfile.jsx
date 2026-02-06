import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setUser(res.data.data);
    };

    fetchUser();
  }, [id]);

  if (!user)
    return (
      <p className="text-center mt-20 text-lg font-semibold text-indigo-600">
        Loading profile...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-indigo-50 rounded-xl p-4">
            <h3 className="font-semibold text-indigo-700 mb-2">Education</h3>
            <p className="text-gray-700">{user.education || "—"}</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills && user.skills.length > 0
                ? user.skills.map((s, i) => (
                    <span
                      key={i}
                      className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))
                : "—"}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-700 mb-3">Projects</h3>

          {user.projects && user.projects.length > 0 ? (
            <div className="space-y-3">
              {user.projects.map((p, i) => (
                <div
                  key={i}
                  className="bg-white border border-blue-200 rounded-lg p-3"
                >
                  <p className="font-semibold text-gray-800">{p.title}</p>
                  <p className="text-gray-600 text-sm">{p.description}</p>
                  <a
                    href={p.link}
                    target="_blank"
                    className="text-blue-600 text-sm font-medium"
                  >
                    {p.link}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>—</p>
          )}
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-semibold text-green-700 mb-3">Work Experience</h3>

          {user.work && user.work.length > 0 ? (
            <div className="space-y-3">
              {user.work.map((w, i) => (
                <div
                  key={i}
                  className="bg-white border border-green-200 rounded-lg p-3"
                >
                  <p>
                    <span className="font-semibold">Role:</span> {w.role}
                  </p>
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {w.experience}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span> {w.type}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>—</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Social Links</h3>
          <div className="space-y-1">
            <p>
              GitHub:{" "}
              {user.links?.github ? (
                <a
                  href={user.links.github}
                  className="text-indigo-600"
                  target="_blank"
                >
                  {user.links.github}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p>
              LinkedIn:{" "}
              {user.links?.linkedin ? (
                <a
                  href={user.links.linkedin}
                  className="text-indigo-600"
                  target="_blank"
                >
                  {user.links.linkedin}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p>
              Portfolio:{" "}
              {user.links?.portfolio ? (
                <a
                  href={user.links.portfolio}
                  className="text-indigo-600"
                  target="_blank"
                >
                  {user.links.portfolio}
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
