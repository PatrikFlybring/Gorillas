<?php
	session_start();
	$_SESSION["User"] = null;
	$_SESSION["Loggedin"] = false;
	
	header ("location: ./Default.php");
?>