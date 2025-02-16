class DataMapper {
	public mapObject<T>(dist: T, source) {
		if (!source || typeof source != "object") return;
		Object.keys(source).forEach((key) => {
			if (Array.isArray(source[key])) dist[key] = [...source[key]];
			else if (typeof source[key] === "object") {
				this.mapObject(dist[key], source[key]);
			} else {
				if(!source[key] && source[key] !== 0) dist[key] = null;
				else if (isNaN(+source[key])) dist[key] = source[key];
				else dist[key] = +source[key];
			}
		});
	}
	public mapObjectShallow<T>(dist: T, source) {
		if (!source || typeof source != "object") return;
		Object.keys(source).forEach((key) => {
			if (dist.hasOwnProperty(key)) {
				if (!source[key] && source[key] !== 0) dist[key] = null;
				else if (isNaN(+source[key])) dist[key] = source[key];
				else dist[key] = +source[key];
			}
		});
	}
}

const dataMapper = new DataMapper();
export default dataMapper;
