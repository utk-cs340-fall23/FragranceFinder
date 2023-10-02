const sendGet = async (url) => {
    const token = localStorage.getItem('id_token');
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "Authorization": token ? `Bearer ${token}` : '',
        },
    });

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes('application/json')) {
        const data = await res.json()
        res.data = data;
    }

    return res;
}

const sendPost = async (url, data) => {
    const token = localStorage.getItem('id_token');
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": token ? `Bearer ${token}` : '',
      }
    })

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes('application/json')) {
        const data = await res.json()
        res.data = data;
    }

    return res
}

module.exports = {
    sendGet,
    sendPost
}