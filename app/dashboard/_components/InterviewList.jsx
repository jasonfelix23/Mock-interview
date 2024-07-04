"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import InterviewItemCard from './InterviewItemCard';


const InterviewList = () => {
    const { user } = useUser();
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
                .orderBy(MockInterview.createdAt, "desc");

            setInterviews(result);
        } catch (error) {
            console.error("Error fetching interview list:", error);
        }
    };

    return (
        <div className='ml-2'>
            <h2 className='font-medium text-xl mt-4 mb-2'>Previous Mock Interview</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {interviews.length > 0 ? (
                    interviews.map((interview, index) => (
                        <InterviewItemCard key={index} interview={interview} />
                    ))
                ) : (
                    <p>No interviews found.</p>
                )}
            </div>
        </div>
    );
};

export default InterviewList;