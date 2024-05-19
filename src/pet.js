class Pet {
  constructor(x, y, animations) {
    // Object variables
    this.x = x
    this.y = y
    this.height = 64
    this.width = 64
    this.speed = 1
    this.moving = "right"

    // Sprite variables
    this.animations = animations
    this.chickenFrame = 0
    this.chickenElapsedFrames = 0

    // These values line up with the sprite sheet
    this.animationState = {
      walk: 0,
      bounce: 1,
      idle: 2,
      run: 3,
    }

    this.stateMachine = new StateMachine({
      start: "idle",
      idle: {
        events: {
          decide: () => {
            // Stay idle or go walking?
            return this.handleTransition(["idle", "walk", "run"])
          },
        },
      },
      walk: {
        events: {
          decide: () => {
            // Stay walking or go idle?
            return this.handleTransition(["idle", "walk", "run"])
          },
        },
      },
      run: {
        events: {
          decide: () => {
            // Stay running or go idle?
            return this.handleTransition(["idle", "run"])
          },
        },
      },
    })

    // This should likely NOT be a setInterval
    setInterval(() => {
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
    const decision = options[Math.floor(Math.random() * options.length)]

    // If we're going to a new animation, reset what frame we're on
    // so the animations starts from the beginning
    if (decision !== this.stateMachine.value) {
      this.chickenFrame = 0
    }
    return decision
  }

  update() {
    // Move the chicken
    if (this.stateMachine.value === "idle") {
      return
    } else if (this.stateMachine.value === "walk") {
      this.x += this.speed
    } else if (this.stateMachine.value === "run") {
      this.x += Math.floor(this.speed * 2)
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
    let spriteAnimationName =
      this.stateMachine.value + (this.moving === "right" ? "Right" : "Left")

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
    } else if (this.stateMachine.value === "walk") {
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
    }
  }
}
