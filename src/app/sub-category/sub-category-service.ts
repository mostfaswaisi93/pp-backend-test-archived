import { SubCategory } from "../../models/sub-category/subcategory.model";
import { ISubCategory } from "../../models/sub-category/subcategory.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

// Function to generate a unique subcategory code based on the subcategory name
const generateSubCategoryCode = async (
  subcategoryName: string
): Promise<string> => {
  const words = subcategoryName.split(" ");
  let subcategoryPrefix = words
    .map((word) => word.slice(0, 2).toUpperCase()) // Taking the first two letters of each word and converting to uppercase
    .join("");
  subcategoryPrefix = subcategoryPrefix.slice(0, 6); // Limiting to 6 characters for the prefix

  const lastSubCategory = await SubCategory.findOne()
    .sort({ subcategoryCode: -1 })
    .exec();
  let lastNumber = 0;

  if (lastSubCategory) {
    const lastCodeNumber = lastSubCategory.subcategoryCode.slice(6); // Extracting the number part of the last subcategory code
    const parsedNumber = parseInt(lastCodeNumber);
    if (!isNaN(parsedNumber)) {
      lastNumber = parsedNumber; // Getting the last subcategory number
    }
  }

  let newCode = `${subcategoryPrefix}${(lastNumber + 1).toString().padStart(4, "0")}`; // Generating new subcategory code
  const existingSubCategory = await SubCategory.findOne({
    subcategoryCode: newCode,
  }).exec();

  if (existingSubCategory) {
    newCode = `${subcategoryPrefix}${(lastNumber + 2).toString().padStart(4, "0")}`; // If the new code exists, try with the next number
  }

  return newCode;
};

export class SubCategoryService {
  private static _instance: SubCategoryService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  // Create a new subcategory
  async create(data: ISubCategory) {
    if (data.name) {
      let nameExist = await SubCategory.findOne({ name: data.name });
      if (nameExist) {
        throw new InvalidInputException("Subcategory name already exists");
      }
    }

    const generatedCode = await generateSubCategoryCode(data.name);

    if (generatedCode) {
      let codeExist = await SubCategory.findOne({
        subcategoryCode: generatedCode,
      });
      if (codeExist) {
        throw new InvalidInputException("Subcategory code already exists");
      }
    }

    let subcategory = new SubCategory({
      subcategoryCode: generatedCode,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      price: data.price,
      bapPrice: data.bapPrice,
      isStandardQuestionLoaded: data.isStandardQuestionLoaded ?? false,
      createdBy: "SYSTEM ADMIN",
      status: data.status ?? "ACTIVE",
    });

    try {
      let result = await subcategory.save();
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get a subcategory by its ID
  public async getSubCategoryById(_id: string) {
    const subcategory = await SubCategory.findById({ _id });
    if (!subcategory) throw new InvalidInputException("Subcategory not found");
    return subcategory;
  }

  // Get the last subcategory created
  public async getLastSubCategoryId() {
    const lastSubCategory = await SubCategory.findOne().sort({ _id: -1 });
    if (!lastSubCategory)
      throw new InvalidInputException("There are no subcategories.");
    return lastSubCategory;
  }

  // Get all active subcategories
  public async getSubCategories() {
    const subcategories = await SubCategory.find({ status: "ACTIVE" }).sort({
      name: 1,
    });
    if (!subcategories)
      throw new InvalidInputException("Subcategories not found");
    return subcategories;
  }

  // Update a subcategory by its ID
  public async update(_id: string, data: ISubCategory) {
    const subcategory = await SubCategory.findOne({ _id });
    if (!subcategory) {
      throw new NotFoundException();
    }

    if (data.name && data.name !== subcategory.name) {
      let nameExist = await SubCategory.findOne({ name: data.name });
      if (nameExist && nameExist._id.toString() !== _id) {
        throw new InvalidInputException("Subcategory name already exists");
      }

      const generatedCode = await generateSubCategoryCode(data.name);
      if (generatedCode) {
        let codeExist = await SubCategory.findOne({
          subcategoryCode: generatedCode,
        });
        if (codeExist) {
          throw new InvalidInputException("Subcategory code already exists");
        }
        data.subcategoryCode = generatedCode;
      }
    }

    let updatedSubCategory = await SubCategory.findByIdAndUpdate(
      _id,
      {
        $set: {
          name: data.name || subcategory.name,
          description: data.description || subcategory.description,
          categoryId: data.categoryId || subcategory.categoryId,
          price: data.price || subcategory.price,
          bapPrice: data.bapPrice || subcategory.bapPrice,
          status: data.status || subcategory.status,
          isStandardQuestionLoaded:
            data.isStandardQuestionLoaded ||
            subcategory.isStandardQuestionLoaded,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedSubCategory)
      throw new InvalidInputException("Subcategory not found");
    return updatedSubCategory;
  }

  // Update the status of a subcategory
  public async updateStatus(_id: string, data: ISubCategory) {
    let subcategory = await SubCategory.findOne({ _id });

    if (!subcategory) {
      throw new NotFoundException();
    }

    let updateStatus = await SubCategory.findByIdAndUpdate(
      _id,
      {
        $set: {
          status: data.status || subcategory.status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateStatus) throw new InvalidInputException("Subcategory not found");
    return updateStatus;
  }

  // Delete a subcategory by its ID
  public async delete(_id: string) {
    const subcategory = await SubCategory.findByIdAndDelete({ _id });
    if (!subcategory) throw new InvalidInputException("Subcategory not found");
  }
}
