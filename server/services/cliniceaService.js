import { calculateAvailableSlots } from './availabilityService.js';

// The fetch function
export const fetchCliniceaSlots = async (targetDate) => {
    const cliniceaUrl = `https://api.clinicea.com/api/v3/appointments/getAppointmentsByDate?api_key=${process.env.CLINICEA_API_KEY}&appointmentDate=${targetDate}&pageNo=1&pageSize=100`;

    const response = await fetch(cliniceaUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`Clinicea API error: ${response.status}`);
    }

    const bookedData = await response.json();
    return calculateAvailableSlots(targetDate, bookedData);
};

export const fetchCliniceaServices = async () => {
    const clinicID = "ff601f84-75ba-4468-8a65-2b89ab624b0b";
    
    // We add the mandatory searchText, serviceCategory, and pageNo
    const queryParams = new URLSearchParams({
        api_key: process.env.CLINICEA_API_KEY,
        ClinicID: clinicID,
        searchText: "",       // Mandatory: Empty string gets all
        serviceCategory: "",  // Mandatory: Empty string gets all
        serviceType: 0,       // 0 = Online Booking
        pageNo: 1,            // Mandatory: Start at page 1
        pageSize: 50          // Optional: Get up to 50 services
    });

    const cliniceaUrl = `https://api.clinicea.com/api/v3/services/getServicesByClinic?${queryParams.toString()}`;
    
    try {
        const response = await fetch(cliniceaUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`🚨 Services Fetch Failed: ${response.status} - ${errorText}`);
            throw new Error(`Clinicea API error: ${response.status}`);
        }

        const servicesData = await response.json();
        
        // Use the exact keys from the yellow Example box in your screenshot
        return servicesData.map(service => ({
            id: service.ID,
            name: service.Name,
            price: service.Price || 0,
            duration: service.DurationTotalInMin || 30 // Using the key from your screenshot
        }));
    } catch (error) {
        console.error("Error fetching services:", error);
        return []; 
    }
};

// Push the final booking to Clinicea
export const bookCliniceaAppointment = async (bookingDetails) => {
    const clinicID = "ff601f84-75ba-4468-8a65-2b89ab624b0b";
    const staffID = "f786a627-7680-4a72-8620-899739fe07d5";
    const serviceID = "2f98de47-6bb1-4761-94af-34bc9439030e"; 
    const testPatientID = "d901b64f-7e1f-42f3-d10e-52417d8549df"; 

    // Convert to exactly what Clinicea wants: YYYY-MM-DDTHH:mm:ss (No 'Z', no milliseconds)
    const localDate = new Date(`${bookingDetails.appointmentDate}T${bookingDetails.startTime}:00+05:30`);
    
    // Manually construct the strict format
    const formattedUtcDate = localDate.getUTCFullYear() + '-' + 
        String(localDate.getUTCMonth() + 1).padStart(2, '0') + '-' + 
        String(localDate.getUTCDate()).padStart(2, '0') + 'T' + 
        String(localDate.getUTCHours()).padStart(2, '0') + ':' + 
        String(localDate.getUTCMinutes()).padStart(2, '0') + ':00';

    const queryParams = new URLSearchParams({
        api_key: process.env.CLINICEA_API_KEY,
        patientID: testPatientID, 
        appointmentDateTime: formattedUtcDate, // <-- Using the strict format here!
        staffID: staffID,
        clinicID: clinicID,
        serviceType: 0,
        appointmentType: 0,
        notes: bookingDetails.concern || "Website Booking",
        appointmentServiceID: serviceID
    });

    const cliniceaUrl = `https://api.clinicea.com/api/v3/appointments/createAppointment?${queryParams.toString()}`;
    
    try {
        const response = await fetch(cliniceaUrl, {
            method: 'POST',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            console.error(`🚨 Clinicea rejected the booking! Reason: ${errorText}`);
            throw new Error(`Clinicea booking failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return result.ID || "Simulated_Clinicea_ID"; 

    } catch (error) {
        console.error("Error pushing to Clinicea:", error);
        throw error; 
    }
};