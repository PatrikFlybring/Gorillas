<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Log in</title>
	<link rel="stylesheet" type="text/css" href="style.css" media="screen"/>
</head>
<body>
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
	<div id="content">
		<label><p><h5>Inspiration:</h5>
		A modest remake of the Qbasic Gorillas game from 1991.</label></p>
		<label><p><h5>Rules:</h5>
		Input angle and velocity to shoot the banana<br>
		towards the other monkey and gain points, first <br>
		one to reach given goal wins the game. Use trial<br>
		and error to find a good angle and velocity.</p>
		<p><h5>Developer:</h5> Jacob Svedman and Patrik Flybring</label></p>
	</div>
	<div id="BILD">
		<img src="Bilder/Frontpage.png" alt="Gorillas">
	</div>
</div>
</body>
</html>