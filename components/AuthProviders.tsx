"use client"

import {useState, useEffect} from 'react'
import { getProviders, signIn  } from 'next-auth/react'
import Button from './Button';
// types from next-auth
// https://next-auth.js.org/getting-started/typescript
type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
  signinUrlParams?: Record<string, string> | undefined;
};

type Providers = Record<string, Provider>;


const AuthProviders = () => {
  const [providers, setProviders] = useState<Providers | null>(null);

  // fetch providers from next-auth
  useEffect(() => {
      const fetchProviders = async () => {
          const res = await getProviders(); // fron next-auth
          // test
          console.log(res);
        // set providers
          setProviders(res);
      }

      fetchProviders();
  }, []);

  if (providers) {
      return (
          <div>
              {Object.values(providers).map((provider: Provider, index) => (
                  <Button 
                  key={index} 
                  title="Sign In"
                  handleClick={() => signIn(provider?.id)}
                 />
              ))}
          </div>
      )
  }
}

export default AuthProviders