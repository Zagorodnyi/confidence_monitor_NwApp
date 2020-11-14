import axios from 'axios'
import {
    GET_SETTINGS,
    SET_DEVICELIST,
    SET_CURRENTDEVICE,
    SET_SCALE,
    SET_DATE,
    SET_DEVICE_ID,
    SET_SOCKET_ID,
    SET_LAYOUT,
    SET_NAME
} from './types'

export const getSettings = (deviceId) => async (dispatch) => {
    try {
        const settings = await axios.get(
            `https://fierce-sierra-99883.herokuapp.com/api/confidence/settings/${deviceId}`
        );

        if (settings.status === 200) {
            dispatch({
                type: GET_SETTINGS,
                payload: {
                    ...settings.data._doc,
                    started: false,
                }
            });
            dispatch(startCameras(settings.data._doc.currentDevice))
        } else {
            dispatch(startCameras(null))

        }

    } catch (err) {
        console.log(err);
    }
}

export const updateSettings = (deviceId) => async (dispatch) => {
    try {
        const settings = await axios.get(
            `https://fierce-sierra-99883.herokuapp.com/api/confidence/settings/${deviceId}`
        );
        if (settings.status === 200) {
            dispatch({
                type: GET_SETTINGS,
                payload: {
                    ...settings.data._doc
                }
            });
        }
    } catch (err) {
        console.log(err);
    }
}



export const startCameras = (currentDevice) => async (dispatch) => {
    if (!navigator.mediaDevices) {
        return;
    }
    try {

        await navigator.mediaDevices.getUserMedia({
            video: true,
        });

        const devices = await navigator.mediaDevices.enumerateDevices();
        dispatch({ type: SET_DEVICELIST, payload: devices });
        const stream = await navigator.mediaDevices.getUserMedia({
            video: currentDevice ?
                {
                    deviceId: { exact: `${currentDevice}` }
                } : true,
        });

        const video = document.querySelector("video");
        if (video) {
            video.srcObject = stream;
            video.onloadedmetadata = (e) => {
                video.play();
            };
        }
    }
    catch (err) {
        console.log(err)
    }
}


export const postSettings = (settings, deviceId) => async (dispatch) => {
    await axios.post(
        `https://fierce-sierra-99883.herokuapp.com/api/confidence/settings/${deviceId}`, settings
    );
}


export const setCurrentDevice = (currentDevice) => (dispatch) => {
    dispatch({ type: SET_CURRENTDEVICE, payload: currentDevice })
}

export const setScale = (scale) => (dispatch) => {
    dispatch({ type: SET_SCALE, payload: scale })
}


export const setDeviceId = (deviceId) => (dispatch) => {
    dispatch({ type: SET_DEVICE_ID, payload: deviceId })
}

export const setDate = (date) => (dispatch) => {
    dispatch({ type: SET_DATE, payload: date })
}

export const setSocketId = (id) => (dispatch) => {
    dispatch({ type: SET_SOCKET_ID, payload: id })
}

export const setLayout = (layout) => (dispatch) => {
    dispatch({ type: SET_LAYOUT, payload: layout })
}

export const setName = (name) => (dispatch) => {
    dispatch({ type: SET_NAME, payload: name })
}