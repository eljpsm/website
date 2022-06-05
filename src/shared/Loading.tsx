import {Spinner} from "react-bootstrap";
import "./Loading.scss"

/**
 * A basic loading element.
 * @constructor
 */
export const Loading = () => {
    return <Spinner className={"loading"} animation={"border"}/>
}

export default Loading