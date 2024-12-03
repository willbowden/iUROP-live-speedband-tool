import { post } from "aws-amplify/api";

type SpeedbandType = {
  cameraId: string,
  linkId: string,
}

export type JobCreationInput = {
  userId: string,
  apiKey: string,
  durationMinutes: number,
  frequencyMinutes: number,
  speedbands: SpeedbandType[],
}

export async function CreateJob(data: JobCreationInput) {
  try {
    const { body } = await post({
      apiName: "SpeedbandsAPI",
      path: "/jobs/create",
      options: {
        body: data,
      }
    }).response;

    return body.json();
  } catch (error) {
    return error;
  }
}