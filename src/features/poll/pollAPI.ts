import {_getQuestions, _saveQuestion, _saveQuestionAnswer} from "../../data/_DATA";

type Option = {
    votes: Array<string>,
    text: string,
}

type Question = {
    id: string,
    author: string,
    timestamp: number,
    optionOne: Option,
    optionTwo: Option,
};

type QuestionsResponse = {
    [key: string]: Question,
}

export function fetchQuestions(): Promise<QuestionsResponse> {
    return _getQuestions();
}

type AnswerResponse = {}

// @ts-ignore
export function storeAnswer(args): Promise<AnswerResponse> {
    return _saveQuestionAnswer(args);
}

type StoreQuestionResponse = Question;

// @ts-ignore
export function storeQuestion(args): Promise<StoreQuestionResponse> {
    return _saveQuestion(args);
}
