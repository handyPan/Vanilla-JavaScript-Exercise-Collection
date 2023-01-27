<?php
    $targetPath = "files/" . basename($_FILES["file-input-ex5"]["name"]);
    move_uploaded_file($_FILES["file-input-ex5"]["tmp_name"], $targetPath);
?>