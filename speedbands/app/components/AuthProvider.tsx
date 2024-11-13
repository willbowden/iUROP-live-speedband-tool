"use client"

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from 'aws-amplify';
import config from '@/aws-exports';

Amplify.configure(config);

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