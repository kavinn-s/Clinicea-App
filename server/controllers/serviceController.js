import { fetchCliniceaServices } from '../services/cliniceaService.js';

export const getServices = async (req, res) => {
    try {
        const services = await fetchCliniceaServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: "Failed to load clinic services" });
    }
};