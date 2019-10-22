const INITIAL_STATE = {
    name: '',
    email: '',
    phoneNumber: '',
    time: '',
    booked: false,
  };
  const appointmentReducer = (state = INITIAL_STATE, action) => {
      switch (action.type) {
        case 'SET_APPOINTMENT':
          return{
              ...state,
              name: action.name,
              email: action.email,
              phoneNumber: action.phoneNumber,
              time: action.time,
          };
        default:
          return state
      }
    };
    
    export default appointmentReducer;