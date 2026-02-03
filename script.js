const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileCountX = 12;
const tileCountY = 12;
let gridSize = 0;

/**
 * Updates canvas size to fit within viewport while maintaining aspect ratio
 */
function updateCanvasSize() {
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    const targetSize = Math.floor(minDimension * 0.9);
    canvas.width = targetSize;
    canvas.height = targetSize;
    gridSize = targetSize / tileCountX;
}

updateCanvasSize();
window.addEventListener("resize", updateCanvasSize);
const foodTypes = [
  "cardboard_box",
  "paper",
  "glass_bottle",
  "plastic_container",
  "plastic_water_bottle",
  "soda_can",
  "aluminum_foil",
  "glass_jar",
  "newspaper",
  "paper_bag",
  "tin_can",
  "broken_glass",
  "chip_bag",
  "juice_box",
  "plastic_bag",
  "plastic_straw",
  "plastic_utensil",
  "broken_mug",
  "candy_wrapper",
  "empty_bag_of_chips",
  "gloves",
  "pen",
  "sponge",
  "banana_peel",
  "carrot",
  "dirty_napkin",
  "dirty_pizza_box",
  "egg_shell",
  "fish_bone",
  "apple_core",
  "bread_slice",
  "cheese",
  "chicken_leg",
  "muffin",
  "orange_peel",
  "tea_bag",
];
const winCondition = 25;

function getInitialSnake() {
  const startX = Math.floor(tileCountX / 4);
  const startY = Math.floor(tileCountY / 2);
  return [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];
}

const foodIconPaths = {
  cardboard_box: "assets/icons/recycle/cardboard_box_icon_copy.png",
  paper: "assets/icons/recycle/paper_icon_copy.png",
  glass_bottle: "assets/icons/recycle/glass_bottle_icon.png",
  plastic_container: "assets/icons/recycle/plastic_container_icon.png",
  plastic_water_bottle: "assets/icons/recycle/plastic_water_bottle_icon.png",
  soda_can: "assets/icons/recycle/soda_can_icon.png",
  aluminum_foil: "assets/icons/recycle/aluminum_foil_copy.png",
  glass_jar: "assets/icons/recycle/glass_jar.png",
  newspaper: "assets/icons/recycle/newspaper.png",
  paper_bag: "assets/icons/recycle/paper_bag.png",
  tin_can: "assets/icons/recycle/tin_can.png",
  broken_glass: "assets/icons/trash/broken_glass_icon_copy.png",
  chip_bag: "assets/icons/trash/chip_bag_icon_copy.png",
  juice_box: "assets/icons/trash/juice_box_icon.png",
  plastic_bag: "assets/icons/trash/plastic_bag_icon.png",
  plastic_straw: "assets/icons/trash/plastic_straw_icon_copy.png",
  plastic_utensil: "assets/icons/trash/plastic_utensil_icon_copy.png",
  broken_mug: "assets/icons/trash/broken_mug.png",
  candy_wrapper: "assets/icons/trash/candy_wrapper.png",
  empty_bag_of_chips: "assets/icons/trash/empty_bag_of_chips_png.png",
  gloves: "assets/icons/trash/gloves_png.png",
  pen: "assets/icons/trash/pen_png.png",
  sponge: "assets/icons/trash/sponge.png",
  banana_peel: "assets/icons/compost/banana_peel_cartoon.png",
  carrot: "assets/icons/compost/carrot_icon.png",
  dirty_napkin: "assets/icons/compost/dirty_napkin_icon_copy.png",
  dirty_pizza_box: "assets/icons/compost/dirty_pizza_box_icon_copy.png",
  egg_shell: "assets/icons/compost/egg_shell_icon.png",
  fish_bone: "assets/icons/compost/fish_bone_scraps_copy.png",
  apple_core: "assets/icons/compost/apple core.png",
  bread_slice: "assets/icons/compost/bread_slice.png",
  cheese: "assets/icons/compost/cheese.png",
  chicken_leg: "assets/icons/compost/chicken_leg.png",
  muffin: "assets/icons/compost/muffin.png",
  orange_peel: "assets/icons/compost/orange_peel.png",
  tea_bag: "assets/icons/compost/tea_bag.png",
};

const foodImages = {};
for (const [name, path] of Object.entries(foodIconPaths)) {
  foodImages[name] = new Image();
  foodImages[name].src = path;
}

const foodDisplayNames = {
  cardboard_box: "Cardboard Box",
  paper: "Paper",
  glass_bottle: "Glass Bottle",
  plastic_container: "Plastic Container",
  plastic_water_bottle: "Water Bottle",
  soda_can: "Soda Can",
  aluminum_foil: "Aluminum Foil",
  glass_jar: "Glass Jar",
  newspaper: "Newspaper",
  paper_bag: "Paper Bag",
  tin_can: "Tin Can",
  broken_glass: "Broken Glass",
  chip_bag: "Chip Bag",
  juice_box: "Juice Box",
  plastic_bag: "Plastic Bag",
  plastic_straw: "Plastic Straw",
  plastic_utensil: "Plastic Utensil",
  broken_mug: "Broken Mug",
  candy_wrapper: "Candy Wrapper",
  empty_bag_of_chips: "Empty Bag of Chips",
  gloves: "Gloves",
  pen: "Pen",
  sponge: "Sponge",
  banana_peel: "Banana Peel",
  carrot: "Carrot",
  dirty_napkin: "Dirty Napkin",
  dirty_pizza_box: "Dirty Pizza Box",
  egg_shell: "Egg Shell",
  fish_bone: "Fish Bone",
  apple_core: "Apple Core",
  bread_slice: "Bread Slice",
  cheese: "Cheese",
  chicken_leg: "Chicken Leg",
  muffin: "Muffin",
  orange_peel: "Orange Peel",
  tea_bag: "Tea Bag",
};

let snake = getInitialSnake();
let smoothSnake = snake.map((segment) => ({
  x: segment.x,
  y: segment.y,
  targetX: segment.x,
  targetY: segment.y,
}));
let direction = { x: 1, y: 0 };
let inputQueue = [];
let foods = [];
let score = 0;
let lives = 3;
let lastMoveTime = 0;
const moveInterval = 175;
let eating = false;
let eatProgress = 0;
let eatenIndex = -1;

let countdownTimer = 0;
let feedbackTimer = 0;
const eatDuration = 0.2;
let gameState = "start";
let lastCorrectGamemode = null;
let showFeedbackDuringCountdown = false;
let snakeColor = "#4674E9";
let currentGamemode = "";
const overlay = document.getElementById("gameOverOverlay");
const gameOverMessageEl = document.getElementById("gameOverMessage");
const finalScoreEl = document.getElementById("finalScore");
const continueBtn = document.getElementById("continueBtn");
const popupOverlay = document.getElementById("popupOverlay");
const popupQuestionEl = document.getElementById("popupQuestion");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const startScreenOverlay = document.getElementById("startScreenOverlay");
const trashBtn = document.getElementById("trashBtn");
const recyclingBtn = document.getElementById("recyclingBtn");
const compostBtn = document.getElementById("compostBtn");
const winConditionDisplay = document.getElementById("winConditionDisplay");
const feedbackPopup = document.getElementById("feedbackPopup");
const feedbackMessageEl = document.getElementById("feedbackMessage");
const lifeLostMessageEl = document.getElementById("lifeLostMessage");

winConditionDisplay.textContent = winCondition;

/**
 * Generates a random food position that doesn't overlap with the snake
 * @returns {Object} Food position with x and y coordinates
 */
function isCorrectFood(name, gamemode) {
  if (gamemode === "recycling")
    return [
      "cardboard_box",
      "paper",
      "glass_bottle",
      "plastic_container",
      "plastic_water_bottle",
      "soda_can",
      "aluminum_foil",
      "glass_jar",
      "newspaper",
      "paper_bag",
      "tin_can",
    ].includes(name);
  if (gamemode === "trash")
    return [
      "broken_glass",
      "chip_bag",
      "juice_box",
      "plastic_bag",
      "plastic_straw",
      "plastic_utensil",
      "broken_mug",
      "candy_wrapper",
      "empty_bag_of_chips",
      "gloves",
      "pen",
      "sponge",
    ].includes(name);
  if (gamemode === "compost")
    return [
      "banana_peel",
      "carrot",
      "dirty_napkin",
      "dirty_pizza_box",
      "egg_shell",
      "fish_bone",
      "apple_core",
      "bread_slice",
      "cheese",
      "chicken_leg",
      "muffin",
      "orange_peel",
      "tea_bag",
    ].includes(name);
  return false;
}

function getRandomFoods() {
  let foods = [];
  let correctFoods = foodTypes.filter((name) =>
    isCorrectFood(name, currentGamemode),
  );
  let wrongFoods = foodTypes.filter(
    (name) => !isCorrectFood(name, currentGamemode),
  );
  if (correctFoods.length === 0 || wrongFoods.length === 0) return [];
  let selectedNames = [
    correctFoods[Math.floor(Math.random() * correctFoods.length)],
  ];
  for (let i = 0; i < 2; i++) {
    selectedNames.push(
      wrongFoods[Math.floor(Math.random() * wrongFoods.length)],
    );
  }
  for (let name of selectedNames) {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * tileCountX),
        y: Math.floor(Math.random() * tileCountY),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y,
      ) ||
      foods.some((f) => f.x === newFood.x && f.y === newFood.y)
    );
    let type = isCorrectFood(name, currentGamemode) ? "correct" : "wrong";
    foods.push({ ...newFood, type, name, scale: 1.0 });
  }
  return foods;
}

/**
 * Draws the snake with body and head
 * @param {Array} segments - Array of snake segment positions
 */
function drawSnake(segments) {
  let dir = direction;
  let angle = 0;
  if (dir.x > 0) angle = 0;
  else if (dir.x < 0) angle = Math.PI;
  else if (dir.y > 0) angle = Math.PI / 2;
  else if (dir.y < 0) angle = -Math.PI / 2;

  // Compute centers
  const centers = segments.map((segment) => ({
    cx: segment.x * gridSize + gridSize / 2,
    cy: segment.y * gridSize + gridSize / 2,
  }));

  // Draw body
  ctx.beginPath();
  ctx.moveTo(centers[0].cx, centers[0].cy);
  for (let i = 1; i < centers.length; i++) {
    ctx.lineTo(centers[i].cx, centers[i].cy);
  }
  ctx.lineWidth = gridSize - 3;
  ctx.strokeStyle = snakeColor;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  // Draw head
  const headCenter = centers[0];
  ctx.save();
  ctx.translate(headCenter.cx, headCenter.cy);
  ctx.rotate(angle);

  // Scale factor based on canvas size (original was 400x400)
  const scale = canvas.width / 400;

  // Draw head shape
  ctx.fillStyle = snakeColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 13.5 * scale, 9 * scale, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Eye positions
  const eyeX = -4 * scale;
  const eyeY = 6 * scale;
  const socketRadius = 8 * scale;
  const eyeRadius = 4 * scale;
  const pupilRadius = 2 * scale;

  // Eye sockets (behind eyes)
  ctx.fillStyle = snakeColor;
  ctx.beginPath();
  ctx.arc(eyeX, -eyeY, socketRadius, 0, 2 * Math.PI);
  ctx.arc(eyeX, eyeY, socketRadius, 0, 2 * Math.PI);
  ctx.fill();
  // Eyes
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(eyeX, -eyeY, eyeRadius, 0, 2 * Math.PI);
  ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI);
  ctx.fill();
  // Pupils
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(eyeX, -eyeY, pupilRadius, 0, 2 * Math.PI);
  ctx.arc(eyeX, eyeY, pupilRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

/**
 * Renders the game scene including background, snake, food, and score
 */
function draw() {
  for (let x = 0; x < tileCountX; x++) {
    for (let y = 0; y < tileCountY; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#fff0d6" : "#f2e4cb";
      ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }
  }

  drawSnake(smoothSnake);

  foods.forEach((f) => {
    ctx.save();
    ctx.translate(f.x * gridSize + gridSize / 2, f.y * gridSize + gridSize / 2);
    ctx.scale(f.scale, f.scale);
    const image = foodImages[f.name];
    if (image && image.complete) {
      ctx.drawImage(image, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
    } else {
      ctx.fillStyle = f.type === "correct" ? "#00FF00" : "#FF0000";
      ctx.fillRect(-gridSize / 2, -gridSize / 2, gridSize, gridSize);
      ctx.fillStyle = "#000000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(f.name, 0, 0);
    }
    ctx.restore();
  });

  ctx.fillStyle = "#000000";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Lives: " + "❤️".repeat(lives), 10, 60);
  if (gameState === "countdown") {
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      Math.ceil(countdownTimer),
      canvas.width / 2,
      canvas.height / 2,
    );
    ctx.textAlign = "left";
  }
  if (gameState === "feedback") {
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      Math.ceil(feedbackTimer),
      canvas.width / 2,
      canvas.height / 2,
    );
    ctx.textAlign = "left";
  }
}

const moveSpeed = 1 / (moveInterval / 1000);

/**
 * Interpolates smooth snake positions toward their targets
 * @param {number} deltaTime - Time elapsed since last frame in seconds
 */
function interpolate(deltaTime) {
  for (let segment of smoothSnake) {
    const dx = segment.targetX - segment.x;
    const dy = segment.targetY - segment.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.001) {
      const moveDist = Math.min(moveSpeed * deltaTime, dist);
      segment.x += (dx / dist) * moveDist;
      segment.y += (dy / dist) * moveDist;
    }
  }
}

/**
 * Updates the game state including snake movement, collisions, and eating
 * @param {number} deltaTime - Time elapsed since last update in seconds
 */
function update(deltaTime) {
  if (eating) {
    eatProgress += deltaTime;
    foods[eatenIndex].scale = 1 - eatProgress / eatDuration;
    if (eatProgress >= eatDuration) {
      eating = false;
      foods = getRandomFoods();
      eatenIndex = -1;
    }
  }

    if (performance.now() - lastMoveTime >= moveInterval) {
        lastMoveTime = performance.now();
        // Consume the next queued direction if available
        if (inputQueue.length > 0) {
            direction = inputQueue.shift();
        }
    let oldTail = snake[snake.length - 1];
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };
    snake.unshift(head);

    let eatenFoodIndex = foods.findIndex(
      (f) => head.x === f.x && head.y === f.y,
    );
    if (eatenFoodIndex !== -1) {
      let eatenFood = foods[eatenFoodIndex];
      if (eatenFood.type === "correct") {
        score++;
        new Audio("assets/audio/bite.mp3").play();
        eating = true;
        eatProgress = 0;
        eatenIndex = eatenFoodIndex;
        if (score >= winCondition) {
          gameState = "gameover";
          gameOverMessageEl.textContent = "You Win!";
          finalScoreEl.textContent = score;
          overlay.style.display = "flex";
          return;
        }
      } else {
        showPopup(eatenFood);
        snake.pop();
        // Sync smoothSnake targets
        if (snake.length > smoothSnake.length) {
          smoothSnake.push({
            x: oldTail.x,
            y: oldTail.y,
            targetX: oldTail.x,
            targetY: oldTail.y,
          });
        }
        for (let i = 0; i < snake.length; i++) {
          smoothSnake[i].targetX = snake[i].x;
          smoothSnake[i].targetY = snake[i].y;
        }
        gameState = "paused";
        return;
      }
    } else {
      snake.pop();
    }

    // Sync smoothSnake targets
    if (snake.length > smoothSnake.length) {
      smoothSnake.push({
        x: oldTail.x,
        y: oldTail.y,
        targetX: oldTail.x,
        targetY: oldTail.y,
      });
    }
    for (let i = 0; i < snake.length; i++) {
      smoothSnake[i].targetX = snake[i].x;
      smoothSnake[i].targetY = snake[i].y;
    }

    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= tileCountX ||
      head.y < 0 ||
      head.y >= tileCountY
    ) {
      gameState = "gameover";
      gameOverMessageEl.textContent = "Game Over";
      finalScoreEl.textContent = score;
      overlay.style.display = "flex";
      return;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameState = "gameover";
        gameOverMessageEl.textContent = "Game Over";
        finalScoreEl.textContent = score;
        overlay.style.display = "flex";
        return;
      }
    }
  }
}

trashBtn.addEventListener("click", () => {
  snakeColor = "#1f1f1f";
  currentGamemode = "trash";
  startGame();
});

recyclingBtn.addEventListener("click", () => {
  snakeColor = "#4674E9";
  currentGamemode = "recycling";
  startGame();
});

compostBtn.addEventListener("click", () => {
  snakeColor = "#c2d4a0";
  currentGamemode = "compost";
  startGame();
});

function showPopup(food) {
  let allGamemodes = ["trash", "recycling", "compost"];
  let otherGamemodes = allGamemodes.filter((g) => g !== currentGamemode);
  let correctGamemodeForFood = allGamemodes.find((g) =>
    isCorrectFood(food.name, g),
  );
  lastCorrectGamemode = correctGamemodeForFood;
  showFeedbackDuringCountdown = false;
  popupQuestionEl.textContent = `You ate ${foodDisplayNames[food.name] || food.name}. Which of the other two snakes (${otherGamemodes[0]} or ${otherGamemodes[1]}) would this food be correct for?`;
  yesBtn.textContent = otherGamemodes[0];
  noBtn.textContent = otherGamemodes[1];
  // Store which is correct
  yesBtn.dataset.correct = correctGamemodeForFood === otherGamemodes[0];
  noBtn.dataset.correct = correctGamemodeForFood === otherGamemodes[1];
  popupOverlay.style.display = "flex";
}

function startGame() {
  startScreenOverlay.style.display = "none";
  foods = getRandomFoods();
  gameState = "playing";
}

continueBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  feedbackPopup.style.display = "none";
  showFeedbackDuringCountdown = false;
  startScreenOverlay.style.display = "flex";
  gameState = "start";
  snake = getInitialSnake();
  smoothSnake = snake.map((segment) => ({
    x: segment.x,
    y: segment.y,
    targetX: segment.x,
    targetY: segment.y,
  }));
  direction = { x: 1, y: 0 };
    inputQueue = [];
    foods = [];
  score = 0;
  lives = 3;
  eating = false;
  eatProgress = 0;
  eatenIndex = -1;
  countdownTimer = 0;
  feedbackTimer = 0;
  lastMoveTime = 0;
});

yesBtn.addEventListener("click", () => {
  foods = getRandomFoods();
  const wasCorrect = yesBtn.dataset.correct === "true";
  if (!wasCorrect) {
    lives--;
    showFeedbackDuringCountdown = true;
    feedbackMessageEl.textContent = `That item belongs in the ${lastCorrectGamemode} bin!`;
    lifeLostMessageEl.textContent = "You lost a life!";
  }
  if (lives <= 0) {
    gameState = "gameover";
    gameOverMessageEl.textContent = "Game Over";
    finalScoreEl.textContent = score;
    overlay.style.display = "flex";
    } else {
        if (showFeedbackDuringCountdown) {
            feedbackTimer = 3;
            gameState = "feedback";
            feedbackPopup.style.display = "flex";
        } else {
            countdownTimer = 3;
            gameState = "countdown";
        }
    }
    popupOverlay.style.display = "none";
});

noBtn.addEventListener("click", () => {
    foods = getRandomFoods();
    const wasCorrect = noBtn.dataset.correct === "true";
    if (!wasCorrect) {
        lives--;
        showFeedbackDuringCountdown = true;
        feedbackMessageEl.textContent = `That item belongs in the ${lastCorrectGamemode} bin!`;
        lifeLostMessageEl.textContent = "You lost a life!";
    }
    if (lives <= 0) {
        gameState = "gameover";
        gameOverMessageEl.textContent = "Game Over";
        finalScoreEl.textContent = score;
        overlay.style.display = "flex";
    } else {
        if (showFeedbackDuringCountdown) {
            feedbackTimer = 3;
            gameState = "feedback";
            feedbackPopup.style.display = "flex";
        } else {
            countdownTimer = 3;
            gameState = "countdown";
        }
    }
    popupOverlay.style.display = "none";
});

document.addEventListener("keydown", (e) => {
    if (gameState !== "playing") return;

    let newDirection = null;
    if (e.key === "ArrowUp") newDirection = { x: 0, y: -1 };
    else if (e.key === "ArrowDown") newDirection = { x: 0, y: 1 };
    else if (e.key === "ArrowLeft") newDirection = { x: -1, y: 0 };
    else if (e.key === "ArrowRight") newDirection = { x: 1, y: 0 };

    if (!newDirection) return;

    e.preventDefault();

    // Get the last direction in the queue, or current direction
    const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : direction;

    // Prevent 180-degree turns
    if (newDirection.x === -lastDir.x && newDirection.y === -lastDir.y) {
        return;
    }

    // Prevent duplicate directions
    if (newDirection.x === lastDir.x && newDirection.y === lastDir.y) {
        return;
    }

    // Only buffer ONE input (Google Snake style)
    if (inputQueue.length < 1) {
        inputQueue.push(newDirection);
    }
});

let lastUpdateTime = 0;
function gameLoop(timestamp) {
  let deltaTime = (timestamp - lastUpdateTime) / 1000;
  if (deltaTime > 0.1) deltaTime = 0.1;
  lastUpdateTime = timestamp;
  if (gameState === "playing") {
    update(deltaTime);
    interpolate(deltaTime);
    draw();
  } else if (gameState === "feedback") {
    feedbackTimer -= deltaTime;
    draw();
    if (feedbackTimer <= 0) {
      feedbackPopup.style.display = "none";
      countdownTimer = 3;
      gameState = "countdown";
    }
  } else if (gameState === "countdown") {
    countdownTimer -= deltaTime;
    draw();
    if (countdownTimer <= 0) {
        gameState = "playing";
        lastMoveTime = performance.now();
        showFeedbackDuringCountdown = false;
    }
  } else if (gameState === "paused") {
    draw();
  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
