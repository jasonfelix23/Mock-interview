"use client"
import React, { useEffect, useState } from 'react'
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Interview = ({ params }) => {
    const [interviewData, setInterviewData] = useState();
    const [webCamEnable, setWebCamEnable] = useState(false);
    useEffect(() => {
        getInterviewDetails();
    }, [])

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.InterviewId));

        setInterviewData(result[0]);
    }
    return (
        <div className='my-10 '>
            <h2 className='font-bold text-2xl'>Let' Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-10'>
                {interviewData && <div className='flex flex-col gap-2 my-2 '>
                    <div className='p-5 rounded-lg border gap-5'>
                        <h2><strong>Job Postion: </strong>{interviewData.jobPosition}</h2>
                        <h2><strong>Job Description: </strong>{interviewData.jobDesc}</h2>
                        <h2><strong>YOE: </strong>{interviewData.jobExperienc}</h2>
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-600'>
                            <Lightbulb /><strong>Information</strong> </h2>
                        <h2>
                            Enable your webcam and microphone to begin your AI-generated mock interview. The session comprises 5 questions, after which you will receive a detailed report based on your responses.
                            <br />
                            <strong>Note:</strong> Your video is never recorded. You can disable webcam access at any time.
                        </h2>
                    </div>
                </div>}
                <div>
                    {webCamEnable ? <Webcam
                        onUserMedia={() => setWebCamEnable(true)}
                        onUserMediaError={() => setWebCamEnable(false)}
                        mirrored={true}
                        style={{
                            width: 300,
                            height: 300
                        }}
                    />
                        :
                        <div className='flex flex-col gap-2'>
                            <WebcamIcon className='h-72 w-72 md:h-96 md:w-96 p-20 bg-secondary rounded-lg border' />
                            <Button className="w-72 md:w-96" variant="outline" onClick={() => setWebCamEnable(true)}>Enable web cam and microphone</Button>
                        </div>
                    }

                </div>

            </div>
            <div className='flex justify-center items-center mt-12'>
                <Link href={'/dashboard/interview/' + params.InterviewId + "/start"}>
                    <Button className="p-10 rounded-xl text-xl">Start Interview</Button>

                </Link>
            </div>
        </div>
    )
}

export default Interview