import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHeart } from "@fortawesome/free-solid-svg-icons";


export default function CardSection(): JSX.Element {
    return (
        <section id="principles" className="w-full relative overflow-hidden bg-[#181136] p-10 grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center justify-center align-middle gap-4">
            <Card principle="Principle 1" title="Intellectualy Privacy" votes={423} link="/"></Card>
            <Card principle="Principle 2" title="Purpose Realisation" votes={336} link="/"></Card>
            <Card principle="Principle 3" title="Sustainability Management" votes={234} link="/"></Card>
            <Card principle="Principle 4" title="Risk Evaluation" votes={543} link="/"></Card>
            <Card principle="Principle 5" title="Accountable Re-design" votes={654} link="/"></Card>
        </section>
    );
}


interface CardProps {
    principle: string;
    title: string;
    link: string;
    votes: number;
}

const Card: React.FC<CardProps> = (props: CardProps): JSX.Element => {
    return (
        <div>
            <p className="text-gray-200 text-sm font-medium my-4">{props.principle}</p>
            <p className="text-white text-lg font-semibold">{props.title.split(" ")[0]} <br />{props.title.split(" ")[1]}</p>
            <button className="text-gray-200 text-sm font-bold my-2"><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon> Read More</button>
            <div className="flex gap-4 items-center my-4">
                <button className="text-[#181136] bg-[#54edec] py px-2 text-md font-medium rounded-full">
                    <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> Vote
                </button>
                <p className="text-white text-sm">{props.votes} Votes</p>
            </div>

        </div>
    );
}