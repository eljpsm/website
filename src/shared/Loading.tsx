import {Spinner} from "react-bootstrap";
import "./Loading.scss"

export const Loading = () => {
    return <Spinner className={"loading"} animation={"border"}/>
}

export default Loading