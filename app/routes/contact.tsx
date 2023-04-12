import Contact from "~/components/contact";
import styles from 'react-toastify/dist/ReactToastify.css';


export function links() {
    return [{ rel: "stylesheet", href: styles }];
}
export default function contact() {
    return (
        <Contact></Contact>
    );
}
