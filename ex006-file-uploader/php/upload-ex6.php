<?php
    var_dump($_FILES);

    foreach ($_FILES["file-input-ex6"]["tmp_name"] as $key => $value) {
        $targetPath = "files/" . basename($_FILES["file-input-ex6"]["name"][$key]);
        move_uploaded_file($value, $targetPath);
    }
?>