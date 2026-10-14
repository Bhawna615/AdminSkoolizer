import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminPosts";

const CreatePost = () => {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [group, setGroup] = useState("school");
  const [file, setFile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // MESSAGE BOX
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // LOAD CLASSES
  useEffect(() => {
    axios
      .get(
        "http://localhost/kkblossom/api.php/Adminapi/AdminExam/getClasses"
      )
      .then((res) => setClasses(res.data || []))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!text.trim()) {
      setMessage("Please enter message");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      formData.append("recipient_group", group);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post(`${BASE_URL}/create`, formData);

      if (res.data.status) {
        setMessage("Post Created Successfully");
        setMessageType("success");

        setTimeout(() => {
          navigate("/dashboard/PostComponent/PostView");
        }, 1500);
      } else {
        setMessage("Post creation failed");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);

      setMessage("Upload failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-cont">
      <div className="post-crd">

        <h2>Create Post</h2>

        <form onSubmit={handleSubmit}>

          {/* TEXT */}
          <label>Message</label>

          <textarea
            placeholder="Write your post..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* GROUP */}
          <label>Recipient Group</label>

          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="school">School</option>

            {classes.map((c, i) => (
              <option key={i} value={c.Classname}>
                {c.Classname}
              </option>
            ))}
          </select>

          {/* FILE */}
          <label>Attach File</label>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* PREVIEW */}
          {file && (
            <p className="file-preview">
              📎 {file.name}
            </p>
          )}

          {/* BUTTON */}
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Create Post"}
          </button>

        </form>
      </div>

      {/* ================= MESSAGE OVERLAY ================= */}
      {message && (
        <div className="post-message-overlay">
          <div className={`post-message-modal ${messageType}`}>

            <div className="post-message-icon">
              {messageType === "success" ? "✓" : "!"}
            </div>

            <div className="post-message-text">
              {message}
            </div>

            {messageType === "error" && (
              <button
                className="post-message-ok"
                onClick={() => {
                  setMessage("");
                  setMessageType("");
                }}
              >
                OK
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;