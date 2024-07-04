"use client";
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import Image from 'next/image'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { db } from "@/utils/db";
import moment from 'moment'
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text'
import { chatSession, generateFeedback } from '@/utils/GeminiAiModel';
import { UserAnswer } from '@/utils/schema';

const RecordAnswer = ({ MockInterviewQuestion, activeIndex, interviewData }) => {

    const [userAnswer, setUserAnswer] = useState("");
    const [loading, setLoading] = useState();

    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });
    const { user } = useUser;
    if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

    useEffect(() => {
        const newTranscript = results.map((result) => result.transcript).join(" ");
        setUserAnswer(newTranscript);
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            updateUserAnswer()
        }
    }, [isRecording, userAnswer])

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const updateUserAnswer = async () => {
        setLoading(true);
        console.log("Wait for feedback");
        const question = MockInterviewQuestion[activeIndex].question;
        const correctAnswer = MockInterviewQuestion[activeIndex].answer;
        const feedback = await generateFeedback(question, userAnswer);
        const resp = await db.insert(UserAnswer).values({
            mockIdRef: interviewData?.mockId,
            question: question,
            correctAns: correctAnswer,
            userAns: userAnswer,
            feedback: feedback.feedback,
            rating: feedback.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-yyyy"),
        });

        if (resp) {
            toast("User Answer recorded successfully!!");
            setUserAnswer("");
            setResults([])
        }
        setResults([]);
        setLoading(false);
    }


    return (
        <div className='flex justify-center items-center flex-col'>
            <div className='flex flex-col my-10 justify-center items-center bg-gray-100 rounded-lg p-5'>
                <Image
                    src='/webcam.svg'
                    width={200}
                    height={200}
                    className='absolute'
                    alt='webcam'
                    priority
                />
                <Webcam
                    style={{ height: 300, width: "100%", zIndex: 10 }}
                    mirrored={true}
                />
            </div>
            <Button

                variant="outline"
                className="my-1"
                onClick={StartStopRecording}
                disabled={loading}
            >
                {isRecording ? (
                    <h2 className="text-red-600 items-center animate-pulse flex gap-2 my-1">
                        <StopCircle /> Stop Recording...
                    </h2>
                ) : (
                    <h2 className="text-indigo-600 flex gap-2 items-center my-1">
                        <Mic /> Record Answer
                    </h2>
                )}
            </Button>
        </div>
    )
}


export default RecordAnswer;