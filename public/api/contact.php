<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailerException;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, max-age=0');
header('Referrer-Policy: no-referrer');

function respond(int $status, bool $success, string $message): never
{
    http_response_code($status);
    echo json_encode(
        ['success' => $success, 'message' => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Método não permitido.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 100000) {
    respond(413, false, 'Os dados enviados ultrapassaram o limite permitido.');
}

// Campo invisível: bots costumam preenchê-lo.
if (!empty($_POST['website'] ?? '')) {
    respond(200, true, 'Mensagem enviada com sucesso.');
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $phone === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Preencha todos os campos corretamente.');
}

$textLength = static fn (string $value): int => function_exists('mb_strlen')
    ? mb_strlen($value, 'UTF-8')
    : strlen($value);

if ($textLength($name) > 100 || $textLength($email) > 254 || $textLength($phone) > 30 || $textLength($message) > 5000) {
    respond(422, false, 'Um ou mais campos ultrapassaram o tamanho permitido.');
}

$safeName = trim(str_replace(["\r", "\n"], ' ', $name));
$safeEmail = str_replace(["\r", "\n"], '', $email);
$safePhone = trim(str_replace(["\r", "\n"], ' ', $phone));

$config = [];
$configFile = __DIR__ . '/mail-config.php';
if (is_file($configFile)) {
    $loadedConfig = require $configFile;
    $config = is_array($loadedConfig) ? $loadedConfig : [];
}

$gmailAddress = trim((string) (getenv('GMAIL_ADDRESS') ?: ($config['gmail_address'] ?? '')));
$gmailPassword = preg_replace('/\s+/', '', (string) (getenv('GMAIL_APP_PASSWORD') ?: ($config['gmail_app_password'] ?? '')));
$recipient = trim((string) (getenv('CONTACT_RECIPIENT') ?: ($config['recipient'] ?? $gmailAddress)));

if (!filter_var($gmailAddress, FILTER_VALIDATE_EMAIL)
    || !filter_var($recipient, FILTER_VALIDATE_EMAIL)
    || $gmailPassword === '') {
    error_log('Formulário de contato: configuração do Gmail incompleta.');
    respond(500, false, 'O envio de e-mail ainda não foi configurado completamente.');
}

$subject = 'Novo contato pelo site — ' . $safeName;
$body = "Novo contato recebido pelo site\n\n"
    . "Nome: {$safeName}\n"
    . "E-mail: {$safeEmail}\n"
    . "Celular: {$safePhone}\n\n"
    . "Mensagem:\n{$message}\n";

$mailerFiles = [
    __DIR__ . '/vendor/PHPMailer/src/Exception.php',
    __DIR__ . '/vendor/PHPMailer/src/PHPMailer.php',
    __DIR__ . '/vendor/PHPMailer/src/SMTP.php',
];
foreach ($mailerFiles as $mailerFile) {
    if (!is_file($mailerFile)) {
        error_log('Formulário de contato: dependência PHPMailer ausente.');
        respond(500, false, 'O serviço de envio não está disponível no momento.');
    }
    require_once $mailerFile;
}

try {
    $mailer = new PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = 'smtp.gmail.com';
    $mailer->SMTPAuth = true;
    $mailer->Username = $gmailAddress;
    $mailer->Password = $gmailPassword;
    $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->Port = 587;
    $mailer->Timeout = 20;
    $mailer->CharSet = PHPMailer::CHARSET_UTF8;

    $mailer->setFrom($gmailAddress, 'Site Igor Santos');
    $mailer->addAddress($recipient);
    $mailer->addReplyTo($safeEmail, $safeName);
    $mailer->Subject = $subject;
    $mailer->Body = $body;
    $mailer->AltBody = $body;
    $mailer->send();
} catch (MailerException $exception) {
    $mailError = $mailer->ErrorInfo !== '' ? $mailer->ErrorInfo : $exception->getMessage();
    error_log('Formulário de contato: erro PHPMailer: ' . $mailError);
    if (in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) {
        respond(500, false, 'Falha SMTP local: ' . $mailError);
    }
    respond(500, false, 'Não foi possível enviar agora. Verifique a configuração do Gmail.');
} catch (Throwable $exception) {
    error_log('Formulário de contato: erro inesperado: ' . $exception->getMessage());
    respond(500, false, 'Não foi possível enviar agora. Tente novamente mais tarde.');
}

respond(200, true, 'Mensagem enviada com sucesso. Em breve entraremos em contato.');
