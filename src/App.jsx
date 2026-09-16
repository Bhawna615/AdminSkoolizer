import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
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
import AddTeacher from "./TeacherComponent/AddTeacher";
import ViewTeachers from "./TeacherComponent/ViewTeachers";
import AddTeacherToFormer from "./TeacherComponent/AddTeacherToFormer";
import FormerTeachers from "./TeacherComponent/FormerTeachers";
import GenerateExperienceCertificate from "./TeacherComponent/GenerateExperienceCertificate";
import ExperienceCertificates from "./TeacherComponent/ExperienceCertificates";
import ExperienceCertificateView from "./TeacherComponent/ExperienceCertificateView";
import TeacherProfile from "./TeacherComponent/TeacherProfile";
import EditTeacher from "./TeacherComponent/EditTeacher";
import CreateTeacherCredentials from "./TeacherComponent/CreateTeacherCredentials";
import SponseredStudents from "./StudentComponent/SponseredStudents";
import StudentAbsent from "./StudentComponent/StudentAbsent";
import StudentBirthday from "./StudentComponent/StudentBirthday";
import StudentLeaveRequest from "./StudentComponent/StudentLeaveRequest";


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
import PassedOutStudent from "./StudentComponent/PassedOutStudent";

import MarkAttendance from "./AttendanceComponent/MarkAttendance";
import RollCall from "./AttendanceComponent/RollCall";
import ViewAttendance from "./AttendanceComponent/ViewAttendance";
import AttendanceDetails from "./AttendanceComponent/AttendanceDetails";
import EditAttendance from "./AttendanceComponent/EditAttendance";
import AttendanceByMonth from "./AttendanceComponent/AttendanceByMonth";
import AttendanceOutput from "./AttendanceComponent/AttendanceOutput";

import ViewTimeTable from "./ScheduleComponent/ViewTimetable";
import TimeTableResult from "./ScheduleComponent/TimeTableResult";
import NewPeriod from "./ScheduleComponent/NewPeriod";
import ScheduleClass from "./ScheduleComponent/ScheduleClass";
import AddClass from "./ScheduleComponent/AddClass";
import EventList from "./ScheduleComponent/EventList";
import AddEvent from "./ScheduleComponent/AddEvent";
import EventEdit from "./ScheduleComponent/EventEdit";
import ViewByClassName from "./ScheduleComponent/ViewByClassName";

import ActiveRouteDetails from "./TransportComponent/ActiveRouteDetails";
import ActiveRoutes from "./TransportComponent/ActiveRoutes";
import RoutesPage from "./TransportComponent/RoutesPage";
import AddRoutePage from "./TransportComponent/AddRoutePage";
import BusesPage from "./TransportComponent/BusesPage";
import AddBus from "./TransportComponent/AddBus";
import TransportStaffPage from "./TransportComponent/TransportStaffPage";
import AddTransportStaff from "./TransportComponent/AddTransportStaff";
import StationList from "./TransportComponent/StationList";
import AddStation from "./TransportComponent/AddStation";
import AddPassengers from "./TransportComponent/AddPassengers";


import NewExam from "./ExamComponent/NewExam";
import CreateExam from "./ExamComponent/CreateExam";
import ViewExams from "./ExamComponent/ViewExams";
import EditResult from "./ExamComponent/EditResult";
import UploadMarks from "./ExamComponent/UploadMarks";
import ViewResult from "./ExamComponent/ViewResult";
import SelectClass from "./ExamComponent/SelectClass";
import View from "./ExamComponent/Quiz/view";
import Add from "./ExamComponent/Quiz/add";
import QuestionView from "./ExamComponent/QuizQuestion/view";
import QuestionAdd from "./ExamComponent/QuizQuestion/add";
import QuestionEdit from "./ExamComponent/QuizQuestion/edit";
import QuestionPapers from "./ExamComponent/QuestionPapers";
import CreateQuestionPaper from "./ExamComponent/CreateQuestionPaper";
import ClassWiseReport from "./ExamComponent/ClassWiseReport";
import ClassWiseReportSelect from "./ExamComponent/ClassWiseReportSelect";
import SelectClassMetrics from "./ExamComponent/ClassWiseMertrics/SelectClass";
import ClassMetrics from "./ExamComponent/ClassWiseMertrics/ClassMetrics";
import CustomReportCard from "./ExamComponent/CustomReportCard";

import AssignHomework from "./HomeworkComponent/AssignHomework";
import HomeworkDetails from "./HomeworkComponent/HomeworkDetails";
import HomeworkView from "./HomeworkComponent/HomeworkView";


import ViewEmployee from "./EmployeeComponent/ViewEmployee";
import AddEmployee from "./EmployeeComponent/AddEmployee";
import EmployeeAttendance from "./EmployeeComponent/EmployeeAttendance";
import ViewEmployeeAttendance from "./EmployeeComponent/ViewEmployeeAttendance";
import EmployeeAttendanceDetails from "./EmployeeComponent/EmployeeAttendanceDetails";
import EmployeeAttendanceByMonth from "./EmployeeComponent/EmployeeAttendanceByMonth";
import MonthlyAttendancePrint from "./EmployeeComponent/MonthlyAttendancePrint";


import FeeStructure from "./FeeComponent/FeeStructure";
import AddFeeStructure from "./FeeComponent/AddFeeStructure";
import Discounts from "./FeeComponent/Discounts";
import AddDiscount from "./FeeComponent/AddDiscount";
import AssignStudents from "./FeeComponent/AssignStudents";
import CreatePayment from "./FeeComponent/CreatePayment";
import AdminViewPayment from "./FeeComponent/AdminViewPayment";
import AcceptPayment from "./FeeComponent/AcceptPayment";
import EditStudentFee from "./FeeComponent/EditStudentFee";
import FeeReceipt from "./FeeComponent/FeeReceipt";
import EditPaidFee from "./FeeComponent/EditPaidFee";
import SessionSelect from "./FeeComponent/SessionSelect";
import SelectPendingPaymentsPeriod from "./FeeComponent/SelectPendingPaymentsPeriod";
import PendingPayments from "./FeeComponent/PendingPayments";
import FeeStatistics from "./FeeComponent/FeeStatistics";
import DisplayStatistics from "./FeeComponent/DisplayStatistics";
import PaymentTable from "./FeeComponent/PaymentTable";


import VisitorView from "./VisitorsComponent/VisitorView";
import VisitorAdd from "./VisitorsComponent/VisitorAdd";


import CreateMessage from "./MessageComponent/newmessage";
import MessageView from "./MessageComponent/MessageView";

import CreatePost from "./PostComponent/CreatePost";
import PostView from "./PostComponent/PostView";

import PrivacyPolicy from "./MoreComponent/PrivacyPolicy";
import Messaging from "./MoreComponent/Messaging";


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
        <Route path="/AttendanceComponent/AttendanceOutput" element={<AttendanceOutput />} />
        <Route path="EmployeeComponent/MonthlyAttendancePrint/:month" element={<MonthlyAttendancePrint />} />
        <Route path="ExamComponent/CustomReportCard"element={<CustomReportCard/>}/>
        <Route path="/FeeComponent/FeeReceipt/:id" element={<FeeReceipt />} />
        <Route path="/FeeComponent/PaymentTable/:type/:period" element={<PaymentTable />} />
        <Route path="/FeeComponent/ViewPaidPaymentsByDate/:date" element={<PaymentTable />}/>

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
          <Route path="StudentComponent/PassedOutStudent" element={<PassedOutStudent />} />
          <Route path="StudentComponent/SponseredStudents" element={<SponseredStudents />} />
          <Route path="StudentComponent/StudentAbsent" element={<StudentAbsent />} />
          <Route path="StudentComponent/StudentBirthday" element={<StudentBirthday />} />
          <Route path="StudentComponent/StudentLeaveRequest" element={<StudentLeaveRequest />} />
          


          <Route path="TeacherComponent/AddTeachers" element={<AddTeacher />} />
          <Route path="TeacherComponent/ViewTeachers" element={<ViewTeachers />} />
          <Route path="TeacherComponent/AddTeacherToFormer/:id" element={<AddTeacherToFormer />} />
          <Route path="TeacherComponent/FormerTeachers" element={<FormerTeachers />} />
          <Route path="TeacherComponent/GenerateExperienceCertificate/:id" element={<GenerateExperienceCertificate />} />
          <Route path="TeacherComponent/ExperienceCertificate" element={<ExperienceCertificates />} />
          <Route path="TeacherComponent/createTeacherCredentials/:id" element={<CreateTeacherCredentials />} />
          <Route path="TeacherComponent/TeacherProfile/:id" element={<TeacherProfile />} />
          <Route path="TeacherComponent/EditTeacher/:id" element={<EditTeacher />} />

          <Route path="AttendanceComponent/MarkAttendance" element={<MarkAttendance />} />
          <Route path="AttendanceComponent/RollCall" element={<RollCall />} />
          <Route path="AttendanceComponent/ViewAttendance" element={<ViewAttendance />} />
          <Route path="AttendanceComponent/AttendanceDetails" element={<AttendanceDetails />} />
          <Route path="AttendanceComponent/EditAttendance" element={<EditAttendance />} />
          <Route path="AttendanceComponent/AttendanceByMonth" element={<AttendanceByMonth />} />

          <Route path="ScheduleComponent/ViewTimeTable" element={<ViewTimeTable />} />
          <Route path="ScheduleComponent/TimeTableResult" element={<TimeTableResult />} />
          <Route path="ScheduleComponent/NewPeriod" element={<NewPeriod />} />
          <Route path="ScheduleComponent/ScheduleClass" element={<ScheduleClass />} />
          <Route path="ScheduleComponent/AddClass" element={<AddClass />} />
          <Route path="ScheduleComponent/EventList" element={<EventList />} />
          <Route path="ScheduleComponent/AddEvent" element={<AddEvent />} />
          <Route path="ScheduleComponent/EventEdit/:id" element={<EventEdit />} />
          <Route path="ScheduleComponent/ViewByClassName/:className" element={<ViewByClassName />}/>

          <Route path="TransportComponent/ActiveRoutes" element={<ActiveRoutes />} />
          <Route path="TransportComponent/ActiveRouteDetails/:id" element={<ActiveRouteDetails />} />
          <Route path="TransportComponent/RoutesPages" element={<RoutesPage />} />
          <Route path="TransportComponent/add-route" element={<AddRoutePage />} />
          <Route path="TransportComponent/BussesPage" element={<BusesPage />} />
          <Route path="TransportComponent/add-bus" element={<AddBus />} />
          <Route path="TransportComponent/add-transport-staff" element={<AddTransportStaff />} />
          <Route path="TransportComponent/transport-staff" element={<TransportStaffPage />} />
          <Route path="TransportComponent/stations" element={<StationList />} />
          <Route path="TransportComponent/add-station" element={<AddStation />} />
          <Route path="TransportComponent/add-passengers" element={<AddPassengers />} />


          <Route path="ExamComponent/NewExam" element={<NewExam />} />
          <Route path="ExamComponent/create-exam" element={<CreateExam />} />
          <Route path="ExamComponent/view-exams" element={<ViewExams />} />
          <Route path="ExamComponent/edit-result/:examCode" element={<EditResult />} />
          <Route path="ExamComponent/upload-marks/:examCode" element={<UploadMarks />} />
          <Route path="ExamComponent/view-result/:examCode" element={<ViewResult />} />
          <Route path="ExamComponent/SelectClass" element={<SelectClass />} />
          <Route path="ExamComponent/Quiz/view" element={<View />} />
          <Route path="ExamComponent/Quiz/add" element={<Add />} />
          <Route path="ExamComponent/QuizQuestion/view/:quizId" element={<QuestionView />} />
          <Route path="ExamComponent/QuizQuestion/add/:quizId" element={<QuestionAdd />} />
          <Route path="ExamComponent/QuizQuestion/edit/:id" element={<QuestionEdit />} />
          <Route path="ExamComponent/QuestionPapers" element={<QuestionPapers />} />
          <Route path="ExamComponent/ClassWiseMetrics/SelectClass" element={<SelectClassMetrics />} />
          <Route path="ExamComponent/ClassWiseMetrics/ClassMetrics" element={<ClassMetrics />} />
          <Route path="/dashboard/ExamComponent/CreateQuestionPaper"element={<CreateQuestionPaper />}/>
          <Route path="/dashboard/ExamComponent/ClassWiseReport" element={<ClassWiseReport />} />
          <Route path="/dashboard/ExamComponent/ClassWiseReportSelect" element={<ClassWiseReportSelect />} />
          

          <Route path="HomeworkComponent/AssignHomework" element={<AssignHomework />} />
          <Route path="HomeworkComponent/HomeworkDetails" element={<HomeworkDetails />} />
          <Route path="HomeworkComponent/HomeworkView" element={<HomeworkView />} />


          <Route path="EmployeeComponent/ViewEmployee" element={<ViewEmployee />} />
          <Route path="EmployeeComponent/AddEmployee" element={<AddEmployee />} />
          <Route path="EmployeeComponent/EmployeeAttendance" element={<EmployeeAttendance />} />
          <Route path="EmployeeComponent/ViewEmployeeAttendance" element={<ViewEmployeeAttendance />} />
          <Route path="EmployeeComponent/EmployeeAttendanceDetails/:date" element={<EmployeeAttendanceDetails />} />
          <Route path="EmployeeComponent/EmployeeAttendanceByMonth" element={<EmployeeAttendanceByMonth />} />


          <Route path="FeeComponent/FeeStructure" element={<FeeStructure />} />
          <Route path="FeeComponent/AddFeeStructure" element={<AddFeeStructure />} />
          <Route path="FeeComponent/Discounts" element={<Discounts />} />
          <Route path="FeeComponent/AddDiscount" element={<AddDiscount />} />
          <Route path="FeeComponent/AssignStudents/:id" element={<AssignStudents />} />
          <Route path="FeeComponent/CreatePayment" element={<CreatePayment />} />
          <Route path="FeeComponent/AdminViewPayment" element={<AdminViewPayment />} />
          <Route path="FeeComponent/AcceptPayment/:id" element={<AcceptPayment />} />
          <Route path="FeeComponent/EditStudentFee/:id" element={<EditStudentFee />} />
          <Route path="FeeComponent/EditPaidFee/:id" element={<EditPaidFee />} />
          <Route path="FeeComponent/SessionSelect" element={<SessionSelect />} />
          <Route path="FeeComponent/SelectPendingPaymentsPeriod" element={<SelectPendingPaymentsPeriod />} />
          <Route path="FeeComponent/PendingPayments" element={<PendingPayments />} />
          <Route path="FeeComponent/FeeStatistics" element={<FeeStatistics />} />
          <Route path="FeeComponent/DisplayStatistics/:period" element={<DisplayStatistics />} />
          
          

          <Route path="VisitorsComponent/VisitorView" element={<VisitorView />} />
          <Route path="VisitorsComponent/VisitorAdd" element={<VisitorAdd />} />


          <Route path="MessageComponent/CreateMessage" element={<CreateMessage />} />
          <Route path="MessageComponent/MessageView" element={<MessageView />} />
         
          <Route path="PostComponent/CreatePost" element={<CreatePost />} />
          <Route path="PostComponent/PostView" element={<PostView />} />

          <Route path="MoreComponent/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="MoreComponent/Messaging" element={<Messaging />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
