import './globals.css'
import ClientProviders from '../components/ClientProviders'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Hashprize',
  description: 'Pool staking rewards with others for a chance to win!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <header>
            <NavBar />
          </header>
          <div style={{ flex: 1, padding: '24px' }}>
            {children}
          </div>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  )
}
