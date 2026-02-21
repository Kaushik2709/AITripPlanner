import api from "./ApiURL";

export const ASSETS_URL =
    import.meta.env.VITE_ASSETS_URL ||
    (import.meta.env.PROD ? window.location.origin : "http://localhost:3000");

export const apiService = {
    // Auth API END POINTS 
    async register(data) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });
        return (await api.post("/auth/", formData)).data;
    },
    async login(data) {
        return (await api.post("/auth/login", data)).data;
    },
    async logout() {
        return (await api.post("/auth/logout")).data;
    },
    async getCurrentUser() {
        return (await api.get("/auth/profile")).data;
    },
    async updateProfile(data) {
        // Use FormData for file upload
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        return (await api.put("/auth/profile", formData)).data;
    },

    // TRIP API END POINTS 
    async createTrip(data) {
        return (await api.post("/trips", data)).data;
    },
    async getTrips() {
        return (await api.get("/trips")).data;
    },
    async getTripById(id) {
        return (await api.get(`/trips/${id}`)).data;
    },
    async deleteTrip(id) {
        return (await api.delete(`/trips/${id}`)).data;
    }
}