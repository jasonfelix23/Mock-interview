"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionSection from './_components/QuestionSection';
import RecordAnswer from './_components/RecordAnswer';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = ({ params }) => {
    const [interviewData, setInterviewData] = useState();
    const [MockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        getInterviewDetails();
    }, []);


    const getInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, params.InterviewId));

        const jsonMockResp = await JSON.parse(result[0].jsonMockResp);

        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
    };
    return (
        <div>
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
                        interviewData={interviewData}
                    />
                    :
                    <LoaderCircle className='animate-spin' />}
            </div>
            <div className="flex justify-end gap-6" >
                {activeIndex > 0 && <Button onClick={() => setActiveIndex(activeIndex - 1)}>Previous Question</Button>}
                {activeIndex != MockInterviewQuestion?.length - 1 &&
                    <Button onClick={() => setActiveIndex(activeIndex + 1)} >Next Question</Button>
                }
                {activeIndex == MockInterviewQuestion?.length - 1 &&
                    <Link href={'/dashboard/interview/' + interviewData?.mockId + '/feedback'} >
                        <Button>End Interview</Button>
                    </Link>
                }

            </div>
        </div>
    )
}

export default StartInterview