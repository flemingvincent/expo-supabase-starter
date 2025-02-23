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
const EVENTS: Event[] = [
    {
        id: 1,
        type: 'trivia',
        name: 'Library History',
        description: 'Test your knowledge about the library!',
        points: 50,
        timeLimit: 2,
        question: "What year was Shannon Library established?",
        correctAnswer: "1985",
        wrongAnswers: ["1975", "1995", "2005"],
        category: "Library"
    },
    {
        id: 2,
        type: 'trivia',
        name: 'Gym Facts',
        description: 'How well do you know the AFC?',
        points: 30,
        timeLimit: 2,
        question: "How many basketball courts are in the AFC?",
        correctAnswer: "3",
        wrongAnswers: ["2", "4", "5"],
        category: "Gym"
    },
    {
        id: 3,
        type: 'trivia',
        name: 'Library Services',
        description: 'Know your library services!',
        points: 40,
        timeLimit: 2,
        question: "What floor is the quiet study area on?",
        correctAnswer: "4th Floor",
        wrongAnswers: ["1st Floor", "2nd Floor", "3rd Floor"],
        category: "Library"
    },
    {
        id: 4,
        type: 'trivia',
        name: 'Gym Equipment',
        description: 'Test your gym knowledge!',
        points: 35,
        timeLimit: 2,
        question: "How many treadmills are in the cardio area?",
        correctAnswer: "12",
        wrongAnswers: ["8", "10", "15"],
        category: "Gym"
    }
    // Add more trivia questions as needed
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