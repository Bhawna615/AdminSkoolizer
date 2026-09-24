import React from "react";
import "./TermsAndConditions.css";

const TermsAndConditions = () => {
  return (
    <div className="terms-page">

      <div className="terms-card">

        {/* HEADER */}
        <div className="terms-header">
          <div className="terms-icon">
            <i className="las la-file-contract"></i>
          </div>

          <div>
            <h1>Terms and Conditions</h1>
            <p>Please read the following terms carefully</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="terms-content">

          <p>
            Welcome to our website. If you continue to browse and use this
            website, you are agreeing to comply with and be bound by the
            following terms and conditions of use, which together with our
            privacy policy govern Macmer Web Solution’s relationship with you
            in relation to this website. If you disagree with any part of these
            terms and conditions, please do not use our website.
          </p>

          <p>
            The term <strong>Macmer Web Solutions</strong> or ‘us’ or ‘we’
            refers to the owner of the website whose office is Prem Niwas
            Airport Road, Shivnagar Totu Shimla-11. The term ‘you’ refers to
            the user or viewer of our website. The use of this website is
            subject to the following terms of use:
          </p>

          {/* IMPORTANT NOTICES */}
          <div className="terms-notice">
            <i className="las la-info-circle"></i>

            <p>
              “Any personal data collected will be used by (Macmer Web
              Solutions) to contact you via phone, SMS or email for marketing
              and to deliver certain updates for services or information you
              have requested.”
            </p>
          </div>

          <div className="terms-notice">
            <i className="las la-check-circle"></i>

            <p>
              "By Using this website you agree that the contact numbers you
              provided are correct and the person owning the Contact number has
              given you the consent of receiving the Transactional SMS 24 X 7"
            </p>
          </div>

          {/* TERMS LIST */}
          <div className="terms-list">

            <div className="term-item">
              <span>01</span>
              <p>
                The content of the pages of this website is for your general
                information and use only. It is subject to change without
                notice.
              </p>
            </div>

            <div className="term-item">
              <span>02</span>
              <p>
                This website uses cookies to monitor browsing preferences. If
                you do allow cookies to be used, the following personal
                information may be stored by us for use by third parties:
                Contact Numbers.
              </p>
            </div>

            <div className="term-item">
              <span>03</span>
              <p>
                Neither we nor any third parties provide any warranty or
                guarantee as to the accuracy, timeliness, performance,
                completeness or suitability of the information and materials
                found or offered on this website for any particular purpose.
                You acknowledge that such information and materials may contain
                inaccuracies or errors and we expressly exclude liability for
                any such inaccuracies or errors to the fullest extent permitted
                by law.
              </p>
            </div>

            <div className="term-item">
              <span>04</span>
              <p>
                Your use of any information or materials on this website is
                entirely at your own risk, for which we shall not be liable. It
                shall be your own responsibility to ensure that any products,
                services or information available through this website meet
                your specific requirements.
              </p>
            </div>

            <div className="term-item">
              <span>05</span>
              <p>
                This website contains material which is owned by or licensed to
                us. This material includes, but is not limited to, the design,
                layout, look, appearance and graphics. Reproduction is
                prohibited other than in accordance with the copyright notice,
                which forms part of these terms and conditions.
              </p>
            </div>

            <div className="term-item">
              <span>06</span>
              <p>
                All trademarks reproduced in this website, which are not the
                property of, or licensed to the operator, are acknowledged on
                the website.
              </p>
            </div>

            <div className="term-item">
              <span>07</span>
              <p>
                Unauthorised use of this website may give rise to a claim for
                damages and/or be a criminal offence.
              </p>
            </div>

            <div className="term-item">
              <span>08</span>
              <p>
                From time to time, this website may also include links to other
                websites. These links are provided for your convenience to
                provide further information. They do not signify that we
                endorse the website(s). We have no responsibility for the
                content of the linked website(s).
              </p>
            </div>

            <div className="term-item">
              <span>09</span>
              <p>
                Your use of this website and any dispute arising out of such
                use of the website is subject to the laws of Himachal Pradesh
                High Court.
              </p>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="terms-footer">
          <i className="las la-shield-alt"></i>
          <span>Terms & Conditions</span>
        </div>

      </div>

    </div>
  );
};

export default TermsAndConditions;