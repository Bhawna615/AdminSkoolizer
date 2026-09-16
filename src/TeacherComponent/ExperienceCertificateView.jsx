import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ExperienceCertificateView.css";
import SchoolLogo from "../images/school-logo.png";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const ExperienceCertificateView = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    axios
      .get(BASE_URL + "getExperienceCertificate/" + id)
      .then((res) => {
        setCertificate(res.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=900,height=900");

    if (!printWindow) {
      alert("Please allow popups to print the certificate.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Experience Certificate</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              width: 210mm;
              min-height: 297mm;
              background: white;
              font-family: Arial, sans-serif;
            }

            .certificate {
              width: 210mm;
              min-height: 297mm;
              padding: 8mm;
              background: white;
            }

            .certificate-inner {
              min-height: 281mm;
              border: 2px solid #000;
              padding: 12mm;
              position: relative;
            }

            .school-header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 18px;
              text-align: center;
            }

            .school-logo {
              width: 75px;
              height: 75px;
              object-fit: contain;
            }

            .school-details h1 {
              margin: 0 0 6px;
              font-size: 25px;
              font-weight: 800;
              color: #000;
            }

            .school-details p {
              margin: 3px 0;
              font-size: 13px;
              color: #000;
            }

            .contact-row {
              display: flex;
              justify-content: space-between;
              margin-top: 20px;
              font-size: 13px;
            }

            .divider {
              height: 2px;
              background: #000;
              margin: 14px 0 25px;
            }

            .title-section {
              text-align: center;
              margin-bottom: 22px;
            }

            .title-section h2 {
              margin: 0;
              font-size: 24px;
              letter-spacing: 2px;
            }

            .title-line {
              width: 220px;
              height: 2px;
              background: #000;
              margin: 8px auto;
            }

            .reference {
              display: flex;
              justify-content: space-between;
              margin-bottom: 25px;
              font-size: 13px;
            }

            .content {
              font-family: Georgia, "Times New Roman", serif;
              font-size: 14px;
              line-height: 1.7;
              text-align: justify;
              color: #000;
            }

            .content p {
              margin-bottom: 16px;
            }

            .opening {
              text-align: center;
              font-family: Arial, sans-serif;
              margin-bottom: 25px !important;
            }

            .signature-section {
              display: flex;
              justify-content: flex-end;
              margin-top: 45px;
            }

            .signature {
              width: 200px;
              text-align: center;
            }

            .signature-space {
              height: 45px;
            }

            .signature-line {
              border-top: 1px solid #000;
              margin-bottom: 8px;
            }

            .signature strong,
            .signature span {
              display: block;
              margin-top: 5px;
              font-size: 13px;
            }

            .footer {
              position: absolute;
              bottom: 8mm;
              left: 0;
              width: 100%;
              text-align: center;
              font-size: 10px;
            }

            @media print {
              html,
              body {
                width: 210mm;
                height: 297mm;
              }
            }
          </style>
        </head>

        <body>

          <div class="certificate">

            <div class="certificate-inner">

              <div class="school-header">

                <img
                  src="${SchoolLogo}"
                  class="school-logo"
                  alt="School Logo"
                />

                <div class="school-details">

                  <h1>KK BLOSSOMS SCHOOL</h1>

                  <p>Shimla, Himachal Pradesh (H.P)</p>

                  <p>
                    C.B.S.E India, Affiliation No. 630180,
                    School No. 43169
                  </p>

                </div>

              </div>

              <div class="contact-row">

                <span>
                  Phone No. 0177-2844840
                </span>

                <span>
                  Email: spips03@gmail.com
                </span>

              </div>

              <div class="divider"></div>

              <div class="title-section">

                <h2>
                  EXPERIENCE CERTIFICATE
                </h2>

                <div class="title-line"></div>

              </div>

              <div class="reference">

                <span>
                  Certificate No: ${certificate.id}
                </span>

                <span>
                  Date: ${new Date().toLocaleDateString("en-GB")}
                </span>

              </div>

              <div class="content">

                <p class="opening">
                  <strong>
                    TO WHOMSOEVER IT MAY CONCERN
                  </strong>
                </p>

                <p>
                  This is to certify that
                  <strong> ${certificate.name} </strong>
                  worked as an
                  <strong> ${certificate.designation} </strong>
                  at
                  <strong> KK BLOSSOMS SCHOOL </strong>
                  from
                  <strong> ${certificate.from_date} </strong>
                  to
                  <strong> ${certificate.to_date} </strong>.
                </p>

                <p>
                  During her tenure with our institution, she
                  responsibly taught
                  <strong> ${certificate.classes_taught} </strong>.
                  She demonstrated excellent teaching skills,
                  dedication towards students, and a strong
                  commitment to their academic and overall
                  development.
                </p>

                <p>
                  Throughout her service, she carried out her
                  responsibilities with sincerity,
                  professionalism, and dedication. Her teaching
                  methodology, communication skills, and ability
                  to maintain a positive learning environment
                  were highly appreciated.
                </p>

                <p>
                  She maintained good professional conduct and
                  demonstrated excellent interpersonal and time
                  management skills during her association with
                  the school.
                </p>

                <p>
                  Her decision to leave the institution was
                  voluntary. We wish her every success and
                  prosperity in all her future endeavours.
                </p>

                <p>
                  This certificate is issued upon her request
                  for whatever purpose it may serve.
                </p>

              </div>

              <div class="signature-section">

                <div class="signature">

                  <div class="signature-space"></div>

                  <div class="signature-line"></div>

                  <strong>
                    Principal
                  </strong>

                  <span>
                    KK BLOSSOMS SCHOOL
                  </span>

                </div>

              </div>

              <div class="footer">

                This is a computer-generated certificate.

              </div>

            </div>

          </div>

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.print();
              }, 500);
            };
          </script>

        </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (!certificate) {
    return (
      <div className="certificate-loading">
        Loading Certificate...
      </div>
    );
  }

  return (
    <div className="certificate-page">

      {/* PRINT BUTTON */}

      <div className="certificate-action-bar">

        <button
          type="button"
          className="certificate-print-btn"
          onClick={handlePrint}
        >
          <i className="bi bi-printer-fill"></i>
          Print Certificate
        </button>

      </div>

      {/* SCREEN PREVIEW */}

      <div className="experience-certificate">

        <div className="certificate-inner">

          <div className="certificate-school-header">

            <img
              src={SchoolLogo}
              className="certificate-school-logo"
              alt="School Logo"
            />

            <div className="certificate-school-details">

              <h1>KK BLOSSOMS SCHOOL</h1>

              <p>
                Shimla, Himachal Pradesh (H.P)
              </p>

              <p>
                C.B.S.E India, Affiliation No. 630180,
                School No. 43169
              </p>

            </div>

          </div>

          <div className="certificate-contact-row">

            <span>
              Phone No. 0177-2844840
            </span>

            <span>
              Email: spips03@gmail.com
            </span>

          </div>

          <div className="certificate-divider"></div>

          <div className="certificate-title-section">

            <h2>
              EXPERIENCE CERTIFICATE
            </h2>

            <div className="certificate-title-line"></div>

          </div>

          <div className="certificate-reference">

            <span>
              Certificate No: {certificate.id}
            </span>

            <span>
              Date: {new Date().toLocaleDateString("en-GB")}
            </span>

          </div>

          <div className="certificate-content">

            <p className="certificate-opening">
              <strong>
                TO WHOMSOEVER IT MAY CONCERN
              </strong>
            </p>

            <p>
              This is to certify that{" "}
              <strong>{certificate.name}</strong>{" "}
              worked as an{" "}
              <strong>{certificate.designation}</strong>{" "}
              at <strong>KK BLOSSOMS SCHOOL</strong> from{" "}
              <strong>{certificate.from_date}</strong> to{" "}
              <strong>{certificate.to_date}</strong>.
            </p>

            <p>
              During her tenure with our institution, she
              responsibly taught{" "}
              <strong>{certificate.classes_taught}</strong>.
              She demonstrated excellent teaching skills and
              dedication towards students.
            </p>

          </div>

          <div className="certificate-signature-section">

            <div className="certificate-signature">

              <div className="signature-space"></div>

              <div className="signature-line"></div>

              <strong>Principal</strong>

              <span>
                KK BLOSSOMS SCHOOL
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ExperienceCertificateView;