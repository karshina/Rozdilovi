<?php

include_once 'utils.php';
require 'phpmailer/PHPMailerAutoload.php';

$img = isset($_POST['img']) ? $_POST['img'] : $_GET['img'];
$text = isset($_POST['text']) ? $_POST['text'] : $_GET['text'];
$video = isset($_POST['video']) ? $_POST['video'] : $_GET['video'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) || !$_POST['name']) {
    $fail = 'Будь ласка, вкажіть email отримувача і ваше ім\'я';
  } else {

    $mail = new PHPMailer;

    $mail->IsSMTP(); // enable SMTP
    //$mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
    $mail->SMTPAuth = true; // authentication enabled
    $mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
    $mail->Host = "mail.ukraine.com.ua";
    $mail->Port = 465; // or 587

    //$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    //$mail->Port = 587;                                    // TCP port to connect to

    $mail->CharSet = 'UTF-8';

    $mail->IsHTML(true);
    $mail->Username = "lystonosha@rozdilovi.org";
    $mail->Password = "8tY72GMzS0hl";
    if (!filter_var($_POST['replyto'], FILTER_VALIDATE_EMAIL))
      $mail->AddReplyTo($_POST['replyto'], $_POST['name']);
    $mail->SetFrom("lystonosha@rozdilovi.org", $_POST['name']);
    $mail->AddAddress($_POST['email']);

    //$mail->addReplyTo('dmitry.leader@gmail.com', 'Information');
    //$mail->addBCC('bcc@example.com');

    $link = url_origin($_SERVER, true).'/?img='.$_POST['img'].'&video='.$_POST['video'];

    $template = file_get_contents(__DIR__ . '/email.html');
    $template = str_replace('{{IMG}}', url_origin($_SERVER, true).'/uploads/'.$_POST['img'].'.jpg', $template);
    $template = str_replace('{{LINK}}', $link, $template);
    $template = str_replace('{{TEXT}}', $_POST['text'], $template);

    //$mail->Subject = $_POST['text'];
    $mail->Subject = 'Листівка з rozdilovi.org';
    $mail->Body    = $template;
    $mail->AltBody = 'Для перегляду листівки перейдіть за посиланням: '.$link;

    if(!$mail->send()) {
        $fail = 'При відправці сталася помилка. Будь-ласка, перевірте дані або спробуйте пізніше.';
        //echo 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        $sent = true;
    }
  }
}

?><!doctype html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang=""> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang=""> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang=""> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang=""> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>роздІловІ</title>

        <meta name="description" content="роздІловІ — це поетично-музично-візуальний проект від творчої агенції АртПоле. Ідея та візуалізація: Оля Михайлюк, текст і голос: Сергій Жадан, музика: Олексій Ворсоба і Влад Креймер.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="apple-touch-icon" href="apple-touch-icon.png">

        <link rel="stylesheet" href="/css/normalize.min.css">
        <link rel="stylesheet" href="/css/about.css?v=1474746150">
        <link rel="stylesheet" href="/css/common.css?v=1474746150">
        <link rel="stylesheet" href="/css/form.css?v=1474746150">

     </head>
     <body>

       <a id="logo" href="./"></a>

       <div class="about-container">

            <div class="photo">
              <img src="uploads/<?php echo $img; ?>.jpg" width="600px" style="border: 1px solid #cccccc"/>
            </div>

            <?php if ($sent) { ?>
            
            <div class="text margin-small">
              <p class="header center grey">
                <strong>Листівку відправлено</strong>
              </p><p class="center">
                <button onclick="window.close()">Закрити</button>
              </p>
            </div>

            <?php } else { ?>

            <form method="POST">
              <?php if ($fail) { ?> 
                <p class="error"><?php echo $fail; ?></p> 
              <?php } ?>
				      <input type="hidden" name="img" value="<?php echo $img; ?>"/>
              <input type="hidden" name="text" value="<?php echo $text; ?>"/>
              <input type="hidden" name="video" value="<?php echo $video; ?>"/>
              <p><input type="text" name="email" value="Email отримувача" onfocus="if(this.value == 'Email отримувача') { this.value = ''; }" onblur="if(this.value == '') { this.value = 'Email отримувача'; }" /></p>
				      <p><input type="text" name="name" value="Ваше ім'я" onfocus="if(this.value == 'Ваше ім\'я') { this.value = ''; }" onblur="if(this.value == '') { this.value = 'Ваше ім\'я'; }" /></p>
              <p><input type="text" name="replyto" value="Ваш email" onfocus="if(this.value == 'Ваш email') { this.value = ''; }" onblur="if(this.value == '') { this.value = 'Ваш email'; }" /></p>
				      <p><button type="submit">Відправити</button></p>
			      </form>

            <?php } ?>

      </div>

    </body>
</html>
