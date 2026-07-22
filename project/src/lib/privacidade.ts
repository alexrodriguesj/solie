import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

const CONTENT_PATH = path.join(process.cwd(), "src/content/privacidade.md");

/**
 * Renderiza a política de privacidade a partir de src/content/privacidade.md.
 * Mesmo pipeline de markdown do blog (remark + gfm + html), para que a copy
 * possa ser editada no arquivo de conteúdo sem tocar na lógica da página.
 */
export async function getPrivacidadeHtml(): Promise<string> {
  const markdown = fs.readFileSync(CONTENT_PATH, "utf-8");
  const result = await remark().use(gfm).use(html, { sanitize: false }).process(markdown);
  return result.toString();
}
