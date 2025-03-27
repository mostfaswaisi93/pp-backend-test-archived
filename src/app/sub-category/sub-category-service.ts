import { Category } from "../../models/category/category.model";
import { ICategory } from "../../models/category/category.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

const generateCategoryCode = async (categoryName: string): Promise<string> => {
  const words = categoryName.split(" ");
  let categoryPrefix = words
    .map((word) => word.slice(0, 2).toUpperCase())
    .join("");
  categoryPrefix = categoryPrefix.slice(0, 6);

  const lastCategory = await Category.findOne().sort({ code: -1 }).exec();
  let lastNumber = 0;

  if (lastCategory) {
    const lastCodeNumber = lastCategory.code.slice(6);
    const parsedNumber = parseInt(lastCodeNumber);
    if (!isNaN(parsedNumber)) {
      lastNumber = parsedNumber;
    }
  }

  let newCode = `${categoryPrefix}${(lastNumber + 1).toString().padStart(4, "0")}`;
  const existingCategory = await Category.findOne({ code: newCode }).exec();

  if (existingCategory) {
    newCode = `${categoryPrefix}${(lastNumber + 2).toString().padStart(4, "0")}`;
  }

  return newCode;
};

export class SubCategoryService {
  private static _instance: SubCategoryService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: ICategory) {
    if (data.name) {
      let nameExist = await Category.findOne({ name: data.name });
      if (nameExist) {
        throw new InvalidInputException("Category name already exists");
      }
    }

    const generatedCode = await generateCategoryCode(data.name);

    if (generatedCode) {
      let codeExist = await Category.findOne({ code: generatedCode });
      if (codeExist) {
        throw new InvalidInputException("Category code already exists");
      }
    }

    let category = new Category({
      code: generatedCode,
      name: data.name,
      description: data.description,
      icon: data.icon,
      image: data.image,
      price: data.price,
      createdBy: "SYSTEM ADMIN",
      status: data.status ?? "ACTIVE",
      isAdminOnly: data.isAdminOnly ?? false,
      isPopularCategory: data.isPopularCategory ?? true,
    });

    try {
      let result = await category.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async getCategoryById(_id: string) {
    const category = await Category.findById({ _id });
    if (!category) throw new InvalidInputException("Category not found");
    return category;
  }

  public async getLastCategoryId() {
    const lastCategory = await Category.findOne().sort({ _id: -1 });
    if (!lastCategory)
      throw new InvalidInputException("There are no categories.");
    return lastCategory;
  }

  public async getCategories() {
    const categories = await Category.find({ status: "ACTIVE" }).sort({
      name: 1,
    });
    if (!categories) throw new InvalidInputException("Categories not found");
    return categories;
  }

  public async getCategoriesWithSSP() {
    const categories = await Category.find({ status: "ACTIVE" }).sort({
      name: 1,
    });
    if (!categories) throw new InvalidInputException("Categories not found");
    return categories;
  }

  public async getCategoryName(body: any) {
    if (!Array.isArray(body)) {
      return {
        error: true,
        message: "Invalid request body. An array is expected.",
      };
    }

    const tradeLicenseArray: string[] = body.map(
      (item: { tradeLicense: string }) => item.tradeLicense
    );

    const categories = await Category.find({
      status: "ACTIVE",
      code: { $in: tradeLicenseArray },
    });

    if (!categories) throw new InvalidInputException("Categories not found");
    return { error: false, categories: categories ?? [] };
  }

  public async update(_id: string, data: ICategory) {
    const category = await Category.findOne({ _id });
    if (!category) {
      throw new NotFoundException();
    }

    if (data.name && data.name !== category.name) {
      let nameExist = await Category.findOne({ name: data.name });
      if (nameExist && nameExist._id.toString() !== _id) {
        throw new InvalidInputException("Category name already exists");
      }

      const generatedCode = await generateCategoryCode(data.name);
      if (generatedCode) {
        let codeExist = await Category.findOne({ code: generatedCode });
        if (codeExist) {
          throw new InvalidInputException("Category code already exists");
        }
        data.code = generatedCode;
      }
    }

    let updatedCategory = await Category.findByIdAndUpdate(
      _id,
      {
        $set: {
          name: data.name || category.name,
          description: data.description || category.description,
          icon: data.icon || category.icon,
          image: data.image || category.image,
          price: data.price || category.price,
          status: data.status || category.status,
          isAdminOnly: data.isAdminOnly || category.isAdminOnly,
          isPopularCategory:
            data.isPopularCategory || category.isPopularCategory,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedCategory) throw new InvalidInputException("Category not found");
    return updatedCategory;
  }

  public async updateStatus(_id: string, data: ICategory) {
    let category = await Category.findOne({ _id });

    if (!category) {
      throw new NotFoundException();
    }

    let updateStatus = await Category.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || category.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Category not found");
    return updateStatus;
  }

  public async delete(_id: string) {
    const category = await Category.findByIdAndDelete({ _id });
    if (!category) throw new InvalidInputException("Category not found");
  }
}
