import {users} from '../../_DATA';
import {questionOptions} from "../../types";

// A login function to mimic making an async request for data
type AuthResponse = {
    id: string,
    password: string,
    name: string,
    avatarURL?: string,
    answers: {
        [key: string]: keyof typeof questionOptions,
    },
    questions: Array<string>,
}

export function fetchLogin(username: string, password: string): Promise<{ data: AuthResponse }> {
    return new Promise<{ data: AuthResponse }>((resolve, reject) =>
        setTimeout(() => {
            if (Object.keys(users).includes(username)) {
                // @ts-ignore
                const user = users[username];

                if (user.password !== password) {
                    reject('Wrong password.');
                }

                return resolve({data: user});
            }

            return reject('User not found.');
        }, 500)
    );
}
