// src/components/PaymentsTable.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentsTable = ({ payments }) => {
  const navigate = useNavigate();

  const calculateLateFee = (row) => {
    if (row.status === 1) {
      return row.late_fee_paid;
    }

    if (!row.lastdate) return 0;

    const today = new Date();
    const lastDate = new Date(row.lastdate);

    if (today > lastDate) {
      const diffTime = today - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return (diffDays - 1) * 10;
    }

    return 0;
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>PaymentId</th>
            <th>Transaction Id</th>
            <th>EasePay Id</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Admission No.</th>
            <th>Admission Fee</th>
            <th>Annual Fee</th>
            <th>Tuition Fee</th>
            <th>Transport Fee</th>
            <th>Amount</th>
            <th>Last Date</th>
            <th>Period</th>
            <th>Status</th>
            <th>Payment Mode</th>
            <th>Late Fee</th>
            <th>Amount Paid</th>
            <th>Paid On</th>
            <th>Session</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((row) => (
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
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() =>
                        navigate(`/receipt/${row.feeid}`)
                      }
                    >
                      Receipt
                    </button>

                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() =>
                        navigate(`/edit-payment/${row.feeid}`)
                      }
                    >
                      Edit
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() =>
                        navigate(`/accept-payment/${row.feeid}`)
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() =>
                        navigate(`/edit-payment/${row.feeid}`)
                      }
                    >
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTable;