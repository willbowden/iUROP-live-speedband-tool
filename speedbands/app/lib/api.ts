import * as Errors from "@/lib/errors";
import { get, post } from "aws-amplify/api";

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
    const response = await post({
      apiName: "SpeedbandsAPI",
      path: "/jobs/create",
      options: {
        body: data,
      }
    }).response;

    if (response.statusCode == 200) {
      const resp = await response.body.json();
      return resp as JobCreationResponse;
    } else {
      throw new Error(response.body.json().toString());
    }
  } catch (error) {
    throw error;
  }
}

export type JobEntry = {
  jobId: string,
  status: string,
  startTime: number,
  endTime: number,
  frequencyMinutes: number,
  reason?: string,
  url?: string
}

export type GetUserJobsResponse = {
  jobs: JobEntry[]
}

export async function GetUserJobs(): Promise<GetUserJobsResponse> {
  try {
    const response = await get({
      apiName: "SpeedbandsAPI",
      path: "/jobs/get",
    }).response;

    if (response.statusCode == 200) {
      const jobs = await response.body.json();
      return jobs as GetUserJobsResponse;
    } else {
      throw new Error(response.body.json().toString());
    }
  } catch (error) {
    throw error;
  }
}

type CheckJobResponse = JobEntry

export async function CheckJob(jobId: string): Promise<CheckJobResponse> {
  const data = {
    jobId: jobId,
  };

  try {
    const response = await post({
      apiName: "SpeedbandsAPI",
      options: {
        body: data
      },
      path: "/jobs/check",
    }).response;

    if (response.statusCode == 200) {
      const job = await response.body.json();
      return job as JobEntry;
    } else {
      throw new Error(response.body.json().toString());
    }
  } catch (error) {
    // @ts-expect-error
    if (error.response.statusCode == 404) {
      throw Errors.JobNotFoundError;
    } else {
      console.log(error);
      throw error;
    }
  }
}