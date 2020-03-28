
const obj = new Map()

const EventType = {
    FETCH_DATA: 'fetch_data'
}

export default {
    EventType,
    addListener(eventName: string, eventHandle: (param: any) => void) {
        const handleList = obj.get(eventName) || []
        handleList.push(eventHandle)
        obj.set(eventName, handleList)
    },

    tiggerEvent(eventName: string, ...param: any) {
        const handleList = obj.get(eventName) || []
        if (handleList.length > 0) {
            handleList.forEach(handle => {
                handle.apply(null, param)
            });
        }
    },

    removeListener(eventName: string, eventHandle?: (param: any) => void) {
        if (!eventHandle) {
            obj.delete(eventName)
        }
        const handleList = obj.get(eventName) || []
        if (handleList.length > 0) {
            handleList.forEach((handle, index) => {
                if (handle == eventHandle) {
                    handleList.splice(index, 1)
                }
            });
        }
    }
}