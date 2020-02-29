import { IncomingHttpHeaders } from "http"
import * as jwt from 'jsonwebtoken'

const getUser = (headers: IncomingHttpHeaders) => {
    const authHeader = headers.authorization

    if(authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const user = jwt.verify(token, 'secret')
        return user
    } else {
        return null;
    }
}

export default getUser