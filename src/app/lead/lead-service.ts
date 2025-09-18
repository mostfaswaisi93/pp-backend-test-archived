import { Lead } from "../../models/lead/lead.model";
import { ILead } from "../../models/lead/lead.interface";
import {
  NotFoundException,
  InvalidInputException,
} from "../../commons/errors/exceptions";

export class LeadService {
  private static _instance: LeadService;

  static get Instance() {
    return this._instance ?? (this._instance = new this());
  }

  async create(data: ILead) {
    if (
      !data.leadCode ||
      !data.leadName ||
      !data.startDate ||
      !data.endDate
    ) {
      throw new InvalidInputException("Missing required fields");
    }

    const existingLead = await Lead.findOne({ leadCode: data.leadCode });
    if (existingLead) {
      throw new InvalidInputException("Lead with this code already exists");
    }

    try {
      const lead = new Lead({
        userId: data.userId,
        proId: data.proId,
        leadCode: data.leadCode,
        leadName: data.leadName,
        vendorName: data.vendorName,
        startDate: data.startDate,
        endDate: data.endDate,
        marketingMediaType: data.marketingMediaType,
        recurring: data.recurring,
        leadFees: data.leadFees,
        leadPercentageValue: data.leadPercentageValue,
        leadPercentage: data.leadPercentage,
        leadDollarValue: data.leadDollarValue,
        totalPrice: data.totalPrice,
        totalTickets: data.totalTickets,
        description: data.description,
        mode: data.mode,
        leadImages: data.leadImages,
        qrCodes: data.qrCodes,
        leadServiceCost: data.leadServiceCost,
        notes: data.notes,
        createdBy: data.createdBy,
        status: data.status ?? "DRAFT",
        theme: data.theme,
        isReadyToShare: data.isReadyToShare,
        lastEmailSendOn: data.lastEmailSendOn,
      });
      return await lead.save();
    } catch (error: any) {
      throw new Error("Error saving Lead: " + error.message);
    }
  }

  public async getLeadById(_id: string) {
    const lead = await Lead.findById({ _id });
    if (!lead) throw new InvalidInputException("Lead not found");
    return lead;
  }

  public async getLeads() {
    const leads = await Lead.find({ status: "ACTIVE" }).sort({
      startDate: 1,
    });
    if (leads.length === 0) throw new InvalidInputException("Leads not found");
    return leads;
  }

  public async update(_id: string, data: ILead) {
    const lead = await Lead.findById(_id);
    if (!lead) {
      throw new NotFoundException("Lead not found");
    }

    if (data.leadCode) {
      const existingLead = await Lead.findOne({
        leadCode: data.leadCode,
        _id: { $ne: _id },
      });
      if (existingLead) {
        throw new InvalidInputException(
          "Another lead with this code already exists"
        );
      }
    }

    try {
      const updatedLead = await Lead.findByIdAndUpdate(
        _id,
        {
          $set: {
            userId: data.userId,
            proId: data.proId,
            leadCode: data.leadCode,
            leadName: data.leadName,
            vendorName: data.vendorName,
            startDate: data.startDate,
            endDate: data.endDate,
            marketingMediaType: data.marketingMediaType,
            recurring: data.recurring,
            leadFees: data.leadFees,
            leadPercentageValue: data.leadPercentageValue,
            leadPercentage: data.leadPercentage,
            leadDollarValue: data.leadDollarValue,
            totalPrice: data.totalPrice,
            totalTickets: data.totalTickets,
            description: data.description,
            mode: data.mode,
            leadImages: data.leadImages,
            qrCodes: data.qrCodes,
            leadServiceCost: data.leadServiceCost,
            notes: data.notes,
            createdBy: data.createdBy,
            status: data.status,
            theme: data.theme,
            isReadyToShare: data.isReadyToShare,
            lastEmailSendOn: data.lastEmailSendOn,
          },
        },
        { new: true }
      );

      if (!updatedLead) {
        throw new InvalidInputException("Failed to update lead");
      }
      return updatedLead;
    } catch (error: any) {
      throw new Error("Error updating Lead: " + error.message);
    }
  }

  public async updateStatus(_id: string, status: string) {
    const lead = await Lead.findById(_id);
    if (!lead) {
      throw new NotFoundException("Lead not found");
    }

    try {
      const updateStatus = await Lead.findByIdAndUpdate(
        _id,
        { $set: { status } },
        { new: true }
      );

      if (!updateStatus)
        throw new InvalidInputException("Failed to update status");
      return updateStatus;
    } catch (error: any) {
      throw new Error("Error updating lead status: " + error.message);
    }
  }

  public async delete(_id: string) {
    const lead = await Lead.findByIdAndDelete(_id);
    if (!lead) throw new InvalidInputException("Lead not found");
  }
}
