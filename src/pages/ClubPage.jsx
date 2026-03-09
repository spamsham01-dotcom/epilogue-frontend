import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import API from "../config/api";
import Loader from "../components/Loader";

export default function ClubPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [clubDetails, setClubDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const alert = useAlert(); // Add glass alert system

  useEffect(() => {
    fetchClubDetails();
    fetchMessages();
  }, [clubId]);

  const fetchClubDetails = async () => {
    try {
      const res = await API.get(`/clubs/${clubId}`);
      setClubDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch club details:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/clubs/${clubId}/messages`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClub = async () => {
    if (!window.confirm("Are you sure you want to leave this club?")) return;

    try {
      await API.post(`/clubs/${clubId}/leave`);
      alert.success("You left the club successfully");
      navigate("/profile");
    } catch (err) {
      alert.error(err.response?.data?.error || "Failed to leave club");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setPosting(true);
      await API.post(`/clubs/${clubId}/message`, { message: newMessage });
      setNewMessage("");
      await fetchMessages(); // Refresh messages
    } catch (err) {
      alert.error(err.response?.data?.error || "Failed to send message");
    } finally {
      setPosting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the club?")) return;

    try {
      await API.delete(`/clubs/${clubId}/member/${memberId}`);
      alert("Member removed successfully");
      await fetchClubDetails(); // Refresh member list
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove member");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!clubDetails) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl">Club not found</div>
      </div>
    );
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

      {/* Header */}
      <h1 className="sr-only">{clubDetails.club?.name || "Club"}</h1>
      <div className="flex justify-end items-center mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="btn-jelly btn-jelly-secondary px-4 py-2"
          >
            Back to Profile
          </button>
          <button
            onClick={handleLeaveClub}
            className="btn-jelly btn-jelly-danger px-4 py-2"
          >
            Leave Club
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Club Info */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-[#F8FAFC] heading-etched">
              {clubDetails.club?.name || "Club"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#818CF8]">Description</p>
                <p className="text-lg text-[#F8FAFC]">{clubDetails.club?.description || "No description"}</p>
              </div>
              
              <div>
                <p className="text-sm text-[#818CF8]">Genre</p>
                <p className="text-lg text-[#F8FAFC]">{clubDetails.club?.genre || "Not specified"}</p>
              </div>
              
              <div>
                <p className="text-sm text-[#818CF8]">Admin</p>
                <p className="text-lg text-[#F8FAFC]">{clubDetails.club?.users?.username || "Unknown"}</p>
              </div>
              
              <div>
                <p className="text-sm text-[#818CF8]">Members</p>
                <p className="text-lg text-[#F8FAFC]">{clubDetails.memberCount || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-[#818CF8]">Messages</p>
                <p className="text-lg text-[#F8FAFC]">{clubDetails.messageCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Members Section */}
          {clubDetails.members && clubDetails.members.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-[#F8FAFC] heading-etched">Members</h3>
            <div className="space-y-2">
                {clubDetails.members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-2 bg-[rgba(30,41,59,0.4)] rounded border border-[rgba(255,255,255,0.1)]">
                    <span>{member.username}</span>
                    {clubDetails.club?.admin_id !== member.id && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="btn-jelly btn-jelly-danger text-xs px-2 py-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Discussion */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-[#F8FAFC] heading-etched flex items-center justify-center gap-3">
              <span className="text-xl">🪑</span>
              Pull Up A Chair
            </h2>
            
            {/* Messages */}
            <div className="h-96 overflow-y-auto mb-6 p-4 bg-[rgba(30,41,59,0.4)] rounded border border-[rgba(255,255,255,0.1)]">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="bg-[rgba(30,41,59,0.5)] p-3 rounded border border-[rgba(255,255,255,0.08)]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-[#818CF8]">
                          {message.users?.username || "Unknown User"}
                        </span>
                        <span className="text-xs text-[#818CF8]">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[#F8FAFC]">{message.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[#818CF8] mt-20">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="search-bar-wrapper flex-1">
                <span className="search-bar-icon" aria-hidden="true">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16h6a2 2 0 002-2V6a2 2 0 00-2-2H9L7 6H5a2 2 0 00-2 2v6a2 2 0 002 2h2"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="search-bar-input"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={posting || !newMessage.trim()}
                className="btn-jelly px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {posting ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
