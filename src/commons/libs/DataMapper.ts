class DataMapper {
  public mapObject<T extends Record<string, any>>(
    dist: T,
    source: Partial<T>
  ): void {
    if (!source || typeof source !== "object") return;

    for (const [key, value] of Object.entries(source)) {
      if (Array.isArray(value)) {
        (dist as Record<string, any>)[key] = [...value];
      } else if (value && typeof value === "object") {
        if (!dist[key] || typeof dist[key] !== "object") {
          (dist as Record<string, any>)[key] = {};
        }
        this.mapObject((dist as Record<string, any>)[key], value);
      } else {
        (dist as Record<string, any>)[key] = value ?? null;
      }
    }
  }

  public mapObjectShallow<T extends Record<string, any>>(
    dist: T,
    source: Partial<T>
  ): void {
    if (!source || typeof source !== "object") return;

    for (const [key, value] of Object.entries(source)) {
      if (Object.prototype.hasOwnProperty.call(dist, key)) {
        (dist as Record<string, any>)[key] = value ?? null;
      }
    }
  }
}

const dataMapper = new DataMapper();
export default dataMapper;
