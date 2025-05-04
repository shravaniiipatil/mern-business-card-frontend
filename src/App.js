import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from "react-router-dom";
import html2canvas from "html2canvas";
import QRCode from "qrcode.react";
import BusinessCard from "./components/BusinessCard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 const handleLogout = () => {
    localStorage.removeItem("loggedInEmail"); // Clear localStorage or session data
    setIsAuthenticated(false); // Update the authentication state to false
  };
  return (
    <Router>
{isAuthenticated && <Navbar onLogout={handleLogout} />}

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

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  // Default email and password stored directly in the code
  const defaultEmail = "admin@example.com";
  const defaultPassword = "admin123";

  // Regular expression for validating email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if the entered credentials match the default admin email/password
    if (email === defaultEmail && password === defaultPassword) {
      // Store the logged-in email to localStorage
      localStorage.setItem("loggedInEmail", email);
      onLogin();
      navigate("/home");
    } else {
      // Check for signed-up users in localStorage
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const { storedEmail, storedPassword } = JSON.parse(savedUser);
        if (email === storedEmail && password === storedPassword) {
          // If the user matches a signed-up user, allow login
          localStorage.setItem("loggedInEmail", email);
          onLogin();
          navigate("/home");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else {
        setError("No users found. Please sign up first.");
      }
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // Validate the email format
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password === confirmPassword) {
      const user = {
        storedEmail: email,
        storedPassword: password,
      };
      // Store the signed-up user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      setError("");
      alert("Signup successful! Please log in.");
      setIsSignup(false);
    } else {
      setError("Passwords do not match.");
    }
  };

  return (
    <div style={loginStyles.page}>
      <div style={loginStyles.card}>
        <h2>🔐 Welcome to <span style={{ color: "#007BFF" }}>QRCARD</span></h2>
        <form onSubmit={isSignup ? handleSignup : handleLogin} style={loginStyles.form}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={loginStyles.input} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={loginStyles.input} 
          />
          {isSignup && (
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              style={loginStyles.input} 
            />
          )}
          {error && <p style={loginStyles.error}>{error}</p>}
          <button 
            type="submit" 
            style={loginStyles.button} 
            onMouseEnter={(e) => e.target.style = { ...loginStyles.button, ...loginStyles.buttonHover }} 
            onMouseLeave={(e) => e.target.style = loginStyles.button}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p 
          style={loginStyles.toggleText} 
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          }}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}



function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Call the onLogout function passed from App
      navigate("/"); // Redirect to the login page
    } else {
      console.error("onLogout function is not passed correctly!");
    }
  };

  return (
    <nav style={navStyles.container}>
      <Link
        to="/home"
        style={navStyles.link}
        onMouseEnter={(e) => e.target.style = { ...navStyles.link, ...navStyles.linkHover }}
        onMouseLeave={(e) => e.target.style = navStyles.link}
      >
        Home
      </Link>
      <Link
        to="/about"
        style={navStyles.link}
        onMouseEnter={(e) => e.target.style = { ...navStyles.link, ...navStyles.linkHover }}
        onMouseLeave={(e) => e.target.style = navStyles.link}
      >
        About
      </Link>
      <Link
        to="/create-card"
        style={navStyles.link}
        onMouseEnter={(e) => e.target.style = { ...navStyles.link, ...navStyles.linkHover }}
        onMouseLeave={(e) => e.target.style = navStyles.link}
      >
        Create Card
      </Link>
      <Link
        to="/saved-cards"
        style={navStyles.link}
        onMouseEnter={(e) => e.target.style = { ...navStyles.link, ...navStyles.linkHover }}
        onMouseLeave={(e) => e.target.style = navStyles.link}
      >
        Saved Cards
      </Link>
      <button
        onClick={handleLogout}
        style={navStyles.logoutButton}
      >
        Logout
      </button>
    </nav>
  );
}


// 🏠 Home Page
function HomePage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={homePageStyles.page}>
      <h1 style={homePageStyles.title}>Welcome to QRCARD</h1>
      <p style={homePageStyles.subtitle}>Create and manage your digital business card effortlessly!</p>

      <div style={homePageStyles.featuresContainer}>
        <div
          style={hovered === 1 ? { ...homePageStyles.feature, ...homePageStyles.featureHover } : homePageStyles.feature}
          onMouseEnter={() => setHovered(1)}
          onMouseLeave={() => setHovered(null)}
        >
          <h2><u>Create & Customize</u></h2>
          <p>Design your personalized digital business card with your details and a professional look.</p>
        </div>
        <div
          style={hovered === 2 ? { ...homePageStyles.feature, ...homePageStyles.featureHover } : homePageStyles.feature}
          onMouseEnter={() => setHovered(2)}
          onMouseLeave={() => setHovered(null)}
        >
          <h2><u>Share Instantly</u></h2>
          <p>Generate a QR code and share your card with others, making networking more effective.</p>
        </div>
        <div
          style={hovered === 3 ? { ...homePageStyles.feature, ...homePageStyles.featureHover } : homePageStyles.feature}
          onMouseEnter={() => setHovered(3)}
          onMouseLeave={() => setHovered(null)}
        >
          <h2><u>Download & Save</u></h2>
          <p>Download your card as an image and keep it saved for future use. It's that simple!</p>
        </div>
      </div>
    </div>
  );
}

// ℹ️ About Page
function AboutPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={aboutPageStyles.page}>
      <h1 style={aboutPageStyles.title}>About QRCARD</h1>
      <p style={aboutPageStyles.description}>
        QRCARD is a revolutionary platform designed to create digital business cards effortlessly. 
        It's built with the latest web technologies and offers a seamless user experience. 
        Our goal is to help professionals and businesses enhance their networking through a modern, eco-friendly digital solution.
      </p>
      <div style={aboutPageStyles.featuresContainer}>
        <div
          style={hovered === 1 ? { ...aboutPageStyles.feature, ...aboutPageStyles.featureHover } : aboutPageStyles.feature}
          onMouseEnter={() => setHovered(1)}
          onMouseLeave={() => setHovered(null)}
        >
          <h2>Why Choose QRCARD?</h2>
          <ul>
            <li>Instant digital card generation</li>
            <li>Customizable with your unique details</li>
            <li>Easy sharing with a scannable QR code</li>
            <li>Quick download in high-quality image format</li>
            <li>Environmentally friendly—no need for physical cards</li>
          </ul>
        </div>
        <div
          style={hovered === 2 ? { ...aboutPageStyles.feature, ...aboutPageStyles.featureHover } : aboutPageStyles.feature}
          onMouseEnter={() => setHovered(2)}
          onMouseLeave={() => setHovered(null)}
        >
          <h2><u>Our Mission</u></h2>
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
        <input
          style={formStyles.input}
          type="text"
          name="designation"
          placeholder="Designation"
          onChange={handleChange}
        />
        <input
          style={formStyles.input}
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />
        <input
          style={formStyles.input}
          type="text"
          name="education"
          placeholder="Education"
          onChange={handleChange}
        />
        <input
          style={formStyles.input}
          type="text"
          name="regNo"
          placeholder="Registration Number"
          onChange={handleChange}
        />
        <input
          style={formStyles.input}
          type="text"
          name="contact1"
          placeholder="Primary Contact Number"
          onChange={handleChange}
        />
        <input
          style={formStyles.input}
          type="text"
          name="contact2"
          placeholder="Alternate Contact Number"
          onChange={handleChange}
        />
        <input
          style={formStyles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
        />
        <textarea
          style={formStyles.textarea}
          name="specialties"
          placeholder="Specialties (Comma Separated)"
          onChange={handleChange}
        />
        <input
          style={formStyles.input}
          type="text"
          name="address"
          placeholder="Office Address"
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <h3>Preview:</h3>
        <div ref={cardRef}>
          <BusinessCard formData={formData} />
        </div>
        <button
          onClick={handleDownload}
          style={formStyles.button}
          onMouseEnter={(e) => e.target.style = { ...formStyles.button, ...formStyles.buttonHover }}
          onMouseLeave={(e) => e.target.style = formStyles.button}
        >
          Download Card
        </button>
      </div>
    </div>
  );
}


// 💾 Saved Cards Page with Search/Filter and Delete Option
function SavedCardsPage() {
  const [savedCards, setSavedCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userEmail = localStorage.getItem("loggedInEmail");  // Get logged-in user's email

  useEffect(() => {
    const cards = JSON.parse(localStorage.getItem("savedCards")) || [];
    setSavedCards(cards);
  }, []);

  const handleDeleteCard = (cardIndex) => {
    const cardToDelete = savedCards[cardIndex];

    // Allow deletion if the logged-in user is either the admin or the card owner
    if (userEmail === "admin@example.com" || cardToDelete.ownerEmail === userEmail) {
      const updatedCards = savedCards.filter((_, index) => index !== cardIndex);
      localStorage.setItem("savedCards", JSON.stringify(updatedCards));
      setSavedCards(updatedCards);
    } else {
      alert("You are not authorized to delete this card.");
    }
  };

  const filteredCards = savedCards.filter(card => 
    card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.contact1.includes(searchQuery)
  );

  return (
    <div style={pageStyle}>
      <h1>📚 Saved Business Cards</h1>
      
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
              
              {/* Display delete button if the logged-in user is either the owner or admin */}
              {(userEmail === "admin@example.com" || card.ownerEmail === userEmail) && (
                <button 
                  onClick={() => handleDeleteCard(index)} 
                  style={cardStyles.deleteButton}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





// ✨ Styles
// Navbar Styles
export const navStyles = {
  container: {
    display: 'flex',
    gap: '20px',
    padding: '15px',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    flexWrap: 'wrap',
    fontFamily: '"Roboto", sans-serif',
    width: '100%',
    boxSizing: 'border-box',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    padding: '10px',
    borderRadius: '8px',
    fontFamily: '"Roboto", sans-serif',
    flexShrink: 0,
  },
  linkHover: {
    color: '#FFD700',
    backgroundColor: '#444',
  },
  logoutButton: {
    marginLeft: 'auto',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700', // Bold
    fontSize: '18px',  // Slightly increased
    transition: 'background-color 0.3s ease',
  }
};



export const cardStyles = {
  card: {
    width: "300px", 
    padding: "20px", 
    borderRadius: "10px", 
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
    transition: "transform 0.3s ease, box-shadow 0.3s ease",  // Smooth transition effects
    cursor: "pointer", 
    backgroundColor: "#f9f9f9",  // Light gray background
    marginBottom: "20px",  // Space between cards
    fontFamily: '"Roboto", sans-serif',  // Consistent font for text inside cards
    flexShrink: 0,  // Prevent card from shrinking
    border: '2px solid black',  // Add border around each saved card
    borderRadius: '10px',  // Maintain rounded corners for a professional look
  },
  cardHover: {
    transform: "scale(1.05)",  // Slightly enlarge card on hover for interactivity
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",  // More pronounced shadow on hover
  },
  deleteButton: {
    padding: "8px", 
    backgroundColor: "#FF5733",  // Vibrant red-orange background color
    color: "white", 
    borderRadius: "5px", 
    border: "none", 
    cursor: "pointer", 
    transition: 'background-color 0.3s ease, transform 0.2s ease',  // Smooth background and transform transitions
    fontFamily: '"Roboto", sans-serif',  // Button font
  },
  deleteButtonHover: {
    backgroundColor: "#D84B2A",  // Darker shade of red-orange on hover
    transform: 'scale(1.05)',  // Slightly enlarge the button when hovered
  },
};

// Styles for the container that holds saved cards
export const savedCardsContainerStyles = {
  display: "flex",
  flexWrap: "wrap",  // Allow wrapping for responsiveness
  gap: "20px",  // Space between saved cards
  justifyContent: "center",  // Center the cards in the container
  padding: "20px",
};


const loginStyles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: '"Roboto", sans-serif',
    padding: '0 20px', // Ensures padding on smaller screens
    boxSizing: 'border-box', // Prevents shrinking due to padding
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px', // Increased maxWidth to give it more space
    textAlign: 'center',
    transition: 'box-shadow 0.3s ease',
    boxSizing: 'border-box', // Prevents shrinkage
    margin: '0 auto', // Centers the card horizontally
  },
  cardHover: {
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%', // Ensures form elements take full width inside the card
  },
  input: {
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    margin: '10px 0',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    backgroundColor: '#fafafa',
    width: '100%', // Ensures inputs fill the available width
    boxSizing: 'border-box', // Prevents input from shrinking due to padding
  },
  inputFocus: {
    borderColor: '#007BFF',
    boxShadow: '0 0 8px rgba(0, 123, 255, 0.3)',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.2s ease-in-out',
    width: '100%', // Ensures button fills the available width
    boxSizing: 'border-box', // Prevents shrinking
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
  toggleText: {
    color: '#007BFF',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '15px',
    textDecoration: 'underline',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'left',
    fontWeight: 'bold',
  },
};



const homePageStyles = {
  page: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    fontSize: "35px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "20px",
    color: "#555",
    marginBottom: "30px",
  },
  featuresContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "50px",
    flexWrap: 'wrap', // Wrap features on smaller screens
  },
  feature: {
    width: "30%",
    textAlign: "center",
    padding: "15px",
    borderRadius: "8px",
    background: "white",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  featureHover: {
    transform: "scale(1.05)", // Slightly enlarge the box on hover
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
  },
};

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: "#f9f9f9",
};

const formStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    border: '2px solid #ddd',  // Add a light border for definition
  },
  input: {
    padding: '12px 15px',  // Slightly larger padding for better click area
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',  // Slightly more rounded corners
    margin: '5px 0',  // Add space between inputs for better clarity
    backgroundColor: '#fafafa',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  inputFocus: {
    borderColor: '#007BFF',  // Focus border color to indicate active state
    boxShadow: '0 0 8px rgba(0, 123, 255, 0.3)',  // Soft glow on focus
  },
  textarea: {
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    height: '100px',  // Slightly taller height for better text visibility
    backgroundColor: '#fafafa',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  textareaFocus: {
    borderColor: '#007BFF',
    boxShadow: '0 0 8px rgba(0, 123, 255, 0.3)',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',  // Rounded corners for a soft look
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s, transform 0.2s ease-in-out',  // Smooth transition for hover
  },
  buttonHover: {
    backgroundColor: '#0056b3',  // Darker blue when hovered
    transform: 'scale(1.05)',  // Slightly enlarge the button on hover
  },
};





/// Define styles for the About page
const aboutPageStyles = {
  page: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    fontFamily: '"Roboto", sans-serif',  // Uniform font across the page
  },
  title: {
    textAlign: "center",
    fontSize: "35px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    fontFamily: '"Roboto", sans-serif',  // Applying consistent font
  },
  description: {
    textAlign: "center",
    fontSize: "20px",
    color: "#555",
    marginBottom: "30px",
    fontFamily: '"Roboto", sans-serif',  // Applying consistent font
  },
  featuresContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "30px",
    flexWrap: "wrap", // Wrap features on smaller screens
    gap: '20px',  // Adding space between features
  },
  feature: {
    width: "45%",
    textAlign: "left",
    padding: "20px",  // Added more padding for better spacing
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    fontFamily: '"Roboto", sans-serif',  // Uniform font for feature text
    border: "1px solid #ddd",  // Subtle border around the features
  },
  featureHover: {
    transform: "scale(1.05)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
    border: "1px solid #007BFF",  // Change border color on hover for visual feedback
  },
};


export default App;
