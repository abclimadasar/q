let handler = async (m, { conn, args }) => {
    conn.chatbot = conn.chatbot || {};
    let id = m.chat;

    if (args[0] === 'start') {
        if (conn.chatbot[id]) {
            return conn.reply(m.chat, '*Kamu masih berada di dalam chatbot chat, menunggu partner*', m);
        }

        conn.chatbot[id] = {
            id,
            a: '6281295891971@s.whatsapp.net',
            b: m.sender,
            state: 'WAITING',
            check: who => [conn.a, conn.b].includes(who),
            other: who => who === conn.a ? conn.b : who === conn.b ? conn.a : ''
        };

        let room = Object.values(conn.chatbot).find(room => room.state === 'WAITING' && !room.check(m.sender));

        if (room) {
            await conn.reply(room.b, '*Silahkan kirim pesan anda.*', m);
            room.b = m.sender;
            room.state = 'CHATTING';
        } else {
            await conn.reply('6281295891971@s.whatsapp.net', 'halo', null);
            await conn.reply(room.b, '*Menunggu respon...*', m);
        }
    } else if (args[0] === 'stop') {
        let activeRoom = conn.chatbot[id];
        if (activeRoom) {
            delete conn.chatbot[id];
            return conn.reply(activeRoom.b, '*Sesi chatbot chat dihentikan*', m);
        } else {
            return conn.reply(m.chat, '*Kamu tidak sedang dalam sesi chatbot chat*', m);
        }
    } else {
        const usage = `*Cara Penggunaan:*\n\n/chatbot start - Memulai sesi chatbot chat\n/chatbot stop - Menghentikan sesi chatbot chat`;
        return conn.reply(m.chat, `Input salah. ${usage}`, m);
    }
};

handler.help = ['chatbot start', 'chatbot stop'];
handler.tags = ['fun'];
handler.command = ['chatbot'];
handler.private = true;

export default handler;