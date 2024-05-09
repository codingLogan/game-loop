class Food {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.height = 16
    this.width = 16
    this.speed = 5
  }

  update() {
    this.y += this.speed
  }
}
