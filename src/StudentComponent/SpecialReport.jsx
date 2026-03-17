import React from "react";
import schoolLogo from "../images/school-logo.png";
import userLogo from "../images/user.svg";

const SpecialReport = ({ data }) => {
  if (!data || !data.student) return null;

  const { student, metrics, metricsName } = data;

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <span key={i} style={{ color: "#ED4045", fontSize: "18px" }}>★</span>
    ));
  };

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
  };

  return (
    <div
      className="container-fluid"
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header Logo */}
      <div style={{ textAlign: "left", marginBottom: "10px" }}>
        <img src={schoolLogo} alt="Header" style={{ width: "120px" }} />
      </div>

      {/* Student Details */}
      <div className="row">
        <div className="col-10">
          <table
            className="table table-bordered"
            style={{
                textAlign: "left",
              borderCollapse: "collapse",
              width: "100%",
              border: "1px solid #ddd",
              fontSize: "13px",color: "#474444"
            }}
          >
            <tbody>
              <tr>
                <td style={cellStyle}>
                  STUDENT'S NAME: {student.Name}
                </td>
                <td style={cellStyle}>
                  CLASS:{" "}
                  {student.Class === "test" ? "NURSERY" : student.Class}
                </td>
                <td style={cellStyle}>
                  SECTION:{" "}
                  {student.Class?.includes("-")
                    ? student.Class.split("-")[1]
                    : ""}
                </td>
              </tr>
              <tr>
                <td style={cellStyle}>
                  FATHER'S NAME: {student.Fname}
                </td>
                <td style={cellStyle}>
                  MOTHER'S NAME: {student.Mname}
                </td>
                <td style={cellStyle}>
                  ROLL NO: {student.Rollno}
                </td>
              </tr>
              <tr>
                <td style={cellStyle}>
                  ADM. NO: {student.Admno}
                </td>
                <td style={cellStyle}>
                  D.O.B.: {formatDate(student.Dob)}
                </td>
                <td style={cellStyle}>
                  GENDER: {student.gender === "m" ? "MALE" : "FEMALE"}
                </td>
              </tr>
              <tr>
                <td style={cellStyle}>
                  HEIGHT: {student.height} CM
                </td>
                <td style={cellStyle}>
                  WEIGHT: {student.weight} KG
                </td>
                <td style={cellStyle}>
                  B. GR.: {student.blood_group}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Student Image */}
        <div className="col-2 text-end">
          {student.image ? (
            <img
              src={userLogo }
              alt="Student"
              style={{ width: "120px", borderRadius: "10px",marginLeft:"100px" }}
            />
          ) : (
            <img
              src="/assets/icons/user.svg"
              alt="Default"
              style={{ width: "120px", borderRadius: "10px" }}
            />
          )}
        </div>
      </div>

      {/* Motivation Box */}
      <div
        style={{
          background: "#C9C59C",
          borderRadius: "18px",
          padding: "30px",
          textAlign: "center",
          marginBottom: "20px",
          marginTop: "10px",
        }}
      >
        <h4 style={{ fontWeight: "800",fontSize:"15px"}}>You Can</h4>
        <p style={{ fontSize: "18px", lineHeight: "28px" }}>
          You can do it. I know you can, I trust and believe in your plan.<br />
          It's clear that you have what it takes, You simply won't need any breaks.<br />
          You can do it, I know you can, I'm your biggest fan.<br />
          Enjoy the journey - I Pray.
        </p>
      </div>

      {/* Metrics Section */}
      {metricsName &&
        metricsName.map((groupName, index) => (
          <div
            key={index}
            style={{
              background: "#C9C59C",
              borderRadius: "25px",
              padding: "18px",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: "900",
                textTransform: "uppercase",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              {groupName}
            </div>

            {metrics &&
              metrics
                .filter((m) => m.metric_name === groupName)
                .map((metric, i) => (
                  <div key={i} className="row">
                    <div className="col-9 border">
                      {metric.ability}
                    </div>
                    <div className="col-3 border text-center">
                      {renderStars(metric.mark)}
                    </div>
                  </div>
                ))}
          </div>
        ))}

      {/* Special Comments */}
      <div
        style={{
          background: "#C9C59C",
          padding: "25px",
          borderRadius: "25px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontWeight: "900",
            textTransform: "uppercase",
            fontSize: "16px",
            marginBottom: "10px",
          }}
        >
          SPECIAL COMMENTS
        </div>

        <div style={{ textAlign: "center", fontSize: "16px" }}>
          All the best for your future. May God bless you.
        </div>

        <p
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "15px",
            marginTop: "10px",
          }}
        >
          Promoted to Class KG under provisions of RTE Act 2009
          (Criteria based upon child's improvement in skills)
        </p>

        <div className="row mt-5"style={{fontSize:"15px",
    display:"flex",
    justifyContent: "space-between"}}
>
          <div>Teacher's Sign</div>
          <div>Vice Principal's Sign</div>
        </div>
      </div>
    </div>
  );
};

export default SpecialReport;
