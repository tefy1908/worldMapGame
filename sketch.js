let modeSelected = false;  // حالت اولیه برای چک کردن اینکه مود انتخاب شده است یا خیر
let mode;  // برای ذخیره مود انتخاب شده
let modePopup, easyButton, normalButton, hardButton;
let popupMessage;
let popupTimeout;
const pts = [];
var size = 0.6;
let startTime;  // Pour stocker l'heure de départ
let gameOver = false; // Variable pour vérifier si le jeu est terminé

let popup;  // Variable pour stocker l'élément de la pop-up
let restartButton; // Variable pour le bouton de redémarrage
let targetCountry; // stocker le pays à deviner 
let found = false; // stocker si le pays est trouvé ou pas
let wrongGuesses = 0;
let hintButton; // Bouton pour HINT
let hintCountries = []; // Liste des pays à mettre en évidence
let hintActive = false; // Si l'indice est activé

let startButton; // برای ذخیره دکمه "Start Game"
let gameStarted = false; // وضعیت شروع بازی
let startBgImg; // برای ذخیره تصویر بکگراند

function preload() {
  startBgImg = loadImage("worldd.jpg"); // مسیر تصویر بکگراند
}
function setup() {
  createCanvas(windowWidth, windowHeight);
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

  startScreen.html("<h2 style='color: #FFFFFF;'>Welcome to the Game!</h2>"); // پیام خوش آمدگویی با رنگ سفید

  startButton = createButton("Start Game").parent(startScreen);
  startButton.style("border", "2px solid #FFC107");
  startButton.mousePressed(startGame);

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

  easyButton = createButton('Easy').parent(modePopup).style('margin', '5px');
  normalButton = createButton('Normal').parent(modePopup).style('margin', '5px');
  hardButton = createButton('Hard').parent(modePopup).style('margin', '5px');

  // عملکرد دکمه‌ها

  easyButton.mousePressed(() => selectMode('easy'));
  normalButton.mousePressed(() => selectMode('normal'));
  hardButton.mousePressed(() => selectMode('hard'));


  function startGame() {
    gameStarted = true; // بازی شروع شد
    startScreen.hide(); // مخفی کردن صفحه شروع
    modePopup.show(); // نمایش پنجره انتخاب مود
  }
  modePopup.hide();


  function selectMode(selectedMode) {
    mode = selectedMode;  // ذخیره مود انتخابی
    modePopup.hide();  // مخفی کردن پنجره انتخاب مود
    modeSelected = true;  // تغییر وضعیت به حالت مود انتخاب شده
    startTime = millis();  // شروع مجدد تایمر
    gameOver = false;  // اطمینان از اینکه بازی در حالت تمام شده نیست

    // ریست کردن بازی به حالت اولیه
    //resetGame();
    selectRandomCountry();
    hintCountries = []; // Liste des pays à mettre en évidence
    hintActive = false;
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
  popup.hide();  // Cacher la pop-up par défaut


}

function draw() {
  if (!gameStarted) {
    background(startBgImg);
    return; // وقتی بازی شروع نشده باشد، نمایش نمی‌دهیم
  }
  if (!modeSelected) {
    return; // Attendre que l'utilisateur sélectionne un mode
  }

  // Nettoyage de l'écran et affichage du mode actuel
  background(0);
  textSize(20);
  fill(255);
  text('Mode: ' + mode, 20, 40);

  // Afficher le pays à trouver en haut de l'écran
  textSize(24);
  textAlign(CENTER, BOTTOM); // Centré horizontalement et aligné en bas
  fill(255, 204, 0);
  text(" " + targetCountry.name, 400, 500);
  // Créer le bouton HINT
  hintButton = createButton('HINT');
  hintButton.position(width - 100, 10); // Positionner en haut à droite
  hintButton.style('padding', '10px 20px');
  hintButton.style('font-size', '16px');
  hintButton.style('background-color', '#ffcc00');
  hintButton.style('border-radius', '5px');
  hintButton.style('color', '#000');
  hintButton.mousePressed(activateHint); // Activer l'indice au clic


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
  let elapsedTime = (millis() - startTime) / 1000;  // Convertir en secondes
  if (elapsedTime >= 5) {
    gameOver = true; // Fin du jeu
    showGameOverPopup(); // Afficher la fenêtre pop-up
  }

  // Si le jeu est toujours en cours, afficher le timer
  if (!gameOver) {
    let seconds = int(elapsedTime % 60);  // Extraire les secondes
    let minutes = int(elapsedTime / 60);  // Extraire les minutes

    // Afficher le timer en bas à gauche
    textSize(32);
    fill(255);  // Couleur du texte (blanc)
    textAlign(LEFT, BOTTOM); // Aligner le texte à gauche et en bas
    text("Timer: " + nf(minutes, 2) + ":" + nf(seconds, 2), 20, height - 20); // Positionner à 20px du bord gauche et 20px du bas
  }
}


function mousePressed() {
  if (gameOver) {
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
      // اگر اشتباه حدس زده شود
      wrongGuesses++;
      startTime -= 1000;  // کاهش زمان
      showMessage = '-1: ' + guessedCountry.name;

      setTimeout(() => {
        showPopup(showMessage);
        setTimeout(() => popupMessage.hide(), 1000);
      }, 0);
    } else {
      // اگر درست حدس زده شود
      showMessage = '+1: ' + guessedCountry.name;
      setTimeout(() => {
        showPopup(showMessage);
        setTimeout(() => popupMessage.hide(), 1000);
      }, 0);

      // اضافه کردن یک ثانیه به زمان
      startTime += 1000;  // اضافه کردن 1 ثانیه
      selectRandomCountry();  // انتخاب کشور جدید
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
  popup.html('<p>Vous avez perdu ! </p>'); // Message "Vous avez perdu"
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

  // Appliquer du style au bouton pour le rendre plus visible
  restartButton.style('background-color', '#4CAF50');
  restartButton.style('color', 'white');
  restartButton.style('padding', '10px 20px');
  restartButton.style('font-size', '20px');
  restartButton.style('border-radius', '5px');

  let changeModeButton = createButton('Changer de mode');
  changeModeButton.parent(buttonContainer);
  changeModeButton.mousePressed(() => {
    popup.hide();  // پنهان کردن پاپ‌آپ
    modeSelected = false;  // تنظیم مود به حالت انتخاب نشده
    modePopup.show();  // نمایش صفحه انتخاب مود
  });
  changeModeButton.style('background-color', '#FF5733');
  changeModeButton.style('color', 'white');
  changeModeButton.style('padding', '10px 20px');
  changeModeButton.style('font-size', '20px');
  changeModeButton.style('border-radius', '5px');
}

function activateHint() {
  // Réinitialiser l'état précédent
  hintCountries = [];

  // Ajouter le pays cible
  hintCountries.push(targetCountry);

  // Ajouter deux autres pays aléatoires
  while (hintCountries.length < 3) {
    let randomCountry = random(country);
    if (!hintCountries.includes(randomCountry)) {
      hintCountries.push(randomCountry);
    }
  }

  hintActive = true; // Activer l'indice
}

// عملکرد انتخاب مود
function selectMode(selectedMode) {
  mode = selectedMode;
  modePopup.hide();  // مخفی کردن پنجره انتخاب مود
  modeSelected = true;  // مود انتخاب شده است
  startTime = millis();  // شروع تایمر بازی
  gameOver = false;  // ریست کردن وضعیت پایان بازی
  // Désactiver le Hint lors du changement de mode
  hintActive = false;
  hintCountries = []; // Réinitialiser la liste des pays pour le Hint

  // Réinitialiser le pays à deviner
  selectRandomCountry(); // Choisir un nouveau pays aléatoire
}

// Fonction pour redémarrer le jeu
function restartGame() {
  // Réinitialiser le timer et le jeu

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
