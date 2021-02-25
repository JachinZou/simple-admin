export function objectEqual (object1: object, object2: object, deep: boolean = false): boolean {
  let eq: boolean = true
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)
  if (keys1.length !== keys2.length) return false
  for (const key in object1) {
    if (!(key in object2)) {
      eq = false
      break
    }
    type objType = keyof object // 这里就是never
    const value1: unknown = object1[key as objType]
    const value2: unknown = object2[key as objType]
    if (deep) {
      if (Array.isArray(value1) && (Array.isArray(value2))) {
        eq = arrayEqual(value1, value2, deep)
      } else if (value1 === null && value2 === null) {
        eq = value1 === value2
      } else if (typeof value1 === 'object' && value1 && typeof value2 === 'object' && value2) {
        eq = objectEqual(value1, value2, deep)
      } else if (typeof value1 === 'number' && typeof value2 === 'number' && isNaN(value1) && isNaN(value2)) {
        eq = true
      } else {
        eq = value1 === value2
      }
    } else {
      eq = value1 === value2
    }
    if (!eq) {
      break
    }
  }
  return eq
}

export function arrayEqual (array1: unknown[], array2: unknown[], deep: boolean = false): boolean {
  if (array1.length !== array2.length) return false
  return array1.every((item: unknown, index: number) => {
    const value1 = array1[index]
    const value2 = array2[index]
    if (deep) {
      if (Array.isArray(value1) && (Array.isArray(value2))) {
        return arrayEqual(value1, value2, deep)
      } else if (value1 === null && value2 === null) {
        return value1 === value2
      } else if (typeof value1 === 'object' && value1 && typeof value2 === 'object' && value2) {
        return objectEqual(value1, value2, deep)
      } else if (typeof value1 === 'number' && typeof value2 === 'number' && isNaN(value1) && isNaN(value2)) {
        return true
      } else {
        return value1 === value2
      }
    } else {
      return value1 === value2
    }
  })
}

export const equal: (one: unknown, two: unknown, deep?: boolean) => boolean = (one, two, deep = false) => {
  if (Array.isArray(one) && Array.isArray(two)) {
    return arrayEqual(one, two, deep)
  } else if (typeof one === 'object' && typeof two === 'object' && one && two) {
    return objectEqual(one, two, deep)
  } else {
    return one === two
  }
}
