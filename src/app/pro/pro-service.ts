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
    data: Partial<IPro>,
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
}
