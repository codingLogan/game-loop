class Pet {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.height = 64
    this.width = 64
    this.speed = 2

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
    } else if (direction === "right") {
      this.speed = Math.abs(this.speed)
    }
  }
}
