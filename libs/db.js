const t = require("./tools");
const fs = require("fs");
module.exports = {
  setServer: function (guild, options) {
    const obj = {
      id: guild.id,
    };
    t.setJ(`./DB/${obj.id}/server.json`, obj);
    if (options === true)
      console.log(`db> set guild ${guild.name} (${obj.id})`);
  },
  getServer: function (guildId, options) {
    const server = t.getJ(`./DB/${guildId}/server.json`, options);
    if (options === true) console.log(`db> get guild ${server.id}`);
    return server;
  },
  updateServer: function (server, options) {
    t.setJ(`./DB/${server.id}/server.json`, server, options);
    if (options === true) console.log(`db> update guild ${server.id}`);
    return this.getServer(server.id, options);
  },
  delServer: function (serverId, rek, options) {
    let path;
    if (rek) {
      path = `./DB/${serverId}/`;
    } else {
      path = `./DB/${serverId}/server.json`;
    }
    t.delPath(path, options);
    if (options === true) console.log(`db> del Server ${serverId}`);
  },
  setUser: function (server, user, options) {
    const obj = {
      id: user.id,
    };
    t.setJ(`./DB/${server.id}/user/${user.id}/user.json`, obj, options);
    this.setReports(server, obj, options);
    if (options === true)
      console.log(`db> set User ${user.tag} (${obj.id})@${server.id},`);
  },
  getUser: function (server, userId, options) {
    const user = t.getJ(`./DB/${server.id}/user/${userId}/user.json`, options);
    if (options === true) console.log(`db> get User ${userId}@${server.id}`);
    return user;
  },
  updateUser: function (server, user, options) {
    t.setJ(`./DB/${server.id}/user/${user.id}/user.json`, user, options);
    if (options === true)
      console.log(`db> update User ${user.id}@${server.id}`);
    return this.getUser(server, user.id, options);
  },
  delUser: function (serverId, userId, rek, options) {
    let path;
    if (rek) {
      path = `./DB/${serverId}/user/`;
    } else {
      path = `./DB/${serverId}/user/${userId}/user.json`;
    }
    t.delPath(path, options);
    if (options === true) console.log(`db> del User ${userId}@${serverId}`);
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
  getChannels: function (server, options) {
    const channels = t.getJ(`./DB/${server.id}/channel.json`, options);
    if (options === true) console.log(`db> get Channel @${server.id}`);
    return channels.rp;
  },
  newChannel: function (server, channel, options) {
    let rp = this.getChannels(server, options);
    rp.push(channel.id);
    const channels = {
      rp: rp,
    };
    t.setJ(`./DB/${server.id}/channel.json`, channels, options);
    if (options === true)
      console.log(
        `db> add Channel ${channel.name}(${channel.id})@${server.id}`
      );
  },
  delChannel: function (server, channel, options) {
    const rp = this.getChannels(server, options);
    const channels = {
      rp: t.popA(rp, channel.id),
    };
    t.setJ(`./DB/${server.id}/channel.json`, channels, options);
    if (options === true)
      console.log(
        `db> del Channel ${channel.name}(${channel.id})@${server.id}`
      );
  },
  delChannels: function (server, options) {
    t.delPath(`./DB/${server.id}/channel.json`, options);
    if (options === true) console.log(`db> del Channels @${server.id}`);
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
