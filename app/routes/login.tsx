import Login from "~/components/login";
import styles from 'react-toastify/dist/ReactToastify.css';


export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export default function login() {
    return (
        <Login></Login>
    );
}
