export const postProjection = {
  _id: 1,
  contents: 1,
  imageUrl: 1,
  createdBy: 1,
  createdAt: 1,
  // updatedAt: 1,
  // comments: 1,
  // likes: 1
};

export const postUserProjection = {
  name: 1,
  _id: 1,
  email: 1,
};

export const postAllProjection = {
  ...postProjection,
  comments: 1,
  likes: 1,
};
