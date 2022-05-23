const t = require("./tools");
const fs = require("fs");
const mysql = require("mysql");
const Sequelize = require("sequelize");
const { sql } = require("../config/config.json");
module.exports = {
  connect: function (db) {
    const con = new Sequelize(`${db}`, sql.user, sql.password, {
      dialect: "mysql",
      host: sql.ip,
      port: sql.port,
    });
    return con;
  },
  setServer: function (guildId, adminroleId, teshroleId) {
    const con = this.connect("teshdb");
    con.query(
      `INSERT INTO guild (id, adminrole, teshrole) VALUES (${guildId},${adminroleId},${teshroleId})`
    );
  },
  getServer: function (guildId, callback) {
    const con = this.connect("teshdb");
    con.query(`SELECT * FROM guild WHERE id = '${guildId}'`).then((row) => {
      let server = row[0][0];
      callback(server);
    });
  },
  updateAdminrole: function (guildId, adminrole) {
    const con = this.connect("tesh");
    con
      .query(
        `UPDATE server SET adminrole = '${adminrole}' WHERE id = '${guildId}'`
      )
      .then((row) => {
        let server = row[0][0];
        callback(server);
      });
  },
  delServer: function (serverId, rek, options) {},
  setChannels: function (server, options) {
    t.setJ(
      `./DB/${server.id}/channel.json`,
      {
        rp: [],
      },
      options
    );
    if (options === true) console.log(`db> set Channel @${server.id}`);
  },
  getChannels: function (guildId, callback) {
    const con = this.connect("teshdb");
    con
      .query(`SELECT * FROM channel WHERE guild = '${guildId}'`)
      .then((row) => {
        let channels = row[0];
        callback(channels);
      });
  },
  newChannel: function (guildId, channel, type) {
    const con = this.connect("teshdb");
    con.query(
      `INSERT INTO channel (id, guild, typdc, typth) VALUES (${channel.id},${guildId},'${channel.type}','${type}')`
    );
  },
  delChannel: function (guildId, channel) {
    const con = this.connect("teshdb");
    con.query(
      `DELETE FROM channel WHERE id = '${channel.id}' AND guild = '${guildId}';`
    );
  },
  delChannels: function (server, options) {
    t.delPath(`./DB/${server.id}/channel.json`, options);
    if (options === true) console.log(`db> del Channels @${server.id}`);
  },
  setModule: function (server, user, module, options) {
    t.setJ(
      `./DB/${server.id}/user/${user.id}/${module.id}.json`,
      module,
      options
    );
    if (options === true)
      console.log(`db> set Module ${module.id}@${user.id}@${server.id}`);
  },
  getModule: function (server, user, moduleId, options) {
    const module = t.getJ(
      `./DB/${server.id}/user/${user.id}/${moduleId}.json`,
      options
    );
    if (options === true)
      console.log(`db> get Module ${moduleId}@${user.id}@${server.id}`);
    return module;
  },
  updateModule: function (server, user, module, options) {
    t.setJ(
      `./DB/${server.id}/user/${user.id}/${module.id}.json`,
      module,
      options
    );
    module = this.getModule(server, user, module.id, options);
    if (options === true)
      console.log(`db> update Module ${module.id}@${user.id}@${server.id}`);
    return module;
  },
  delModule: function (server, user, moduleId, options) {
    t.delPath(`./DB/${server.id}/user/${user.id}/${moduleId}.json`, options);
    if (options === true)
      console.log(`db> del Module ${moduleId}@${user.id}@${server.id}`);
  },
  setModuleS: function (server, module, options) {
    t.setJ(`./DB/${server.id}/modules/${module.id}.json`, module, options);
    if (options === true)
      console.log(`db> set ModuleS ${module.id}@${server.id}`);
  },
  getModuleS: function (server, moduleId, options) {
    const module = t.getJ(
      `./DB/${server.id}/modules/${moduleId}.json`,
      options
    );
    if (options === true)
      console.log(`db> get ModuleS ${moduleId}@${server.id}`);
    return module;
  },
  updateModuleS: function (server, module, options) {
    t.setJ(`./DB/${server.id}/modules/${module.id}.json`, module, options);
    module = this.getModuleS(server, module.id, options);
    if (options === true)
      console.log(`db> update ModuleS ${module.id}@${server.id}`);
    return module;
  },
  delModuleS: function (server, moduleId, options) {
    t.delPath(`./DB/${server.id}/modules/${moduleId}.json`, options);
    if (options === true)
      console.log(`db> del ModuleS ${moduleId}@${server.id}`);
  },
  setReports: function (server, user, options) {
    t.setJ(
      `./DB/${server.id}/user/${user.id}/reports.json`,
      {
        report: [],
      },
      options
    );
    if (options === true)
      console.log(`db> set Reports @${user.id}@${server.id}`);
  },
  getReports: function (server, user, options) {
    const reports = t.getJ(
      `./DB/${server.id}/user/${user.id}/reports.json`,
      options
    );
    if (options === true)
      console.log(`db> get Reports @${user.id}@${server.id}`);
    return reports.report;
  },
  newReport: function (server, user, report, options) {
    let reports = this.getReports(server, user, options);
    reports.push(report);
    t.setJ(
      `./DB/${server.id}/user/${user.id}/reports.json`,
      {
        report: reports,
      },
      options
    );
  },
  delReport: function (server, user, report, options) {
    let reports = this.getReports(server, User, options);
    reports = t.popA(reports, report);
    t.setJ(
      `./DB/${server.id}/user/${user.id}/reports.json`,
      {
        report: reports,
      },
      options
    );
    if (options === true)
      console.log(`db> del Report ${report.id}@${user.id}@${server.id}`);
  },
  delReports: function (server, user, options) {
    t.delPath(`./DB/${server.id}/user/${user.id}/reports.json`, options);
    if (options === true)
      console.log(`db> del Reports @${user.id}@${server.id}`);
  },
  getChars: function (server, user, options) {
    let chars = [];
    const charFiles = fs
      .readdirSync(`./DB/${server.id}/modules`)
      .filter((file) => file.endsWith(".json"));
    for (const file of charFiles) {
      const char = t.getJ(
        `./DB/${server.id}/user/${user.id}/character/${file}`,
        options
      );
      chars.push(char);
    }
    if (options === true)
      console.log(`db> get ${chars.length} Chars @${user.id}@${server.id}`);
    return chars;
  },
};
