import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-card">

        {/* Header */}
        <div className="privacy-header">
          <div className="privacy-icon">
            <i className="las la-user-shield"></i>
          </div>

          <div>
            <h1>Privacy Policy</h1>
            <p>Your privacy and personal information are important to us</p>
          </div>
        </div>

        {/* Content */}
        <div className="privacy-content">

          <div className="privacy-date">
            <i className="las la-calendar-alt"></i>
            <span>Last updated: 01/02/2022</span>
          </div>

          <p>
            Macmer Web Solutions ("us", "we", or "our") operates
            https://www.skoolizer.in (the "Site"). This page informs you of our
            policies regarding the collection, use and disclosure of Personal
            Information we receive from users of the Site.
          </p>

          <p>
            We use your Personal Information only for providing and improving
            the Site. By using the Site, you agree to the collection and use of
            information in accordance with this policy.
          </p>

          {/* Information Collection */}
          <section className="privacy-section">
            <div className="privacy-section-title">
              <span>01</span>
              <h2>Information Collection And Use</h2>
            </div>

            <p>
              While using our Site, we may ask you to provide us with certain
              personally identifiable information that can be used to contact
              or identify you. Personally identifiable information may include,
              but is not limited to your name ("Personal Information").
            </p>
          </section>

          {/* Log Data */}
          <section className="privacy-section">
            <div className="privacy-section-title">
              <span>02</span>
              <h2>Log Data</h2>
            </div>

            <p>
              Like many site operators, we collect information that your
              browser sends whenever you visit our Site ("Log Data").
            </p>

            <p>
              This Log Data may include information such as your computer's
              Internet Protocol ("IP") address, browser type, browser version,
              the pages of our Site that you visit, the time and date of your
              visit, the time spent on those pages and other statistics.
            </p>

            <p>
              In addition, we may use third party services such as Google
              Analytics that collect, monitor and analyze this.
            </p>
          </section>

          {/* Communications */}
          <section className="privacy-section">
            <div className="privacy-section-title">
              <span>03</span>
              <h2>Communications</h2>
            </div>

            <p>
              We may use your Personal Information to contact you with
              newsletters, marketing or promotional materials and other
              information.
            </p>
          </section>

          {/* Cookies */}
          <section className="privacy-section">
            <div className="privacy-section-title">
              <span>04</span>
              <h2>Cookies</h2>
            </div>

            <p>
              Cookies are files with small amount of data, which may include an
              anonymous unique identifier.
            </p>

            <p>
              Cookies are sent to your browser from a web site and stored on
              your computer's hard drive.
            </p>

            <p>
              Like many sites, we use "cookies" to collect information. You can
              instruct your browser to refuse all cookies or to indicate when a
              cookie is being sent. However, if you do not accept cookies, you
              may not be able to use some portions of our Site.
            </p>
          </section>

          {/* Security */}
          <section className="privacy-section">
            <div className="privacy-section-title">
              <span>05</span>
              <h2>Security</h2>
            </div>

            <div className="privacy-notice">
              <i className="las la-shield-alt"></i>

              <p>
                The security of your Personal Information is important to us,
                but remember that no method of transmission over the Internet,
                or method of electronic storage, is 100% secure. While we
                strive to use commercially acceptable means to protect your
                Personal Information, we cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Changes */}
          <section className="privacy-section">
            <div className="privacy-section-title">
              <span>06</span>
              <h2>Changes To This Privacy Policy</h2>
            </div>

            <p>
              This Privacy Policy is effective as of (add date) and will remain
              in effect except with respect to any changes in its provisions in
              the future, which will be in effect immediately after being
              posted on this page.
            </p>

            <p>
              We reserve the right to update or change our Privacy Policy at any
              time and you should check this Privacy Policy periodically. Your
              continued use of the Service after we post any modifications on
              this page will constitute your acknowledgment of the
              modifications and your consent to abide and be bound by the
              modified Privacy Policy.
            </p>

            <p>
              If we make any material changes, we will notify you via email or
              by placing a prominent notice on our website.
            </p>
          </section>

          {/* Contact */}
          <section className="privacy-section privacy-contact">
            <div className="privacy-section-title">
              <span>07</span>
              <h2>Contact Us</h2>
            </div>

            <p>
              If you have any questions about this Privacy Policy, please
              contact us.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="privacy-footer">
          <i className="las la-lock"></i>
          <span>Your Privacy Matters</span>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;