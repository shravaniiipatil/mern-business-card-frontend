import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const BusinessCard = ({ formData }) => {
  const qrCodeValue = `
    Name: ${formData.name || "Your Name"}
    Designation: ${formData.designation || "Your Designation"}
    Contact: ${formData.contact1 ? formData.contact1 : "Not Provided"}${formData.contact2 ? `, ${formData.contact2}` : ""}
    Email: ${formData.email || "Your Email"}
    Address: ${formData.address || "Your Address"}
  `;

  return (
    <div style={styles.card}>
      {/* Left Section: Text Details */}
      <div style={styles.leftSection}>
        <p style={styles.name}>{formData.name || "Your Name"}</p>
        <p style={styles.title}>{formData.designation || "Your Designation"}</p>
        <p style={styles.regNo}> {formData.regNo || "Enter Registration No"}</p>
        <p style={styles.education}> {formData.education || "Your Education"}</p>

        {(formData.contact1 || formData.contact2) && (
          <p style={styles.textLeft}>
            <FaPhone style={styles.icon} /> <strong>Contact:</strong> {formData.contact1 || ""}{formData.contact1 && formData.contact2 ? ", " : ""}{formData.contact2 || ""}
          </p>
        )}

        {formData.email && formData.email.trim() !== "" && (
          <p style={styles.textLeft}>
            <FaEnvelope style={styles.icon} /> <strong>Email:</strong> {formData.email}
          </p>
        )}

        {formData.specialties && formData.specialties.trim() !== "" && (
          <p style={styles.specialties}> {formData.specialties}</p>
        )}

        {formData.address && formData.address.trim() !== "" && (
          <p style={styles.textLeft}>
            <FaMapMarkerAlt style={styles.icon} /> <strong>Office:</strong> {formData.address}
          </p>
        )}

        {/* Footer Section with Shravani's Name */}
        <footer style={styles.footer}>
          <p>Designed by <strong>Shravani Shrikant Patil</strong></p>
        </footer>
      </div>

      {/* Right Section: Profile Image & QR Code */}
      <div style={styles.rightSection}>
        {formData.profilePic && (
          <img src={formData.profilePic} alt="Profile" style={styles.profilePic} />
        )}
        <QRCodeCanvas value={qrCodeValue} size={75} /> {/* Reduced QR size */}
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "480px",  // Increased width from 500px to 600px
    height: "290px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid grey",
  },
  leftSection: {
    flex: 1,
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "0px", // Reduced spacing
  },
  rightSection: {
    flex: 0,  // Ensures proper spacing for QR and image
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "10px",
  },
  profilePic: {
    width: "80px",
    height: "110px",
    borderRadius: "0px",
    objectFit: "contain",  // Ensures image fits without cutting
    marginBottom: "15px",
  },
  name: {
    color: "orangered",
    fontFamily: "'Poppins', sans-serif",
    fontStyle: "italic",
    fontSize: "22px",
    fontWeight: "bold",
    letterSpacing: "0px",
    marginBottom: "0px",
    textTransform: "uppercase",
    textShadow: "1px 1px 2px black",
  },
  title: {
    color: "brown",
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "0px",
    textShadow: "1px 1px 2px gray",
  },
  regNo: {
    fontSize: "12px",
    color: "#333333",
    marginBottom: "0px",
    textShadow: "1px 1px 2px pink",
  },
  education: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#002D62",
    marginBottom: "0px",
    textShadow: "1px 1px 2px yellow",
  },
  specialties: {
    backgroundColor: "#8B0000",
    padding: "3px 8px",
    borderRadius: "2px",
    fontWeight: "bold",
    fontSize: "12px",
    color: "white",
    textAlign: "center",
    marginBottom: "5px",
    textShadow: "1px 1px 2px gray",
  },
  textLeft: {
    textAlign: "left",
    fontSize: "12px",
    marginBottom: "2px",
    textShadow: "0.5px 0.5px 1px gray",
  },
  icon: {
    marginRight: "5px",
    color: "#007BFF",
  },
  footer: {
    textAlign: "center",
    fontSize: "8px",
    color: "gray",
    marginTop: "0px",
    padding: "2px",
    borderTop: "0px solid #ddd",
  },
};

export default BusinessCard;
