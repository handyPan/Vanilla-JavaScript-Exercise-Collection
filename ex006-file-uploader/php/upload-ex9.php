<?php
    $file_name = $_FILES['file-input-ex9']['name'];
    $tmp_name = $_FILES['file-input-ex9']['tmp_name'];
    $file_up_name = time().basename($file_name);
    move_uploaded_file($tmp_name, "files/".$file_up_name);
?>