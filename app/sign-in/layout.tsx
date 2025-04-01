import { ReactNode } from 'react'

const SignInLayout = ({children}: {children: ReactNode}) => {
    return (
        <div className="auth-layout">
            {children}
        </div>
    )
}

export default SignInLayout
