<?php
$link = mysql_connect("localhost","SGDAS031","!wSD=SKR");
if (!$link) {
    die('Could not connect: ' . mysql_error());
}

$db_selected = mysql_select_db('SGDAS031db', $link);
mysql_set_charset('utf8', $link);
if (!$db_selected) {
    die ('Can\'t use foo : ' . mysql_error());
}
?>