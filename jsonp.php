<?php
    header("content-type: text/javascript");
 
    if(isset($_GET['name']) && isset($_GET['callback']))
    {
        $obj->name = $_GET['name'];
        $obj->message = "Hello " . $obj->name;
 
        echo $_GET['callback']. '(' . json_encode($obj) . ');';
    }
?>