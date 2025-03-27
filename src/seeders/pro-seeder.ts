import dotenv from "dotenv";
import Pro from "../models/pro/pro.model";

dotenv.config();

export const runProSeeder = async () => {
  const proData = [
    {
      firstName: "John",
      lastName: "Doe",
      middleName: "A",
      dob: "1980-01-01",
      socialSecurity: "123-45-6789",
      proId: "PRO123",
      qrImage: "http://example.com/qr1.png",
      userId: "john_doe123",
      businessName: "John's Plumbing",
      businessType: "Plumbing",
      businessAddress: "123 Main St, City, State, 12345",
      zipcode: "12345",
      city: "City",
      state: "State",
      emailId: "john.doe@example.com",
      mobileNumber: "555-1234",
      leadPhoneNumber: "555-5678",
      latitude: "40.7128",
      longitude: "-74.0060",
      companyLogo: "http://example.com/logo1.png",
      attachments: [{ type: "pdf", url: "http://example.com/attachment1.pdf" }],
      proProfileImage: "http://example.com/profile1.png",
      businessHours: [{ day: "Monday", hours: "9 AM - 5 PM" }],
      vanlynk: "Vanlynk_123",
      leadgen: "LeadGen_ABC",
      vanlynkStatus: "Active",
      leadgenStatus: "Active",
      license: "ABC12345",
      verified: "Yes",
      adminStatus: "Active",
      yelp_Address: {
        businessAddress: "123 Main St",
        zipcode: "12345",
        city: "City",
        state: "State",
      },
      google_Address: {
        businessAddress: "123 Main St",
        zipcode: "12345",
        city: "City",
        state: "State",
      },
      socialMediaLinks: {
        googleId: "google123",
        yelpId: "yelp123",
        googleRating: "4.5",
        yelpRating: "4.0",
        aggregateRating: "4.3",
      },
      reviews: { avgRating: 4.5, noOfReviews: 100, noOfHired: 50 },
      ratingsCount: {
        lessThanOne: 2,
        lessThanTwo: 4,
        lessThanThree: 5,
        lessThanFour: 10,
        lessThanFive: 79,
      },
      businessInformation: {
        businessInformation: "Experienced plumbing services",
        isBusinessSince: "2005",
        isInsured: "Yes",
        isBonded: "Yes",
        isWarrantyOffered: "Yes",
        isCreditCardAccepted: "Yes",
        isEstimatesFree: "Yes",
        noOfEmployees: "10",
        noOftrucks: "5",
        aboutService: "We provide high-quality plumbing services.",
      },
      licenseDetails: [
        { licenseNumber: "ABC123", expirationDate: "2025-12-31" },
      ],
      areaOfExpertise: {
        areaOfExpertise: "Plumbing",
        additionalInfo: "Emergency Services",
      },
      locations: [
        {
          address: "456 Another St, City, State, 12346",
          city: "City",
          state: "State",
        },
      ],
      categoryName: [{ category: "Plumbing Services" }],
      Summary: [
        { text: "John is a professional plumber with years of experience." },
      ],
      serviceArea: [{ area: "City, State" }],
      firsttimecomponentcall: "Yes",
      DefaultCountyDeleteFlag: "No",
      roles: [{ role: "Admin" }],
      permissions: [{ permission: "View" }],
      cards: [{ cardType: "Visa", cardNumber: "4111-1111-1111-1111" }],
      createdBy: "admin",
      createdOn: "2025-01-01",
      modifiedBy: "admin",
      modifiedOn: "2025-01-02",
      createdDate: "2025-01-01",
      reportNote: "Initial report",
      reportFile: "http://example.com/report1.pdf",
      isTPAdmin: false,
      status: "ACTIVE",
    },
  ];

  try {
    await Pro.insertMany(proData);
    console.log("Pro seed data inserted successfully!");
  } catch (error) {
    console.error("Error inserting pro seed data:", error);
  }
};
