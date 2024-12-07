import { get } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";

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
    //   ...response.body.json(),
    // };
    // } else {
    //   throw new Error(response.body.json().toString());
    // }


    return {
      "jobId": "1234",
      "message": "Job created successfully!"
    }
  } catch (error) {
    throw error;
  }
}

export type JobEntry = {
  jobId: string,
  status: string,
  startTime: string,
  endTime: string,
  frequencyMinutes: number,
}

export type GetUserJobsResponse = {
  jobs: JobEntry[]
}

export async function GetUserJobs(): Promise<GetUserJobsResponse> {
  return {
    jobs: [
      {
        jobId: "1234",
        status: "Pending",
        startTime: Date.now().toString(),
        endTime: Date.now().toString(),
        frequencyMinutes: 5,
      }
    ]
  }
  // try {
  //   const response = await get({
  //     apiName: "SpeedbandsAPI",
  //     path: "/jobs/get",
  //   }).response;

  //   if (response.statusCode == 200) {
  //     const jobs = await response.body.json();
  //     return jobs as GetUserJobsResponse;
  //   } else {
  //     throw new Error(response.body.json().toString());
  //   }
  // } catch (error) {
  //   throw error;
  // }
}