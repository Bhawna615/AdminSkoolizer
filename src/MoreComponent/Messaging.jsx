import React from "react";

const Messaging = () => {
  const baseUrl = "http://localhost/kkblossom/assets/images/docs/";

  return (
    <div style={{ padding: "30px", fontFamily: "RedhatR", fontSize: "18px" }}>
      
      <h1 style={{ textAlign: "center", fontSize: "30px" }}>
        Messaging
      </h1>

      <p>The messaging is divided into two sections:</p>

      {/* 1. In-App Messaging */}
      <p>
        <b style={{ fontSize: "20px" }}>1. In-App Messaging:</b> These are the
        messages which you send to the students through the mobile app. The
        students can view these messages inside the messages section on the
        school app. These are not limited to a value. You can send as many
        messages as you want. In-App messaging also includes images.
      </p>

      <br />

      <p><b>How to send In-App Messages ?</b></p>

      <p>1. Click on Messages and then In-App Messaging from the sidebar.</p>
      <img src={`${baseUrl}inapp.png`} alt="inapp" /><br /><br />

      <p>2. Click on the compose icon shown in right-bottom corner.</p>
      <img src={`${baseUrl}Compose.png`} alt="compose" /><br /><br />

      <p>3. Now Enter your message in the textbox shown.</p>
      <img src={`${baseUrl}textbox.png`} alt="textbox" /><br /><br />

      <p>4. You can also attach an image.</p>
      <img src={`${baseUrl}chooseimage.png`} alt="choose" /><br /><br />

      <p>5. Now select the recipients you want to send the message.</p>
      <img src={`${baseUrl}select.png`} alt="select" /><br /><br />

      <p>6. Click on the send icon in right-bottom corner of screen.</p>
      <img src={`${baseUrl}send.png`} alt="send" /><br /><br />

      <p>7. Congratulations! Your message has been sent.</p>

      <br /><br />

      {/* 2. Inbox Messaging */}
      <p>
        <b style={{ fontSize: "30px" }}>2. Inbox Messaging:</b> These are the
        messages which you send to students directly to the message inbox or SMS.
        These messages are limited to 160 characters and do not include images.
      </p>

      <br />

      <p><b>How to send Inbox Messages/SMS</b></p>

      <p>1. Click on Messages and then Inbox Messaging from the sidebar.</p>
      <img src={`${baseUrl}inbox.png`} alt="inbox" /><br /><br />

      <p>2. Click on the compose icon.</p>
      <img src={`${baseUrl}Compose.png`} alt="compose" /><br /><br />

      <p>3. Choose Custom message or template.</p>
      <img src={`${baseUrl}template.png`} alt="template" /><br /><br />

      <p>
        4. Enter your message.{" "}
        <b style={{ color: "red" }}>
          Do not use keywords like Dear Parents or school name
        </b>
      </p>
      <img src={`${baseUrl}textbox.png`} alt="textbox" /><br /><br />

      <p>5. Select recipients.</p>
      <img src={`${baseUrl}select.png`} alt="select" /><br /><br />

      <p>6. Click send.</p>
      <img src={`${baseUrl}send.png`} alt="send" /><br /><br />

      <p>7. Congratulations! Your message has been sent.</p>

      <br /><br />

      {/* 3. Delivery Reports */}
      <p>
        <b style={{ fontSize: "30px" }}>3. Delivery Reports:</b> You can view the
        status of your sent message in Messaging → View Sent Messages. If the
        status appears as "D", it means Delivered.
      </p>

      <br />

      <img src={`${baseUrl}delivery.png`} alt="delivery" /><br /><br />

    </div>
  );
};

export default Messaging;