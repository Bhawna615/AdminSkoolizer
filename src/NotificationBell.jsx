import React, { useEffect, useState } from "react";

import { db } from "../firebase";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const NotificationBell = () => {

  const [notifications, setNotifications] = useState([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(data);

    });

    return () => unsubscribe();

  }, []);

  return (
    <div
      style={{
        position: "relative",
      }}
    >

      {/* BELL ICON */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          fontSize: "28px",
          position: "relative",
        }}
      >
        🔔

        {/* COUNT */}
        {notifications.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "red",
              color: "#fff",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {notifications.length}
          </span>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "40px",
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            padding: "10px",
            zIndex: 999,
          }}
        >

          <h3
            style={{
              marginBottom: "10px",
            }}
          >
            Notifications
          </h3>

          {notifications.length === 0 ? (
            <p>No Notifications</p>
          ) : (
            notifications.map((item) => (

              <div
                key={item.id}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >

                <h4
                  style={{
                    margin: "0",
                    fontSize: "15px",
                  }}
                >
                  {item.type === "message" && "💬 "}
                  {item.type === "exam" && "📝 "}
                  {item.type === "fees" && "💰 "}
                  {item.title}
                </h4>

                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: "13px",
                    color: "#555",
                  }}
                >
                  {item.message}
                </p>

              </div>

            ))
          )}

        </div>
      )}

    </div>
  );
};

export default NotificationBell;

