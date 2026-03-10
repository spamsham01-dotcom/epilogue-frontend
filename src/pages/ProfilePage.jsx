import { useState, useEffect } from "react";
import API from "../config/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import Loader from "../components/Loader";

const genres = [
  "Fantasy",
  "Romance",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Horror",
  "Adventure",
  "Historical",
  "Biography",
  "Self Help",
];

export default function ProfilePage() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", email: "" });
  const [yearlyGoal, setYearlyGoal] = useState("");
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const [readingList, setReadingList] = useState([]);
  const [readBooksCount, setReadBooksCount] = useState(0);

  const [joinedClubs, setJoinedClubs] = useState([]);
  const [showCreateClubModal, setShowCreateClubModal] = useState(false);
  const [newClub, setNewClub] = useState({ name: "", description: "", genre: "" });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const alert = useAlert(); // Add glass alert system

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchProfileData(),
        fetchReadingData(),
        fetchClubsData(),
      ]);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const res = await API.get("/users/profile");
      setUserProfile(res.data || null);
      setEditForm({
        username: res.data?.username || "",
        email: res.data?.email || "",
      });
      setYearlyGoal(res.data?.yearly_goal?.toString() || "");
    } catch {}
  };

  const fetchReadingData = async () => {
    try {
      const res = await API.get("/reading");
      const data = res.data || [];
      setReadingList(data);

      const readCount = data.filter((item) => item.status === "read").length;
      setReadBooksCount(readCount);
    } catch {
      setReadingList([]);
    }
  };

  const fetchClubsData = async () => {
    try {
      const res = await API.get("/clubs/my");
      setJoinedClubs(res.data?.clubs || []);
    } catch {
      setJoinedClubs([]);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      await API.patch("/users/profile", editForm);
      await fetchProfileData();
      setIsEditingProfile(false);
      alert.success("Profile updated!");
    } catch {
      alert.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateGoal = async () => {
    try {
      const goal = parseInt(yearlyGoal);
      if (!goal) return alert("Enter valid goal");

      await API.patch("/users/goal", { yearly_goal: goal });
      await fetchProfileData();
      setIsEditingGoal(false);
      alert.success("Goal updated!");
    } catch {
      alert.error("Goal update failed");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete account?")) return;

    try {
      await API.delete("/users/profile");
      localStorage.removeItem("token");
      navigate("/");
    } catch {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};

  const updateBookStatus = async (book, newStatus) => {
    try {
      await API.post("/reading", {
        book: {
          google_books_id: book.google_books_id,
          title: book.title,
          authors: book.authors,
          thumbnail: book.thumbnail,
        },
        status: newStatus,
      });

      await fetchReadingData();
      if (newStatus === "read") await fetchProfileData();

      alert("Status updated!");
    } catch {
      alert("Status update failed");
    }
  };

  const handleCreateClub = async () => {
    if (!newClub.name || !newClub.description || !newClub.genre) {
      alert("Please fill all club fields");
      return;
    }

    try {
      await API.post("/clubs", newClub);
      setShowCreateClubModal(false);
      setNewClub({ name: "", description: "", genre: "" });
      await fetchClubsData();
      alert.success("Club created!");
    } catch {
      alert.error("Club creation failed");
    }
  };

  const navigateToClub = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  const progress = userProfile?.yearly_goal
    ? Math.min((readBooksCount / userProfile.yearly_goal) * 100, 100)
    : 0;

  const booksByStatus = {
    want_to_read: readingList.filter(item => item.status === "want_to_read"),
    currently_reading: readingList.filter(item => item.status === "currently_reading"),
    read: readingList.filter(item => item.status === "read"),
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-shell relative min-h-screen bg-[#020617] text-[#F8FAFC] px-4 py-10">
      {/* Global Title – top-left */}
      <div className="app-title">
        <span className="font-lobster">Epilogue</span>
      </div>

      {/* Decorative Stickers */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="reading-sticker reading-sticker--bookmark top-16 left-6" />
        <div className="reading-sticker reading-sticker--openbook top-24 right-10" />
        <div className="reading-sticker reading-sticker--feather top-1/2 left-12" />
        <div className="reading-sticker reading-sticker--watch top-1/3 right-1/4" />
        <div className="reading-sticker reading-sticker--ticket bottom-16 left-1/3" />
        <div className="reading-sticker reading-sticker--note bottom-10 right-1/4" />
      </div>

      {/* 1️⃣ HEADER SECTION */}
      <h1 className="sr-only">My Profile</h1>
      <div className="flex justify-end items-center mb-8">
        <button
          onClick={() => navigate("/recommendations")}
          className="btn-jelly px-4 py-2"
        >
          Back to Recommendations
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: PROFILE & PROGRESS */}
        <div className="lg:col-span-1 space-y-6">
          {/* 2️⃣ PROFILE INFORMATION CARD */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="glass-pill w-11 h-11 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#818CF8]">
                profile
              </span>
            </div>
            
            {userProfile && (
              <div className="space-y-4">
                {!isEditingProfile ? (
                  <>
                    <div>
                      <p className="text-sm text-[#818CF8]">Username</p>
                      <p className="text-lg text-[#F8FAFC]">{userProfile.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#818CF8]">Email</p>
                      <p className="text-lg text-[#F8FAFC]">{userProfile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#818CF8]">Yearly Goal</p>
                      <p className="text-lg text-[#F8FAFC]">
                        {userProfile.yearly_goal ? `${userProfile.yearly_goal} books` : "Not Set"}
                      </p>
                    </div>
                    <div className="space-y-2 pt-4">
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="btn-jelly w-full px-4 py-2"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => setIsEditingGoal(true)}
                        className="btn-jelly w-full px-4 py-2"
                      >
                        Update Yearly Goal
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        className="btn-jelly btn-jelly-danger w-full px-4 py-2"
                      >
                        Delete Account
                      </button>

                      <button
  onClick={handleLogout}
  className="btn-jelly btn-jelly-secondary w-full px-4 py-2"
>
  Logout
</button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="w-full p-2 bg-[rgba(30,41,59,0.6)] rounded text-[#F8FAFC] border border-[rgba(255,255,255,0.1)]"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full p-2 bg-[rgba(30,41,59,0.6)] rounded text-[#F8FAFC] border border-[rgba(255,255,255,0.1)]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={updating}
                        className="btn-jelly btn-jelly-success flex-1 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {updating ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          setEditForm({ username: userProfile.username, email: userProfile.email });
                        }}
                        className="btn-jelly btn-jelly-secondary flex-1 px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {isEditingGoal && (
                  <div className="mt-4 p-4 bg-[rgba(30,41,59,0.4)] rounded border border-[rgba(255,255,255,0.1)]">
                    <h3 className="text-lg mb-2">Update Yearly Goal</h3>
                    <input
                      type="number"
                      placeholder="Books per year"
                      value={yearlyGoal}
                      onChange={(e) => setYearlyGoal(e.target.value)}
                      className="w-full p-2 bg-[rgba(30,41,59,0.6)] rounded text-[#F8FAFC] mb-2 border border-[rgba(255,255,255,0.1)]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateGoal}
                        disabled={updating}
                        className="btn-jelly btn-jelly-success flex-1 px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {updating ? "Saving..." : "Save Goal"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingGoal(false);
                          setYearlyGoal(userProfile.yearly_goal?.toString() || "");
                        }}
                        className="btn-jelly btn-jelly-secondary flex-1 px-3 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3️⃣ YEARLY PROGRESS SECTION */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#F8FAFC] heading-etched">Yearly Progress</h2>
            {userProfile?.yearly_goal ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Books Read: {readBooksCount}</span>
                  <span>Goal: {userProfile.yearly_goal}</span>
                </div>
                <div className="w-full bg-[rgba(30,41,59,0.5)] rounded-full h-4 border border-[rgba(255,255,255,0.1)]">
                  <div 
                    className="h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%`, background: 'linear-gradient(rgba(99,102,241,0.8), rgba(79,70,229,0.4))' }}
                  ></div>
                </div>
                <p className="text-center text-lg font-semibold">
                  {progress.toFixed(1)}% Complete
                </p>
              </div>
            ) : (
              <p className="text-[#818CF8]">No yearly goal set</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: READING STATUS (3 COLUMNS) */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-[#F8FAFC] heading-etched text-center flex items-center justify-center gap-3">
              <span className="text-xl">🗺️</span>
              The Literary Map
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* COLUMN 1: WANT TO READ */}
              <div>
                <h3 className="text-xl font-medium mb-4 text-[#F8FAFC]">Want to Read</h3>
                <div className="space-y-3">
                  {booksByStatus.want_to_read.length > 0 ? (
                    booksByStatus.want_to_read.map((item) => (
                      <div key={item.id} className="p-3 rounded bg-[rgba(30,41,59,0.3)] border border-[rgba(255,255,255,0.1)]">
                        <div className="flex gap-3 mb-2">
                          <img
                            src={item.books.thumbnail}
                            alt={item.books.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.books.title}</h4>
                            <p className="text-xs text-[#818CF8]">
                              {Array.isArray(item.books.authors)
                                ? item.books.authors.join(", ")
                                : item.books.authors && item.books.authors !== "Unknown Author" ? item.books.authors : null}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBookStatus(item.books, "currently_reading")}
                            className="btn-jelly btn-jelly-secondary text-xs px-2 py-1"
                          >
                            Currently Reading
                          </button>
                          <button
                            onClick={() => updateBookStatus(item.books, "read")}
                            className="btn-jelly btn-jelly-success text-xs px-2 py-1"
                          >
                            Read
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#818CF8] italic text-sm">No books in this category</p>
                  )}
                </div>
              </div>

              {/* COLUMN 2: CURRENTLY READING */}
              <div>
                <h3 className="text-xl font-medium mb-4 text-[#F8FAFC]">Currently Reading</h3>
                <div className="space-y-3">
                  {booksByStatus.currently_reading.length > 0 ? (
                    booksByStatus.currently_reading.map((item) => (
                      <div key={item.id} className="p-3 rounded bg-[rgba(30,41,59,0.3)] border border-[rgba(255,255,255,0.1)]">
                        <div className="flex gap-3 mb-2">
                          <img
                            src={item.books.thumbnail}
                            alt={item.books.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.books.title}</h4>
                            <p className="text-xs text-[#818CF8]">
                              {Array.isArray(item.books.authors)
                                ? item.books.authors.join(", ")
                                : item.books.authors && item.books.authors !== "Unknown Author" ? item.books.authors : null}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBookStatus(item.books, "want_to_read")}
                            className="btn-jelly btn-jelly-secondary text-xs px-2 py-1"
                          >
                            Want to Read
                          </button>
                          <button
                            onClick={() => updateBookStatus(item.books, "read")}
                            className="btn-jelly btn-jelly-success text-xs px-2 py-1"
                          >
                            Read
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#818CF8] italic text-sm">No books in this category</p>
                  )}
                </div>
              </div>

              {/* COLUMN 3: READ */}
              <div>
                <h3 className="text-xl font-medium mb-4 text-[#F8FAFC]">Read</h3>
                <div className="space-y-3">
                  {booksByStatus.read.length > 0 ? (
                    booksByStatus.read.map((item) => (
                      <div key={item.id} className="p-3 rounded bg-[rgba(30,41,59,0.3)] border border-[rgba(255,255,255,0.1)]">
                        <div className="flex gap-3 mb-2">
                          <img
                            src={item.books.thumbnail}
                            alt={item.books.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.books.title}</h4>
                            <p className="text-xs text-[#818CF8]">
                              {Array.isArray(item.books.authors)
                                ? item.books.authors.join(", ")
                                : item.books.authors && item.books.authors !== "Unknown Author" ? item.books.authors : null}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateBookStatus(item.books, "want_to_read")}
                            className="btn-jelly btn-jelly-secondary text-xs px-2 py-1"
                          >
                            Want to Read
                          </button>
                          <button
                            onClick={() => updateBookStatus(item.books, "currently_reading")}
                            className="btn-jelly btn-jelly-secondary text-xs px-2 py-1"
                          >
                            Currently Reading
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#818CF8] italic text-sm">No books in this category</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5️⃣ BOOK CLUBS SECTION */}
      <div className="mt-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 flex items-center justify-center">
              <h2 className="text-2xl font-semibold text-[#F8FAFC] heading-etched flex items-center gap-3">
                <span className="text-xl">🛋️</span>
                The Literary Lounges
              </h2>
            </div>
            <button
              onClick={() => setShowCreateClubModal(true)}
              className="btn-jelly px-4 py-2"
            >
              Summon The Readers
            </button>
          </div>

          {joinedClubs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {joinedClubs.map((club) => (
                <div
                  key={club.id}
                  onClick={() => navigateToClub(club.id)}
                  className="p-4 rounded cursor-pointer glass-card hover:border-[#818CF8]/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2 text-[#F8FAFC]">{club.name}</h3>
                  <p className="text-sm text-[#818CF8] mb-2">{club.description}</p>
                  <p className="text-xs text-[#818CF8]">Genre: {club.genre}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#818CF8]">You haven't joined any clubs yet</p>
          )}
        </div>
      </div>

      {/* CREATE CLUB MODAL */}
      {showCreateClubModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-shell p-6 rounded w-full max-w-md">
            <h3 className="text-xl mb-4 text-[#F8FAFC] heading-etched">Create New Book Club</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Club Name"
                value={newClub.name}
                onChange={(e) => setNewClub({...newClub, name: e.target.value})}
                className="w-full p-2 bg-[rgba(30,41,59,0.6)] rounded text-[#F8FAFC] border border-[rgba(255,255,255,0.1)]"
              />
              <textarea
                placeholder="Description"
                value={newClub.description}
                onChange={(e) => setNewClub({...newClub, description: e.target.value})}
                className="w-full p-2 bg-[rgba(30,41,59,0.6)] rounded text-[#F8FAFC] h-24 resize-none border border-[rgba(255,255,255,0.1)]"
              />
              <select
                value={newClub.genre}
                onChange={(e) => setNewClub({...newClub, genre: e.target.value})}
                className="w-full p-2 bg-[rgba(30,41,59,0.6)] rounded text-[#F8FAFC] border border-[rgba(255,255,255,0.1)]"
              >
                <option value="">Select Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateClub}
                  className="btn-jelly btn-jelly-success flex-1 px-4 py-2"
                >
                  Summon The Readers
                </button>
                <button
                  onClick={() => {
                    setShowCreateClubModal(false);
                    setNewClub({ name: "", description: "", genre: "" });
                  }}
                  className="btn-jelly btn-jelly-secondary flex-1 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}