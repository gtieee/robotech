//import questions from './data/questions.json;'
import axios from 'axios';

export function isApplied(id) {
    //applied = axios.get(server + '/api/applied');
    return true 
}

export async function getQuestions(type) {
    try {
        if (type === "participants") {
            const questionsObject = await axios.get('localhost:500/questions/participant');
            return questionsObject.questions;
        }
    }
    catch {
        return "Error";
    }
}