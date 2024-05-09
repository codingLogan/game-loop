class StateMachine {
  constructor(states) {
    this.states = states
    this.value = states.start
  }

  transition(event) {
    if (this.states[this.value].events[event]) {
      this.value = this.states[this.value].events[event]()
    }
  }
}

// console.log("load")

// const stateMachine = new StateMachine({
//   start: "idle",
//   idle: {
//     events: {
//       decide: () => {
//         // Stay idle or go walking?
//         const options = ["idle", "walk"]
//         return options[Math.floor(Math.random() * options.length)]
//       },
//     },
//   },
//   walk: {
//     events: {
//       decide: () => {
//         // Stay walking or go idle?
//         const options = ["walk", "idle"]
//         return options[Math.floor(Math.random() * options.length)]
//       },
//     },
//   },
// })

// stateMachine.transition("decide")

// setInterval(() => {
//   stateMachine.transition("decide")
// }, 2000)
