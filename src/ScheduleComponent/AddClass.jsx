import React, { useState } from "react";
import { addClass } from "../ScheduleComponent/classApi";
import { useNavigate } from "react-router-dom";

const AddClass = () => {

  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addClass({ name });

    navigate("/dashboard/ScheduleComponent/ScheduleClass");
  };

  return (
    <div className="innerview">
      <form onSubmit={handleSubmit}>

        <p className="details">Name</p>

        <input
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button className="form-submit">
          Add
        </button>

      </form>
    </div>
  );
};

export default AddClass;