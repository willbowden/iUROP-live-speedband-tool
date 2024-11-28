# Live Speedband Tool <!-- omit from toc -->

- [AWS Setup Instructions](#aws-setup-instructions)
- [1. Installing AWS CLI](#1-installing-aws-cli)
- [2. Setting Up VPC](#2-setting-up-vpc)
  - [Creating Subnets](#creating-subnets)
  - [Create a NAT Gateway](#create-a-nat-gateway)
  - [Creating Route Tables](#creating-route-tables)
  - [Assigning Subnets to Route Tables](#assigning-subnets-to-route-tables)
- [3. Setting up AWS Amplify](#3-setting-up-aws-amplify)
- [4. Install the AWS SAM CLI](#4-install-the-aws-sam-cli)
- [5. Update the SAM YAML](#5-update-the-sam-yaml)
  - [Finding IDs](#finding-ids)
  - [Ammending the YAML](#ammending-the-yaml)
  - [Deploying the resources](#deploying-the-resources)


# AWS Setup Instructions

These instructions assume you already have the following:

1. An AWS account created in your desired region.
2. Are starting from a fresh AWS account with no existing changes.

# 1. Installing AWS CLI

1. Follow [these instructions](https://docs.amplify.aws/gen1/react/start/getting-started/installation/) to setup the Amplify CLI. This will also walk you through creating an access key. **Make sure you save your access key locally, as it will be used below.**
2. After you've created an amplify-dev IAM user, add the `AdministratorAccess` permission to them, so you can deploy the cloud resources using SAM. 
   > **Note**: `AdministratorAccess` is an all-encompassing policy that will allow you every permission. It is very unsecure to use this, so I highly reccommend you either add specific necessary policies, use user groups, or remove the `AdministratorAccess` policy once you've finished following these instructions.
3. Follow [these instructions](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to install the AWS CLI.
4. When complete, run `aws configure`
   1. Enter the access key and secret that you obtained in step 1
   2. Choose your region name (e.g 'ap-southeast-1`)
   3. Set output format to 'json'
5. Test your configuration by running `aws sts get-caller-identity`
   1. Your account information should be returned:
    ```json
    {
      "UserId": "AIDAxxxxxxxxxxxxx",
      "Account": "123456789012",
      "Arn": "arn:aws:iam::123456789012:user/YourUserName"
    }
    ```

# 2. Setting Up VPC

In order for the Lambda functions to be able to talk to both DynamoDB and the internet, you need to set up some subnets, route tables and a NAT gateway in the VPC.

## Creating Subnets

1. On the AWS dashboard, navigate to VPC
2. Navigate to "Subnets"
3. Click "Create subnet"
4. Under "VPC ID", select the only option which should be your default VPC
5. Set subnet name to `lambda-subnet-point-to-nat-1`
6. If "IPv4 VPC CIDR block" is `X.X.0.0/16` for example, set "IPv4 subnet CIDR block" to `X.X.64.0/20`
7. Leave other settings at default
8. At the bottom, click "Add new subnet"
9. Repeat steps 5 to 8 until you have three subnets, `lambda-subnet-point-to-nat-[1/2/3]` with subnet CIDR blocks `X.X.[64/80/96].0/20`
10. Add one more subnet, named `lambda-subnet-point-to-igw` (igw = internet gateway)
11. Set its CIDR block to `X.X.112.0/20`

## Create a NAT Gateway

1. On the AWS dashboard, navigate to VPC
2. Navigate to "NAT Gateways"
3. Click "Create NAT gateway"
4. Under "Subnet", select `lambda-subnet-point-to-igw`
5. Click "Allocate Elastic IP"
6. Click "Create NAT gateway"

## Creating Route Tables

1. On the AWS dashboard, navigate to VPC
2. Navigate to "Route Tables"
3. Click "Create route table"
4. Name it `lambda-rt-to-nat`
5. Under "VPC ID", select your default VPC
6. Click "Create table"
7. On the "Routes" table, click "Edit routes"
8. Click "Add route"
9. Under "Destination" select "0.0.0.0/0"
10. Under "Target" select "NAT Gateway" and then select the gateway you created above (`nat-xxxxxxx`)
11. Click "Save changes"
12. Repeat steps 3 to 11, creating a second table named `lambda-rt-to-igw`,  assigning the new route's target to "Internet Gateway", and selecting the only available (default) option (`igw-xxxxxxx`)

## Assigning Subnets to Route Tables

1. On the AWS dashboard, navigate to VPC
2. Navigate to "Subnets"
3. Select `lambda-subnet-point-to-nat-1`
4. Click "Actions"
5. Click "Edit route table association"
6. Under "Route Table ID", select "lambda-rt-to-nat"
7. Click "Save"
8. Repeat steps 3 to 7 for `lambda-subnet-point-to-nat-` 2 and 3.

# 3. Setting up AWS Amplify

AWS Amplify is used to provide user authentication for the frontend. Below are the instructions to configure it.

1. Under `/speedbands` in this repo, delete the `amplify` folder. We will create a new Amplify setup configured to you.
2. In the `/speedbands` directory, run `amplify init` and use the following options:
   1. **Name**: Enter a name for the project
   2. **Environment**: Name your environment (e.g., dev)
   3. **Default editor**: Choose your code editor
   4. **App type**: Select JavaScript
   5. **Framework**: Choose Next.js
   6. **Source and build settings**: Use the defaults
   7. **Hosting**: Skip this
3. Run `amplify add auth`
   1. Select the options to sign in with Cognito and email/password
   2. You may use other authentication options if you desire, but you would need to change the frontend to accomodate it.
4. Run `amplify push` which will build the necessary resources for auth in the cloud.

# 4. Install the AWS SAM CLI

Follow [these instructions](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) to install the CLI on your machine.

# 5. Update the SAM YAML

The `template.yaml` file in this repo under `/backend` will allow you to deploy the necessary infrastructure to AWS with a few commands using AWS' Serverless Application Model. In order to configure it to work with your AWS account, however, we need to update a few fields.

## Finding IDs

1. On the AWS dashboard, navigate to VPC
2. Navigate to "Subnets"
3. Copy and save the Subnet IDs for `lambda-subnet-point-to-nat-`1, 2 and 3.
4. Navigate to Security groups
5. Copy and save the Security group ID for your default (only) security group.

## Ammending the YAML

1. Open `template.yaml`
2. Under `JobSchedulerLambda`, `JobCheckerLambda` and `DataCollectionLambda`, replace the existing `SubnetIds` with the three you saved above, and replace the `SecurityGroupIds` with the one you saved above.


## Deploying the resources

First, ensure you have the same version of Python (3.10 at time of writing) as in the YAML file installed on your machine and in your PATH. The version can be seen after `Runtime:` in the Lambda function definitions.

If it's your first time doing this step, run:
```bash
sam build
sam deploy --guided
```

If you've already built but for whatever reason need to do it again, run the following command if the DynamoDB table `DataCollectionJobs` already exists:

```bash
sam build
sam deploy --parameter-overrides TableAlreadyExists=true ResultsBucketAlreadyExists=true
```

This is because the DynamoDB table and S3 bucket have `DeletionPolicy` set to `Retain` which means they aren't deleted in the event of a failure or re-deploy. This is so we don't lose the data inside them.

If, for whatever reason, deployment fails, you will need to manually navigate to the AWS CloudFormation dashboard and delete the stack which is in state `ROLLBACK_COMPLETED` before you can deploy another stack with the same name.