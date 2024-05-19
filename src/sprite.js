/*
    Assumption (each row has equal height and width)
    [
        {
            name: string
            width: number,
            height: number,
            frames: number
        }
    ]

    Returns

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
function parseSpriteAnimations(config) {
  let currentHeight = 0
  const animations = {}

  config.forEach((row) => {
    const frames = []

    let currentX = 0
    let f = 0
    for (f = 0; f < row.frames; f++) {
      frames.push({ x: currentX, y: currentHeight })
      currentX += row.width
    }

    animations[row.name] = {
      frames,
      width: row.width,
      height: row.height,
    }

    currentHeight += row.height
  })

  return animations
}
