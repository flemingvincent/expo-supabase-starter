// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

// Define types for events
interface BaseEvent {
    id: number;
    type: string;
    name: string;
    description: string;
    points: number;
    timeLimit: number; // in minutes
}

interface TriviaEvent extends BaseEvent {
    type: 'trivia';
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
    category: string;
}

// Add new event types here in the future
// interface NewEventType extends BaseEvent {
//     type: 'new_type';
//     // additional properties
// }

type Event = TriviaEvent; // Add new event types here with union type

// Predefined events
// In random-events/index.ts
const EVENTS: Event[] = [
    // Gym category questions (generic fitness/sports)
    {
        id: 1,
        type: 'trivia',
        name: 'Fitness Knowledge',
        description: 'Test your fitness knowledge!',
        points: 50,
        timeLimit: 2,
        question: "How many minutes of exercise are recommended daily for adults?",
        correctAnswer: "30",
        wrongAnswers: ["15", "45", "60"],
        category: "Gym"
    },
    {
        id: 2,
        type: 'trivia',
        name: 'Sports Facts',
        description: 'How well do you know sports?',
        points: 30,
        timeLimit: 2,
        question: "Which muscle group does a push-up primarily target?",
        correctAnswer: "Chest",
        wrongAnswers: ["Back", "Legs", "Abs"],
        category: "Gym"
    },
    
    // Library category questions (general knowledge/books)
    {
        id: 3,
        type: 'trivia',
        name: 'Book Knowledge',
        description: 'Test your literary knowledge!',
        points: 40,
        timeLimit: 2,
        question: "Who wrote 'To Kill a Mockingbird'?",
        correctAnswer: "Harper Lee",
        wrongAnswers: ["John Steinbeck", "Ernest Hemingway", "F. Scott Fitzgerald"],
        category: "Library"
    },
    {
        id: 4,
        type: 'trivia',
        name: 'Literature Quiz',
        description: 'How well do you know books?',
        points: 35,
        timeLimit: 2,
        question: "What is the Dewey Decimal System used for?",
        correctAnswer: "Organizing books",
        wrongAnswers: ["Writing books", "Publishing books", "Selling books"],
        category: "Library"
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

        // Filter events by category and type
        const availableEvents = EVENTS.filter(event => 
            event.category === category && event.type === 'trivia'
        );

        if (availableEvents.length === 0) {
            throw new Error(`No trivia questions available for category: ${category}`);
        }

        // Select random event
        const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];

        // Prepare trivia response
        const allAnswers = [
            randomEvent.correctAnswer,
            ...randomEvent.wrongAnswers
        ].sort(() => Math.random() - 0.5);

        // Format response (excluding correct answer)
        const response = {
            event: {
                id: randomEvent.id,
                type: randomEvent.type,
                name: randomEvent.name,
                description: randomEvent.description,
                points: randomEvent.points,
                timeLimit: randomEvent.timeLimit,
                question: randomEvent.question,
                answers: allAnswers,
                category: randomEvent.category
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