import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "./firebase";
import "./App.css";

function FriendshipForm({ onSubmitSuccess }) {
  const [form, setForm] = useState({ name: "", memory: "", message: "" });
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
      <div className="submitted-container">
        <div className="submitted-message">
          <div className="emoji">🎉</div>
          <h2>Thank you!</h2>
          <p>Your friendship memory has been saved! 💝</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-box">
        <div className="form-header">
          <h2>📖 Friendship Diary</h2>
          <p>Share a special memory with me!</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Your Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name..."
            />
          </label>

          <label>
            Favorite Memory with Me:
            <textarea
              name="memory"
              value={form.memory}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Tell me about your favorite memory..."
            />
          </label>

          <label>
            A Message to Me:
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Write me a message..."
            />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "📤 Submitting..." : "📤 Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

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
      <div className="loading">
        <div className="emoji">📖</div>
        <p>Loading friendship memories...</p>
      </div>
    );
  }

  return (
    <div className="entries-container">
      <div className="entries-header">
        <h1>💝 Friendship Memories</h1>
        <p>
          {entries.length} {entries.length === 1 ? "memory" : "memories"} shared
        </p>
        <button className="back-button" onClick={onBackToForm}>
          ✏️ Add New Entry
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="no-entries">
          <div className="emoji">📝</div>
          <h3>No memories yet</h3>
          <p>Be the first to share a friendship memory!</p>
          <button className="back-button" onClick={onBackToForm}>
            📖 Share Your Memory
          </button>
        </div>
      ) : (
        <div className="entries-grid">
          {entries.map((entry) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <h3>{entry.name}</h3>
                <p>{new Date(entry.timestamp).toLocaleString()}</p>
                <div className="emoji">👥</div>
              </div>
              <div className="entry-body">
                <div>
                  <h4>🌟 Favorite Memory</h4>
                  <p>{entry.memory}</p>
                </div>
                <div>
                  <h4>💌 Message</h4>
                  <p>{entry.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
        <div className="main-view">
          <FriendshipForm onSubmitSuccess={handleSubmitSuccess} />
          <button className="view-entries-btn" onClick={handleViewEntries}>
            📚 View All Memories
          </button>
        </div>
      ) : (
        <FriendshipEntries onBackToForm={handleBackToForm} />
      )}
    </div>
  );
}
