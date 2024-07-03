"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label";
import { generateQuestionsGemini, generateInputPrompt } from './../../../utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';


const AddNewInterview = () => {
    const [openDialogue, setOpenDialogue] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExp, setjobExp] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const router = useRouter();

    const { user } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(jobPosition, jobDesc, jobExp);
        const inputPrompt = generateInputPrompt(jobPosition, jobExp, jobDesc, 5);
        try {
            const response = await generateQuestionsGemini(inputPrompt, false);
            console.log(response);
            if (Array.isArray(response)) {
                console.log(JSON.stringify(response));
                setJsonResponse(response);

                // Convert the response to a JSON string
                const jsonStringResponse = JSON.stringify(response);

                const resp = await db.insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        jsonMockResp: jsonStringResponse, // Store the stringified JSON
                        jobDesc: jobDesc,
                        jobExperience: jobExp,
                        jobPosition: jobPosition,
                        createdBy: user?.primaryEmailAddress.emailAddress,
                        createdAt: moment().format('DD-MM-yyyy')
                    }).returning({ mockId: MockInterview.mockId });
                if (resp) {
                    setOpenDialogue(false);
                    router.push("/dashboard/interview/" + resp[0]?.mockId);
                }
                console.log("Inserted id: " + resp);
            } else {
                console.error("The response is not an array");
            }
        } catch (error) {
            console.error('Error generating questions:', error);
        }
        setLoading(false);
    }
    return (
        <div className='flex '>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all'
                onClick={() => setOpenDialogue(true)}>
                <h2 className='font-semibold text-lg text-center'>+ Add New</h2>
            </div>
            <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
                <DialogContent>
                    <DialogHeader >
                        <DialogTitle >
                            <div className='flex flex-col gap-1'>
                                <h2 className='text-[20px]'>Tell us more about Job you are interviewing</h2>
                                <p className='text-sm text-gray-400 font-thin'>Add details about job position, Your skills and Year of experience</p>
                            </div>
                        </DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit}>
                                <div className='flex flex-col gap-3 mt-2'>
                                    <div className='w-full'>
                                        <Label htmlFor="Position">Job Position</Label>
                                        <Input id="position" placeholder="Software Engineer" required
                                            onChange={(e) => setJobPosition(e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Label htmlFor="Description">Job Description</Label>
                                        <Textarea id="position" placeholder="Skills: [React, Angular, Spring, Spring boot, Java]" required
                                            onChange={(e) => setJobDesc(e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Label htmlFor="Description">Years of experience</Label>
                                        <Input id="position" placeholder="1" type="number" max="50" required
                                            onChange={(e) => setjobExp(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end mt-4'>
                                    <Button variant="ghost" onClick={() => setOpenDialogue(false)} >Cancel</Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ?
                                            <><LoaderCircle className='animate-spin' /> Generating From AI</>
                                            : 'Start Interview'}
                                    </Button>

                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview;