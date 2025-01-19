import { io } from "../app";
// may also send a mail to the admins confirming shit?

export default function announceSingle(teamId, message){
    io.emit(`/phase/${teamId}`, message)
}

export default function announceAll(message){
    io.emit('/all', message)
}