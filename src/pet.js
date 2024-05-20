class Pet {
  constructor(x, y, animations) {
    // Object variables
    this.x = x
    this.y = y
    this.height = 64
    this.width = 64
    this.speed = 1
    this.moving = "right"
    this.isHungry = true

    // Sprite variables
    this.animations = animations
    this.chickenFrame = 0 // Which animation frame to draw
    this.chickenElapsedFrames = 0

    this.stateMachine = new StateMachine({
      start: "idle",
      idle: {
        events: {
          decide: () => {
            return this.handleTransition(["idle", "walk", "run", "bounce"])
          },
        },
      },
      bounce: {
        events: {
          decide: () => {
            return this.handleTransition(["idle", "walk", "run"])
          },
        },
      },
      walk: {
        events: {
          decide: () => {
            return this.handleTransition(["idle", "walk", "run", "bounce"])
          },
        },
      },
      run: {
        events: {
          decide: () => {
            return this.handleTransition(["idle", "run"])
          },
          eat: () => {
            return this.handleTransition(["eat"])
          },
        },
      },
      eat: {
        events: {
          decide: () => {
            return this.handleTransition(["idle", "bounce"])
          },
        },
      },
    })

    this.interval = this.startWandering()
  }

  startWandering() {
    return setInterval(() => {
      this.stateMachine.transition("decide")

      // Move a random direction
      if (Math.random() > 0.5) {
        this.move("left")
      } else {
        this.move("right")
      }
    }, 3500)
  }

  handleTransition(options) {
    if (this.isHungry && food.length > 0) {
      return "run"
    }

    const decision = options[Math.floor(Math.random() * options.length)]

    // If we're going to a new animation, reset what frame we're on
    // so the animations starts from the beginning
    if (decision !== this.stateMachine.value) {
      this.chickenFrame = 0
    }
    return decision
  }

  foodCollisionCheck() {
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
      return checkCollision(f, this)
    })

    const indexOfFoundFood = food.indexOf(foundFood)

    // Remove the food
    if (indexOfFoundFood > -1) {
      food.splice(indexOfFoundFood, 1)
      this.isHungry = false
      clearInterval(this.interval)
      this.stateMachine.transition("eat")

      setTimeout(() => {
        // This is cleared here, to prevent multiple intervals from being set accidentally
        clearInterval(this.interval)
        this.interval = this.startWandering()
        this.isHungry = true
      }, 3000)
    }
  }

  update() {
    this.foodCollisionCheck()

    // Move the chicken
    if (
      this.stateMachine.value === "idle" ||
      this.stateMachine.value === "bounce" ||
      this.stateMachine.value === "eat"
    ) {
      return
    } else if (this.stateMachine.value === "walk") {
      this.x += this.speed
    } else if (this.stateMachine.value === "run") {
      this.x += Math.floor(this.speed * 3)
    }
  }

  move(direction) {
    if (direction === "left") {
      this.speed = -Math.abs(this.speed)
      this.moving = "left"
    } else if (direction === "right") {
      this.speed = Math.abs(this.speed)
      this.moving = "right"
    }
  }

  draw(context, chickenImage) {
    // Temporarily treat "eat" as "bounce", it needs art
    let animation =
      this.stateMachine.value === "eat" ? "bounce" : this.stateMachine.value

    let spriteAnimationName =
      animation + (this.moving === "right" ? "Right" : "Left")

    drawAnimationFrame(
      chickenImage,
      this.animations[spriteAnimationName],
      this.chickenFrame,
      context,
      this.x,
      this.y,
      2
    )

    if (this.stateMachine.value === "idle") {
      // handle animation for idle
      if (this.chickenElapsedFrames >= 12) {
        // Don't loop, stay at the end
        if (this.chickenFrame < 3) {
          this.chickenFrame++
        }

        this.chickenElapsedFrames = 0
      } else {
        this.chickenElapsedFrames++
      }
    } else if (
      this.stateMachine.value === "walk" ||
      this.stateMachine.value === "bounce" ||
      this.stateMachine.value === "eat"
    ) {
      // handle animation for walk
      if (this.chickenElapsedFrames >= 12) {
        // Loop the animation or continue
        if (this.chickenFrame === 3) {
          this.chickenFrame = 0
        } else {
          this.chickenFrame++
        }

        this.chickenElapsedFrames = 0
      } else {
        this.chickenElapsedFrames++
      }
    } else if (this.stateMachine.value === "run") {
      // handle animation for run
      if (this.chickenElapsedFrames >= 1) {
        // Loop the animation or continue
        if (this.chickenFrame === 3) {
          this.chickenFrame = 1
        } else {
          this.chickenFrame++
        }

        this.chickenElapsedFrames = 0
      } else {
        this.chickenElapsedFrames++
      }
    }
  }
}
