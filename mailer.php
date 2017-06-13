<?php

include_once 'utils.php';
require 'phpmailer/PHPMailerAutoload.php';

$config = parse_ini_file('../config.ini');

$img = isset($_POST['img']) ? $_POST['img'] : $_GET['img'];
$text = isset($_POST['text']) ? $_POST['text'] : $_GET['text'];

$errors = array(); //To store errors
$form_data = array(); //Pass back the data to `form.php`

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) || !$_POST['name']) {

    $errors['name'] = 'Будь ласка, вкажіть email отримувача і ваше ім\'я';

  } else {

    $mail = new PHPMailer;

    $mail->IsSMTP(); // enable SMTP
    //$mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
    $mail->SMTPAuth = true; // authentication enabled
    $mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
    $mail->Host = $config['mailhost'];
    $mail->Port = $config['mailport']; // or 587

    //$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    //$mail->Port = 587;                                    // TCP port to connect to

    $mail->CharSet = 'UTF-8';

    $mail->IsHTML(true);
    $mail->Username = $config['mailuser'];
    $mail->Password = $config['mailpassword'];
    if (filter_var($_POST['replyto'], FILTER_VALIDATE_EMAIL))
      $mail->AddReplyTo($_POST['replyto'], $_POST['name']);
    $mail->SetFrom("lystonosha@rozdilovi.org", $_POST['name']);
    $mail->AddAddress($_POST['email']);

    //$mail->addReplyTo('dmitry.leader@gmail.com', 'Information');
    //$mail->addBCC('bcc@example.com');

    $link = url_origin($_SERVER, true).'/?img='.$_POST['img'].'&video=3_VOPQ1B-F0';

    $template = file_get_contents(__DIR__ . '/email.html');
    $template = str_replace('{{IMG}}', url_origin($_SERVER, true).'/uploads/'.$_POST['img'].'.jpg', $template);
    $template = str_replace('{{LINK}}', $link, $template);

    //$mail->Subject = $_POST['text'];
    $mail->Subject = $_POST['text'];
    $mail->Body    = $template;
    $mail->AltBody = 'Для перегляду листівки перейдіть за посиланням: '.$link;

    if(!$mail->send()) {
        $errors['name'] = 'При відправці сталася помилка. Будь-ласка, перевірте дані або спробуйте пізніше.';
        //echo 'Mailer Error: ' . $mail->ErrorInfo;
    }
  }
}

if (!empty($errors)) { //If errors in validation
    $form_data['success'] = false;
    $form_data['errors']  = $errors;
}
else { //If not, process the form, and return true on success
    $form_data['success'] = true;
    //$form_data['posted'] = 'Data Was Posted Successfully';
}

//Return the data back to form.php
echo json_encode($form_data);

?>