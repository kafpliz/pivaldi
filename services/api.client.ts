class ApiCLient {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl

    }

    async request<T>(endpoint: string, options: RequestInit = {}, requiresAuth: boolean = true): Promise<T> {
        const url = this.baseUrl + endpoint;

        let headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };


        const makeRequest = async (): Promise<Response> => {
            return fetch(url, {
                ...options,
                headers
            });
        };

        let response = await makeRequest();

        const data = await response.json();

        if (!response.ok) {
            if (Array.isArray(data.message)) {
                const errorMessage = data.message.join('\n\n');
                throw new Error(errorMessage);
            }
            if (data.message) {
                throw new Error(data.message);
            }
            throw new Error(data.error || 'Ошибка запроса');
        }

        return data;
    }

    async get<T>(endpoint: string,): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' })
    }

    async post<T>(endpoint: string, body?: any,): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        })
    }

}


const apiUrl =  "https://pivaldi.online/api/"
export const apiClient = new ApiCLient(apiUrl)