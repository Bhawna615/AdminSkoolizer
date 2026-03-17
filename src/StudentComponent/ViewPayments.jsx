import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminFee/";

const ViewPayments = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [payments, setPayments] = useState([]);
  const [classes, setClasses] = useState([]);

  const [session, setSession] = useState("2026");
  const [className, setClassName] = useState("NURSERY");
  const [month, setMonth] = useState("March");

  const [enableFilter, setEnableFilter] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [entryCount, setEntryCount] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);

  // SHOW SUCCESS MESSAGE FROM NAVIGATION
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);

      const timer = setTimeout(() => {
        setSuccessMsg("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // SEARCH
  const filteredData = payments.filter((item) => {
    const searchVal = searchTerm.toLowerCase();
    return (
      item.studentname?.toLowerCase().includes(searchVal) ||
      item.feeid?.toString().includes(searchVal) ||
      item.admission_number?.toLowerCase().includes(searchVal)
    );
  });

  const indexOfLast = currentPage * entryCount;
  const indexOfFirst = indexOfLast - entryCount;
  const displayedData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entryCount);

  useEffect(() => {
    loadClasses();
    loadPayments();
  }, []);

  useEffect(() => {
    if (enableFilter) {
      setCurrentPage(1);
      loadPayments();
    }
  }, [session, className, month, enableFilter]);

  const getSessionValue = (year) => {
    const nextYear = Number(year) + 1;
    return `${year}-${nextYear}`;
  };

  const loadPayments = async () => {
    try {
      let payload = {};
      if (enableFilter) {
        payload = {
          session: getSessionValue(session),
          class: className,
          month: month
        };
      }

      const res = await axios.post(`${BASE_URL}filterBySessionAndClass`, payload);
      if (res.data && res.data.status) {
        setPayments(res.data.data || []);
      } else {
        setPayments([]);
        setSuccessMsg("No records found");
      }
    } catch (error) {
      console.log(error);
      setPayments([]);
      setSuccessMsg("Error loading data");
    }
  };

  const loadClasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}getClasses`);
      if (res.data && res.data.status) {
        setClasses(res.data.data || []);
      }
    } catch (error) {
      console.log(error);
      setClasses([]);
    }
  };

  const calculateLateFee = (row) => {
    if (row.status === 1) return row.late_fee_paid || 0;
    if (!row.lastdate) return 0;
    const today = new Date();
    const lastDate = new Date(row.lastdate);
    if (today > lastDate) {
      const diffTime = today - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? (diffDays - 1) * 10 : 0;
    }
    return 0;
  };

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const exportToCSV = () => {

    const headers = [
      "PaymentID","Transaction Id","EasePay Id","Student Name","Class",
      "Admission No","Admission Fee","Annual Fee","Tuition Fee","Transport Fee",
      "Amount","Last Date","Period","Status","Payment Mode","Late Fee",
      "Amount Paid","Paid On","Session","Remarks"
    ];

    const rows = displayedData.map((row) => [
      row.feeid,
      row.razorpay_order_id,
      row.easepay_id,
      row.studentname,
      row.class,
      row.admission_number,
      row.admission_fee,
      row.annual_fee,
      row.tuition_fee,
      row.transport_fee,
      row.amount,
      row.lastdate,
      row.period,
      row.status === 1 ? "Paid" : "Pending",
      row.payment_mode,
      calculateLateFee(row),
      row.amount_paid,
      row.paidondate,
      row.session,
      row.remarks
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments.csv");
    document.body.appendChild(link);

    link.click();
  };

  return (
    <div className="container-fluid p-4">

      {successMsg && (
        <div className="alert alert-success">{successMsg}</div>
      )}

      <div style={{border:"dashed 2px black",padding:"50px",margin:"50px"}}>

        <div className="form-check mb-3" style={{display:"flex",alignItems:"center",marginBottom:"20px"}}>
          <input
            type="checkbox"
            className="form-check-input"
            checked={enableFilter}
            onChange={(e)=>setEnableFilter(e.target.checked)}
            style={{fontSize:"20px"}}
          />
          <label className="form-check-label" style={{display:"block",marginLeft:"-25px",fontSize:"20px"}}>ENABLE FILTER</label>
        </div>

        <div className="row">

          <div className="col-md-4" style={{display:"flex",flexDirection:"column"}}>
            <label style={{fontSize:"14px",marginBottom:"5px"}}>
              <i class="las la-filter"></i>
              YEAR</label>
            <select
              className="form-control"
              style={{border:"solid 2px black",borderRadius:"0",fontSize:"14px",width:"90%",padding:"5px"}}
              value={session}
              onChange={(e)=>setSession(e.target.value)}
              disabled={!enableFilter}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <div className="col-md-4"style={{display:"flex",flexDirection:"column"}}>
            <label style={{fontSize:"14px",marginBottom:"5px"}}>
              <i class="las la-filter"></i>
              MONTH</label>
            <select
              className="form-control"
                style={{border:"solid 2px black",borderRadius:"0",fontSize:"14px",width:"90%",padding:"5px"}}
              value={month}
              onChange={(e)=>setMonth(e.target.value)}
              disabled={!enableFilter}
            >
              {months.map((m)=>(<option key={m} value={m}>{m}</option>))}
            </select>
          </div>

          <div className="col-md-4"style={{display:"flex",flexDirection:"column"}}>
            <label style={{fontSize:"14px",marginBottom:"5px"}}>
              <i class="las la-filter"></i>
              CLASS</label>
            <select
              className="form-control"
                style={{border:"solid 2px black",borderRadius:"0",fontSize:"14px",width:"90%",padding:"5px"}}
              value={className}
              onChange={(e)=>setClassName(e.target.value)}
              disabled={!enableFilter}
            >
              <option value="NURSERY">NURSERY</option>
              {classes.map((c,index)=>(<option key={index} value={c.Classname}>{c.Classname}</option>))}
            </select>
          </div>

        </div>
      </div>

      <div className="justify-content-between mb-3"style={{margin:"0px 50px 50px 50px",flexDirection:"row",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:"15px",color:"black"}}>
          Show
          <select className="mx-2" value={entryCount} onChange={(e)=>setEntryCount(Number(e.target.value))}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          entries
        </div>
        <div style={{fontSize:"15px",color:"black"}}>
          Search
          <input type="text" className="form-control d-inline-block ms-2" style={{width:"200px",border:"solid 1px black",borderRadius:"0",fontSize:"14px",padding:"5px"}} value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered custom-table">
          <thead>
            <tr >
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>PaymentID</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Transaction Id</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>EasePay Id</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Student Name</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Class</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Admission No.</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Admission Fee</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Annual Fee</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Tuition Fee</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Transport Fee</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Amount</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Last Date</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Period</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Status</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Payment Mode</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Late Fee</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Amount Paid</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Paid On</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Session</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Remarks</th>
              <th style={{backgroundColor:"#2C56BB",color:"white"}}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {displayedData.length === 0 ? (
              <tr>
                <td colSpan="21" className="text-center">No Records Found</td>
              </tr>
            ) : (
              displayedData.map((row) => (
                <tr key={row.feeid}>
                  <td>{row.feeid}</td>
                  <td>{row.razorpay_order_id}</td>
                  <td>{row.easepay_id}</td>
                  <td>{row.studentname}</td>
                  <td>{row.class}</td>
                  <td>{row.admission_number}</td>
                  <td>{row.admission_fee}</td>
                  <td>{row.annual_fee}</td>
                  <td>{row.tuition_fee}</td>
                  <td>{row.transport_fee}</td>
                  <td>{row.amount}</td>
                  <td>{row.lastdate}</td>
                  <td>{row.period}</td>
                  <td>{row.status === 1 ? "Paid" : "Pending"}</td>
                  <td>{row.payment_mode}</td>
                  <td>{calculateLateFee(row)}</td>
                  <td>{row.amount_paid}</td>
                  <td>{row.paidondate}</td>
                  <td>{row.session}</td>
                  <td>{row.remarks}</td>
                  <td>
                    {row.status === 1 ? (
                      <>
                        <button className="btn btn-sm btn-success me-1" onClick={() => navigate(`/receipt/${row.feeid}`)}>Receipt</button>
                        <button className="btn btn-sm btn-warning" onClick={() => navigate(`/edit-payment/${row.feeid}`)}>Edit</button>
                      </>
                    ) : (
                      <>
                        <button style={{fontSize: "26px"}} onClick={() => navigate(`/dashboard/StudentComponent/AcceptStudentFee/${row.feeid}`)}><i class="la la-hand-holding-usd btn-icon"></i></button>
                        <button
  style={{ fontSize: "26px" }}
  onClick={() => navigate(`/dashboard/StudentComponent/UpdateStudentFee/${row.feeid}`)}
>
  <i className="la la-pen btn-icon"></i>
</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <div className="d-flex justify-content-between align-items-center"style={{margin:"30px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>

          <div className="text-muted small"style={{fontSize:"15px"}}>
            Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)} of {filteredData.length} entries
          </div>

          <div className="d-flex align-items-center">

            <button
              style={{marginRight:"20px",fontSize:"15px"}}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            <button style={{padding:"10px",border:"solid 1px lightgrey", marginRight:"20px"}}>
              {currentPage}
            </button>

            <button
              style={{fontSize:"15px"}}
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>

          </div>
        </div>

        <div className="mt-2">
          <button className="btn-export-csv" onClick={exportToCSV} style={{background: "#f95555", color: "white", border: "none",fontFamily: "Nunito_regular",padding: "5px 25px",fontSize:"15px",margin:"0 35px"}}>
            Export to CSV
          </button>
        </div>

      </div>

    </div>
  );
};

export default ViewPayments;