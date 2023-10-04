import { useEffect, useRef, useState } from "react";
import answersStore from "~/state/taketest";

interface MCQQuestionsProps {
    question: any;
    queNumber: number;
    pagenumber: number;
    selected: undefined | { [key: string]: any };
    principleid: number;
    principlename: string;
}

const MCQQuestions: React.FC<MCQQuestionsProps> = (
    props: MCQQuestionsProps
): JSX.Element => {
    const cacheAnswer = answersStore((state) => state.cacheAnswer);
    const addCacheAnswer = answersStore((state) => state.addCacheAnswer);
    return (
        <>
            <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
                <h2 className="text-secondary font-medium text-2xl mb-2">
                    {props.queNumber}. {props.question.question}
                </h2>
                <h4 className="text-white font-normal text-lg mb-2">
                    {props.question.description}
                </h4>
                <h4 className="text-white font-normal text-lg mb-2">
                    Compliance:  <a target="_blank" href={props.question.complince.LearnMoreLink} className="text-secondary text-md font-normal">{props.question.complince.name}</a>
                </h4>
                <div className="grid place-items-start grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {props.question.answer.map((value: any, index: number) => {
                        return (
                            <div
                                onClick={() =>
                                    addCacheAnswer({
                                        question: props.question.question,
                                        principleid: props.principleid,
                                        principlename: props.principlename,
                                        answer: value.answer,
                                        mark: value.mark,
                                        rec: value.rec,
                                        id: props.question.id,
                                        version: props.question.version,
                                        page: props.pagenumber,
                                        questioncode: props.question.questioncode,
                                        questiontype: props.question.questionType,
                                        license: props.question.licensesId,
                                    })
                                }
                                className="flex items-center gap-4 border-2 border-[#3d3f49] border-dashed hover:border-gray-300  w-full py-2 px-4"
                                key={index}
                            >
                                <input
                                    checked={props.selected == undefined ? false : props.selected.answer == props.question.answer[index].answer ? true : false}
                                    onChange={(e) => { }}
                                    type="radio"
                                    id={`opt${index}_${props.queNumber}`}
                                    className="w-5 h-5 fill-none outline-none shrink-0 accent-emerald-500"
                                />
                                <label
                                    htmlFor={`opt${index}_${props.queNumber}`}
                                    className="text-white text-xl"
                                >
                                    {props.question.answer[index].answer}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

interface SliderQuestionsProps {
    question: any;
    queNumber: number;
    maxnumber: number;
    step: number;
    pagenumber: number;
    selected: undefined | { [key: string]: any };
    principleid: number;
    principlename: string;
}

const SliderQuestions: React.FC<SliderQuestionsProps> = (
    props: SliderQuestionsProps
): JSX.Element => {
    let sliderRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<number>(-1);
    const handleChange = (value: number) => {
        setValue((val) => value);
    };
    const addCacheAnswer = answersStore((state) => state.addCacheAnswer);
    const removeCacheAnswer = answersStore((state) => state.removeCacheAnswer);
    useEffect(() => {
        if (props.selected != undefined) {
            const selectedIndex = props.question.answer.findIndex(
                (val: any) => parseInt(val.answer) == parseInt(props.selected!.answer)
            );
            setValue(selectedIndex);
            sliderRef.current!.value = parseInt(selectedIndex + 1).toString();
        }
    }, []);

    return (
        <>
            <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
                <h2 className="text-secondary font-medium text-2xl mb-2">
                    {props.queNumber}. {props.question.question}
                </h2>
                <h4 className="text-white font-normal text-lg mb-2">
                    {props.question.description}
                </h4>
                <h4 className="text-white font-normal text-lg mb-2">
                    Compliance: <a target="_blank" href={props.question.complince.LearnMoreLink} className="text-secondary text-md font-normal">{props.question.complince.name}</a>
                </h4>
                <div className=" mt-6 w-full flex gap-4 items-center">
                    <input
                        ref={sliderRef}
                        type="range"
                        min={0}
                        max={props.question.answer.length}
                        step={1}
                        className="accent-emerald-500 w-full h-10"
                        defaultValue={0}
                        onChange={(val) => {
                            if (parseInt(val.target.value) != 0) {
                                setValue(value => parseInt(val.target.value) - 1);
                                addCacheAnswer({
                                    question: props.question.question,
                                    principleid: props.principleid,
                                    principlename: props.principlename,
                                    answer: props.question.answer[parseInt(val.target.value) - 1].answer,
                                    mark: props.question.answer[parseInt(val.target.value) - 1].mark,
                                    rec: props.question.answer[parseInt(val.target.value) - 1].rec,
                                    id: props.question.id,
                                    version: props.question.version,
                                    page: props.pagenumber,
                                    questioncode: props.question.questioncode,
                                    questiontype: props.question.questionType,
                                    license: props.question.licensesId,
                                });
                            } else {
                                setValue(value => parseInt(val.target.value) - 1);
                                removeCacheAnswer({
                                    question: props.question.question,
                                    principleid: props.principleid,
                                    principlename: props.principlename,
                                    answer: "None",
                                    mark: "0",
                                    rec: "None",
                                    id: props.question.id,
                                    version: props.question.version,
                                    page: props.pagenumber,
                                    questioncode: props.question.questioncode,
                                    questiontype: props.question.questionType,
                                    license: props.question.licensesId,
                                });
                            }
                        }}
                    />
                    <p className="text-white text-3xl font-semibold">
                        {value == -1 ? "" : props.question.answer[value].answer}
                    </p>
                </div>
                <div className="flex gap-4 justify-between  rounded-md px-4 py-2">
                    <div>
                        <p
                            className={`text-white font-semibold text-lg p-2 py-1 rounded-md  text-center $`}
                        >

                        </p>
                    </div>
                    {props.question.answer.map((val: any, index: number) => {
                        return (
                            <div key={index}>
                                <p
                                    className={`text-white font-semibold text-lg p-2 py-1 rounded-md  text-center ${value == index ? "bg-green-500" : ""
                                        }`}
                                >
                                    {props.question.answer[index].answer}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

interface PercentQuestionsProps {
    question: any;
    queNumber: number;
    pagenumber: number;
    selected: undefined | { [key: string]: any };
    principleid: number;
    principlename: string;
}

const PercentQuestions: React.FC<PercentQuestionsProps> = (
    props: PercentQuestionsProps
): JSX.Element => {
    const [selected, setSelected] = useState<number | null>(null);

    const handleIndex = (index: number) => {
        setSelected((val) => index);
    };

    const addCacheAnswer = answersStore((state) => state.addCacheAnswer);

    useEffect(() => {
        if (props.selected != undefined) {
            const selectedIndex = props.question.answer.findIndex(
                (val: any) => parseInt(val.answer) == parseInt(props.selected!.answer)
            );
            setSelected(selectedIndex);
        }
    }, []);
    return (
        <>
            <div className="bg-white px-8 py-6 rounded-lg my-6 backdrop-filter backdrop-blur-lg bg-opacity-10">
                <h2 className="text-secondary font-medium text-2xl mb-2">
                    {props.queNumber}. {props.question.question}
                </h2>
                <h4 className="text-white font-medium text-lg mb-2">
                    {props.question.description}
                </h4>
                <h4 className="text-white font-normal text-lg mb-2">
                    Compliance:  <a target="_blank" href={props.question.complince.LearnMoreLink} className="text-secondary text-md font-normal">{props.question.complince.name}</a>
                </h4>
                <div className="flex items-center justify-center">
                    {props.question.answer.map((value: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => {
                                handleIndex(index);
                                addCacheAnswer({
                                    question: props.question.question,
                                    principleid: props.principleid,
                                    principlename: props.principlename,
                                    answer: value.answer,
                                    mark: value.mark,
                                    rec: value.rec,
                                    id: props.question.id,
                                    page: props.pagenumber,
                                    version: props.question.version,
                                    questioncode: props.question.questioncode,
                                    questiontype: props.question.questionType,
                                    license: props.question.licensesId,
                                });
                            }}
                            className={`grid place-items-center w-14 h-14 text-white font-medium text-md border-2 ${index == selected
                                ? "bg-green-500 bg-opacity-50"
                                : "bg-transparent"
                                }`}
                        >
                            {value.answer}%
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};


export { MCQQuestions, SliderQuestions, PercentQuestions };