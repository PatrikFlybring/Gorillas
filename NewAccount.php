<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Create account</title>
	<link rel="stylesheet" type="text/css" href="style.css" media="screen"/>
</head>
<body>
<?php
	include 'db.php';
	
	if($_POST["Vill_Skapa"]==1)
	{
		$_POST["Vill_Skapa"] = 0;
		if($_POST["txtUsername"]!="" && $_POST["txtPassword"]!="")
		{
			$Username = $_POST["txtUsername"];
			$Password = $_POST["txtPassword"];
			$Password = md5($Password);
			$Username = mysql_real_escape_string($Username);
			$query = "SELECT * FROM tblInloggning WHERE Username='$Username'";
			$result = mysql_query($query);
			if(mysql_num_rows($result) > 0)
				echo "<script>alert(\"Username already exists.\")</script>";
			
			else
			{
				if($_POST["temp"] == $_POST["cbx"])
				{
					mysql_query("INSERT INTO tblInloggning (Username, Password) VALUES('$Username', '$Password')");
				}
				else
					echo "<script>alert(\"Error\")</script>";
			}
		}
		else
			echo "<script>alert(\"Error\")</script>";
	}
	$temp = rand(1,2);
	if($temp == 1)
	{
		$bild1 = 1;
		$bild2 = 2;
	}
	else
	{
		$bild1 = 2;
		$bild2 = 1;
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
	<div id="Registrering">
	<form action="NewAccount.php" method="post">
		<h1>Register account</h1>
		<p>
			<label>Username:</label><input type="text" name="txtUsername">
		</p>
		<input type="hidden" value="1" name="Vill_Skapa">
		<input type="hidden" value="<?php echo $temp; ?>" name="temp">
		<p>
			<label>Password:</label><input type="password" name="txtPassword">
		</p>
		<label>Which one is the dog?</label>
		<p>
			<img class="DogCat" src="Bilder/bild<?php echo $bild1; ?>.jpg"><input type="radio" value="1" name="cbx">
		</p>
		<p>
			<img class="DogCat" src="Bilder/bild<?php echo $bild2; ?>.jpg"><input type="radio" value="2" name="cbx">
		</p>
		<p>
			<input type="submit" value="Create account" name="btnCreate">
		</p>
	</form>
	</div>
	</div>
</body>
</html>