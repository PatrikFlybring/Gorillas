<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Log in</title>
	<link rel="stylesheet" type="text/css" href="style.css" media="screen"/>
</head>
<body onload="Loopdidoop()">
<?php
	include 'db.php';

	if($_POST["Vill_Logga_In"] == 1)
	{
		$_POST["Vill_Logga_In"]=0;
		$Username=$_POST["txtUsername"];
		$Password=$_POST["txtPassword"];
		$Username=mysql_real_escape_string($Username);
		$Password=md5($Password);
		$query="SELECT * FROM tblInloggning WHERE Username='$Username' AND Password='$Password'";
		$result=mysql_query($query);
		$nr_rows=mysql_num_rows($result);
		mysql_close();
		session_start();
		if($nr_rows==1)
		{	
			$_SESSION["Loggedin"] = true;
			$_SESSION["User"] = $Username;
			header("location:Default.php");
		}
		else
		{
			$_SESSION["Loggedin"] = false;	
			echo "<label><script>alert(\"Invalid username or password\")</script></label>";
		}
	}
?>
<div id="wrapper">
	<div id="Menu">
		<h1>J-Bird and P-Man</h1>
		<ul id="MainMenu">
			<li>
				<a href="Default.php">Home</a>
			</li>
			<li>
				<a href="Gorillas.php" onmouseout="MouseOut('Spel')" onmouseover="MouseOver('Spel')">Gorillas</a>
					<ul id="Spel" onmouseout="MouseOut('Spel')" onmouseover="MouseOver('Spel')">
					</ul>
			</li>
			<li>
				<a href="index.php" onmouseout="MouseOut('Kontakt')" onmouseover="MouseOver('Kontakt')">Log in</a>
					<ul id="Kontakt" onmouseout="MouseOut('Kontakt')" onmouseover="MouseOver('Kontakt')" >
					</ul>
			</li>
			<li>
				<a href="NewAccount.php">Registration</a>
			</li>
		</ul>
		<?php
		session_start();
			if(isset($_SESSION["User"])){
				echo "Logged in as " .$_SESSION["User"]. ".";
				echo "<a href=\"Logout.php\">Log out</a>";
			}
			else
				echo "Not logged in";
		?>
	</div>
	<div id="Inloggning">
		<h1>Enter info</h1>
		<form action="index.php" method="post">
			<p>
				<label>Username:</label><input type="text" name="txtUsername">		
			</p>
			<p>
				<label>Password:</label><input type="password" name="txtPassword">
				<input type="hidden" name="Vill_Logga_In" value="1">
			</p>
			<p>			 
				<input type="submit" value="Log in" name="btnLogin"><label><a href="NewAccount.php">or register an account</a></label>
			</p>
		</form>
	</div>
</div>
</body>
</html>