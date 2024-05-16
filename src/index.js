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

  pet.draw(context, chickenImage)

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
