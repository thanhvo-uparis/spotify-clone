class HttpRequest {
    constructor() {
        this.baseUrl = "https://spotify.f8team.dev/api";
    }
    
    async _send(path, method, data, options = {}) {
        try {
            const _options = {
                ...options,
                method,
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json",
                },
            }

            if (data) {
                _options.body = JSON.stringify(data)
            }

            const res = await fetch(`${this.baseUrl}${path}`, _options);

            if (!res.ok) throw new Error(`HTTP error: `, res.status);
            const response =  await res.json();
            return response;
        }catch (error) {
            throw error;
        }
    }
    //GET
    async get(path, options) {
        return await this._send(path, "GET", null, options);
    }
    //POST
    async post(path, data, options) {
        return await this._send(path, "POST", data, options);
    }

    //PUT
    async put(path, data, options) {
        return await this._send(path, "PUT", data, options);
    }

    //PATCH
    async patch(path, data, options) {
        return await this._send(path, "PATCH", data, options);
    }

    //DELETE
    async del(path, options) {
        return await this._send(path, "DELETE", null, options);
    }
}

const httpRequest = new HttpRequest();
export default httpRequest;