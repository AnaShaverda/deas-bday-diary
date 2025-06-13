import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "./firebase";

// Friendship Form Component
function FriendshipForm({ onSubmitSuccess }) {
  const [form, setForm] = useState({
    name: "",
    memory: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(firestore, "entries"), {
        ...form,
        timestamp: new Date().toISOString(),
      });
      setSubmitted(true);
      setForm({ name: "", memory: "", message: "" });
      setTimeout(() => {
        setSubmitted(false);
        onSubmitSuccess();
      }, 2000);
    } catch (error) {
      alert("Error submitting form");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you!</h2>
          <p className="text-gray-600">
            Your friendship memory has been saved! 💝
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            📖 Friendship Diary
          </h2>
          <p className="text-gray-600">Share a special memory with me!</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Memory with Me:
            </label>
            <textarea
              name="memory"
              value={form.memory}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="Tell me about your favorite memory..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              A Message to Me:
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="Write me a message..."
            />
          </div>

          <button
            type="submit"
            disabled={
              isSubmitting || !form.name || !form.memory || !form.message
            }
            className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none">
            {isSubmitting ? "📤 Submitting..." : "📤 Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Friendship Entries View Component
function FriendshipEntries({ onBackToForm }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const q = query(
          collection(firestore, "entries"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const entriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(entriesData);
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">📖</div>
          <p className="text-gray-600">Loading friendship memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                💝 Friendship Memories
              </h1>
              <p className="text-gray-600">
                {entries.length} beautiful{" "}
                {entries.length === 1 ? "memory" : "memories"} shared
              </p>
            </div>
            <button
              onClick={onBackToForm}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
              ✏️ Add New Entry
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No memories yet
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to share a friendship memory!
            </p>
            <button
              onClick={onBackToForm}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200">
              📖 Share Your Memory
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {entry.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-2xl">👥</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      🌟 Favorite Memory
                    </h4>
                    <p className="text-gray-800 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      {entry.memory}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      💌 Message
                    </h4>
                    <p className="text-gray-800 bg-pink-50 p-3 rounded-lg border-l-4 border-pink-400">
                      {entry.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
export default function FriendshipDiaryApp() {
  const [currentView, setCurrentView] = useState("form");

  const handleSubmitSuccess = () => {
    if (currentView === "entries") {
      setCurrentView("form");
      setTimeout(() => setCurrentView("entries"), 100);
    }
  };

  const handleViewEntries = () => setCurrentView("entries");
  const handleBackToForm = () => setCurrentView("form");

  return (
    <div>
      {currentView === "form" ? (
        <div className="relative">
          <FriendshipForm onSubmitSuccess={handleSubmitSuccess} />
          <button
            onClick={handleViewEntries}
            className="fixed top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium">
            📚 View All Memories
          </button>
        </div>
      ) : (
        <FriendshipEntries onBackToForm={handleBackToForm} />
      )}
    </div>
  );
}
