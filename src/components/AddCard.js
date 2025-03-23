import React, { useState } from "react";
import API_BASE_URL from "../config";

const AddCard = () => {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCard = { name, jobTitle };

    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    });

    if (response.ok) {
      alert("Business Card Added!");
      setName("");
      setJobTitle("");
    }
  };

  return (
    <div>
      <h2>Add New Business Card</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <button type="submit">Add Card</button>
      </form>
    </div>
  );
};

export default AddCard;
