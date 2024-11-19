let modeSelected = false;  
let mode;  
let modePopup, easyButton, normalButton, hardButton;
let popupMessage;
let popupTimeout;
const pts = [];
var size = 0.75;
let startTime;  // Pour stocker l'heure de départ
let gameOver = false; // Variable pour vérifier si le jeu est terminé
let hintUsageCount = 0; // Compteur pour suivre le nombre d'utilisations de l'indice
const maxHints = 5; // Nombre maximum d'utilisations du hint
let popup;  // Variable pour stocker l'élément de la pop-up
let restartButton; // Variable pour le bouton de redémarrage
let targetCountry; // stocker le pays à deviner 
let found = false; // stocker si le pays est trouvé ou pas
let wrongGuesses = 0;
let hintButton; // Bouton pour HINT
let hintCountries = []; // Liste des pays à mettre en évidence
let hintActive = false; // Si l'indice est activé

let startButton; // start game "
let gameStarted = false; // 
let startBgImg; // 
let score = 0; // Score initial
let maxScore=0;
let penaltyTime = 0;  // Temps supplémentaire ou soustrait (en millisecondes)
let music; // Variable pour stocker la musique
let buttonMusic;
let isPlayingMusic = false;

function preload() {
  startBgImg = loadImage("worldd.jpg");
  music = loadSound("musique.mp3");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  
    // Créer un bouton pour contrôler la musique
  
  popupMessage = createDiv().style('background-color', '#fff')
    .style('padding', '10px')
    .style('border-radius', '10px')
    .style('text-align', 'center')
    .style('width', '200px')
    .style('position', 'absolute')
    .style('top', '50%')
    .style('left', '50%')
    .style('transform', 'translate(-50%, -50%)')
    .style('z-index', '10')
    .hide();
  let startScreen = createDiv()
    .style("background-color", "#FFC10763")
    .style("padding", "20px")
    .style("text-align", "center")
    .style("border-radius", "20px")
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("border", "2px solid white")
    .style("z-index", "10");

  startScreen.html("<h2 style='color: #FFFFFF;'>Bienvenue sur le jeu : Où suis-je !</h2>"); // 
  startButton = createButton("Commencer le jeu ").parent(startScreen);
  startButton.style("border", "2px solid #FFC107");
  startButton.mousePressed(startGame);
  buttonMusic = createButton('🎵 Allumer la musique').parent(startScreen);
  buttonMusic.style("border", "2px solid #FFC107");
  buttonMusic.mousePressed(toggleMusic); // Associer l'action au clic du bouton

  modePopup = createDiv().style('background-color', '#fff')
    .style('padding', '20px')
    .style('border-radius', '10px')
    .style('text-align', 'center')
    .style('width', '200px')
    .style('position', 'absolute')
    .style('top', '50%')
    .style('left', '50%')
    .style('transform', 'translate(-50%, -50%)')
    .style('z-index', '10');
  modePopup.html('<p> CHOISIR LE MODE DU JEU </p>');

  easyButton = createButton('facile').parent(modePopup).style('margin', '5px');
  normalButton = createButton('Normal').parent(modePopup).style('margin', '5px');
  hardButton = createButton('Difficile').parent(modePopup).style('margin', '5px');



  easyButton.mousePressed(() => selectMode('easy'));
  normalButton.mousePressed(() => selectMode('normal'));
  hardButton.mousePressed(() => selectMode('hard'));


  function startGame() {
    gameStarted = true; // 
    startScreen.hide(); //   
    modePopup.show(); //    
  }
  modePopup.hide();


  function selectMode(selectedMode) {
    mode = selectedMode;  //   
    modePopup.hide();  //     
    modeSelected = true;  //
    startTime = millis();  // 
    gameOver = false;  // 
    if (mode === 'easy') {
      maxScore = 1;
    if(score===maxScore){
      popup.show();
    }  
    
    } else if (mode === 'normal') {
      maxScore = 10; // 
      //console.log('Normal mode selected!');
    } else if (mode === 'hard') {
      maxScore = 20; // 
    }
    
    //    
    //resetGame();
    selectRandomCountry();
    hintCountries = []; // Liste des pays à mettre en évidence
    hintActive = false;
    startTime = millis();
    score = 0;
    penaltyTime = 0;
  }
  // avoir un pays aléatoire 
  function selectRandomCountry() {
    targetCountry = random(country); // Choisir un pays aléatoire
    console.log("Pays cible : " + targetCountry.name); // afficher dans la console
    found = false;
  }
  //Appel de la fonction pour initiliaser le pays aléatoire
  selectRandomCountry();
  // Initialiser chaque pays avec une couleur aléatoire
  for (var i = 0; i < country.length; i++) {
    country[i].polygons = convertPathToPolygons(country[i].vertexPoint);

    // Générer une couleur aléatoire claire sans vert
    country[i].color = color(random(180, 255), random(180, 255), random(50, 100)); // Couleur aléatoire un peu clair 
    console.log(country[i].name);
    console.log(country[i].polygons);
  }

  // Enregistrer l'heure de départ du timer
  //startTime = millis(); // Enregistrer le temps au moment du démarrage du sketch

  // Créer un conteneur pour la pop-up et le bouton "Rejouer"
  popup = createDiv();
  popup.hide(); 


}

function draw() {
      // Si la musique n'est pas en train de jouer, vous pouvez la lancer
  //if (!music.isPlaying()) {
    //music.play();
  //}
  if (!gameStarted) {
    background(startBgImg);
    return; // afficher que la page d'accueil si le jeu n a pas encore commencer 
  }
  if (!modeSelected) {
    return; // Attendre que l'utilisateur sélectionne un mode
  }
  

  // Nettoyage de l'écran et affichage du mode actuel
  background(0,105,148);
  textSize(20);
  fill(255);
  textAlign(LEFT, TOP); // Alignement en haut à gauche
  text('Mode: ' + mode, width * 0.01, height * 0.01);

  // Afficher le pays à trouver en haut de l'écran
  textSize(24);
  textAlign(CENTER, BOTTOM); 
  fill(255, 204, 0);
  text(""+ targetCountry.name, width / 2, height- 20); // Positionner au milieu en bas
  // Créer le bouton HINT
  hintButton = createButton('HINT');
  hintButton.position(width - 100, 10); // permet de positionner en haut à droie 
  hintButton.style('padding', '10px 20px');
  hintButton.style('font-size', '16px');
  hintButton.style('background-color', '#ffcc00');
  hintButton.style('border-radius', '5px');
  hintButton.style('color', '#000');
  hintButton.mousePressed(activateHint); // Activer l'indice au clic
  // Afficher le score en bas à droite
  textSize(height * 0.03); // Taille proportionnelle à la hauteur
  fill(255); // Couleur blanche
  textAlign(RIGHT, BOTTOM); // Alignement à droite et en bas
  text('Score: ' + score + '/' + maxScore, width - width * 0.01, height - height * 0.01);




  // Si le jeu est terminé, afficher la pop-up, mais continuer à dessiner
  if (gameOver) {
    popup.show(); // Afficher la pop-up avec le bouton "Rejouer"
  }

  // Dessiner la carte
  fill(100);
  stroke(255);
  strokeWeight(1);

  // Dessiner les pays
  for (var i = 0; i < country.length; i++) {
    let currentCountry = country[i];
    let isHighlighted = false;

    if (hintActive && hintCountries.includes(currentCountry)) {
      fill('red'); // Mettre en évidence en rouge
      isHighlighted = true;
    } else {
      fill(currentCountry.color);
    }

    // Vérifier si la souris est au-dessus pour surligner
    if (!isHighlighted && currentCountry.polygons.some(poly => pointInPoly(poly, createVector(mouseX, mouseY)))) {
      fill('gray');
    }

    var coord_point = [0, 0];
    // Loop pour dessiner les pays
    for (var k = 0; k < country[i].vertexPoint.length; k++) {

      if (country[i].vertexPoint[k][0] == "m") {
        coord_point[0] += country[i].vertexPoint[k][1] * size;
        coord_point[1] += country[i].vertexPoint[k][2] * size;
        beginShape();
        continue;
      }

      if (country[i].vertexPoint[k][0] == "M") {
        coord_point[0] = country[i].vertexPoint[k][1] * size;
        coord_point[1] = country[i].vertexPoint[k][2] * size;
        beginShape();
        continue;
      }

      if (country[i].vertexPoint[k] == "z") {
        vertex(coord_point[0], coord_point[1]);
        endShape();
        continue;
      }

      vertex(coord_point[0], coord_point[1]);
      coord_point[0] += country[i].vertexPoint[k][0] * size;
      coord_point[1] += country[i].vertexPoint[k][1] * size;
    }
  }

  // Calculer le temps écoulé en secondes
  let elapsedTime = ((millis() - startTime) + penaltyTime) / 1000;  // Convertir en secondes
  if (elapsedTime >= 60) {
    gameOver = true; // Fin du jeu
    showGameOverPopup(); // Afficher la fenêtre pop-up
  }

  // Si le jeu est toujours en cours, afficher le timer
  if (!gameOver) {
    let seconds = int(elapsedTime % 60); 
    let minutes = int(elapsedTime / 60);  

    // Afficher le timer en bas à gauche
    textSize(32);
    fill(255);  // Couleur du texte (blanc)
    textAlign(LEFT, BOTTOM); // Aligner le texte à gauche et en bas
    text("Timer: " + nf(minutes, 2) + ":" + nf(seconds, 2), 20, height - 20); 
  }
}


function toggleMusic() {
    if (!isPlayingMusic) {
      
      music.pause(); // mettre en payse la musqiue 
      buttonMusic.html('🎵 Allumer la musique'); // Changer le texte du bouton
    } else {
      // Si la musique ne joue pas, on la démarre
      if (!music.isPlaying()) { 
        music.loop(); // Lecture en boucle
      }
      buttonMusic.html('🔇 Couper la musique'); 
    }
    isPlayingMusic = !isPlayingMusic; // Inverser l'état
  }

function mousePressed() {
  if (!gameStarted || !modeSelected || gameOver) {
    return;
  }

  let guessedCountry = null;

  for (var i = 0; i < country.length; i++) {
    if (country[i].polygons.some(poly => pointInPoly(poly, createVector(mouseX, mouseY)))) {
      guessedCountry = country[i];
      break;
    }
  }

  if (guessedCountry) {
    if (guessedCountry.name !== targetCountry.name) {
      
      wrongGuesses++;
      penaltyTime += 1000;  // Ajouter une seconde
      showMessage = '-1: ' + guessedCountry.name;

      setTimeout(() => {
        showPopup(showMessage);
        setTimeout(() => popupMessage.hide(), 1000);
      }, 0);
    } else {
      
      showMessage = '+1: ' + guessedCountry.name;
      setTimeout(() => {
        showPopup(showMessage);
        setTimeout(() => popupMessage.hide(), 1000);
      }, 0);
        startTime = millis(); // Redémarrer le timer  lorque l'utilisateur trouve un pays 

      
      score++; // Augmenter le score
      penaltyTime -= 1000;  // enlever une seconde car l'utilisateur à trouver le pays 
      selectRandomCountry();  
      if (score === maxScore) {
        gameOver = true;   
        showGameOverPopup();  
        
      }
    }
  }
}

function showPopup(message) {
  popupMessage.html('<p>' + message + '</p>');
  popupMessage.style('background-color', 'transparent');

  if (message.includes('-1')) {
    popupMessage.style('color', 'red');
  } else {
    popupMessage.style('color', 'white');
  }
  popupMessage.show();
}



// Fonction pour afficher le message de fin du jeu
function showGameOverPopup() {
  let message = "Vous avez perdu"; 
  if (score === maxScore) {
    message = "Vous avez gagné"; 
  }
  // position pop up
  let popupWidth = 300;  // Largeur de la pop-up
  let popupHeight = 150;  // Hauteur de la pop-up

  let popupX = (width - popupWidth) / 2;  // Calculer la position X pour centrer
  let popupY = (height - popupHeight) / 2; // Calculer la position Y pour centrer

  popup.position(popupX, popupY);  // Positionner la pop-up au centre
  popup.style('background-color', 'white');
  popup.style('padding', '30px');
  popup.style('border-radius', '10px');
  popup.style('color', 'black');
  popup.style('font-size', '20px');
  popup.style('text-align', 'center');  // Centrer le texte
  popup.style('width', popupWidth + 'px');  // Largeur précise
  popup.style('height', popupHeight + 'px');  // Hauteur précise
  popup.html('<p>' + message + '</p>'); // Message "Vous avez perdu"
  // Style de conteneur pour les boutons
  let buttonContainer = createDiv();
  buttonContainer.parent(popup);
  buttonContainer.style('display', 'flex');
  buttonContainer.style('justify-content', 'center');
  buttonContainer.style('gap', '20px');  // Ajout d'un espacement entre les boutons
  buttonContainer.style('margin-top', '20px'); // Espacement par rapport au texte

  // Créer le bouton "Rejouer"
  restartButton = createButton('Rejouer');
  restartButton.parent(buttonContainer);
  restartButton.mousePressed(restartGame);  // Lorsqu'on clique, on redémarre le jeu

  // Appliquer du style au bouton
  restartButton.style('background-color', '#4CAF50');
  restartButton.style('color', 'white');
  restartButton.style('padding', '10px 20px');
  restartButton.style('font-size', '20px');
  restartButton.style('border-radius', '5px');

  let changeModeButton = createButton('Changer de mode');
  changeModeButton.parent(buttonContainer);
  changeModeButton.mousePressed(() => {
    popup.hide();  
    modeSelected = false;  
    modePopup.show();  
  });
  changeModeButton.style('background-color', '#FF5733');
  changeModeButton.style('color', 'white');
  changeModeButton.style('padding', '10px 20px');
  changeModeButton.style('font-size', '20px');
  changeModeButton.style('border-radius', '5px');
}


function activateHint() {
    // Vérifier si l'utilisateur a déjà utilisé 3 fois l'indice
    if (hintUsageCount >= maxHints) {
      showTemporaryMessage("Vous avez utilisé tous vos indices !", 2000);
      return; // Ne rien faire si l'utilisateur a déjà utilisé tous les indices
    }
  
    // Réinitialiser l'état précédent
    hintCountries = [];
    let hintType = random([0, 1]); // 0 pour l'affichage des pays, 1 pour l'ajout de temps
  
    if (hintType === 0) {
      // Option 1: Ajouter trois pays, y compris le pays cible
      hintCountries.push(targetCountry);  // S'assurer que le pays cible est toujours inclus
  
      // Ajouter des pays aléatoires jusqu'à atteindre 3 pays
      while (hintCountries.length < 3) {
        let randomCountry = random(country);  // Sélectionner un pays au hasard
        // Vérifier que le pays sélectionné n'est pas déjà dans la liste des pays à indiquer
        if (!hintCountries.includes(randomCountry)) {
          hintCountries.push(randomCountry); // Ajouter le pays si ce n'est pas déjà dans la liste
        }
      }
  
      hintActive = true; // Activer l'indice
      // Informer l'utilisateur du type d'indice
      showTemporaryMessage("3 pays sont mis en évidence !", 2000);
  
    } else if (hintType === 1) {
      // Option 2: Ajouter du temps au chronomètre
      penaltyTime -= 20000;  // Ajouter 20 secondes
      showTemporaryMessage("20 secondes ont été retirés du timer ! Profitez-en !", 2000);
    }
  
    // Incrémenter le compteur d'utilisation de l'indice
    hintUsageCount++;
  }
  
  
  // Fonction pour afficher un message temporaire
  function showTemporaryMessage(message, duration) {
    let hintMessage = createDiv(message)
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '10px 20px')
      .style('border-radius', '5px')
      .style('position', 'absolute')
      .style('top', '50%')
      .style('left', '50%')
      .style('transform', 'translate(-50%, -50%)')
      .style('font-size', '20px')
      .style('text-align', 'center')
      .style('z-index', '10');
  
    setTimeout(() => {
      hintMessage.remove(); // Supprimer le message après la durée spécifiée
    }, duration);
  }
  
  
  


function selectMode(selectedMode) {
  mode = selectedMode;
  modePopup.hide();  
  modeSelected = true; 
  startTime = millis();  
  gameOver = false;  
  // Désactiver le Hint lors du changement de mode
  hintActive = false;
  hintCountries = []; // Réinitialiser la liste des pays pour le Hint

  // Réinitialiser le pays à deviner
  selectRandomCountry(); // Choisir un nouveau pays aléatoire
}

// Fonction pour redémarrer le jeu
function restartGame() {
  // Réinitialiser le timer et le jeu
  score = 0; // Réinitialiser le score
  hintUsageCount = 0;
  penaltyTime = 0;
  startTime = millis();  // Réinitialiser le temps
  gameOver = false;  // Reprendre le jeu
  // desactiver le hint après le rédémarrage
  hintActive = false;
  hintCountries = []; // Réinitialiser la liste des pays pour le Hint
  selectRandomCountry(); // Choisir un nouveau pays aléatoire



  // Cacher la pop-up et recommencer
  popup.hide();

  // Réinitialiser la couleur des pays avec de nouvelles couleurs aléatoires
  for (var i = 0; i < country.length; i++) {
    country[i].color = color(random(180, 255), random(180, 255), random(50, 100)); // Couleur aléatoire un peu clair 
  }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }


// Convertir le chemin des polygones en un tableau de polygones
function convertPathToPolygons(path) {
  let coord_point = [0, 0];
  let polygons = [];
  let currentPolygon = [];

  for (const node of path) {
    if (node[0] == "m") {
      coord_point[0] += node[1] * size;
      coord_point[1] += node[2] * size;
      currentPolygon = [];
    } else if (node[0] == "M") {
      coord_point[0] = node[1] * size;
      coord_point[1] = node[2] * size;
      currentPolygon = [];
    } else if (node == "z") {
      currentPolygon.push([...coord_point]);
      polygons.push(currentPolygon);
    } else {
      currentPolygon.push([...coord_point]);
      coord_point[0] += node[0] * size;
      coord_point[1] += node[1] * size;
    }
  }

  return polygons;
}
// Fonction pour sélectionner un nouveau pays aléatoire
function selectRandomCountry() {
  targetCountry = random(country); // Choisir un pays aléatoire
  console.log("Pays cible : " + targetCountry.name); // Afficher dans la console
  found = false; // Réinitialiser l'état trouvé
}

// Déterminer si un point est dans un polygone
function pointInPoly(verts, pt) {
  let c = false;
  for (let i = 0, j = verts.length - 1; i < verts.length; j = i++) {
    let slope = (verts[j][1] - verts[i][1]) / (verts[j][0] - verts[i][0]);

    if (((verts[i][1] > pt.y) != (verts[j][1] > pt.y)) &&
      (pt.x > (pt.y - verts[i][1]) / slope + verts[i][0])) {
      c = !c;
    }
  }
  return c;
}