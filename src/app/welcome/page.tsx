import type { Metadata } from 'next'
import WelcomeClient from './WelcomeClient'

export const metadata: Metadata = {
  title: 'Welcome to ArtByME artOS',
  description: 'Your brand new art management and operating system.',
}

export default function WelcomePage() {
  return <WelcomeClient />
}
