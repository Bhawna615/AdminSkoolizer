import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ExperienceCertificateView.css";
import SchoolLogo from "../images/school-logo.png";
const BASE_URL =
"http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const ExperienceCertificateView = () => {

const { id } = useParams();
const [certificate,setCertificate] = useState(null);

useEffect(()=>{

axios.get(BASE_URL+"getExperienceCertificate/"+id)
.then(res=>{
setCertificate(res.data.data);
});

},[id]);

if(!certificate) return <p>Loading...</p>;

return (

<div className="experience-container">

{/* SCHOOL HEADER */}

<div className="tc-top-bar">

<div className="school-name-container">

<div className="school-logo-container">
<img
src={SchoolLogo}
className="school-logo"
alt="School Logo"
/>
</div>

<p className="school-name">KK BLOSSOMS SCHOOL</p>

<p className="school-address">
Shimla, Himachal Pradesh (H.P)
<br/>
C.B.S.E India, Affiliation No. 630180, School No. 43169
</p>

</div>

</div>


{/* CONTACT */}

<div className="tc-style">

<p className="tc-float-left">Phone No. 0177-2844840</p>
<p className="tc-float-right">Email: spips03@gmail.com</p>

<div className="document-title-container">
<p className="document-title">TO WHOMSOEVER IT MAY CONCERN</p>
</div>

</div>


{/* BODY */}

<div className="document-body-container">

<p className="experience-text">

I hereby verify that <b>{certificate.name}</b> teacher served as an <b>{certificate.designation}</b> 
at KK BLOSSOMS SCHOOL from <b>{certificate.from_date}</b> to <b>{certificate.to_date}</b>. 

During her tenure, she adeptly taught <b>{certificate.classes_taught}</b>, showcasing exceptional skills in creating comprehensive lesson plans, 
evaluating students’ performances, and meticulously grading tests, classwork, and homework assignments.

<br/><br/>

<b>{certificate.name}</b> exhibited unwavering dedication to her students, demonstrating a deep commitment to their academic growth and fostering a positive learning environment.

Her approach was characterized by professionalism, excellent communication, strong interpersonal skills, and effective time management.

<br/><br/>

His/Her decision to leave our institution was entirely voluntary, and we extend our best wishes to his/her for all future endeavours.

<br/><br/>

For any further inquiries or additional information, please do not hesitate to contact me during business hours.

<br/><br/>

Sincerely,

<br/><br/>

[Signature]

<br/>

Principal's Name

<br/>

Principal

<br/>

KK BLOSSOMS SCHOOL

<br/><br/>

[School Seal]

</p>

</div>

</div>

);

};

export default ExperienceCertificateView;