// supabase/functions/random-events/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

// Define types for events
interface TriviaQuestion {
    id: number;
    type: 'trivia';
    name: string;
    description: string;
    points: number;
    timeLimit: number;
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
    category: string;
}

// All trivia questions stored here
const TRIVIA_QUESTIONS: TriviaQuestion[] = [
    // Academic Category
    {
        id: 1,
        type: 'trivia',
        name: 'Rotunda History',
        description: 'Test your knowledge about the Rotunda!',
        points: 50,
        timeLimit: 2,
        question: "How many columns are on the front of the Rotunda?",
        correctAnswer: "6",
        wrongAnswers: ["4", "8", "10"],
        category: "Academic"
    },
    {
        id: 2,
        type: 'trivia',
        name: 'UVA History',
        description: 'How well do you know UVA?',
        points: 40,
        timeLimit: 2,
        question: "What year was UVA founded?",
        correctAnswer: "1819",
        wrongAnswers: ["1776", "1801", "1826"],
        category: "Academic"
    },
    
    // Athletic Category
    {
        id: 3,
        type: 'trivia',
        name: 'JPJ Facts',
        description: 'Test your JPJ Arena knowledge!',
        points: 35,
        timeLimit: 2,
        question: "What is the capacity of John Paul Jones Arena?",
        correctAnswer: "14,593",
        wrongAnswers: ["12,500", "16,000", "18,000"],
        category: "Athletic"
    },
    {
        id: 4,
        type: 'trivia',
        name: 'Sports History',
        description: 'UVA Sports History Quiz',
        points: 45,
        timeLimit: 2,
        question: "What year did JPJ Arena open?",
        correctAnswer: "2006",
        wrongAnswers: ["2004", "2008", "2010"],
        category: "Athletic"
    },

    // Library Category
    {
        id: 5,
        type: 'trivia',
        name: 'Library Knowledge',
        description: 'Test your library knowledge!',
        points: 30,
        timeLimit: 2,
        question: "How many floors are in Shannon Library?",
        correctAnswer: "4",
        wrongAnswers: ["3", "5", "6"],
        category: "Library"
    },
    {
        id: 6,
        type: 'trivia',
        name: 'Library Facts',
        description: 'Know your libraries!',
        points: 40,
        timeLimit: 2,
        question: "What type of library is Shannon?",
        correctAnswer: "Engineering",
        wrongAnswers: ["Medical", "Law", "Business"],
        category: "Library"
    },

    // Dining Category
    {
        id: 7,
        type: 'trivia',
        name: 'Dining Hours',
        description: 'Test your dining knowledge!',
        points: 25,
        timeLimit: 2,
        question: "What time does O-Hill open for breakfast?",
        correctAnswer: "7:00 AM",
        wrongAnswers: ["6:00 AM", "8:00 AM", "9:00 AM"],
        category: "Dining"
    },
    {
        id: 8,
        type: 'trivia',
        name: 'Dining Locations',
        description: 'Know your dining halls!',
        points: 30,
        timeLimit: 2,
        question: "Which dining hall is located on Observatory Hill?",
        correctAnswer: "O-Hill",
        wrongAnswers: ["Runk", "Fresh Food Co.", "Newcomb"],
        category: "Dining"
    }
];

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("Random Events Function Started!");

Deno.serve(async (req) => {
    try {
        // Get location category from request
        const { category } = await req.json();

        // Filter questions by category
        const availableQuestions = TRIVIA_QUESTIONS.filter(q => q.category === category);

        if (availableQuestions.length === 0) {
            throw new Error(`No trivia questions available for category: ${category}`);
        }

        // Select random question
        const randomQuestion = availableQuestions[
            Math.floor(Math.random() * availableQuestions.length)
        ];

        // Prepare answers in random order
        const allAnswers = [
            randomQuestion.correctAnswer,
            ...randomQuestion.wrongAnswers
        ].sort(() => Math.random() - 0.5);

        // Format response (excluding correct answer)
        const response = {
            event: {
                id: randomQuestion.id,
                type: randomQuestion.type,
                name: randomQuestion.name,
                description: randomQuestion.description,
                points: randomQuestion.points,
                timeLimit: randomQuestion.timeLimit,
                question: randomQuestion.question,
                answers: allAnswers,
                category: randomQuestion.category
            },
            startTime: new Date().toISOString()
        };

        return new Response(
            JSON.stringify(response),
            { 
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                } 
            }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ 
                error: error.message,
                details: 'Failed to generate random event'
            }),
            { 
                status: 500,
                headers: { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                } 
            }
        );
    }
});