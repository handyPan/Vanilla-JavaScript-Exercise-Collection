<?php
    var_dump($_FILES);

    foreach ($_FILES["file-input-ex10"]["tmp_name"] as $key => $value) {
        $targetPath = "files/" . basename($_FILES["file-input-ex10"]["name"][$key]);
        move_uploaded_file($value, $targetPath);
    }
?>