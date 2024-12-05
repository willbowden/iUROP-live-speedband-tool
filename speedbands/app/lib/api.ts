import { post, get } from "aws-amplify/api";
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

type JobEntry = {
  jobId: string,
  userId: string,
  status?: string,
  startTime?: string,
  endTime?: string,
  frequencyMinutes?: number,
  speedbands?: SpeedbandType[],
}

type GetUserJobsResponse = {
  jobs: JobEntry[]
}

export async function GetUserJobs(): Promise<GetUserJobsResponse> {
  const authSession = await fetchAuthSession();

  console.log(authSession.tokens?.idToken);

  try {
    const response = await get({
      apiName: "SpeedbandsAPI",
      options: {
        headers: {
          Authorization: `Bearer ${authSession.tokens?.idToken}`,
        }
      },
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