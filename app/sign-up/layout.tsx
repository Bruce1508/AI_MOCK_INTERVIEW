import { ReactNode } from 'react'

const SignUpLayout = ({children}: {children: ReactNode}) => {
    return (
        <div className="auth-layout">
            {children}
        </div>
    )
}

export default SignUpLayout
