export const setAppointmentForm = (name, email, phoneNumber, time) =>{
    return {
        type: 'SET_APPOINTMENT',
        name,
        email, 
        phoneNumber,
        time,
    };
}