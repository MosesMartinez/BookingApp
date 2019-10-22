
export const setDate = (dateSelected, monthSelected, yearSelected) =>{
    return {
        type: 'SET_DATE',
        dateSelected,
        monthSelected, 
        yearSelected,
    };
}