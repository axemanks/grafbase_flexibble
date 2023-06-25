import Image from 'next/image'
import Link from 'next/link'
import { NavLinks } from '@/constants'
import AuthProviders from './AuthProviders'


type Props = {}

export default function Navbar({}: Props) {
    const session = {}; // setting a blank object for the session information
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
            {session ? (
                // if logged in show
                <>
                UserPhoto

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