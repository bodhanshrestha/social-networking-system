import mongoose from 'mongoose';

/**
 * Executes a callback function within a MongoDB transaction
 * @param {Function} callback - Async function that accepts a session and performs DB operations
 * @returns {Promise<any>} - Returns the result of the callback function
 */
export const withTransaction = async (
  callback: (session: mongoose.ClientSession) => Promise<any>,
): Promise<any> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Execute the callback function with the session
    const result = await callback(session);

    // Commit the transaction
    await session.commitTransaction();

    return result;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error('Transaction aborted:', error);
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};
