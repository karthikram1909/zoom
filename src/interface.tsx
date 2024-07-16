import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./index.css"; // Ensure this file is imported to apply Tailwind styles

interface Meeting {
  id: string;
  topic: string;
  start_time: string;
  join_url: string;
}

const Interface: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isListModalOpen, setListModalOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    topic: "",
    start_time: "",
    duration: 60,
    timezone: "UTC",
    agenda: "",
  });

  const email = "zoomnestapp@gmail.com";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNewMeeting = async () => {
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:8000/api/zoom/meetings",
        {
          ...newMeeting,
          type: 2,
        },
        {
          headers: {
            email: email,
          },
        }
      );
      console.log("Meeting created:", response.data);
      setCreateModalOpen(false);
      await getMeetings();
    } catch (error) {
      console.error("Error creating meeting:", error);
      setError("Failed to create meeting. Please try again.");
    }
  };

  const getMeetings = async () => {
    try {
      setError(null);
      const response = await axios.get(
        "http://localhost:8000/api/zoom/scheduled-meetings",
        {
          headers: {
            email: email,
          },
        }
      );
      if (Array.isArray(response.data)) {
        setMeetings(response.data);
      } else if (response.data && Array.isArray(response.data.meetings)) {
        setMeetings(response.data.meetings);
      } else {
        console.error("Unexpected data structure:", response.data);
        setError("Unexpected data structure received from the server");
        setMeetings([]);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setError("Failed to fetch meetings. Please try again.");
      setMeetings([]);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Zoom</h2>
        <div className="flex flex-col space-y-4">
          <button
            className="w-full py-4 text-lg bg-blue-500 text-white rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105"
            onClick={() => setCreateModalOpen(true)}
          >
            Create Meeting
          </button>
          <button
            className="w-full py-4 text-lg bg-green-500 text-white rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105"
            onClick={() => {
              getMeetings();
              setListModalOpen(true);
            }}
          >
            List Meetings
          </button>
          <button className="w-full py-4 text-lg bg-gray-500 text-white rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105">
            Join Meeting
          </button>
        </div>
      </div>

      <div className="text-center mt-12">
        <div className="text-5xl font-extrabold text-gray-800">
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="text-lg text-gray-600">
          {currentTime.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {error && <p className="text-red-500 mt-6">{error}</p>}

      {/* Create Meeting Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}
        contentLabel="Create Meeting"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">Create a New Meeting</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNewMeeting();
            }}
            className="space-y-4"
          >
            <div className="flex flex-col space-y-2">
              <label htmlFor="topic" className="text-lg font-medium">
                Topic
              </label>
              <input
                id="topic"
                name="topic"
                value={newMeeting.topic}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, topic: e.target.value })
                }
                className="border-gray-300 rounded-lg p-2"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="start_time" className="text-lg font-medium">
                Start Time
              </label>
              <input
                id="start_time"
                name="start_time"
                type="datetime-local"
                value={newMeeting.start_time}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, start_time: e.target.value })
                }
                className="border-gray-300 rounded-lg p-2"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="duration" className="text-lg font-medium">
                Duration (minutes)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                value={newMeeting.duration}
                onChange={(e) =>
                  setNewMeeting({
                    ...newMeeting,
                    duration: Number(e.target.value),
                  })
                }
                className="border-gray-300 rounded-lg p-2"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="timezone" className="text-lg font-medium">
                Timezone
              </label>
              <input
                id="timezone"
                name="timezone"
                value={newMeeting.timezone}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, timezone: e.target.value })
                }
                className="border-gray-300 rounded-lg p-2"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="agenda" className="text-lg font-medium">
                Agenda
              </label>
              <input
                id="agenda"
                name="agenda"
                value={newMeeting.agenda}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, agenda: e.target.value })
                }
                className="border-gray-300 rounded-lg p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
              Create
            </button>
          </form>
        </div>
      </Modal>

      {/* List Meetings Modal */}
      <Modal
        isOpen={isListModalOpen}
        onRequestClose={() => setListModalOpen(false)}
        contentLabel="List Meetings"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">Scheduled Meetings</h2>
          {meetings.length === 0 ? (
            <p className="text-center text-gray-500">
              There are no records to display
            </p>
          ) : (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {meeting.topic}
                  </h3>
                  <p className="text-gray-600">
                    Start time: {new Date(meeting.start_time).toLocaleString()}
                  </p>
                  <button
                    className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                    onClick={() => (window.location.href = meeting.join_url)}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Interface;
