import {createWorkerMessage, WorkerMessage} from './worker-message';

export interface MessagePortOrWorker {
    postMessage(message?: any, transfer?: any[]): void;
}

export default function sendWorkerMessage(
    message: WorkerMessage | Omit<WorkerMessage, 'data'>,
    ports: MessagePortOrWorker[]
) {
    const msg: string = createWorkerMessage(message);

    ports.forEach((port: MessagePortOrWorker) => port.postMessage(msg));
}
