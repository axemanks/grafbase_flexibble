import Image from 'next/image'
import Link from 'next/link'
import { NavLinks } from '@/constants'
import AuthProviders from './AuthProviders'
import { getCurrentUser } from '@/lib/session'
import { signOut } from 'next-auth/react'
import ProfileMenu from './ProfileMenu'


type Props = {}

export default async function Navbar({}: Props) {
    // on load, get the current user
    const session = await getCurrentUser();
    // testing - log the session info for user
    //console.log("Session info from navbar:",session);

  return (
    <nav className='flexBetween navbar'>
        <div className='flex-1 flex-start gap-10'>
            <Link href="/" />
            <Image src='/logo.svg' width={115} height={43} alt='Flexibble' />
            <ul className='xl:flex hidden text-small gap-7'>
                {NavLinks.map((link, index) => (
                    <Link href={link.href} key={link.key}>{link.text}</Link>
                ))}
            </ul>
        </div>
        <div className='flexCenter gap-4'>
            {session?.user ? (
                // if logged in show
                <>
                <ProfileMenu session={session} />

                
                <Link href="/create-project">Share your work</Link>
                
                
                </>
            ) : (
                // if not logged in show Auth
                <AuthProviders />
            )}


        </div>
    </nav>
  )
}