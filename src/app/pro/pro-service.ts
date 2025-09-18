import * as i18n from "i18n";
import Pro from "../../models/pro/pro.model";
import { IPro } from "../../models/pro/pro.interface";
import { InvalidInputException } from "../../commons/errors/exceptions";
import { PasswordCheckService } from "../../commons/validators/password-check-service";

export class ProService {
  private static _instance: ProService;
  private passwordCheckService = PasswordCheckService.Instance;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: Partial<IPro>): Promise<IPro> {
    if (await Pro.exists({ email: data.email })) {
      throw new InvalidInputException(i18n.__("email_already_exists"));
    }

    if (await Pro.exists({ mobile: data.mobile })) {
      throw new InvalidInputException(i18n.__("mobile_already_exists"));
    }

    // if (
    //   data.password &&
    //   !this.passwordCheckService.checkPasswordValidity(data.password)
    // ) {
    //   throw new InvalidInputException(i18n.__("complex_password_required"));
    // }

    const currentDate = new Date().toISOString();

    const pro = new Pro({
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      dob: data.dob,
      socialSecurityNumber: data.socialSecurityNumber,
      proId: data.proId,
      qrCodeImage: data.qrCodeImage,
      userId: data.userId,
      businessName: data.businessName,
      businessType: data.businessType,
      businessAddress: data.businessAddress,
      zipcode: data.zipcode,
      city: data.city,
      state: data.state,
      email: data.email,
      mobile: data.mobile,
      leadPhoneNumber: data.leadPhoneNumber || "",
      latitude: data.latitude,
      longitude: data.longitude,
      companyLogo: data.companyLogo,
      attachments: data.attachments || [],
      proProfileImage: data.proProfileImage,
      businessHours: data.businessHours || [],
      vanlynk: data.vanlynk,
      leadgen: data.leadgen,
      vanlynkStatus: data.vanlynkStatus,
      leadgenStatus: data.leadgenStatus,
      license: data.license || "0",
      verified: data.verified,
      adminStatus: data.adminStatus || "Active",
      status: data.status || "ACTIVE",
      yelp_Address: data.yelp_Address || {},
      google_Address: data.google_Address || {},
      socialMediaLinks: data.socialMediaLinks || {},
      reviews: data.reviews || { avgRating: 0, noOfReviews: 0, noOfHired: 0 },
      ratingsCount: data.ratingsCount || {
        lessThanOne: 0,
        lessThanTwo: 0,
        lessThanThree: 0,
        lessThanFour: 0,
        lessThanFive: 0,
      },
      businessInformation: data.businessInformation || {},
      licenseInfo: data.licenseInfo || [],
      areaOfExpertise: data.areaOfExpertise || {
        areaOfExpertise: "",
        additionalInfo: "",
      },
      locations: data.locations || [],
      categoryName: data.categoryName || [],
      Summary: data.Summary || [],
      serviceArea: data.serviceArea || [],
      isFirstComponentCall: data.isFirstComponentCall,
      countyDeleteFlag: data.countyDeleteFlag,
      roles: data.roles || [],
      permissions: data.permissions || [],
      cards: data.cards || [],
      // createdBy,
      createdOn: currentDate,
      // modifiedBy: createdBy,
      modifiedOn: currentDate,
      createdDate: currentDate,
      reportNote: data.reportNote,
      reportFile: data.reportFile,
      isTPAdmin: data.isTPAdmin || false,
    });

    return await pro.save();
  }

  async getAllPros() {
    return await Pro.find();
  }

  async getProById(id: string) {
    const pro = await Pro.findById(id);
    if (!pro) throw new InvalidInputException(i18n.__("pro_not_found"));
    return pro;
  }

  async update(
    id: string,
    data: Partial<IPro>
    // modifiedBy: string
  ): Promise<IPro> {
    const currentDate = new Date().toISOString();

    const updatedPro = await Pro.findByIdAndUpdate(
      id,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        dob: data.dob,
        socialSecurityNumber: data.socialSecurityNumber,
        proId: data.proId,
        qrCodeImage: data.qrCodeImage,
        userId: data.userId,
        businessName: data.businessName,
        businessType: data.businessType,
        businessAddress: data.businessAddress,
        zipcode: data.zipcode,
        city: data.city,
        state: data.state,
        email: data.email,
        mobile: data.mobile,
        leadPhoneNumber: data.leadPhoneNumber || "",
        latitude: data.latitude,
        longitude: data.longitude,
        companyLogo: data.companyLogo,
        attachments: data.attachments || [],
        proProfileImage: data.proProfileImage,
        businessHours: data.businessHours || [],
        vanlynk: data.vanlynk,
        leadgen: data.leadgen,
        vanlynkStatus: data.vanlynkStatus,
        leadgenStatus: data.leadgenStatus,
        license: data.license || "0",
        verified: data.verified,
        adminStatus: data.adminStatus || "Active",
        status: data.status || "ACTIVE",
        yelp_Address: data.yelp_Address || {},
        google_Address: data.google_Address || {},
        socialMediaLinks: data.socialMediaLinks || {},
        reviews: data.reviews || { avgRating: 0, noOfReviews: 0, noOfHired: 0 },
        ratingsCount: data.ratingsCount || {
          lessThanOne: 0,
          lessThanTwo: 0,
          lessThanThree: 0,
          lessThanFour: 0,
          lessThanFive: 0,
        },
        businessInformation: data.businessInformation || {},
        licenseInfo: data.licenseInfo || [],
        areaOfExpertise: data.areaOfExpertise || {
          areaOfExpertise: "",
          additionalInfo: "",
        },
        locations: data.locations || [],
        categoryName: data.categoryName || [],
        Summary: data.Summary || [],
        serviceArea: data.serviceArea || [],
        isFirstComponentCall: data.isFirstComponentCall,
        countyDeleteFlag: data.countyDeleteFlag,
        roles: data.roles || [],
        permissions: data.permissions || [],
        cards: data.cards || [],
        // modifiedBy,
        modifiedOn: currentDate,
        reportNote: data.reportNote,
        reportFile: data.reportFile,
        isTPAdmin: data.isTPAdmin || false,
      },
      { new: true }
    );

    if (!updatedPro) throw new InvalidInputException(i18n.__("pro_not_found"));
    return updatedPro;
  }

  async delete(id: string) {
    const pro = await Pro.findByIdAndDelete(id);
    if (!pro) throw new InvalidInputException(i18n.__("pro_not_found"));
  }

  // async getProProfile(req: Request): Promise<IPro | null> {
  async getProProfile(): Promise<IPro | null> {
    // const id = req.params.id;
    const id = "id";
    const isAdmin = "isAdmin";
    // const isAdmin =
    // req.doc?.access_control?.length > 0 && req.doc?.access_control[0].roleCode === "ADMIN";

    const searchObj = isAdmin ? { proId: id } : { loginId: id };

    try {
      const proProfile = await Pro.findOne(searchObj, {
        roles: 0,
        permissions: 0,
      });

      if (!proProfile) {
        throw new InvalidInputException("Pro profile not found");
      }

      return proProfile;
    } catch (error) {
      throw error;
    }
  }

  async getProProfileDetails(loginId: string, role: string): Promise<any> {
    const proProfile = await Pro.findOne(
      { loginId },
      {
        firstName: 1,
        lastName: 1,
        proProfileImage: 1,
        loginId: 1,
        companyName: 1,
        vanlynk: 1,
        leadgen: 1,
        companyLogo: 1,
      }
    );

    const user = await Pro.findOne({ _id: loginId }, { access_control: 1 });

    if (proProfile && user) {
      const result = {
        _id: user._id,
        firstName: proProfile.firstName,
        lastName: proProfile.lastName,
        // loginId: proProfile.loginId,
        image: proProfile.proProfileImage,
        // roles: user.roles, // Clean role system
        // businessName: proProfile.companyName,
        vanlynk: proProfile.vanlynk,
        leadgen: proProfile.leadgen,
        companyLogo: proProfile.companyLogo,
      };
      return result;
    } else {
      throw new InvalidInputException(i18n.__("pro_not_found"));
    }
  }

  async getProCategory(): Promise<string[][]> {
    try {
      const categories = await Pro.find({}, { categoryName: 1, _id: 0 });
      return categories.map((pro) => {
        if (Array.isArray(pro.categoryName)) {
          return pro.categoryName.map((item) =>
            typeof item === "string" ? item : JSON.stringify(item)
          );
        }
        return [];
      });
    } catch (error) {
      throw new InvalidInputException(i18n.__("could_not_fetch_categories"));
    }
  }

  async findByProSearch(search: string): Promise<IPro[]> {
    const query = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
      ],
    };

    try {
      const pros = await Pro.find(query).limit(20);
      return pros;
    } catch (error) {
      throw new InvalidInputException(i18n.__("search_failed"));
    }
  }

  async getProEmailData(loginId: string): Promise<Partial<IPro>> {
    const pro = await Pro.findOne(
      { loginId },
      { email: 1, firstName: 1, lastName: 1, proId: 1 }
    );

    if (!pro) {
      throw new InvalidInputException(i18n.__("pro_not_found"));
    }

    return pro;
  }

  async getProRolesAndPermissions(loginId: string): Promise<Partial<IPro>> {
    const pro = await Pro.findOne({ loginId }, { roles: 1, permissions: 1 });
    if (!pro) {
      throw new InvalidInputException(i18n.__("pro_not_found"));
    }
    return {
      roles: pro.roles,
      permissions: pro.permissions,
    };
  }
}
