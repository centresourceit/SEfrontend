import { create } from "zustand";

export interface AnswerInputStructure {
  questionId: number;
  question: string;
  answer: string;
  mark: string;
  rec: string;
}
export interface AnswerStructure {
  questionId: number;
  question: string;
  answer: string;
  mark: string;
  rec: string;
  status: boolean;
  updatedAt: string;
}

interface AnswerState {
  answers: AnswerStructure[];
  addAnswer: (value: AnswerInputStructure) => void;
  changeAnswerStatue: () => void;
}

const answersStore = create<AnswerState>()((set) => ({
  answers: [],
  addAnswer: (value) => {
    const ans: AnswerStructure = {
      questionId: value.questionId,
      question: value.question,
      answer: value.answer,
      mark: value.mark,
      rec: value.rec,
      status: false,
      updatedAt: new Date().toLocaleString(),
    };
    set((state) => {
      const existingAnswerIndex = state.answers.findIndex(
        (ans) => ans.questionId === value.questionId
      );
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...state.answers];
        updatedAnswers[existingAnswerIndex] = ans;
        return { answers: updatedAnswers };
      } else {
        return { answers: [...state.answers, ans] };
      }
    });
  },
  changeAnswerStatue: () => {
    set((state) => {
      const updatedAnswers = state.answers.map((ans) => {
        return { ...ans, status: !ans.status };
      });
      return { answers: updatedAnswers };
    });
  },
}));

export default answersStore;
