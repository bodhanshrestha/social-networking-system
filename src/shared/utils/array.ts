export const removeDuplicates = (array: any[]) => {
  return [...new Set(array)];
};

export const removeDuplicatesFromArrayOfObjects = (array: any[]) => {
  return array.filter(
    (item, index, self) => index === self.findIndex((t) => t._id === item._id),
  );
};
