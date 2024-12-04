"use client"

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from 'aws-amplify';
import awsconfig from '@/aws-exports';
Amplify.configure(awsconfig);

const existingConfig = Amplify.getConfig();

Amplify.configure({
  ...existingConfig,
  API: {
    REST: {
      "SpeedbandsAPI": {
        endpoint: "https://xbaa692z24.execute-api.ap-southeast-1.amazonaws.com/Stage",
        region: "ap-southeast-1"
      }
    }
  }
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