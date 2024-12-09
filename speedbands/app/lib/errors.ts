type CustomError = {
  name: string,
  message: string,
}

const JobNotFoundError: CustomError = {
  name: "Job Not Found",
  message: "Job with that ID could not be found."
}

export {
  JobNotFoundError,
}