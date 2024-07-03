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

const RecordAnswer = ({ MockInterviewQuestion, activeIndex }) => {

    const [userAnswer, setUserAnswer] = useState();

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });
    const { user } = useUser;
    if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

    useEffect(() => {
        results.map((result) => {
            setUserAnswer(result.transcript)
        })
    }, [results]);

    const saveUserAnswer = async () => {
        if (isRecording) {
            stopSpeechToText();
            if (userAnswer?.length < 10) {
                toast("Error while saving your answer! Try again");
                return;
            }
            console.log("Wait for feedback");
            const feedback = await generateFeedback(MockInterviewQuestion[activeIndex].question, userAnswer);
            console.log(feedback);
        } else {
            startSpeechToText();
        }
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
                onClick={saveUserAnswer}
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
            {/* <textarea
                className="w-full p-2 border rounded"
                rows="5"
                placeholder="Speak or type your answer here..."
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={loading}
            ></textarea> */}
            <Button
                variant="outline"
                className="my-1"
                onClick={() => console.log(userAnswer)}
            >
                Submit Answer
            </Button>
        </div>
    )
}


export default RecordAnswer;