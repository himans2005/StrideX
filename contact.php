<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "db.php";

// PHPMailer files
require_once "PHPMailer-master/src/Exception.php";
require_once "PHPMailer-master/src/PHPMailer.php";
require_once "PHPMailer-master/src/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = trim($_POST["name"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $phone = trim($_POST["phone"] ?? "");
    $subject = trim($_POST["subject"] ?? "");
    $message = trim($_POST["message"] ?? "");


    // Check required fields
    if ($name === "" || $email === "" || $subject === "" || $message === "") {
        die("Please fill all required fields.");
    }


    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email address.");
    }


    // ==============================
    // 1. SAVE MESSAGE IN DATABASE
    // ==============================

    $sql = "INSERT INTO contacts
            (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param(
        "sssss",
        $name,
        $email,
        $phone,
        $subject,
        $message
    );


    if ($stmt->execute()) {


        // ==============================
        // 2. SEND EMAIL USING PHPMailer
        // ==============================

        $mail = new PHPMailer(true);

        try {

            // Gmail SMTP settings
            $mail->isSMTP();
            $mail->Host = "smtp.gmail.com";
            $mail->SMTPAuth = true;

            // YOUR GMAIL ACCOUNT
            $mail->Username = "nasirmaazsk18@gmail.com";

            // ENTER YOUR APP PASSWORD HERE
            $mail->Password = "ndmc cnoj xoxa cffu";

            // SSL
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;


            // Sender
            $mail->setFrom(
                "nasirmaazsk18@gmail.com",
                "StrideX Website"
            );

            // Receiver
            $mail->addAddress(
                "nasirmaazsk18@gmail.com",
                "StrideX Admin"
            );


            // Customer email as Reply-To
            $mail->addReplyTo(
                $email,
                $name
            );


            // Email format
            $mail->isHTML(true);

            $mail->Subject = "New StrideX Contact Message - " . $subject;


            // Email content
            $mail->Body = "
                <h2>New Customer Message - StrideX</h2>

                <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>

                <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>

                <p><strong>Phone:</strong> " . htmlspecialchars($phone) . "</p>

                <p><strong>Subject:</strong> " . htmlspecialchars($subject) . "</p>

                <p><strong>Message:</strong></p>

                <p>" . nl2br(htmlspecialchars($message)) . "</p>

                <hr>

                <p>This message was submitted from the StrideX website.</p>
            ";


            // Send email
            $mail->send();


            // Success message
            echo "<h2>Thank you, " . htmlspecialchars($name) . "!</h2>";
            echo "<p>Your message has been submitted successfully.</p>";
            echo "<p>Email notification has also been sent.</p>";


        } catch (Exception $e) {

            // Database saved, but email failed
            echo "<h2>Thank you, " . htmlspecialchars($name) . "!</h2>";
            echo "<p>Your message has been saved successfully.</p>";
            echo "<p>However, the email notification could not be sent.</p>";

            // For testing only
            echo "<p>Email Error: " . htmlspecialchars($mail->ErrorInfo) . "</p>";
        }


    } else {

        echo "<h2>Something went wrong.</h2>";
        echo "<p>" . htmlspecialchars($stmt->error) . "</p>";
    }


    $stmt->close();
    $conn->close();


} else {

    echo "Invalid request.";
}

?>