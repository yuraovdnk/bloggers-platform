import { validateOrReject } from 'class-validator';

const validateOrRejectModel = async (model: any, ctor: { new (): any }) => {
  if (model instanceof ctor === false) {
    throw new Error('incorrect input dara');
  }
  try {
    await validateOrReject(model);
  } catch (error) {
    throw new Error(error);
  }
};
//await validateOrRejectModel(inputModel, createBlog);
