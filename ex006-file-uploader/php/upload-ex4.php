<?php
    $file_name = $_FILES['file-input-ex4']['name'];
    $tmp_name = $_FILES['file-input-ex4']['tmp_name'];
    $file_up_name = time().basename($file_name);
    move_uploaded_file($tmp_name, "files/".$file_up_name);
?>