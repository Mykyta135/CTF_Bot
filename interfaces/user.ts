export interface User {
    name: string;
    surname: string;
    age: number;
    university: string;
    group: string;
    course: number;
    source: string;
    contact: number;
    userState: 'unregistered' | 'registered' | 'home' | 'admin';
    chat_id: number;
    teamCode: string;
    stateCount: number;
}
