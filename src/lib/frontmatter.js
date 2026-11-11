const DATE_KEYS = new Set(["date", "updated"]);
const ORDER = ["title", "description", "date", "updated", "cover", "tags"];

export function parsePost(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, content: raw.trim() };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;

    const [, key, rawValue] = field;
    let value = rawValue.trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else if (value === "true" || value === "false") {
      value = value === "true";
    } else if (value.startsWith('"') && value.endsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch {
        value = value.slice(1, -1);
      }
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, content: raw.slice(match[0].length).trim() };
}

export function serializePost(data, content) {
  const lines = ORDER.filter((key) => {
    const value = data[key];
    return value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0);
  }).map((key) => {
    const value = data[key];

    if (Array.isArray(value)) {
      return `${key}: [${value.map((item) => JSON.stringify(String(item))).join(", ")}]`;
    }

    if (DATE_KEYS.has(key)) {
      return `${key}: ${value}`;
    }

    return `${key}: ${JSON.stringify(String(value))}`;
  });

  return `---\n${lines.join("\n")}\n---\n\n${String(content).trim()}\n`;
}
