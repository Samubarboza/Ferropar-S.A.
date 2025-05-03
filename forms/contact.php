<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Configura tu dirección de correo electrónico de destino
    $receiving_email_address = 'samu_junior95@hotmail.com'; // Reemplaza con tu correo

    $headers = "From: " . $email;
    $headers .= "\r\n" . "Reply-To: " . $email;
    $headers .= "\r\n" . "X-Mailer: PHP/" . phpversion();

    // Envía el correo
    if (mail($receiving_email_address, $subject, $message, $headers)) {
        echo "success";  // Solo responde "success" en caso de éxito
    } else {
        echo "error";    // Solo responde "error" si falla el envío
    }
}
?>
