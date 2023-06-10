import { Fa6SolidArrowLeft, Fa6SolidHeart } from "../icons/Icons";

export default function CardSection(): JSX.Element {
  return (
    <section
      id="principles"
      className="w-full relative overflow-hidden bg-[#181136] p-10 grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center justify-center align-middle gap-4"
    >
      <Card
        principle="Principle 1"
        title="Intellectualy Privacy"
        votes={423}
        link="/"
        image="/images/cards/card1.png"
      ></Card>
      <Card
        principle="Principle 2"
        title="Purpose Realisation"
        votes={336}
        link="/"
        image="/images/cards/card2.png"
      ></Card>
      <Card
        principle="Principle 3"
        title="Sustainability Management"
        votes={234}
        link="/"
        image="/images/cards/card3.png"
      ></Card>
      <Card
        principle="Principle 4"
        title="Risk Evaluation"
        votes={543}
        link="/"
        image="/images/cards/card4.png"
      ></Card>
      <Card
        principle="Principle 5"
        title="Accountable Re-design"
        votes={654}
        link="/"
        image="/images/cards/card5.png"
      ></Card>
    </section>
  );
}

interface CardProps {
  principle: string;
  title: string;
  link: string;
  votes: number;
  image: string;
}

const Card: React.FC<CardProps> = (props: CardProps): JSX.Element => {
  return (
    <div className="relative">
      <div className="absolute w-full top-0 h-72">
        <img src={props.image} alt="card" className="w-full h-full" />
      </div>
      <div className="relative">
        <p className="text-gray-200 text-sm font-medium mt-4">
          {props.principle}
        </p>
        <p className="text-white text-3xl font-semibold">
          {props.title.split(" ")[0]} <br />
          {props.title.split(" ")[1]}
        </p>
        <button className="text-gray-200 text-sm font-bold my-4">
          <Fa6SolidArrowLeft></Fa6SolidArrowLeft>
          Read More
        </button>

        <div className="flex gap-4 items-center mt-24 mb-4">
          <button className="text-[#181136] bg-[#54edec] py px-2 text-md font-medium rounded-full hover:bg-[#5239b5]">
            <Fa6SolidHeart></Fa6SolidHeart>
            Vote
          </button>
          <p className="text-white text-sm">{props.votes} Votes</p>
        </div>
      </div>
    </div>
  );
};
