import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const sendSMS = async (phoneNo, message) => {
  const command = {
    PhoneNumber: phoneNo,
    Message: message,
  };
  const response = await snsClient.send(new PublishCommand(command));
  return response;
};
