'use server';
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email, password } = params;

    try {
        //Check if user exists in database
        const userRecord = await db.collection('user').doc(uid).get();

        if (userRecord.exists)
            return {
                success: false, //since we cannot create a new user
                message: "User already exists. Please sign in.",
            };

        //if user doesn't exist
        await db.collection('user').doc(uid).set({
            name,
            email
        })

        return {
            success: true,
            messange: 'Account created successfully. Please sign in'
        }

        return {
            success: true,
            message: "Account created successfully. Please sign in."
        }
    } catch (error: any) {
        console.error("Error creating a user", error);

        if (error.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: "This email is already in use",
            }
        }

        return {
            success: false,
            message: "Failed to create account. Please try again."
        }
    }
}

export async function setSessionCookies(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION
    })
    cookieStore.set('session', sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
        sameSite: "lax",
    })
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                messaeg: 'User does not exist. Create an account'
            }
            await setSessionCookies(idToken)
        }

    } catch (error) {
        console.error("Error when sign in", error);
        return {
            success: false,
            message: "Fail to log into account. Please try again. "
        }
    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies(); //sử dụng API cookies() để lấy cookies
    //tìm cookie có tên 'session' và lây giá trị của nó
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) return null; //nếu ngời dùng chưa đăng nhập - ko có cookie session 
    try {
        //sử dụng FireBase Auth xác thực tính hợp lệ của cookie
        //Tham số true kiểm tra cookie có hết hạn chưa
        //decodedClaims chứa thông tin được giải mã từ JWT token gồm uid
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        //truy vấn thông itn từ FireStore
        const userRecord = await db //db = getFireStore()
            .collection('users')
            .doc(decodedClaims.uid)
            //trả về một DocumentSnapShot, trong đó có phương thức data()
            .get();

        // tránh trường hợp token hợp lệ nhưng người dùng bị xóa khỏi db
        if (!userRecord.exists) return null;

        return {
            //trả về một object chứa các trường của 'users'
            // ... tạo ra một object mới trên chính object cũ
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (error) {
        console.error("Error", error);
        return null
    }
}

// Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}