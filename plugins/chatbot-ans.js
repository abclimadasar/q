export async function before(m, { match }) {
    if (!m.chat.endsWith('@s.whatsapp.net')) return false;
    this.chatbot = this.chatbot || {};
    let room = Object.values(this.chatbot).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING');
    if (room && /^.*(chatbot stop)/.test(m.text)) {
        return false;
    }
    if (room) {
        let other = [room.a, room.b].find(user => user !== m.sender);
        await this.relayMessage(other, m.message, { messageId: m.id });
    }
    return true;
}