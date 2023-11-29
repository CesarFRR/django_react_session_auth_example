import { UNPetAxios } from './config'


const BASE_RUTA = '/accounts/api/'
const ACCOUNTS = new UNPetAxios(BASE_RUTA)
ACCOUNTS.init()

console.log('unpetaxios innstanciado: ', ACCOUNTS);
/**
 * Función que realiza una petición POST al endpoint 'login/' del API de cuentas.
 * @param {Object} formData - Objeto con los datos del formulario de inicio de sesión.
 * @returns {Promise} - Promesa que resuelve con la respuesta de la petición.
 */
export const login = async (formData) => {
    const body = {
        username: formData.get('username'),
        password: formData.get('password'),
    };
    console.log('login, body: ', body)
    try {
        const response = await ACCOUNTS.post('login/', body);
        if (response.status === 200) {
            return { isAuthenticated: true, error: "" };
        } else {
            throw new Error("Wrong username or password.");
        }
    } catch (error) {
        console.log(error);
        return { isAuthenticated: false, error: "server error." };
    }
};


export const logout = async () => {
   
    try {
        const response = await ACCOUNTS.get('logout/');

        return { isAuthenticated: false, error: "" };
    } catch (error) {
        console.log(error);
        return { isAuthenticated: true, error: "" };
        
    }
};