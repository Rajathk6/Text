import axios from "axios"

const ApiMapping = axios.create (
    {
        baseURL: "http://localhost:8080",
    }
)

export default ApiMapping