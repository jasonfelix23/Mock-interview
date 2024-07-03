"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionSection from './_components/QuestionSection';
import RecordAnswer from './_components/RecordAnswer';
import { LoaderCircle } from 'lucide-react';

const StartInterview = ({ params }) => {
    const [interviewData, setInterviewData] = useState();
    const [MockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        console.log(params.InterviewId)
        getInterviewDetails();
    }, []);


    const getInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.InterviewId));
        console.log(result[0].jsonMockResp);

        const jsonMockResp = await JSON.parse(result[0].jsonMockResp);
        console.log(
            "🚀 ~ file: page.jsx:18 ~ GetInterviewDetails ~ jsonMockResp:",
            jsonMockResp
        );
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
    };
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            {MockInterviewQuestion ? <QuestionSection MockInterviewQuestion={MockInterviewQuestion}
                activeIndex={activeIndex} setActiveIndex={setActiveIndex}
            />
                :
                <LoaderCircle className='animate-spin' />}
            {MockInterviewQuestion ?
                <RecordAnswer
                    MockInterviewQuestion={MockInterviewQuestion}
                    activeIndex={activeIndex}
                />
                :
                <LoaderCircle className='animate-spin' />}

        </div>
    )
}

export default StartInterview