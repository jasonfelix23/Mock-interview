"use client";
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const page = ({ params }) => {
    const [feedbackList, setFeedbackList] = useState([]);

    const router = useRouter();
    useEffect(() => {
        getFeedback();
    })

    const getFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.InterviewId))
            .orderBy(UserAnswer.id);

        // console.log(result);
        setFeedbackList(result);
    }

    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold text-green-500">Congragulations!!</h2>
            <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
            <h2 className="text-indigo-400 text-lg my-3">
                Your overall interview Rating: <strong>7/10</strong>
            </h2>

            <h2 className="text-sm text-gray-500">
                Find below interview question with correct answer,your answer and
                feedback for improvement
            </h2>
            {feedbackList &&
                feedbackList.map((item, index) => (
                    <Collapsible key={index} className='mt-7' >
                        <CollapsibleTrigger className="p-2 bg-gray-100 rounded-lg my-2 text-left flex justify-between gap-7">
                            {item.question} <ChevronsUpDown className="h-5 w-5" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="flex flex-col gap-2">
                                <h2 className="text-red-500 p-2 border rounded-lg">
                                    <strong>Rating:</strong>
                                    {item.rating}
                                </h2>
                                <h2 className="bg-red-50 p-2 border rounded-lg text-sm text-red-900">
                                    <strong>Your Answer:</strong>
                                    {item.userAns}
                                </h2>
                                <h2 className="bg-green-50 p-2 border rounded-lg text-sm text-green-900">
                                    <strong>Correct Answer:</strong>
                                    {item?.correctAns}
                                </h2>
                                <h2 className="bg-blue-50 p-2 border rounded-lg text-sm text-blue-900">
                                    <strong>Feedback:</strong>
                                    {item.feedback}
                                </h2>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}

            <Button onClick={() => router.replace('/dashboard')} >Go Home</Button>
        </div>
    )
}

export default page