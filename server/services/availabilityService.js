export const calculateAvailableSlots = (targetDate, bookedAppointments) => {
    const availableSlots = { morning: [], afternoon: [], evening: [] };
    const clinicOpenHour = 9; 
    const clinicCloseHour = 19; 
    const slotDurationMinutes = 30; 

    let currentSlot = new Date(`${targetDate}T00:00:00+05:30`);
    currentSlot.setHours(clinicOpenHour, 0, 0, 0);

    const closingTime = new Date(`${targetDate}T00:00:00+05:30`);
    closingTime.setHours(clinicCloseHour, 0, 0, 0);

    const now = new Date();
    const bufferTime = new Date(now.getTime() + 30 * 60000);

    while (currentSlot < closingTime) {
        const slotEnd = new Date(currentSlot.getTime() + slotDurationMinutes * 60000);

        // Check if Clinicea says it is booked
        const isBookedInClinicea = bookedAppointments.some(appt => {
            const apptStart = new Date(appt.StartDateTime);
            const apptEnd = new Date(appt.EndDateTime);
            return (currentSlot < apptEnd && slotEnd > apptStart && appt.AppointmentStatus !== "Cancelled");
        });

        // A slot is "available" if it's NOT booked AND it's in the future
        const isAvailable = !isBookedInClinicea && (currentSlot >= bufferTime);

        const timeString = currentSlot.toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'
        });

        const slotObject = { time: timeString, available: isAvailable };
        const hour = currentSlot.getHours();

        if (hour < 12) availableSlots.morning.push(slotObject);
        else if (hour >= 12 && hour < 16) availableSlots.afternoon.push(slotObject);
        else availableSlots.evening.push(slotObject);

        currentSlot = slotEnd;
    }
    return availableSlots;
};