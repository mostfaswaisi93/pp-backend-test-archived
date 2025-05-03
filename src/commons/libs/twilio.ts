import twilio from "twilio";

type TwilioMessageOptions = {
  to: string;
  body: string;
  mediaUrlArray?: string[];
};

type TwilioVoiceCallOptions = {
  to: string;
  from: string;
  url: string;
};

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const TwilioService = {
  async twilioSendMessage(
    to: string,
    body: string,
    mediaUrlArray?: string[]
  ): Promise<any> {
    console.log("twilioSendMessage Function =====>", to, body);

    const messageData: any = {
      to: `${process.env.TWILIO_COUNTRY_CODE}${to}`,
      from: process.env.TWILIO_SMS_SENDING_MOBILE_NUMBER!,
      body,
    };

    if (mediaUrlArray && mediaUrlArray.length > 0) {
      messageData.mediaUrl = mediaUrlArray;
    }

    try {
      const response = await client.messages.create(messageData);
      return response;
    } catch (error) {
      console.error("Error sending Twilio message:", error);
      throw error;
    }
  },

  async twilioVoiceCall(options: TwilioVoiceCallOptions): Promise<any> {
    try {
      const response = await client.calls.create(options);
      return response;
    } catch (error) {
      console.error("Error making Twilio voice call:", error);
      throw error;
    }
  },
};
