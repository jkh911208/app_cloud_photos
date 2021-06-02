import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("cloudphotos.db", "2");

const query = async (sql, data) => {
  console.log("make sql query");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(sql, data, (tx, result) => {
        // console.log(result)
        resolve(result);
      });
    });
  });
};

const createMediaTable = async () => {
  console.log("create media table");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists media (
          local_id text UNIQUE,
          cloud_id text UNIQUE,
          width integer not null,
          height integer not null,
          uri text not null,
          thumbnail_uri text not null,
          creationTime datetime not null,
          md5 text primary key not null UNIQUE
      );`,
        [],
        (tx, result) => {
          // console.log(result)
          resolve(null);
        }
      );
    });
  });
};

const createMD5Index = () => {
  console.log("create md5 index");
  db.exec(
    [
      {
        sql: `CREATE UNIQUE INDEX if not exists md5_index on media (md5);`,
        args: [],
      },
    ],
    false,
    (error, result) => {
      // console.log("createMD5Index error", error);
      // console.log("createMD5Index result", result);
    }
  );
};

const createCreationTimeIndex = () => {
  console.log("create creationtime index");
  db.exec(
    [
      {
        sql: `CREATE INDEX if not exists creationtime on media (creationTime);`,
        args: [],
      },
    ],
    false,
    (error, result) => {
      // console.log("createMD5Index error", error);
      // console.log("createMD5Index result", result);
    }
  );
};

const dropMediaTable = () => {
  console.log("drop media table");
  db.exec(
    [
      {
        sql: `drop table media;`,
        args: [],
      },
    ],
    false,
    (error, result) => {
      console.log("dropMediaTable error", error);
      console.log("dropMediaTable result", result);
    }
  );
};

const insertMedia = (
  local_id,
  cloud_id,
  width,
  height,
  uri,
  thumbnail_uri,
  creationTime,
  md5
) => {
  // console.log("insert data to media table");
  db.exec(
    [
      {
        sql: `insert into media 
            ( local_id, cloud_id, width, height, uri, thumbnail_uri, creationTime, md5) 
            values (?,?,?,?,?,?,?,?);`,
        args: [
          local_id,
          cloud_id,
          width,
          height,
          uri,
          thumbnail_uri,
          creationTime,
          md5,
        ],
      },
    ],
    false,
    (error, result) => {
      // console.log("insertMedia error", error);
      // console.log("insertMedia result", result);
    }
  );
};

const getMedia = async (time) => {
  console.log("get Media");
  const sqlQuery = "SELECT * FROM media WHERE creationTime < ? order by creationTime desc limit 100"
  const result = await query(sqlQuery, [time])
  // console.log(result)
  return result.rows._array
};

const updateCloudID = async (md5, cloud_id) => {
  // console.log(local_id, cloud_id);
  db.exec(
    [
      {
        sql: `UPDATE media
        SET cloud_id = ?
        WHERE md5 = ?;`,
        args: [cloud_id, md5],
      },
    ],
    false,
    (error, result) => {
      console.log("updateCloudID error", error);
      console.log("updateCloudID result", result);
    }
  );
};

const truncateMediaTable = async () => {
  console.log("drop media table");
  db.exec(
    [
      {
        sql: `DELETE FROM media;`,
        args: [],
      },
    ],
    false,
    (error, result) => {
      // console.log("truncateMediaTable error", error);
      // console.log("truncateMediaTable result", result);
    }
  );
};

const getBackupFinished = (setFunction) => {
  console.log("getBackupFinished");
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM media where cloud_id is not null and local_id is not null order by creationTime desc",
      [],
      (tx, results) => {
        // console.log(results);
        setFunction(results.rows._array);
      }
    );
  });
};

const getNeedBackup = (setFunction) => {
  console.log("getBackupFinished");
  const sevenDaysAgo = Date.now() - 604800000;
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM media where cloud_id is null and local_id is not null AND creationTime > ? order by creationTime desc",
      [sevenDaysAgo],
      (tx, results) => {
        // console.log(results);
        setFunction(results.rows._array);
      }
    );
  });
};

const getLoadedFromCloud = (setFunction) => {
  console.log("getBackupFinished");
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM media where cloud_id is not null and local_id is null order by creationTime desc",
      [],
      (tx, results) => {
        // console.log(results);
        setFunction(results.rows._array);
      }
    );
  });
};

export {
  db,
  getMedia,
  createMediaTable,
  dropMediaTable,
  insertMedia,
  updateCloudID,
  truncateMediaTable,
  createMD5Index,
  createCreationTimeIndex,
  getBackupFinished,
  getNeedBackup,
  getLoadedFromCloud,
};
