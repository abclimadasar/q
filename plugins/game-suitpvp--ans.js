export async function before(m) {
        this.suit = this.suit ? this.suit : {};
        if (global.db.data.users[m.sender].suit < 0)
            global.db.data.users[m.sender].suit = 0;
        let room = Object.values(this.suit).find(
            (room) =>
            room.id &&
            room.status && [room.p, room.p2].includes(m.sender)
        );
        if (room) {
            let win = "";
            let tie = false;
            
            if (
                m.sender == room.p2 &&
                /^(|terima|gas|oke?|tolak|gamau|nanti|ga(k.)?bisa)/i.test(
                    m.text
                ) &&
                m.isGroup &&
                room.status === "wait"
            ) {
                
                if (/^(tolak|gamau|nanti|ga(k.)?bisa)/i.test(m.text)) {
                let tolak = `@${room.p2.split`@`[0]} menolak suit, suit dibatalkan`
                    m.reply(
                        tolak,
                        m, {
                            mentions: this.parseMention(tolak)
                        }
                    );
                    delete this.suit[room.id];
                    return true;
                }
                room.status = "play";
                room.asal = m.chat;
                clearTimeout(room.waktu);
                //delete room[room.id].waktu
                m.reply(
                    `Suit telah dikirimkan ke chat\n@${room.p.split`@`[0]} dan\n@${room.p2.split`@`[0]}\n\nSilahkan pilih suit di chat masing-masing:\nklik [wa.me/${conn.user.jid.split`@`[0]}](wa.me/${conn.user.jid.split`@`[0]})`,
                    m.chat, {
                        mentions: [room.p, room.p2],
                    }
                );

                if (!room.pilih)
                    this.reply(
                        room.p,
                        `Silahkan pilih\nMenang +${room.poin}XP\nKalah -${room.poin_lose}XP\n\nBatu🗿 ( Batu )\nKertas📄 ( Kertas )\nGunting✂️ ( Gunting )`,
                        m);
                if (!room.pilih2)
                    this.reply(
                        room.p2,
                        `Silahkan pilih\nMenang +${room.poin}XP\nKalah -${room.poin_lose}XP\n\nBatu🗿 ( Batu )\nKertas📄 ( Kertas )\nGunting✂️ ( Gunting )`,
                        m
                    );
                room.waktu_milih = setTimeout(() => {
                    if (!room.pilih && !room.pilih2)
                        this.reply(m.chat, `Kedua pemain tidak niat main,\nSuit dibatalkan`);
                    else if (!room.pilih || !room.pilih2) {
                        win = !room.pilih ? room.p2 : room.p;
                        this.reply(
                            m.chat,
                            `@${
              (room.pilih ? room.p2 : room.p).split`@`[0]
            } tidak memilih suit, game berakhir.`,
                            m
                        );
                        global.db.data.users[win == room.p ? room.p : room.p2].exp +=
                            room.poin;
                        global.db.data.users[win == room.p ? room.p2 : room.p].exp -=
                            room.poin_lose;
                    }
                    delete this.suit[room.id];
                    return true;
                }, room.timeout);
            }
            
            let jwb = m.sender == room.p;
            let jwb2 = m.sender == room.p2;
            let g = /gunting/i;
            let b = /batu/i;
            let k = /kertas/i;
            let reg = /^(gunting|batu|kertas)/i;
            if (jwb && .test(m.text) && !room.pilih && !m.isGroup) {
                room.pilih = reg.exec(m.text.toLowerCase())[0];
                room.text = m.text;
                m.reply(
                    `Kamu telah memilih ${m.text}.${
          !room.pilih2 ? `\n\nMenunggu lawan memilih` : ""
        }`
                );
                if (!room.pilih2)
                    this.reply(room.p2, "_Lawan sudah memilih_\nSekarang giliran kamu", (jwb2 && reg.test(m.text) && !room.pilih2 && !m.isGroup) {
                            room.pilih2 = reg.exec(m.text.toLowerCase())[0];
                            room.text2 = m.text;
                            m.reply(
                                `Kamu telah memilih ${m.text}.${
          !room.pilih ? `\n\nMenunggu lawan memilih` : ""
        }`
                            );
                            if (!room.pilih)
                                this.reply(room.p, "_Lawan sudah memilih_\nSekarang giliran kamu", 0);
                        }
                        let stage = room.pilih;
                        let stage2 = room.pilih2;
                        if (room.pilih && room.pilih2) {
                            clearTimeout(room.waktu_milih);
                            if (b.test(stage) && g.test(stage2)) win = room.p;
                            else if (b.test(stage) && k.test(stage2)) win = room.p2;
                            else if (g.test(stage) && k.test(stage2)) win = room.p;
                            else if (g.test(stage) && b.test(stage2)) win = room.p2;
                            else if (k.test(stage) && b.test(stage2)) win = room.p;
                            else if (k.test(stage) && g.test(stage2)) win = room.p2;
                            else if (stage == stage2) tie = true;
                            this.reply(
                                room.asal,
                                `_*Hasil Suit*_${tie ? "\nSERI" : ""}\n\n@${room.p.split`@`[0]} (${
          room.text
        })${
          tie
            ? ""
            : room.p == win
            ? ` Menang\n+${room.poin}XP`
            : ` Kalah\n.poin_lose}XP`
        }\n@${room.p2.split`@`[0]} (${room.text2})${
          tie
            ? ""
            : room.p2 == win
            ? ` Menang\n+${room.poin}XP`
            : ` Kalah\n-${room.poin_lose}XP`
        }`.trim(),
                                m, {
                                    mentions: [room.p, room.p2]
                                }
                            );
                            if (!tie) {
                                global.db.data.users[win == room.p ? room.p : room.p2].exp +=
                                    room.poin;
                                global.db.data.users[win == room.p ? room.p2 : room.p].exp +=
                                    room.poin_lose;
                            }
                            delete this.suit[room.id];
                        }
                    }
                return true;
            }