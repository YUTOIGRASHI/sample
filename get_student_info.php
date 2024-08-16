<?php
header('Content-Type: application/json');

include 'config.php';

$no = $_GET['no'] ?? null;

$lastFourDigits = str_pad(substr($no, -4), 4, '0', STR_PAD_LEFT);

$sql = "SELECT grade, name, subject_class_time FROM students WHERE RIGHT(code_number, 4) = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $lastFourDigits);
$stmt->execute();
$result = $stmt->get_result();
$student = $result->fetch_assoc();

if ($student) {
    echo json_encode($student);
} else {
    echo json_encode(null);
}

$stmt->close();
$conn->close();
?>
