import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, fetchProfile } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        education: user.education || "",
        skills: user.skills || [],
        projects: user.projects || [],
        work: user.work || [],
        links: {
          github: user.links?.github || "",
          linkedin: user.links?.linkedin || "",
          portfolio: user.links?.portfolio || "",
        },
      });
    }
  }, [user]);

  if (!form)
    return (
      <p className="text-center mt-20 text-indigo-600 font-semibold">
        Loading...
      </p>
    );

  const saveProfile = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/update-profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("Profile updated successfully");
      setEdit(false);
      fetchProfile();
      setLoading(false);
    } catch {
      setLoading(false);
      toast.error("Update failed");
    }
  };

  const addProject = () => {
    setForm({
      ...form,
      projects: [...form.projects, { title: "", link: "", description: "" }],
    });
  };

  const removeProject = (index) => {
    setForm({
      ...form,
      projects: form.projects.filter((_, i) => i !== index),
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...form.projects];
    updated[index][field] = value;
    setForm({ ...form, projects: updated });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="flex justify-between">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => setEdit(!edit)}
          >
            {edit ? "Cancel" : "Edit"}
          </button>

          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4">
          <h3 className="font-semibold text-indigo-700 mb-2">Education</h3>
          {edit ? (
            <input
              className="w-full border border-gray-300 p-2 rounded"
              value={form.education}
              onChange={(e) => setForm({ ...form, education: e.target.value })}
            />
          ) : (
            <p>{user.education || "Not added"}</p>
          )}
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <h3 className="font-semibold text-purple-700 mb-2">Skills</h3>
          {edit ? (
            <input
              className="w-full border border-gray-300 p-2 rounded"
              value={form.skills.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.skills?.length > 0
                ? user.skills.map((s, i) => (
                    <span
                      key={i}
                      className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))
                : "Not added"}
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-blue-700">Projects</h3>

          {form.projects.length === 0 && !edit && <p>No projects added</p>}

          {form.projects.map((p, i) => (
            <div key={i} className="bg-white border rounded-lg p-4 space-y-2">
              {edit ? (
                <>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Title"
                    value={p.title}
                    onChange={(e) => updateProject(i, "title", e.target.value)}
                  />
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Project Link"
                    value={p.link}
                    onChange={(e) => updateProject(i, "link", e.target.value)}
                  />
                  <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Description"
                    value={p.description}
                    onChange={(e) =>
                      updateProject(i, "description", e.target.value)
                    }
                  />
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => removeProject(i)}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <p className="font-semibold">{p.title}</p>
                  <p>{p.description}</p>
                  <p className="text-blue-600">{p.link}</p>
                </>
              )}
            </div>
          ))}

          {edit && (
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={addProject}
            >
              + Add Project
            </button>
          )}
        </div>

        <div className="bg-green-50 rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-green-700">Work / Experience</h3>

          {form.work.length === 0 && !edit && <p>No work added</p>}

          {form.work.map((w, i) => (
            <div key={i} className="bg-white border rounded-lg p-4 space-y-2">
              {edit ? (
                <>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Role"
                    value={w.role}
                    onChange={(e) => {
                      const updated = [...form.work];
                      updated[i].role = e.target.value;
                      setForm({ ...form, work: updated });
                    }}
                  />
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Experience"
                    value={w.experience}
                    onChange={(e) => {
                      const updated = [...form.work];
                      updated[i].experience = e.target.value;
                      setForm({ ...form, work: updated });
                    }}
                  />
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Type"
                    value={w.type}
                    onChange={(e) => {
                      const updated = [...form.work];
                      updated[i].type = e.target.value;
                      setForm({ ...form, work: updated });
                    }}
                  />
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      setForm({
                        ...form,
                        work: form.work.filter((_, idx) => idx !== i),
                      })
                    }
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <p>
                    <b>Role:</b> {w.role}
                  </p>
                  <p>
                    <b>Experience:</b> {w.experience}
                  </p>
                  <p>
                    <b>Type:</b> {w.type}
                  </p>
                </>
              )}
            </div>
          ))}

          {edit && (
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={() =>
                setForm({
                  ...form,
                  work: [...form.work, { role: "", experience: "", type: "" }],
                })
              }
            >
              + Add Work
            </button>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-gray-700">Social Links</h3>
          {edit ? (
            <>
              <input
                className="w-full border p-2 rounded"
                placeholder="GitHub"
                value={form.links.github}
                onChange={(e) =>
                  setForm({
                    ...form,
                    links: { ...form.links, github: e.target.value },
                  })
                }
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="LinkedIn"
                value={form.links.linkedin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    links: { ...form.links, linkedin: e.target.value },
                  })
                }
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Portfolio"
                value={form.links.portfolio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    links: { ...form.links, portfolio: e.target.value },
                  })
                }
              />
            </>
          ) : (
            <>
              <p>GitHub: {user.links?.github || "—"}</p>
              <p>LinkedIn: {user.links?.linkedin || "—"}</p>
              <p>Portfolio: {user.links?.portfolio || "—"}</p>
            </>
          )}
        </div>

        {edit && (
          <button
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            onClick={saveProfile}
          >
            {loading ? "Saving changes" : "Save Profile"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
