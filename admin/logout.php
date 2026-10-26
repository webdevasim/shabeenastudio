<?php require __DIR__.'/bootstrap.php';if(!requestPost())go();csrf();$_SESSION=[];session_regenerate_id(true);go('login.php');
