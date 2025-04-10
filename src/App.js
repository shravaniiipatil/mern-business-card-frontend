import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import html2canvas from "html2canvas";
import QRCode from "qrcode.react";
import BusinessCard from "./components/BusinessCard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/create-card" element={<BusinessCardPage />} />
        <Route path="/saved-cards" element={<SavedCardsPage />} />
      </Routes>
    </Router>
  );
}

// 🔐 Login Page
function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "admin123") {
      onLogin();
      navigate("/home");
    } else {
      setError("Invalid credentials. Try admin@example.com / admin123");
    }
  };

  return (
    <div style={loginStyles.page}>
      <div style={loginStyles.card}>
        <h2>🔐 Welcome to <span style={{ color: "#007BFF" }}>QRCARD</span></h2>
        <form onSubmit={handleLogin} style={loginStyles.form}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={loginStyles.input} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={loginStyles.input} />
          {error && <p style={loginStyles.error}>{error}</p>}
          <button type="submit" style={loginStyles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}

// 🧭 Navbar
function Navbar() {
  return (
    <nav style={navStyles.container}>
      <Link to="/home" style={navStyles.link}>Home</Link>
      <Link to="/about" style={navStyles.link}>About</Link>
      <Link to="/create-card" style={navStyles.link}>Create Card</Link>
      <Link to="/saved-cards" style={navStyles.link}>Saved Cards</Link>
    </nav>
  );
}

// 🏠 Home Page
function HomePage() {
  return (
    <div style={homePageStyles.page}>
      <h1 style={homePageStyles.title}>Welcome to QRCARD</h1>
      <p style={homePageStyles.subtitle}>Create and manage your digital business card effortlessly!</p>
      <div style={homePageStyles.featuresContainer}>
        <div style={homePageStyles.feature}>
          <h3>Create & Customize</h3>
          <p>Design your personalized digital business card with your details and a professional look.</p>
        </div>
        <div style={homePageStyles.feature}>
          <h3>Share Instantly</h3>
          <p>Generate a QR code and share your card with others, making networking more effective.</p>
        </div>
        <div style={homePageStyles.feature}>
          <h3>Download & Save</h3>
          <p>Download your card as an image and keep it saved for future use. It's that simple!</p>
        </div>
      </div>
    </div>
  );
}

// ℹ️ About Page
function AboutPage() {
  return (
    <div style={aboutPageStyles.page}>
      <h1 style={aboutPageStyles.title}>About QRCARD</h1>
      <p style={aboutPageStyles.description}>
        QRCARD is a revolutionary platform designed to create digital business cards effortlessly. 
        It's built with the latest web technologies and offers a seamless user experience. 
        Our goal is to help professionals and businesses enhance their networking through a modern, eco-friendly digital solution.
      </p>
      <div style={aboutPageStyles.featuresContainer}>
        <div style={aboutPageStyles.feature}>
          <h3>Why Choose QRCARD?</h3>
          <ul>
            <li>Instant digital card generation</li>
            <li>Customizable with your unique details</li>
            <li>Easy sharing with a scannable QR code</li>
            <li>Quick download in high-quality image format</li>
            <li>Environmentally friendly—no need for physical cards</li>
          </ul>
        </div>
        <div style={aboutPageStyles.feature}>
          <h3>Our Mission</h3>
          <p>Our mission is to empower individuals and businesses with a smart and sustainable solution for managing business cards in the digital age.</p>
        </div>
      </div>
    </div>
  );
}

// 🎨 Create Business Card Page
function BusinessCardPage() {
  const [formData, setFormData] = useState({
    name: "", designation: "", education: "", regNo: "",
    contact1: "", contact2: "", email: "", address: "",
    specialties: "", profilePic: ""
  });

  const cardRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, profilePic: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current).then((canvas) => {
        const cardImage = canvas.toDataURL("image/png");
        const savedCards = JSON.parse(localStorage.getItem("savedCards")) || [];

        const timestamp = new Date();
        const formattedTime = timestamp.toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });

        const newCard = {
          ...formData,
          createdAt: formattedTime,
          cardImage,
        };

        savedCards.push(newCard);
        localStorage.setItem("savedCards", JSON.stringify(savedCards));

        const link = document.createElement("a");
        link.href = cardImage;
        link.download = "business_card.png";
        link.click();
      });
    }
  };

  return (
    <div style={pageStyle}>
      <h1>Create Your Digital Business Card</h1>
      <div style={formStyles.container}>
        <input type="text" name="designation" placeholder="Designation" onChange={handleChange} />
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />
        <input type="text" name="education" placeholder="Education" onChange={handleChange} />
        <input type="text" name="regNo" placeholder="Registration Number" onChange={handleChange} />
        <input type="text" name="contact1" placeholder="Primary Contact Number" onChange={handleChange} />
        <input type="text" name="contact2" placeholder="Alternate Contact Number" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} />
        <textarea name="specialties" placeholder="Specialties (Comma Separated)" onChange={handleChange}></textarea>
        <input type="text" name="address" placeholder="Office Address" onChange={handleChange} />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <h3>Preview:</h3>
        <div ref={cardRef}><BusinessCard formData={formData} /></div>
        <button onClick={handleDownload} style={formStyles.button}>Download Card</button>
      </div>
    </div>
  );
}

// 💾 Saved Cards Page with Search/Filter and Delete Option
function SavedCardsPage() {
  const [savedCards, setSavedCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const cards = JSON.parse(localStorage.getItem("savedCards")) || [];
    setSavedCards(cards);
  }, []);

  // Function to delete a card
  const handleDeleteCard = (cardIndex) => {
    const updatedCards = savedCards.filter((_, index) => index !== cardIndex);
    localStorage.setItem("savedCards", JSON.stringify(updatedCards));
    setSavedCards(updatedCards);
  };

  // Filter cards based on search query
  const filteredCards = savedCards.filter(card => 
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.contact1.includes(searchQuery)
  );

  return (
    <div style={pageStyle}>
      <h1>📚 Saved Business Cards</h1>
      
      {/* Search bar */}
      <input 
        type="text" 
        placeholder="Search by Name, Email, or Contact" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      
      {filteredCards.length === 0 ? (
        <p>No saved cards found.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
          {filteredCards.map((card, index) => (
            <div key={index} style={cardStyles.card}>
              <img src={card.cardImage} alt="Card" style={{ width: "100%", borderRadius: "8px" }} />
              <p><strong>{card.name}</strong></p>
              <p>{card.email}</p>
              <p>{card.contact1}</p>
              <p style={{ fontSize: "12px", color: "#888" }}>Created on: {card.createdAt}</p>
              {/* Delete Button */}
              <button 
                onClick={() => handleDeleteCard(index)} 
                style={cardStyles.deleteButton}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✨ Styles
const navStyles = {
  container: {
    display: "flex", gap: "20px", padding: "15px",
    backgroundColor: "#007BFF", justifyContent: "center", color: "#fff",
  },
  link: {
    color: "#fff", textDecoration: "none", fontWeight: "bold", fontSize: "16px",
  }
};

const loginStyles = {
  page: {
    display: "flex", justifyContent: "center", alignItems: "center",
    height: "100vh", background: "linear-gradient(to right, #74ebd5, #9face6)"
  },
  card: {
    background: "#fff", padding: "40px", borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)", width: "350px", textAlign: "center"
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #ccc" },
  button: {
    padding: "12px", borderRadius: "8px", backgroundColor: "#007BFF",
    color: "white", border: "none", cursor: "pointer", fontWeight: "bold"
  },
  error: { color: "red", fontSize: "14px", marginTop: "-5px" }
};

const pageStyle = {
  padding: "30px", textAlign: "center", fontFamily: "Arial, sans-serif"
};

const formStyles = {
  container: {
    display: "flex", flexDirection: "column", gap: "10px",
    maxWidth: "500px", margin: "auto"
  },
  button: {
    marginTop: "10px", padding: "10px",
    backgroundColor: "#007BFF", color: "white",
    border: "none", borderRadius: "5px", cursor: "pointer"
  }
};

const cardStyles = {
  card: {
    background: "#fff", padding: "15px", borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)", width: "300px", textAlign: "left"
  },
  deleteButton: {
    marginTop: "10px", padding: "8px", backgroundColor: "red", color: "white",
    border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "14px"
  }
};

const homePageStyles = {
  page: {
    padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4"
  },
  title: {
    fontSize: "2.5rem", fontWeight: "bold", color: "#333"
  },
  subtitle: {
    fontSize: "1.2rem", color: "#666", marginBottom: "30px"
  },
  featuresContainer: {
    display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap"
  },
  feature: {
    background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "250px", textAlign: "center"
  }
};

const aboutPageStyles = {
  page: {
    padding: "40px", textAlign: "center", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9"
  },
  title: {
    fontSize: "2.5rem", fontWeight: "bold", color: "#333"
  },
  description: {
    fontSize: "1.2rem", color: "#666", marginBottom: "40px"
  },
  featuresContainer: {
    display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap"
  },
  feature: {
    background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "300px", textAlign: "center"
  }
};

export default App;
