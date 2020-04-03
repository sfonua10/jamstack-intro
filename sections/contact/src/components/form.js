import React, { useReducer } from 'react';
import styles from './form.module.css';
//How to update this state?
//use reducer. Becuase it would be a big pain to independetly tracked state. If we wanted to reset, we would have to call 4 different functions for each to be empty. We're going to treat whole state as a single value and peform differnt actions on it based on what we send in.
//Reduce, define function called reducer. Reducer gets current state and action, action is defined by us. Standard way to approach this is to use a switch statement. 
const INITIAL_STATE = {
  name: '',
  email: '',
  subject: '',
  body: '',
  status: 'IDLE'
}
//standard way to set up action is to set up type
// {type: 'dostuff', name: 'Saia'}
const reducer = (state, action) => {
  switch(action.type) {
    case 'updateFieldValue':
      return { ...state, [action.field]: action.value};
    case 'updateStatus':
      return {...state, status: action.status };
    case 'reset':
    default:
      return INITIAL_STATE;
  }
}
const Form = () => {
  //dispatcher is how you send an action to a reducer
  //state is the INITIAL STATE or whatever gets returned from reducer
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setStatus = status => dispatch({ type: 'updateStatus', status });

  const updateFieldValue = field => event => {
    dispatch({
      type: 'updateFieldValue',
      field,
      value: event.target.value
    })
  }

  const handleSubmit = event => {
    // so it doesn't reload page
    event.preventDefault();
    setStatus('PENDING')
    //now we've opted in to that responsibility that we need to handle now
    //TODO actually send the message
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(state)
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setStatus('SUCCESS');
      })
      .catch(error => {
        console.error(error);
        setStatus('ERROR')
      })
  }

  if(state.status === 'SUCCESS') {
    return (
      <p className={styles.success}>
        Message was sent
        <button type='reset' onClick={() => dispatch({type: 'reset'})} className={`${styles.button} ${styles.centered}`}>Reset</button>
      </p>
    )
  }
  return (
    <>
    {state.status === 'ERROR' && (
      <p className={styles.error}>Something went wrong. Please try again.</p>
    )}
    <form className={`${styles.form} ${state.status === 'PENDING' && styles.pending}`} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Name
        <input className={styles.input} type="text" name="name" value={state.name} onChange={updateFieldValue('name')} /> 
      </label>
      <label className={styles.label}>
        Email
        <input className={styles.input} type="email" name="email" value={state.email} onChange={updateFieldValue('email')}/>
      </label>
      <label className={styles.label}>
        Subject
        <input className={styles.input} type="text" name="subject" value={state.subject} onChange={updateFieldValue('subject')}/>
      </label>
      <label className={styles.label}>
        Body
        <textarea className={styles.input} name="email" value={state.body} onChange={updateFieldValue('body')} />
      </label>
      <button className={styles.button}>Send</button>
    </form>
    </>
  )
}

export default Form;