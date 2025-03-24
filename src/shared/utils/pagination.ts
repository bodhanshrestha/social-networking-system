export const getPagination = (queryDto: any) => {
  const limit = queryDto?.limit || 10;
  const page = queryDto?.page || 1;
  const skip = (page - 1) * limit;
  return { limit, page, skip };
};
