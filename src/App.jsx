import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLogin from "./component/AdminLogin";
import Dashboard from "./component/Dashboard";
import TermsAndConditions from "./component/TermsAndConditions";
import StudentAdmission from "./StudentComponent/StudentAdmission";
import AdminViewStudent from "./StudentComponent/AdminViewStudent";
import Report from "./StudentComponent/Report";
import SpecialReport from "./StudentComponent/SpecialReport";
import CustomReport from "./StudentComponent/CustomReport";
import ReportRouter from "./StudentComponent/ReportRouter";
import ReportCard from "./StudentComponent/ReportCard";
import ReportCardRouter from "./StudentComponent/ReportCardRouter";
import StudentAttendanceDetails from "./StudentComponent/StudentAttendanceDetails";
import GenerateTC from "./StudentComponent/GenerateTC";
import TransferCertificate from "./StudentComponent/TransferCertificate";
import EditTC from "./StudentComponent/EditTC";
import ViewTC from "./StudentComponent/ViewTC";
import CharacterCertificate from "./StudentComponent/CharacterCertificate";
import ViewCharacterCertificates from "./StudentComponent/ViewCharacterCertificates";
import OpenCharacterCertificate from "./StudentComponent/OpenCharacterCertificate";
import StudentTransportDetails from "./StudentComponent/StudentTransportDetails";
import StudentExamDetails from "./StudentComponent/StudentExamDetails";
import StudentFeeDetails from "./StudentComponent/StudentFeeDetails";
import StudentMessages from "./StudentComponent/StudentMessages";
import CreateCredentials from "./StudentComponent/CreateCredentials";
import ViewStudentProfile from "./StudentComponent/ViewStudentProfile";
import EditStudent from "./StudentComponent/EditStudent";
import CreateStudentPayment from "./StudentComponent/CreateStudentPayment";
import ViewPayment from "./StudentComponent/ViewPayments";
import UpdateStudentFee from "./StudentComponent/UpdateStudentFee";
import AcceptStudentFee from "./StudentComponent/AcceptStudentFee";
import ViewTransferredStudents from "./StudentComponent/ViewTransferredStudents";
import DisplayCharacterCertificates from "./StudentComponent/DisplayCharacterCertificates";
import DisplayLeaveRequests from "./StudentComponent/DisplayLeaveRequests";
import AddTeacher from "./TeacherComponent/AddTeacher";
import ViewTeachers from "./TeacherComponent/ViewTeachers";
import AddTeacherToFormer from "./TeacherComponent/AddTeacherToFormer";
import FormerTeachers from "./TeacherComponent/FormerTeachers";
import GenerateExperienceCertificate from "./TeacherComponent/GenerateExperienceCertificate";
import ExperienceCertificates from "./TeacherComponent/ExperienceCertificates";
import ExperienceCertificateView from "./TeacherComponent/ExperienceCertificateView";

import AdminListStudent from "./StudentComponent/AdminListStudent";
import StudentListView from "./StudentComponent/StudentListView";
import StudentPromote from "./StudentComponent/StudentPromote";
import StudentMetrics from "./StudentComponent/StudentMetrics";
import MetricsView from "./StudentComponent/MetricsView";
import MetricEdit from "./StudentComponent/MetricEdit";
import MetricCreate from "./StudentComponent/MetricCreate";
import MetricsAdd from "./StudentComponent/MetricsAdd";
import StudentSports from "./StudentComponent/StudentSports";
import SportsAdd from "./StudentComponent/SportsAdd";
import SportsEdit from "./StudentComponent/SportsEdit";
import SportsParticipant from "./StudentComponent/SportsParticipant";
import SportParticipantAdd from "./StudentComponent/SportParticipantAdd";

import MarkAttendance from "./AttendanceComponent/MarkAttendance";
import RollCall from "./AttendanceComponent/RollCall";
import ViewAttendance from "./AttendanceComponent/ViewAttendance";
import AttendanceDetails from "./AttendanceComponent/AttendanceDetails";
import EditAttendance from "./AttendanceComponent/EditAttendance";



function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/StudentListView" element={<StudentListView />} />

        {/* Report Route */}
                <Route path="/StudentComponent/ReportCard/:id" element={<ReportCard />} />
        
                <Route path="/StudentComponent/report/:id" element={<Report />} />
                <Route path="/StudentComponent/SpecialReport/:id" element={<SpecialReport />} />
                <Route path="/StudentComponent/CustomReport/:id" element={<CustomReport />} />
                <Route path="/StudentComponent/ReportRouter/:id" element={<ReportRouter />} />
                <Route path="/StudentComponent/ReportCardRouter/:id" element={<ReportCardRouter />} />
                <Route path="/StudentComponent/ViewTC/:id" element={<ViewTC />} />
                <Route path="/character-certificate/:id" element={<OpenCharacterCertificate />} />
                <Route path="/StudentComponent/View-Payments/:id" element={<ViewPayment />} />
                <Route path="/TeacherComponent/ExperienceCertificateView/:id" element={<ExperienceCertificateView />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="StudentComponent/StudentAdmission" element={<StudentAdmission />} />
          <Route path="StudentComponent/AdminViewStudent" element={<AdminViewStudent />} />
          <Route path="StudentComponent/StudentAttendenceDetails/:id" element={<StudentAttendanceDetails />} />
          <Route path="StudentComponent/GenerateTC/:id" element={<GenerateTC />} />
          <Route path="StudentComponent/TransferCertificate" element={<TransferCertificate />} />
          <Route path="StudentComponent/EditTC/:id" element={<EditTC />} />
          <Route path="StudentComponent/CharacterCertificate/:id" element={<CharacterCertificate />} />
          <Route path="StudentComponent/ViewCharacterCertificates" element={<ViewCharacterCertificates />} />
          <Route path="StudentComponent/StudentTransportDetails/:id" element={<StudentTransportDetails />} />
          <Route path="StudentComponent/StudentExamDetails/:id" element={<StudentExamDetails />} />
          <Route path="StudentComponent/StudentFeeDetails/:id" element={<StudentFeeDetails />} />
          <Route path="StudentComponent/StudentMessages/:id" element={<StudentMessages />} />
          <Route path="StudentComponent/CreateCredentials/:id" element={<CreateCredentials />} />
          <Route path="StudentComponent/ViewStudentProfile/:studentId" element={<ViewStudentProfile />} />
          <Route path="StudentComponent/CreateStudentPayment/:studentId" element={<CreateStudentPayment />} />
          <Route path="StudentComponent/EditStudent/:studentId" element={<EditStudent />} />
          <Route path="StudentComponent/UpdateStudentFee/:feeId" element={<UpdateStudentFee />} />
          <Route path="StudentComponent/AcceptStudentFee/:feeId" element={<AcceptStudentFee />} />
          <Route path="StudentComponent/ViewTransferredStudents" element={<ViewTransferredStudents />} />
          <Route path="StudentComponent/DisplayCharacterCertificates" element={<DisplayCharacterCertificates />} />
          <Route path="StudentComponent/DisplayLeaveRequests" element={<DisplayLeaveRequests />} />
          <Route path="StudentComponent/AdminListStudent" element={<AdminListStudent />} />
          <Route path="StudentComponent/StudentPromote" element={<StudentPromote />} />
          <Route path="StudentComponent/StudentMetrics" element={<StudentMetrics />} />
          <Route path="StudentComponent/MetricsView" element={<MetricsView />} />
          <Route path="StudentComponent/MetricEdit/:id" element={<MetricEdit />} />
          <Route path="StudentComponent/MetricCreate" element={<MetricCreate />} />
          <Route path="StudentComponent/MetricsAdd/:studentId" element={<MetricsAdd />} />
          <Route path="StudentComponent/StudentSports" element={<StudentSports />} />
          <Route path="StudentComponent/SportsAdd" element={<SportsAdd />} />
          <Route path="StudentComponent/SportsEdit/:id" element={<SportsEdit />} />
          <Route path="StudentComponent/SportsParticipant/:sportEventId" element={<SportsParticipant />} />
          <Route path="StudentComponent/SportParticipantAdd/:sportEventId" element={<SportParticipantAdd />} />


          <Route path="TeacherComponent/AddTeachers" element={<AddTeacher />} />
          <Route path="TeacherComponent/ViewTeachers" element={<ViewTeachers />} />
          <Route path="TeacherComponent/AddTeacherToFormer/:id" element={<AddTeacherToFormer />} />
          <Route path="TeacherComponent/FormerTeachers" element={<FormerTeachers />} />
          <Route path="TeacherComponent/GenerateExperienceCertificate/:id" element={<GenerateExperienceCertificate />} />
          <Route path="TeacherComponent/ExperienceCertificate" element={<ExperienceCertificates />} />
          <Route path="TeacherComponent/create-credentials/:id" element={<CreateCredentials />} />

          <Route path="AttendanceComponent/MarkAttendance" element={<MarkAttendance />} />
          <Route path="AttendanceComponent/RollCall" element={<RollCall />} />
          <Route path="AttendanceComponent/ViewAttendance" element={<ViewAttendance />} />
          <Route path="AttendanceComponent/AttendanceDetails" element={<AttendanceDetails />} />
          <Route path="AttendanceComponent/EditAttendance" element={<EditAttendance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
