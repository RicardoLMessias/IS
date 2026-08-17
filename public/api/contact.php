<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit;
}

// TROQUE pelo endereço que receberá as mensagens antes de publicar.
$recipient = 'SEU_EMAIL@DOMINIO.COM';

if ($recipient === 'SEU_EMAIL@DOMINIO.COM') {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'O destinatário do formulário ainda não foi configurado.']);
    exit;
}

// Campo invisível: bots costumam preenchê-lo.
if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['success' => true, 'message' => 'Mensagem enviada com sucesso.']);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $phone === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos corretamente.']);
    exit;
}

if (mb_strlen($name) > 100 || mb_strlen($phone) > 30 || mb_strlen($message) > 5000) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Um ou mais campos ultrapassaram o tamanho permitido.']);
    exit;
}

$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$subject = 'Novo contato pelo site — ' . $safeName;
$body = "Nome: {$safeName}\nEmail: {$safeEmail}\nCelular: {$phone}\n\nMensagem:\n{$message}\n";
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Site Igor Santos <no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost') . '>',
    'Reply-To: ' . $safeEmail,
];

$sent = mail($recipient, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Não foi possível enviar agora. Tente novamente mais tarde.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Mensagem enviada com sucesso. Em breve entraremos em contato.']);
