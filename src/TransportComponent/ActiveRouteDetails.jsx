import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ActiveRouteDetails = () => {
  const { id } = useParams();
  const [stations, setStations] = useState([]);
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/kkblossom/api.php/Adminapi/AdminTransport/activeRouteDetails/${id}`)
      .then(res => res.json())
      .then(data => {
        setStations(data.stations || []);
        setPassengers(data.passengers || []);
      })
      .catch(err => console.log(err));
  }, [id]);

  return (
    <div style={{ padding: "30px" }}>
      {stations.length === 0 ? (
        <p>No Stations Found</p>
      ) : (
        stations.map((station) => {

          // 🔥 filter once
          const stationPassengers = passengers.filter(
            p => Number(p.Stationid) === Number(station.id)
          );

          return (
            <div
              key={station.id}
              style={{
                background: "#fff",
                borderRadius: "4px",
                marginTop: "40px",
                padding: "10px",
                border: "1px solid rgba(134,134,134,0.17)"
              }}
            >
              <p style={{ fontSize: "20px", textAlign: "center" }}>
                {station.stationname}
              </p>

              <div style={{ display: "flex" }}>
                
                {/* LEFT: Names */}
                <div style={{ width: "50%" }}>
                  {stationPassengers.map(p => (
                    <p key={p.id}>{p.Name}</p>
                  ))}
                </div>

                {/* RIGHT: Status */}
                <div style={{ width: "50%" }}>
                  {stationPassengers.map(p => (
                    <p
                      key={p.id}
                      style={{
                        background: p.Presence ? "#76ff03" : "#f44336",
                        color: "white",
                        borderRadius: "5px",
                        width: "100px",
                        textAlign: "center"
                      }}
                    >
                      {p.Presence ? "On Board" : "Off Board"}
                    </p>
                  ))}
                </div>

              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ActiveRouteDetails;