//đây là một API endpoint, cụ thể là API để tạo câu hỏi phỏng vấn bằng AI

import {generateText} from 'ai';
import {google} from "@ai-sdk/google";
import { getRandomInterviewCover } from '@/lib/utils';
import { db } from '@/firebase/admin';

//một endpoint API để text API có hoạt động ok không
export async function GET() {
    return Response.json({
        sucess: true,
        data: 'THANK YOU'
    }, {
        status:200
    })
} 

//POST: NHẬN DỮ LIỆU TỪ NGƯỜI DÙNG
export async function POST(request: Request) {
    const {type, role, level,techstack, amount, userid, coverimage} = await request.json();

    try {
        //hàm tạo văn bản bằng AI
        const {text: question} = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]
            
            Thank you! <3
        `,
        });
        const interview = ({
            role, type, level, amount,
            techstack: techstack.split(',').map((item: any)=> item.trim()),
            question: JSON.parse(question),
            userid: userid,
            finalized: true,
            coverimage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        });

        await db.collection('interview').add(interview);

        return Response.json({
            success: true,
        }, {
            status: 200
        })

    } catch (error) {
        console.error("Error: ", error)
        return Response.json({
            success: false,
            error: error
        }, {
            status: 500
        })
    }
}