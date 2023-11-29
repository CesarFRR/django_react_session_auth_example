import axios from "axios";

//===============================================//
// --> SOLO UNA PUEDE SER TRUE <-- //
export const DEBUG = false;
export const DOCKER_MODE = false;
export const RENDER_MODE = false;
export const PRODUCTION_TEXT = true;
//===============================================//

let URL = "";

if (DEBUG) {
        URL = "http://localhost:8000/api";
} else if (DOCKER_MODE) {
        URL = "";
} else if (RENDER_MODE) {
        URL = "https://unpet-api-rest.onrender.com/api";
} 
else if (PRODUCTION_TEXT) {
        URL = "https://api-django-react-cookies-j252.onrender.com/api";
}

else {
        // Test each URL with a simple GET request to "accounts/api/test/"
        const urls = [
                "http://127.0.0.1:8000/api",
                "",
                "https://unpet-api-rest.onrender.com/api"
        ];

        for (let testURL of urls) {
            try {
                await fetch(testURL + "/accounts/api/test");
                // If the request is successful, set the URL and break the loop
                URL = testURL;
                break;
            } catch (error) {
                console.log('ERROR, EL HOST ES:' + testURL, error);
            }
        }
}

/**
 * La URL base del host.
 * @type {string}
 */
export const BASE_URL = URL;
export const CREDENTIALS = 'include';
export let csrfToken = null;
const  getCSRF = async() => {
        fetch(BASE_URL + "/accounts/api/csrf/", {
            credentials: CREDENTIALS,
        })
            .then((res) => {
                csrfToken = res.headers.get("X-CSRFToken");
                //setCsrf(csrfToken);
                console.log('crsfToken para el nuevo getCSRF(): ',csrfToken);
                return csrfToken;
            })
            .catch((err) => {
                console.log(err);
            });
}

// Wrap getSession function inside a self-invoking function
(function() {
    const getSession = () => {
        fetch(BASE_URL + "/accounts/api/session/", {
            credentials: CREDENTIALS,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.isAuthenticated) {
                    
                } else {
                    
                    getCSRF();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getSession(); // Call getSession function when the JavaScript file is loaded
})();

export class UNPetAxios {
    constructor(base_ruta='') {
        this.csrfToken2 = csrfToken;
        this.BASE_URL = BASE_URL;
        this.BASE_URL_RUTA = BASE_URL + base_ruta;
        this.CREDENTIALS = CREDENTIALS;
        this.axiosInstance = axios.create({
            baseURL: BASE_URL, // Cambia esto a la URL de tu API
            withCredentials: true,
        });
        this.init();
    }

    async init() {
        
        console.log('inicializando axios, csrfToken y csrfToken2: ', csrfToken, this.csrfToken2);
    }
    async fetchWithHeaders(url, options = {}, moreHeaders = {}) {
        let contenttype = moreHeaders ? moreHeaders["Content-Type"] : "application/json";
    
        // Primero, obtenemos el token CSRF
        const csrfResponse = await axios.get(this.BASE_URL_RUTA + "/accounts/api/csrf/", { withCredentials: true });
        const csrfToken = csrfResponse.headers['x-csrftoken'];
    
        const allOptions = {
            headers: {
                "Content-Type": contenttype,
                "X-CSRFToken": csrfToken, // Aquí ponemos el token CSRF
                ...moreHeaders
            },
            withCredentials: true, // axios usa withCredentials en lugar de credentials
            ...options,
        };
    
        console.log('JUSTO ANTES DEL FETCH: fetchWithHeaders, allOptions: ', allOptions, 'URL: ', this.BASE_URL_RUTA + url);
        return axios(this.BASE_URL_RUTA + url, allOptions); // reemplaza fetch con axios
    }

    get(url, options = {}) {
        return this.fetchWithHeaders(url, options);
    }

    post(url, body = {}, options = {}) {
        return this.fetchWithHeaders(url, {
            method: "post",
            data: body, // axios usa 'data' en lugar de 'body'
            ...options,
        });
    }
    
    put(url, body = {}, options = {}) {
        return this.fetchWithHeaders(url, {
            method: "put",
            data: body, // axios usa 'data' en lugar de 'body'
            ...options,
        });
    }

    delete(url, options = {}) {
        return this.fetchWithHeaders(url, {
            method: "delete",
            ...options,
        });
    }
}
