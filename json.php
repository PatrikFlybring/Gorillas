
<?php
	include 'db.php';
	session_start();
	$User = $_SESSION["User"];
	if(isset($_GET["Klarat_Spelet"]))
	{
		$query="SELECT * FROM tblInloggning WHERE Username='$User'";
		$result=mysql_query($query);
		$nr_rows=mysql_num_rows($result);
		session_start();
		if($nr_rows==1)
		{	
			$query="SELECT * FROM tblInloggning WHERE Username='$User'";
			$result=mysql_query($query);
			$res=mysql_fetch_array($result);
			$tmp = $res[3]+1;
			$query="UPDATE tblInloggning SET Vinster='$tmp' WHERE Username='$User'";
			mysql_query($query) or die(mysql_error());
		}
	}
	else
	{
		$query = "SELECT Id,Username,Vinster FROM tblInloggning ORDER BY Vinster DESC";
		$result = mysql_query($query) or die(mysql_error());
		
		$array = array();
		while($r = mysql_fetch_assoc($result))
			$rows[] = $r;
			
		echo json_encode($rows);
	}
?>


