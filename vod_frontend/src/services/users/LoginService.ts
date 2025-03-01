import axios from '../../config/AxiosConfig';


export const LoginService = async (email: string, password: string) => {
    return await axios.post('/auth/login', {
        email: email,
        password: password
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


