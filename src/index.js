// Set up the canvas
const ENTITY_CANVAS_MARGIN = 64
const canvas = document.querySelector("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const context = canvas.getContext("2d")

const chickenImage = new Image()
chickenImage.src = "images/chicken.png"

// Set up the buttons
let pause = false
document.getElementById("pause-button").addEventListener("click", () => {
  if (pause) {
    pause = false
    window.requestAnimationFrame(update)
  } else {
    pause = true
  }
})

document.getElementById("feed").addEventListener("click", () => {
  // Spawn a piece of food that will drop to the ground
  const safeCanvasWidth = canvas.clientWidth - ENTITY_CANVAS_MARGIN
  const maxFoodPositionX = safeCanvasWidth - 16 // 16 is food's width
  food.push(
    new Food(
      Math.min(
        Math.round(Math.random() * safeCanvasWidth + ENTITY_CANVAS_MARGIN),
        maxFoodPositionX
      ),
      ENTITY_CANVAS_MARGIN
    )
  )
})

// Initialize the game
const pet = new Pet(
  ENTITY_CANVAS_MARGIN,
  canvas.clientHeight - ENTITY_CANVAS_MARGIN - 64 // 64 is pet's height
)

const food = []

// Set game loop
let chickenFrame = 0
let chickenElapsedFrames = 0
function update() {
  if (pause) {
    return
  }

  // Move the pet within the game boundary
  if (pet.x > canvas.clientWidth - ENTITY_CANVAS_MARGIN - pet.width) {
    pet.move("left")
  } else if (pet.x < ENTITY_CANVAS_MARGIN) {
    pet.move("right")
  }

  // Update the pet
  pet.update()

  // Update any food items
  food.forEach((foodItem) => {
    if (
      foodItem.y <
      canvas.clientHeight - ENTITY_CANVAS_MARGIN - foodItem.height
    ) {
      foodItem.update()
    }
  })

  // Clear the canvas
  context.fillStyle = "#000000"
  context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

  // Draw food
  food.forEach((f) => {
    // Keep the food from falling through the floor
    context.fillStyle = "#FFC0CB"
    context.fillRect(f.x, f.y, f.width, f.height)
  })

  // Draw pet
  if (pet.speed > 0) {
    // draw right facing frames
  } else {
    // draw left facing frames
  }

  drawSpriteFrame(
    chickenImage,
    chickenFrame,
    pet.animationState[pet.stateMachine.value] * 32,
    context,
    pet.x,
    pet.y
  )

  // Draw chicken
  // drawSpriteFrame(chickenImage, 0, 0, context, 0, 32)
  // drawSpriteFrame(chickenImage, 1, 0, context, 0, 64)
  // drawSpriteFrame(chickenImage, 2, 0, context, 0, 96)
  // drawSpriteFrame(chickenImage, 3, 0, context, 0, 128)

  // Example animations
  // drawSpriteFrame(chickenImage, chickenFrame, 0, context, 0, 164)
  // drawSpriteFrame(chickenImage, chickenFrame, 32, context, 32, 164)
  // drawSpriteFrame(chickenImage, chickenFrame, 64, context, 64, 164)
  // drawSpriteFrame(chickenImage, chickenFrame, 96, context, 96, 164)

  if (chickenElapsedFrames >= 10) {
    if (chickenFrame === 3) {
      chickenFrame = 0
    } else {
      chickenFrame++
    }

    chickenElapsedFrames = 0
  } else {
    chickenElapsedFrames++
  }

  window.requestAnimationFrame(update)
}

function drawSpriteFrame(
  spriteImage,
  frameNumber,
  sourceY,
  context,
  destinationX,
  destinationY
) {
  const spriteSize = 32
  const sourceX = frameNumber * spriteSize
  const sourceWidth = spriteSize
  const sourceHeight = spriteSize
  const destinationWidth = spriteSize
  const destinationHeight = spriteSize
  context.drawImage(
    spriteImage,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destinationX,
    destinationY,
    destinationWidth * 2,
    destinationHeight * 2
  )
}

window.requestAnimationFrame(update)
