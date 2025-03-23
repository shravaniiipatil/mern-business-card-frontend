import React, { useState, useRef } from "react";
import BusinessCard from "./components/BusinessCard";
import html2canvas from "html2canvas";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    education: "",
    regNo: "",
    contact1: "", // ✅ Ensured Contact 1 Exists
    contact2: "", // ✅ Ensured Contact 2 Exists
    email: "",
    address: "",
    specialties: "",
    profilePic: ""
  });

  const cardRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "business_card.png";
        link.click();
      });
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>Create Your Business Card</h1>

      <div style={styles.formContainer}>
        <input type="text" name="designation" placeholder="Designation" onChange={handleChange} />
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />
        <input type="text" name="education" placeholder="Education" onChange={handleChange} />
        <input type="text" name="regNo" placeholder="Registration Number" onChange={handleChange} />
        
        {/* ✅ Corrected Input Names for Contact 1 & Contact 2 */}
        <input type="text" name="contact1" placeholder="Primary Contact Number" onChange={handleChange} />
        <input type="text" name="contact2" placeholder="Alternate Contact Number" onChange={handleChange} />

        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
        <textarea name="specialties" placeholder="Specialties (Comma Separated)" onChange={handleChange}></textarea>
        <input type="text" name="address" placeholder="Office Address" onChange={handleChange} />

        {/* Profile Picture Upload */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <h2>Preview:</h2>
        <div ref={cardRef}>
          <BusinessCard formData={formData} />
        </div>

        <button onClick={handleDownload} style={styles.downloadButton}>Download Card</button>
      </div>
    </div>
  );
}

const styles = {
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "500px",
    margin: "auto",
  },
  downloadButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;
