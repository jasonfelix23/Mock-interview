const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const sampleResponse = JSON.stringify([
    {
        question: "What experience do you have with React?",
        answer: "I have 3 years of experience working with React, developing various web applications and components."
    },
    {
        question: "How do you handle state management in a React application?",
        answer: "I use state management libraries like Redux or Context API depending on the complexity and requirements of the application."
    }
]);

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
});

export const generateQuestionsGemini = async (inputPrompt, develop) => {
    if (!inputPrompt) {
        return "No input string provided";
    }

    if (develop) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
            return JSON.parse(sampleResponse);
        } catch (error) {
            console.error('Error parsing sample response:', error);
            return "Error parsing sample response";
        }
    }

    try {
        const result = await model.generateContent(inputPrompt);
        const response = await result.response.text();
        const cleanedResponse = response.replace('```json', '').replace('```', '').trim();

        try {
            const parsedResponse = JSON.parse(cleanedResponse);

            if (Array.isArray(parsedResponse)) {
                return parsedResponse;
            } else {
                throw new Error('Response is not an array');
            }
        } catch (error) {
            console.error('Error parsing AI response:', error, 'Original response:', cleanedResponse);
            return "Error parsing AI response";
        }
    } catch (error) {
        console.error('Error generating content:', error);
        return "Error generating content";
    }
};

export const generateInputPrompt = (position, exp, desc, question_count) => {
    return `
        You are an AI trained to generate interview questions. Based on the following job details, generate ${question_count} interview questions along with their respective answers. The output should be in JSON format with the fields "question" and "answer".

        Job Position: ${position}
        Years of Experience Required: ${exp}
        Job Description: ${desc}
        Each question and answer should be in the following format:
            {
                "question": "Your question here",
                "answer": "Your answer here"
            }
    `;
};


export const generateFeedback = async (question, userAnswer) => {
    const feedbackPrompt = `Question: ${question}, User Answer: ${userAnswer}; Depends on question and user answer for given interview Question, please give us rating for answer out of 10 and feedback as area of improvement if any adjust in 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

    try {
        const result = await chatSession.sendMessage(feedbackPrompt);
        const response = await result.response.text();
        const cleanedResponse = response.replace('```json', '').replace('```', '').trim();

        try {
            const parsedResponse = JSON.parse(cleanedResponse);
            return parsedResponse;
        } catch (error) {
            console.error('Error parsing feedback response:', error, 'Original response:', cleanedResponse);
            return "Error parsing feedback response";
        }
    } catch (error) {
        console.error('Error generating feedback:', error);
        return "Error generating feedback";
    }
};