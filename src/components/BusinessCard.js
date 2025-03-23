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
      {/* Left Section: Profile Image & QR Code */}
      <div style={styles.leftSection}>
        {formData.profilePic && (
          <img src={formData.profilePic} alt="Profile" style={styles.profilePic} />
        )}
        <QRCodeCanvas value={qrCodeValue} size={70} />
      </div>

      {/* Right Section: Text Details */}
      <div style={styles.rightSection}>
        <p style={styles.name}>{formData.name || "Your Name"}</p>
        <p style={styles.title}>{formData.designation || "Your Designation"}</p>
        <p style={styles.regNo}>{formData.regNo || "Enter Registration No"}</p>
        <p style={styles.education}>{formData.education || "Your Education"}</p>

        {(formData.contact1 || formData.contact2) && (
          <p style={styles.textRight}>
            <FaPhone style={styles.icon} /> {formData.contact1 || ""}{formData.contact1 && formData.contact2 ? ", " : ""}{formData.contact2 || ""}
          </p>
        )}

        {formData.email && formData.email.trim() !== "" && (
          <p style={styles.textRight}><FaEnvelope style={styles.icon} /> {formData.email}</p>
        )}

        {formData.address && formData.address.trim() !== "" && (
          <p style={styles.textRight}><FaMapMarkerAlt style={styles.icon} /> {formData.address}</p>
        )}

        {formData.specialties && formData.specialties.trim() !== "" && (
          <p style={styles.specialties}>{formData.specialties}</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "500px", // ✅ Compact width
    height: "300px", // ✅ Compact height
    display: "flex",
    flexDirection: "row", // ✅ Aligning items in a row
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: "5px", // ✅ Minimal padding
    borderRadius: "5px",
    boxShadow: "0 2px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid grey",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px", // ✅ Space between image and text
  },
  profilePic: {
    width: "80px", // ✅ Smaller profile pic
    height: "110px", 
    borderRadius: "5px",
    objectFit: "cover",
    border: "0px solid #333",
    marginBottom: "5px",
  },
  rightSection: {
    flex: 1,
    textAlign: "left", // ✅ Align text to the left
    display: "flex",
    flexDirection: "column",
    gap: "0px", // ✅ No extra space between text elements
  },
  name: {
    color: "orangered",
    fontSize: "23px",
    fontWeight: "bold",
    marginBottom: "0px",
  },
  title: {
    color: "brown",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "0px",
  },
  regNo: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "0px",
  },
  education: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#002D62",
    marginBottom: "0px",
  },
  specialties: {
    backgroundColor: "hotpink",
    padding: "2px",
    borderRadius: "0px",
    fontWeight: "bold",
    fontSize: "13px",
    color: "#333",
    marginBottom: "0px",
  },
  textRight: {
    textAlign: "left", // ✅ Align text left for readability
    fontSize: "12px",
    marginBottom: "0px",
  },
  icon: {
    marginRight: "5px",
    color: "#007BFF",
  },
};

export default BusinessCard;
