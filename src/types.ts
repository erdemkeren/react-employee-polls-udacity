export type User = {
    id: string,
    name?: string,
    avatarURL?: string|null,
    answers: {
        [key: string]: keyof typeof questionOptions,
    },
    questions: Array<string>,
}

export type UserWithScore = User & { score: number };

type Option = {
    votes: Array<string>,
    text: string,
}

export type Question = {
    id: string,
    author: string,
    timestamp: number,
    optionOne: Option,
    optionTwo: Option,
};

export type QuestionWithAuthor = Question & { authorObject: User };

export enum questionOptions { optionOne = 'optionOne', optionTwo = 'optionTwo' }
