import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaShieldAlt, FaPen, FaSignOutAlt, FaSave, FaTimes, FaLeaf, FaUtensils, FaTruck, FaHeart } from "react-icons/fa";
import { API_URL } from '../config';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "GET",
      headers: { authorization: token },
    });
    const data = await res.json();
    setUser(data);
    setName(data.name);
    setEmail(data.email);
  };

  useEffect(() => {
    (async () => { await fetchProfile(); })();
  }, []);

  const updateProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", authorization: token },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      toast.success("Profile Updated");
      setUser(data.user);
      setEdit(false);
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successfully");
    window.location.href = "/login";
  };

  // ── Not logged in state ──
  if (!token) {
    return (
      <div className="profile-page">
        <div className="profile-guest-card">
          <div className="profile-guest-icon"><FaUser /></div>
          <h2>Please Login to View Your Profile</h2>
          <p>Sign in to access your account details, orders, and exclusive deals.</p>
          <Link to="/login" className="profile-guest-btn">
            Go To Login <FaSignOutAlt />
          </Link>
        </div>
      </div>
    );
  }

  // ── Logged in state ──
  const initials = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <>
      <Toaster />
      <div className="profile-page">
        {/* Background orbs */}
        <div className="profile-orb profile-orb-1" />
        <div className="profile-orb profile-orb-2" />

        <div className="profile-wrapper">
          {/* Hero header with avatar + stats */}
          <div className="profile-hero">
            <div className="profile-hero-glow" />
            <div className="profile-hero-content">
              <div className="profile-avatar-section">
                <div className="profile-avatar-ring">
                  <div className="profile-avatar">
                    {initials}
                  </div>
                  <div className="profile-avatar-status" />
                </div>
                <div className="profile-avatar-info">
                  <h1>{user?.name || "Loading..."}</h1>
                  <div className="profile-role-badge">
                    <FaShieldAlt />
                    <span>{user?.role || "User"}</span>
                  </div>
                </div>
              </div>
              <div className="profile-stats-row">
                <div className="profile-stat-item">
                  <div className="profile-stat-icon"><FaUtensils /></div>
                  <div>
                    <strong>Healthy</strong>
                    <span>Food Choice</span>
                  </div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-icon"><FaTruck /></div>
                  <div>
                    <strong>Fast</strong>
                    <span>Delivery</span>
                  </div>
                </div>
                <div className="profile-stat-item">
                  <div className="profile-stat-icon"><FaHeart /></div>
                  <div>
                    <strong>Fresh</strong>
                    <span>Ingredients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content card */}
          <div className="profile-main-card">
            <div className="profile-main-accent" />

            {edit ? (
              /* ── Edit mode ── */
              <div className="profile-edit-section">
                <div className="profile-section-header">
                  <FaPen className="profile-section-icon" />
                  <h3>Edit Profile</h3>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }} className="profile-edit-form">
                  <div className="profile-edit-fields">
                    <div className="profile-edit-field">
                      <span className="profile-edit-field-icon"><FaUser /></span>
                      <div className="profile-edit-field-input">
                        <label>Full Name</label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                    </div>
                    <div className="profile-edit-field">
                      <span className="profile-edit-field-icon"><FaEnvelope /></span>
                      <div className="profile-edit-field-input">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="profile-action-row">
                    <button type="submit" className="profile-btn profile-btn-save" disabled={isLoading}>
                      {isLoading ? "Saving..." : <><FaSave /> Save Changes</>}
                    </button>
                    <button type="button" className="profile-btn profile-btn-cancel" onClick={() => setEdit(false)}>
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ── View mode ── */
              <div className="profile-view-section">
                {user ? (
                  <>
                    <div className="profile-detail-cards">
                      <div className="profile-detail-card">
                        <div className="profile-detail-icon"><FaUser /></div>
                        <div className="profile-detail-content">
                          <span>Full Name</span>
                          <p>{user.name}</p>
                        </div>
                      </div>
                      <div className="profile-detail-card">
                        <div className="profile-detail-icon"><FaEnvelope /></div>
                        <div className="profile-detail-content">
                          <span>Email Address</span>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <div className="profile-detail-card">
                        <div className="profile-detail-icon"><FaShieldAlt /></div>
                        <div className="profile-detail-content">
                          <span>Account Role</span>
                          <p>{user.role}</p>
                        </div>
                      </div>
                      <div className="profile-detail-card">
                        <div className="profile-detail-icon"><FaLeaf /></div>
                        <div className="profile-detail-content">
                          <span>Membership</span>
                          <p>Healthy Food Member</p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-action-row">
                      <button className="profile-btn profile-btn-edit" onClick={() => setEdit(true)}>
                        <FaPen /> Edit Profile
                      </button>
                      <button className="profile-btn profile-btn-logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="profile-loading">
                    <div className="profile-spinner" />
                    <p>Loading your profile...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
