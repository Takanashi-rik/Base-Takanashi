require("./seting/settings");

const {
    default: makeWaSocket,
    socket,
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType,
} = require("@whiskeysockets/baileys");

const { modul } = require("./lib/module");
const { exec, spawn, execSync } = require("child_process");
const { os, axios, baileys, chalk, cheerio, FileType, fs, PhoneNumber, process, moment, ms, util, ytdl } = modul;

const { color, bgcolor } = require("./lib/color");
const { delay } = require("@whiskeysockets/baileys");

const readFile = util.promisify(fs.readFile);
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const path = require("path");

module.exports = conn = async (conn, m, chatUpdate, store) => {
    try {
        async function appenTextMessage(text, chatUpdate) {
            let messages = await generateWAMessage(
                m.chat,
                {
                    text: text,
                    mentions: m.mentionedJid,
                },
                {
                    userJid: conn.user.id,
                    quoted: m.quoted && m.quoted.fakeObj,
                },
            );

            messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id);
            messages.key.id = m.key.id;
            messages.pushName = m.pushName;

            if (m.isGroup) messages.participant = m.sender;

            let msg = {
                ...chatUpdate,
                messages: [proto.WebMessageInfo.fromObject(messages)],
                type: "append",
            };

            conn.ev.emit("messages.upsert", msg);
        }

        const { type, quotedMsg, mentioned, now, fromMe } = m;

        let body =
            m.mtype === "interactiveResponseMessage"
                ? JSON.parse(
                    m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson,
                ).id
                : m.mtype === "conversation"
                    ? m.message.conversation
                    : m.mtype == "imageMessage"
                        ? m.message.imageMessage.caption
                        : m.mtype == "videoMessage"
                            ? m.message.videoMessage.caption
                            : m.mtype == "extendedTextMessage"
                                ? m.message.extendedTextMessage.text
                                : m.mtype == "buttonsResponseMessage"
                                    ? m.message.buttonsResponseMessage.selectedButtonId
                                    : m.mtype == "listResponseMessage"
                                        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
                                        : m.mtype == "templateButtonReplyMessage"
                                            ? m.message.templateButtonReplyMessage.selectedId
                                            : m.mtype == "messageContextInfo"
                                                ? m.message.buttonsResponseMessage?.selectedButtonId ||
                                                  m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
                                                  m.text
                                                : m.mtype === "editedMessage"
                                                    ? m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage
                                                        ? m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage.text
                                                        : m.message.editedMessage.message.protocolMessage.editedMessage.conversation
                                                    : "";

    const {
      clockString,
      parseMention,
      formatp,
      isUrl,
      sleep,
      runtime,
      getBuffer,
      jsonformat,
      format,
      capital,
      reSize,
      generateProfilePicture,
    } = require("./lib/myfunc");
    
    const premium = JSON.parse(fs.readFileSync("./database/premium.json"));

    const budy = typeof m.text == "string" ? m.text : ".";
    const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><`™©®Δ^βα¦|/\\©^]/.test(body)
      ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!`™©®Δ^βα¦|/\\©^]/gi)
  : ".";
    const chath = body;
    const pes = body;
    const messagesC = pes.slice(0).trim();
    const content = JSON.stringify(m.message);
    const isCmd = body.startsWith(prefix);
    const from = m.key.remoteJid;
    const messagesD = body.slice(0).trim().split(/ +/).shift().toLowerCase();
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const botNumber = await conn.decodeJid(conn.user.id);
    const isCreator =
      m.sender === global.ownernumber.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    const pushname = m.pushName || "Nothing";
    const text = (q = args.join(" "));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const qmsg = quoted.msg || quoted;
    const isMedia = /image|video|sticker|audio/.test(mime);

    const isImage = type == "imageMessage";
    const isVideo = type == "videoMessage";
    const isAudio = type == "audioMessage";
    const isSticker = type == "stickerMessage";

    const isQuotedImage =
      type === "extendedTextMessage" && content.includes("imageMessage");
    const isQuotedLocation =
      type === "extendedTextMessage" && content.includes("locationMessage");
    const isQuotedVideo =
      type === "extendedTextMessage" && content.includes("videoMessage");
    const isQuotedSticker =
      type === "extendedTextMessage" && content.includes("stickerMessage");
    const isQuotedAudio =
  type === "extendedTextMessage" && content.includes("audioMessage");
    const isQuotedContact =
      type === "extendedTextMessage" && content.includes("contactMessage");
    const isQuotedDocument =
      type === "extendedTextMessage" && content.includes("documentMessage");

    const sender = m.isGroup
      ? m.key.participant
        ? m.key.participant
        : m.participant
      : m.key.remoteJid;

    const senderNumber = sender.split("@")[0];

    const groupMetadata = m.isGroup
      ? await conn.groupMetadata(m.chat).catch((e) => {})
      : "";
    const participants =
      m.isGroup && groupMetadata ? groupMetadata.participants : [];
    const groupAdmins = m.isGroup
      ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
      : [];
    const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : [];
    const groupOwner = m.isGroup && groupMetadata ? groupMetadata.owner : [];
    const groupMembership =
      m.isGroup && groupMetadata ? groupMetadata.membership : [];
    const groupMembers =
      m.isGroup && groupMetadata ? groupMetadata.participants : [];

    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const isPremium = premium.includes(m.sender);

    const mentionUser = [
      ...new Set([
        ...(m.mentionedJid || []),
        ...(m.quoted ? [m.quoted.sender] : []),
      ]),
    ];

    const mentionByTag =
      type == "extendedTextMessage" &&
      m.message.extendedTextMessage.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.mentionedJid
        : [];

    const mentionByReply =
      type == "extendedTextMessage" &&
      m.message.extendedTextMessage.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.participant || ""
        : "";

    const numberQuery =
      q.replace(new RegExp("[()+-/ +/]", "gi"), "") + "@s.whatsapp.net";

    const usernya = mentionByReply ? mentionByReply : mentionByTag[0];

    const Input = mentionByTag[0]
      ? mentionByTag[0]
      : mentionByReply
      ? mentionByReply
      : q
      ? numberQuery
      : false;

    const xtime = moment.tz("Asia/Jakarta").format("HH:mm:ss");
    const xdate = moment.tz("Asia/Jakarta").format("DD/MM/YYYY");
    const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
    
    if (time2 < "23:59:00") {
      var timewisher = `Selamat Malam`;
    }
    if (time2 < "19:00:00") {
      var timewisher = `Selamat Malam`;
    }
    if (time2 < "18:00:00") {
      var timewisher = `Selamat Sore`;
    }
    if (time2 < "15:00:00") {
      var timewisher = `Selamat Siang`;
    }
    if (time2 < "11:00:00") {
      var timewisher = `Selamat Pagi`;
    }
    if (time2 < "05:00:00") {
      var timewisher = `Selamat Pagi`;
    }
    
    let sekarang = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );
    
    function tanggal(ms) {
      return new Date(ms).getDate().toString().padStart(2, "0");
    }
    
    function bulan(ms) {
      return (new Date(ms).getMonth() + 1).toString().padStart(2, "0");
    }
    
    function tahun(ms) {
      return new Date(ms).getFullYear();
    }
    
    function formatJam(date) {
      let jam = date.getHours().toString().padStart(2, "0");
      let menit = date.getMinutes().toString().padStart(2, "0");
      let detik = date.getSeconds().toString().padStart(2, "0");
      return `${jam}:${menit}:${detik}`;
    }
    
    let futureDescription = `
📅 *Update Kurs:* ${tanggal(sekarang.getTime())}/${bulan(sekarang.getTime())}/${tahun(sekarang.getTime())}
🕰 *Waktu Jakarta (WIB):* ${formatJam(sekarang)}`;

    const qtext = {
        key: { 
            remoteJid: "status@broadcast", 
            participant: "0@s.whatsapp.net" 
        },
        message: { 
            extendedTextMessage: { 
                text: `${prefix + command}` 
            } 
        }
    };

    const qbug = {
        key: { 
            remoteJid: "status@broadcast", 
            fromMe: false, 
            participant: "0@s.whatsapp.net" 
        },
        message: { 
            listResponseMessage: { 
                title: `ꪎ ${global.ownername}` 
            } 
        }
    };

    const qdoc = {
        key: { 
            participant: "0@s.whatsapp.net", 
            ...(m.chat ? { remoteJid: "status@broadcast" } : {}) 
        },
        message: { 
            documentMessage: { 
                title: `ꪎ ${global.ownername}`, 
                jpegThumbnail: "" 
            } 
        }
    };

const qloc = {
    key: { 
        participant: "0@s.whatsapp.net", 
        ...(m.chat ? { remoteJid: "status@broadcast" } : {}) 
    },
    message: { 
        locationMessage: { 
            name: `ꪎ ${global.ownername}`, 
            jpegThumbnail: "" 
        } 
    }
};

const qloc2 = {
    key: { 
        participant: "0@s.whatsapp.net", 
        ...(m.chat ? { remoteJid: "status@broadcast" } : {}) 
    },
    message: { 
        locationMessage: { 
            name: `ꪎ ${global.ownername}`, 
            jpegThumbnail: "" 
        } 
    }
};

const qpayment = {
    key: { 
        remoteJid: "0@s.whatsapp.net", 
        fromMe: false, 
        id: "ownername", 
        participant: "0@s.whatsapp.net" 
    },
    message: { 
        requestPaymentMessage: { 
            currencyCodeIso4217: "USD", 
            amount1000: 999999999, 
            requestFrom: "0@s.whatsapp.net", 
            noteMessage: { 
                extendedTextMessage: { 
                    text: "Simple Bot" 
                } 
            }, 
            expiryTimestamp: 999999999, 
            amount: { 
                value: 91929291929, 
                offset: 1000, 
                currencyCode: "USD" 
            } 
        } 
    }
};

const qtoko = {
    key: { 
        fromMe: false, 
        participant: "0@s.whatsapp.net", 
        ...(m.chat ? { remoteJid: "status@broadcast" } : {}) 
    },
    message: { 
        productMessage: { 
            product: { 
                productImage: { 
                    mimetype: "image/jpeg", 
                    jpegThumbnail: "" 
                }, 
                title: `ꪎ ${global.ownername}`, 
                description: null, 
                currencyCode: "IDR", 
                priceAmount1000: "999999999999999", 
                retailerId: `ꪎ ${global.ownername}`, 
                productImageCount: 1 
            }, 
            businessOwnerJid: "0@s.whatsapp.net" 
        } 
    }
};

const qlive = {
    key: { 
        participant: "0@s.whatsapp.net", 
        ...(m.chat ? { remoteJid: "status@broadcast" } : {}) 
    },
    message: { 
        liveLocationMessage: { 
            caption: `ꪎ ${global.ownername}`, 
            jpegThumbnail: "" 
        } 
    }
};

    async function reply(txt) {
      const Akame = {
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: `Information With ${namabot}`,
            newsletterJid: `120363405649403674@newsletter`,
          },
          externalAdReply: {
            showAdAttribution: false,
            title: `- ${namabot} AI`,
            body: '',
            thumbnailUrl: `${global.thumnreply}`,
            sourceUrl: global.website,
          },
        },
        text: txt,
      }
      return conn.sendMessage(m.chat, Akame, {
        quoted: m,
      })
    }

    const reply2 = (teks) => {
      conn.sendMessage(from, { text: teks }, { quoted: m })
    }

    const example = (teks) => {
      return `\n *Contoh Penggunaan :*\n Ketik *${prefix + command}* ${teks}\n`
    }

    if (!conn.public && !m.key.fromMe && !global.ownernumber.includes(m.sender.split("@")[0])) {
      return;
    }

    if (m.message) {
      const time = chalk.yellow(moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss'))
      const msgType = chalk.cyan(budy ? budy : m.mtype)
      const senderName = `${chalk.green(pushname)}`
      const jid = chalk.gray(`${m.sender}`)
      const lid = chalk.gray(`${m.chat}`)
      const location = m.isGroup
        ? `${chalk.blue('🍬 Group:')} ${chalk.yellow(groupName)}`
        : chalk.blue('🧁 Private Chat')

      console.log(
        `${chalk.white('─'.repeat(15) + ' NEW MESSAGE ' + '─'.repeat(15))}
🧁 ↳ ${time}
🍭 ↳ ${msgType}
🍩 ↳ ${senderName}
🍫 ↳ ${jid}
🍪 ↳ ${lid}
🎂 ↳ ${location}
${chalk.white('─'.repeat(45))}`
      )
    }

    async function sendconnMessage(chatId, message, options = {}) {
      let generate = await generateWAMessage(chatId, message, options);
      let type2 = getContentType(generate.message);
      if ("contextInfo" in options)
        generate.message[type2].contextInfo = options?.contextInfo;
      if ("contextInfo" in message)
        generate.message[type2].contextInfo = message?.contextInfo;
      return await conn.relayMessage(chatId, generate.message, {
        messageId: generate.key.id,
      });
    }

    function GetType(Data) {
      return new Promise((resolve, reject) => {
        let Result, Status;
        if (Buffer.isBuffer(Data)) {
          Result = new Buffer.from(Data).toString("base64");
          Status = 0;
        } else {
          Status = 1;
        }
        resolve({
          status: Status,
          result: Result,
        });
      });
    }

    function randomId() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    function monospace(string) {
      return '```' + string + '```'
    }

    function monospa(string) {
      return '`' + string + '`'
    }

    function getRandomFile(ext) {
      return `${Math.floor(Math.random() * 10000)}${ext}`;
    }

    function pickRandom(list) {
      return list[Math.floor(Math.random() * list.length)]
    }

    function randomNomor(min, max = null) {
      if (max !== null) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        return Math.floor(Math.random() * min) + 1
      }
    }

    function generateRandomPassword() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
      const length = 10;
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    }

    function generateRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function listbut2(m, teks, listnye, qtext) {
      let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            "messageContextInfo": {
              "deviceListMetadata": {},
              "deviceListMetadataVersion": 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: `120363405649403674@newsletter`,
                  newsletterName: `— ${namabot} AI WhatsApp Bot`,
                  serverMessageId: 145
                }
              },
              body: proto.Message.InteractiveMessage.Body.create({
                text: teks
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: `${namabot} By ${ownername}`
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: ``,
                thumbnailUrl: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: true,
                ...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/rj0ok0.jpg' } }, { upload: conn.waUploadToServer })),
              }),
              gifPlayback: true,
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    "name": "single_select",
                    "buttonParamsJson": JSON.stringify(listnye)
                  }],
              }),
            })
          }
        }
      }, { quoted: qtext })
      await conn.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      })
    }

    async function dellCase(filePath, caseNameToRemove) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Terjadi kesalahan:', err);
          return;
        }

        const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g');
        const modifiedData = data.replace(regex, '');

        fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
          if (err) {
            console.error('Terjadi kesalahan saat menulis file:', err);
            return;
          }

          console.log(`Teks dari case '${caseNameToRemove}' telah dihapus dari file.`);
        });
      });
    }

    const pluginsLoader = async (directory) => {
      let plugins = [];
      const folders = fs.readdirSync(directory);
      folders.forEach((file) => {
        const filePath = path.join(directory, file);
        if (filePath.endsWith(".js")) {
          try {
            const resolvedPath = require.resolve(filePath);
            if (require.cache[resolvedPath]) {
              delete require.cache[resolvedPath];
            }
            const plugin = require(filePath);
            plugins.push(plugin);
          } catch (error) {
            console.log(`Error loading plugin at ${filePath}:`, error);
          }
        }
      });
      return plugins;
    };

    let pluginsDisable = true;
    const plugins = await pluginsLoader(path.resolve(__dirname, "plugins"));
    const kyykzy = { conn, prefix, command, reply, text, isGroup: m.isGroup, isCreator, example, sender, senderNumber, pushname, args, runtime, formatp, sleep, getBuffer, isBotAdmins, isAdmins, isCmd, qtext, isPremium, randomNomor, monospace, pickRandom, getRandomFile };
    
    for (let plugin of plugins) {
      if (plugin.command.find((e) => e == command.toLowerCase())) {
        pluginsDisable = false;
        if (typeof plugin !== "function") return;
        await plugin(m, kyykzy);
      }
    }
    
    if (!pluginsDisable) return;

    switch (command) {
      case 'menu': {
        let teks = `*@${sender.split("@")[0]}* 👋🏻

⚊ info user
▢ nama : ${pushname}
▢ tag : @${sender.split("@")[0]}

⚊ menu main
▢ ${prefix}loli
▢ ${prefix}runtime

⚊ menu owner
▢ ${prefix}addplugin
▢ ${prefix}delplugin
▢ ${prefix}addcase
▢ ${prefix}delcase
▢ ${prefix}addprem
▢ ${prefix}listprem
▢ ${prefix}delprem
▢ ${prefix}self
▢ ${prefix}public`
        
        const listnye = {
          title: 'LIST MENU',
          sections: [
            {
              title: 'INFORMATION',
              rows: [
                { title: 'Script 📥', description: 'Display Script', id: '.sc' },
                { title: 'Donasi 💳', description: 'Mendukung Perkembangan', id: '.donasi' }
              ]
            },
            {
              title: 'LIST MENU',
              highlight_label: 'Recomend',
              rows: [
                { title: 'AllMenu ⚡', description: 'Menampilkan Allmenu', id: '.allmenu' },
              ]
            }
          ]
        }
        
        listbut2(m, teks, listnye, qtext)
      }
      break

      case "runtime": {
        let lowq = `*Telah Online Selama:*\n${runtime(process.uptime())}*`;
        m.reply(`${lowq}`);
      }
      break

      case 'addcase': {
        if (!isCreator) return reply(mess.creator)
        if (!text) return reply('Mana case nya');
        
        const fs = require('fs');
        const namaFile = 'case.js';
        const caseBaru = `${text}`;
        
        fs.readFile(namaFile, 'utf8', (err, data) => {
          if (err) {
            console.error('Terjadi kesalahan saat membaca file:', err);
            return;
          }
          
          const posisiAwalGimage = data.indexOf("case 'addcase':");

          if (posisiAwalGimage !== -1) {
            const kodeBaruLengkap = data.slice(0, posisiAwalGimage) + '\n' + caseBaru + '\n' + data.slice(posisiAwalGimage);
            fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
              if (err) {
                reply('Terjadi kesalahan saat menulis file:', err);
              } else {
                reply('Sukses Menambahkan Fitur\nJika Ingin Menginfokan Ss Dan Reply Ssan Barcaption .newfitur');
              }
            });
          } else {
            reply('Tidak dapat menambahkan case dalam file.');
          }
        });
      }
      break

      case 'delcase': {
        if (!isCreator) return reply('Fitur Khusus Owner!')
        if (!text) return reply('Mana case nya bang?');
        dellCase('./case.js', q)
        m.reply('Berhasil menghapus case!.');
      }
      break

      case "addprem": {
        if (!isCreator) return
        if (!args[0]) return m.reply(`Penggunaan ${prefix + command} nomor\nContoh ${prefix + command} ${global.owner}`)
        
        let prrkek = q.split("|")[0].replace(/[^0-9]/g, '') + `@s.whatsapp.net`
        let ceknya = await conn.onWhatsApp(prrkek)
        
        if (ceknya.length == 0) return m.reply(`Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`)
        
        premium.push(prrkek)
        fs.writeFileSync("./database/premium.json", JSON.stringify(premium))
        m.reply(`Successfully Added ${prrkek} To Database`)
      }
      break

      case "delprem": {
        if (!isCreator) return
        if (!args[0]) return m.reply(`Penggunaan ${prefix + command} nomor\nContoh ${prefix + command} ${global.owner}`)
        
        let ya = q.split("|")[0].replace(/[^0-9]/g, '') + `@s.whatsapp.net`
        let unp = premium.indexOf(ya)
        premium.splice(unp, 1)
        fs.writeFileSync("./database/premium.json", JSON.stringify(premium))
        m.reply(`Successfully Removed ${ya} From Database`)
      }
      break

      case "listprem": {
        if (!isCreator) return m.reply("❗ *Access Denied*\nFitur Only `Owner`")
        
        let premList = JSON.parse(fs.readFileSync("./database/premium.json"));

        if (premList.length === 0) return m.reply("⚠️ Tidak ada Premium yang terdaftar!");
        
        let text = "💭 *Daftar Premium:*\n\n";
        premList.forEach((prrem, index) => {
          text += `- ${index + 1}. @${prrem}\n`;
        });
        
        conn.sendMessage(m.chat, { text, mentions: premList.map(v => v + "@s.whatsapp.net") }, { quoted: qtext });
      }
      break

      case 'self':
        if (!isCreator) return m.reply('Khusus owner!')
        conn.public = false
        m.reply('Berhasil masuk ke mode *Self* (hanya owner yang bisa menggunakan bot)')
        break

      case 'public':
        if (!isCreator) return m.reply('Khusus owner!')
        conn.public = true
        m.reply('Berhasil masuk ke mode *Public* (semua orang bisa menggunakan bot)')
        break

      default:
        if (budy.startsWith('=>')) {
          if (!isCreator) return

          function Return(sul) {
            sat = JSON.stringify(sul, null, 2)
            bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return m.reply(bang)
          }
          
          try {
            m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
          } catch (e) {
            m.reply(String(e))
          }
        }

        if (budy.startsWith('>')) {
          if (!isCreator) return;
          
          try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            await m.reply(evaled);
          } catch (err) {
            m.reply(String(err));
          }
        }

        if (budy.startsWith('$')) {
          if (!isCreator) return
          
          exec(budy.slice(2), (err, stdout) => {
            if (err) return m.reply(`${err}`)
            if (stdout) return m.reply(stdout)
          })
        }
    }
  } catch (err) {
    console.log(util.format(err))
  }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright(`Update ${__filename}`))
  delete require.cache[file]
  require(file)
})


