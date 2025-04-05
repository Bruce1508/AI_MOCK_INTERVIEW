import { ReactNode } from 'react'
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { headers } from 'next/headers';

const AuthLayout = async ({children}: {children: ReactNode}) => {

    try {
        const isUserAuthenticated = await isAuthenticated();
        if (isUserAuthenticated) redirect("/")
    } catch (error) {
        console.error("Error: ", error)
    }

    return (
        <div className='auth-layout'>{children}</div>
    )
}

export default AuthLayout