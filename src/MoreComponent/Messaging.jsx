import React from "react";
import "./Messaging.css";

const Messaging = () => {
  const baseUrl = "http://localhost/kkblossom/assets/images/docs/";

  return (
    <div className="messaging-page">
      <div className="messaging-card">

        {/* Header */}
        <div className="messaging-header">
          <div className="messaging-icon">
            <i className="las la-comments"></i>
          </div>

          <div>
            <h1>Messaging</h1>
            <p>
              Learn how to send In-App messages, SMS and view delivery reports
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="messaging-content">

          <div className="messaging-intro">
            <i className="las la-info-circle"></i>
            <div>
              <h3>Messaging Guide</h3>
              <p>
                The messaging system is divided into three sections. Follow the
                steps below to learn how to use each messaging feature.
              </p>
            </div>
          </div>

          {/* =========================================
              1. IN-APP MESSAGING
          ========================================= */}

          <section className="message-section">

            <div className="message-section-heading">
              <span className="message-number">01</span>

              <div>
                <h2>In-App Messaging</h2>
                <p>Send messages directly through the mobile application.</p>
              </div>
            </div>

            <div className="message-description">
              These are the messages which you send to the students through the
              mobile app. The students can view these messages inside the
              messages section on the school app. These are not limited to a
              value. You can send as many messages as you want. In-App
              messaging also includes images.
            </div>

            <div className="how-to-title">
              <i className="las la-list-ol"></i>
              <span>How to send In-App Messages?</span>
            </div>

            {/* Step 1 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">1</span>
                <p>
                  Click on <strong>Messages</strong> and then{" "}
                  <strong>In-App Messaging</strong> from the sidebar.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}inapp.png`}
                  alt="In-App Messaging"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">2</span>
                <p>
                  Click on the <strong>compose icon</strong> shown in the
                  right-bottom corner.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}Compose.png`}
                  alt="Compose message"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">3</span>
                <p>
                  Now enter your message in the textbox shown.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}textbox.png`}
                  alt="Message textbox"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">4</span>
                <p>
                  You can also <strong>attach an image</strong>.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}chooseimage.png`}
                  alt="Choose image"
                />
              </div>
            </div>

            {/* Step 5 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">5</span>
                <p>
                  Now select the <strong>recipients</strong> you want to send
                  the message.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}select.png`}
                  alt="Select recipients"
                />
              </div>
            </div>

            {/* Step 6 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">6</span>
                <p>
                  Click on the <strong>send icon</strong> in the right-bottom
                  corner of the screen.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}send.png`}
                  alt="Send message"
                />
              </div>
            </div>

            {/* Step 7 */}
            <div className="success-message">
              <i className="las la-check-circle"></i>
              <span>
                Congratulations! Your message has been sent.
              </span>
            </div>

          </section>

          {/* =========================================
              2. INBOX MESSAGING
          ========================================= */}

          <section className="message-section">

            <div className="message-section-heading">
              <span className="message-number">02</span>

              <div>
                <h2>Inbox Messaging</h2>
                <p>Send direct messages or SMS to students.</p>
              </div>
            </div>

            <div className="message-description">
              These are the messages which you send to students directly to
              the message inbox or SMS. These messages are limited to
              <strong> 160 characters</strong> and do not include images.
            </div>

            <div className="how-to-title">
              <i className="las la-list-ol"></i>
              <span>How to send Inbox Messages / SMS?</span>
            </div>

            {/* Step 1 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">1</span>
                <p>
                  Click on <strong>Messages</strong> and then{" "}
                  <strong>Inbox Messaging</strong> from the sidebar.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}inbox.png`}
                  alt="Inbox Messaging"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">2</span>
                <p>
                  Click on the <strong>compose icon</strong>.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}Compose.png`}
                  alt="Compose"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">3</span>
                <p>
                  Choose <strong>Custom message</strong> or{" "}
                  <strong>template</strong>.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}template.png`}
                  alt="Message template"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">4</span>

                <p>
                  Enter your message.
                  <span className="warning-text">
                    Do not use keywords like Dear Parents or school name.
                  </span>
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}textbox.png`}
                  alt="Message textbox"
                />
              </div>
            </div>

            {/* Step 5 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">5</span>
                <p>
                  Select the <strong>recipients</strong>.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}select.png`}
                  alt="Select recipients"
                />
              </div>
            </div>

            {/* Step 6 */}
            <div className="message-step">
              <div className="step-content">
                <span className="step-badge">6</span>
                <p>
                  Click <strong>send</strong>.
                </p>
              </div>

              <div className="step-image">
                <img
                  src={`${baseUrl}send.png`}
                  alt="Send"
                />
              </div>
            </div>

            {/* Step 7 */}
            <div className="success-message">
              <i className="las la-check-circle"></i>
              <span>
                Congratulations! Your message has been sent.
              </span>
            </div>

          </section>

          {/* =========================================
              3. DELIVERY REPORTS
          ========================================= */}

          <section className="message-section delivery-section">

            <div className="message-section-heading">
              <span className="message-number">03</span>

              <div>
                <h2>Delivery Reports</h2>
                <p>Check the delivery status of sent messages.</p>
              </div>
            </div>

            <div className="message-description">
              You can view the status of your sent message in{" "}
              <strong>Messaging → View Sent Messages</strong>. If the status
              appears as <strong>"D"</strong>, it means{" "}
              <strong>Delivered</strong>.
            </div>

            <div className="delivery-image">
              <img
                src={`${baseUrl}delivery.png`}
                alt="Delivery report"
              />
            </div>

          </section>

        </div>

        {/* Footer */}
        <div className="messaging-footer">
          <i className="las la-comments"></i>
          <span>Messaging Guide</span>
        </div>

      </div>
    </div>
  );
};

export default Messaging;