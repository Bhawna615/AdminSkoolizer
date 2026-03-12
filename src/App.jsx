import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLogin from "./component/AdminLogin";
import Dashboard from "./component/Dashboard";
import TermsAndConditions from "./component/TermsAndConditions";
import StudentAdmission from "./StudentComponent/StudentAdmission";
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

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="StudentComponent/StudentAdmission" element={<StudentAdmission />} />
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
