# Live Speedband Tool

# AWS Setup Instructions

These instructions assume you already have the following:

1. An AWS account created in your desired region.
2. Are starting from a fresh AWS account with no existing changes.

# 1. Setting Up VPC

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

# 2. Setting up AWS Amplify

AWS Amplify is used to provide user authentication for the frontend. Below are the instructions to configure it.

## Setting up the CLI

1. Follow [these instructions](https://docs.amplify.aws/gen1/react/start/getting-started/installation/) to setup the Amplify CLI.

## Setting up Amplify

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

# 3. Update the SAM YAML

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

Run:
```bash
sam build
sam deploy --guided
```