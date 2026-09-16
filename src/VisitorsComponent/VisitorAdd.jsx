import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminVisitors";

const VisitorAdd = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    purpose: "",
    phone: "",
    whom_to_meet: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${BASE_URL}/addVisitor`,
      form,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(res.data);

    if (res.data.status) {
      alert("Visitor Added Successfully ✅");

      navigate("/dashboard/VisitorsComponent/VisitorView"); // 👈 FIX PATH
    } else {
      alert(res.data.message);
    }

  } catch (err) {
    console.error(err);
    alert("Error while adding visitor");
  }
};

  return (
    <div style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>

        <input name="name" placeholder="Name" onChange={handleChange} style={{border:"1px solid grey",width:"30%",textAlign:"left",marginBottom:"20px"}}/><br />
        <input name="address" placeholder="Address" onChange={handleChange} style={{border:"1px solid grey",width:"30%",textAlign:"left",marginBottom:"20px"}}/><br />
        <input name="purpose" placeholder="Purpose" onChange={handleChange} style={{border:"1px solid grey",width:"30%",textAlign:"left",marginBottom:"20px"}}/><br />
        <input name="whom_to_meet" placeholder="Whom to Meet" onChange={handleChange}style={{border:"1px solid grey",width:"30%",textAlign:"left",marginBottom:"20px"}} /><br />
        <input name="phone" placeholder="Phone" onChange={handleChange}style={{border:"1px solid grey",width:"30%",textAlign:"left"}} /><br />

        <button type="submit"style={{width:"30%"}}>Add Visitor</button>

      </form>

    </div>
  );
};

export default VisitorAdd;