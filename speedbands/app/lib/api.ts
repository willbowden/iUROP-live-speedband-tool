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

export type JobCreationResponse = {
  statusCode: number,
  jobId: string,
  message: string,
}

export async function CreateJob(data: JobCreationInput): Promise<JobCreationResponse> {
  try {
    // OMITTED FOR TESTING
    // const response = await post({
    //   apiName: "SpeedbandsAPI",
    //   path: "/jobs/create",
    //   options: {
    //     body: data,
    //   }
    // }).response;

    // if (response.statusCode == 200) {
      // return {
      //   statusCode: response.statusCode,
      //   ...response.body.json(),
      // };
    // } else {
    //   throw new Error(response.body.json().toString());
    // }


    return {
      "statusCode": 200,
      "jobId": "1234",
      "message": "Job created successfully!"
    }
  } catch (error) {
    throw error;
  }
}