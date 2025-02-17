import { v4 as uuidv4 } from "uuid"

/**
 * Generate a UUID v4 string
 * @returns {string} UUID string
 */
export const genUUID = (): string => {
  return uuidv4()
}
