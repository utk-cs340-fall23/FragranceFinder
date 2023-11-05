import AuthService from '../utils/auth';


const getDefaultHeaders = () => {
    const token = AuthService.getToken();
    return {
        'Accept': 'application/json',
        "Authorization": token ? `Bearer ${token}` : '',
    }
}


const setData = async res => {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes('application/json')) {
        const data = await res.json()
        res.data = data;
    }
    return res;
}

// Default method to send a GET request
export const sendGet = async (url) => {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            ...getDefaultHeaders()
        },
    });

    return await setData(res);
}

// Default method to send a GET request
export const sendPost = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        ...getDefaultHeaders(),
        'Content-Type': 'application/json',
      }
    })

    return await setData(res);
}

// Default method to send a DELETE request
export const sendDelete = async (url, data) => {
    const res = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        ...getDefaultHeaders(),
        'Content-Type': 'application/json',
      }
    })

    return await setData(res);
}