import { create } from "zustand";

export interface AnswerInputStructure {
  id: number;
  question: string;
  principleid: number;
  principlename: string;
  answer: string;
  mark: string;
  rec: string;
  page: number;
  version: number;
  license: number;
  questiontype: string;
  questioncode: string;
}

export interface AnswerStructure {
  id: number;
  question: string;
  principleid: number;
  principlename: string;
  answer: string;
  mark: string;
  rec: string;
  version: number;
  status: boolean;
  license: number;
  questiontype: string;
  questioncode: string;
  updatedAt: string;
}

interface AnswerState {
  answers: AnswerStructure[];
  addAnswer: (value: AnswerInputStructure) => void;
  changeAnswerStatue: () => void;
  cacheAnswer: any[];
  addCacheAnswer: (value: AnswerInputStructure) => void;
  removeCacheAnswer: (value: AnswerInputStructure) => void;
  clearCache: () => void;
}

const answersStore = create<AnswerState>()((set) => ({
  answers: [],
  addAnswer: (value) => {
    const ans: AnswerStructure = {
      id: value.id,
      question: value.question,
      principleid: value.principleid,
      principlename: value.principlename,
      answer: value.answer,
      mark: value.mark,
      rec: value.rec,
      version: value.version,
      license: value.license,
      questiontype: value.questiontype,
      questioncode: value.questioncode,
      status: false,
      updatedAt: new Date().toLocaleString(),
    };

    set((state) => {
      const existingAnswerIndex = state.answers.findIndex(
        (ans) => ans.id === value.id
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
  cacheAnswer: [[], [], [], [], [], []],
  addCacheAnswer: (value) => {
    const ans: AnswerStructure = {
      id: value.id,
      question: value.question,
      principleid: value.principleid,
      principlename: value.principlename,
      answer: value.answer,
      mark: value.mark,
      rec: value.rec,
      version: value.version,
      license: value.license,
      questiontype: value.questiontype,
      questioncode: value.questioncode,
      status: false,
      updatedAt: new Date().toLocaleString(),
    };

    set((state) => {
      const existingAnswerIndex = state.cacheAnswer[value.page].findIndex(
        (ans: any) => ans.id === value.id
      );
      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...state.cacheAnswer[value.page]];
        updatedAnswers[existingAnswerIndex] = ans;
        const cacheAnswerDate = [...state.cacheAnswer];
        cacheAnswerDate[value.page] = updatedAnswers;
        return { ...state, cacheAnswer: cacheAnswerDate };
      } else {
        const updatedPage = [...state.cacheAnswer[value.page], ans];
        const cacheAnswerDate = [...state.cacheAnswer];
        cacheAnswerDate[value.page] = updatedPage;
        return { ...state, cacheAnswer: cacheAnswerDate };
      }
    });
  },
  removeCacheAnswer: (value) => {
    const ans: AnswerStructure = {
      id: value.id,
      question: value.question,
      principleid: value.principleid,
      principlename: value.principlename,
      answer: value.answer,
      mark: value.mark,
      rec: value.rec,
      version: value.version,
      license: value.license,
      questiontype: value.questiontype,
      questioncode: value.questioncode,
      status: false,
      updatedAt: new Date().toLocaleString(),
    };

    set((state) => {
      const existingAnswerIndex = state.cacheAnswer[value.page].findIndex(
        (ans: any) => ans.id === value.id
      );

      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...state.cacheAnswer[value.page]];
        updatedAnswers.splice(existingAnswerIndex, 1);
        const cacheAnswerDate = [...state.cacheAnswer];
        cacheAnswerDate[value.page] = updatedAnswers;
        return { ...state, cacheAnswer: cacheAnswerDate };
      } else {
        const updatedPage = [...state.cacheAnswer[value.page], ans];
        const cacheAnswerDate = [...state.cacheAnswer];
        cacheAnswerDate[value.page] = updatedPage;
        return { ...state, cacheAnswer: cacheAnswerDate };
      }
    });
  },

  clearCache: () => {
    set((state) => {
      return { ...state, cacheAnswer: [[], [], [], [], [], []] };
    });
  },
}));

export default answersStore;
