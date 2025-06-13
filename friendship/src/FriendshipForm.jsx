// src/FriendshipForm.jsx
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import "./App.css";

export default function FriendshipForm() {
  const [form, setForm] = useState({
    name: "",
    memory: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, "entries"), form);
      setSubmitted(true);
      setForm({ name: "", memory: "", message: "" });
    } catch (error) {
      alert("Error submitting form");
      console.error(error);
    }
  };

  if (submitted) {
    return <div className="thanks">🎉 Thank you for your message! 🎉</div>;
  }

  return (
    <form className="friend-form" onSubmit={handleSubmit}>
      <h2>📖 Friendship Diary</h2>
      <label>
        Your Name:
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Favorite Memory with Me:
        <textarea
          name="memory"
          value={form.memory}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        A Message to Me:
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">📤 Submit</button>
    </form>
  );
}
