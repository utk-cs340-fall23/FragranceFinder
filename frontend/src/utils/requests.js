import AuthService from '../utils/auth';


const getDefaultHeaders = () => {
    const token = AuthService.getToken();
    return {
        'Accept': 'application/json',
        "Authorization": token ? `Bearer ${token}` : '',
    }
}


const setData = res => {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes('application/json')) {
        const data = await res.json()
        res.data = data;
    }
    return res;
}

// Default method to send a GET request
const sendGet = async (url) => {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            ...getDefaultHeaders()
        },
    });

    return setData(res);
}

// Default method to send a GET request
const sendPost = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        ...getDefaultHeaders(),
        'Content-Type': 'application/json',
      }
    })

    return setData(res);
}

module.exports = {
    sendGet,
    sendPost
}