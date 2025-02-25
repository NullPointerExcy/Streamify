import axios from '../../config/AxiosConfig';


export const LoginService = async (email: string, password: string) => {
    console.log("LoginService called"
        + "\nemail: " + email + "\npassword: " + password)
    return await axios.post('/auth/login', {
        email: email,
        password: password
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        (response: any) => {
            return response.data;
        }
    );
}


