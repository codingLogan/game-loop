// Set up the canvas
const ENTITY_CANVAS_MARGIN = 64
const canvas = document.querySelector("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
const context = canvas.getContext("2d")

const chickenImage = new Image()
chickenImage.src = "images/chicken.png"

const chickenSpriteSheetConfig = [
  { name: "walkLeft", width: 32, height: 32, frames: 4 },
  { name: "bounceLeft", width: 32, height: 32, frames: 4 },
  { name: "idleLeft", width: 32, height: 32, frames: 4 },
  { name: "runLeft", width: 32, height: 32, frames: 4 },
  { name: "walkRight", width: 32, height: 32, frames: 4 },
  { name: "bounceRight", width: 32, height: 32, frames: 4 },
  { name: "idleRight", width: 32, height: 32, frames: 4 },
  { name: "runRight", width: 32, height: 32, frames: 4 },
]
/* Animation structure
{
    "<animationName>": {
        "frames": [
            {"x": 0, "y": 0},
            ...
        ],
        "width": 32,
        "height": 32
    },
    ...
}
*/
const chickenAnimations = parseSpriteAnimations(chickenSpriteSheetConfig)

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

document.getElementById("spawn-pet").addEventListener("click", () => {
  // Spawn a chicken
  const safeCanvasWidth = canvas.clientWidth - ENTITY_CANVAS_MARGIN
  const maxFoodPositionX = safeCanvasWidth - 64 // 64 is food's width
  pets.push(
    new Pet(
      Math.min(
        Math.round(Math.random() * safeCanvasWidth + ENTITY_CANVAS_MARGIN),
        maxFoodPositionX
      ),
      canvas.clientHeight - ENTITY_CANVAS_MARGIN - 64, // 64 is pet's height
      chickenAnimations
    )
  )
})

// Initialize the game
const pet = new Pet(
  ENTITY_CANVAS_MARGIN,
  canvas.clientHeight - ENTITY_CANVAS_MARGIN - 64, // 64 is pet's height
  chickenAnimations
)

const pets = []
pets.push(pet)

const food = []

// Set game loop
function update() {
  if (pause) {
    return
  }

  pets.forEach((pet) => {
    // Move the pet within the game boundary
    if (pet.x > canvas.clientWidth - ENTITY_CANVAS_MARGIN - pet.width) {
      pet.move("left")
    } else if (pet.x < ENTITY_CANVAS_MARGIN) {
      pet.move("right")
    }

    // Update the pet
    pet.update()

    const checkCollision = (rect1, rect2) => {
      if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      ) {
        return true
      }

      return false
    }

    // Check for pet collisions with a food
    let foundFood = food.find((f) => {
      return checkCollision(f, pet)
    })

    const indexOfFoundFood = food.indexOf(foundFood)

    if (indexOfFoundFood > -1) {
      food.splice(indexOfFoundFood, 1)
    }
  })

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

  pets.forEach((pet) => {
    pet.draw(context, chickenImage)
  })

  window.requestAnimationFrame(update)
}

function drawAnimationFrame(
  spriteImage,
  animation,
  frameNumber,
  context,
  destinationX,
  destinationY,
  scale = 1
) {
  const frame = animation.frames[frameNumber]
  context.drawImage(
    spriteImage,
    frame.x,
    frame.y,
    animation.width,
    animation.height,
    destinationX,
    destinationY,
    animation.width * scale,
    animation.height * scale
  )
}

window.requestAnimationFrame(update)
