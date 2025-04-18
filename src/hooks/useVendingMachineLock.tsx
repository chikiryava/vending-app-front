import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";

export const useMachineLock = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isBusy, setIsBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const connect =()=>{
        const sessionId = localStorage.getItem("sessionId") || Math.random().toString(36).substr(2, 9);
        localStorage.setItem("sessionId", sessionId);

        const newConnection = new HubConnectionBuilder()
            .withUrl(`https://localhost:7153/vendingMachineHub?sessionId=${sessionId}`, {
                withCredentials: false
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

    }

    useEffect(() => {
        connect();

    }, []);

    useEffect(() => {
        if (!connection) return;

        connection
            .start()
            .then(() => {
                console.log("Connected to MachineHub");

                connection.on("MachineBusy", () => {
                    console.log("Аппарат занят");
                    setIsBusy(true);
                    setMessage("Аппарат в данный момент занят другим пользователем");
                });

                connection.on("MachineLocked", () => {
                    console.log("Аппарат закрыт");
                    setIsBusy(true);
                    setMessage("Вы используете аппарат");
                });

                connection.on("MachineUnlocked", () => {
                    console.log("Аппарат открыт");
                    setIsBusy(false);
                    setMessage(null);

                    connect();
                });

                connection.invoke("TryLock").then((success) => {
                    if (!success) {
                        setIsBusy(true);
                    }
                });
            })
            .catch((err) => {
                console.error("Ошибка подключения: ", err);
                setMessage("Ошибка подключения");
            });

        return () => {
            if (connection) {
                connection.invoke("Unlock").catch(() => {});
                connection.stop();
            }
        };
    }, [connection]);

    return { isBusy, message };
};
