import '../style/globals.scss'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthUserProvider } from '../../context/AuthUserContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Committee App',
  description: 'Generated by committee app',
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthUserProvider>
          {children}
        </AuthUserProvider>
      </body>
    </html>
  )
}

export default RootLayout
