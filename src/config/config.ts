const config = {
	url: "http://localhost:8990/",
	oracle: {
		host: "192.168.2.38", //109.107.238.68
		connectString:
			"(DESCRIPTION=(ADDRESS=(PROTOCOL = TCP)(HOST = 192.168.2.38)(PORT = 1521))(CONNECT_DATA=(SERVER = DEDICATED)(SERVICE_NAME = orcl12cr2)))",
		port: 1521,
		username: "ncsi_epublications",
		password: "ncsi_epublications",
		database: "orcl12cr2",
	},
	redisConfig: [
		{
			host: "127.0.0.1",
			port: 6379,
			db: 0,
		},
	],
};

export { config };
