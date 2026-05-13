from __future__ import annotations

import html
import pathlib
import sys


def flush_paragraph(buffer: list[str], parts: list[str]) -> None:
    if not buffer:
        return
    text = " ".join(line.strip() for line in buffer if line.strip())
    if text:
        parts.append(f"<p>{html.escape(text)}</p>")
    buffer.clear()


def flush_list(items: list[str], parts: list[str]) -> None:
    if not items:
        return
    body = "".join(f"<li>{html.escape(item)}</li>" for item in items)
    parts.append(f"<ul>{body}</ul>")
    items.clear()


def render_markdown(markdown_text: str, title: str) -> str:
    parts: list[str] = []
    paragraph_buffer: list[str] = []
    list_buffer: list[str] = []
    code_buffer: list[str] = []
    in_code_block = False

    for raw_line in markdown_text.splitlines():
        line = raw_line.rstrip("\n")

        if line.startswith("```"):
            flush_paragraph(paragraph_buffer, parts)
            flush_list(list_buffer, parts)
            if in_code_block:
                code_html = html.escape("\n".join(code_buffer))
                parts.append(f"<pre><code>{code_html}</code></pre>")
                code_buffer.clear()
                in_code_block = False
            else:
                in_code_block = True
            continue

        if in_code_block:
            code_buffer.append(line)
            continue

        stripped = line.strip()
        if not stripped:
            flush_paragraph(paragraph_buffer, parts)
            flush_list(list_buffer, parts)
            continue

        if stripped.startswith("#"):
            flush_paragraph(paragraph_buffer, parts)
            flush_list(list_buffer, parts)
            level = min(len(stripped) - len(stripped.lstrip("#")), 6)
            content = stripped[level:].strip()
            parts.append(f"<h{level}>{html.escape(content)}</h{level}>")
            continue

        if stripped.startswith("- "):
            flush_paragraph(paragraph_buffer, parts)
            list_buffer.append(stripped[2:].strip())
            continue

        flush_list(list_buffer, parts)
        paragraph_buffer.append(stripped)

    flush_paragraph(paragraph_buffer, parts)
    flush_list(list_buffer, parts)

    body = "\n".join(parts)
    return f"""<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>{html.escape(title)}</title>
    <style>
      :root {{
        color-scheme: light;
      }}
      body {{
        margin: 0;
        padding: 40px 48px;
        font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        color: #0f172a;
        background: #ffffff;
        line-height: 1.75;
        font-size: 14px;
      }}
      h1, h2, h3, h4 {{
        font-weight: 700;
        line-height: 1.3;
        margin-top: 1.6em;
        margin-bottom: 0.6em;
        color: #020617;
      }}
      h1 {{
        font-size: 28px;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 12px;
      }}
      h2 {{
        font-size: 22px;
      }}
      h3 {{
        font-size: 18px;
      }}
      p {{
        margin: 0.6em 0;
      }}
      ul {{
        margin: 0.6em 0 0.8em 1.25em;
        padding: 0;
      }}
      li {{
        margin: 0.25em 0;
      }}
      pre {{
        background: #0f172a;
        color: #e2e8f0;
        padding: 16px;
        border-radius: 12px;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: "Cascadia Code", "Consolas", monospace;
        font-size: 12px;
      }}
      code {{
        font-family: "Cascadia Code", "Consolas", monospace;
      }}
    </style>
  </head>
  <body>
    {body}
  </body>
</html>
"""


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python render_markdown_to_html.py <input.md> <output.html>")
        return 1

    source = pathlib.Path(sys.argv[1])
    target = pathlib.Path(sys.argv[2])
    markdown_text = source.read_text(encoding="utf-8")
    html_text = render_markdown(markdown_text, source.stem)
    target.write_text(html_text, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
