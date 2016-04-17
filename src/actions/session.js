import { isEmpty } from 'lodash';
import { createAction } from 'redux-actions';
import { firebaseUrlForNode } from '../helpers/firebase';
import { showError } from './errors';
import history from '../helpers/history';
import { receiveRoom } from './room';
import Firebase from 'firebase';

const rootRef = new Firebase(firebaseUrlForNode(""));
const roomsRef = new Firebase(firebaseUrlForNode("rooms"));

export const SET_ROOM_ID = 'SET_ROOM_ID';
export const setRoomId = createAction(SET_ROOM_ID);

export const SET_AUTH_DATA = 'SET_AUTH_DATA';
export const setAuthData = createAction(SET_AUTH_DATA);

export const SET_IS_LOGGING_IN = 'SET_IS_LOGGING_IN';
export const setIsLoggingIn = createAction(SET_IS_LOGGING_IN);

export function login(roomId) {
	return (dispatch, getState) => {
		dispatch(setIsLoggingIn(true));

		if(isEmpty(roomId)) {
			dispatch(showError(`Hva driver du med?`));
			return;
		}

		rootRef.authAnonymously((error, authData) => {
			if(error) {
				dispatch(showError('Kan ikke koble til :( Prøv igjen'));
				dispatch(setIsLoggingIn(false));
				return;
			}

			dispatch(setAuthData(authData));

			roomsRef.child(roomId).once('value', snapshot => {
				if(snapshot.val()) {
					dispatch(setRoomId(roomId));
					dispatch(setIsLoggingIn(false));
					dispatch(receiveRoom(snapshot.val()));
					history.push("app/search");
				}
				else {
					dispatch(showError(`${roomId}: Feil passord!`));
					dispatch(setIsLoggingIn(false));
				}
			});
		});
	}
}

export function logout() {
	return (dispatch) => {
		dispatch(setRoomId(undefined));
		dispatch(setAuthData(undefined));
		browserHistory.push("/");
	}
}
