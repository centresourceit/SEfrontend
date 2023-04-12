import Register from "~/components/register";
import styles from 'react-toastify/dist/ReactToastify.css';


export function links() {
    return [{ rel: "stylesheet", href: styles }];
}
export default function register() {
    return (
        <Register></Register>
    );
}
