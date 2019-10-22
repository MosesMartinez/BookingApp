import moment from 'moment'
const INITIAL_STATE = {
    date: moment().format('MMM'),
    month: moment().format('D'),
    year: moment().format('Y'),
  };
  const dateReducer = (state = INITIAL_STATE, action) => {
      switch (action.type) {
        case 'SET_DATE':
          return{
              ...state,
              date: action.dateSelected,
              month: action.monthSelected,
              year: action.yearSelected,
          };
        default:
          return state
      }
    };
    
    export default dateReducer;