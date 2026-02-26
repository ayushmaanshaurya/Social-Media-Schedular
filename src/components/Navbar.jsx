import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout, updateUserPhoto } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const photoURL = localStorage.getItem(`userPhoto_${user.uid}`);
      if (photoURL) {
        setUserPhoto(photoURL);
      } else if (user.photoURL) {
        setUserPhoto(user.photoURL);
      }
    }
  }, [user]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const photoDataURL = reader.result;
        localStorage.setItem(`userPhoto_${user.uid}`, photoDataURL);
        setUserPhoto(photoDataURL);
        await updateUserPhoto(photoDataURL);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Photo upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className="navbar">
      <h1 className="nav-title">Social Scheduler</h1>

      <div className="nav-links">
        <NavLink to="/dashboard" className={navClass}>
          Dashboard
        </NavLink>

        {user.role !== "Viewer" && (
          <NavLink to="/create" className={navClass}>
            Create
          </NavLink>
        )}

        <NavLink to="/explore" className={navClass}>
          Explore
        </NavLink>

        <NavLink to="/analytics" className={navClass}>
          Analytics
        </NavLink>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div className="profile-inline">
          <div className="profile-circle" onClick={triggerFileInput} title="Click to upload photo">
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="profile-img" />
            ) : (
              <span className="person-icon">👤</span>
            )}
            {uploading && <div className="upload-spinner"></div>}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />

          <div className="profile-links">
            <button
              type="button"
              className="profile-link"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              My Profile
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {showProfile && (
            <div className="profile-card">
              <div className="profile-row">
                <span>Name</span>
                <strong>{user.displayName || user.name || "User"}</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="profile-row">
                <span>Role</span>
                <strong>{user.role || "user"}</strong>
              </div>

              <div className="profile-row">
                <span>Status</span>
                <strong>Active</strong>
              </div>

              <button className="change-photo-btn" onClick={triggerFileInput} disabled={uploading}>
                {uploading ? "Uploading..." : "Change Photo"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
