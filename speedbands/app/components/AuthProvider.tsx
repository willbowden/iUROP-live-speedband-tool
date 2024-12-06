"use client"

import awsconfig from '@/aws-exports';
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from 'aws-amplify';
Amplify.configure(awsconfig);

const existingConfig = Amplify.getConfig();

Amplify.configure({
  ...existingConfig,
  API: {
    REST: {
      "SpeedbandsAPI": {
        endpoint: "https://6wxwuljuz3.execute-api.ap-southeast-1.amazonaws.com/default",
        region: "ap-southeast-1"
      },
    }
  },
});

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Authenticator
      loginMechanism="email">
      {children}
    </Authenticator>
  )
}