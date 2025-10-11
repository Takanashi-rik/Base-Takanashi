require("./seting/settings");
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, delay, Browsers, makeCacheableSignalKeyStore, jidDecode } = require('@whiskeysockets/baileys');

const { modul } = require("./lib/module");
const moment = require("moment-timezone");
const figlet = require("figlet");
const gradient = require("gradient-string");
const { baileys, chalk, fs, FileType, path, pino, PhoneNumber, axios, } = modul;
const { makeInMemoryStore } = require("./lib/store/");
const { tanggal, day, bulan, tahun, weton } = require("./lib/myfunc");
const { color, bgcolor } = require("./lib/color");
const { uncache, nocache } = require("./lib/loader");
const { handleIncomingMessage } = require("./lib/user");
const Pino = require("pino");
const readline = require("readline");
const yargs = require('yargs/yargs')
const _ = require('lodash')
const NodeCache = require("node-cache");

const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep, reSize, } = require("./lib/myfunc");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('./lib/exif')
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const prefix = "";
const type = (x) => x?.constructor?.name || (x === null ? "null" : "undefined");
const isStringSame = (x, y) => (Array.isArray(y) ? y.includes(x) : y === x);
const buttonTypes = [];
const customCode = 'CUSTOMCD' 

var low
try {
low = require('lowdb')
} catch (e) {
low = require('./lib/lowdb')}
const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')

const store = makeInMemoryStore({
  logger: pino().child({
    level: "silent",
    stream: "store",
  }),
});

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
/https?:\/\//.test(opts['db'] || '') ?
new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
new mongoDB(opts['db']) :
new JSONFile(`./database/database.json`)
)
global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
if (global.db.data !== null) return
global.db.READ = true
await global.db.read()
global.db.READ = false
global.db.data = {
users: {},
chats: {},
game: {},
database: {},
settings: {},
setting: {},
others: {},
sticker: {},
...(global.db.data || {})}
  global.db.chain = _.chain(global.db.data)}
loadDatabase()

let phoneNumber = `${nomorbot}`;
const pairingCode = false;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, resolve)
    })
};

async function startsesi() {
  const { saveCreds, state } = await useMultiFileAuthState(`./session`);
  const msgRetryCounterCache = new NodeCache();
  const syncKeys = async () => {
    try {
      await saveCreds(state.creds);
    } catch (err) {
      console.error("Key synchronization failed:", err);
    }
  };
  const conn = makeWASocket({
        logger: pino({
            level: "silent"
    }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Safari"),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "silent" })),
    },
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: false,
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid);
      let msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    },
    msgRetryCounterCache,
  });
  syncKeys();
  if (store) {
    store.bind(conn.ev);
  }
  conn.ev.on("creds.update", saveCreds);

  if (!conn.authState.creds.registered) {
    console.log("🍰 Proses membuat pairing code... 🧁");
  
    const number = phoneNumber;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(6000);

    const code = await conn.requestPairingCode(number, customCode);

      console.log(
        chalk.white(chalk.bgMagenta(" 🍭 Your Pairing Code 🍭 ")) + "\n" +
        chalk.cyan(" 🍬 ") + chalk.white.bold(code) + chalk.cyan(" 🍬 ") + "\n" +
        chalk.yellow(" 🧁 Masukkan kode ini di WhatsApp kamu! 🍩 ")
      );
  }

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "connecting") {
      console.log(chalk.yellow(" 🍡 Connecting to WhatsApp... 🍰 "));
    } 
  
    else if (connection === "open") {
      conn.newsletterFollow("120363405649403674@newsletter");
      conn.newsletterFollow("120363419884279670@newsletter");

      console.log(
        chalk.green.bold(" 🍓 Connected Successfully to WhatsApp 🍧 ") + "\n" +
        chalk.magenta(" 🎂 Bot sudah siap digunakan! 🍦 ") + "\n" +
        chalk.cyan(" 🍭 Have a sweet day! 🍪 ")
      );

      conn.sendMessage("6288286624778@s.whatsapp.net", {
        text: "🍓 Connect To Base Success! 🍦\n🍰 Bot is now online and ready! 🧁",
      });
    } 
  
    else if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (statusCode === DisconnectReason.loggedOut) {
        console.log(chalk.red(" 🍫 Session logged out, restarting... 🍩 "));
      } else {
        console.log(chalk.yellow(" 🍬 Connection closed, reconnecting... 🧁 "));
      }

      startsesi();
      console.log(chalk.cyan(" 🍡 Attempting to reconnect... 🍰 "));
    }
  });
  
  conn.ev.on("messages.upsert", async (chatUpdate) => {
  try {
    const kay = chatUpdate.messages[0];
    if (!kay.message) return;

    kay.message =
      Object.keys(kay.message)[0] === "ephemeralMessage"
        ? kay.message.ephemeralMessage.message
        : kay.message;

    const m = smsg(conn, kay, store);

if (
  !conn.public &&
  !(
    kay.key.fromMe ||
    (kay.key.participant &&
      global.ownernumber.includes(kay.key.participant.split("@")[0])) ||
    global.ownernumber.includes(m.sender.split("@")[0]) ||
    botNumber.includes(m.sender.split("@")[0])
  ) &&
  chatUpdate.type === "notify"
) {
  return;
}

  conn.public = true;

    if (kay.key.id.startsWith("BAE5") && kay.key.id.length === 16) return;

    if (
      !m.key.fromMe &&
      m.key.remoteJid.endsWith("@s.whatsapp.net") &&
      m.text
    ) {
      handleIncomingMessage(conn, m.key.remoteJid);
    }

    require("./case")(conn, m, chatUpdate, store);
  } catch (err) {
    console.error("Error saat memproses pesan:", err);
  }
});
  conn.ev.on("messages.update", async (chatUpdate) => {
    for (const { key, update } of chatUpdate) {
      if (update.pollUpdates && key.fromMe) {
        const pollCreation = await getMessage(key);
        if (pollCreation) {
          const pollUpdate = await getAggregateVotesInPollMessage({
            message: pollCreation,
            pollUpdates: update.pollUpdates,
          });
          var toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]?.name;
          if (toCmd == undefined) return;
          var prefCmd = prefix + toCmd;
          conn.appenTextMessage(prefCmd, chatUpdate);
        }
      }
    }
  });
  conn.sendTextWithMentions = async (jid, text, quoted, options = {}) =>
    conn.sendMessage(
      jid,
      {
        text: text,
        contextInfo: {
          mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(
            (v) => v[1] + "@s.whatsapp.net",
          ),
        },
        ...options,
      },
      {
        quoted,
      },
    );
  conn.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + "@" + decode.server) ||
        jid
      );
    } else return jid;
  };
  conn.ev.on("contacts.update", (update) => {
    for (let contact of update) {
      let id = conn.decodeJid(contact.id);
      if (store && store.contacts)
        store.contacts[id] = {
          id,
          name: contact.notify,
        };
    }
  });
  conn.getName = (jid, withoutContact = false) => {
    id = conn.decodeJid(jid);
    withoutContact = conn.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = conn.groupMetadata(id) || {};
        resolve(
          v.name ||
            v.subject ||
            PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber(
              "international",
            ),
        );
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
              id,
              name: "WhatsApp",
            }
          : id === conn.decodeJid(conn.user.id)
            ? conn.user
            : store.contacts[id] || {};
    return (
      (withoutContact ? "" : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
        "international",
      )
    );
  };
  conn.parseMention = (text = "") => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net",
    );
  };
  conn.sendContact = async (jid, kon, quoted = "", opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await conn.getName(i),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i)}\nFN:${await conn.getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${ytname}\nitem2.X-ABLabel:YouTube\nitem3.URL:${socialm}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    conn.sendMessage(
      jid,
      {
        contacts: {
          displayName: `${list.length} Contact`,
          contacts: list,
        },
        ...opts,
      },
      {
        quoted,
      },
    );
  };
  conn.setStatus = (status) => {
    conn.query({
      tag: "iq",
      attrs: {
        to: "@s.whatsapp.net",
        type: "set",
        xmlns: "status",
      },
      content: [
        {
          tag: "status",
          attrs: {},
          content: Buffer.from(status, "utf-8"),
        },
      ],
    });
    return status;
  };

  conn.sendImage = async (jid, path, caption = "", quoted = "", options) => {
    let buffer = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    return await conn.sendMessage(
      jid,
      {
        image: buffer,
        caption: caption,
        ...options,
      },
      {
        quoted,
      },
    );
  };
  conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await conn.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    ).then((response) => {
      fs.unlinkSync(buffer);
      return response;
    });
  };
  conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await conn.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    );
    return buffer;
  };
  conn.sendImageAsStickerAvatar = async (
    jid,
    path,
    quoted,
    options = {},
  ) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImgAvatar(buff, options);
    } else {
      buffer = await imageToWebpAvatar(buff);
    }
    await conn.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    ).then((response) => {
      fs.unlinkSync(buffer);
      return response;
    });
  };
  conn.sendVideoAsStickerAvatar = async (
    jid,
    path,
    quoted,
    options = {},
  ) => {
    let buff = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVidAvatar(buff, options);
    } else {
      buffer = await videoToWebpAvatar(buff);
    }
    await conn.sendMessage(
      jid,
      {
        sticker: {
          url: buffer,
        },
        ...options,
      },
      {
        quoted,
      },
    );
    return buffer;
  };
  conn.copyNForward = async (
    jid,
    message,
    forceForward = false,
    options = {},
  ) => {
    let vtype;
    if (options.readViewOnce) {
      message.message =
        message.message &&
        message.message.ephemeralMessage &&
        message.message.ephemeralMessage.message
          ? message.message.ephemeralMessage.message
          : message.message || undefined;
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete (message.message && message.message.ignore
        ? message.message.ignore
        : message.message || undefined);
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message,
      };
    }
    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo,
    };
    const waMessage = await generateWAMessageFromContent(
      jid,
      content,
      options
        ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo
              ? {
                  contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo,
                  },
                }
              : {}),
          }
        : {},
    );
    await conn.relayMessage(jid, waMessage.message, {
      messageId: waMessage.key.id,
    });
    return waMessage;
  };
  conn.downloadAndSaveMediaMessage = async (
    message,
    filename,
    attachExtension = true,
  ) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    let trueFileName;
    if (type.ext == "ogg" || type.ext == "opus") {
      trueFileName = attachExtension ? filename + ".mp3" : filename;
      await fs.writeFileSync(trueFileName, buffer);
    } else {
      trueFileName = attachExtension ? filename + "." + type.ext : filename;
      await fs.writeFileSync(trueFileName, buffer);
    }
    return trueFileName;
  };
  conn.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || "";
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, "")
      : mime.split("/")[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };
  conn.getFile = async (PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?;base64,/i.test(PATH)
        ? Buffer.from(PATH.split`,`[1], "base64")
        : /^https?:\/\//.test(PATH)
          ? await (res = await getBuffer(PATH))
          : fs.existsSync(PATH)
            ? ((filename = PATH), fs.readFileSync(PATH))
            : typeof PATH === "string"
              ? PATH
              : Buffer.alloc(0);
    let type = (await FileType.fromBuffer(data)) || {
      mime: "application/octet-stream",
      ext: ".bin",
    };
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data,
    };
  };
  conn.sendText = (jid, text, quoted = "", options) =>
    conn.sendMessage(
      jid,
      {
        text: text,
        ...options,
      },
      {
        quoted,
      },
    );
  conn.serializeM = (m) => smsg(conn, m, store);

  conn.sendFile = async (
    jid,
    path,
    filename = "",
    caption = "",
    quoted,
    ptt = false,
    options = {},
  ) => {
    let type = await conn.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;
    if ((res && res.status !== 200) || file.length <= 65536) {
      try {
        throw {
          json: JSON.parse(file.toString()),
        };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    const fileSize = fs.statSync(pathFile).size / 1024 / 1024;
    if (fileSize >= 1800) throw new Error(" The file size is too large\n\n");
    let opt = {};
    if (quoted) opt.quoted = quoted;
    if (!type) options.asDocument = true;
    let mtype = "",
      mimetype = options.mimetype || type.mime,
      convert;
    if (
      /webp/.test(type.mime) ||
      (/image/.test(type.mime) && options.asSticker)
    )
      mtype = "sticker";
    else if (
      /image/.test(type.mime) ||
      (/webp/.test(type.mime) && options.asImage)
    )
      mtype = "image";
    else if (/video/.test(type.mime)) mtype = "video";
    else if (/audio/.test(type.mime))
      (convert = await toAudio(file, type.ext)),
        (file = convert.data),
        (pathFile = convert.filename),
        (mtype = "audio"),
        (mimetype = options.mimetype || "audio/mpeg; codecs=mp3");
    else mtype = "document";
    if (options.asDocument) mtype = "document";
    delete options.asSticker;
    delete options.asLocation;
    delete options.asVideo;
    delete options.asDocument;
    delete options.asImage;
    let message = {
      ...options,
      caption,
      ptt,
      [mtype]: {
        url: pathFile,
      },
      mimetype,
      fileName: filename || pathFile.split("/").pop(),
    };
    let m;
    try {
      m = await conn.sendMessage(jid, message, {
        ...opt,
        ...options,
      });
    } catch (e) {
      console.error(e);
      m = null;
    } finally {
      if (!m)
        m = await conn.sendMessage(
          jid,
          {
            ...message,
            [mtype]: file,
          },
          {
            ...opt,
            ...options,
          },
        );
      file = null;
      return m;
    }
  };
  conn.sendFile = async (jid, media, options = {}) => {
    let file = await conn.getFile(media);
    let mime = file.ext,
      type;
    if (mime == "mp3") {
      type = "audio";
      options.mimetype = "audio/mpeg";
      options.ptt = options.ptt || false;
    } else if (mime == "jpg" || mime == "jpeg" || mime == "png") {
      type = "image";
    } else if (mime == "webp") {
      type = "sticker";
    } else if (mime == "mp4") {
      type = "video";
    } else {
      type = "document";
    }
    return conn.sendMessage(
      jid,
      {
        [type]: file.data,
        caption: options.caption || "",
        ...options,
      },
      {
        quoted: options.quoted || "",
        ...options,
      },
    );
  };
  conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    let mime = "";
    let res = await axios.head(url);
    mime = res.headers["content-type"];
    if (mime.split("/")[1] === "gif") {
      return conn.sendMessage(
        jid,
        {
          video: await getBuffer(url),
          caption: caption,
          gifPlayback: true,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
    let type = mime.split("/")[0] + "Message";
    if (mime === "application/pdf") {
      return conn.sendMessage(
        jid,
        {
          document: await getBuffer(url),
          mimetype: "application/pdf",
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
    if (mime.split("/")[0] === "image") {
      return conn.sendMessage(
        jid,
        {
          image: await getBuffer(url),
          caption: caption,
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
    if (mime.split("/")[0] === "video") {
      return conn.sendMessage(
        jid,
        {
          video: await getBuffer(url),
          caption: caption,
          mimetype: "video/mp4",
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
    if (mime.split("/")[0] === "audio") {
      return conn.sendMessage(
        jid,
        {
          audio: await getBuffer(url),
          caption: caption,
          mimetype: "audio/mpeg",
          ...options,
        },
        {
          quoted: quoted,
          ...options,
        },
      );
    }
  };

  return conn;
}
startsesi();

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})