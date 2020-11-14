import dayjs from 'dayjs'
import 'dayjs/locale/uk'
import {
    GET_SETTINGS,
    SET_DEVICELIST,
    SET_CURRENTDEVICE,
    SET_SCALE,
    SET_DEVICE_ID,
    SET_DATE,
    SET_SOCKET_ID,
    SET_LAYOUT,
    SET_NAME
} from './types'

const initialState = {
    deviceId: "",
    date: dayjs().locale("uk").format("dddd D MMM HH:mm").toUpperCase().split(" "),

    bigTimeLayout: false,
    socketId: "",
    scale: 2.5,
    currentDevice: "",
    deviceList: [],
    started: false,
    deviceName: "",
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_SCALE:
            return {
                ...state,
                scale: action.payload
            }
        case SET_CURRENTDEVICE:
            return {
                ...state,
                currentDevice: action.payload
            }
        case SET_DEVICE_ID:
            return {
                ...state,
                deviceId: action.payload
            }
        case SET_SOCKET_ID:
            return {
                ...state,
                socketId: action.payload
            }
        case SET_DEVICELIST:
            return {
                ...state,
                deviceList: action.payload
            }
        case SET_DATE:
            return {
                ...state,
                date: action.payload
            }
        case SET_LAYOUT:
            return {
                ...state,
                bigTimeLayout: action.payload
            }
        case SET_NAME:
            return {
                ...state,
                deviceName: action.payload
            }

        case GET_SETTINGS:
            console.log(action.payload.bigTimeLayout)
            return {
                ...state,
                scale: action.payload.scale ?? 2.5,
                bigTimeLayout: action.payload.bigTimeLayout ?? false,
                deviceName: action.payload.deviceName ?? 'default',
                currentDevice: action.payload.currentDevice ?? ''
            }
        default:
            return { ...state }
    }

}
