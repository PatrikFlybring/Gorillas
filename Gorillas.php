<!DOCTYPE html>
<html>
<head>
	<link rel="Stylesheet" type="text/css" href="style.css" />
	<meta charset="utf-8" />
	<?php session_start();?>
</head>
<body onload="Loopdidoop();startPage('<?php echo $_SESSION["User"] ?>');">
<div id="wrapper">
	<div id="Menu">
		<h1>J-Bird and P-Man</h1>
		<h2>Gorillas</h2>



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
			if(isset($_SESSION["User"])){
				echo "Logged in as " .$_SESSION["User"]. ".";
				echo "<a href=\"Logout.php\">Log out</a>";
			}
			else
				echo "Not logged in";
		?>
	</div>
	<div id="highscore">	
		<h1>Highscore:</h1>
		<div id="mydiv"></div>
	</div>
	<div id="Gorillas">
		<canvas id="canvasGameSettings" width="800px" height="400px"></canvas>
		<canvas id="canvasBg" width="800px" height="400px"></canvas>
		<canvas id="canvasCity" width="800px" height="400px"></canvas>
		<canvas id="canvasInput" width="800px" height="400px"></canvas>
		<canvas id="canvasGorilla" width="800px" height="400px" ></canvas>
		<canvas id="canvasSun" width="800px" height="400px" ></canvas>
		<canvas id="canvasBall" width="800px" height="400px" ></canvas>
	<script src="game.js"></script>
	</div>
	<div id="footer">
		<p>	Input angle and velocity to shoot the banana
			towards the other monkey and gain points, first
			one to reach given goal wins the game. Use trial
			and error to find a good angle and velocity.
		</p>
	</div>
</div>
</body>
</html>