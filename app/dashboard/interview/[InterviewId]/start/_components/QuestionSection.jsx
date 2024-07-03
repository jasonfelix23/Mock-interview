import React from 'react';
import { Lightbulb, Volume2 } from 'lucide-react';

const QuestionSection = ({ MockInterviewQuestion, activeIndex, setActiveIndex }) => {

    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Sorry, Your browser does not support text to speech support.')
        }
    }
    return MockInterviewQuestion && (
        <div className='my-10 p-5 border rounded-lg flex flex-col gap-3'>
            <div className='flex flex-wrap gap-2'>
                {MockInterviewQuestion.map((question, idx) => (
                    <h2 className={`p-2 border rounded-full bg-gray-100 cursor-pointer 
                        ${activeIndex == idx ? "bg-indigo-600 text-white" : ""}`}
                        key={idx}
                        onClick={() => setActiveIndex(idx)}>
                        Question {idx + 1}</h2>
                ))}
            </div>
            <div className='mb-6'>
                <p>{MockInterviewQuestion[activeIndex].question}</p>
                <Volume2 onClick={() => textToSpeech(MockInterviewQuestion[activeIndex].question)} />
            </div>
            <div className='p-5 border rounded-lg border-indigo-300 bg-indigo-100'>
                <h2 className='flex gap-2 items-center text-indigo-600'>
                    <Lightbulb /><strong>Information</strong> </h2>
                <h2>
                    Enable your webcam and microphone to begin your AI-generated mock interview. The session comprises 5 questions, after which you will receive a detailed report based on your responses.
                    <br />
                    <strong>Note:</strong> Your video is never recorded. You can disable webcam access at any time.
                </h2>
            </div>
        </div>
    )
}

export default QuestionSection;