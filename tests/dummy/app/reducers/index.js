export default function counter(state = {count: 0}, action = null) {
  switch (action.type) {
    case 'INCREMENT_COUNT':
      return {count: state.count + 1};

    default:
      return state;
  }
}
