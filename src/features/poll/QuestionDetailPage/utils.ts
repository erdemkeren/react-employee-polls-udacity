import {Question} from "../../../types";
import {QuestionStats} from "./types";

const getPercentage = (total: number, val: number): number => Math.round(100 / total * val);

export const getStatsForQuestion = (question: Question): QuestionStats => {
    const oneN = question.optionOne.votes.length;
    const twoN = question.optionTwo.votes.length
    const total = oneN + twoN;
    const oneP = getPercentage(total, oneN);
    const twoP = getPercentage(total, twoN);

    return {oneN, twoN, oneP, twoP};
};

export const getValueForQuestion = (question: Question, userId: string): string | null => {
    if (question.optionOne.votes.includes(userId)) {
        return 'optionOne';
    }

    if (question.optionTwo.votes.includes(userId)) {
        return 'optionTwo';
    }

    return null;
}
