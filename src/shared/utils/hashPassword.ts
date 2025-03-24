
import * as bcryptJs from "bcryptjs"


export const hashPassword = async (password: string): Promise<string> => {
  const salt = 10
  return await bcryptJs.hash(password, salt)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcryptJs.compare(password, hashedPassword)
}
