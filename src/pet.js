class Pet {
  constructor(x, y) {
    // Object variables
    this.x = x
    this.y = y
    this.height = 64
    this.width = 64
    this.speed = 1
    this.moving = "right"

    // Sprite variables
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
            const options = ["idle", "walk", "run"]
            return options[Math.floor(Math.random() * options.length)]
          },
        },
      },
      walk: {
        events: {
          decide: () => {
            // Stay walking or go idle?
            const options = ["walk", "run", "idle"]
            return options[Math.floor(Math.random() * options.length)]
          },
        },
      },
      run: {
        events: {
          decide: () => {
            // Stay running or go idle?
            const options = ["run", "idle"]
            return options[Math.floor(Math.random() * options.length)]
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

  update() {
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
    let animationRow = this.animationState[this.stateMachine.value]
    if (this.moving === "right") {
      const rightFramesModifier = 4
      animationRow += rightFramesModifier
    }

    drawSpriteFrame(
      chickenImage,
      this.chickenFrame,
      animationRow * 32,
      context,
      this.x,
      this.y
    )

    if (this.chickenElapsedFrames >= 10) {
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
