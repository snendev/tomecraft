export default function assertNever(value: never): never {
    // TODO an actual error message
      throw new Error(`assertNever failed for value ${value}`)
  }
  