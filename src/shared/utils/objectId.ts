import { Types } from 'mongoose';

export { Types };

/**
 * Converts a given value to a MongoDB ObjectId if it is not already one.
 *
 * - If the input is a valid `ObjectId` and is already an instance of `Types.ObjectId`, it is returned as-is.
 * - If the input is a valid ObjectId string, it is converted into an instance of `Types.ObjectId`.
 * - Invalid inputs will result in an error when attempting to create a new `Types.ObjectId`.
 *
 * @param id - The value to be converted, which can be a string or an existing `Types.ObjectId`.
 * @returns A valid `Types.ObjectId` instance.
 * @throws Will throw an error if the input string is not a valid ObjectId.
 *
 * @example
 * ```typescript
 * const objectId = ObjectId('507f191e810c19729de860ea'); // Valid string
 * console.log(objectId instanceof Types.ObjectId); // true
 *
 * const existingId = new Types.ObjectId();
 * console.log(ObjectId(existingId) === existingId); // true
 * ```
 */
export const ObjectId = (id: string | Types.ObjectId): Types.ObjectId => {
  // Check if the input is already a valid ObjectId
  if (Types.ObjectId.isValid(id) && id instanceof Types.ObjectId) {
    return id; // Return the ObjectId as is if it's valid
  }
  // Otherwise, convert the string to an ObjectId
  return new Types.ObjectId(id);
};

/**
 * Checks if a given string is a valid MongoDB ObjectId.
 *
 * - Uses Mongoose's `Types.ObjectId.isValid()` to determine validity.
 * - Returns `true` if the input string is a valid ObjectId, otherwise `false`.
 *
 * @param id - The string to be checked for validity as a MongoDB ObjectId.
 * @returns A boolean indicating whether the input string is a valid ObjectId.
 *
 * @example
 * ```typescript
 * const valid = isValidObjectId('507f191e810c19729de860ea'); // true
 * const invalid = isValidObjectId('invalid-id'); // false
 * ```
 */
export const isValidObjectId = (id: string | Types.ObjectId): boolean =>
  Types.ObjectId.isValid(id);

/**
 * Compares a string representation of an ObjectId with a `Types.ObjectId` instance.
 *
 * - Converts the string to an ObjectId using `ObjectId()` and compares it with the provided ObjectId instance.
 * - Uses the `equals()` method of `Types.ObjectId` for the comparison.
 * - Throws an error if the string cannot be converted to a valid ObjectId.
 *
 * @param idInString - The string representation of the ObjectId.
 * @param idInObjectId - The `Types.ObjectId` instance to compare against.
 * @returns A boolean indicating whether the two ObjectIds are equal.
 *
 * @example
 * ```typescript
 * const idInString = '507f191e810c19729de860ea';
 * const idInObjectId = new Types.ObjectId('507f191e810c19729de860ea');
 *
 * const isEqual = compareStringWithObjectId(idInString, idInObjectId); // true
 * ```
 */
export const compareStringWithObjectId = (
  idInString: string,
  idInObjectId: Types.ObjectId
): boolean => ObjectId(idInString).equals(idInObjectId);

/**
 * Converts the input to a MongoDB ObjectId if it is valid, otherwise returns the original value.
 * @param value - The value to be checked and potentially converted.
 * @returns The converted ObjectId or the original value.
 */
export function convertToObjectIdIfValid(
  value: string | Types.ObjectId
): Types.ObjectId | string {
  return isValidObjectId(value) ? new Types.ObjectId(value) : value;
}
