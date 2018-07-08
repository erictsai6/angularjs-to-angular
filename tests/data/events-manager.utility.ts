// Event map is a dictionary with event name and list of callbacks
interface IEventMap {
    [name: string]: Array<(data?: any) => void>;
}

export class EventsManager {

    public static $inject = [
        '$timeout'
    ];

    private eventMap: IEventMap;

    constructor(private $timeout: ng.ITimeoutService) {
        this.eventMap = {};
    }

    /**
     *
     * @param name - event name that we are subscribing to
     * @param func - callback function that executes if event signal was subscribed to
     */
    public subscribe = (name: string, func: (...args: any[]) => void): () => void => {
        if (!this.eventMap.hasOwnProperty(name)) {
            this.eventMap[name] = [];
        }

        let currentIndex = this.eventMap[name].length;
        this.eventMap[name].push(func);

        return () => {
            delete this.eventMap[name][currentIndex];
        };
    }

    /**
     *
     * @param name - event name that we are triggering/signaling
     * @param data - optional data that we can send as a parameter
     */
    public publish = (name: string, data?: any): void => {

        if (this.eventMap.hasOwnProperty(name)) {
            for (let callback of this.eventMap[name]) {
                if (callback) {
                    this.$timeout(() => {
                        callback(data);
                    });
                }
            }
        }

    }

}
