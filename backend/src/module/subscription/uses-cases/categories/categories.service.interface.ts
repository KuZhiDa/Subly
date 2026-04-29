import { Category } from 'src/database/generated/prisma/enums';

export interface ICategoriesService {
  addCategories(subscriptionId: string, categories: Category[]);
  addCategoryOne(
    userId: string,
    subscriptionId: string,
    categories: Category[],
  );
  deleteCategories(
    userId: string,
    subscriptionId: string,
    categories: Category[],
  );
  getCategoriesAll();
}
