import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "The Vesta System",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f4efe2",        // parchment
          lightgray: "#e6dcc6",    // aged paper shadow
          gray: "#c9bfa8",         // faded parchment edge
          darkgray: "#5a4a3b",     // brown ink
          dark: "#2e241c",         // near-black brown ink
          secondary: "#7a1f1f",    // deep crimson (chapter headings)
          tertiary: "#b0893b",     // antique gold
          highlight: "rgba(122, 31, 31, 0.08)", // subtle red wash
          textHighlight: "#d4af37aa", // gold text highlight
        },
        darkMode: {
          light: "#f4efe2",        // parchment
          lightgray: "#e6dcc6",    // aged paper shadow
          gray: "#c9bfa8",         // faded parchment edge
          darkgray: "#5a4a3b",     // brown ink
          dark: "#2e241c",         // near-black brown ink
          secondary: "#7a1f1f",    // deep crimson (chapter headings)
          tertiary: "#b0893b",     // antique gold
          highlight: "rgba(122, 31, 31, 0.08)", // subtle red wash
          textHighlight: "#d4af37aa", // gold text highlight
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
