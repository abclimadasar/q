let handler = async (m, { conn, args }) => {
    conn.youchat = conn.youchat || {};
    let id = m.chat;

    if (args[0] === 'start') {
        if (conn.youchat[id]) {
            return conn.reply(m.chat, '*Kamu masih berada di dalam youchat chat, menunggu partner*', m);
        }

        conn.youchat[id] = {
            id,
            a: '15854968266@s.whatsapp.net',
            b: m.sender,
            state: 'WAITING',
            check: who => [conn.a, conn.b].includes(who),
            other: who => who === conn.a ? conn.b : who === conn.b ? conn.a : ''
        };

        let room = Object.values(conn.youchat).find(room => room.state === 'WAITING' && !room.check(m.sender));

        if (room) {
            await conn.reply(room.b, '*Silahkan kirim pesan anda.*', m);
            room.b = m.sender;
            room.state = 'CHATTING';
        } else {
            await conn.reply('15854968266@s.whatsapp.net', 'you are bot?', null);
            await conn.reply(room.b, '*Menunggu respon...*', m);
        }
    } else if (args[0] === 'stop') {
        let activeRoom = conn.youchat[id];
        if (activeRoom) {
            delete conn.youchat[id];
            return conn.reply(activeRoom.b, '*Sesi youchat chat dihentikan*', m);
        } else {
            return conn.reply(m.chat, '*Kamu tidak sedang dalam sesi youchat chat*', m);
        }
    } else {
        const usage = `*Cara Penggunaan:*\n\n/youchat start - Memulai sesi youchat chat\n/youchat stop - Menghentikan sesi youchat chat`;
        return conn.reply(m.chat, `Input salah. ${usage}`, m);
    }
};

handler.help = ['youchat start', 'youchat stop'];
handler.tags = ['fun'];
handler.command = ['youchat'];
handler.private = true;

export default handler;