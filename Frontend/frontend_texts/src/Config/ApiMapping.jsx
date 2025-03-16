import axios from "axios"

function ApiMapping() {
    const API = axios.create(
        {
            baseURL: "http://localhost:8080/api",
        }
    )
}

export default ApiMapping