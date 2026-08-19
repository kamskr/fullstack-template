import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";

const FRONT_MATTER_DELIMITER = "---";

export async function findMarkdownFiles(docsDirectory) {
  const files = [];

  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;

      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(path);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        files.push(path);
      }
    }
  }

  await walk(docsDirectory);
  return files;
}

export async function readDocument(path) {
  const source = await readFile(path, "utf8");
  return { path, source, metadata: parseFrontMatter(source) };
}

export function parseFrontMatter(source) {
  const lines = source.replace(/^\uFEFF/, "").split(/\r?\n/u);
  const errors = [];

  if (lines[0] !== FRONT_MATTER_DELIMITER) {
    return {
      summary: null,
      readWhen: [],
      errors: ["missing YAML frontmatter"],
    };
  }

  const closingLine = lines.findIndex(
    (line, index) => index > 0 && line === FRONT_MATTER_DELIMITER,
  );
  if (closingLine === -1) {
    return {
      summary: null,
      readWhen: [],
      errors: ["unterminated YAML frontmatter"],
    };
  }

  const frontMatterLines = lines.slice(1, closingLine);
  const fields = collectTopLevelFields(frontMatterLines);
  const summaryFields = fields.filter((field) => field.name === "summary");
  const readWhenFields = fields.filter((field) => field.name === "read_when");

  if (summaryFields.length === 0) errors.push("frontmatter requires summary");
  if (summaryFields.length > 1)
    errors.push("frontmatter has duplicate summary");
  if (readWhenFields.length === 0)
    errors.push("frontmatter requires read_when");
  if (readWhenFields.length > 1)
    errors.push("frontmatter has duplicate read_when");

  const summary = summaryFields[0]
    ? parseScalar(summaryFields[0].inlineValue)
    : null;
  if (summaryFields[0] && !summary) {
    errors.push("frontmatter summary must be a non-empty single-line value");
  }

  const readWhen = readWhenFields[0]
    ? parseSequence(readWhenFields[0], errors)
    : [];
  if (readWhenFields[0] && readWhen.length === 0) {
    errors.push("frontmatter read_when must contain at least one item");
  }

  return { summary, readWhen, errors };
}

function collectTopLevelFields(lines) {
  const fields = [];
  let currentField = null;

  for (const rawLine of lines) {
    const match = rawLine.match(/^([A-Za-z_][A-Za-z0-9_-]*):(?:\s*(.*))?$/u);
    if (match) {
      currentField = {
        name: match[1],
        inlineValue: match[2] ?? "",
        childLines: [],
      };
      fields.push(currentField);
      continue;
    }

    if (currentField) currentField.childLines.push(rawLine);
  }

  return fields;
}

function parseScalar(rawValue) {
  const value = stripYamlComment(rawValue.trim());
  if (
    !value ||
    value === "|" ||
    value === ">" ||
    /^(?:null|~)$/iu.test(value)
  ) {
    return null;
  }

  if (value.startsWith('"') || value.endsWith('"')) {
    if (!value.startsWith('"') || !value.endsWith('"')) return null;
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "string" && parsed.trim() ? parsed.trim() : null;
    } catch {
      return null;
    }
  }

  if (value.startsWith("'") || value.endsWith("'")) {
    if (!value.startsWith("'") || !value.endsWith("'")) return null;
    const parsed = value.slice(1, -1).replaceAll("''", "'").trim();
    return parsed || null;
  }

  return value.trim() || null;
}

function parseSequence(field, errors) {
  const inlineValue = stripYamlComment(field.inlineValue.trim());
  if (inlineValue) {
    if (!inlineValue.startsWith("[") || !inlineValue.endsWith("]")) {
      errors.push("frontmatter read_when must be a YAML sequence");
      return [];
    }

    const items = splitInlineSequence(inlineValue.slice(1, -1));
    const values = items.map(parseScalar);
    if (items.some((item) => !item) || values.some((value) => !value)) {
      errors.push("frontmatter read_when contains a malformed item");
    }
    return values.filter(Boolean);
  }

  const values = [];
  let malformed = false;
  for (const rawLine of field.childLines) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;

    const item = rawLine.match(/^\s+-\s+(.+)$/u);
    if (!item) {
      malformed = true;
      continue;
    }

    const parsed = parseScalar(item[1]);
    if (parsed) values.push(parsed);
  }

  if (malformed) errors.push("frontmatter read_when contains a malformed item");
  return values;
}

function splitInlineSequence(value) {
  const items = [];
  let current = "";
  let quote = null;
  let escaped = false;

  for (const character of value) {
    if (escaped) {
      current += character;
      escaped = false;
      continue;
    }
    if (character === "\\" && quote === '"') {
      current += character;
      escaped = true;
      continue;
    }
    if ((character === '"' || character === "'") && !quote) {
      quote = character;
      current += character;
      continue;
    }
    if (character === quote) {
      quote = null;
      current += character;
      continue;
    }
    if (character === "," && !quote) {
      items.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }

  if (current.trim()) items.push(current.trim());
  return items;
}

function stripYamlComment(value) {
  let quote = null;
  let escaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === "\\" && quote === '"') {
      escaped = true;
      continue;
    }
    if ((character === '"' || character === "'") && !quote) {
      quote = character;
      continue;
    }
    if (character === quote) {
      quote = null;
      continue;
    }
    if (
      character === "#" &&
      !quote &&
      (index === 0 || /\s/u.test(value[index - 1]))
    ) {
      return value.slice(0, index).trimEnd();
    }
  }

  return value;
}

export function findMarkdownLinkTargets(source) {
  const targets = [];
  const lines = source.split(/\r?\n/u);
  let fence = null;
  let inHtmlComment = false;

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const fenceMatch = rawLine.match(/^\s{0,3}(`{3,}|~{3,})/u);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!fence) fence = { character: marker[0], length: marker.length };
      else if (marker[0] === fence.character && marker.length >= fence.length)
        fence = null;
      continue;
    }
    if (fence) continue;

    const lineWithoutComments = removeHtmlComments(rawLine, {
      get value() {
        return inHtmlComment;
      },
      set value(nextValue) {
        inHtmlComment = nextValue;
      },
    });
    const line = removeInlineCode(lineWithoutComments);
    const lineNumber = index + 1;

    const reference = line.match(/^\s{0,3}\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/u);
    if (reference) {
      targets.push({ line: lineNumber, target: reference[1] ?? reference[2] });
    }

    let cursor = 0;
    while (cursor < line.length) {
      const marker = line.indexOf("](", cursor);
      if (marker === -1) break;
      const openingBracket = line.lastIndexOf("[", marker);
      if (openingBracket === -1 || isEscaped(line, openingBracket)) {
        cursor = marker + 2;
        continue;
      }

      const destination = parseInlineDestination(line, marker + 2);
      if (destination) {
        targets.push({ line: lineNumber, target: destination.target });
        cursor = destination.end;
      } else {
        cursor = marker + 2;
      }
    }
  }

  return targets;
}

function isEscaped(value, index) {
  let backslashes = 0;
  for (
    let cursor = index - 1;
    cursor >= 0 && value[cursor] === "\\";
    cursor -= 1
  ) {
    backslashes += 1;
  }
  return backslashes % 2 === 1;
}

function removeHtmlComments(line, state) {
  let result = "";
  let cursor = 0;

  while (cursor < line.length) {
    if (state.value) {
      const end = line.indexOf("-->", cursor);
      if (end === -1) return result;
      state.value = false;
      cursor = end + 3;
      continue;
    }

    const start = line.indexOf("<!--", cursor);
    if (start === -1) return result + line.slice(cursor);
    result += line.slice(cursor, start);
    state.value = true;
    cursor = start + 4;
  }

  return result;
}

function removeInlineCode(line) {
  let result = "";
  let cursor = 0;

  while (cursor < line.length) {
    if (line[cursor] !== "`") {
      result += line[cursor];
      cursor += 1;
      continue;
    }

    let runLength = 1;
    while (line[cursor + runLength] === "`") runLength += 1;
    const delimiter = "`".repeat(runLength);
    const end = line.indexOf(delimiter, cursor + runLength);
    if (end === -1) {
      result += line.slice(cursor);
      break;
    }
    result += " ".repeat(end + runLength - cursor);
    cursor = end + runLength;
  }

  return result;
}

function parseInlineDestination(line, start) {
  let cursor = start;
  while (/\s/u.test(line[cursor] ?? "")) cursor += 1;

  if (line[cursor] === ")") return { target: "", end: cursor + 1 };
  if (line[cursor] === "<") {
    const end = line.indexOf(">", cursor + 1);
    if (end === -1) return null;
    return { target: line.slice(cursor + 1, end), end: end + 1 };
  }

  let target = "";
  let nestedParentheses = 0;
  let escaped = false;
  for (; cursor < line.length; cursor += 1) {
    const character = line[cursor];
    if (escaped) {
      target += character;
      escaped = false;
      continue;
    }
    if (character === "\\") {
      escaped = true;
      continue;
    }
    if (character === "(") {
      nestedParentheses += 1;
      target += character;
      continue;
    }
    if (character === ")") {
      if (nestedParentheses === 0) return { target, end: cursor + 1 };
      nestedParentheses -= 1;
      target += character;
      continue;
    }
    if (/\s/u.test(character)) return { target, end: cursor };
    target += character;
  }

  return null;
}

export async function validateLinkTarget({ documentPath, repoRoot, target }) {
  const trimmedTarget = target.trim();
  if (!trimmedTarget) return "link target is empty";
  if (trimmedTarget.startsWith("#")) return null;
  if (trimmedTarget.startsWith("//")) return null;
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(trimmedTarget)) return null;

  const pathWithoutSuffix = trimmedTarget.split(/[?#]/u, 1)[0];
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathWithoutSuffix).replaceAll("\\", sep);
  } catch {
    return `link target has invalid percent-encoding: ${trimmedTarget}`;
  }
  if (!decodedPath) return null;

  const resolvedPath = decodedPath.startsWith("/")
    ? resolve(repoRoot, `.${decodedPath}`)
    : resolve(dirname(documentPath), decodedPath);
  const relativePath = relative(repoRoot, resolvedPath);
  if (relativePath === ".." || relativePath.startsWith(`..${sep}`)) {
    return `link target escapes the repository: ${trimmedTarget}`;
  }

  try {
    await stat(resolvedPath);
    return null;
  } catch (error) {
    if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
      return `link target does not exist: ${trimmedTarget}`;
    }
    throw error;
  }
}
